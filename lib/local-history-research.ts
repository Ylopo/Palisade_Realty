import Anthropic from '@anthropic-ai/sdk'
import type { IdeaCandidate, RawArticle, IdeaAudience } from '@/lib/types'
import { isDisqualified, sourceTypeLabel, sourceCredibilityScore } from '@/lib/source-rules'
import { computeTimeliness, computeNovelty, assembleScore } from '@/lib/scoring'
import { buildWeekId } from '@/lib/idea-store'

/**
 * Local-history story scout.
 *
 * Runs alongside the news-driven idea engine (lib/research.ts) and feeds the
 * same review queue, but hunts for evergreen "I had no idea that happened
 * here" neighborhood-history stories instead of current events. Every idea it
 * produces carries category 'local-history' plus a structured story brief in
 * researchData (surprising detail, what remains today, video concept,
 * verification status) that the writer and video pipeline ground in.
 */

// ─── Search rotation ──────────────────────────────────────────────────────────

// Deliberately weighted toward communities that get less media coverage —
// Downtown / La Jolla / Coronado / Gaslamp are capped to a few entries so the
// rotation doesn't keep landing on them.
const NEIGHBORHOODS = [
  'North Park San Diego', 'Point Loma', 'Chula Vista', 'Carmel Valley San Diego',
  'Mission Valley San Diego', 'Ocean Beach San Diego', 'Pacific Beach San Diego',
  'Barrio Logan', 'Old Town San Diego', 'Kensington San Diego', 'Hillcrest San Diego',
  'Clairemont San Diego', 'Linda Vista San Diego', 'City Heights San Diego',
  'Encanto San Diego', 'Logan Heights', 'La Mesa California', 'El Cajon',
  'National City California', 'Imperial Beach', 'Lemon Grove California',
  'Santee California', 'Poway', 'Escondido', 'Oceanside California',
  'Carlsbad California', 'Encinitas', 'Del Mar California', 'Bonita California',
  'Coronado', 'La Jolla', 'Downtown San Diego',
]

// The 17 story categories from the editorial brief, phrased as search angles.
const STORY_ANGLES = [
  'before it was a neighborhood farm ranch orchard history',
  'then and now transformation what used to stand here',
  'neighborhood name origin how it got its name history',
  'street name origin who was it named after',
  'forgotten industry cannery shipyard aviation railroad history',
  'lost landmark demolished hotel theater amusement park history',
  'landmark statue monument building story behind',
  'founder developer architect person who shaped history',
  'streetcar railroad highway ferry changed the neighborhood history',
  'military base wartime housing community growth history',
  'historic homes bungalow Victorian subdivision architecture history',
  'river marsh wetland canyon filled rerouted flood history',
  'local legend mystery controversy preservation fight history',
  'abandoned plan proposed freeway development never built history',
  'historic event site now shopping center park school history',
  'immigrant community cultural district traditions history',
  'how the community became desirable growth story history',
]

// Every run also checks the region's dedicated history archives.
const PINNED_QUERIES = [
  'San Diego History Center journal neighborhood history article',
  'San Diego county historical society forgotten story landmark',
]

// 5 rotating queries per day: angle and neighborhood rotate on different
// strides so pairings don't repeat until the full cross-product cycles.
function getQueriesForToday(): string[] {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  const queries: string[] = []
  for (let i = 0; i < 5; i++) {
    const angle = STORY_ANGLES[(dayOfYear * 5 + i) % STORY_ANGLES.length]
    const hood = NEIGHBORHOODS[(dayOfYear * 3 + i * 7) % NEIGHBORHOODS.length]
    queries.push(`${hood} ${angle}`)
  }
  return [...PINNED_QUERIES, ...queries]
}

// ─── Fetch raw source material ────────────────────────────────────────────────

async function fetchHistorySources(): Promise<RawArticle[]> {
  const tavilyApiKey = process.env.TAVILY_API_KEY
  if (!tavilyApiKey) throw new Error('TAVILY_API_KEY is not set')

  const rawArticles: RawArticle[] = []
  const seenUrls = new Set<string>()

  for (const query of getQueriesForToday()) {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tavilyApiKey}`,
        },
        body: JSON.stringify({
          query,
          search_depth: 'basic',
          max_results: 6,
          include_answer: false,
        }),
      })
      if (!res.ok) continue
      const data = await res.json()
      for (const result of data.results ?? []) {
        if (!seenUrls.has(result.url)) {
          seenUrls.add(result.url)
          rawArticles.push({
            id: `hist_${rawArticles.length}`,
            title: result.title,
            url: result.url,
            content: result.content ?? '',
            publishedDate: result.published_date,
            source: new URL(result.url).hostname.replace('www.', ''),
          })
        }
      }
    } catch {
      // Skip failed queries silently
    }
  }

  return rawArticles
}

// ─── Story scout (Claude) ─────────────────────────────────────────────────────

interface ScoutStory {
  headline: string
  location: string
  storySummary: string
  surprisingDetail: string
  whyResidentsCare: string
  whatRemains: string
  realEstateConnection: string
  videoConcept: {
    hook: string
    talkingPoints: string[]
    tease: string
    invitation: string
  }
  visualOpportunities: string
  sourceIndexes: number[]
  verificationStatus: string
  contentType: string
  targetKeyword: string
  rubricTotal: number       // 0–100, sum of the 10 editorial criteria
  queueDims: {
    localRelevance: number  // 0–25
    formatFit: number       // 0–15
    audienceValue: number   // 0–15
    seoPotential: number    // 0–5
  }
}

const RUBRIC_MINIMUM = 75
const MAX_IDEAS_PER_RUN = 4

function buildScoutPrompt(articleList: string): string {
  return `You are a local-history researcher and editorial story scout for a San Diego real estate professional (Hedda Parashos, Palisade Realty). Your job is to uncover fascinating, surprising, highly local stories about San Diego's neighborhoods, communities, streets, landmarks, buildings, industries, and people. These become educational blog articles and one-minute social videos.

The content must be informative and entertaining — NOT promotional. Hedda appears as a knowledgeable local guide, never as a salesperson. No sales pitches, listing promotions, or "contact a real estate agent" language.

PRIMARY OBJECTIVE — find stories that make San Diego residents say:
"I had no idea that happened here." / "I drive past that all the time and never knew the story." / "So that's how this street got its name." / "I need to send this to someone who lives there."
Prioritize strong transformations, mysteries, surprising origins, forgotten landmarks, famous people, unusual industries, local controversies, and visible past-to-present connections.

GEOGRAPHIC COVERAGE: all of San Diego County. Avoid over-covering Downtown, La Jolla, Coronado, and the Gaslamp Quarter — favor communities that receive less media coverage.

STORY CATEGORIES: before-the-neighborhood origins; then-and-now transformations; neighborhood and street name origins; forgotten industries; lost landmarks; landmarks people see but don't understand; people who shaped San Diego; transportation that changed a community; military history and community growth; architecture and housing history; natural features and altered landscapes; documented legends, mysteries, and controversies; communities that almost looked completely different; historic events at everyday places; cultural and immigration history (treated accurately and respectfully); how a community became desirable.

ACCURACY REQUIREMENTS (non-negotiable):
- Ground every story ONLY in the source articles below. Never invent quotations, dates, people, buildings, or events.
- Cite the supporting sources by index. Prefer archives, historical societies, government, universities, museums, and established local publications.
- Never present folklore as confirmed history — label it.
- A story must be a SPECIFIC story (a particular transformation, person, building, event, or mystery), not a broad subject like "The History of North Park".

EDITORIAL SELECTION: score each candidate 1–10 on: surprise factor, human story, local relevance, visual potential, short-form video hook, source availability, then-vs-now contrast, visible-today connection, shareability, and ability to support a substantive article. Sum them as rubricTotal (max 100). Only include stories scoring at least ${RUBRIC_MINIMUM}.

FAIR HOUSING: never rank neighborhoods by the "type of people" who live there, discuss protected classes, make investment predictions, or promise appreciation. Real-estate connections must be educational and factual (street patterns, architecture, lot sizes, land use, preservation, community identity) — omit the connection if it would feel forced.

VIDEO: each story must support a 45–60 second teaser that opens with the most surprising fact or question, names the neighborhood/landmark immediately, reveals enough to satisfy, holds back 1–2 fascinating details to drive readers to the article, sounds like a curious local (not a lecture or ad), and ends with a curiosity-based invitation to read the full story. Write a FRESH hook per story — don't reuse stock openers.

SOURCE ARTICLES:
${articleList}

Return ONLY a valid JSON array (no markdown) of your best story recommendations (at most 6). Each element:
{
  "headline": string,             // specific, curiosity-driven blog headline
  "location": string,             // exact community, street, or landmark
  "storySummary": string,         // 100-150 words: the central story and why it's interesting
  "surprisingDetail": string,     // the single fact most likely to stop someone scrolling
  "whyResidentsCare": string,
  "whatRemains": string,          // what can still be seen or visited today
  "realEstateConnection": string, // factual, educational; "" if it would feel forced
  "videoConcept": {"hook": string, "talkingPoints": [string, string, string], "tease": string, "invitation": string},
  "visualOpportunities": string,  // historical photos, maps, aerials, present-day B-roll; note licensing concerns
  "sourceIndexes": number[],      // indexes of the supporting SOURCE ARTICLES (at least 1)
  "verificationStatus": "strongly-verified" | "verified-minor-uncertainty" | "requires-additional-verification" | "folklore-or-disputed",
  "contentType": string,          // e.g. "Local History" | "Notable Figure" | "Lost Landmark" | "Name Origin" | "Then and Now" | "Local Legend"
  "targetKeyword": string,        // e.g. "ocean beach san diego history"
  "rubricTotal": number,          // 0-100 per the editorial selection criteria
  "queueDims": {"localRelevance": number, "formatFit": number, "audienceValue": number, "seoPotential": number}  // 0-25 / 0-15 / 0-15 / 0-5
}`
}

function buildStoryBrief(story: ScoutStory, sources: RawArticle[]): string {
  const lines = [
    'LOCAL HISTORY STORY BRIEF — ground the post ONLY in these researched facts and the cited sources. Never invent dates, names, quotes, or events.',
    `Location: ${story.location}`,
    `Story summary: ${story.storySummary}`,
    `The surprising detail (lead with this): ${story.surprisingDetail}`,
    `Why residents care: ${story.whyResidentsCare}`,
    `What remains today: ${story.whatRemains}`,
  ]
  if (story.realEstateConnection) {
    lines.push(`Present-day community/real-estate connection (educational, factual): ${story.realEstateConnection}`)
  }
  lines.push(
    `Verification status: ${story.verificationStatus} — if not strongly verified, attribute claims to sources and clearly separate documented fact from folklore.`,
    `Visual opportunities: ${story.visualOpportunities}`,
    'One-minute video concept:',
    `- Hook: ${story.videoConcept.hook}`,
    ...story.videoConcept.talkingPoints.map((t) => `- Talking point: ${t}`),
    `- Tease (hold back in the video, reveal in the article): ${story.videoConcept.tease}`,
    `- Invitation: ${story.videoConcept.invitation}`,
    '',
    'SOURCE EXCERPTS:',
    ...sources.map((s) => `[${s.source}] ${s.title} — ${s.content.slice(0, 500)}`),
  )
  return lines.join('\n').slice(0, 6000)
}

export async function fetchLocalHistoryIdeas(coveredTopics: Set<string>): Promise<IdeaCandidate[]> {
  const rawArticles = await fetchHistorySources()
  if (rawArticles.length === 0) return []

  const filtered = rawArticles.filter((a) => {
    const domain = new URL(a.url).hostname.replace('www.', '')
    return !isDisqualified(domain)
  })
  if (filtered.length === 0) return []

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const weekId = buildWeekId()

  const articleList = filtered
    .slice(0, 30)
    .map((a, i) => `[${i}] TITLE: ${a.title}\nURL: ${a.url}\nSNIPPET: ${a.content.slice(0, 400)}\nSOURCE: ${a.source ?? ''}`)
    .join('\n\n')

  // claude-opus-5 thinks by default; max_tokens must cover thinking + the
  // JSON array, so keep it generous.
  const response = await anthropic.messages.create({
    model: 'claude-opus-5',
    max_tokens: 16000,
    messages: [{ role: 'user', content: buildScoutPrompt(articleList) }],
  })

  const text = response.content.find((b) => b.type === 'text')?.text ?? ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return []

  const stories: ScoutStory[] = JSON.parse(jsonMatch[0])

  const ideas: IdeaCandidate[] = []

  for (const story of stories) {
    if (!story?.headline || story.rubricTotal < RUBRIC_MINIMUM) continue

    const sources = (story.sourceIndexes ?? [])
      .map((i) => filtered[i])
      .filter(Boolean)
    if (sources.length === 0) continue

    const domains = sources.map((s) => new URL(s.url).hostname.replace('www.', ''))
    const { urgency } = computeTimeliness(undefined) // history is always evergreen
    const novelty = computeNovelty(story.headline, coveredTopics)

    const score = assembleScore(
      {
        localRelevance: story.queueDims?.localRelevance ?? 18,
        formatFit: story.queueDims?.formatFit ?? 12,
        audienceValue: story.queueDims?.audienceValue ?? 10,
        seoPotential: story.queueDims?.seoPotential ?? 2,
      },
      computeTimeliness(undefined).score,
      Math.max(...domains.map((d) => sourceCredibilityScore(d))),
      novelty,
      domains,
      'local-history',
    )

    ideas.push({
      id: `localhist-${weekId}-${Math.random().toString(36).slice(2, 8)}`,
      weekId,
      source: 'daily-research',
      title: story.headline,
      angle: `${story.location}: ${story.surprisingDetail}`,
      whyItMatters: story.whyResidentsCare,
      category: 'local-history',
      audiences: ['local'] as IdeaAudience[],
      contentType: story.contentType || 'Local History',
      urgency,
      score,
      sourceUrls: sources.map((s) => s.url),
      sourceDomains: domains,
      sourceLabels: domains.map((d) => sourceTypeLabel(d)),
      researchData: buildStoryBrief(story, sources),
      targetKeyword: story.targetKeyword || story.headline,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
  }

  // Best stories first; cap so history enriches the queue without flooding it.
  return ideas
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, MAX_IDEAS_PER_RUN)
}

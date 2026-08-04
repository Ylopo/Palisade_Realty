import Anthropic from '@anthropic-ai/sdk'
import type { RawArticle, ScoredArticle, ArticleCategory, IdeaCandidate, IdeaAudience, IdeaUrgency } from '@/lib/types'
import { getSkippedUrls } from '@/lib/store'
import { isDisqualified, sourceTypeLabel, sourceCredibilityScore } from '@/lib/source-rules'
import { computeTimeliness, computeNovelty, assembleScore, SCORE_THRESHOLD, collapseNearDuplicates } from '@/lib/scoring'
import { buildWeekId, getPerformanceWeights, type PerformanceWeights } from '@/lib/idea-store'

// These 3 queries run EVERY day — broad daily coverage across market, community, and local news
const PINNED_QUERIES = [
  'San Diego real estate market news 2026',
  'San Diego County housing market home prices update 2026',
  'San Diego community development local news 2026',
]

// These rotate — 5 slots per day cycle through the full pool
const ROTATING_QUERIES = [
  // San Diego market data
  'San Diego housing market trends buyers sellers',
  'San Diego investment property rental market returns',
  'Carmel Valley Chula Vista San Diego real estate market 2026',
  'San Diego County median home price inventory days on market',

  // California law & policy changes affecting homeowners
  'California homeowner law changes 2026 property rights',
  'California property tax changes Proposition 19 2026',
  'California Davis-Stirling HOA law changes 2026',
  'San Diego zoning development law 2026',
  'California real estate legislation buyers sellers 2026',
  'California landlord tenant law changes 2026',

  // Major development projects & economic growth
  'San Diego major development projects jobs economy 2026',
  'Downtown San Diego new construction billion dollar development project',
  'San Diego military base expansion economy housing demand',
  'San Diego port biotech innovation economic growth 2026',
  'Chula Vista Carmel Valley new master planned community development',
  'San Diego corporate relocation jobs economy 2026',
  'Downtown San Diego convention center arena development project',
  'North Park San Diego new mixed use development',

  // Military & relocation (key San Diego driver)
  'Military relocation San Diego Naval Base homes',
  'PCS military move San Diego housing 2026',
  'NAS North Island Coronado housing military families',
  'San Diego VA loan veteran homebuyer benefits 2026',
  'MCRD San Diego Camp Pendleton military family housing',

  // Local events, arts, economy signals
  'San Diego local event festival arts tourism 2026',
  'San Diego new business restaurant opening economic growth 2026',
  'Gaslamp Quarter downtown San Diego waterfront development economy',

  // Schools & family buyers
  'Carmel Valley San Diego best school district families homebuyers',
  'San Diego school ratings neighborhoods homebuyers families',

  // Insurance, risk, and true cost of ownership
  'California homeowners insurance rates premium increase 2026',
  'California FAIR Plan wildfire insurance San Diego homes',
  'California property tax savings Proposition 19 exemption 2026',
  'San Diego cost of ownership homeowner expenses utilities 2026',
  'San Diego short term rental Airbnb VRBO regulations law 2026',

  // Wildfire, earthquake, coastal bluff erosion, and climate risk
  'San Diego wildfire risk insurance availability crisis 2026',
  'California earthquake insurance CEA San Diego homes',
  'La Jolla Del Mar Coronado coastal bluff erosion California Coastal Commission',
  'San Diego drought water restrictions homeowners 2026',

  // Buyers: affordability, financing, new construction
  'San Diego new construction builder incentives rate buydown 2026',
  'San Diego rent vs buy comparison affordability calculator',
  'California first time homebuyer grant down payment assistance 2026',
  'San Diego mortgage rates affordability median income 2026',

  // Investment & rental market
  'San Diego rental property cash flow investment analysis 2026',
  'San Diego vacation rental short term market revenue 2026',
  'San Diego multifamily duplex investment market 2026',

  // Lifestyle & community desirability
  'Point Loma Coronado waterfront homes neighborhood market 2026',
  'Mission Valley San Diego homes community growth 2026',
  'San Diego 55 plus active adult retirement community homes 2026',
  'San Diego first time home buyer programs 2026',
  'San Diego condo townhouse market trends 2026',

  // Local history & anniversaries — content locals care about beyond real estate
  'San Diego historical anniversary milestone 2026',
  'San Diego famous historical event anniversary 2026',
  'Coronado Hotel del Coronado history milestone anniversary',
  'San Diego famous unsolved crime murder mystery cold case anniversary',
  'San Diego notable politician leader local figure history legacy',
  'Point Loma San Diego military history famous battle event anniversary',
  'North Park San Diego local legend famous story notable history 2026',
]

// Pinned during the last 10 days of every month (days 22–31) so the idea queue
// surfaces upcoming events for the next month before operators need to schedule them.
const END_OF_MONTH_EVENT_QUERIES = [
  'San Diego events festivals things to do next month',
  'San Diego community events attractions activities upcoming month',
  'Coronado Carmel Valley San Diego local events concerts festivals calendar',
]

function getQueriesForToday(): string[] {
  const now = new Date()
  const dayOfYear = Math.floor(
    (Date.now() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  )
  const start = (dayOfYear * 5) % ROTATING_QUERIES.length
  const rotating: string[] = []
  for (let i = 0; i < 5; i++) {
    rotating.push(ROTATING_QUERIES[(start + i) % ROTATING_QUERIES.length])
  }
  const isEndOfMonthWindow = now.getDate() >= 22
  if (isEndOfMonthWindow) {
    return [...PINNED_QUERIES, ...END_OF_MONTH_EVENT_QUERIES, ...rotating]
  }
  return [...PINNED_QUERIES, ...rotating]
}

// ─── Fetch raw articles ───────────────────────────────────────────────────────

async function fetchRawArticles(): Promise<RawArticle[]> {
  const queries = getQueriesForToday()
  const tavilyApiKey = process.env.TAVILY_API_KEY
  if (!tavilyApiKey) throw new Error('TAVILY_API_KEY is not set')

  const rawArticles: RawArticle[] = []
  const seenUrls = new Set<string>()

  for (const query of queries) {
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
          max_results: 7,
          include_answer: false,
        }),
      })
      if (!res.ok) continue
      const data = await res.json()
      for (const result of data.results ?? []) {
        if (!seenUrls.has(result.url)) {
          seenUrls.add(result.url)
          rawArticles.push({
            id: `article_${rawArticles.length}`,
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

// ─── Legacy: scored article output (used by blog-picker page) ────────────────

export async function fetchAndScoreArticles(): Promise<ScoredArticle[]> {
  const rawArticles = await fetchRawArticles()
  if (rawArticles.length === 0) return []

  const skippedUrls = await getSkippedUrls()
  const filtered = skippedUrls.size > 0
    ? rawArticles.filter((a) => !skippedUrls.has(a.url))
    : rawArticles

  if (filtered.length === 0) return []

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const articleList = filtered
    .slice(0, 30)
    .map((a, i) =>
      `[${i}] TITLE: ${a.title}\nURL: ${a.url}\nSNIPPET: ${a.content.slice(0, 300)}\nDATE: ${a.publishedDate ?? 'unknown'}`
    )
    .join('\n\n')

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `You are a real estate content strategist for Palisade Realty, serving San Diego, California — including Downtown San Diego, Carmel Valley, Mission Valley, Chula Vista, Point Loma, North Park, and Coronado.

Evaluate these articles and return a JSON array. For each article assign:
- relevanceScore: 1-10 (San Diego homebuyers, sellers, investors)
- category: "market-update"|"buying-tips"|"selling-tips"|"community-spotlight"|"investment"|"news"
- whyItMatters: exactly 2 sentences why a San Diego homeowner/buyer should care

MARKET RESTRICTION: Only California, San Diego County, or Southern California when directly relevant.
Score non-California/non-San-Diego markets as 1. Drop below score 5.

Return ONLY a valid JSON array:
{"index": 0, "relevanceScore": 8, "category": "market-update", "whyItMatters": "..."}

Keep top 10 by score.

Articles:
${articleList}`,
    }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return []

  const scored: Array<{ index: number; relevanceScore: number; category: ArticleCategory; whyItMatters: string }> =
    JSON.parse(jsonMatch[0])

  // End-of-month event boost — keeps the blog-picker in sync with /admin/idea-review.
  // On days 25–31, community-spotlight/news get +2 (cap 10); days 22–24, +1.
  const day = new Date().getDate()
  const eventBoost = day >= 25 ? 2 : day >= 22 ? 1 : 0
  if (eventBoost > 0) {
    for (const s of scored) {
      if (s.category === 'community-spotlight' || s.category === 'news') {
        s.relevanceScore = Math.min(10, s.relevanceScore + eventBoost)
      }
    }
  }

  return scored
    .filter((s) => s.relevanceScore >= 4)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10)
    .map((s) => ({
      ...filtered[s.index],
      relevanceScore: s.relevanceScore,
      category: s.category,
      whyItMatters: s.whyItMatters,
    }))
}

// ─── New: idea candidates output (used by idea engine) ───────────────────────

interface RichScore {
  index: number
  drop: boolean           // true = disqualify entirely
  proposedTitle: string   // blog post angle headline
  angle: string           // 1–2 sentence editorial framing
  whyItMatters: string    // why San Diego residents care
  category: ArticleCategory
  audiences: IdeaAudience[]
  contentType: string
  localRelevance: number  // 0–25
  formatFit: number       // 0–15
  audienceValue: number   // 0–15
  seoPotential: number    // 0–5
}

export async function fetchAndScoreIdeas(coveredTopics: Set<string>): Promise<IdeaCandidate[]> {
  const rawArticles = await fetchRawArticles()
  if (rawArticles.length === 0) return []

  const skippedUrls = await getSkippedUrls()

  // Pre-filter: remove skipped URLs and disqualified domains
  const filtered = rawArticles.filter((a) => {
    if (skippedUrls.has(a.url)) return false
    const domain = new URL(a.url).hostname.replace('www.', '')
    if (isDisqualified(domain)) return false
    return true
  })

  if (filtered.length === 0) return []

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const weekId = buildWeekId()

  const articleList = filtered
    .slice(0, 30)
    .map((a, i) =>
      `[${i}] TITLE: ${a.title}\nURL: ${a.url}\nSNIPPET: ${a.content.slice(0, 400)}\nSOURCE: ${a.source ?? ''}\nDATE: ${a.publishedDate ?? 'unknown'}`
    )
    .join('\n\n')

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 6000,
    messages: [{
      role: 'user',
      content: `You are a senior content strategist for Hedda Parashos' Palisade Realty blog in San Diego, California. Hedda is Owner/President of Palisade Realty — she acquired the brokerage in 2012 and has grown it to 100+ agent partners across San Diego, Orange, and Riverside counties. Her content informs local buyers, sellers, homeowners, and investors — not selling, but genuinely helping them make better decisions.

Palisade Realty's primary communities: Downtown San Diego, Carmel Valley, Mission Valley, Chula Vista, Point Loma, North Park, and Coronado — plus broader San Diego County.

For each article below, decide:
1. Should it become a blog post idea? (drop if: not San Diego relevant, generic listicle, agent blog, content farm, national story with no local angle)
2. If yes: propose a blog angle that sounds like Hedda — a trusted local expert sharing what she knows

HIGH-VALUE REAL ESTATE TOPICS: local market data, California law changes, military/PCS housing near San Diego's bases, wildfire and earthquake risk, coastal bluff erosion, cost breakdowns, major local developments, zoning/tax/insurance changes, Mello-Roos special tax districts, Proposition 19, community growth signals.

HIGH-VALUE LOCAL INTEREST TOPICS (does NOT need to be real estate):
- Historical anniversaries: significant events in San Diego / Coronado / Point Loma / North Park history (notable storms, wildfires, battles, civic milestones, 25th/50th/100th anniversaries of major events)
- Famous local stories: notable crimes, unsolved mysteries, cold cases that locals remember, local legends
- Notable local figures: politicians, military heroes, famous residents past and present
- Big community moments: things that put San Diego on the map

For local-interest/local-history articles: frame Hedda as a proud local who knows the community's story, not as a real estate agent. Use category "local-history" or "local-interest". Audience should include "local".
These score well on localRelevance (20-25 if very San Diego specific) and audienceValue (10-13 if it's something locals genuinely care about).

Return a JSON array. For each article:
{
  "index": number,
  "drop": boolean,            // true = disqualify, don't include in queue
  "proposedTitle": string,    // Hedda's blog post headline (not the article title)
  "angle": string,            // 1-2 sentences on how to frame it from Hedda's POV
  "whyItMatters": string,     // why San Diego residents care about this NOW
  "category": string,         // market-update|buying-tips|selling-tips|community-spotlight|investment|news|cost-breakdown|flood-and-risk|local-history|local-interest
  "audiences": string[],      // any of: buyer seller homeowner investor local
  "contentType": string,      // e.g. "Market Update" | "Cost Breakdown" | "Law Change" | "Community Development" | "Wildfire Risk" | "Military/PCS" | "Process Guide" | "Investment Analysis" | "Local History" | "Anniversary" | "Local Crime & Mystery" | "Notable Figure" | "Community Story"
  "localRelevance": number,   // 0-25: 20-25=specific named San Diego community/event, 15-19=San Diego County general, 8-14=California/Southern California, 0-7=national/generic
  "formatFit": number,        // 0-15: cost breakdowns=15, wildfire/earthquake/coastal risk=14, comparison=13, local history narrative=12, process guide=12, market data=10, generic tips=3
  "audienceValue": number,    // 0-15: 12-15=decision-critical or highly compelling local story, 8-11=useful for planning or genuinely interesting, 4-7=interesting not actionable, 0-3=low utility
  "seoPotential": number      // 0-5: clear search intent keyword=4-5, moderate=2-3, low=0-1
}

MARKET RESTRICTION: Drop (drop:true) anything about markets outside California, unless it is a national policy story (Fed rate moves, national mortgage/lending rules) with a clear San Diego angle you can frame it around. Drop generic "10 tips for homebuyers" listicles. Drop content farm articles. Keep local-interest stories ONLY if they are specific to San Diego / Downtown San Diego / Carmel Valley / Mission Valley / Chula Vista / Point Loma / North Park / Coronado.

Return ONLY valid JSON array, no markdown.

Articles:
${articleList}`,
    }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return []

  const richScores: RichScore[] = JSON.parse(jsonMatch[0])

  const ideas: IdeaCandidate[] = []

  // Load performance weights once for this run — may be null if no review has run yet
  let perfWeights: PerformanceWeights | null = null
  try {
    perfWeights = await getPerformanceWeights()
  } catch {
    // Non-fatal — scoring proceeds without weights
  }

  for (const s of richScores) {
    if (s.drop) continue

    const article = filtered[s.index]
    if (!article) continue

    const domain = new URL(article.url).hostname.replace('www.', '')
    const { score: timeliness, urgency } = computeTimeliness(article.publishedDate)
    const sourceCredibility = sourceCredibilityScore(domain)
    const novelty = computeNovelty(s.proposedTitle, coveredTopics)

    const score = assembleScore(
      {
        localRelevance: s.localRelevance,
        formatFit: s.formatFit,
        audienceValue: s.audienceValue,
        seoPotential: s.seoPotential,
      },
      timeliness,
      sourceCredibility,
      novelty,
      [domain],
      s.category,
    )

    // Apply bi-weekly performance weight multiplier if available
    if (perfWeights?.weights) {
      const multiplier = perfWeights.weights[s.category] ?? 1.0
      if (multiplier !== 1.0) {
        const boosted = Math.min(99, Math.round(score.total * multiplier))
        console.log(`[research] ${multiplier > 1 ? 'boosting' : 'reducing'} "${s.proposedTitle}" (${s.category}) ${score.total} → ${boosted} (${multiplier}x)`)
        score.total = boosted
      }
    }

    // Drop below threshold
    if (score.total < SCORE_THRESHOLD) continue

    const id = `research-${weekId}-${article.id}-${Math.random().toString(36).slice(2, 6)}`

    ideas.push({
      id,
      weekId,
      source: 'daily-research',
      title: s.proposedTitle,
      angle: s.angle,
      whyItMatters: s.whyItMatters,
      category: s.category,
      audiences: s.audiences as IdeaAudience[],
      contentType: s.contentType,
      urgency,
      score,
      sourceUrls: [article.url],
      sourceDomains: [domain],
      sourceLabels: [sourceTypeLabel(domain)],
      researchData: article.content.slice(0, 2000),
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
  }

  // Sort by score descending, then collapse near-duplicate titles within this
  // batch (multiple news sources covering the same story → keep the highest-scoring).
  const sorted = ideas.sort((a, b) => b.score.total - a.score.total)
  const deduped = collapseNearDuplicates(sorted, (i) => i.title)
  if (deduped.length < sorted.length) {
    console.log(`[research] Collapsed ${sorted.length - deduped.length} near-duplicate idea(s) within batch`)
  }
  return deduped
}

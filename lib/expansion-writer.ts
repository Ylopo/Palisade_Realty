import Anthropic from '@anthropic-ai/sdk'
import { writeClient } from '@/lib/sanity/client'
import { FAIR_HOUSING_RULES } from '@/lib/fair-housing'
import { sourcePageImages } from '@/lib/expansion-images'
import type { ExpansionEntry } from '@/lib/expansion-queue'

/**
 * Researches and writes one expansion page (community / condo building /
 * lifestyle hub) and publishes it to Sanity as a communityPage document.
 *
 * Content is grounded in fresh Tavily research — the writer is instructed to
 * use only facts found in the research, never invented statistics.
 */

interface PageContent {
  title: string
  heroTagline: string
  heroDescription: string
  stats: Array<{ value: string; label: string }>
  sections: Array<{ heading: string; paragraphs: string[] }>
  quickFacts: Array<{ label: string; value: string }>
  faqs: Array<{ question: string; answer: string }>
  metaTitle: string
  metaDescription: string
}

async function tavilySearch(query: string): Promise<Array<{ title: string; url: string; content: string }>> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return []
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ query, search_depth: 'advanced', max_results: 6, include_answer: false }),
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.results ?? []).map((r: { title?: string; url?: string; content?: string }) => ({
      title: r.title ?? '', url: r.url ?? '', content: r.content ?? '',
    }))
  } catch {
    return []
  }
}

function researchQueries(entry: ExpansionEntry): string[] {
  const n = entry.name
  switch (entry.pageType) {
    case 'condo-building':
      return [
        `${n} condos San Diego building amenities HOA year built`,
        `${n} San Diego condo prices floor plans residences`,
      ]
    case 'condo-hub':
    case 'lifestyle-hub':
      return [
        `${entry.targetKeyword} guide market prices 2026`,
        `${n} San Diego buyer guide what to know`,
      ]
    default:
      return [
        `${n} San Diego real estate market home prices 2026`,
        `living in ${n} San Diego neighborhood guide schools amenities`,
        `${n} San Diego history community character`,
      ]
  }
}

function stripJsonFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
}

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

/** True when the URL responds (2xx/3xx, or 401/403 bot-blocks — site exists). */
async function urlResolves(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PalisadeRealty-LinkCheck/1.0)' },
    })
    return res.status < 400 || res.status === 401 || res.status === 403
  } catch {
    return false
  }
}

/**
 * Verifies every outbound link the writer produced and unwraps the ones that
 * don't resolve — the entity name stays in the text, the dead link goes.
 */
async function verifyOutboundLinks(content: PageContent): Promise<PageContent> {
  const texts: string[] = [
    ...content.sections.flatMap((s) => s.paragraphs ?? []),
    ...(content.faqs ?? []).map((f) => f.answer),
  ]
  const urls = new Set<string>()
  for (const t of texts) {
    for (const m of t.matchAll(LINK_RE)) urls.add(m[2])
  }
  if (urls.size === 0) return content

  const checks = await Promise.all([...urls].map(async (u) => [u, await urlResolves(u)] as const))
  const dead = new Set(checks.filter(([, ok]) => !ok).map(([u]) => u))
  if (dead.size === 0) return content
  console.warn('[expansion-writer] unwrapping dead outbound links:', [...dead])

  const unwrap = (t: string) => t.replace(LINK_RE, (full, label: string, url: string) => (dead.has(url) ? label : full))
  return {
    ...content,
    sections: content.sections.map((s) => ({ ...s, paragraphs: (s.paragraphs ?? []).map(unwrap) })),
    faqs: (content.faqs ?? []).map((f) => ({ ...f, answer: unwrap(f.answer) })),
  }
}

function buildPrompt(entry: ExpansionEntry, research: string): string {
  const typeGuidance: Record<ExpansionEntry['pageType'], string> = {
    'community': 'A definitive community guide: what the area is, who it suits, housing stock and architecture eras, micro-areas within it, schools, commute/access, lifestyle anchors (parks, trails, dining), and an honest market picture.',
    'neighborhood': 'A definitive neighborhood guide with the same depth as a community page.',
    'condo-building': 'A building profile: the tower\'s story (year, developer, architecture), residence mix and finishes, amenities, HOA character, the immediate neighborhood, and who the building suits. Write like someone who has walked the lobby.',
    'condo-hub': 'An area condo-market guide: the building landscape, price tiers, HOA/financing considerations, and how the sub-areas differ.',
    'lifestyle-hub': 'A county-wide buyer guide for this property type/lifestyle: where it exists in San Diego County, what it costs by area, trade-offs, and practical buying guidance. Name real communities and link-worthy specifics.',
    'enclave': 'A master-planned community deep-dive: origin and developer story, villages/products within it, amenities, schools, and market character.',
  }

  return `You are writing a comprehensive, SEO-optimized page for Palisade Realty (palisaderealty.com), a leading independent San Diego brokerage led by Hedda Parashos. Voice: knowledgeable local expert — warm, specific, genuinely useful. Never salesy, never generic filler.

PAGE: "${entry.name}" — ${typeGuidance[entry.pageType]}
TARGET KEYWORD: "${entry.targetKeyword}" (use naturally in the title, meta title, first paragraph, and 1-2 section headings — never stuffed)
${entry.writerNotes ? `EDITORIAL NOTES: ${entry.writerNotes}` : ''}

ACCURACY (non-negotiable): ground every specific claim — prices, dates, names, numbers — in the RESEARCH below. If the research doesn't support a specific number, write qualitatively instead ("prices typically run well above the county median") rather than inventing one. Never fabricate.

FAIR HOUSING (must comply exactly):
${FAIR_HOUSING_RULES}

OUTBOUND LINK RULE: when a section mentions a specific named institution — a university, city government, school district, regional park or trail system, sports team, museum, hospital system, transit agency, or an iconic local landmark/attraction — link its FIRST mention inline as [Name](https://official-website) pointing to that entity's OFFICIAL site only (universities: .edu; cities/districts: their .gov or official .org; teams/attractions: their official domain). Aim for 4-8 outbound links per page, spread across sections. NEVER link real-estate portals (Zillow/Redfin/Realtor.com), competitor brokerages, or news articles. NEVER guess a URL — if you are not confident of the official domain, mention the entity without a link. Links are allowed in section paragraphs and FAQ answers only.

FORMAT: plain text with the inline links described above — no other markdown (no bold/italics/headings inside paragraphs). Write 1,300-1,800 words total across sections.

RESEARCH:
${research}

Respond with ONLY valid JSON:
{
  "title": "<H1 — includes or closely matches the target keyword, e.g. '${entry.name} Homes For Sale'>",
  "heroTagline": "<5-8 word positioning line, e.g. 'Hillside Acreage · Wine Country Character'>",
  "heroDescription": "<2-3 sentence hero intro>",
  "stats": [{"value": "<short figure/fact>", "label": "<label>"}, ...4 items — only research-supported figures (median price, population, year established, school rating, etc.)],
  "sections": [{"heading": "...", "paragraphs": ["...", "..."]}, ...5-7 substantial sections],
  "quickFacts": [{"label": "...", "value": "..."}, ...6 items],
  "faqs": [{"question": "...", "answer": "<2-4 sentences>"}, ...5 questions buyers actually ask],
  "metaTitle": "<max 60 chars, keyword-led>",
  "metaDescription": "<max 155 chars>"
}`
}

export async function buildExpansionPage(entry: ExpansionEntry): Promise<{ id: string; slug: string }> {
  // 1. Research + licensed local photos, in parallel
  const queries = researchQueries(entry)
  const [resultsPerQuery, images] = await Promise.all([
    Promise.all(queries.map((q) => tavilySearch(q))),
    sourcePageImages(entry.name, entry.pageType, 2).catch(() => []),
  ])
  const seen = new Set<string>()
  const allResults = resultsPerQuery.flat().filter((r) => {
    if (!r.url || seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })
  const research = allResults
    .slice(0, 14)
    .map((r, i) => `[${i}] ${r.title} (${new URL(r.url).hostname})\n${r.content.slice(0, 700)}`)
    .join('\n\n') || 'No research results available — write qualitatively, no specific figures.'

  // 2. Write (claude-opus-5 thinks by default; budget covers thinking + JSON)
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const message = await anthropic.messages.create({
    model: 'claude-opus-5',
    max_tokens: 16000,
    messages: [{ role: 'user', content: buildPrompt(entry, research) }],
  })
  const raw = message.content.find((b) => b.type === 'text')?.text ?? ''
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`expansion-writer: no JSON in model response for ${entry.slug}`)
  const content = await verifyOutboundLinks(JSON.parse(jsonMatch[0]) as PageContent)

  // 3. Publish to Sanity (idempotent on slug — re-running updates the page)
  const existingId = await writeClient.fetch<string | null>(
    `*[_type == "communityPage" && slug.current == $slug][0]._id`,
    { slug: entry.slug }
  )

  const doc = {
    _type: 'communityPage' as const,
    title: content.title,
    slug: { _type: 'slug' as const, current: entry.slug },
    name: entry.name,
    pageType: entry.pageType,
    phase: entry.phase,
    targetKeyword: entry.targetKeyword,
    searchVolume: entry.searchVolume,
    heroTagline: content.heroTagline,
    heroDescription: content.heroDescription,
    stats: content.stats?.slice(0, 4).map((s, i) => ({ _key: `stat-${i}`, ...s })) ?? [],
    sections: content.sections?.map((s, i) => ({ _key: `sec-${i}`, heading: s.heading, paragraphs: s.paragraphs })) ?? [],
    quickFacts: content.quickFacts?.slice(0, 8).map((f, i) => ({ _key: `qf-${i}`, ...f })) ?? [],
    faqs: content.faqs?.slice(0, 6).map((f, i) => ({ _key: `faq-${i}`, ...f })) ?? [],
    idxLocation: entry.idx,
    idxPropertyTypes: entry.idxPropertyTypes ?? ['house', 'condo', 'townhouse', 'multi_family'],
    fallbackIdxLocation: entry.fallbackIdx,
    nearby: entry.nearby.map((n, i) => ({ _key: `nb-${i}`, name: n.name, url: n.url })),
    images: images.map((img, i) => ({ _key: `img-${i}`, ...img })),
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    publishedAt: new Date().toISOString(),
    aiGenerated: true,
    sourceUrls: allResults.slice(0, 8).map((r) => r.url),
  }

  if (existingId) {
    await writeClient.patch(existingId).set(doc).commit()
    return { id: existingId, slug: entry.slug }
  }
  const created = await writeClient.create(doc)
  return { id: created._id, slug: entry.slug }
}

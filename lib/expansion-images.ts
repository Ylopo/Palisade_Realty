import Anthropic from '@anthropic-ai/sdk'

/**
 * Sources local photos for expansion pages from Wikimedia Commons — real
 * images of San Diego communities under licenses that permit commercial use
 * (CC0 / public domain / CC BY / CC BY-SA), each carrying the structured
 * attribution the template renders as a photo credit.
 *
 * Non-commercial (NC) and no-derivative-restricted licenses are excluded;
 * a title blocklist plus a Haiku selection pass keeps event/news photos off
 * real-estate pages.
 */

export interface PageImage {
  url: string        // 1200px-wide thumbnail served by Wikimedia's CDN
  alt: string
  credit: string     // artist display name (plain text)
  creditUrl: string  // the Commons file page (attribution link target)
  license: string    // e.g. "CC BY-SA 4.0"
  licenseUrl?: string
}

interface Candidate extends PageImage {
  width: number
  height: number
  title: string
}

// Licenses that allow commercial reuse with attribution.
const LICENSE_ALLOW = /^(cc0|cc by(-sa)?( \d|\b)|public domain|pd)/i
// Subjects that don't belong on a real-estate page.
const TITLE_BLOCKLIST = /protest|rally|march|demonstration|police|fire dept|crash|accident|election|campaign|funeral|logo|seal|coat of arms|flag of|locator|map|diagram|screenshot/i

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function cleanTitle(fileTitle: string): string {
  return fileTitle
    .replace(/^File:/, '')
    .replace(/\.(jpe?g|png|webp)$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim()
}

async function searchCommons(query: string): Promise<Candidate[]> {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '20',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: '1200',
    format: 'json',
    origin: '*',
  })
  try {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
      headers: { 'User-Agent': 'PalisadeRealty-CommunityPages/1.0 (palisaderealty.com)' },
    })
    if (!res.ok) return []
    const data = await res.json() as {
      query?: { pages?: Record<string, {
        title: string
        imageinfo?: Array<{
          thumburl?: string
          descriptionurl?: string
          width?: number
          height?: number
          extmetadata?: Record<string, { value?: string }>
        }>
      }> }
    }
    const pages = Object.values(data.query?.pages ?? {})
    const out: Candidate[] = []
    for (const p of pages) {
      const ii = p.imageinfo?.[0]
      if (!ii?.thumburl) continue
      if (!/\.jpe?g$/i.test(p.title)) continue
      if (TITLE_BLOCKLIST.test(p.title)) continue
      if ((ii.width ?? 0) < 1000 || (ii.height ?? 0) < 600) continue
      const em = ii.extmetadata ?? {}
      const license = em.LicenseShortName?.value ?? ''
      if (!LICENSE_ALLOW.test(license) || /nc/i.test(license)) continue
      out.push({
        title: p.title,
        url: ii.thumburl,
        alt: cleanTitle(p.title),
        credit: stripHtml(em.Artist?.value ?? 'Wikimedia Commons contributor'),
        creditUrl: ii.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
        license,
        licenseUrl: em.LicenseUrl?.value,
        width: ii.width ?? 0,
        height: ii.height ?? 0,
      })
    }
    return out
  } catch {
    return []
  }
}

/** Haiku picks the images that actually look like community/landmark shots. */
async function pickBest(name: string, pageType: string, candidates: Candidate[], count: number): Promise<Candidate[]> {
  if (candidates.length <= count) return candidates
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const list = candidates.map((c, i) => `[${i}] ${cleanTitle(c.title)} (${c.width}x${c.height})`).join('\n')
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Pick the ${count} best photos for a real-estate community guide page about "${name}" (${pageType}) in San Diego County, judging ONLY by these titles. Prefer streetscapes, landmarks, downtown views, parks, architecture, skylines. Avoid: events, crowds, individual people, close-up objects, interiors of unrelated businesses, vehicles. Reply with ONLY a JSON array of the chosen indexes, e.g. [2,7]\n\n${list}`,
      }],
    })
    const text = msg.content.find((b) => b.type === 'text')?.text ?? ''
    const idx = JSON.parse(text.match(/\[[\d,\s]*\]/)?.[0] ?? '[]') as number[]
    const picked = idx.map((i) => candidates[i]).filter(Boolean).slice(0, count)
    if (picked.length > 0) return picked
  } catch {
    // fall through to heuristic
  }
  // Heuristic fallback: largest images whose title mentions the place name.
  const named = candidates.filter((c) => c.title.toLowerCase().includes(name.toLowerCase().split(' ')[0]))
  return (named.length >= count ? named : candidates).slice(0, count)
}

/**
 * Finds up to `count` licensed local photos for a page. Never throws —
 * returns [] when nothing suitable exists (the template simply renders
 * without photos).
 */
export async function sourcePageImages(name: string, pageType: string, count = 2): Promise<PageImage[]> {
  const queries = pageType === 'condo-building'
    ? [`${name} San Diego building`, `${name} San Diego`]
    : [`${name} California`, `${name} San Diego`]

  const results = await Promise.all(queries.map((q) => searchCommons(q)))
  const seen = new Set<string>()
  const candidates = results.flat().filter((c) => {
    if (seen.has(c.title)) return false
    seen.add(c.title)
    return true
  })
  if (candidates.length === 0) return []

  const picked = await pickBest(name, pageType, candidates, count)
  return picked.map(({ url, alt, credit, creditUrl, license, licenseUrl }) => ({
    url, alt, credit, creditUrl, license, licenseUrl,
  }))
}

/**
 * Sources 4-5 candidate background images per script "scene" for the Enterprise
 * Video Pipeline. A scene is one beat of a script tied to a place/topic
 * (`{keyword, phrase, imageQuery, place?}`).
 *
 * Candidate sourcing order per scene:
 *   1. Mapbox static map (only if `scene.place` is set) — always candidate[0].
 *   2. Firecrawl web search for real photos matching `scene.imageQuery`
 *      (skipped gracefully if `FIRECRAWL_API_KEY` is not configured).
 *   3. OpenAI image generation fills the remainder up to TARGET_CANDIDATES —
 *      this is the primary source for topic/stat scenes with no place and no
 *      Firecrawl results (e.g. "sales surge", "median price"), not just a
 *      last-resort single image. Generates several distinct framings in
 *      parallel (skipped gracefully if `OPENAI_API_KEY` is not configured —
 *      in that case the scene simply gets fewer candidates, it does not throw).
 */

const TARGET_CANDIDATES = 4

// Distinct framing/style hints appended to the same base prompt so parallel
// DALL-E calls return genuinely different options instead of near-duplicates.
const IMAGE_STYLE_VARIANTS = [
  'wide establishing shot, natural daylight',
  'close-up detail shot, warm evening light',
  'aerial drone perspective',
  'interior-focused composition with depth',
  'street-level candid composition',
]

const MAPBOX_TOKEN = process.env.MAPBOX_PUBLIC_TOKEN

// San Diego, CA bias — the one piece of this file that's client-specific. Porting
// this file to another client's map should mean swapping ONLY these two constants
// (proximity point + bounding box) for that client's market.
const SAN_DIEGO_PROXIMITY: [number, number] = [-117.16, 32.72]
const SAN_DIEGO_BBOX: [number, number, number, number] = [-117.6, 32.5, -116.0, 33.3]

// Palisade Realty brand burgundy, no leading '#' (Mapbox static-map pin syntax).
const PIN_COLOR = '58172a'

export type SceneImageSource = 'map' | 'search' | 'generated'

export interface SceneCandidate {
  url: string
  source: SceneImageSource
}

export interface Scene {
  keyword: string
  phrase: string
  imageQuery: string
  place?: string
}

export interface SourcedScene {
  keyword: string
  phrase: string
  candidates: SceneCandidate[]
}

interface GeoPoint {
  lng: number
  lat: number
}

/**
 * Geocodes a place name via Mapbox, biased toward San Diego, CA so ambiguous
 * place names (e.g. "North Park", "Liberty Station") resolve to the San Diego
 * neighborhood rather than a same-named place elsewhere.
 */
export async function geocodePlace(place: string): Promise<GeoPoint | null> {
  if (!MAPBOX_TOKEN) return null
  if (!place || !place.trim()) return null

  const query = encodeURIComponent(place.trim())
  const params = new URLSearchParams({
    access_token: MAPBOX_TOKEN,
    proximity: SAN_DIEGO_PROXIMITY.join(','),
    bbox: SAN_DIEGO_BBOX.join(','),
    limit: '1',
  })

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params.toString()}`

  try {
    const res = await fetch(url)
    if (!res.ok) return null

    const data = (await res.json()) as { features?: Array<{ center?: [number, number] }> }
    const center = data.features?.[0]?.center
    if (!center || center.length !== 2) return null

    return { lng: center[0], lat: center[1] }
  } catch {
    return null
  }
}

/**
 * Builds a 720x1280 (9:16) @2x Mapbox static-map URL for `place`, styled with a
 * Palisade-brand-burgundy pin on the `dark-v11` base style. Returns null if the
 * place couldn't be geocoded (or Mapbox isn't configured).
 */
export async function mapboxStaticUrl(place: string): Promise<string | null> {
  if (!MAPBOX_TOKEN) return null

  const point = await geocodePlace(place)
  if (!point) return null

  const { lng, lat } = point
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-l+${PIN_COLOR}(${lng},${lat})/${lng},${lat},13,0/720x1280@2x?access_token=${MAPBOX_TOKEN}`
}

interface FirecrawlSearchResult {
  url?: string
  metadata?: {
    ogImage?: string
    image?: string
  }
}

/**
 * Searches the web via Firecrawl for real photos matching `imageQuery`. Returns
 * an empty array (never throws) if `FIRECRAWL_API_KEY` is not configured or the
 * request fails — this integration is optional per client.
 */
async function searchFirecrawlImages(imageQuery: string): Promise<SceneCandidate[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) return []

  try {
    const res = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: `${imageQuery} photo`,
        limit: 5,
        scrapeOptions: { formats: ['markdown'] },
      }),
    })

    if (!res.ok) {
      console.error(`[scene-images] Firecrawl search failed (${res.status}):`, (await res.text()).slice(0, 200))
      return []
    }

    const data = (await res.json()) as { success?: boolean; data?: FirecrawlSearchResult[] }
    if (!data.success || !Array.isArray(data.data)) return []

    const candidates: SceneCandidate[] = []
    for (const result of data.data) {
      const imageUrl = result.metadata?.ogImage ?? result.metadata?.image
      if (imageUrl) {
        candidates.push({ url: imageUrl, source: 'search' })
      }
    }
    return candidates
  } catch {
    return []
  }
}

/**
 * Generates one background image via OpenAI's image API for a single style
 * variant. Returns null (never throws) if `OPENAI_API_KEY` is not configured
 * or the request fails — this integration is optional per client.
 */
async function generateOneOpenAiImage(imageQuery: string, styleHint: string): Promise<SceneCandidate | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Real estate marketing photo: ${imageQuery}. ${styleHint}. Photorealistic, professional real estate photography, no text or watermarks.`,
        n: 1,
        size: '1024x1792', // portrait, closest native size to a 9:16 video frame
        response_format: 'url',
      }),
    })

    if (!res.ok) {
      console.error(`[scene-images] OpenAI image generation failed (${res.status}):`, (await res.text()).slice(0, 300))
      return null
    }

    const data = (await res.json()) as { data?: Array<{ url?: string; b64_json?: string }> }
    const first = data.data?.[0]
    if (first?.url) {
      return { url: first.url, source: 'generated' }
    }
    if (first?.b64_json) {
      return { url: `data:image/png;base64,${first.b64_json}`, source: 'generated' }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Generates up to `count` background images via OpenAI in parallel, each with
 * a distinct framing/style hint so the operator gets genuinely different
 * options rather than near-duplicates. DALL-E 3 only supports n=1 per call,
 * so this fans out `count` separate requests instead of one call with n>1.
 * Returns whatever succeeded — never throws, and returns [] if
 * `OPENAI_API_KEY` is not configured.
 */
async function generateOpenAiImages(imageQuery: string, count: number): Promise<SceneCandidate[]> {
  if (!process.env.OPENAI_API_KEY || count <= 0) return []

  const variants = IMAGE_STYLE_VARIANTS.slice(0, count)
  const results = await Promise.all(variants.map((hint) => generateOneOpenAiImage(imageQuery, hint)))
  return results.filter((r): r is SceneCandidate => r !== null)
}

/**
 * Configuration warnings surfaced to the admin UI so a missing key shows up as
 * a visible message instead of a silently empty candidate strip.
 */
export function sceneSourcingWarnings(): string[] {
  const warnings: string[] = []
  if (!process.env.OPENAI_API_KEY) {
    warnings.push('OPENAI_API_KEY is not configured — AI image generation is skipped.')
  }
  if (!process.env.FIRECRAWL_API_KEY) {
    warnings.push('FIRECRAWL_API_KEY is not configured — web photo search is skipped.')
  }
  if (!process.env.MAPBOX_PUBLIC_TOKEN) {
    warnings.push('MAPBOX_PUBLIC_TOKEN is not configured — map images are skipped.')
  }
  return warnings
}

/**
 * Sources up to TARGET_CANDIDATES background images per scene for a script.
 * Scenes run in parallel — image generation is slow (~10-25s per scene), and
 * a 5-scene script processed sequentially blows past serverless time limits.
 */
export async function sourceSceneImages(scenes: Scene[]): Promise<SourcedScene[]> {
  return Promise.all(scenes.map(async (scene) => {
    const candidates: SceneCandidate[] = []

    // 1. Mapbox static map, if the scene has a place.
    if (scene.place) {
      const mapUrl = await mapboxStaticUrl(scene.place)
      if (mapUrl) {
        candidates.push({ url: mapUrl, source: 'map' })
      }
    }

    // 2. Firecrawl search for real photos.
    const searchCandidates = await searchFirecrawlImages(scene.imageQuery)
    candidates.push(...searchCandidates)

    // 3. OpenAI generation fills the remainder up to TARGET_CANDIDATES — the
    // primary source for topic/stat scenes (no place, nothing from search).
    if (candidates.length < TARGET_CANDIDATES) {
      const generated = await generateOpenAiImages(scene.imageQuery, TARGET_CANDIDATES - candidates.length)
      candidates.push(...generated)
    }

    return {
      keyword: scene.keyword,
      phrase: scene.phrase,
      candidates,
    }
  }))
}

/**
 * Sources 3-5 candidate background images per script "scene" for the Enterprise
 * Video Pipeline. A scene is one beat of a script tied to a place/topic
 * (`{keyword, phrase, imageQuery, place?}`).
 *
 * Candidate sourcing order per scene:
 *   1. Mapbox static map (only if `scene.place` is set) — always candidate[0].
 *   2. Firecrawl web search for real photos matching `scene.imageQuery`
 *      (skipped gracefully if `FIRECRAWL_API_KEY` is not configured).
 *   3. OpenAI image generation, but ONLY as a last resort if steps 1-2 produced
 *      zero candidates (skipped gracefully if `OPENAI_API_KEY` is not configured
 *      — in that case the scene simply gets zero candidates, it does not throw).
 */

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

    if (!res.ok) return []

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
 * Generates a fallback background image via OpenAI's image API. Returns null
 * (never throws) if `OPENAI_API_KEY` is not configured or the request fails —
 * this integration is optional per client and this is only ever called as a
 * last-resort fallback when no real photos were found.
 */
async function generateOpenAiImage(imageQuery: string): Promise<SceneCandidate | null> {
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
        prompt: imageQuery,
        n: 1,
        size: '1024x1792', // portrait, closest native size to a 9:16 video frame
        response_format: 'url',
      }),
    })

    if (!res.ok) return null

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
 * Sources 3-5 candidate background images per scene for a script.
 */
export async function sourceSceneImages(scenes: Scene[]): Promise<SourcedScene[]> {
  const results: SourcedScene[] = []

  for (const scene of scenes) {
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

    // 3. OpenAI generation, only if steps 1-2 found nothing.
    if (candidates.length === 0) {
      const generated = await generateOpenAiImage(scene.imageQuery)
      if (generated) {
        candidates.push(generated)
      }
    }

    results.push({
      keyword: scene.keyword,
      phrase: scene.phrase,
      candidates,
    })
  }

  return results
}

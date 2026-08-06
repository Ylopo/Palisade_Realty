import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface IncomingScene {
  keyword: string
  phrase: string
  imageUrl: string
  order: number
  approved: boolean
  /** Optional provenance tag carried over from source-scene-images candidates (e.g. "unsplash", "google"). */
  source?: string
  /** Preserved so a later "Find Images" re-run after a page reload still has a query/place to search with. */
  imageQuery?: string
  place?: string
}

interface SavedScene {
  keyword: string
  phrase: string
  imageUrl: string
  order: number
  approved: boolean
  source: string
  imageQuery?: string
  place?: string
}

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/** True if the URL is already a permanent, Sanity-hosted asset URL. */
function isSanityUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'cdn.sanity.io' || parsed.hostname.endsWith('.sanity.io')
  } catch {
    return false
  }
}

// Mirrors image-proxy's UA — the same third-party sites that block bot-looking
// <img> requests (which is why the proxy exists) will also block a bare
// server-side fetch without this header.
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

/**
 * approvedScenes stores whatever URL was shown in the browser — for real-photo
 * candidates from source-scene-images, that's a same-origin
 * `/api/content/image-proxy?url=<encoded original>` path built for `<img>`
 * tags, not a fetchable absolute URL. Node's `fetch()` can't resolve a
 * relative URL ("Failed to parse URL from ..."), so unwrap the original
 * upstream URL out of the proxy path before fetching it here. Any other URL
 * (Sanity CDN, Mapbox static map, DALL-E) is already absolute and passes
 * through unchanged.
 */
function resolveFetchableUrl(url: string): string {
  if (!url.startsWith('/api/content/image-proxy')) return url
  const original = new URL(url, 'http://localhost').searchParams.get('url')
  return original ?? url
}

/**
 * POST /api/content/save-scenes?secret=...
 * Body: { postId: string; scenes: Array<{ keyword, phrase, imageUrl, order, approved }> }
 *
 * Third-party image URLs (real-photo search results) are not guaranteed to stay
 * alive long-term, so every APPROVED scene whose imageUrl points off-Sanity gets
 * its bytes fetched server-side and re-uploaded into Sanity, giving it a stable,
 * permanently-hosted URL before it's persisted on the post. Unapproved scenes are
 * kept as-is (they won't be used to render a video, so there's no need to make
 * their images permanent).
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: unknown; scenes?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postId, scenes } = body
  if (typeof postId !== 'string' || postId.length === 0) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }
  if (!Array.isArray(scenes)) {
    return NextResponse.json({ error: 'scenes must be an array' }, { status: 400 })
  }

  try {
    const incomingScenes = scenes as IncomingScene[]
    const savedScenes: SavedScene[] = []

    for (const scene of incomingScenes) {
      let finalImageUrl = scene.imageUrl

      if (scene.approved && scene.imageUrl && !isSanityUrl(scene.imageUrl)) {
        const fetchUrl = resolveFetchableUrl(scene.imageUrl)
        const upstream = await fetch(fetchUrl, {
          headers: { 'User-Agent': BROWSER_USER_AGENT, Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' },
        })
        if (!upstream.ok) {
          throw new Error(
            `save-scenes: failed to fetch scene image for order ${scene.order} (${upstream.status})`
          )
        }
        const arrayBuffer = await upstream.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const asset = await writeClient.assets.upload('image', buffer, {
          filename: `scene-${scene.order}.jpg`,
        })
        finalImageUrl = asset.url
      }

      savedScenes.push({
        keyword: scene.keyword,
        phrase: scene.phrase,
        imageUrl: finalImageUrl,
        order: scene.order,
        approved: scene.approved,
        source: scene.source ?? (isSanityUrl(scene.imageUrl) ? 'sanity' : 'external'),
        ...(scene.imageQuery ? { imageQuery: scene.imageQuery } : {}),
        ...(scene.place ? { place: scene.place } : {}),
      })
    }

    await writeClient.patch(postId).set({ videoScenes: savedScenes }).commit()

    return NextResponse.json({ ok: true, videoScenes: savedScenes })
  } catch (err: unknown) {
    console.error('[api/content/save-scenes]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

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
}

interface SavedScene {
  keyword: string
  phrase: string
  imageUrl: string
  order: number
  approved: boolean
  source: string
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
        const upstream = await fetch(scene.imageUrl)
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
      })
    }

    await writeClient.patch(postId).set({ videoScenes: savedScenes }).commit()

    return NextResponse.json({ ok: true, videoScenes: savedScenes })
  } catch (err: unknown) {
    console.error('[api/content/save-scenes]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

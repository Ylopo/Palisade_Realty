import { NextRequest, NextResponse } from 'next/server'
import { sourceSceneImages } from '@/lib/scene-images'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface SceneRequestInput {
  keyword: string
  phrase: string
  imageQuery: string
  place?: string
}

function getSecret(request: NextRequest): string | null {
  return request.nextUrl.searchParams.get('secret')
}

function isAuthorized(secret: string | null): boolean {
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/**
 * A URL counts as "already same-origin Sanity CDN" (and therefore doesn't need
 * proxying) if it's served from Sanity's asset CDN, e.g. https://cdn.sanity.io/...
 */
function isSanityCdnUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'cdn.sanity.io' || parsed.hostname.endsWith('.sanity.io')
  } catch {
    return false
  }
}

function toProxiedUrl(originalUrl: string, secret: string): string {
  return `/api/content/image-proxy?url=${encodeURIComponent(originalUrl)}&secret=${encodeURIComponent(secret)}`
}

/**
 * POST /api/content/source-scene-images?secret=...
 * Body: { scenes: Array<{ keyword, phrase, imageQuery, place? }> }
 *
 * Sources candidate real-photo images per scene, then rewrites every candidate
 * URL to route through this repo's own image-proxy so the admin UI can preview
 * third-party images without them being blocked by bot/referrer protection on
 * the source site. Sanity-hosted candidates are left untouched since they're
 * already permanent and same-origin-friendly.
 */
export async function POST(request: NextRequest) {
  const secret = getSecret(request)
  if (!isAuthorized(secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { scenes?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { scenes } = body
  if (!Array.isArray(scenes) || scenes.length === 0) {
    return NextResponse.json({ error: 'scenes must be a non-empty array' }, { status: 400 })
  }

  try {
    const results = await sourceSceneImages(scenes as SceneRequestInput[])

    // secret is guaranteed non-null here (isAuthorized passed)
    const proxiedResults = results.map((scene) => ({
      ...scene,
      candidates: scene.candidates.map((candidate) => ({
        ...candidate,
        url: isSanityCdnUrl(candidate.url) ? candidate.url : toProxiedUrl(candidate.url, secret as string),
      })),
    }))

    return NextResponse.json({ scenes: proxiedResults })
  } catch (err: unknown) {
    console.error('[api/content/source-scene-images]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

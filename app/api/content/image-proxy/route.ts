import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// A realistic desktop browser UA — many source sites (real-photo search results
// especially) block or 403 requests that look bot-like, which breaks <img> tags
// loaded cross-site in the admin UI. Fetching server-side with this header and
// streaming the bytes back same-origin sidesteps that.
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/**
 * GET /api/content/image-proxy?secret=...&url=<encoded third-party image URL>
 *
 * Fetches a third-party image server-side (with a realistic browser UA so
 * bot/referrer protection on the source site doesn't block it) and streams the
 * bytes back same-origin with the correct Content-Type, so <img> previews in the
 * admin UI don't break.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': BROWSER_USER_AGENT,
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
    })

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: 'Upstream image fetch failed' }, { status: 502 })
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err: unknown) {
    console.error('[api/content/image-proxy]', (err as Error).message)
    return NextResponse.json({ error: 'Upstream image fetch failed' }, { status: 502 })
  }
}

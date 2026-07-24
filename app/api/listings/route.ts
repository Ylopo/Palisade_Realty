import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const OWNER = 'jomylopo'
const REPO  = 'Palisade_Realty'
const CORS  = { 'Cache-Control': 'no-store, max-age=0', 'Content-Type': 'application/json' }

export async function GET(request: NextRequest) {
  const token    = process.env.GITHUB_TOKEN
  const isConfig = request.nextUrl.searchParams.get('type') === 'config'
  const FILE     = isConfig ? 'data/agent-listings-config.json' : 'data/featured-properties.json'

  try {
    const ghRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
          'User-Agent': 'palisade-realty-site',
          ...(token && { Authorization: `token ${token}` }),
        },
      }
    )

    if (isConfig && ghRes.status === 404) {
      return NextResponse.json({}, { headers: CORS })
    }

    if (!ghRes.ok) {
      console.error('[api/listings] GitHub error', ghRes.status, FILE)
      return NextResponse.json({ error: 'GitHub API error', status: ghRes.status }, { status: 502, headers: CORS })
    }

    const data = await ghRes.json()
    if (isConfig) {
      return NextResponse.json(
        data && typeof data === 'object' && !Array.isArray(data) ? data : {},
        { headers: CORS }
      )
    }
    return NextResponse.json(Array.isArray(data) ? data : [], { headers: CORS })
  } catch (err: unknown) {
    console.error('[api/listings] Fetch error:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500, headers: CORS })
  }
}

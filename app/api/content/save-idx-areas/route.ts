import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/**
 * POST /api/content/save-idx-areas?secret=...
 * Body: { postId: string, areas: string[] }
 *
 * Persists the operator-confirmed list of community names to show live IDX
 * listings for at the bottom of this blog post.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: unknown; areas?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postId, areas } = body
  if (typeof postId !== 'string' || postId.length === 0) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }
  if (!Array.isArray(areas) || !areas.every((a): a is string => typeof a === 'string')) {
    return NextResponse.json({ error: 'areas must be an array of strings' }, { status: 400 })
  }

  try {
    await writeClient.patch(postId).set({ idxAreas: areas }).commit()
    return NextResponse.json({ ok: true, idxAreas: areas })
  } catch (err: unknown) {
    console.error('[api/content/save-idx-areas]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

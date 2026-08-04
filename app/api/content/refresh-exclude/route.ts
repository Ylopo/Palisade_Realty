import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RefreshExcludeBody {
  postId?: string
  secret?: string
}

/** Same query-param-or-body-secret pattern as refresh-approve/refresh-skip. */
function isAuthorized(request: NextRequest, body: RefreshExcludeBody): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return false
  const querySecret = request.nextUrl.searchParams.get('secret')
  return querySecret === adminSecret || body.secret === adminSecret
}

/**
 * POST /api/content/refresh-exclude?secret=...
 * Body: { postId, secret? }
 *
 * Permanently patches `refreshExcluded: true` on the post via `writeClient`,
 * so it's dropped from `evaluateRefreshCandidates()` (checked in the Sanity
 * query in lib/refresh-engine.ts) from now on.
 */
export async function POST(request: NextRequest) {
  let body: RefreshExcludeBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isAuthorized(request, body)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = body
  if (!postId || typeof postId !== 'string') {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  try {
    await writeClient.patch(postId).set({ refreshExcluded: true }).commit()
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('[api/content/refresh-exclude][POST]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

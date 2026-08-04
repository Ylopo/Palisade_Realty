import { NextResponse } from 'next/server'
import { markFHReviewed } from '@/lib/fair-housing'

export const dynamic = 'force-dynamic'

/**
 * Marks a post's cached FH check result as operator-reviewed (sets
 * `reviewedAt`) without touching violations or post content.
 *
 * Body: { postId: string }
 * Returns: { ok: true, fhResult: FHCheckResult } or 404 if there's no cached
 * FH result for this post yet (nothing to mark reviewed).
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await request.json().catch(() => ({}))
  if (!postId || typeof postId !== 'string') {
    return NextResponse.json({ error: 'postId required' }, { status: 400 })
  }

  const fhResult = await markFHReviewed(postId)
  if (!fhResult) {
    return NextResponse.json({ error: 'No FH check result for this post' }, { status: 404 })
  }
  return NextResponse.json({ ok: true, fhResult })
}

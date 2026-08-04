import { NextResponse } from 'next/server'
import { getFHResult, type FHCheckResult } from '@/lib/fair-housing'

export const dynamic = 'force-dynamic'

/**
 * Batch FH-status lookup for the VA queue grid.
 *
 * GET /api/content/fh-status?secret=...&postIds=id1,id2,id3
 *
 * Returns a map of postId -> FHCheckResult, but only for posts whose cached
 * result is currently 'warning' or 'violation' — the UI only needs to flag
 * non-clear posts, so 'clear' results (and posts with no cached result at
 * all) are omitted entirely.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const postIds = (searchParams.get('postIds') ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  if (postIds.length === 0) {
    return NextResponse.json({})
  }

  const results = await Promise.all(
    postIds.map(async (id) => {
      const result = await getFHResult(id).catch(() => null)
      return [id, result] as const
    }),
  )

  const map: Record<string, FHCheckResult> = {}
  for (const [id, result] of results) {
    if (result && (result.severity === 'warning' || result.severity === 'violation')) {
      map[id] = result
    }
  }

  return NextResponse.json(map)
}

import { NextRequest, NextResponse } from 'next/server'
import { getPendingIdeas, getAllIdeas } from '@/lib/idea-store'

export const runtime = 'nodejs'

// GET /api/content/ideas?secret=...            -> pending ideas, score desc (idea-review default view)
// GET /api/content/ideas?secret=...&all=true    -> every idea regardless of status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const all = searchParams.get('all') === 'true'
    const ideas = all
      ? await getAllIdeas()
      : (await getPendingIdeas()).sort((a, b) => b.score.total - a.score.total)

    return NextResponse.json({ ideas })
  } catch (err) {
    console.error('[GET /api/content/ideas]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

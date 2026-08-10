import { NextRequest, NextResponse } from 'next/server'
import { loadArticles } from '@/lib/store'
import { fetchAndScoreArticles } from '@/lib/research'
import { getPendingIdeas } from '@/lib/idea-store'
import type { IdeaCandidate, ScoredArticle } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

interface RouteContext {
  params: Promise<{ date: string }>
}

/** Maps a pending local-history idea onto the ScoredArticle shape the blog
 * picker renders. The idea id is preserved so /api/blog/publish can resolve
 * the full IdeaCandidate (story brief included) from the idea store. */
function historyIdeaToArticle(idea: IdeaCandidate): ScoredArticle {
  return {
    id: idea.id,
    title: idea.title,
    url: idea.sourceUrls[0] ?? '',
    content: idea.researchData ?? idea.angle,
    publishedDate: idea.createdAt,
    source: idea.sourceDomains[0],
    relevanceScore: Math.max(1, Math.min(10, Math.round(idea.score.total / 10))),
    category: 'local-history',
    whyItMatters: idea.whyItMatters,
  }
}

async function pendingHistoryArticles(): Promise<ScoredArticle[]> {
  try {
    const pending = await getPendingIdeas()
    return pending.filter((i) => i.category === 'local-history').map(historyIdeaToArticle)
  } catch (err) {
    console.error('[api/articles] Failed to load local-history ideas:', err instanceof Error ? err.message : err)
    return []
  }
}

/**
 * GET /api/articles/[date]?secret=...   (date: YYYY-MM-DD)
 * Returns { articles: ScoredArticle[] } for that date.
 *
 * Reads from the Redis cache `hps:articles:{date}` via `loadArticles()` in
 * `@/lib/store` (the same cache `fetchAndScoreArticles()` in `@/lib/research`
 * writes to). If nothing is cached for that date, falls back to fetching
 * fresh via `fetchAndScoreArticles()` — this only happens for a date with no
 * prior research run (e.g. re-requesting today's articles before the daily
 * research job has stored anything yet).
 */
export async function GET(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { date } = await context.params
  if (!DATE_RE.test(date)) {
    return NextResponse.json({ error: 'date must be in YYYY-MM-DD format' }, { status: 400 })
  }

  try {
    const cached = await loadArticles(date)
    const articles: ScoredArticle[] = cached ? cached.articles : await fetchAndScoreArticles()
    // Local-history story ideas live in the idea queue, not the daily article
    // cache — surface pending ones here too so the blog picker shows them.
    const merged = [...articles, ...(await pendingHistoryArticles())]
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
    return NextResponse.json({ articles: merged })
  } catch (err: unknown) {
    console.error('[api/articles/[date]][GET]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

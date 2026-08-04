import { NextRequest, NextResponse } from 'next/server'
import { loadArticles } from '@/lib/store'
import { fetchAndScoreArticles } from '@/lib/research'
import type { ScoredArticle } from '@/lib/types'

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
    if (cached) {
      return NextResponse.json({ articles: cached.articles })
    }

    // No cached research for this date yet — fetch fresh as a fallback.
    const articles: ScoredArticle[] = await fetchAndScoreArticles()
    return NextResponse.json({ articles })
  } catch (err: unknown) {
    console.error('[api/articles/[date]][GET]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

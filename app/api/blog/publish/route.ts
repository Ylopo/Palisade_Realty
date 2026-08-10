import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import fs from 'fs'
import path from 'path'
import { loadArticles, recordShownArticles } from '@/lib/store'
import { fetchAndScoreArticles } from '@/lib/research'
import { writePostFromIdea } from '@/lib/idea-writer'
import { publishBlogPost } from '@/lib/sanity/write'
import { checkFairHousing, saveFHResult } from '@/lib/fair-housing'
import { buildWeekId, getIdea, updateIdeaStatus } from '@/lib/idea-store'
import type { ScoredArticle, IdeaCandidate } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // writing several posts can take a couple minutes total

interface PublishBody {
  date?: string
  articleIds?: string[]
  secret?: string
}

/**
 * Auth supports both `?secret=` (query param — the convention used by the
 * other admin routes) and a `secret` field in the JSON body — the existing
 * `app/admin/blog-picker/[date]/page.tsx` consumer sends it in the body.
 */
function isAuthorized(request: NextRequest, body: PublishBody): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return false
  const querySecret = request.nextUrl.searchParams.get('secret')
  return querySecret === adminSecret || body.secret === adminSecret
}

function readLearnings(): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'LEARNINGS.md'), 'utf-8')
  } catch {
    return ''
  }
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/**
 * Approach (a) from the build spec: `writePostFromIdea` expects an
 * `IdeaCandidate`, not a `ScoredArticle`, so this builds a minimal
 * IdeaCandidate-shaped wrapper around the article's existing fields rather
 * than writing a second, simpler Claude prompt here.
 */
function articleToIdeaCandidate(article: ScoredArticle, weekId: string): IdeaCandidate {
  const now = new Date().toISOString()
  return {
    id: article.id || crypto.randomUUID(),
    weekId,
    source: 'daily-research',
    title: article.title,
    angle: article.whyItMatters,
    whyItMatters: article.whyItMatters,
    category: article.category,
    audiences: ['buyer', 'seller', 'homeowner'],
    contentType: 'News',
    urgency: 'timely',
    score: {
      total: 0,
      localRelevance: 0,
      timeliness: 0,
      formatFit: 0,
      audienceValue: 0,
      sourceCredibility: 0,
      novelty: 0,
      seoPotential: 0,
    },
    sourceUrls: [article.url],
    sourceDomains: [domainOf(article.url)],
    sourceLabels: [article.source ?? domainOf(article.url)],
    researchData: article.content,
    status: 'approved',
    reviewedAt: now,
    createdAt: now,
  }
}

/**
 * POST /api/blog/publish?secret=...
 * Body: { date, articleIds, secret? }
 *
 * For each selected article (fetched the same way as GET /api/articles/[date]):
 * builds a minimal IdeaCandidate wrapper, writes the post via
 * `writePostFromIdea`, publishes it to Sanity (`media_pending`), then runs
 * the mandatory Fair Housing check and persists the result — mirroring the
 * exact order used by the sibling `app/api/content/ideas/approve` route.
 * A single article failing does not abort the batch; it's skipped and logged.
 */
export async function POST(request: NextRequest) {
  let body: PublishBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isAuthorized(request, body)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { date, articleIds } = body
  if (!date || typeof date !== 'string') {
    return NextResponse.json({ error: 'date is required' }, { status: 400 })
  }
  if (!Array.isArray(articleIds) || articleIds.length === 0) {
    return NextResponse.json({ error: 'articleIds must be a non-empty array' }, { status: 400 })
  }

  try {
    const cached = await loadArticles(date)
    const articles: ScoredArticle[] = cached ? cached.articles : await fetchAndScoreArticles()

    const selectedIds = new Set(articleIds)
    const selected = articles.filter((a) => selectedIds.has(a.id))
    const unselected = articles.filter((a) => !selectedIds.has(a.id))

    // Local-history picks aren't in the daily article cache — the picker
    // surfaces them from the idea queue, so resolve the full IdeaCandidate
    // (story brief, sources, contentType) from the idea store directly.
    const historyIdeas: IdeaCandidate[] = []
    for (const id of articleIds) {
      if (!id.startsWith('localhist-') || selected.some((a) => a.id === id)) continue
      const idea = await getIdea(id)
      if (idea) historyIdeas.push(idea)
    }

    if (selected.length === 0 && historyIdeas.length === 0) {
      return NextResponse.json({ error: 'None of the given articleIds match this date\'s articles' }, { status: 404 })
    }

    const weekId = buildWeekId(new Date(date))
    const learningsContext = readLearnings()

    const published: Array<{ title: string; slug: string; postId: string }> = []
    const failed: Array<{ articleId: string; error: string }> = []

    const candidates: IdeaCandidate[] = [
      ...selected.map((a) => articleToIdeaCandidate(a, weekId)),
      ...historyIdeas.map((i) => ({ ...i, status: 'approved' as const, reviewedAt: new Date().toISOString() })),
    ]

    for (const idea of candidates) {
      try {

        // 1. Write the blog post
        const draft = await writePostFromIdea(idea, learningsContext)

        // 2. Publish to Sanity as media_pending
        const postId = await publishBlogPost(draft)

        // 3. Mandatory Fair Housing check (non-blocking — never fails the publish)
        try {
          const fhContent = [
            draft.title,
            draft.excerpt,
            ...draft.body.map((b) => b.children?.map((c) => c.text ?? '').join('') ?? ''),
          ]
            .filter(Boolean)
            .join('\n')
          const fhResult = await checkFairHousing(fhContent, 'blog-post')
          await saveFHResult(postId, fhResult)
        } catch (fhErr) {
          console.error('[api/blog/publish] FH check failed:', fhErr instanceof Error ? fhErr.message : fhErr)
        }

        published.push({ title: draft.title, slug: draft.slug, postId })

        // A published local-history idea leaves the idea-review queue too.
        if (idea.id.startsWith('localhist-')) {
          await updateIdeaStatus(idea.id, 'approved').catch((e) =>
            console.error('[api/blog/publish] updateIdeaStatus failed:', e)
          )
        }
      } catch (articleErr) {
        console.error('[api/blog/publish] article failed:', idea.id, articleErr)
        failed.push({
          articleId: idea.id,
          error: articleErr instanceof Error ? articleErr.message : 'Unknown error',
        })
      }
    }

    // Best-effort: mark the articles the operator saw but didn't pick, so
    // future research runs can de-prioritize repeatedly-skipped sources.
    if (unselected.length > 0) {
      await recordShownArticles(unselected.map((a) => a.url)).catch((e) =>
        console.error('[api/blog/publish] recordShownArticles failed:', e)
      )
    }

    if (published.length === 0) {
      return NextResponse.json({ error: 'All selected articles failed to publish', failed }, { status: 500 })
    }

    return NextResponse.json({ success: true, published, ...(failed.length > 0 ? { failed } : {}) })
  } catch (err: unknown) {
    console.error('[api/blog/publish][POST]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

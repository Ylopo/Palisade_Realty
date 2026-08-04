import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { writeClient } from '@/lib/sanity/client'
import { portableTextToMarkdown, markdownToPortableText } from '@/lib/portable-text-utils'
import type { RefreshAction, RefreshTier } from '@/lib/refresh-engine'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface RefreshApproveBody {
  postId?: string
  playbook?: string[]
  action?: RefreshAction
  refreshTier?: RefreshTier
  secret?: string
}

/**
 * Auth supports both `?secret=` (query param — the convention used by the
 * other `/api/content/*` admin routes) and a `secret` field in the JSON
 * body, since it's unconfirmed which the admin refresh-queue page will use.
 */
function isAuthorized(request: NextRequest, body: RefreshApproveBody): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return false
  const querySecret = request.nextUrl.searchParams.get('secret')
  return querySecret === adminSecret || body.secret === adminSecret
}

interface PostForRefresh {
  _id: string
  title: string
  slug: string | null
  category: string | null
  body?: Array<Record<string, unknown>>
  refreshCount?: number
}

const POST_QUERY = `*[_id == $postId][0]{
  _id,
  title,
  "slug": slug.current,
  category,
  body,
  refreshCount
}`

function stripJsonFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
}

/**
 * POST /api/content/refresh-approve?secret=...
 * Body: { postId, playbook, action, refreshTier, secret? }
 *
 * Fetches the post's current body, has Claude rewrite it applying the given
 * playbook checklist (keeping the same title/slug/facts, just freshening
 * dated content), then patches the post: `body`, `lastRefreshedAt` = now,
 * `refreshCount` += 1.
 */
export async function POST(request: NextRequest) {
  let body: RefreshApproveBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isAuthorized(request, body)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId, playbook } = body
  if (!postId || typeof postId !== 'string') {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }
  if (!Array.isArray(playbook) || playbook.length === 0) {
    return NextResponse.json({ error: 'playbook must be a non-empty array of strings' }, { status: 400 })
  }

  try {
    const post = await writeClient.fetch<PostForRefresh | null>(POST_QUERY, { postId })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    if (!post.slug) {
      return NextResponse.json({ error: 'Post has no slug' }, { status: 400 })
    }

    const currentMarkdown = post.body ? portableTextToMarkdown(post.body) : ''

    const prompt = `You are refreshing an existing published blog post for Palisade Realty, a San Diego, CA real estate brokerage. Your job is to update the post's content — NOT to change its title, topic, structure, or overall intent — applying the specific refresh checklist below.

REFRESH CHECKLIST (apply these, and only these kinds of changes):
${playbook.map((item) => `- ${item}`).join('\n')}

RULES:
- Keep the same headings structure (## and ### markdown headings), the same overall length, and the same voice.
- Preserve any [text](url) links and [SELLER_CTA: text] macros exactly as they appear, unless a checklist item explicitly asks you to fix a broken one.
- Only change what the checklist calls for — dated statistics, dollar figures, rates, and similar time-sensitive facts. Do not rewrite unrelated sentences.
- If you don't have a verified current figure to replace an outdated one with, soften the specific number into a general statement rather than inventing a new number.
- Category: ${post.category ?? 'uncategorized'}

CURRENT POST BODY (markdown):
"""
${currentMarkdown}
"""

Respond with ONLY the full updated post body as markdown (## / ### headings, [text](url) links, [SELLER_CTA: text] macros, plain paragraphs) — no JSON, no commentary, no code fences.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0]?.type === 'text' ? message.content[0].text : ''
    const updatedMarkdown = stripJsonFences(raw).trim()
    if (!updatedMarkdown) {
      return NextResponse.json({ error: 'Claude returned an empty rewrite' }, { status: 502 })
    }

    const updatedBody = markdownToPortableText(updatedMarkdown)

    await writeClient
      .patch(postId)
      .setIfMissing({ refreshCount: 0 })
      .set({
        body: updatedBody,
        lastRefreshedAt: new Date().toISOString(),
      })
      .inc({ refreshCount: 1 })
      .commit()

    return NextResponse.json({ success: true, slug: post.slug, title: post.title })
  } catch (err: unknown) {
    console.error('[api/content/refresh-approve][POST]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

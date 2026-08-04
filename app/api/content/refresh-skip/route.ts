import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SKIP_TTL_SECONDS = 30 * 24 * 60 * 60 // 30 days

interface RefreshSkipBody {
  postId?: string
  secret?: string
}

/** Same query-param-or-body-secret pattern as refresh-approve, for consistency. */
function isAuthorized(request: NextRequest, body: RefreshSkipBody): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return false
  const querySecret = request.nextUrl.searchParams.get('secret')
  return querySecret === adminSecret || body.secret === adminSecret
}

function skipKey(postId: string): string {
  return `hps:refresh:skip:${postId}`
}

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN')
  return new Redis({ url, token })
}

/**
 * POST /api/content/refresh-skip?secret=...
 * Body: { postId, secret? }
 *
 * Snoozes a post out of the refresh queue for 30 days via a Redis TTL key —
 * no persistent Sanity change. `evaluateRefreshCandidates()` in
 * lib/refresh-engine.ts checks this key and excludes the post while it's set.
 */
export async function POST(request: NextRequest) {
  let body: RefreshSkipBody
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
    const redis = getRedis()
    await redis.set(skipKey(postId), '1', { ex: SKIP_TTL_SECONDS })
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('[api/content/refresh-skip][POST]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

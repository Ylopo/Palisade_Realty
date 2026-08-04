import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/**
 * POST /api/content/schedule?secret=...
 * Body: { postId, scheduledPublishAt, videoUrl?, videoThumbnailUrl? }
 *
 * Moves a post to workflowStatus: 'scheduled' with a future publish time.
 * The cron scheduled-publish job picks it up when scheduledPublishAt <= now().
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: unknown; scheduledPublishAt?: unknown; videoUrl?: unknown; videoThumbnailUrl?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postId, scheduledPublishAt, videoUrl, videoThumbnailUrl } = body
  if (typeof postId !== 'string' || postId.length === 0) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }
  if (typeof scheduledPublishAt !== 'string' || scheduledPublishAt.length === 0) {
    return NextResponse.json({ error: 'scheduledPublishAt is required' }, { status: 400 })
  }
  if (Number.isNaN(new Date(scheduledPublishAt).getTime()) || new Date(scheduledPublishAt) <= new Date()) {
    return NextResponse.json({ error: 'scheduledPublishAt must be a valid future date' }, { status: 400 })
  }

  try {
    const patch: Record<string, unknown> = { workflowStatus: 'scheduled', scheduledPublishAt }
    if (typeof videoUrl === 'string' && videoUrl) patch.videoUrl = videoUrl
    if (typeof videoThumbnailUrl === 'string' && videoThumbnailUrl) patch.videoThumbnailUrl = videoThumbnailUrl

    await writeClient.patch(postId).set(patch).commit()

    return NextResponse.json({ ok: true, scheduledPublishAt })
  } catch (err) {
    console.error('[schedule] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to schedule' }, { status: 500 })
  }
}

/**
 * DELETE /api/content/schedule?secret=...
 * Body: { postId }
 *
 * Cancels a pending schedule — reverts the post to 'media_ready' and clears
 * scheduledPublishAt.
 */
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postId } = body
  if (typeof postId !== 'string' || postId.length === 0) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  try {
    await writeClient.patch(postId).set({ workflowStatus: 'media_ready' }).unset(['scheduledPublishAt']).commit()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[schedule] Cancel error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to cancel schedule' }, { status: 500 })
  }
}

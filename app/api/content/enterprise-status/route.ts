import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeClient } from '@/lib/sanity/client'
import { getRenderStatus } from '@/lib/enterprise-video'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/**
 * GET /api/content/enterprise-status?secret=...&videoId=...&postId=...
 *
 * Polls the Enterprise render platform for job status. On completion, the
 * platform's videoUrl may be temporary, so the video bytes are re-uploaded into
 * Vercel Blob to get a permanent public URL before Sanity is patched — mirroring
 * the same "never trust a third-party URL to stay alive" rule used for scene
 * images in save-scenes.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const videoId = request.nextUrl.searchParams.get('videoId')
  const postId = request.nextUrl.searchParams.get('postId')
  if (!videoId) {
    return NextResponse.json({ error: 'videoId is required' }, { status: 400 })
  }
  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  try {
    const result = await getRenderStatus(videoId)

    if (result.status === 'completed') {
      const upstream = await fetch(result.videoUrl)
      if (!upstream.ok) {
        throw new Error(
          `enterprise-status: failed to fetch completed video bytes (${upstream.status})`
        )
      }
      const arrayBuffer = await upstream.arrayBuffer()
      const bytes = Buffer.from(arrayBuffer)

      const blob = await put(`enterprise-${videoId}.mp4`, bytes, {
        access: 'public',
        contentType: 'video/mp4',
      })

      await writeClient
        .patch(postId)
        .set({
          videoUrl: blob.url,
          enterpriseVideoStatus: 'completed',
        })
        .commit()

      return NextResponse.json({
        status: 'completed',
        videoUrl: blob.url,
        durationSeconds: result.durationSeconds,
      })
    }

    if (result.status === 'failed') {
      await writeClient
        .patch(postId)
        .set({ enterpriseVideoStatus: 'failed' })
        .commit()

      return NextResponse.json({ status: 'failed', error: result.error })
    }

    // processing — nothing to patch.
    return NextResponse.json({ status: 'processing' })
  } catch (err: unknown) {
    console.error('[api/content/enterprise-status]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

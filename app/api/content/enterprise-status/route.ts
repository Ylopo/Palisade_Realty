import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeClient } from '@/lib/sanity/client'
import { getRenderStatus } from '@/lib/enterprise-video'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// The completed-branch downloads the finished video and re-uploads it to Blob
// — minutes of transfer for a large render. Without this, the platform default
// kills the function mid-transfer, the admin's poll loop silently retries the
// same doomed download every 15s, and the UI reports a timeout even though the
// render finished.
export const maxDuration = 300

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
    // Idempotency short-circuit: if a prior poll already downloaded, re-hosted,
    // and saved this render, don't do the expensive transfer again.
    const saved = await writeClient.fetch<{ enterpriseVideoStatus?: string; videoUrl?: string } | null>(
      `*[_id == $postId][0]{ enterpriseVideoStatus, videoUrl }`,
      { postId }
    )
    if (saved?.enterpriseVideoStatus === 'completed' && saved.videoUrl) {
      return NextResponse.json({ status: 'completed', videoUrl: saved.videoUrl })
    }

    const result = await getRenderStatus(videoId)

    if (result.status === 'completed') {
      const upstream = await fetch(result.videoUrl)
      if (!upstream.ok || !upstream.body) {
        throw new Error(
          `enterprise-status: failed to fetch completed video bytes (${upstream.status})`
        )
      }

      // Stream straight through to Blob — buffering the whole video in memory
      // risks the function's memory limit on larger renders.
      const blob = await put(`enterprise-${videoId}.mp4`, upstream.body, {
        access: 'public',
        contentType: 'video/mp4',
        multipart: true,
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

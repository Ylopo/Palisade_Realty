import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/**
 * POST /api/content/mark-ready?secret=...
 * multipart/form-data fields: postId, socialCopy, videoScript, videoUrl,
 * videoThumbnailUrl, and an optional `image` file.
 *
 * If an image file is present it's uploaded to Sanity assets and set as the
 * post's coverImage. The post is then patched with whichever fields were
 * provided and moved to workflowStatus: 'media_ready'.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const postId = form.get('postId') as string | null
  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  const socialCopy = form.get('socialCopy') as string | null
  const videoScript = form.get('videoScript') as string | null
  const videoUrl = form.get('videoUrl') as string | null
  const videoThumbnailUrl = form.get('videoThumbnailUrl') as string | null
  const imageFile = form.get('image') as File | null

  try {
    const patch: Record<string, unknown> = { workflowStatus: 'media_ready' }
    if (socialCopy !== null) patch.socialCopy = socialCopy
    if (videoScript !== null) patch.videoScript = videoScript
    if (videoUrl !== null) patch.videoUrl = videoUrl
    if (videoThumbnailUrl !== null) patch.videoThumbnailUrl = videoThumbnailUrl

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: imageFile.name || `cover-${postId}-${Date.now()}.jpg`,
      })
      patch.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    }

    await writeClient.patch(postId).set(patch).commit()

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[mark-ready] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to mark ready' }, { status: 500 })
  }
}

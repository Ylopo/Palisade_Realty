import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'
import { publishToYouTube, publishToTikTok } from '@/lib/oneup-client'
import { generatePlatformCaptions, buildTikTokCaption, type SanityBlogPost } from '@/lib/publish-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

type PostFields = Pick<SanityBlogPost, 'title' | 'excerpt' | 'category'> & {
  slug: string
  socialCopy?: string
}

function appBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim())
    ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '')
    : 'https://www.palisaderealty.com'
}

/**
 * POST /api/content/publish-video?secret=...
 * Body: { postId: string, videoUrl: string, videoThumbnailUrl?: string }
 *
 * Republishes just the video for an ALREADY-published post — e.g. swapping
 * in a corrected render. Only the video-capable platforms (YouTube, TikTok)
 * are touched; the website content and any existing Facebook/LinkedIn/X
 * posts are left alone.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: unknown; videoUrl?: unknown; videoThumbnailUrl?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postId, videoUrl, videoThumbnailUrl } = body
  if (typeof postId !== 'string' || postId.length === 0) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }
  if (typeof videoUrl !== 'string' || videoUrl.length === 0) {
    return NextResponse.json({ error: 'videoUrl is required' }, { status: 400 })
  }
  const thumbnailUrl = typeof videoThumbnailUrl === 'string' && videoThumbnailUrl ? videoThumbnailUrl : undefined

  try {
    const post = await writeClient.fetch<PostFields | null>(
      `*[_id==$postId][0]{title,excerpt,category,"slug":slug.current,socialCopy}`,
      { postId },
    )
    if (!post) {
      return NextResponse.json({ error: `Post ${postId} not found` }, { status: 404 })
    }

    // Persist the new video URL before republishing, so a failed platform
    // call still leaves the post pointing at the corrected video.
    const patch: Record<string, unknown> = { videoUrl }
    if (thumbnailUrl) patch.videoThumbnailUrl = thumbnailUrl
    await writeClient.patch(postId).set(patch).commit()

    const articleUrl = `${appBaseUrl()}/blog/${post.slug}`

    const captions = post.socialCopy
      ? { youtube: post.socialCopy, tiktok: post.socialCopy }
      : await generatePlatformCaptions(post)

    const ytDescription = `${captions.youtube}\n\n${articleUrl}`
    const tiktokCaption = buildTikTokCaption(captions.tiktok, post.category, articleUrl)

    const [ytOutcome, ttOutcome] = await Promise.allSettled([
      publishToYouTube(post.title, ytDescription, videoUrl, thumbnailUrl),
      publishToTikTok(tiktokCaption, videoUrl),
    ])

    const youtube = ytOutcome.status === 'fulfilled'
      ? { postSubmissionId: ytOutcome.value.postSubmissionId }
      : { error: ytOutcome.reason instanceof Error ? ytOutcome.reason.message : 'YouTube publish failed' }

    const tiktok = ttOutcome.status === 'fulfilled'
      ? { postSubmissionId: ttOutcome.value.postSubmissionId }
      : { error: ttOutcome.reason instanceof Error ? ttOutcome.reason.message : 'TikTok publish failed' }

    if ('error' in youtube) console.error('[publish-video] YouTube error:', youtube.error)
    if ('error' in tiktok) console.error('[publish-video] TikTok error:', tiktok.error)

    const idPatch: Record<string, unknown> = {}
    if ('postSubmissionId' in youtube) idPatch.youtubePostSubmissionId = youtube.postSubmissionId
    if ('postSubmissionId' in tiktok) idPatch.tiktokPostSubmissionId = tiktok.postSubmissionId
    if (Object.keys(idPatch).length > 0) {
      await writeClient.patch(postId).set(idPatch).commit()
    }

    return NextResponse.json({ ok: true, youtube, tiktok })
  } catch (err) {
    console.error('[publish-video] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to publish video' }, { status: 500 })
  }
}

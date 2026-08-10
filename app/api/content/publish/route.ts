import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { client, writeClient } from '@/lib/sanity/client'
import { waitForCdn } from '@/lib/sanity/cdn-sync'
import { getVAQueuePost } from '@/lib/sanity/queries'
import { publishPostToAll } from '@/lib/publish-service'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { postId, socialCopy, videoUrl, videoThumbnailUrl } = body as {
    postId: string
    socialCopy?: string
    videoUrl?: string
    videoThumbnailUrl?: string
  }

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  // Save videoUrl to Sanity before fetching the post — covers the case where
  // the video was uploaded after mark-ready so it's not in Sanity yet.
  if (videoUrl) {
    await writeClient
      .patch(postId)
      .set({
        videoUrl,
        ...(videoThumbnailUrl ? { videoThumbnailUrl } : {}),
      })
      .commit()
  }

  const post = await getVAQueuePost(postId)
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // Override videoUrl in case the Sanity CDN hasn't propagated the write yet.
  if (videoUrl) {
    post.videoUrl = videoUrl
    if (videoThumbnailUrl) post.videoThumbnailUrl = videoThumbnailUrl
  }

  if (!['media_ready', 'publish_failed'].includes(post.workflowStatus ?? '')) {
    return NextResponse.json(
      { error: `Post is not ready to publish (status: ${post.workflowStatus})` },
      { status: 400 }
    )
  }

  const result = await publishPostToAll(post, socialCopy)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  // This client publishes to all 6 platforms (source predates the OneUp
  // LinkedIn/X integration, so it only tracked 4).
  await writeClient.patch(postId).set({ workflowStatus: 'published' }).commit()

  // Blog pages use hour-long ISR — refresh them now so the post shows up
  // on the site immediately instead of whenever the cache next expires.
  // Wait for Sanity's CDN (which the public pages read) to see the status
  // flip first, or the revalidated render re-caches the pre-publish state.
  await waitForCdn(async () => {
    const status = await client.fetch(`*[_id == $postId][0].workflowStatus`, { postId })
    return status === 'published'
  })
  revalidatePath('/blog')
  revalidatePath(`/blog/${post.slug}`)

  return NextResponse.json({
    ok: true,
    facebook: result.facebook,
    facebookReel: result.facebookReel,
    youtube: result.youtube,
    tiktok: result.tiktok,
    instagram: result.instagram,
    linkedin: result.linkedin,
    x: result.x,
  })
}

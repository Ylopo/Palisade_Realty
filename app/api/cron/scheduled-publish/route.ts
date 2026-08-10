import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { writeClient } from '@/lib/sanity/client'
import { getVAQueuePost } from '@/lib/sanity/queries'
import { publishPostToAll } from '@/lib/publish-service'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Vercel cron: GET with Bearer CRON_SECRET
// Not in the source repo's file list, but required by the "schedule for
// later" feature referenced in vercel.json — sweeps for blogPost documents
// whose scheduledPublishAt has come due and publishes them.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // @/lib/sanity/queries doesn't (yet) export a getScheduledPostsDue() — the
  // due-post lookup is written inline here per the task spec.
  const duePosts = await writeClient.fetch<Array<{ _id: string; socialCopy?: string }>>(
    `*[_type == "blogPost" && workflowStatus == "scheduled" && scheduledPublishAt <= now()]{ _id, socialCopy }`
  )

  if (duePosts.length === 0) {
    return NextResponse.json({ published: 0, failed: 0 })
  }

  let published = 0
  let failed = 0

  for (const stub of duePosts) {
    try {
      const post = await getVAQueuePost(stub._id)
      if (!post) {
        failed++
        continue
      }

      const result = await publishPostToAll(post, stub.socialCopy)

      if (result.ok) {
        published++
        await writeClient.patch(stub._id).set({ workflowStatus: 'published' }).commit()
        // Blog pages use hour-long ISR — refresh them so the post shows up now.
        revalidatePath('/blog')
        revalidatePath(`/blog/${post.slug}`)
        console.log(`[scheduled-publish] Published: ${post.title}`)
      } else {
        failed++
        await writeClient.patch(stub._id).set({ workflowStatus: 'publish_failed' }).commit()
        console.error(`[scheduled-publish] Failed: ${post.title} — ${result.error}`)
      }
    } catch (e) {
      failed++
      try {
        await writeClient.patch(stub._id).set({ workflowStatus: 'publish_failed' }).commit()
      } catch {
        /* best-effort status patch */
      }
      console.error(`[scheduled-publish] Error on ${stub._id}:`, e instanceof Error ? e.message : e)
    }
  }

  return NextResponse.json({ published, failed, total: duePosts.length })
}

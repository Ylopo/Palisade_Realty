import { writeClient } from '@/lib/sanity/client'
import type { BlogPostDraft } from '@/lib/types'

/**
 * Creates a new `blogPost` Sanity document from a generated draft.
 * Lands in the workflow at `media_pending` — the VA queue picks it up next
 * for cover image / video before it's eligible to publish.
 */
export async function publishBlogPost(draft: BlogPostDraft): Promise<string> {
  const existingSlug = await writeClient.fetch<string | null>(
    `*[_type == "blogPost" && slug.current == $slug][0]._id`,
    { slug: draft.slug }
  )

  const finalSlug = existingSlug ? `${draft.slug}-${Date.now()}` : draft.slug

  const result = await writeClient.create({
    _type: 'blogPost',
    title: draft.title,
    slug: { _type: 'slug', current: finalSlug },
    publishedAt: new Date().toISOString(),
    category: draft.category,
    excerpt: draft.excerpt,
    body: draft.body,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    authorName: 'Hedda Parashos',
    aiGenerated: true,
    workflowStatus: 'media_pending',
    ...(draft.vaQueuePriority ? { vaQueuePriority: draft.vaQueuePriority } : {}),
  })

  return result._id
}

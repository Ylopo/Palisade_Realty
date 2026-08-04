import { groq } from 'next-sanity'
import { writeClient } from '@/lib/sanity/client'

// ── Blog (public marketing site) ─────────────────────────────────────────────
// Both queries target the content-machine `blogPost` document type and only
// surface posts that have cleared the workflow (workflowStatus == "published").

export const ALL_POSTS_QUERY = groq`
  *[_type == "blogPost" && workflowStatus == "published"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    publishedAt,
    excerpt,
    authorName,
    "coverImage": coverImage.asset->url,
  }
`

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "blogPost" && workflowStatus == "published" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    publishedAt,
    excerpt,
    authorName,
    "coverImage": coverImage.asset->url,
    body,
  }
`

// ── VA / content-machine admin queries ───────────────────────────────────────
// These read via `writeClient` (no CDN, sees drafts/non-published statuses)
// since every query here deliberately includes workflowStatus values the
// public CDN client should never need to serve.

const VA_QUEUE_QUERY = groq`
  *[_type == "blogPost" && workflowStatus != "published"] | order(coalesce(vaQueuePriority, 0) desc, _createdAt desc) {
    _id,
    title,
    category,
    workflowStatus,
    vaQueuePriority,
    "coverImage": coverImage.asset->url,
    publishedAt,
    scheduledPublishAt,
    videoUrl,
    "_createdAt": _createdAt
  }
`

export async function getVAQueue() {
  return writeClient.fetch(VA_QUEUE_QUERY)
}

// NOTE: the "..." spread alone is not enough — a re-opened post will silently
// fail to hydrate its saved video scenes / locked look unless videoScenes,
// videoThumbnailUrl, and videoLookId are also explicitly projected below.
const VA_QUEUE_POST_QUERY = groq`
  *[_id == $postId][0]{
    ...,
    "coverImage": coverImage.asset->url,
    videoScenes,
    videoThumbnailUrl,
    videoLookId
  }
`

export async function getVAQueuePost(postId: string) {
  return writeClient.fetch(VA_QUEUE_POST_QUERY, { postId })
}

// Counts grouped by workflowStatus. workflowStatus is a fixed, known list
// (see blogPost.ts), so each bucket is projected explicitly rather than via
// a runtime group-by (GROQ has no native aggregation-by-field operator).
const QUEUE_COUNTS_QUERY = groq`
  {
    "media_pending": count(*[_type == "blogPost" && workflowStatus == "media_pending"]),
    "media_ready": count(*[_type == "blogPost" && workflowStatus == "media_ready"]),
    "publish_pending": count(*[_type == "blogPost" && workflowStatus == "publish_pending"]),
    "publishing": count(*[_type == "blogPost" && workflowStatus == "publishing"]),
    "scheduled": count(*[_type == "blogPost" && workflowStatus == "scheduled"]),
    "published": count(*[_type == "blogPost" && workflowStatus == "published"]),
    "publish_failed": count(*[_type == "blogPost" && workflowStatus == "publish_failed"])
  }
`

export async function getQueueCounts() {
  return writeClient.fetch(QUEUE_COUNTS_QUERY)
}

// now()[0..6] yields the "YYYY-MM" prefix of the current UTC timestamp, so
// string::startsWith(publishedAt, ...) scopes both counts to the current
// calendar month without needing a client-supplied date param.
const MONTHLY_PUBLISH_STATS_QUERY = groq`
  {
    "published": count(*[
      _type == "blogPost" &&
      workflowStatus == "published" &&
      string::startsWith(publishedAt, now()[0..6])
    ]),
    "videoPosts": count(*[
      _type == "blogPost" &&
      workflowStatus == "published" &&
      defined(videoUrl) &&
      string::startsWith(publishedAt, now()[0..6])
    ])
  }
`

export async function getMonthlyPublishStats() {
  return writeClient.fetch<{ published: number; videoPosts: number }>(MONTHLY_PUBLISH_STATS_QUERY)
}

const SCHEDULED_POSTS_DUE_QUERY = groq`
  *[_type == "blogPost" && workflowStatus == "scheduled" && scheduledPublishAt <= now()]
`

export async function getScheduledPostsDue() {
  return writeClient.fetch(SCHEDULED_POSTS_DUE_QUERY)
}

// ── Category display-bucket mapping ─────────────────────────────────────────
export { categoryToDisplayBucket, type DisplayBucket } from '@/lib/blog/category-map'

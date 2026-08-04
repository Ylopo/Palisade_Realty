import { groq } from 'next-sanity'

// ── Blog ────────────────────────────────────────────────────────────────────

export const ALL_POSTS_QUERY = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    publishedAt,
    excerpt,
    author,
    readTime,
    "coverImage": coverImage.asset->url,
  }
`

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    publishedAt,
    excerpt,
    author,
    readTime,
    "coverImage": coverImage.asset->url,
    body,
  }
`

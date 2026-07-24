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

// ── Team / Agents ────────────────────────────────────────────────────────────

export const ALL_AGENTS_QUERY = groq`
  *[_type == "agent"] | order(isLeadership desc, order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    title,
    isLeadership,
    "photo": photo.asset->url,
    email,
    phone,
    bio,
    areasServed,
  }
`

export const AGENT_BY_SLUG_QUERY = groq`
  *[_type == "agent" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    title,
    isLeadership,
    "photo": photo.asset->url,
    email,
    phone,
    bio,
    areasServed,
  }
`

// ── Testimonials ─────────────────────────────────────────────────────────────

export const ALL_TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial"] | order(publishedAt desc) {
    _id,
    clientName,
    location,
    rating,
    body,
    agentName,
    transactionType,
    publishedAt,
    featured,
  }
`

export const FEATURED_TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial" && featured == true] | order(publishedAt desc) [0...6] {
    _id,
    clientName,
    location,
    rating,
    body,
    agentName,
    transactionType,
  }
`

// ── Featured Properties ──────────────────────────────────────────────────────

export const ALL_FEATURED_PROPERTIES_QUERY = groq`
  *[_type == "featuredProperty" && status == "active"] | order(order asc) {
    _id,
    address,
    "slug": slug.current,
    city,
    state,
    zip,
    mls,
    price,
    beds,
    baths,
    sqft,
    lotSize,
    yearBuilt,
    neighborhood,
    communitySlug,
    tagline,
    description,
    features,
    heroImage,
    gallery,
    ylopoDetailUrl,
    agentName,
    status,
  }
`

export const PROPERTY_BY_SLUG_QUERY = groq`
  *[_type == "featuredProperty" && slug.current == $slug][0] {
    _id,
    address,
    "slug": slug.current,
    city,
    state,
    zip,
    mls,
    price,
    beds,
    baths,
    sqft,
    lotSize,
    yearBuilt,
    neighborhood,
    communitySlug,
    tagline,
    description,
    features,
    heroImage,
    gallery,
    ylopoDetailUrl,
    agentName,
    status,
  }
`

export const CAROUSEL_PROPERTIES_QUERY = groq`
  *[_type == "featuredProperty" && featured == true && status == "active"] | order(order asc) [0...6] {
    _id,
    address,
    "slug": slug.current,
    city,
    state,
    price,
    beds,
    baths,
    sqft,
    tagline,
    heroImage,
    ylopoDetailUrl,
    status,
  }
`

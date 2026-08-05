import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { getAllPropertySlugs } from '@/lib/property-data'
import { getAllCommunitySlugs } from '@/lib/community-data'
import { getAllNeighborhoodParams } from '@/lib/neighborhood-data'
import { ALL_AGENTS } from '@/lib/agents'
import { STATIC_POSTS } from '@/lib/blog/static-posts'
import { PILLARS } from '@/lib/blog/pillars'
import { client } from '@/lib/sanity/client'
import { ALL_POSTS_QUERY } from '@/lib/sanity/queries'

const SITE_URL = 'https://www.palisaderealty.com'

// Merges all three blog sources the [slug] page itself falls back through
// (live Sanity CMS -> local JSON cache -> legacy static array) so the sitemap
// never omits a post just because one source is temporarily unreachable.
async function getBlogEntries(): Promise<{ slug: string; lastModified?: Date }[]> {
  const bySlug = new Map<string, Date | undefined>()

  try {
    const posts = await client.fetch<{ slug: string; publishedAt?: string }[]>(ALL_POSTS_QUERY)
    for (const p of posts) {
      if (p.slug) bySlug.set(p.slug, p.publishedAt ? new Date(p.publishedAt) : undefined)
    }
  } catch {
    // Sanity unreachable at build/request time — fall through to static sources below.
  }

  try {
    const fp = path.join(process.cwd(), 'data', 'blog-posts.json')
    const local: { slug: string; publishedAt?: string }[] = JSON.parse(fs.readFileSync(fp, 'utf8'))
    for (const p of local) {
      if (!bySlug.has(p.slug)) bySlug.set(p.slug, p.publishedAt ? new Date(p.publishedAt) : undefined)
    }
  } catch {
    // ignore — local cache file missing/unreadable
  }

  for (const p of STATIC_POSTS) {
    if (!bySlug.has(p.s)) bySlug.set(p.s, new Date(p.iso))
  }

  return Array.from(bySlug.entries()).map(([slug, lastModified]) => ({ slug, lastModified }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogEntries = await getBlogEntries()

  const corePages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/communities`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/properties`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/team`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/testimonials`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const communityPages: MetadataRoute.Sitemap = getAllCommunitySlugs().map((slug) => ({
    url: `${SITE_URL}/communities/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const neighborhoodPages: MetadataRoute.Sitemap = getAllNeighborhoodParams().map(({ slug, neighborhood }) => ({
    url: `${SITE_URL}/communities/${slug}/${neighborhood}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Real estate inventory churns fast (price/status changes) — no reliable
  // lastmod source is wired up yet, so this is flagged as daily/high-priority
  // to encourage frequent re-crawl rather than asserting a false lastModified date.
  const propertyPages: MetadataRoute.Sitemap = getAllPropertySlugs().map((slug) => ({
    url: `${SITE_URL}/properties/${slug}`,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  const guidePages: MetadataRoute.Sitemap = PILLARS.map((p) => ({
    url: `${SITE_URL}/guides/${p.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const teamPages: MetadataRoute.Sitemap = ALL_AGENTS.map((a) => ({
    url: `${SITE_URL}/team/${a.slug}`,
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  const blogPages: MetadataRoute.Sitemap = blogEntries.map(({ slug, lastModified }) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...corePages, ...communityPages, ...neighborhoodPages, ...propertyPages, ...guidePages, ...teamPages, ...blogPages]
}

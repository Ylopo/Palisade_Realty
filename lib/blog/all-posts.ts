import fs from 'fs'
import path from 'path'
import { client } from '@/lib/sanity/client'
import { ALL_POSTS_QUERY } from '@/lib/sanity/queries'
import { categoryToDisplayBucket, type DisplayBucket } from './category-map'
import { STATIC_POSTS } from './static-posts'

export interface BlogPostSummary {
  slug: string
  title: string
  category: DisplayBucket
  publishedAt: string
  excerpt?: string
}

interface LocalPostRecord {
  slug: string
  title: string
  category: string
  publishedAt: string
  excerpt?: string
}

// Merges the same three sources blog/[slug]/page.tsx itself falls back through
// (live Sanity CMS -> local JSON cache -> legacy static array), so pillar pages
// and the "Related Articles" module never miss a post just because one source
// is temporarily unreachable. Mirrors the merge logic in app/sitemap.ts.
let cache: BlogPostSummary[] | null = null

export async function getAllBlogPostSummaries(): Promise<BlogPostSummary[]> {
  if (cache) return cache
  const bySlug = new Map<string, BlogPostSummary>()

  try {
    const posts = await client.fetch<{
      slug: string; title: string; category: string; publishedAt: string; excerpt?: string
    }[]>(ALL_POSTS_QUERY)
    for (const p of posts) {
      if (!p.slug) continue
      bySlug.set(p.slug, {
        slug: p.slug,
        title: p.title,
        category: categoryToDisplayBucket(p.category),
        publishedAt: p.publishedAt,
        excerpt: p.excerpt,
      })
    }
  } catch {
    // Sanity unreachable — fall through to static sources below.
  }

  try {
    const fp = path.join(process.cwd(), 'data', 'blog-posts.json')
    const local: LocalPostRecord[] = JSON.parse(fs.readFileSync(fp, 'utf8'))
    for (const p of local) {
      if (bySlug.has(p.slug)) continue
      bySlug.set(p.slug, {
        slug: p.slug,
        title: p.title,
        category: (['Seller', 'Buyer', 'Homeowner', 'General'] as const).includes(p.category as DisplayBucket)
          ? (p.category as DisplayBucket)
          : 'General',
        publishedAt: p.publishedAt,
        excerpt: p.excerpt,
      })
    }
  } catch {
    // ignore — local cache file missing/unreadable
  }

  for (const p of STATIC_POSTS) {
    if (bySlug.has(p.s)) continue
    bySlug.set(p.s, {
      slug: p.s,
      title: p.t,
      category: (['Seller', 'Buyer', 'Homeowner', 'General'] as const).includes(p.c as DisplayBucket)
        ? (p.c as DisplayBucket)
        : 'General',
      publishedAt: p.iso,
      excerpt: p.x,
    })
  }

  cache = Array.from(bySlug.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  return cache
}

export async function getPostsByCategory(categories: DisplayBucket[]): Promise<BlogPostSummary[]> {
  const all = await getAllBlogPostSummaries()
  return all.filter((p) => categories.includes(p.category))
}

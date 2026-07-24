import type { Metadata } from 'next'
import Link from 'next/link'
import BlogListing, { type Post } from './BlogListing'
import { client } from '@/lib/sanity/client'
import { ALL_POSTS_QUERY } from '@/lib/sanity/queries'
import './blog.css'

export const metadata: Metadata = {
  title: 'San Diego Real Estate Blog',
  description:
    'Expert insights on buying, selling, and owning a home in San Diego. Browse articles from the Palisade Realty team covering market trends, tips, and local community guides.',
}

export const revalidate = 3600

export default async function BlogPage() {
  let sanityPosts: Post[] = []
  try {
    const raw = await client.fetch(ALL_POSTS_QUERY)
    sanityPosts = (raw ?? []).map((p: {
      slug: string; title: string; category: string;
      publishedAt: string; excerpt?: string; coverImage?: string
    }) => ({
      s: p.slug,
      t: p.title,
      c: p.category,
      d: new Date(p.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      iso: p.publishedAt.slice(0, 10),
      x: p.excerpt ?? '',
      img: p.coverImage,
    }))
  } catch {
    // Sanity unavailable — fall through to static POSTS
  }

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="blog-hero" aria-label="Blog hero">
        <span className="blog-hero-eyebrow reveal">Resources &amp; Insights</span>
        <h1 className="blog-hero-title reveal reveal-d1">San Diego Real Estate <em>Blog</em></h1>
        <p className="blog-hero-sub reveal reveal-d2">
          Expert tips, local market insights, and practical advice for buyers, sellers, and homeowners throughout San Diego County.
        </p>
      </section>

      {/* ── BLOG LISTING (client component) ─────────────────── */}
      <BlogListing posts={sanityPosts.length > 0 ? sanityPosts : undefined} />

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="blog-cta" aria-label="Contact Palisade Realty">
        <span className="blog-cta-eyebrow">Ready to Make Your Move?</span>
        <h2 className="blog-cta-title">Expert Guidance for <em>Every Step</em></h2>
        <p className="blog-cta-sub">
          Whether you&apos;re buying your first home or selling a prized property in San Diego, our team is here to guide you every step of the way.
        </p>
        <div className="blog-cta-btns">
          <Link href="/contact" className="btn btn-brand">
            Talk to an Agent
          </Link>
          <Link href="/team" className="btn btn-outline-white">
            Meet Our Team
          </Link>
        </div>
      </section>
    </>
  )
}

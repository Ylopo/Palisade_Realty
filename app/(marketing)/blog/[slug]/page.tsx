import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/sanity/client'
import { POST_BY_SLUG_QUERY } from '@/lib/sanity/queries'
import { STATIC_POSTS } from '@/lib/blog/static-posts'

interface SanityPost {
  _id: string
  title: string
  slug: string
  category: string
  publishedAt: string
  excerpt?: string
  author?: string
  readTime?: number
  coverImage?: string
  body?: unknown[]
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  let post: SanityPost | null = null
  try { post = await client.fetch(POST_BY_SLUG_QUERY, { slug }) } catch { /* ignore */ }
  if (post) return { title: `${post.title} | Palisade Realty Blog`, description: post.excerpt }
  const staticPost = STATIC_POSTS.find((p) => p.s === slug)
  if (staticPost) return { title: `${staticPost.t} | Palisade Realty Blog`, description: staticPost.x }
  return { title: 'Blog Post | Palisade Realty' }
}

export const revalidate = 3600

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  let post: SanityPost | null = null
  try { post = await client.fetch(POST_BY_SLUG_QUERY, { slug }) } catch { /* ignore */ }

  if (!post) {
    const staticPost = STATIC_POSTS.find((p) => p.s === slug)
    if (!staticPost) {
      return (
        <section style={{ background: 'var(--brand-darker,#28000c)', padding: '80px var(--pad-x,60px) 72px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent,#eeca00)', marginBottom: '16px' }}>Resources &amp; Insights</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 24px' }}>
            Article Not Found
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'rgba(255,255,255,.65)', marginBottom: '32px' }}>
            We couldn't find that article. Please explore our other posts below.
          </p>
          <Link href="/blog" className="btn btn-brand">← Back to Blog</Link>
        </section>
      )
    }

    const displayDate = new Date(staticPost.iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    })

    return (
      <>
        <section style={{ background: 'var(--brand-darker,#28000c)', padding: '80px var(--pad-x,60px) 72px', textAlign: 'center' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontFamily: 'var(--font-label)', fontSize: '12px' }}>Palisade Realty</Link>
            <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 8px' }}>/</span>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontFamily: 'var(--font-label)', fontSize: '12px' }}>Blog</Link>
            <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 8px' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,.65)', fontFamily: 'var(--font-label)', fontSize: '12px' }}>{staticPost.c}</span>
          </nav>
          <div style={{ display: 'inline-block', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', background: 'var(--accent,#eeca00)', padding: '4px 12px', borderRadius: '2px' }}>
              {staticPost.c}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,52px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.18, margin: '0 auto 20px', maxWidth: '760px' }}>
            {staticPost.t}
          </h1>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,.65)' }}>By Palisade Realty</span>
            <time dateTime={staticPost.iso} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,.5)' }}>{displayDate}</time>
          </div>
        </section>
        <section style={{ background: '#fff', padding: '72px var(--pad-x,60px)' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontStyle: 'italic', color: 'var(--brand,#58172a)', lineHeight: 1.6, marginBottom: '36px', paddingBottom: '36px', borderBottom: '1px solid #eee' }}>
              {staticPost.x}
            </p>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#555', lineHeight: 1.8, marginBottom: '40px' }}>
              <p>Our team of San Diego real estate experts has put together a comprehensive guide on this topic. Whether you&rsquo;re buying, selling, or simply maintaining your home, having the right information makes all the difference.</p>
              <p style={{ marginTop: '24px' }}>Ready to put this knowledge to work? Our agents at Palisade Realty are here to guide you through every step of the process. With deep roots in the San Diego market, we bring both expertise and a personal touch to every transaction.</p>
            </div>
            <div style={{ background: 'var(--off-white,#faf7f2)', borderLeft: '3px solid var(--brand,#58172a)', padding: '24px 28px', borderRadius: '0 4px 4px 0' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#555', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: 'var(--brand,#58172a)' }}>Want to learn more?</strong> Contact a Palisade Realty agent today — we&rsquo;re happy to walk you through this and answer any questions specific to your situation.
              </p>
              <a href="/contact" style={{ display: 'inline-block', marginTop: '16px', fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', textDecoration: 'none' }}>
                Contact Us →
              </a>
            </div>
          </div>
        </section>
        <section style={{ background: 'var(--off-white,#faf7f2)', padding: '48px var(--pad-x,60px)', textAlign: 'center' }}>
          <Link href="/blog" className="btn btn-outline-brand">← Back to Blog</Link>
        </section>
      </>
    )
  }

  const displayDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          background: post.coverImage
            ? `linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(40,0,12,.88) 100%), url(${post.coverImage}) center/cover no-repeat`
            : 'var(--brand-darker,#28000c)',
          padding: '80px var(--pad-x,60px) 72px',
          textAlign: 'center',
        }}
      >
        <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontFamily: 'var(--font-label)', fontSize: '12px' }}>Palisade Realty</Link>
          <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 8px' }}>/</span>
          <Link href="/blog" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontFamily: 'var(--font-label)', fontSize: '12px' }}>Blog</Link>
          <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 8px' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,.65)', fontFamily: 'var(--font-label)', fontSize: '12px' }}>{post.category}</span>
        </nav>
        <div style={{ display: 'inline-block', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', background: 'var(--accent,#eeca00)', padding: '4px 12px', borderRadius: '2px' }}>
            {post.category}
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,52px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.18, margin: '0 auto 20px', maxWidth: '760px' }}>
          {post.title}
        </h1>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {post.author && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,.65)' }}>By {post.author}</span>
          )}
          <time dateTime={post.publishedAt.slice(0, 10)} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,.5)' }}>{displayDate}</time>
          {post.readTime && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,.5)' }}>{post.readTime} min read</span>
          )}
        </div>
      </section>

      {/* ── ARTICLE BODY ─────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '72px var(--pad-x,60px)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {post.excerpt && (
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontStyle: 'italic', color: 'var(--brand,#58172a)', lineHeight: 1.6, marginBottom: '36px', paddingBottom: '36px', borderBottom: '1px solid #eee' }}>
              {post.excerpt}
            </p>
          )}
          {post.body && post.body.length > 0 ? (
            <div className="prose-body">
              <PortableText value={post.body as Parameters<typeof PortableText>[0]['value']} />
            </div>
          ) : (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#777' }}>Content coming soon.</p>
          )}
        </div>
      </section>

      {/* ── BACK NAV ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--off-white,#faf7f2)', padding: '48px var(--pad-x,60px)', textAlign: 'center' }}>
        <Link href="/blog" className="btn btn-outline-brand">← Back to Blog</Link>
      </section>
    </>
  )
}

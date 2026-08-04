import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/sanity/client'
import { POST_BY_SLUG_QUERY } from '@/lib/sanity/queries'
import { categoryToDisplayBucket } from '@/lib/blog/category-map'
import { STATIC_POSTS } from '@/lib/blog/static-posts'

interface LocalPost {
  slug: string
  title: string
  category: string
  publishedAt: string
  excerpt: string
  coverImage: string
  body: string
}

function loadLocalPost(slug: string): LocalPost | null {
  try {
    const fp = path.join(process.cwd(), 'data', 'blog-posts.json')
    const posts: LocalPost[] = JSON.parse(fs.readFileSync(fp, 'utf8'))
    return posts.find((p) => p.slug === slug) ?? null
  } catch { return null }
}

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

// blogPost's raw category (e.g. "buying-tips") and authorName field get mapped
// onto the SanityPost shape (category -> display bucket, authorName -> author)
// that the JSX below already expects.
async function fetchSanityPost(slug: string): Promise<SanityPost | null> {
  const raw = await client.fetch<{
    _id: string
    title: string
    slug: string
    category: string
    publishedAt: string
    excerpt?: string
    authorName?: string
    coverImage?: string
    body?: unknown[]
  } | null>(POST_BY_SLUG_QUERY, { slug })
  if (!raw) return null
  return {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug,
    category: categoryToDisplayBucket(raw.category),
    publishedAt: raw.publishedAt,
    excerpt: raw.excerpt,
    author: raw.authorName,
    coverImage: raw.coverImage,
    body: raw.body,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  let post: SanityPost | null = null
  try { post = await fetchSanityPost(slug) } catch { /* ignore */ }
  if (post) return { title: `${post.title} | Palisade Realty Blog`, description: post.excerpt }
  const local = loadLocalPost(slug)
  if (local) return { title: `${local.title} | Palisade Realty Blog`, description: local.excerpt }
  const staticPost = STATIC_POSTS.find((p) => p.s === slug)
  if (staticPost) return { title: `${staticPost.t} | Palisade Realty Blog`, description: staticPost.x }
  return { title: 'Blog Post | Palisade Realty' }
}

export const revalidate = 3600

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  let post: SanityPost | null = null
  try { post = await fetchSanityPost(slug) } catch { /* ignore */ }

  // Try local HTML-extracted content
  if (!post) {
    const local = loadLocalPost(slug)
    if (local) {
      const displayDate = new Date(local.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
      return (
        <>
          <style>{`
            .bp-content p{font-family:var(--font-body);font-size:17px;line-height:1.8;color:rgba(33,33,33,.85);margin:0 0 24px;}
            .bp-content h2{font-family:var(--font-display);font-size:26px;font-weight:400;color:var(--near-black,#1a0a0a);letter-spacing:-.01em;margin:40px 0 20px;}
            .bp-content ul{padding-left:1.4em;margin:0 0 28px;}
            .bp-content li{font-family:var(--font-body);font-size:16px;line-height:1.75;color:rgba(33,33,33,.8);margin-bottom:10px;}
            .bp-content strong{font-weight:600;}
            .bp-inline-img{margin:8px 0 24px;}
            .bp-inline-img img{width:100%;height:auto;border-radius:8px;display:block;}
            .bp-divider{border:none;border-top:1px solid #e8e0d8;margin:36px 0;}
            .bp-cta-inline{background:linear-gradient(135deg,#f9f3f5,#fff5f7);border-left:4px solid var(--brand,#58172a);padding:28px 32px;border-radius:0 12px 12px 0;margin:40px 0;}
            .bp-cta-inline p{color:var(--near-black,#1a0a0a);margin:0;font-family:var(--font-body);font-size:16px;line-height:1.7;}
            .bp-cta-inline a{color:var(--brand,#58172a);font-weight:600;text-decoration:none;}
            .bp-cta-inline a:hover{text-decoration:underline;}
          `}</style>
          <section
            className="bp-hero"
            style={{
              background: local.coverImage
                ? `linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(40,0,12,.88) 100%), url(${local.coverImage}) center/cover no-repeat`
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
              <span style={{ color: 'rgba(255,255,255,.65)', fontFamily: 'var(--font-label)', fontSize: '12px' }}>{local.category}</span>
            </nav>
            <div style={{ display: 'inline-block', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', background: 'var(--accent,#eeca00)', padding: '4px 12px', borderRadius: '2px' }}>
                {local.category}
              </span>
            </div>
            <h1 className="bp-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,52px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.18, margin: '0 auto 20px', maxWidth: '760px' }}>
              {local.title}
            </h1>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,.65)' }}>By Palisade Realty</span>
              <time dateTime={local.publishedAt} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,.5)' }}>{displayDate}</time>
            </div>
          </section>
          <section style={{ background: 'var(--off-white,#faf7f2)', padding: '64px var(--pad-x,60px)' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div className="bp-content" dangerouslySetInnerHTML={{ __html: local.body }} />
            </div>
          </section>
          <section style={{ background: 'var(--brand-darker,#28000c)', padding: '72px var(--pad-x,60px)', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent,#eeca00)', display: 'block', marginBottom: '16px' }}>Ready to Make Your Move?</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 14px' }}>
              Expert Guidance for <em style={{ fontStyle: 'italic', color: 'var(--accent,#eeca00)' }}>Every Step</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'rgba(255,255,255,.65)', maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.7 }}>
              Whether you are buying, selling, or exploring your options in San Diego, our team is here to guide you with clarity and confidence.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-brand">Talk to an Agent</Link>
              <Link href="/team" className="btn btn-outline-white">Meet Our Team</Link>
            </div>
          </section>
          <section style={{ background: 'var(--off-white,#faf7f2)', padding: '48px var(--pad-x,60px)', textAlign: 'center' }}>
            <Link href="/blog" className="bp-back btn btn-outline-brand">← Back to Blog</Link>
          </section>
        </>
      )
    }

    // Fall back to static post metadata (excerpt only)
    const staticPost = STATIC_POSTS.find((p) => p.s === slug)
    if (!staticPost) {
      return (
        <section style={{ background: 'var(--brand-darker,#28000c)', padding: '80px var(--pad-x,60px) 72px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent,#eeca00)', marginBottom: '16px' }}>Resources &amp; Insights</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 24px' }}>
            Article Not Found
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'rgba(255,255,255,.65)', marginBottom: '32px' }}>
            We couldn&rsquo;t find that article. Please explore our other posts below.
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
        <section className="bp-hero" style={{ background: 'var(--brand-darker,#28000c)', padding: '80px var(--pad-x,60px) 72px', textAlign: 'center' }}>
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
          <h1 className="bp-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,52px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.18, margin: '0 auto 20px', maxWidth: '760px' }}>
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
          <Link href="/blog" className="bp-back btn btn-outline-brand">← Back to Blog</Link>
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
        className="bp-hero"
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
        <h1 className="bp-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,52px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.18, margin: '0 auto 20px', maxWidth: '760px' }}>
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
            <div className="bp-content prose-body">
              <PortableText value={post.body as Parameters<typeof PortableText>[0]['value']} />
            </div>
          ) : (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#777' }}>Content coming soon.</p>
          )}
        </div>
      </section>

      {/* ── BACK NAV ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--off-white,#faf7f2)', padding: '48px var(--pad-x,60px)', textAlign: 'center' }}>
        <Link href="/blog" className="bp-back btn btn-outline-brand">← Back to Blog</Link>
      </section>
    </>
  )
}

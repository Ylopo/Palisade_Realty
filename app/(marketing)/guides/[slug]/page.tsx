import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PILLARS, getPillarBySlug } from '@/lib/blog/pillars'
import { getPostsByCategory } from '@/lib/blog/all-posts'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pillar = getPillarBySlug(slug)
  if (!pillar) return { title: 'Guide Not Found' }
  return {
    title: pillar.shortTitle,
    description: pillar.description,
    alternates: { canonical: `/guides/${slug}` },
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const pillar = getPillarBySlug(slug)
  if (!pillar) notFound()

  const posts = await getPostsByCategory(pillar.categories)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pillar.title,
    url: `https://www.palisaderealty.com/guides/${slug}`,
    description: pillar.description,
    hasPart: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://www.palisaderealty.com/blog/${p.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section style={{ background: 'var(--brand-darker,#28000c)', padding: '80px var(--pad-x,60px) 72px', textAlign: 'center' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontFamily: 'var(--font-label)', fontSize: '12px' }}>Palisade Realty</Link>
          <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 8px' }}>/</span>
          <Link href="/blog" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none', fontFamily: 'var(--font-label)', fontSize: '12px' }}>Blog</Link>
          <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 8px' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,.65)', fontFamily: 'var(--font-label)', fontSize: '12px' }}>{pillar.shortTitle}</span>
        </nav>
        <div style={{ display: 'inline-block', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', background: 'var(--accent,#eeca00)', padding: '4px 12px', borderRadius: '2px' }}>
            {pillar.eyebrow}
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4.5vw,56px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 auto 20px', maxWidth: '860px' }}>
          {pillar.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'rgba(255,255,255,.7)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' }}>
          {pillar.description}
        </p>
      </section>

      <section style={{ background: '#fff', padding: '72px var(--pad-x,60px)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
            {PILLARS.map((p) => (
              <Link
                key={p.slug}
                href={`/guides/${p.slug}`}
                className={p.slug === slug ? 'btn btn-brand' : 'btn btn-outline-brand'}
              >
                {p.shortTitle}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: '#777' }}>
              Articles for this guide are coming soon.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: 'block',
                    padding: '24px',
                    background: 'var(--off-white,#faf7f2)',
                    borderRadius: '8px',
                    border: '1px solid #f0ebe4',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand,#58172a)' }}>
                    {post.category}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.01em', lineHeight: 1.35, margin: '10px 0' }}>
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#777', lineHeight: 1.6, margin: 0 }}>
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="tp-cta" aria-labelledby="guide-cta-heading">
        <div className="tp-wrap">
          <h2 className="tp-cta-heading" id="guide-cta-heading">
            <em>Have Questions?</em> Talk to Our Team
          </h2>
          <p className="tp-cta-sub">
            Hedda Parashos and the Palisade Realty team bring deep San Diego County expertise to every transaction.
          </p>
          <div className="tp-cta-btns">
            <Link href="/contact" className="btn btn-brand">Contact Us</Link>
            <a href="tel:+16197940218" className="btn btn-outline-white">(619) 794-0218</a>
          </div>
        </div>
      </section>
    </>
  )
}

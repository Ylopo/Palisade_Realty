import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPropertyBySlug, getAllPropertySlugs, getOtherProperties } from '@/lib/property-data'
import PropertyGallery from './PropertyGallery'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPropertySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = getPropertyBySlug(slug)
  if (!p) return { title: 'Property Not Found' }
  return {
    title: `${p.address} — ${p.priceDisplay} | Palisade Realty`,
    description: p.tagline ?? `${p.beds}bd/${p.baths}ba, ${p.sqft.toLocaleString()} sq ft in ${p.city}, CA. Listed by Palisade Realty.`,
  }
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params
  const p = getPropertyBySlug(slug)
  if (!p) notFound()

  const others = getOtherProperties(slug).slice(0, 3)

  return (
    <>
      {/* ── GALLERY ─────────────────────────────────────────── */}
      <PropertyGallery images={p.gallery.length > 0 ? p.gallery : [p.heroImage]} address={p.address} />

      {/* ── MAIN DETAIL ─────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '64px var(--pad-x,60px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '64px', alignItems: 'start' }}>

          {/* Left column */}
          <div>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
              <Link href="/" style={{ color: '#aaa', textDecoration: 'none', fontFamily: 'var(--font-label)', fontSize: '12px', letterSpacing: '0.05em' }}>Palisade Realty</Link>
              <span style={{ color: '#ccc', margin: '0 8px' }}>/</span>
              <Link href="/properties" style={{ color: '#aaa', textDecoration: 'none', fontFamily: 'var(--font-label)', fontSize: '12px', letterSpacing: '0.05em' }}>Properties</Link>
              <span style={{ color: '#ccc', margin: '0 8px' }}>/</span>
              <span style={{ color: '#666', fontFamily: 'var(--font-label)', fontSize: '12px', letterSpacing: '0.05em' }}>{p.address}</span>
            </nav>

            {/* Address + price */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', display: 'block', marginBottom: '8px' }}>
                {p.status === 'active' ? 'Active Listing' : p.status}
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', lineHeight: 1.18, margin: '0 0 8px' }}>
                {p.address}
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#777', margin: '0 0 16px' }}>
                {p.city}, {p.state} {p.zip}
                {p.neighborhood ? ` · ${p.neighborhood}` : ''}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 400, color: 'var(--brand,#58172a)', letterSpacing: '-0.02em', margin: 0 }}>
                {p.priceDisplay}
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '32px', padding: '20px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '36px', flexWrap: 'wrap' }}>
              {[
                { label: 'Beds', value: p.beds },
                { label: 'Baths', value: p.baths },
                { label: 'Sq Ft', value: p.sqft.toLocaleString() },
                ...(p.lotSize ? [{ label: 'Lot', value: p.lotSize }] : []),
                { label: 'Built', value: p.yearBuilt },
                { label: 'MLS #', value: p.mls },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginTop: '3px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {p.tagline && (
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontStyle: 'italic', color: 'var(--brand,#58172a)', lineHeight: 1.5, marginBottom: '20px' }}>
                {p.tagline}
              </p>
            )}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#555', lineHeight: 1.85, marginBottom: '40px' }}>
              {p.description}
            </p>

            {/* Features */}
            {p.features && p.features.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.01em', margin: '0 0 20px' }}>
                  Property <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Highlights</em>
                </h2>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
                  {p.features.map((f, i) => (
                    <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#555', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent,#eeca00)', flexShrink: 0, marginTop: '7px' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Community link */}
            {p.communitySlug && (
              <div style={{ padding: '24px', background: 'var(--off-white,#faf7f2)', borderRadius: '4px', borderLeft: '3px solid var(--brand,#58172a)', marginBottom: '32px' }}>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '6px' }}>Explore the Neighborhood</p>
                <Link href={`/communities/${p.communitySlug}`} style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--near-black,#1a0a0a)', textDecoration: 'none' }}>
                  {p.city} Community Guide →
                </Link>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside style={{ position: 'sticky', top: '96px' }}>
            <div style={{ background: 'var(--brand-darker,#28000c)', borderRadius: '4px', padding: '32px 28px', color: '#fff' }}>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: '16px' }}>Listed By</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/agents/hedda-parashos.jpg"
                  alt="Hedda Parashos"
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: '2px solid rgba(238,202,0,.4)' }}
                />
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>{p.listedBy.agent}</p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'rgba(255,255,255,.55)', margin: 0 }}>Palisade Realty</p>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.12)', marginBottom: '24px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <a href="tel:+16197940218" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.83 5.83l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  (619) 794-0218
                </a>
                <a href="mailto:hedda@palisaderealty.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 7 10-7" />
                  </svg>
                  hedda@palisaderealty.com
                </a>
              </div>
              <a
                href={p.ylopoDetailUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', background: 'var(--accent,#eeca00)', color: 'var(--brand,#58172a)', fontFamily: 'var(--font-label)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '14px', borderRadius: '3px', textDecoration: 'none', marginBottom: '10px' }}
              >
                Schedule a Tour
              </a>
              <Link
                href="/contact"
                style={{ display: 'block', textAlign: 'center', background: 'transparent', color: 'rgba(255,255,255,.75)', fontFamily: 'var(--font-label)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '13px', borderRadius: '3px', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.25)' }}
              >
                Request More Info
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ── YLOPO LISTINGS ──────────────────────────────────── */}
      <section style={{ background: 'var(--off-white,#faf7f2)', padding: '88px var(--pad-x,60px)' }} aria-labelledby="similar-heading">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '8px' }}>More Options</p>
          <h2 id="similar-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: '0 0 40px' }}>
            Similar <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Properties</em>
          </h2>
          <div
            className="YLOPO_resultsWidget"
            data-search={JSON.stringify({
              locations: [
                { city: p.city, state: p.state },
                ...(p.communitySlug ? [] : []),
              ],
              beds: { min: Math.max(1, p.beds - 1) },
              price: { max: Math.round(p.price * 1.5) },
            })}
          />
        </div>
      </section>

      {/* ── OTHER FEATURED LISTINGS ─────────────────────────── */}
      {others.length > 0 && (
        <section style={{ background: '#fff', padding: '88px var(--pad-x,60px)' }} aria-labelledby="other-props-heading">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '8px' }}>Featured Listings</p>
            <h2 id="other-props-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: '0 0 40px' }}>
              More <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>From Palisade</em>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${others.length}, 1fr)`, gap: '20px' }}>
              {others.map((o) => (
                <article key={o.slug} style={{ background: 'var(--off-white,#faf7f2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.heroImage} alt={o.address} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--brand,#58172a)', margin: '0 0 4px' }}>{o.priceDisplay}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--near-black,#1a0a0a)', margin: '0 0 2px' }}>{o.address}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#999', margin: '0 0 14px' }}>{o.city}, {o.state}</p>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                      {[{ v: o.beds, l: 'Bd' }, { v: o.baths, l: 'Ba' }, { v: o.sqft.toLocaleString(), l: 'Sf' }].map((s) => (
                        <span key={s.l} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#666' }}>{s.v} {s.l}</span>
                      ))}
                    </div>
                    <Link href={`/properties/${o.slug}`} style={{ fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand,#58172a)', textDecoration: 'none', textTransform: 'uppercase' }}>
                      View Details →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="tp-cta" aria-labelledby="prop-cta-heading">
        <div className="tp-wrap">
          <h2 className="tp-cta-heading" id="prop-cta-heading">
            Ready to <em>Tour This Home?</em>
          </h2>
          <p className="tp-cta-sub">
            Our team is ready to schedule a private showing and answer any questions about{' '}
            {p.address}. Contact us today.
          </p>
          <div className="tp-cta-btns">
            <a href={p.ylopoDetailUrl} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
              Schedule a Tour
            </a>
            <Link href="/contact" className="btn btn-outline-white">
              Contact an Agent
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

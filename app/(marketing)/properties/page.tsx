import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllProperties } from '@/lib/property-data'

export const metadata: Metadata = {
  title: 'Featured Properties — Palisade Realty',
  description:
    'Browse featured San Diego luxury properties presented by Palisade Realty. La Jolla, Coronado, Del Mar, Rancho Santa Fe, and more.',
}

function formatPrice(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

export default function PropertiesPage() {
  const properties = getAllProperties()

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--brand-darker,#28000c)',
          padding: '80px var(--pad-x,60px) 72px',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label="Featured Properties"
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 60% at 0% 100%, rgba(88,23,42,.5) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(238,202,0,.06) 0%, transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1320px', margin: '0 auto' }}>
          <nav style={{ marginBottom: '48px' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.45)', textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}>Palisade Realty</Link>
            <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 8px' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,.7)', fontSize: '12px', fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}>Properties</span>
          </nav>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent,#eeca00)', marginBottom: '16px' }}>
            Palisade Realty
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px,8vw,96px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, margin: '0 0 24px' }}>
            Featured<br /><em style={{ fontStyle: 'italic', color: 'var(--accent,#eeca00)' }}>Properties</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'rgba(255,255,255,.65)', lineHeight: 1.7, maxWidth: '520px' }}>
            Exceptional homes across San Diego County, personally curated by the Palisade Realty team.
          </p>
        </div>
      </section>

      {/* ── PROPERTIES GRID ─────────────────────────────────── */}
      <section style={{ background: 'var(--off-white,#faf7f2)', padding: '88px var(--pad-x,60px)' }} aria-labelledby="props-heading">
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '8px' }}>Active Listings</p>
          <h2 id="props-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: '0 0 48px' }}>
            {properties.length} <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Featured Listings</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            {properties.map((p) => (
              <article
                key={p.slug}
                style={{
                  background: '#fff',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(88,23,42,.06), 0 1px 3px rgba(0,0,0,.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                className="prop-card"
              >
                <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.heroImage}
                    alt={`${p.address}, ${p.city}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease' }}
                    loading="lazy"
                    className="prop-card-img"
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 100%)', height: '60%' }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: 'var(--brand,#58172a)', padding: '4px 10px', borderRadius: '2px' }}>
                      {p.status === 'active' ? 'Active' : p.status}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400, color: 'var(--brand,#58172a)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                    {p.priceDisplay}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--near-black,#1a0a0a)', margin: '0 0 4px' }}>
                    {p.address}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888', margin: '0 0 16px' }}>
                    {p.city}, {p.state} {p.zip}
                  </p>
                  <div style={{ display: 'flex', gap: '18px', marginBottom: '20px' }}>
                    {[
                      { label: 'Beds', value: p.beds },
                      { label: 'Baths', value: p.baths },
                      { label: 'Sq Ft', value: p.sqft.toLocaleString() },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', lineHeight: 1 }}>{stat.value}</div>
                        <div style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginTop: '2px' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  {p.tagline && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#777', lineHeight: 1.6, marginBottom: '20px' }}>
                      {p.tagline}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link href={`/properties/${p.slug}`} className="btn btn-brand" style={{ flex: 1, textAlign: 'center' }}>
                      View Details
                    </Link>
                    <a href={p.ylopoDetailUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-brand">
                      MLS
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH CTA ──────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '88px var(--pad-x,60px)' }} aria-labelledby="search-cta-heading">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '16px' }}>All Listings</p>
          <h2 id="search-cta-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: '0 0 16px' }}>
            Find Your <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Perfect Home</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: '#777', lineHeight: 1.8, marginBottom: '36px', maxWidth: '540px', margin: '0 auto 36px' }}>
            Browse the full MLS across all San Diego communities — La Jolla, Coronado, Del Mar, Encinitas, and beyond.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://search.palisaderealty.com/" target="_blank" rel="noopener noreferrer" className="btn btn-brand">
              Search All Listings
            </a>
            <Link href="/contact" className="btn btn-outline-brand">
              Talk to an Agent
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

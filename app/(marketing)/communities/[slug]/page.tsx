import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCommunityBySlug, getAllCommunitySlugs } from '@/lib/community-data'
import CommunityPageBodyClass from '@/components/CommunityPageBodyClass'
import CommunitySchoolsTabs from '@/components/CommunitySchoolsTabs'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllCommunitySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = getCommunityBySlug(slug)
  if (!c) return { title: 'Community Not Found' }
  return {
    title: `${c.name} Homes For Sale`,
    description: `Explore homes for sale in ${c.name}, CA. ${c.badge} living in San Diego County. Guided by Palisade Realty — local experts since 2008.`,
  }
}

export default async function CommunityPage({ params }: Props) {
  const { slug } = await params
  const c = getCommunityBySlug(slug)
  if (!c) notFound()

  return (
    <>
      <CommunityPageBodyClass />

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section
        id="community-hero"
        style={{ position: 'relative', height: '560px', overflow: 'hidden' }}
        aria-label={`${c.name} hero`}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/assets/images/${c.image}`}
            alt={`${c.name}, San Diego`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            loading="eager"
          />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,8,8,0.28) 0%, rgba(11,8,8,0.20) 50%, rgba(11,8,8,0.75) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '72px', textAlign: 'center' }}>
          <nav style={{ position: 'absolute', top: '88px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(242,237,228,0.50)', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }} aria-label="Breadcrumb">
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span aria-hidden="true">·</span>
            <Link href="/communities" style={{ color: 'inherit', textDecoration: 'none' }}>Communities</Link>
            <span aria-hidden="true">·</span>
            <span aria-current="page">{c.name}</span>
          </nav>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--accent,#eeca00)', marginBottom: '16px' }}>
            {c.subtitle}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px,9vw,110px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.95, marginBottom: '44px' }}>
            {c.titleFirst} <em style={{ fontStyle: 'italic', color: 'var(--accent,#eeca00)' }}>{c.titleRest}</em>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center' }} role="list">
            {c.heroStats.map((s, i) => (
              <div
                key={i}
                role="listitem"
                style={{ padding: '0 36px', textAlign: 'center', borderRight: i < c.heroStats.length - 1 ? '1px solid rgba(255,255,255,0.18)' : undefined }}
              >
                <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '26px', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '5px' }}>{s.value}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. LOCATION ─────────────────────────────────────────── */}
      {c.driveCards && c.driveCards.length > 0 && (
        <div id="location-context" style={{ background: '#faf7f2', padding: '90px var(--pad-x,56px)' }}>
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 52px' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Location</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: '24px' }}>
              Where is <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{c.name}?</em>
            </h2>
            {c.locationDescription && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.72, color: 'rgba(33,33,33,0.55)', maxWidth: '560px', margin: '0 auto' }}>
                {c.locationDescription}
              </p>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', maxWidth: '1100px', margin: '0 auto' }}>
            {c.driveCards.map((d, i) => (
              <div key={i} style={{ background: '#ebebeb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '20px 16px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, color: 'var(--brand,#58172a)', letterSpacing: '-0.02em', marginBottom: '6px' }}>{d.time}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 600, color: 'var(--near-black,#1a0a0a)', marginBottom: '4px' }}>{d.dest}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '10px', color: 'rgba(33,33,33,0.55)', letterSpacing: '0.06em' }}>{d.via}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. OVERVIEW + QUICK FACTS ───────────────────────────── */}
      <section id="overview" style={{ background: '#ffffff', padding: '100px var(--pad-x,56px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '72px', alignItems: 'start' }}>
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>{c.badge}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: '24px' }}>
              About <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{c.name}</em>
            </h2>
            <div style={{ width: '40px', height: '2px', background: 'var(--brand,#58172a)', margin: '20px 0 28px' }} />
            {c.overview.map((p, i) => (
              <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.78, color: 'rgba(33,33,33,0.55)', marginBottom: '18px' }}>{p}</p>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '8px' }}>
              <a href={c.ylopoSearch} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
                View Listings
              </a>
              <Link href="/contact" className="btn btn-outline-brand">
                Talk to an Agent
              </Link>
            </div>
          </div>
          <div style={{ background: '#ebebeb', border: '1px solid rgba(0,0,0,0.10)', borderRadius: '14px', padding: '32px 28px', position: 'sticky', top: '96px' }} aria-label={`${c.name} at a glance`}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.10)' }}>At a Glance</p>
            {c.quickFacts.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', padding: '10px 0', borderBottom: i < c.quickFacts.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'rgba(33,33,33,0.55)', flexShrink: 0 }}>{f.label}</span>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 600, color: 'var(--near-black,#1a0a0a)', textAlign: 'right' }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. DEMOGRAPHICS ─────────────────────────────────────── */}
      {c.demographics && c.demographics.length > 0 && (
        <div id="demographics" style={{ background: '#ebebeb', padding: '64px var(--pad-x,56px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Community Demographics</span>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'rgba(33,33,33,0.55)', letterSpacing: '0.06em' }}>Source: U.S. Census Bureau, ACS 5-Year Estimates</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${c.demographics.length},1fr)`, maxWidth: '1100px', margin: '0 auto' }}>
            {c.demographics.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '20px 12px', borderRight: i < c.demographics!.length - 1 ? '1px solid rgba(0,0,0,0.09)' : undefined }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.03em', marginBottom: '6px' }}>{d.value}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 500, color: 'var(--brand,#58172a)', letterSpacing: '0.06em' }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. HIGHLIGHTS ───────────────────────────────────────── */}
      <section id="highlights" style={{ background: '#ffffff', padding: '100px var(--pad-x,56px)' }} aria-labelledby="highlights-heading">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>What Makes It Special</span>
            <h2 id="highlights-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1 }}>
              Living in <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{c.name}</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(c.highlights.length, 3)},1fr)`, gap: '20px' }}>
            {c.highlights.map((h, i) => (
              <div key={i} style={{ background: '#ebebeb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '32px 28px' }}>
                <div style={{ width: '40px', height: '3px', background: 'var(--brand,#58172a)', marginBottom: '18px' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.01em', marginBottom: '12px' }}>{h.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.70, color: 'rgba(33,33,33,0.55)' }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. NEIGHBORHOODS ────────────────────────────────────── */}
      {c.neighborhoods && c.neighborhoods.length > 0 && (
        <div id="neighborhoods" style={{ background: '#faf7f2', padding: '90px var(--pad-x,56px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Explore {c.name}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1 }}>
              Neighborhoods &amp; <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Enclaves</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', maxWidth: '1400px', margin: '0 auto' }}>
            {c.neighborhoods.map((n, i) => (
              <div key={i} style={{ background: '#ebebeb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '22px 18px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 500, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.01em', marginBottom: '5px' }}>{n.name}</p>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 600, color: 'var(--brand,#58172a)', marginBottom: '8px' }}>{n.priceRange}</p>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'rgba(33,33,33,0.55)', letterSpacing: '0.04em' }}>{n.tags}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 7. CITY STATS ───────────────────────────────────────── */}
      {c.cityStats && c.cityStats.length > 0 && (
        <div id="city-stats" style={{ background: 'var(--brand,#58172a)', padding: '64px var(--pad-x,56px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${c.cityStats.length},1fr)`, maxWidth: '1100px', margin: '0 auto' }}>
            {c.cityStats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '12px 8px', borderRight: i < c.cityStats!.length - 1 ? '1px solid rgba(255,255,255,0.14)' : undefined }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 400, color: 'var(--accent,#eeca00)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '8px' }}>{s.value}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(242,237,228,0.70)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 8. LISTINGS WIDGET ──────────────────────────────────── */}
      <div id="listings" style={{ background: '#faf7f2', padding: '90px var(--pad-x,56px)' }} aria-labelledby="listings-heading">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Live MLS Data</span>
              <h2 id="listings-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: 0 }}>
                {c.name} Homes For Sale
              </h2>
            </div>
            <a href={c.ylopoSearch} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', whiteSpace: 'nowrap', textDecoration: 'none' }}>
              View All Listings →
            </a>
          </div>
          <div
            className="YLOPO_resultsWidget"
            data-search={JSON.stringify({
              locations: [{ city: c.name.split(' & ')[0], state: 'CA' }],
              propertyTypes: ['house', 'condo', 'townhouse', 'multi_family'],
              status: 'active',
              limit: 12,
            })}
          />
          <div style={{ marginTop: '36px', textAlign: 'center' }}>
            <a href={c.ylopoSearch} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-label)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--brand,#58172a)', borderBottom: '1px solid rgba(88,23,42,0.30)', paddingBottom: '2px', textDecoration: 'none' }}>
              View All {c.name} Properties →
            </a>
          </div>
        </div>
      </div>

      {/* ── 9. HOA FEES ─────────────────────────────────────────── */}
      {c.hoa && c.hoa.length > 0 && (
        <section id="hoa-fees" style={{ background: '#ffffff', padding: '100px var(--pad-x,56px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>What to Expect</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: '40px' }}>
              HOA Fees in <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{c.name}</em>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-label)', fontSize: '13px' }} aria-label="HOA fee ranges by community type">
                  <thead>
                    <tr>
                      <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 0 14px', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Community Type</th>
                      <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 0 14px', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'right' }}>Monthly HOA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.hoa.map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'rgba(33,33,33,0.55)' }}>{row.type}</td>
                        <td style={{ padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', fontWeight: 600, color: 'var(--near-black,#1a0a0a)', textAlign: 'right' }}>{row.monthly}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {c.hoaNote && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(33,33,33,0.55)', marginTop: '20px', lineHeight: 1.6 }}>{c.hoaNote}</p>
                )}
              </div>
              <div>
                {c.hoaAside && (
                  <>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 700, color: 'var(--near-black,#1a0a0a)', letterSpacing: '0.06em', marginBottom: '12px' }}>Have Questions?</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(33,33,33,0.55)', lineHeight: 1.68, marginBottom: '24px' }}>{c.hoaAside}</p>
                  </>
                )}
                {c.hoaCovers && c.hoaCovers.length > 0 && (
                  <>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 700, color: 'var(--near-black,#1a0a0a)', letterSpacing: '0.06em', marginBottom: '12px' }}>What HOAs Typically Cover</p>
                    <ul style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(33,33,33,0.55)', lineHeight: 1.8, paddingLeft: '18px' }}>
                      {c.hoaCovers.map((item, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 10. PARKS ───────────────────────────────────────────── */}
      {c.parks && c.parks.length > 0 && (
        <div id="parks-rec" style={{ background: '#faf7f2', padding: '90px var(--pad-x,56px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Outdoor Living</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1 }}>
                Parks &amp; Recreation<br />in <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{c.name}</em>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
              {c.parks.map((p, i) => (
                <div key={i} style={{ background: '#ebebeb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '28px 24px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, color: 'var(--near-black,#1a0a0a)', marginBottom: '4px' }}>{p.name}</p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'rgba(33,33,33,0.55)', marginBottom: '10px', letterSpacing: '0.04em' }}>{p.address}</p>
                  <span style={{ display: 'inline-block', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', background: 'rgba(88,23,42,0.07)', borderRadius: '4px', padding: '3px 8px', marginBottom: '16px' }}>{p.size}</span>
                  <ul style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(33,33,33,0.55)', lineHeight: 1.75, paddingLeft: '16px' }}>
                    {p.amenities.map((a, j) => (
                      <li key={j} style={{ marginBottom: '3px' }}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 11. SCHOOLS ─────────────────────────────────────────── */}
      <section id="schools" style={{ background: '#ffffff', padding: '100px var(--pad-x,56px)' }} aria-labelledby="schools-heading">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Education</span>
            <h2 id="schools-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1 }}>
              Schools Serving <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{c.name}</em>
            </h2>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(33,33,33,0.55)', lineHeight: 1.68, maxWidth: '780px', margin: '0 auto 40px', textAlign: 'center' }}>
            {c.name} is primarily served by the {c.schoolDistrict}. School assignments are address-specific — contact the district to confirm enrollment boundaries before purchasing.
          </p>
          <CommunitySchoolsTabs
            publicSchools={c.publicSchools}
            privateSchools={c.privateSchools}
            schoolDistrict={c.schoolDistrict}
            communityName={c.name}
          />
        </div>
      </section>

      {/* ── 12. NEARBY COMMUNITIES ──────────────────────────────── */}
      <div id="nearby-communities" style={{ background: '#faf7f2', padding: '90px var(--pad-x,56px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Comparisons</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: '16px' }}>
            Nearby Communities<br />to <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Consider</em>
          </h2>
          {c.nearbyDescription && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(33,33,33,0.55)', marginBottom: '40px' }}>{c.nearbyDescription}</p>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-label)', fontSize: '13px' }} aria-label="Nearby San Diego communities comparison">
            <thead>
              <tr>
                <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 16px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Community</th>
                <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 16px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Starting Price</th>
                {c.nearbyCommunities.some(n => n.whyConsider) && (
                  <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 16px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Why Consider</th>
                )}
                <th style={{ padding: '0 0 14px', borderBottom: '1px solid rgba(0,0,0,0.12)' }} />
              </tr>
            </thead>
            <tbody>
              {c.nearbyCommunities.map((n, i) => (
                <tr key={i}>
                  <td style={{ padding: '16px 16px 16px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', verticalAlign: 'top' }}>
                    <Link href={`/communities/${n.slug}`} style={{ fontWeight: 600, color: 'var(--near-black,#1a0a0a)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '18px' }}>
                      {n.name}
                    </Link>
                  </td>
                  <td style={{ padding: '16px 16px 16px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'var(--brand,#58172a)', fontWeight: 600, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{n.from}</td>
                  {c.nearbyCommunities.some(nb => nb.whyConsider) && (
                    <td style={{ padding: '16px 16px 16px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'rgba(33,33,33,0.55)', verticalAlign: 'top' }}>{n.whyConsider || ''}</td>
                  )}
                  <td style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'var(--brand,#58172a)', fontSize: '18px', textAlign: 'right', verticalAlign: 'top' }}>→</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/communities" className="btn btn-outline-brand">View All Communities</Link>
          </div>
        </div>
      </div>

      {/* ── 13. FAQ ──────────────────────────────────────────────── */}
      {c.faq && c.faq.length > 0 && (
        <section id="faq" style={{ background: '#ffffff', padding: '100px var(--pad-x,56px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Common Questions</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1 }}>
                Frequently Asked Questions<br />About <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{c.name}</em>
              </h2>
            </div>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(33,33,33,0.55)', marginBottom: '48px' }}>The questions buyers ask most when exploring {c.name} real estate.</p>
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              {c.faq.map((item, i) => (
                <details key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.10)' }}>
                  <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', padding: '22px 0', cursor: 'pointer', listStyle: 'none', userSelect: 'none' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 500, color: 'rgba(33,33,33,0.85)', lineHeight: 1.45 }}>{item.q}</span>
                    <span style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', background: '#ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-label)', fontSize: '18px', color: 'var(--brand,#58172a)', lineHeight: 1 }}>+</span>
                  </summary>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.72, color: 'rgba(33,33,33,0.55)', padding: '0 0 24px' }} dangerouslySetInnerHTML={{ __html: item.a }} />
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 14. LIFESTYLE ───────────────────────────────────────── */}
      {c.lifestyleBody && c.lifestyleBody.length > 0 && (
        <div id="lifestyle" style={{ background: '#ebebeb', padding: '90px var(--pad-x,56px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>The {c.name} Lifestyle</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: '24px' }}>
                Central Living,<br /><em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Effortlessly Connected</em>
              </h2>
              {c.lifestyleBody.map((p, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.78, color: 'rgba(33,33,33,0.55)', marginBottom: '18px' }}>{p}</p>
              ))}
              {c.lifestyleBullets && c.lifestyleBullets.length > 0 && (
                <ul style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(33,33,33,0.55)', lineHeight: 2, paddingLeft: '18px', marginTop: '12px' }}>
                  {c.lifestyleBullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
            <div style={{ background: 'rgba(88,23,42,0.06)', borderRadius: '20px', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/assets/images/${c.image}`}
                alt={`${c.name} lifestyle`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 15. CTA ─────────────────────────────────────────────── */}
      <section
        id="community-cta"
        style={{ position: 'relative', padding: '120px var(--pad-x,56px)', textAlign: 'center', overflow: 'hidden' }}
        aria-labelledby="community-cta-heading"
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/hero-background/hero-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(1.05) saturate(0.9)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,245,245,0.88)', zIndex: 1 }} aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Your Guide to {c.name}</span>
          <h2 id="community-cta-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5vw,72px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
            <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Ready to Find Your</em><br />{c.name} Home?
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.72, color: 'rgba(33,33,33,0.55)', marginBottom: '40px' }}>
            Hedda Parashos has the market knowledge, the network, and the negotiating expertise to guide you to the right property at the right price — across every {c.name} neighborhood and price tier.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="tel:+16197940218" className="btn btn-brand">Call (619) 794-0218</a>
            <Link href="/contact" className="btn btn-outline-brand">Send a Message</Link>
          </div>
        </div>
      </section>
    </>
  )
}

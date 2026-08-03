import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getNeighborhoodBySlug, getAllNeighborhoodParams } from '@/lib/neighborhood-data'
import { DEFAULT_MELLO_ROOS, MelloRoosData } from '@/lib/community-data'
import CommunityPageBodyClass from '@/components/CommunityPageBodyClass'
import CommunitySchoolsTabs from '@/components/CommunitySchoolsTabs'
import CommunityLocationMap from '@/components/CommunityLocationMap'

interface Props {
  params: Promise<{ slug: string; neighborhood: string }>
}

export async function generateStaticParams() {
  return getAllNeighborhoodParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, neighborhood } = await params
  const n = getNeighborhoodBySlug(slug, neighborhood)
  if (!n) return { title: 'Neighborhood Not Found' }
  return {
    title: `${n.name} San Diego Real Estate | Palisade Realty`,
    description: `Explore ${n.name} San Diego real estate, urban residences, neighborhood highlights, local attractions, and available homes with Palisade Realty.`,
    alternates: {
      canonical: `/communities/${slug}/${neighborhood}`,
    },
    openGraph: {
      title: `${n.name} San Diego Real Estate | Palisade Realty`,
      description: `Explore ${n.name} San Diego real estate, urban residences, neighborhood highlights, local attractions, and available homes with Palisade Realty.`,
      images: [{ url: `/assets/images/${n.image}` }],
    },
  }
}

export default async function NeighborhoodPage({ params }: Props) {
  const { slug, neighborhood } = await params
  const n = getNeighborhoodBySlug(slug, neighborhood)
  if (!n) notFound()

  const mr: MelloRoosData = { ...DEFAULT_MELLO_ROOS, ...n.melloroos }
  const lifestyleBody = n.lifestyleBody ?? [
    `${n.name} draws a diverse mix of residents who share one thing in common: a deep appreciation for what this community has to offer. Whether you're an urban professional, a family seeking character and convenience, or a buyer who values walkability and culture, ${n.name} consistently delivers.`,
    `The neighborhood also appeals strongly to investors and second-home buyers, given its location, rental demand, and long-term fundamentals. Whether you're buying to live or buying to hold, ${n.name} offers a compelling case within San Diego's competitive real estate market.`,
  ]
  const lifestyleBullets = n.lifestyleBullets ?? [
    'Urban professionals seeking walkable convenience',
    'Sports fans and Padres season-ticket holders',
    'Buyers prioritizing dining, nightlife, and culture',
    'Investors seeking rental income potential',
    'Second-home buyers visiting San Diego regularly',
    'First-time buyers entering Downtown San Diego',
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://palisade-realty.vercel.app/' },
        { '@type': 'ListItem', position: 2, name: 'Communities', item: 'https://palisade-realty.vercel.app/communities' },
        { '@type': 'ListItem', position: 3, name: n.parentName, item: `https://palisade-realty.vercel.app/communities/${n.parentSlug}` },
        { '@type': 'ListItem', position: 4, name: n.name, item: `https://palisade-realty.vercel.app/communities/${n.parentSlug}/${n.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: n.name,
      containedInPlace: { '@type': 'Place', name: n.parentName },
      address: { '@type': 'PostalAddress', addressLocality: 'San Diego', addressRegion: 'CA', addressCountry: 'US' },
    },
  ]

  return (
    <>
      <CommunityPageBodyClass />
      {jsonLd.map((entry, i) => (
        // eslint-disable-next-line react/no-danger
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section
        id="community-hero"
        style={{ position: 'relative', height: '560px', overflow: 'hidden' }}
        aria-label={`${n.name} hero`}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/assets/images/${n.image}`}
            alt={`${n.name}, ${n.parentName}, San Diego`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            loading="eager"
          />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,8,8,0.28) 0%, rgba(11,8,8,0.20) 50%, rgba(11,8,8,0.75) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '72px', textAlign: 'center' }}>

          {/* Breadcrumb */}
          <nav
            style={{ position: 'absolute', top: '88px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(242,237,228,0.50)', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
            aria-label="Breadcrumb"
          >
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span aria-hidden="true">·</span>
            <Link href="/communities" style={{ color: 'inherit', textDecoration: 'none' }}>Communities</Link>
            <span aria-hidden="true">·</span>
            <Link href={`/communities/${n.parentSlug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{n.parentName}</Link>
            <span aria-hidden="true">·</span>
            <span aria-current="page">{n.name}</span>
          </nav>

          <p className="hero-eyebrow" style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--accent,#eeca00)', marginBottom: '16px' }}>
            {n.subtitle}
          </p>
          <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px,9vw,110px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.95, marginBottom: '44px' }}>
            {n.titleFirst}{' '}<em style={{ fontStyle: 'italic', color: 'var(--accent,#eeca00)' }}>{n.titleRest}</em>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center' }} role="list">
            {n.heroStats.map((s, i) => (
              <div
                key={i}
                role="listitem"
                style={{ padding: '0 36px', textAlign: 'center', borderRight: i < n.heroStats.length - 1 ? '1px solid rgba(255,255,255,0.18)' : undefined }}
              >
                <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '26px', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '5px' }}>{s.value}</span>
                <span className="hero-stat-label" style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. OVERVIEW + QUICK FACTS ───────────────────────────── */}
      <section id="overview" style={{ background: '#ffffff', padding: '100px var(--pad-x,56px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '72px', alignItems: 'start' }}>
          <div>
            <span className="section-eyebrow" style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>{n.badge}</span>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: '24px' }}>
              About <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{n.name}</em>
            </h2>
            <div style={{ width: '40px', height: '2px', background: 'var(--brand,#58172a)', margin: '20px 0 28px' }} />
            {n.overview.map((p, i) => (
              <p key={i} className="overview-body" style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.78, color: 'rgba(33,33,33,0.55)', marginBottom: '18px' }}>{p}</p>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '8px' }}>
              <a href={n.ylopoSearch} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
                View Listings
              </a>
              <Link href="/contact" className="btn btn-outline-brand">
                Talk to an Agent
              </Link>
            </div>
          </div>
          <div style={{ background: '#ebebeb', border: '1px solid rgba(0,0,0,0.10)', borderRadius: '14px', padding: '32px 28px', position: 'sticky', top: '96px' }} aria-label={`${n.name} at a glance`}>
            <p className="quick-facts-heading" style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.10)' }}>At a Glance</p>
            {n.quickFacts.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', padding: '10px 0', borderBottom: i < n.quickFacts.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
                <span className="fact-label" style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'rgba(33,33,33,0.55)', flexShrink: 0 }}>{f.label}</span>
                <span className="fact-value" style={{ fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 600, color: 'var(--near-black,#1a0a0a)', textAlign: 'right' }}>{f.value}</span>
              </div>
            ))}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.10)' }}>
              <Link
                href={`/communities/${n.parentSlug}`}
                style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 600, color: 'var(--brand,#58172a)', textDecoration: 'none', letterSpacing: '0.06em' }}
              >
                ← Back to {n.parentName}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. HIGHLIGHTS ───────────────────────────────────────── */}
      <section id="highlights" style={{ background: '#ffffff', padding: '100px var(--pad-x,56px)' }} aria-labelledby="highlights-heading">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span className="section-eyebrow" style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>What Makes It Special</span>
            <h2 id="highlights-heading" className="section-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1 }}>
              Living in <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{n.name}</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {n.highlights.map((h, i) => (
              <div key={i} className="highlight-card" style={{ background: '#ebebeb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '32px 28px' }}>
                <div style={{ width: '40px', height: '3px', background: 'var(--brand,#58172a)', marginBottom: '18px' }} />
                <h3 className="highlight-title" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.01em', marginBottom: '12px' }}>{h.title}</h3>
                <p className="highlight-body" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.70, color: 'rgba(33,33,33,0.55)' }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3B. LOCATION MAP (rendered only when locationMap data is supplied) ── */}
      {n.locationMap && (
        <section id="location-map" style={{ background: '#faf7f2', padding: '90px var(--pad-x,56px)' }} aria-labelledby="location-map-heading">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="section-eyebrow" style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Where It Is</span>
              <h2 id="location-map-heading" className="section-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1 }}>
                {n.name} on the <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Map</em>
              </h2>
            </div>
            <CommunityLocationMap
              center={n.locationMap.center}
              zoom={n.locationMap.zoom}
              boundary={n.locationMap.boundary}
              marker={n.locationMap.marker}
              name={n.name}
            />
          </div>
        </section>
      )}

      {/* ── 4. WHO IS IT FOR ─────────────────────────────────────── */}
      <div id="lifestyle" style={{ background: '#ebebeb', padding: '90px var(--pad-x,56px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <div>
            <span className="section-eyebrow" style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Who It&rsquo;s For</span>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: '24px' }}>
              The {n.name}<br /><em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Lifestyle</em>
            </h2>
            {lifestyleBody.map((p, i) => (
              <p key={i} className="lifestyle-body" style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.78, color: 'rgba(33,33,33,0.55)', marginBottom: i < lifestyleBody.length - 1 ? '18px' : '24px' }}>
                {p}
              </p>
            ))}
            <ul className="lifestyle-bullets" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(33,33,33,0.55)', lineHeight: 2, paddingLeft: '18px' }}>
              {lifestyleBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'rgba(88,23,42,0.06)', borderRadius: '20px', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/assets/images/${n.image}`}
              alt={`${n.name} lifestyle, ${n.parentName}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
            />
          </div>
        </div>
      </div>

      {/* ── 5. MELLO-ROOS ───────────────────────────────────────── */}
      {mr.show !== false && (
        <section id="mello-roos" style={{ background: '#ffffff', padding: '100px var(--pad-x,56px)' }} aria-labelledby="mello-roos-heading">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

            <div className="mello-roos-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '72px', alignItems: 'start' }}>

              <div>
                <span className="section-eyebrow mello-eyebrow" style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>
                  Understanding Additional Property Assessments
                </span>
                <h2 id="mello-roos-heading" className="section-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: '24px' }}>
                  Mello-<em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Roos</em>
                </h2>
                <div style={{ width: '40px', height: '2px', background: 'var(--brand,#58172a)', margin: '20px 0 28px' }} />
                <p className="mello-roos-intro" style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.78, color: 'rgba(33,33,33,0.70)', marginBottom: '24px', fontWeight: 500 }}>
                  {mr.introText}
                </p>
                {mr.detailParagraphs.map((p, i) => (
                  <p key={i} className="mello-roos-body" style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.78, color: 'rgba(33,33,33,0.55)', marginBottom: '18px' }}>
                    {p}
                  </p>
                ))}
              </div>

              <div
                style={{ background: '#ebebeb', border: '1px solid rgba(0,0,0,0.10)', borderRadius: '14px', padding: '32px 28px', position: 'sticky', top: '96px' }}
                aria-label="Mello-Roos quick facts"
              >
                <p className="mello-qf-heading" style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.10)' }}>
                  Quick Facts
                </p>
                {mr.quickFacts.map((fact, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: i < mr.quickFacts.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand,#58172a)', marginTop: '7px' }} />
                    <span className="mello-qf-item" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.60, color: 'rgba(33,33,33,0.70)' }}>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mello-roos-disclaimer" style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(33,33,33,0.45)', lineHeight: 1.6, marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.08)', maxWidth: '820px' }}>
              <em>{mr.disclaimer}</em>
            </p>

            <div style={{ marginTop: '52px', background: '#faf7f2', border: '1px solid rgba(88,23,42,0.10)', borderRadius: '14px', padding: '36px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
              <div>
                <p className="mello-cta-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 500, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.01em', marginBottom: '8px' }}>
                  Need Help Understanding Mello-Roos?
                </p>
                <p className="mello-cta-body" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.65, color: 'rgba(33,33,33,0.55)', maxWidth: '560px', margin: 0 }}>
                  {mr.ctaText}
                </p>
              </div>
              <Link
                href={mr.ctaLink}
                className="btn btn-brand mello-cta-btn"
                aria-label="Contact our team about Mello-Roos assessments"
              >
                Contact Our Team
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* ── 6. LISTINGS ─────────────────────────────────────────── */}
      <div id="listings" style={{ background: '#faf7f2', padding: '90px var(--pad-x,56px)' }} aria-labelledby="listings-heading">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <div>
              <span className="section-eyebrow" style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Live MLS Data</span>
              <h2 id="listings-heading" className="section-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: 0 }}>
                {n.name} Homes For Sale
              </h2>
            </div>
            <a href={n.ylopoSearch} target="_blank" rel="noopener noreferrer" className="view-all-link" style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', whiteSpace: 'nowrap', textDecoration: 'none' }}>
              View All Listings →
            </a>
          </div>
          <div
            className="YLOPO_resultsWidget"
            data-search={JSON.stringify({
              locations: n.ylopoLocations,
              propertyTypes: ['house', 'condo', 'townhouse', 'multi_family'],
              status: 'active',
              limit: 12,
            })}
          />
          <div style={{ marginTop: '36px', textAlign: 'center' }}>
            <a href={n.ylopoSearch} target="_blank" rel="noopener noreferrer" className="btn-view-all" style={{ fontFamily: 'var(--font-label)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--brand,#58172a)', borderBottom: '1px solid rgba(88,23,42,0.30)', paddingBottom: '2px', textDecoration: 'none' }}>
              View All {n.name} Properties →
            </a>
          </div>
        </div>
      </div>

      {/* ── 7. NEARBY COMMUNITIES ───────────────────────────────── */}
      <div id="nearby-communities" style={{ background: '#faf7f2', padding: '90px var(--pad-x,56px)' }}>
        <div className="nearby-head" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <span className="section-eyebrow" style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Comparisons</span>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.64px', lineHeight: 1.1, marginBottom: '16px' }}>
            Nearby Communities<br />to <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Consider</em>
          </h2>
          <p className="nearby-desc" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(33,33,33,0.55)', marginBottom: '40px' }}>
            How {n.name} compares to neighboring areas — each with its own character, price point, and lifestyle.
          </p>
          <table className="nearby-table" style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-label)', fontSize: '13px' }} aria-label="Nearby San Diego communities comparison">
            <thead>
              <tr>
                <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 16px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Community</th>
                <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 16px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Starting Price</th>
                <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 16px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Why Consider</th>
                <th style={{ padding: '0 0 14px', borderBottom: '1px solid rgba(0,0,0,0.12)' }} />
              </tr>
            </thead>
            <tbody>
              {n.nearbyCommunities.map((nc, i) => (
                <tr key={i}>
                  <td style={{ padding: '16px 16px 16px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', verticalAlign: 'top' }}>
                    <Link href={`/communities/${nc.slug}`} style={{ fontWeight: 600, color: 'var(--near-black,#1a0a0a)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '18px' }}>
                      {nc.name}
                    </Link>
                  </td>
                  <td style={{ padding: '16px 16px 16px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'var(--brand,#58172a)', fontWeight: 600, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{nc.from}</td>
                  <td style={{ padding: '16px 16px 16px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'rgba(33,33,33,0.55)', verticalAlign: 'top' }}>{nc.whyConsider || ''}</td>
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

      {/* ── 8. CTA ──────────────────────────────────────────────── */}
      <section
        id="community-cta"
        style={{ position: 'relative', padding: '120px var(--pad-x,56px)', textAlign: 'center', overflow: 'hidden' }}
        aria-labelledby="community-cta-heading"
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/hero-background/hero-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(1.05) saturate(0.9)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,245,245,0.88)', zIndex: 1 }} aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
          <span className="section-eyebrow" style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.64px', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '14px' }}>Your Guide to {n.name}</span>
          <h2 id="community-cta-heading" className="cta-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5vw,72px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
            <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Find Your Home</em><br />in {n.name}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.72, color: 'rgba(33,33,33,0.55)', marginBottom: '40px' }}>
            Explore available residences and discover whether {n.name} is the right fit for your lifestyle. Hedda Parashos and the Palisade Realty team know Downtown San Diego inside and out.
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

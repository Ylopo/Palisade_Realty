import type { Metadata } from 'next'
import Link from 'next/link'
import CommunitiesGrid from './CommunitiesGrid'

export const metadata: Metadata = {
  title: 'San Diego Communities',
  description:
    'Explore San Diego\'s finest communities with Palisade Realty. From La Jolla and Coronado to Rancho Santa Fe and beyond — find your perfect neighborhood.',
}

export default function CommunitiesPage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="comm-hero" aria-label="San Diego Communities">
        <div className="comm-hero-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/community-la-jolla.jpg" alt="La Jolla coastline" loading="eager" />
        </div>
        <div className="comm-hero-content">
          <nav className="comm-hero-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span aria-hidden="true">›</span>
            <span>Communities</span>
          </nav>
          <span className="comm-hero-eyebrow">Palisade Realty</span>
          <h1 className="comm-hero-title">
            San Diego<br />Communities
          </h1>
          <div className="comm-hero-stats" role="list" aria-label="At a glance">
            <div className="comm-hero-stat" role="listitem">
              <span className="comm-hero-stat-value">18</span>
              <span className="comm-hero-stat-label">Communities</span>
            </div>
            <div className="comm-hero-stat" role="listitem">
              <span className="comm-hero-stat-value">70+</span>
              <span className="comm-hero-stat-label">Miles of Coastline</span>
            </div>
            <div className="comm-hero-stat" role="listitem">
              <span className="comm-hero-stat-value">$500K–$10M+</span>
              <span className="comm-hero-stat-label">Price Range</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO SPLIT ─────────────────────────────────────── */}
      <section className="comm-intro" aria-labelledby="comm-intro-heading">
        <div>
          <span className="comm-intro-eyebrow">Our Coverage</span>
          <h2 className="comm-intro-title" id="comm-intro-heading">
            Find Your Perfect Place<br />in San Diego
          </h2>
          <p className="comm-intro-body">
            From oceanfront estates in La Jolla and Coronado to the rolling hills of Rancho Santa Fe,
            Palisade Realty serves every corner of San Diego County. Our team of local experts knows
            these neighborhoods inside and out — helping you find not just a home, but the right
            community for your lifestyle.
          </p>
          <a href="tel:+16197940218" className="comm-intro-cta">
            Talk to a Local Expert
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        <div className="comm-intro-tiles" aria-label="At a glance statistics">
          <div className="comm-intro-tile">
            <span className="comm-intro-tile-value">18</span>
            <span className="comm-intro-tile-label">Premier Communities</span>
          </div>
          <div className="comm-intro-tile">
            <span className="comm-intro-tile-value">15+</span>
            <span className="comm-intro-tile-label">Years of Experience</span>
          </div>
          <div className="comm-intro-tile">
            <span className="comm-intro-tile-value">60+</span>
            <span className="comm-intro-tile-label">Expert Agents</span>
          </div>
        </div>
      </section>

      {/* ── COMMUNITIES GRID (client — filterable) ──────────── */}
      <CommunitiesGrid />

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="comm-cta" id="cta" aria-labelledby="comm-cta-heading">
        <div className="comm-cta-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/cta-background.jpg" alt="" />
          <div className="comm-cta-bg-overlay" />
        </div>
        <div className="comm-cta-content">
          <p className="comm-cta-eyebrow">Work With Us</p>
          <h2 className="comm-cta-title" id="comm-cta-heading">
            Ready to Find Your Dream Community?
          </h2>
          <div className="comm-cta-btns">
            <a href="tel:+16197940218" className="comm-cta-btn-primary">Let&rsquo;s Connect</a>
            <a
              href="https://search.palisaderealty.com/"
              className="comm-cta-btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Properties
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

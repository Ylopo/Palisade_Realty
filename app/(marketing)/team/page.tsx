import type { Metadata } from 'next'
import Link from 'next/link'
import TeamGrid from './TeamGrid'

export const metadata: Metadata = {
  title: 'Meet Our Team',
  description:
    'Meet the 80+ licensed real estate professionals at Palisade Realty. San Diego agents with deep local knowledge ready to guide your next home purchase or sale.',
}

export default function TeamPage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="tp-hero" aria-label="Meet Our Team">
        <div className="tp-hero-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-background/hero-4.jpg" alt="Palisade Realty team" loading="eager" />
        </div>
        <div className="tp-hero-overlay" aria-hidden="true" />
        <div className="tp-hero-content">
          <span className="tp-eyebrow">San Diego Real Estate</span>
          <h1 className="tp-hero-h1">Meet Our <em>Team</em></h1>
          <p className="tp-hero-sub">
            80+ passionate local agents. 15+ years of San Diego expertise. One mission — to guide
            you home.
          </p>
          <Link href="/contact" className="btn btn-brand">Connect With Us</Link>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <div className="tp-stats" aria-label="Team statistics">
        <div className="tp-stats-inner">
          <div className="tp-stat">
            <span className="tp-stat-num">80+</span>
            <span className="tp-stat-label">Agents on the Team</span>
          </div>
          <div className="tp-stat">
            <span className="tp-stat-num">15+</span>
            <span className="tp-stat-label">Years of Excellence</span>
          </div>
          <div className="tp-stat">
            <span className="tp-stat-num">19</span>
            <span className="tp-stat-label">San Diego Communities</span>
          </div>
          <div className="tp-stat">
            <span className="tp-stat-num">1,000+</span>
            <span className="tp-stat-label">Families Served</span>
          </div>
        </div>
      </div>

      {/* ── INTRO / HEDDA SPOTLIGHT ─────────────────────────── */}
      <section className="tp-section" aria-labelledby="intro-heading">
        <div className="tp-wrap tp-intro-grid">
          <div>
            <span className="tp-intro-tag">Our Story</span>
            <h2 className="tp-intro-h2" id="intro-heading">
              Built on <em>Results.</em><br />Driven by People.
            </h2>
            <p className="tp-intro-body">
              Palisade Realty was founded on the belief that every client deserves a true partner —
              someone who listens, advocates, and delivers. Under the leadership of CEO Hedda Parashos,
              we&apos;ve grown into one of San Diego&apos;s most respected independent brokerages, with
              agents spanning every corner of the county.
            </p>
            <p className="tp-intro-body" style={{ marginTop: '16px' }}>
              We don&apos;t just sell homes. We help families find their place in one of the world&apos;s
              most beautiful cities.
            </p>
          </div>
          <div className="tp-intro-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/agents/hedda-parashos.jpg"
              alt="Hedda Parashos, CEO of Palisade Realty"
              loading="lazy"
            />
            <div className="tp-intro-badge">
              <div className="tp-intro-badge-name">Hedda Parashos</div>
              <div className="tp-intro-badge-title">CEO · CA DRE #01773167</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP + AGENTS GRIDS (client — searchable) ── */}
      <TeamGrid />

      {/* ── WHY PALISADE ────────────────────────────────────── */}
      <section className="tp-section tp-section--dark" aria-labelledby="why-heading">
        <div className="tp-wrap">
          <div className="tp-sec-header">
            <p className="tp-sec-tag" style={{ color: 'rgba(238,202,0,.8)' }}>Our Difference</p>
            <h2 className="tp-sec-h2 tp-sec-h2--light" id="why-heading">Why Choose <em>Palisade</em></h2>
          </div>
          <div className="tp-why-grid">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s-8-5-8-11a8 8 0 0 1 16 0c0 6-8 11-8 11z" />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                ),
                title: 'Deep Local Knowledge',
                body: 'Our agents live and work in the communities they serve. From La Jolla to Spring Valley, we know every neighborhood intimately.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: 'A Team of 80+',
                body: 'No single-agent limits. With 80+ professionals, someone on our team has sold your exact type of home, in your neighborhood, this year.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                title: 'Proven Results',
                body: '1,000+ families served. A 4.9-star average rating. A track record of pricing accurately, marketing strategically, and closing cleanly.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
                title: 'Always Available',
                body: 'Real estate doesn\'t run 9-to-5. Our agents are responsive, communicative, and present when you need them — whether it\'s a Monday morning or Sunday showing.',
              },
            ].map((card, i) => (
              <div key={i} className="tp-why-card">
                <div className="tp-why-icon">{card.icon}</div>
                <h3 className="tp-why-title">{card.title}</h3>
                <p className="tp-why-body">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="tp-cta" aria-labelledby="team-cta-heading">
        <div className="tp-wrap">
          <h2 className="tp-cta-heading" id="team-cta-heading">
            Ready to Work With <em>San Diego&rsquo;s Best?</em>
          </h2>
          <p className="tp-cta-sub">
            Whether you&rsquo;re buying your first home or your fifth, our agents are here to guide
            you every step of the way.
          </p>
          <div className="tp-cta-btns">
            <Link href="/contact" className="btn btn-brand">Get in Touch</Link>
            <a href="https://search.palisaderealty.com/" className="btn btn-outline-white" target="_blank" rel="noopener noreferrer">
              Search Listings
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

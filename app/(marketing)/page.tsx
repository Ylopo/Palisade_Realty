import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import HomepageInit from '@/components/HomepageInit'

export const metadata: Metadata = {
  title: 'San Diego Real Estate',
  description: 'Experience the new way of buying and selling real estate in San Diego with Palisade Realty. Expert agents, exclusive listings, and unmatched local market knowledge.',
}

const STAR_SVG = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="#eeca00" aria-hidden="true">
    <path d="M9 1.5l2.09 4.24 4.67.68-3.38 3.29.8 4.65L9 12l-4.18 2.36.8-4.65L2.24 6.42l4.67-.68z" />
  </svg>
)

const STARS = (
  <div className="testimonial-stars" aria-label="5 out of 5 stars">
    {STAR_SVG}{STAR_SVG}{STAR_SVG}{STAR_SVG}{STAR_SVG}
  </div>
)

const EXPLORE_ICON = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function HomePage() {
  return (
    <>
      <HomepageInit />
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero" id="hero" aria-label="Hero — San Diego luxury real estate">
        <div className="hero-bg" aria-hidden="true">
          <video className="hero-video" autoPlay muted loop playsInline preload="metadata">
            <source src="/assets/images/bg-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-crest" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/graphic-logo-wht.png" alt="" />
          </div>
          <h1 className="hero-title">PALISADE REALTY</h1>
          <p className="hero-subtitle">
            Experience the new way of Buying and Selling real estate<br />in today&rsquo;s shifting market.
          </p>
          <div className="hero-ctas">
            <a href="https://search.palisaderealty.com/" className="btn btn-brand-lg" target="_blank" rel="noopener noreferrer">
              Find Your Dream Home
            </a>
            <a href="#cta" className="btn btn-outline-white">Let&rsquo;s Connect</a>
          </div>
        </div>
        <form className="hero-search" id="hero-search-form" role="search" action="https://search.palisaderealty.com/" method="GET">
          <div className="hero-search-field">
            <label className="hero-search-label" htmlFor="hero-q">Enter City / Neighborhood</label>
            <input
              id="hero-q"
              name="q"
              className="hero-search-input"
              type="text"
              placeholder="City or Neighborhood"
              autoComplete="off"
            />
          </div>
          <div className="hero-search-field hero-search-field--select">
            <label className="hero-search-label" htmlFor="hero-type">Property Type</label>
            <div className="hero-search-select-wrap">
              <select id="hero-type" name="propertyType" className="hero-search-select">
                <option value="">Residential</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="multi-family">Multi-Family</option>
                <option value="land">Land</option>
              </select>
              <svg className="hero-search-chevron" width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
                <path d="M1 1l6 6 6-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="hero-search-field hero-search-field--select">
            <label className="hero-search-label" htmlFor="hero-price">Price Limit</label>
            <div className="hero-search-select-wrap">
              <select id="hero-price" name="maxPrice" className="hero-search-select">
                <option value="">Any Price</option>
                <option value="500000">Under $500K</option>
                <option value="1000000">Under $1M</option>
                <option value="2000000">Under $2M</option>
                <option value="5000000">Under $5M</option>
                <option value="10000000">Under $10M</option>
              </select>
              <svg className="hero-search-chevron" width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
                <path d="M1 1l6 6 6-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <button className="hero-search-btn" type="submit" aria-label="Search properties">
            <svg className="hero-search-btn-icon" width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="2" />
              <path d="M13 13L17 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            SEARCH
          </button>
        </form>
      </section>

      {/* ── COMMUNITIES ──────────────────────────────────── */}
      <section className="communities" id="communities" aria-labelledby="communities-heading">
        <span className="communities-eyebrow reveal">Where We Work</span>
        <h2 className="communities-heading section-title reveal stagger-1" id="communities-heading">
          Explore Our Communities
        </h2>
        <div className="communities-cards" role="list">

          <article className="community-card" role="listitem">
            <div className="community-card-bg" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/community-downtown-san-diego.jpg" alt="Downtown San Diego cityscape" loading="lazy" />
              <div className="community-card-overlay" />
            </div>
            <div className="community-card-content">
              <h3 className="community-card-name">Downtown San Diego</h3>
              <div className="community-card-accent" />
              <p className="community-card-desc">Urban sophistication meets coastal living. World-class dining, nightlife, and walkable neighborhoods in the heart of America&rsquo;s Finest City.</p>
              <Link href="/communities/downtown-san-diego-real-estate" className="community-explore-btn">
                Explore {EXPLORE_ICON}
              </Link>
            </div>
          </article>

          <article className="community-card" role="listitem">
            <div className="community-card-bg" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/community-carmel-valley.jpg" alt="Carmel Valley neighborhood" loading="lazy" />
              <div className="community-card-overlay" />
            </div>
            <div className="community-card-content">
              <h3 className="community-card-name">Carmel Valley</h3>
              <div className="community-card-accent" />
              <p className="community-card-desc">North County&rsquo;s premier family destination. Top-rated schools, walkable village amenities at One Paseo, and easy coastal access in one polished package.</p>
              <Link href="/communities/carmel-valley-real-estate" className="community-explore-btn">
                Explore {EXPLORE_ICON}
              </Link>
            </div>
          </article>

          <article className="community-card" role="listitem">
            <div className="community-card-bg" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/community-mission-valley.jpg" alt="Mission Valley San Diego" loading="lazy" />
              <div className="community-card-overlay" />
            </div>
            <div className="community-card-content">
              <h3 className="community-card-name">Mission Valley</h3>
              <div className="community-card-accent" />
              <p className="community-card-desc">San Diego&rsquo;s central hub. Unbeatable freeway access, trolley connections, SDSU energy, and exceptional value minutes from the beach and downtown.</p>
              <Link href="/communities/mission-valley-real-estate" className="community-explore-btn">
                Explore {EXPLORE_ICON}
              </Link>
            </div>
          </article>

          <article className="community-card" role="listitem">
            <div className="community-card-bg" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/community-spring-valley.jpg" alt="Spring Valley neighborhood" loading="lazy" />
              <div className="community-card-overlay" />
            </div>
            <div className="community-card-content">
              <h3 className="community-card-name">Spring Valley</h3>
              <div className="community-card-accent" />
              <p className="community-card-desc">East County value with a strong community character. Established neighborhoods, full-sized homes, and a 15-minute commute to Downtown San Diego.</p>
              <Link href="/communities/spring-valley-real-estate" className="community-explore-btn">
                Explore {EXPLORE_ICON}
              </Link>
            </div>
          </article>

        </div>
      </section>

      {/* ── FIND YOUR PLACE / MAPBOX ──────────────────────── */}
      <section className="find-your-place" id="find-your-place" aria-labelledby="fyp-heading">
        <div className="fyp-left">
          <span className="eyebrow reveal">Explore the Region</span>
          <h2 className="fyp-title reveal stagger-1" id="fyp-heading">Let&rsquo;s Find Your Place</h2>
          <p className="fyp-subtitle reveal stagger-2">Click any location to dive deeper into what it&rsquo;s really like to live there.</p>
          <ul className="lfyp-cities reveal stagger-3" aria-label="San Diego communities">
            {[
              ['downtown-san-diego', 'Downtown San Diego'],
              ['mission-hills', 'Mission Hills'],
              ['mission-valley', 'Mission Valley'],
              ['north-park', 'North Park'],
              ['point-loma', 'Point Loma'],
              ['coronado', 'Coronado'],
              ['pacific-beach', 'Pacific Beach'],
              ['mission-beach', 'Mission Beach'],
              ['la-jolla', 'La Jolla'],
              ['del-mar', 'Del Mar'],
              ['carmel-valley', 'Carmel Valley'],
              ['rancho-santa-fe', 'Rancho Santa Fe'],
              ['rancho-penasquitos', 'Rancho Peñasquitos'],
              ['scripps-ranch', 'Scripps Ranch'],
              ['encinitas', 'Encinitas'],
              ['carlsbad', 'Carlsbad'],
              ['oceanside', 'Oceanside'],
              ['chula-vista', 'Chula Vista'],
              ['la-mesa', 'La Mesa'],
              ['el-cajon', 'El Cajon'],
            ].map(([slug, name]) => (
              <li key={slug}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" data-slug={slug} data-city={name} aria-label={`View ${name} community`} tabIndex={0}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
          <div className="reveal stagger-4">
            <Link href="/communities" className="btn btn-brand">See All Communities</Link>
          </div>
        </div>
        <div className="fyp-right reveal stagger-2">
          <div className="lfyp-map-wrap">
            <div id="lfyp-map" role="application" aria-label="Interactive San Diego communities map" />
            <div className="lfyp-map-error" id="lfyp-map-error" aria-live="polite">
              <strong>Map unavailable</strong>
              <p>We couldn&rsquo;t load the interactive map. Please try refreshing, or explore communities using the list.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT HEDDA ──────────────────────────────────── */}
      <div className="about-outer">
        <section className="about" id="about" aria-labelledby="about-heading">
          <div className="about-text">
            <a
              href="https://palisaderealty.com/team-page/hedda-parashos"
              className="about-name reveal"
              id="about-heading"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hedda Parashos
            </a>
            <p className="about-title reveal stagger-1">CEO</p>
            <p className="about-bio reveal stagger-2">
              Hedda founded Palisade Realty in 2010 and has built it into one of San Diego&rsquo;s most trusted
              luxury real estate firms &mdash; with a team of 60+ agents and over 15 years of market expertise.
              Her commitment to innovative representation, deep local knowledge, and genuine care for every
              client has positioned Palisade Realty as the go-to brokerage across the greater San Diego
              region. From first-time buyers to seasoned investors, Hedda&rsquo;s team delivers the professional,
              efficient, and rewarding experience today&rsquo;s market demands.
            </p>
            <div className="about-cta reveal stagger-3">
              <a href="#team-carousel" className="btn btn-brand">Meet Our Team</a>
            </div>
          </div>
          <div className="about-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/Hedda_Parashos.jpg" alt="Hedda Parashos, CEO of Palisade Realty" />
          </div>
        </section>
      </div>

      {/* ── TEAM CAROUSEL ─────────────────────────────────── */}
      <section id="team-carousel" aria-labelledby="tc-heading">
        <div className="tc-hd">
          <div className="tc-eyebrow" aria-hidden="true">The Palisade Realty Team</div>
          <h2 className="tc-title" id="tc-heading">Meet Our Agents</h2>
        </div>
        <div className="tc-outer">
          <button className="tc-arrow" id="tcPrev" aria-label="Previous agent">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {/* Cards are injected by homepage-nextjs.js initTeamCarousel() */}
          <div className="tc-stage" id="tcStage" role="region" aria-label="Team members carousel" />
          <button className="tc-arrow" id="tcNext" aria-label="Next agent">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="team-cta-row">
          <Link href="/team" className="btn btn-brand">View All Agents</Link>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES CAROUSEL ─────────────────── */}
      <section id="featured-properties">
        <div className="fl-header">
          <span className="fl-header-eyebrow">Palisade Realty</span>
          <h2 className="fl-header-title">Featured Properties</h2>
        </div>
        <div className="fl-section" role="region" aria-label="Featured property listings" aria-roledescription="carousel" tabIndex={0}>
          <div className="fl-slide-container" id="fp-stage" />
          <div className="fl-arrows" role="group" aria-label="Carousel navigation">
            <button className="fl-arrow fl-arrow-prev" id="fp-prev" aria-label="Previous listing" type="button">
              <svg viewBox="0 0 18 18"><polyline points="11 14 6 9 11 4" /></svg>
            </button>
            <button className="fl-arrow fl-arrow-next" id="fp-next" aria-label="Next listing" type="button">
              <svg viewBox="0 0 18 18"><polyline points="7 4 12 9 7 14" /></svg>
            </button>
          </div>
          <div className="fl-dots" id="fp-dots" role="tablist" aria-label="Listing slides" />
          <div className="fl-counter" aria-hidden="true">
            <span className="fl-counter-current" id="fl-counter-current">01</span> / <span id="fl-counter-total">01</span>
          </div>
        </div>
      </section>

      {/* ── YLOPO LISTINGS WIDGET ─────────────────────────── */}
      <div className="listings-outer" id="fl-wrapper">
        <section className="listings" id="listings" aria-labelledby="listings-heading">
          <span className="listings-eyebrow reveal">Handpicked Just for You</span>
          <h2 className="listings-heading section-title reveal stagger-1" id="listings-heading">Our Listings</h2>
          <div className="listings-widget-wrap reveal stagger-2">
            <div
              className="YLOPO_resultsWidget"
              data-search='{"locations":[{"city":"San Diego","state":"CA"},{"city":"La Jolla","state":"CA"},{"city":"Coronado","state":"CA"},{"city":"Del Mar","state":"CA"},{"city":"Encinitas","state":"CA"}]}'
            />
          </div>
          <div className="reveal stagger-3">
            <a href="https://search.palisaderealty.com/" className="btn btn-brand" target="_blank" rel="noopener noreferrer">
              View All Listings
            </a>
          </div>
        </section>
      </div>
      <Script src="https://search.palisaderealty.com/build/js/widgets-1.0.0.js" strategy="afterInteractive" />

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="testimonial" id="testimonials" aria-labelledby="testimonials-heading">
        <div className="testimonial-bg" aria-hidden="true" />
        <div className="testimonial-inner">
          <p className="testimonial-eyebrow reveal">Client Reviews</p>
          <h2 className="testimonial-heading reveal stagger-1" id="testimonials-heading">What Our Clients Say</h2>

          <div className="testimonial-avatars reveal stagger-2" role="tablist" aria-label="Select reviewer">
            {[
              { name: 'Anh',      img: '/assets/images/agents/anh-lam.jpg',           id: 'tp-slide-0', idx: 0 },
              { name: 'Wally',    img: '/assets/images/agents/wally-dally.png',        id: 'tp-slide-1', idx: 1 },
              { name: 'Jennifer', img: '/assets/images/agents/jennifer-crosby.jpg',    id: 'tp-slide-2', idx: 2 },
              { name: 'Taylor',   img: '/assets/images/agents/taylor-schunk.jpg',      id: 'tp-slide-3', idx: 3 },
              { name: 'Jeremy',   img: '/assets/images/agents/jeremy-mchone.png',      id: 'tp-slide-4', idx: 4 },
              { name: 'Corinne',  img: '/assets/images/agents/corinne-mauro.jpg',      id: 'tp-slide-5', idx: 5 },
              { name: 'Jodi',     img: '/assets/images/agents/jodi-kirkwood.jpg',      id: 'tp-slide-6', idx: 6 },
            ].map(({ name, img, id, idx }) => (
              <button
                key={idx}
                className={`testimonial-avatar${idx === 0 ? ' active' : ''}`}
                role="tab"
                aria-selected={idx === 0}
                aria-controls={id}
                tabIndex={idx === 0 ? 0 : -1}
                data-index={idx}
              >
                <div className="testimonial-avatar-initials" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="tp-av-img" />
                </div>
                <span className="testimonial-avatar-name">{name}</span>
              </button>
            ))}
          </div>

          <div className="tp-caret-wrap" aria-hidden="true">
            <div className="tp-caret" />
          </div>

          <div className="tp-slides-wrap" role="presentation">

            <div className="tp-slide is-active" id="tp-slide-0" role="tabpanel" aria-labelledby="tab-0">
              <div className="testimonial-card">
                {STARS}
                <p className="testimonial-quote" data-quote-index="0">&ldquo;Working with Anh was honestly one of the best decisions we made. She made the entire process as stress free as possible, going above and beyond to make sure we had everything on our list. Her knowledge of the market and outstanding communication gave us confidence every step of the way &mdash; we truly felt like she had our best interests at heart the entire time.&rdquo;</p>
                <div className="tp-agent-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/agents/anh-lam.jpg" alt="Anh Lam" className="tp-agent-photo" />
                  <div className="tp-agent-info">
                    <span className="tp-review-for">Review for</span>
                    <span className="testimonial-author-name">Anh Lam</span>
                  </div>
                </div>
                <span className="testimonial-author-detail">by Kristian Tram &middot; Verified Client</span>
              </div>
            </div>

            <div className="tp-slide" id="tp-slide-1" role="tabpanel" aria-labelledby="tab-1">
              <div className="testimonial-card">
                {STARS}
                <p className="testimonial-quote" data-quote-index="1">&ldquo;We worked with Wally on both the sale of our condo and the purchase of our home, and had a fantastic experience from start to finish. What we appreciated most was his communication &mdash; consistent real-time updates, total honesty at every stage, and a network of trusted professionals that made the entire process much smoother. Highly recommend!&rdquo;</p>
                <div className="tp-agent-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/agents/wally-dally.png" alt="Wally Dally" className="tp-agent-photo" />
                  <div className="tp-agent-info">
                    <span className="tp-review-for">Review for</span>
                    <span className="testimonial-author-name">Wally Dally</span>
                  </div>
                </div>
                <span className="testimonial-author-detail">Verified Client</span>
              </div>
            </div>

            <div className="tp-slide" id="tp-slide-2" role="tabpanel" aria-labelledby="tab-2">
              <div className="testimonial-card">
                {STARS}
                <p className="testimonial-quote" data-quote-index="2">&ldquo;Five stars truly isn&rsquo;t enough to describe working with Jennifer. She brings a rare combination of deep market knowledge, flawless professionalism, and a brilliant get-it-done attitude. Real estate transactions can be stressful, but she completely shielded me from all of it &mdash; the process was entirely seamless. She is exceptional; I&rsquo;d recommend her to anyone!&rdquo;</p>
                <div className="tp-agent-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/agents/jennifer-crosby.jpg" alt="Jennifer Crosby" className="tp-agent-photo" />
                  <div className="tp-agent-info">
                    <span className="tp-review-for">Review for</span>
                    <span className="testimonial-author-name">Jennifer Crosby</span>
                  </div>
                </div>
                <span className="testimonial-author-detail">Verified Client</span>
              </div>
            </div>

            <div className="tp-slide" id="tp-slide-3" role="tabpanel" aria-labelledby="tab-3">
              <div className="testimonial-card">
                {STARS}
                <p className="testimonial-quote" data-quote-index="3">&ldquo;We had a great experience working with Taylor. She was consistently responsive, friendly, and took the time to clearly explain each step of the process &mdash; which made everything feel much less overwhelming. She was also a strong negotiator and helped us feel confident we were getting the best possible outcome from start to finish!&rdquo;</p>
                <div className="tp-agent-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/agents/taylor-schunk.jpg" alt="Taylor Schunk" className="tp-agent-photo" />
                  <div className="tp-agent-info">
                    <span className="tp-review-for">Review for</span>
                    <span className="testimonial-author-name">Taylor Schunk</span>
                  </div>
                </div>
                <span className="testimonial-author-detail">Verified Client</span>
              </div>
            </div>

            <div className="tp-slide" id="tp-slide-4" role="tabpanel" aria-labelledby="tab-4">
              <div className="testimonial-card">
                {STARS}
                <p className="testimonial-quote" data-quote-index="4">&ldquo;Jeremy managed to help us sell our house completely off-market, which saved us an incredible amount of time and stress. He flawlessly handled all the paperwork and took care of every interaction with contractors and vendors &mdash; we never had to worry about coordinating a thing. We cannot recommend Jeremy highly enough!&rdquo;</p>
                <div className="tp-agent-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/agents/jeremy-mchone.png" alt="Jeremy McHone" className="tp-agent-photo" />
                  <div className="tp-agent-info">
                    <span className="tp-review-for">Review for</span>
                    <span className="testimonial-author-name">Jeremy McHone</span>
                  </div>
                </div>
                <span className="testimonial-author-detail">Verified Client</span>
              </div>
            </div>

            <div className="tp-slide" id="tp-slide-5" role="tabpanel" aria-labelledby="tab-5">
              <div className="testimonial-card">
                {STARS}
                <p className="testimonial-quote" data-quote-index="5">&ldquo;Corinne went above and beyond. She was always available every weekend to tour whatever listing we sent her way, did her homework on each house beforehand, and listened carefully to our needs. She was always quick to respond and was consistently a dream to work with. We will be sending her name around to anyone we know who is house hunting!&rdquo;</p>
                <div className="tp-agent-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/agents/corinne-mauro.jpg" alt="Corinne Mauro" className="tp-agent-photo" />
                  <div className="tp-agent-info">
                    <span className="tp-review-for">Review for</span>
                    <span className="testimonial-author-name">Corinne Mauro</span>
                  </div>
                </div>
                <span className="testimonial-author-detail">Verified Client</span>
              </div>
            </div>

            <div className="tp-slide" id="tp-slide-6" role="tabpanel" aria-labelledby="tab-6">
              <div className="testimonial-card">
                {STARS}
                <p className="testimonial-quote" data-quote-index="6">&ldquo;We can&rsquo;t recommend Jodi Kirkwood highly enough! She helped us both purchase our upstairs condo and sell our existing condo. Her knowledge of the local market is outstanding, and thanks to her expertise we received top dollar for our sale. She was always responsive, professional, and a strong advocate for us every step of the way. We would absolutely work with her again.&rdquo;</p>
                <div className="tp-agent-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/agents/jodi-kirkwood.jpg" alt="Jodi Kirkwood" className="tp-agent-photo" />
                  <div className="tp-agent-info">
                    <span className="tp-review-for">Review for</span>
                    <span className="testimonial-author-name">Jodi Kirkwood</span>
                  </div>
                </div>
                <span className="testimonial-author-detail">Verified Client</span>
              </div>
            </div>

          </div>

          <div className="tp-cta-wrap reveal stagger-3">
            <Link href="/testimonials" className="tp-see-more-btn">
              Read All Client Reviews
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────────────────── */}
      <section className="blog" id="blog" aria-labelledby="blog-heading">
        <div className="blog-header">
          <span className="blog-eyebrow reveal">Latest Insights &amp; Market Trends</span>
          <h2 className="blog-heading reveal stagger-1" id="blog-heading">Real Estate Tips &amp; Expert Advice</h2>
        </div>
        <div className="blog-carousel" role="region" aria-label="Blog posts carousel">
          <button className="carousel-arrow" id="blog-prev" aria-label="Previous blog posts">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="blog-cards-viewport">
            <div className="blog-cards-track" id="blog-track">
              {[
                { slug: 'why-having-a-good-driveway-matters-when-selling-your-home', date: 'Jun 11, 2026', badge: 'SELLER', title: "Here's Why Having A Good Driveway Matters When Selling Your Home", excerpt: 'Your driveway is often the first thing buyers physically interact with. Learn why its condition directly impacts buyer perception and your final sale price.' },
                { slug: 'landscaping-costs-homebuyers-forget-to-budget-for', date: 'May 21, 2026', badge: 'BUYER', title: "Here's One Thing Most Home Buyers Forget to Budget For: Landscaping", excerpt: 'First-time buyers often overlook landscaping costs. Understanding these ongoing expenses before buying can prevent financial surprises down the road.' },
                { slug: 'simple-guide-to-choosing-the-ideal-paint-color-for-your-space', date: 'Apr 27, 2026', badge: 'HOMEOWNER', title: 'A Simple Guide To Choosing The Ideal Paint Color For Your Space', excerpt: 'Choosing the right paint color feels overwhelming with thousands of options. This guide walks you through key considerations to find the perfect color for any room.' },
                { slug: 'understanding-cash-to-close-in-real-estate', date: 'Apr 15, 2026', badge: 'BUYER', title: 'Understanding Cash to Close When Purchasing A Home', excerpt: "Beyond the down payment, buyers need to prepare for dozens of smaller fees at closing. Learn what cash to close means and how to budget for it well in advance." },
                { slug: 'easy-and-inexpensive-bathroom-updates-you-can-make-before-selling-your-home', date: 'Mar 27, 2026', badge: 'SELLER', title: 'Easy and Inexpensive Bathroom Updates You Can Make Before Selling Your Home', excerpt: 'Simple, affordable bathroom improvements can significantly boost your home\'s appeal to buyers — even with minimal DIY experience.' },
                { slug: 'where-to-keep-your-down-payment-savings', date: 'Mar 16, 2026', badge: 'BUYER', title: 'Where to Keep Your Down Payment Savings For Your Dream Home', excerpt: 'Where you keep your down payment savings can make a meaningful difference in how quickly you reach your homeownership goal.' },
                { slug: '5-ways-your-neighbors-can-affect-your-homes-value', date: 'Feb 23, 2026', badge: 'HOMEOWNER', title: "5 Ways Your Neighbors Can Affect Your Home's Value", excerpt: 'No matter how well you maintain your property, neighboring homes can influence its value. Understanding this dynamic helps you make smarter real estate decisions.' },
                { slug: 'from-date-nights-to-mortgage-payments-tips-for-couples-buying-their-first-home-together', date: 'Feb 9, 2026', badge: 'BUYER', title: 'From Date Nights to Mortgage Payments: Tips for Couples Buying Their First Home Together', excerpt: 'Buying a home is one of the biggest decisions couples make together. With the right preparation, the process can strengthen your relationship and your finances.' },
                { slug: 'simple-but-effective-habits-for-a-cleaner-and-tidier-home-all-year', date: 'Jan 20, 2026', badge: 'HOMEOWNER', title: '7 Simple But Effective Habits For A Cleaner and Tidier Home All Year', excerpt: 'Small, consistent habits make a bigger difference than marathon cleaning sessions. Start these routines now for a more organized home throughout the year.' },
                { slug: 'why-you-should-list-your-home-at-the-beginning-of-the-year', date: 'Jan 6, 2026', badge: 'SELLER', title: 'Why You Should List Your Home at the Beginning of the Year', excerpt: 'Most sellers wait for spring, but listing at the start of the year can give you a competitive edge with motivated buyers and far less competition.' },
                { slug: '7-step-practical-guide-to-unpacking-efficiently-after-a-move', date: 'Dec 4, 2025', badge: 'GENERAL', title: 'A 7-Step Practical Guide to Unpacking Efficiently After A Move', excerpt: 'A systematic approach to unpacking can transform an overwhelming pile of boxes into a comfortable home in days — not weeks.' },
                { slug: 'your-home-buyer-wants-to-extend-the-closing-date-part-2', date: 'Nov 25, 2025', badge: 'SELLER', title: 'Your Home Buyer Wants To Extend The Closing Date—What Now? [Part 2]', excerpt: 'When a buyer requests more time to close, sellers face a difficult decision. Part 2 covers your options, how to negotiate, and when walking away makes sense.' },
                { slug: 'your-home-buyer-wants-to-extend-the-closing-date-what-now-part-1', date: 'Nov 18, 2025', badge: 'SELLER', title: 'Your Home Buyer Wants To Extend The Closing Date—What Now? [Part 1]', excerpt: "A closing date extension can be frustrating when you've already planned your move. Learn why buyers ask for more time and what your rights are as a seller." },
                { slug: 'biggest-home-inspection-red-flags-to-look-out-for-before-buying', date: 'Oct 24, 2025', badge: 'BUYER', title: 'Biggest Home Inspection Red Flags To Look Out For Before Buying', excerpt: 'From structural defects to pest infestations, certain inspection findings can reveal serious underlying risks every buyer should watch for before closing.' },
                { slug: 'budget-friendly-home-improvement-projects-perfect-to-tackle-this-fall', date: 'Oct 5, 2025', badge: 'HOMEOWNER', title: '5 Budget-Friendly Home Improvement Projects Perfect to Tackle This Fall', excerpt: 'Fall is the ideal season for home improvement projects before winter arrives. These affordable updates add real value without requiring a major investment.' },
                { slug: 'how-many-showings-does-it-take-to-sell-a-house', date: 'Sep 16, 2025', badge: 'SELLER', title: 'How Many Showings Does It Take To Sell A House?', excerpt: 'The answer depends on your market, pricing, and presentation — all factors you can influence. Here\'s what the data says about showings before an offer.' },
                { slug: 'what-you-should-know-about-a-homes-hvac-system', date: 'Aug 31, 2025', badge: 'HOMEOWNER', title: "What You Should Know About A Home's HVAC System", excerpt: "Your home's HVAC is one of its most expensive components. Understanding how it works, how to maintain it, and when to replace it can save you thousands." },
                { slug: 'should-you-buy-a-new-house-before-selling-your-old-one-lets-explore-the-pros-and-cons', date: 'Aug 15, 2025', badge: 'SELLER', title: 'Should You Buy A New House Before Selling Your Old One? Pros and Cons', excerpt: 'The buy-before-sell dilemma is one of the most common challenges for move-up buyers. This breakdown helps you choose the right strategy for your situation.' },
                { slug: 'safety-tips-to-keep-your-house-safe-during-a-renovation', date: 'Jul 29, 2025', badge: 'HOMEOWNER', title: 'Safety Tips to Keep Your House Safe During A Renovation', excerpt: 'Home renovations create excitement but also real hazards. Keeping your household safe requires planning, communication, and awareness of common risks.' },
                { slug: '5-questions-to-ask-yourself-before-deciding-to-buy-a-house', date: 'Jun 30, 2025', badge: 'BUYER', title: '5 Questions to Ask Yourself Before Deciding To Buy A House', excerpt: 'Asking yourself these five honest questions before you start searching can save you time, money, and stress on the road to homeownership.' },
              ].map(({ slug, date, badge, title, excerpt }, i) => (
                <article key={slug} className="blog-card">
                  <div className="blog-card-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/blog/${slug}.jpg`}
                      alt={title}
                      loading={i < 3 ? 'eager' : 'lazy'}
                    />
                    <span className="blog-card-date">{date}</span>
                  </div>
                  <div className="blog-card-body">
                    <span className="blog-card-badge">{badge}</span>
                    <h3 className="blog-card-title">{title}</h3>
                    <p className="blog-card-excerpt">{excerpt}</p>
                    <Link href={`/blog/${slug}`} className="blog-card-link">Read More &rarr;</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <button className="carousel-arrow" id="blog-next" aria-label="Next blog posts">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="reveal stagger-3">
          <Link href="/blog" className="btn btn-brand">View All Articles</Link>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section className="cta-banner" id="cta" aria-labelledby="cta-heading">
        <div className="cta-banner-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cta-banner-bg-base" src="/assets/images/cta-background.jpg" alt="" />
          <div className="cta-banner-bg-dark" />
        </div>
        <div className="cta-banner-content">
          <p className="cta-banner-eyebrow reveal">Work With Us</p>
          <h2 className="cta-banner-title reveal stagger-1" id="cta-heading">Find Your Dream Home Today</h2>
          <div className="cta-banner-btns reveal stagger-2">
            <Link href="/contact" className="cta-banner-btn-primary">Let&rsquo;s Connect</Link>
            <a href="https://search.palisaderealty.com/" className="cta-banner-btn-outline" target="_blank" rel="noopener noreferrer">
              View Properties
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

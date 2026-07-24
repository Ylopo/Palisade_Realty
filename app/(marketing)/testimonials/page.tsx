import type { Metadata } from 'next'
import Link from 'next/link'
import ReviewGallery, { type ReviewCardProps } from './ReviewGallery'
import { client } from '@/lib/sanity/client'
import { ALL_TESTIMONIALS_QUERY } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Client Testimonials',
  description:
    'Read what clients say about working with Palisade Realty. Real reviews from home buyers and sellers in San Diego, La Jolla, Coronado, and beyond.',
}

export const revalidate = 3600

export default async function TestimonialsPage() {
  let sanityReviews: ReviewCardProps[] = []
  try {
    const raw = await client.fetch(ALL_TESTIMONIALS_QUERY)
    sanityReviews = (raw ?? []).map((t: {
      clientName: string; location?: string; body: string;
      agentName?: string; rating?: number
    }) => ({
      quote: `"${t.body}"`,
      agentName: t.agentName ?? 'Palisade Realty',
      agentPhoto: t.agentName
        ? `${t.agentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.jpg`
        : 'hedda-parashos.jpg',
      rating: t.rating ?? 5.0,
    }))
  } catch {
    // Sanity unavailable — fall through to static REVIEWS
  }

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="test-hero" aria-label="Client Testimonials Hero">
        <div className="test-hero-inner">
          <span className="test-hero-eyebrow">Trusted by Hundreds of Families</span>
          <h1 className="test-hero-heading">Client Testimonials</h1>
          <p className="test-hero-sub">Hear what our clients have to say about working with Palisade Realty.</p>
          <div className="test-hero-accent" aria-hidden="true" />
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="stats-bar" aria-label="Client success metrics">
        <div className="stats-inner">
          <div className="stat-item">
            <span className="stat-value">500+</span>
            <span className="stat-label">Families Helped</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">4.9★</span>
            <span className="stat-label">Average Rating</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">15+</span>
            <span className="stat-label">Years of Experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">60+</span>
            <span className="stat-label">Dedicated Agents</span>
          </div>
        </div>
      </section>

      {/* ── REVIEW GALLERY (client component) ──────────────── */}
      <ReviewGallery reviews={sanityReviews.length > 0 ? sanityReviews : undefined} />

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="test-cta" aria-label="Call to action">
        <div className="test-cta-inner">
          <span className="test-cta-eyebrow">Start Your Journey</span>
          <h2 className="test-cta-heading">Ready to Experience the<br />Palisade Difference?</h2>
          <p className="test-cta-sub">Join the hundreds of families who trusted Palisade Realty to guide them home.</p>
          <Link href="/contact" className="test-cta-btn">
            Get in Touch
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M7 2.5 11.5 7 7 11.5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}

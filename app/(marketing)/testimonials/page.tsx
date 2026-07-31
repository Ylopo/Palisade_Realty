import type { Metadata } from 'next'
import Link from 'next/link'
import ReviewGallery, { type ReviewCardProps } from './ReviewGallery'
import StatsBar from '@/components/StatsBar'
import reviewsData from '@/data/reviews.json'

export const metadata: Metadata = {
  title: 'Client Testimonials',
  description:
    'Read verified Zillow reviews from clients of Hedda Parashos and Palisade Realty. Real reviews from home buyers and sellers in San Diego and beyond.',
}

const zillowReviews: ReviewCardProps[] = (reviewsData.reviews as ReviewCardProps[]).filter(
  (r) => r.source === 'Zillow'
)
const zillowProfileUrl = reviewsData.summary?.zillow?.profileUrl

export default function TestimonialsPage() {
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
      <StatsBar />

      {/* ── REVIEW GALLERY (client component) ──────────────── */}
      <ReviewGallery reviews={zillowReviews} zillowProfileUrl={zillowProfileUrl} />

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

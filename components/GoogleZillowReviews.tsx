'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

export interface ReviewSummary {
  averageRating: number
  reviewCount: number
  profileUrl: string
  profileName?: string
  note?: string
  verifiedAt: string
  structuredDataEligible?: boolean
}

export interface Review {
  id: string
  source: 'Google' | 'Zillow'
  reviewerName: string
  reviewText: string
  rating: number
  reviewDate?: string
  sourceUrl: string
  profileName: 'Hedda Parashos' | 'Palisade Realty'
  featured?: boolean
}

interface Props {
  summary: { google?: ReviewSummary; zillow?: ReviewSummary }
  reviews: Review[]
}

const STAR_PATH = 'M9 1.5l2.09 4.24 4.67.68-3.38 3.29.8 4.65L9 12l-4.18 2.36.8-4.65L2.24 6.42l4.67-.68z'
const EXCERPT_LENGTH = 220
const AUTOPLAY_MS = 6000

function GzrStars({ rating }: { rating: number }) {
  return (
    <span className="gzr-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 18 18" fill={i < rating ? '#eeca00' : 'rgba(88,23,42,0.18)'} aria-hidden="true">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  )
}

function truncate(text: string) {
  if (text.length <= EXCERPT_LENGTH) return text
  const cut = text.lastIndexOf(' ', EXCERPT_LENGTH)
  return text.slice(0, cut > 0 ? cut : EXCERPT_LENGTH) + '…'
}

export default function GoogleZillowReviews({ summary, reviews }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [isHovering, setIsHovering] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    const card = track?.children[index] as HTMLElement | undefined
    if (!track || !card) return
    track.scrollTo({ left: card.offsetLeft, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }, [prefersReducedMotion])

  const goTo = useCallback((index: number) => {
    const clamped = (index + reviews.length) % reviews.length
    setActiveIndex(clamped)
    scrollToIndex(clamped)
  }, [reviews.length, scrollToIndex])

  useEffect(() => {
    if (prefersReducedMotion || isHovering || isFocused || reviews.length < 2) return
    const id = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % reviews.length
        scrollToIndex(next)
        return next
      })
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [isHovering, isFocused, prefersReducedMotion, reviews.length, scrollToIndex])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track) return
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX, scrollLeft: track.scrollLeft }
    track.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const track = trackRef.current
    if (!track) return
    track.scrollLeft = dragStartRef.current.scrollLeft - (e.clientX - dragStartRef.current.x)
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    const track = trackRef.current
    if (!track) return
    track.releasePointerCapture(e.pointerId)
    const cards = Array.from(track.children) as HTMLElement[]
    let nearest = 0
    let nearestDist = Infinity
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - track.scrollLeft)
      if (dist < nearestDist) { nearestDist = dist; nearest = i }
    })
    setActiveIndex(nearest)
  }

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (reviews.length === 0) return null

  const jsonLd: Record<string, unknown>[] = []
  if (summary.google && summary.google.structuredDataEligible !== false) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      itemReviewed: { '@type': 'RealEstateAgent', name: summary.google.profileName || 'Palisade Realty' },
      ratingValue: summary.google.averageRating,
      reviewCount: summary.google.reviewCount,
      bestRating: 5,
    })
  }
  if (summary.zillow) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      itemReviewed: { '@type': 'RealEstateAgent', name: summary.zillow.profileName || 'Palisade Realty' },
      ratingValue: summary.zillow.averageRating,
      reviewCount: summary.zillow.reviewCount,
      bestRating: 5,
    })
  }

  return (
    <div
      className="gzr reveal stagger-2"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsFocused(false)
      }}
    >
      <h3 className="gzr-subheading">Trusted by San Diego Buyers and Sellers</h3>
      <p className="gzr-lead">Verified feedback from real Palisade Realty clients on Google and Zillow.</p>

      {(summary.google || summary.zillow) && (
        <div className="gzr-summary-row">
          {summary.google && (
            <div className="gzr-summary-tile">
              <span className="gzr-summary-source">Google</span>
              <span className="gzr-summary-rating">{summary.google.averageRating.toFixed(1)}</span>
              <GzrStars rating={Math.round(summary.google.averageRating)} />
              <span className="gzr-summary-count">{summary.google.reviewCount} reviews</span>
              <a className="tp-see-more-btn gzr-summary-link" href={summary.google.profileUrl} target="_blank" rel="noopener noreferrer">
                Read Our Google Reviews
              </a>
            </div>
          )}
          {summary.zillow && (
            <div className="gzr-summary-tile">
              <span className="gzr-summary-source">Zillow</span>
              <span className="gzr-summary-rating">{summary.zillow.averageRating.toFixed(1)}</span>
              <GzrStars rating={Math.round(summary.zillow.averageRating)} />
              <span className="gzr-summary-count">
                {summary.zillow.reviewCount} reviews{summary.zillow.note ? ' across our team' : ''}
              </span>
              <a className="tp-see-more-btn gzr-summary-link" href={summary.zillow.profileUrl} target="_blank" rel="noopener noreferrer">
                View Zillow Reviews
              </a>
            </div>
          )}
        </div>
      )}

      <div className="gzr-track-wrap">
        <button type="button" className="gzr-nav-btn prev" aria-label="Previous review" onClick={() => goTo(activeIndex - 1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          className="gzr-track"
          ref={trackRef}
          role="list"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {reviews.map((review) => {
            const isExpanded = expandedIds.has(review.id)
            const isLong = review.reviewText.length > EXCERPT_LENGTH
            const textId = `gzr-text-${review.id}`
            return (
              <article key={review.id} className="gzr-card" role="listitem">
                <span className="gzr-card-badge">{review.source}</span>
                <GzrStars rating={review.rating} />
                <p className="gzr-card-quote" id={textId}>
                  {isExpanded || !isLong ? review.reviewText : truncate(review.reviewText)}
                </p>
                {isLong && (
                  <button
                    type="button"
                    className="gzr-read-more-btn"
                    aria-expanded={isExpanded}
                    aria-controls={textId}
                    onClick={() => toggleExpanded(review.id)}
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
                <div className="gzr-card-footer">
                  <span className="gzr-card-reviewer">{review.reviewerName}</span>
                  {review.reviewDate && <span className="gzr-card-date">{review.reviewDate}</span>}
                </div>
              </article>
            )
          })}
        </div>

        <button type="button" className="gzr-nav-btn next" aria-label="Next review" onClick={() => goTo(activeIndex + 1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {jsonLd.map((entry, i) => (
        // eslint-disable-next-line react/no-danger
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}
    </div>
  )
}

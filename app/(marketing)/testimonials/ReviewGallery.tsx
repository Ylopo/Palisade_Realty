'use client'

import { useState, useRef, useEffect } from 'react'

const STAR_PATH = 'M9 1.5l2.09 4.24 4.67.68-3.38 3.29.8 4.65L9 12l-4.18 2.36.8-4.65L2.24 6.42l4.67-.68z'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="rg-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 18 18" fill={i < rating ? '#eeca00' : 'rgba(88,23,42,0.18)'} aria-hidden="true">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  )
}

const CLAMP_HEIGHT = 130

export interface ReviewCardProps {
  id: string
  source: 'Zillow' | 'Google'
  reviewerName: string
  reviewText: string
  rating: number
  reviewDate?: string
  sourceUrl: string
  profileName: string
  agentPhoto?: string
}

interface Props {
  reviews: ReviewCardProps[]
}

function ReviewCard({ id, source, reviewerName, reviewText, rating, reviewDate, profileName, agentPhoto }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [needsClamp, setNeedsClamp] = useState(false)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const quoteId = `rg-quote-${id}`

  useEffect(() => {
    if (quoteRef.current && quoteRef.current.scrollHeight > CLAMP_HEIGHT + 8) {
      setNeedsClamp(true)
    }
  }, [])

  return (
    <article className="rg-card">
      <span className="rg-badge">{source}</span>
      <div className="rg-bigquote" aria-hidden="true">&ldquo;</div>
      <div className={`rg-quote-wrap${needsClamp && !expanded ? ' is-clamped' : ''}${needsClamp && expanded ? ' is-expanded' : ''}`}>
        <p
          className="rg-quote"
          id={quoteId}
          ref={quoteRef}
          style={needsClamp ? { maxHeight: expanded ? quoteRef.current?.scrollHeight : CLAMP_HEIGHT } : undefined}
        >
          {reviewText}
        </p>
      </div>
      {needsClamp && (
        <button
          className="rg-see-more"
          type="button"
          aria-expanded={expanded}
          aria-controls={quoteId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? <>See Less <span aria-hidden="true">↑</span></> : <>See More <span aria-hidden="true">→</span></>}
        </button>
      )}
      <div className="rg-card-footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/assets/images/agents/${agentPhoto ?? 'hedda-parashos.jpg'}`} alt={profileName} className="rg-agent-photo" loading="lazy" />
        <div className="rg-card-info">
          <p className="rg-agent-label">Review for: <strong>{profileName}</strong></p>
          <div className="rg-stars-row">
            <Stars rating={rating} />
            <span className="rg-rating-num">{rating.toFixed(1)}</span>
          </div>
          <p className="rg-meta">
            {reviewerName}
            {reviewDate && <span className="rg-meta-date"> · {reviewDate}</span>}
          </p>
        </div>
      </div>
    </article>
  )
}

interface GalleryProps extends Props {
  zillowProfileUrl?: string
}

export default function ReviewGallery({ reviews, zillowProfileUrl }: GalleryProps) {
  return (
    <section className="review-gallery" aria-labelledby="gallery-heading">
      <div className="section-header">
        <span className="section-eyebrow">Client Reviews</span>
        <h2 className="section-heading" id="gallery-heading">What Our Clients Are Sharing</h2>
        <p className="section-sub">Real, verified Zillow reviews from real clients across San Diego.</p>
      </div>
      <div className="gallery-grid">
        {reviews.map((r) => (
          <ReviewCard key={r.id} {...r} />
        ))}
      </div>
      {zillowProfileUrl && (
        <div className="rg-see-all-wrap">
          <a
            className="rg-zillow-btn"
            href={zillowProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="See all client reviews on Zillow (opens in a new tab)"
          >
            See All Reviews on Zillow
          </a>
        </div>
      )}
    </section>
  )
}

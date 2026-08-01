'use client'

import { useState, useRef, useEffect } from 'react'

const STAR_PATH = 'M9 1.5l2.09 4.24 4.67.68-3.38 3.29.8 4.65L9 12l-4.18 2.36.8-4.65L2.24 6.42l4.67-.68z'

type Lang = 'en' | 'es'

const STRINGS: Record<Lang, {
  reviewFor: string
  seeMore: string
  seeLess: string
  starsLabel: (rating: number) => string
  seeAllReviews: string
  seeAllReviewsAria: string
}> = {
  en: {
    reviewFor: 'Review for:',
    seeMore: 'See More',
    seeLess: 'See Less',
    starsLabel: (rating) => `${rating} out of 5 stars`,
    seeAllReviews: 'See All Reviews on Zillow',
    seeAllReviewsAria: 'See all client reviews on Zillow (opens in a new tab)',
  },
  es: {
    reviewFor: 'Reseña para:',
    seeMore: 'Ver más',
    seeLess: 'Ver menos',
    starsLabel: (rating) => `${rating} de 5 estrellas`,
    seeAllReviews: 'Ver Todas las Reseñas en Zillow',
    seeAllReviewsAria: 'Ver todas las reseñas de clientes en Zillow (se abre en una pestaña nueva)',
  },
}

/** Mirrors the site's legacy lang.js toggle (localStorage 'pr-lang' + a
 * 'pr-lang-changed' event dispatched on toggle) for the parts of this page
 * that are React-state-driven and can't be safely patched via direct DOM
 * textContent swaps. Review content itself (quotes, reviewer names, dates)
 * is intentionally never translated — only this component's own UI chrome. */
function useSiteLang(): Lang {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem('pr-lang')
    if (stored === 'es' || stored === 'en') setLang(stored)

    const onLangChanged = (e: Event) => {
      const detail = (e as CustomEvent<{ lang: Lang }>).detail
      if (detail?.lang === 'es' || detail?.lang === 'en') setLang(detail.lang)
    }
    window.addEventListener('pr-lang-changed', onLangChanged)
    return () => window.removeEventListener('pr-lang-changed', onLangChanged)
  }, [])

  return lang
}

function Stars({ rating, lang }: { rating: number; lang: Lang }) {
  return (
    <div className="rg-stars" aria-label={STRINGS[lang].starsLabel(rating)}>
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
  reviewTextEs?: string
  rating: number
  reviewDate?: string
  sourceUrl: string
  profileName: string
  agentPhoto?: string
}

interface Props {
  reviews: ReviewCardProps[]
}

function ReviewCard({ id, source, reviewerName, reviewText, reviewTextEs, rating, reviewDate, profileName, agentPhoto }: ReviewCardProps) {
  const lang = useSiteLang()
  const t = STRINGS[lang]
  const displayText = lang === 'es' && reviewTextEs ? reviewTextEs : reviewText
  const [expanded, setExpanded] = useState(false)
  const [needsClamp, setNeedsClamp] = useState(false)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const quoteId = `rg-quote-${id}`

  useEffect(() => {
    if (quoteRef.current) {
      setNeedsClamp(quoteRef.current.scrollHeight > CLAMP_HEIGHT + 8)
    }
  }, [displayText])

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
          {displayText}
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
          {expanded ? <>{t.seeLess} <span aria-hidden="true">↑</span></> : <>{t.seeMore} <span aria-hidden="true">→</span></>}
        </button>
      )}
      <div className="rg-card-footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/assets/images/agents/${agentPhoto ?? 'hedda-parashos.jpg'}`} alt={profileName} className="rg-agent-photo" loading="lazy" />
        <div className="rg-card-info">
          <p className="rg-agent-label">{t.reviewFor} <strong>{profileName}</strong></p>
          <div className="rg-stars-row">
            <Stars rating={rating} lang={lang} />
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
  const lang = useSiteLang()
  const t = STRINGS[lang]
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
            aria-label={t.seeAllReviewsAria}
          >
            {t.seeAllReviews}
          </a>
        </div>
      )}
    </section>
  )
}

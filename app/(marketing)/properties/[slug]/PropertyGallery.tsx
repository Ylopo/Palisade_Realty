'use client'

import { useState } from 'react'

interface Props {
  images: string[]
  address: string
}

export default function PropertyGallery({ images, address }: Props) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (images.length === 0) return null

  function prev() { setActive((i) => (i - 1 + images.length) % images.length) }
  function next() { setActive((i) => (i + 1) % images.length) }

  return (
    <>
      {/* Main gallery */}
      <div style={{ position: 'relative', background: '#111', overflow: 'hidden' }}>
        <div style={{ aspectRatio: '16/9', maxHeight: '620px', position: 'relative', cursor: 'pointer' }} onClick={() => setLightbox(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={`${address} — photo ${active + 1} of ${images.length}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="eager"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,.45) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,.55)', color: '#fff', fontFamily: 'var(--font-label)', fontSize: '12px', padding: '5px 12px', borderRadius: '2px' }}>
            {active + 1} / {images.length}
          </div>
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,.55)', color: '#fff', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.1em', padding: '5px 12px', borderRadius: '2px' }}>
            Click to enlarge
          </div>
        </div>

        {/* Prev / next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M11 4L6 9l5 5" stroke="var(--brand,#58172a)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M7 4l5 5-5 5" stroke="var(--brand,#58172a)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '6px', padding: '6px 0', overflowX: 'auto', background: '#111' }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === active}
              style={{
                flexShrink: 0,
                width: '80px',
                height: '54px',
                border: i === active ? '2px solid var(--accent,#eeca00)' : '2px solid transparent',
                padding: 0,
                cursor: 'pointer',
                borderRadius: '2px',
                overflow: 'hidden',
                opacity: i === active ? 1 : 0.55,
                transition: 'opacity 0.15s ease',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo gallery — ${address}`}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close gallery"
            style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '28px', lineHeight: 1 }}
          >
            ×
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous photo"
            style={{ position: 'absolute', left: '24px', background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '50%', fontSize: '22px' }}
          >
            ‹
          </button>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[active]} alt={`${address} — photo ${active + 1}`} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', display: 'block' }} />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next photo"
            style={{ position: 'absolute', right: '24px', background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '50%', fontSize: '22px' }}
          >
            ›
          </button>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,.6)', fontFamily: 'var(--font-label)', fontSize: '13px' }}>
            {active + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

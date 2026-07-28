'use client'

import Link from 'next/link'

export default function PropertiesError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section
      style={{
        background: 'var(--off-white,#faf7f2)',
        padding: '120px var(--pad-x,60px)',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '480px' }}>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '12px' }}>
          Something went wrong
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: '0 0 16px' }}>
          Listings Unavailable
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#777', lineHeight: 1.7, marginBottom: '32px' }}>
          We had trouble loading the featured properties. Please try again or contact our team directly.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            className="btn btn-brand"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Try Again
          </button>
          <Link href="/contact" className="btn btn-outline-brand">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

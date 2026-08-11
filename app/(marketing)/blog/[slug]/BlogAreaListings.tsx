'use client'

import { useState } from 'react'

/**
 * IDX listings section for blog posts, driven by the post's `idxAreas`
 * (set in the admin's "Blog Listings — Area(s)" card). One Ylopo results
 * widget per area; multiple areas render as tabs. All widgets mount at page
 * load (the Ylopo script scans the DOM once), and tabs only toggle visibility.
 */

// Incorporated San Diego County cities — an area matching one of these queries
// the widget by city. Everything else is treated as a San Diego neighborhood.
const COUNTY_CITIES = new Set([
  'carlsbad', 'chula vista', 'coronado', 'del mar', 'el cajon', 'encinitas',
  'escondido', 'imperial beach', 'la mesa', 'lemon grove', 'national city',
  'oceanside', 'poway', 'san diego', 'san marcos', 'santee', 'solana beach', 'vista',
])

type YlopoLocation = { city: string; state: string; neighborhood?: string }

function areaLocation(area: string): YlopoLocation {
  const trimmed = area.trim()
  if (COUNTY_CITIES.has(trimmed.toLowerCase())) {
    return { city: trimmed, state: 'CA' }
  }
  return { neighborhood: trimmed, city: 'San Diego', state: 'CA' }
}

function areaSearchUrl(area: string): string {
  const loc = areaLocation(area)
  const params = new URLSearchParams()
  if (loc.neighborhood) params.set('s[locations][0][neighborhood]', loc.neighborhood)
  params.set('s[locations][0][city]', loc.city)
  params.set('s[locations][0][state]', loc.state)
  return `https://search.palisaderealty.com/search?${params.toString()}`
}

export default function BlogAreaListings({ areas }: { areas: string[] }) {
  const [active, setActive] = useState(0)
  const cleaned = areas.map((a) => a.trim()).filter(Boolean)

  if (cleaned.length === 0) return null

  return (
    <section style={{ background: '#faf7f2', padding: '72px var(--pad-x,60px)' }} aria-labelledby="blog-listings-heading">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '12px' }}>
            Live MLS Data
          </span>
          <h2 id="blog-listings-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: 0 }}>
            {cleaned.length === 1 ? `${cleaned[0]} Homes For Sale` : 'Homes For Sale In This Article’s Areas'}
          </h2>
        </div>

        {cleaned.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            {cleaned.map((area, i) => (
              <button
                key={area}
                onClick={() => setActive(i)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '999px',
                  border: i === active ? '1px solid var(--brand,#58172a)' : '1px solid rgba(88,23,42,0.25)',
                  background: i === active ? 'var(--brand,#58172a)' : 'transparent',
                  color: i === active ? '#fff' : 'var(--brand,#58172a)',
                  fontFamily: 'var(--font-label)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {area}
              </button>
            ))}
          </div>
        )}

        {cleaned.map((area, i) => (
          <div key={area} style={{ display: i === active ? 'block' : 'none' }}>
            <div
              className="YLOPO_resultsWidget"
              data-search={JSON.stringify({
                locations: [areaLocation(area)],
                propertyTypes: ['house', 'condo', 'townhouse', 'multi_family'],
                status: 'active',
                limit: 12,
              })}
            />
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <a
                href={areaSearchUrl(area)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-label)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--brand,#58172a)', borderBottom: '1px solid rgba(88,23,42,0.30)', paddingBottom: '2px', textDecoration: 'none' }}
              >
                View All {area} Properties →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

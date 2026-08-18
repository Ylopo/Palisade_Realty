'use client'

import { useEffect, useRef, useState } from 'react'

interface IdxLocation {
  city?: string
  state?: string
  neighborhood?: string
}

/**
 * Ylopo listings widget with an automatic plan-B: both the primary and the
 * broader fallback widget mount at load (the Ylopo script scans the DOM once),
 * and if the primary renders no listing cards within the grace period, the
 * page swaps to the fallback with an explanatory line. Nearby-community links
 * are rendered by the server template regardless.
 */
export default function ExpansionListings({
  name,
  primary,
  fallback,
  propertyTypes,
  fallbackLabel,
}: {
  name: string
  primary: IdxLocation
  fallback: IdxLocation
  propertyTypes: string[]
  fallbackLabel: string
}) {
  const primaryRef = useRef<HTMLDivElement>(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    // Give the widget script time to load + render, then check for content.
    const timer = setTimeout(() => {
      const el = primaryRef.current
      // The widget injects listing markup into the div; an untouched or
      // empty div means no listings matched the primary search.
      if (el && el.childElementCount === 0) {
        setUseFallback(true)
      }
    }, 9000)
    return () => clearTimeout(timer)
  }, [])

  const search = (loc: IdxLocation) => JSON.stringify({
    locations: [loc],
    propertyTypes,
    status: 'active',
    limit: 12,
  })

  return (
    <div>
      {useFallback && (
        <p style={{ fontSize: 14, color: '#75636a', margin: '0 0 18px', textAlign: 'center' }}>
          No active {name} listings match right now — inventory here moves fast. Here are current
          homes in {fallbackLabel}, and our team can alert you the moment something lists in {name}.
        </p>
      )}
      <div ref={primaryRef} className="YLOPO_resultsWidget" data-search={search(primary)} style={useFallback ? { display: 'none' } : undefined} />
      <div className="YLOPO_resultsWidget" data-search={search(fallback)} style={useFallback ? undefined : { display: 'none' }} />
    </div>
  )
}

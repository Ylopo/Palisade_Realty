'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  token: string
  coordinates: [number, number]
}

const DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=3434+Grove+St,+Lemon+Grove,+CA+91945'

export default function ContactHeroMap({ token, coordinates }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !token) return

    // Mapbox GL JS is loaded globally via layout.tsx (strategy="beforeInteractive")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mgl: any = (window as any).mapboxgl
    if (!mgl) return

    mgl.accessToken = token

    const map = new mgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: coordinates,
      zoom: 15.5,
      scrollZoom: false,
      boxZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      keyboard: false,
      attributionControl: false,
    })

    // Disable drag pan on touch devices so the page scrolls normally
    if ('ontouchstart' in window) {
      map.dragPan.disable()
    }

    map.on('style.load', () => setLoaded(true))

    // Custom branded marker
    const markerEl = document.createElement('div')
    markerEl.setAttribute('aria-label', 'Palisade Realty office — 3434 Grove St, Lemon Grove, CA')
    markerEl.setAttribute('title', 'Palisade Realty')
    markerEl.setAttribute('tabindex', '0')
    markerEl.setAttribute('role', 'button')
    Object.assign(markerEl.style, {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#58172a',
      border: '3px solid #eeca00',
      boxShadow: '0 4px 20px rgba(88,23,42,0.65), 0 0 0 7px rgba(238,202,0,0.10)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    })
    const dot = document.createElement('div')
    Object.assign(dot.style, {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#eeca00',
      pointerEvents: 'none',
    })
    markerEl.appendChild(dot)

    const popup = new mgl.Popup({
      offset: [0, -22],
      maxWidth: '240px',
    }).setHTML(
      `<div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;font-size:13px;line-height:1.55;color:#1a0f14;padding:4px 2px 2px;">
        <strong style="display:block;font-size:14px;font-weight:700;margin-bottom:6px;color:#58172a;letter-spacing:0.01em;">
          Palisade Realty
        </strong>
        3434 Grove St<br/>Lemon Grove, CA 91945
        <br/>
        <a href="${DIRECTIONS_URL}" target="_blank" rel="noopener noreferrer"
           style="display:inline-block;margin-top:10px;padding:6px 14px;background:#58172a;color:#eeca00;font-size:11px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;text-decoration:none;border-radius:5px;">
          Get Directions ↗
        </a>
      </div>`
    )

    new mgl.Marker({ element: markerEl })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map)

    // Keyboard: open popup on Enter / Space
    markerEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        popup.addTo(map)
      }
    })

    return () => {
      map.remove()
    }
  }, [token, coordinates])

  return (
    <>
      {/* Dark brand colour shown while the map style loads */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: '#160c10',
          zIndex: 0,
        }}
      />

      {/* Mapbox map — fades in once style is ready */}
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.85s ease',
        }}
      />

      {/* Gradient overlay — same curve as the original .contact-hero-overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,0,5,0.62) 0%, rgba(10,0,5,0.50) 50%, rgba(10,0,5,0.72) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

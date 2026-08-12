'use client'

import { useEffect, useRef } from 'react'

interface Props {
  center: [number, number]
  zoom: number
  boundary: [number, number][]
  i5?: [number, number][]
  harbor?: [number, number][]
  marker?: [number, number]
  name: string
}

const TOKEN = 'pk.eyJ1Ijoiam9tLW1hcGJveCIsImEiOiJjbXFxaGJva3AwNDVqMnBxcnlvaW54aWRoIn0.f4TeZyya7vaALl39DaWK5Q'

const SD_COUNTY_COORDS = [
  [-117.61054,33.33367],[-117.57153,33.3123],[-117.5496,33.29442],
  [-117.521,33.26887],[-117.50087,33.24215],[-117.46787,33.21249],
  [-117.43556,33.17751],[-117.37587,33.07522],[-117.33997,33],
  [-117.32328,32.90306],[-117.33966,32.85917],[-117.34213,32.82622],
  [-117.33447,32.79908],[-117.32094,32.68985],[-117.30924,32.6564],
  [-117.27694,32.62348],[-117.25201,32.61487],[-117.23353,32.61669],
  [-117.22332,32.62125],[-117.21411,32.59478],[-117.20505,32.52952],
  [-116.10619,32.61848],[-116.10567,32.7265],[-116.10316,32.72651],
  [-116.10325,33.07467],[-116.08115,33.07486],[-116.08509,33.42607],
  [-116.19774,33.42893],[-117.03089,33.42689],[-117.03085,33.42996],
  [-117.24136,33.43189],[-117.24151,33.44874],[-117.37081,33.49056],
  [-117.36418,33.50482],[-117.50975,33.50515],[-117.50909,33.47031],
  [-117.53879,33.45518],[-117.55961,33.45102],[-117.5785,33.4537],
  [-117.61054,33.33367],
]

export default function CommunityLocationMap({ center, zoom, boundary, i5, harbor, marker, name }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    let map: any = null
    let interval: ReturnType<typeof setInterval> | null = null

    const init = () => {
      const mgl = (window as any).mapboxgl
      if (!mgl || !containerRef.current) return false

      mgl.accessToken = TOKEN
      map = new mgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center,
        zoom,
        pitch: 0,
        interactive: false,
        attributionControl: false,
      })

      map.on('load', () => {
        map.addSource('loc-county', {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [SD_COUNTY_COORDS] } },
        })
        map.addLayer({ id: 'loc-county-fill', type: 'fill', source: 'loc-county', paint: { 'fill-color': '#C8C8C8', 'fill-opacity': 0.06 } })
        map.addLayer({ id: 'loc-county-line', type: 'line', source: 'loc-county', paint: { 'line-color': '#C8C8C8', 'line-width': 1, 'line-opacity': 0.35 } })

        map.addSource('loc-current', {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [boundary] } },
        })
        map.addLayer({ id: 'loc-current-fill', type: 'fill', source: 'loc-current', paint: { 'fill-color': '#eeca00', 'fill-opacity': 0.28 } })
        map.addLayer({ id: 'loc-current-line', type: 'line', source: 'loc-current', paint: { 'line-color': '#eeca00', 'line-width': 2, 'line-opacity': 0.90 } })

        if (i5) {
          map.addSource('loc-i5', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: i5 } } })
          map.addLayer({ id: 'loc-i5-glow', type: 'line', source: 'loc-i5', paint: { 'line-color': '#5ba4ff', 'line-width': 4, 'line-opacity': 0.20, 'line-blur': 4 } })
          map.addLayer({ id: 'loc-i5-line', type: 'line', source: 'loc-i5', paint: { 'line-color': '#7dbfff', 'line-width': 1.5, 'line-opacity': 0.65 } })
        }

        if (harbor) {
          map.addSource('loc-harbor', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: harbor } } })
          map.addLayer({ id: 'loc-harbor-glow', type: 'line', source: 'loc-harbor', paint: { 'line-color': '#58172a', 'line-width': 4, 'line-opacity': 0.20, 'line-blur': 4 } })
          map.addLayer({ id: 'loc-harbor-line', type: 'line', source: 'loc-harbor', paint: { 'line-color': '#58172a', 'line-width': 1.5, 'line-opacity': 0.60 } })
        }

        if (marker) {
          markerRef.current = new mgl.Marker({ color: '#eeca00' }).setLngLat(marker).addTo(map)
        }
      })

      return true
    }

    if (!init()) {
      // Mapbox GL not ready yet — poll until lazyOnload script finishes
      interval = setInterval(() => {
        if (init()) {
          clearInterval(interval!)
          interval = null
        }
      }, 150)
    }

    return () => {
      if (interval) clearInterval(interval)
      markerRef.current?.remove()
      map?.remove()
    }
  }, [])

  const legendItems = [
    { color: '#eeca00', label: name, isBox: true },
    { color: '#C8C8C8', label: 'Other Communities', isBox: true },
    ...(i5 ? [{ color: '#7dbfff', label: 'I-5 Freeway', isBox: false }] : []),
    ...(harbor ? [{ color: '#58172a', label: 'Harbor Drive', isBox: false }] : []),
  ]

  return (
    <div style={{ position: 'relative', height: '440px', borderRadius: '14px', overflow: 'hidden', marginBottom: '32px' }}>
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
        role="img"
        aria-label={`San Diego County orientation map showing ${name} location`}
      />
      <div style={{
        position: 'absolute', bottom: '16px', left: '16px',
        background: 'rgba(11,8,8,0.78)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
        padding: '10px 14px', zIndex: 3, pointerEvents: 'none',
      }}>
        {legendItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < legendItems.length - 1 ? '5px' : 0 }}>
            <span style={{
              width: item.isBox ? '12px' : '20px',
              height: item.isBox ? '12px' : '3px',
              background: item.color,
              borderRadius: '2px',
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'var(--font-label,sans-serif)', fontSize: '10px', color: 'rgba(242,237,228,0.70)', whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

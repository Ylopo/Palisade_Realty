'use client'

import { useState } from 'react'

interface Community {
  name: string
  slug: string
  image: string
  badge: string
  region: 'all' | 'coastal' | 'metro' | 'north-county' | 'east-south'
  desc: string
}

const COMMUNITIES: Community[] = [
  { name: 'Downtown San Diego',     slug: 'downtown-san-diego-real-estate',      image: 'community-downtown-san-diego.jpg',     badge: 'Urban Core',            region: 'metro',        desc: 'Urban sophistication meets coastal living. World-class dining, nightlife, and walkable neighborhoods in the heart of America\'s Finest City.' },
  { name: 'Mission Hills',          slug: 'mission-hills-real-estate',           image: 'community-mission-hills.jpg',          badge: 'Historic Charm',        region: 'metro',        desc: 'Craftsman bungalows and tree-lined streets make Mission Hills one of San Diego\'s most beloved historic neighborhoods with a vibrant village character.' },
  { name: 'Point Loma',             slug: 'point-loma-real-estate',              image: 'community-point-loma.jpg',             badge: 'Coastal Living',        region: 'coastal',      desc: 'A scenic peninsula with sweeping harbor views, charming boutiques, and a laid-back coastal vibe just minutes from downtown San Diego.' },
  { name: 'Coronado',               slug: 'coronado-real-estate',                image: 'community-coronado.jpg',               badge: 'Island Luxury',         region: 'coastal',      desc: 'Island elegance and iconic sunsets. A timeless community known for its historic charm, stunning beaches, and world-famous Hotel del Coronado.' },
  { name: 'Pacific & Mission Beach', slug: 'pacific-mission-beach-real-estate',  image: 'community-pacific-mission-beach.jpg',  badge: 'Beach Life',            region: 'coastal',      desc: 'The quintessential San Diego beach lifestyle. Boardwalk living, ocean breezes, and the energy of one of California\'s most iconic shorelines.' },
  { name: 'Mission Valley',         slug: 'mission-valley-real-estate',          image: 'community-mission-valley.jpg',         badge: 'Central Hub',           region: 'metro',        desc: 'San Diego\'s central business and shopping corridor, offering excellent value and unmatched connectivity to every corner of the city.' },
  { name: 'La Jolla',               slug: 'la-jolla-real-estate',                image: 'community-la-jolla.jpg',               badge: 'Ultra-Luxury Coastal',  region: 'coastal',      desc: 'San Diego\'s jewel by the sea. Cliff-top estates, pristine coves, and an unrivaled blend of luxury living and natural beauty.' },
  { name: 'Del Mar',                slug: 'del-mar-real-estate',                 image: 'community-del-mar.jpg',                badge: 'Coastal Luxury',        region: 'coastal',      desc: 'Low-key coastal luxury where horseracing, fine dining, and spectacular ocean bluffs define a lifestyle of understated elegance.' },
  { name: 'Carmel Valley',          slug: 'carmel-valley-real-estate',           image: 'community-carmel-valley.jpg',          badge: 'Master-Planned',        region: 'coastal',      desc: 'Master-planned perfection in North County. Top-rated schools, upscale amenities, and family-friendly communities set against rolling hills.' },
  { name: 'Rancho Santa Fe',        slug: 'rancho-santa-fe-real-estate',         image: 'community-rancho-santa-fe.jpg',        badge: 'Estate Country',        region: 'coastal',      desc: 'Where privacy meets prestige. Rolling hills, equestrian estates, and some of San Diego\'s most exclusive addresses await discerning buyers.' },
  { name: 'Solana Beach',           slug: 'solana-beach-real-estate',            image: 'community-solana-beach.jpg',           badge: 'Coastal Village',       region: 'north-county', desc: 'A charming coastal village with world-class dining at Cedros Design District, pristine beaches, and an artsy, walkable character.' },
  { name: 'Encinitas',              slug: 'encinitas-real-estate',               image: 'community-encinitas.jpg',              badge: 'Surf & Style',          region: 'coastal',      desc: 'Bohemian beaches and a thriving surf culture meet sophisticated dining and acclaimed schools in this beloved North County jewel.' },
  { name: 'Carlsbad',               slug: 'carlsbad-real-estate',                image: 'community-carlsbad.jpg',               badge: 'North Coast',           region: 'coastal',      desc: 'Flowering fields, a thriving tech industry, and upscale coastal living meet in this polished North County destination with resort-style communities.' },
  { name: 'Oceanside',              slug: 'oceanside-real-estate',               image: 'community-oceanside.jpg',              badge: 'Emerging Coastal',      region: 'coastal',      desc: 'North County\'s emerging coastal gem is redefining itself with a vibrant harbor, creative food scene, and strong investment potential.' },
  { name: 'Spring Valley',          slug: 'spring-valley-real-estate',           image: 'community-spring-valley.jpg',          badge: 'East County',           region: 'east-south',   desc: 'An accessible and community-oriented East County neighborhood offering excellent value with close proximity to downtown San Diego.' },
  { name: 'Chula Vista',            slug: 'chula-vista-real-estate',             image: 'community-chula-vista.jpg',            badge: 'South Bay',             region: 'metro',        desc: 'San Diego\'s second-largest city is rapidly evolving with new development, an Olympic training center, and a growing bayfront district.' },
  { name: 'La Mesa',                slug: 'la-mesa-real-estate',                 image: 'community-la-mesa.jpg',                badge: 'The Jewel of the Hills', region: 'metro',       desc: 'Charming walkable village streets, historic character, and a welcoming community spirit make La Mesa a standout East County destination.' },
  { name: 'El Cajon',               slug: 'el-cajon-real-estate',                image: 'community-el-cajon.jpg',               badge: 'East County Value',     region: 'metro',        desc: 'An affordable East County city with a growing dining and arts scene, offering excellent value for first-time buyers and savvy investors alike.' },
  { name: 'North Park',             slug: 'north-park-real-estate',              image: 'community-north-park.jpg',             badge: 'Urban Village',         region: 'metro',        desc: 'San Diego\'s most walkable urban neighborhood — Craftsman bungalows, craft breweries, a world-class dining corridor on 30th Street, and Balboa Park at its doorstep.' },
  { name: 'Pacific Beach',          slug: 'pacific-beach-real-estate',           image: 'community-pacific-beach.jpg',          badge: 'Coastal Energy',        region: 'coastal',      desc: 'Oceanfront condos, Crystal Pier, Mission Bay access, and Garnet Avenue\'s legendary dining strip — San Diego\'s most vibrant beach community.' },
  { name: 'Mission Beach',          slug: 'mission-beach-real-estate',           image: 'community-mission-beach.jpg',          badge: 'Oceanfront Peninsula',  region: 'coastal',      desc: 'A narrow oceanfront peninsula where every home is steps from the Pacific or Mission Bay. Belmont Park, the iconic boardwalk, and irreplaceable coastal real estate.' },
  { name: 'Rancho Peñasquitos',     slug: 'rancho-penasquitos-real-estate',      image: 'community-rancho-penasquitos.jpg',     badge: 'Family Community',      region: 'coastal',      desc: 'Family-oriented planned community with Poway Unified\'s top-ranked schools, Los Peñasquitos Canyon Preserve at the doorstep, and exceptional community amenities.' },
  { name: 'Scripps Ranch',          slug: 'scripps-ranch-real-estate',           image: 'community-scripps-ranch.jpg',          badge: 'Established Living',    region: 'coastal',      desc: 'San Diego\'s benchmark for established family living — tree-lined streets, top-ranked Scripps Ranch High School, and Lake Miramar Reservoir at the community\'s heart.' },
]

const FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'coastal',     label: 'Coastal San Diego' },
  { key: 'metro',       label: 'Metro Area' },
  { key: 'north-county',label: 'North County' },
  { key: 'east-south',  label: 'East & South County' },
]

const FB_COMM = 'https://placehold.co/800x600/58172a/eeca00?text=San+Diego'

export default function CommunitiesGrid() {
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all' ? COMMUNITIES : COMMUNITIES.filter((c) => c.region === filter)

  return (
    <section className="comm-grid-section" id="communities" aria-labelledby="comm-grid-heading">
      <div className="comm-grid-header">
        <span className="comm-grid-eyebrow">Explore Every Area</span>
        <h2 className="comm-grid-title" id="comm-grid-heading">Our Communities</h2>
        <div className="comm-filters" role="tablist" aria-label="Filter communities by region">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`comm-filter-btn${filter === f.key ? ' is-active' : ''}`}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="comm-grid" role="list" aria-live="polite">
        {visible.map((c, i) => (
          <article key={c.slug} className="comm-card reveal" role="listitem" data-region={c.region}>
            <div className="comm-card-img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/assets/images/${c.image}`}
                alt={`${c.name}, San Diego`}
                loading={i < 8 ? 'eager' : 'lazy'}
                onError={(e) => { (e.target as HTMLImageElement).src = FB_COMM }}
              />
              <span className="comm-card-badge">{c.badge}</span>
            </div>
            <div className="comm-card-body">
              <h3 className="comm-card-name">{c.name}</h3>
              <div className="comm-card-accent" aria-hidden="true" />
              <p className="comm-card-desc">{c.desc}</p>
              <a href={`/communities/${c.slug}`} className="comm-card-link">
                View Community
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

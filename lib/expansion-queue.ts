/**
 * lib/expansion-queue.ts
 *
 * The ordered build queue for the phased niche-expansion plan ("The 70K
 * Search Gap", Aug 2026 — DataForSEO-validated). The expansion-pages cron
 * works through this list top to bottom, building N pages per day; an entry
 * is "built" once a communityPage doc with its slug exists in Sanity.
 *
 * Volumes are the measured monthly Google searches for targetKeyword.
 * idx / fallbackIdx feed the Ylopo results widget; fallback is what the page
 * swaps to when the primary search renders no listings (plan B), alongside
 * the always-present nearby-communities links.
 */

export interface IdxLocation {
  city: string
  state: string
  neighborhood?: string
}

export interface ExpansionEntry {
  slug: string
  name: string
  pageType: 'community' | 'neighborhood' | 'condo-building' | 'condo-hub' | 'lifestyle-hub' | 'enclave'
  phase: number
  targetKeyword: string
  searchVolume: number
  idx: IdxLocation
  idxPropertyTypes?: string[]
  fallbackIdx: IdxLocation
  /** Existing site pages to feature as nearby/related (name + site-relative URL). */
  nearby: Array<{ name: string; url: string }>
  /** Extra context handed to the writer (building details, angle, etc.) */
  writerNotes?: string
}

const SD: IdxLocation = { city: 'San Diego', state: 'CA' }
const ALL_TYPES = ['house', 'condo', 'townhouse', 'multi_family']

// ─── Phase 1 — missing cities (≈47,400/mo) ─────────────────────────────────────
const PHASE_1: ExpansionEntry[] = [
  { slug: 'escondido-real-estate', name: 'Escondido', pageType: 'community', phase: 1, targetKeyword: 'escondido homes for sale', searchVolume: 8100, idx: { city: 'Escondido', state: 'CA' }, fallbackIdx: { city: 'San Marcos', state: 'CA' }, nearby: [ { name: 'San Marcos', url: '/communities/san-marcos-real-estate' }, { name: 'Rancho Santa Fe', url: '/communities/rancho-santa-fe-real-estate' }, { name: 'Carlsbad', url: '/communities/carlsbad-real-estate' } ] },
  { slug: 'fallbrook-real-estate', name: 'Fallbrook', pageType: 'community', phase: 1, targetKeyword: 'fallbrook homes for sale', searchVolume: 6600, idx: { city: 'Fallbrook', state: 'CA' }, fallbackIdx: { city: 'Oceanside', state: 'CA' }, nearby: [ { name: 'Oceanside', url: '/communities/oceanside-real-estate' }, { name: 'Carlsbad', url: '/communities/carlsbad-real-estate' } ] },
  { slug: 'san-marcos-real-estate', name: 'San Marcos', pageType: 'community', phase: 1, targetKeyword: 'san marcos ca homes for sale', searchVolume: 4400, idx: { city: 'San Marcos', state: 'CA' }, fallbackIdx: { city: 'Escondido', state: 'CA' }, nearby: [ { name: 'Carlsbad', url: '/communities/carlsbad-real-estate' }, { name: 'Encinitas', url: '/communities/encinitas-real-estate' }, { name: 'Escondido', url: '/communities/escondido-real-estate' } ] },
  { slug: 'vista-real-estate', name: 'Vista', pageType: 'community', phase: 1, targetKeyword: 'vista ca homes for sale', searchVolume: 4400, idx: { city: 'Vista', state: 'CA' }, fallbackIdx: { city: 'Oceanside', state: 'CA' }, nearby: [ { name: 'Oceanside', url: '/communities/oceanside-real-estate' }, { name: 'Carlsbad', url: '/communities/carlsbad-real-estate' }, { name: 'San Marcos', url: '/communities/san-marcos-real-estate' } ] },
  { slug: 'poway-real-estate', name: 'Poway', pageType: 'community', phase: 1, targetKeyword: 'poway homes for sale', searchVolume: 3600, idx: { city: 'Poway', state: 'CA' }, fallbackIdx: SD, nearby: [ { name: 'Rancho Peñasquitos', url: '/communities/rancho-penasquitos-real-estate' }, { name: 'Scripps Ranch', url: '/communities/scripps-ranch-real-estate' } ], writerNotes: 'Emphasize Poway Unified School District as a major buyer draw ("the City in the Country"); schools content belongs here per the plan.' },
  { slug: 'santee-real-estate', name: 'Santee', pageType: 'community', phase: 1, targetKeyword: 'santee homes for sale', searchVolume: 3600, idx: { city: 'Santee', state: 'CA' }, fallbackIdx: { city: 'El Cajon', state: 'CA' }, nearby: [ { name: 'El Cajon', url: '/communities/el-cajon-real-estate' }, { name: 'La Mesa', url: '/communities/la-mesa-real-estate' } ] },
  { slug: 'ramona-real-estate', name: 'Ramona', pageType: 'community', phase: 1, targetKeyword: 'ramona ca homes for sale', searchVolume: 3600, idx: { city: 'Ramona', state: 'CA' }, fallbackIdx: { city: 'Poway', state: 'CA' }, nearby: [ { name: 'Poway', url: '/communities/poway-real-estate' }, { name: 'Escondido', url: '/communities/escondido-real-estate' } ], writerNotes: 'Horse property / acreage / wine country angle is genuine here.' },
  { slug: 'alpine-real-estate', name: 'Alpine', pageType: 'community', phase: 1, targetKeyword: 'alpine ca homes for sale', searchVolume: 3600, idx: { city: 'Alpine', state: 'CA' }, fallbackIdx: { city: 'El Cajon', state: 'CA' }, nearby: [ { name: 'El Cajon', url: '/communities/el-cajon-real-estate' }, { name: 'La Mesa', url: '/communities/la-mesa-real-estate' } ] },
  { slug: 'bonita-real-estate', name: 'Bonita', pageType: 'community', phase: 1, targetKeyword: 'bonita ca homes for sale', searchVolume: 1900, idx: { city: 'Bonita', state: 'CA' }, fallbackIdx: { city: 'Chula Vista', state: 'CA' }, nearby: [ { name: 'Chula Vista', url: '/communities/chula-vista-real-estate' }, { name: 'Spring Valley', url: '/communities/spring-valley-real-estate' } ] },
  { slug: 'rancho-bernardo-real-estate', name: 'Rancho Bernardo', pageType: 'community', phase: 1, targetKeyword: 'rancho bernardo homes for sale', searchVolume: 1600, idx: { neighborhood: 'Rancho Bernardo', ...SD }, fallbackIdx: { city: 'Poway', state: 'CA' }, nearby: [ { name: 'Poway', url: '/communities/poway-real-estate' }, { name: 'Rancho Peñasquitos', url: '/communities/rancho-penasquitos-real-estate' }, { name: 'Scripps Ranch', url: '/communities/scripps-ranch-real-estate' } ] },
  { slug: 'mira-mesa-real-estate', name: 'Mira Mesa', pageType: 'community', phase: 1, targetKeyword: 'mira mesa homes for sale', searchVolume: 1600, idx: { neighborhood: 'Mira Mesa', ...SD }, fallbackIdx: SD, nearby: [ { name: 'Scripps Ranch', url: '/communities/scripps-ranch-real-estate' }, { name: 'Rancho Peñasquitos', url: '/communities/rancho-penasquitos-real-estate' } ] },
  { slug: 'national-city-real-estate', name: 'National City', pageType: 'community', phase: 1, targetKeyword: 'national city homes for sale', searchVolume: 1300, idx: { city: 'National City', state: 'CA' }, fallbackIdx: { city: 'Chula Vista', state: 'CA' }, nearby: [ { name: 'Chula Vista', url: '/communities/chula-vista-real-estate' }, { name: 'Downtown San Diego', url: '/communities/downtown-san-diego-real-estate' } ] },
  { slug: 'imperial-beach-real-estate', name: 'Imperial Beach', pageType: 'community', phase: 1, targetKeyword: 'imperial beach homes for sale', searchVolume: 1300, idx: { city: 'Imperial Beach', state: 'CA' }, fallbackIdx: { city: 'Chula Vista', state: 'CA' }, nearby: [ { name: 'Coronado', url: '/communities/coronado-real-estate' }, { name: 'Chula Vista', url: '/communities/chula-vista-real-estate' } ], writerNotes: 'Southernmost beach town in California; most affordable coastal entry in the county.' },
  { slug: 'lakeside-real-estate', name: 'Lakeside', pageType: 'community', phase: 1, targetKeyword: 'lakeside ca homes for sale', searchVolume: 880, idx: { city: 'Lakeside', state: 'CA' }, fallbackIdx: { city: 'Santee', state: 'CA' }, nearby: [ { name: 'Santee', url: '/communities/santee-real-estate' }, { name: 'El Cajon', url: '/communities/el-cajon-real-estate' } ] },
  { slug: 'rancho-san-diego-real-estate', name: 'Rancho San Diego', pageType: 'community', phase: 1, targetKeyword: 'rancho san diego homes for sale', searchVolume: 880, idx: { neighborhood: 'Rancho San Diego', city: 'El Cajon', state: 'CA' }, fallbackIdx: { city: 'El Cajon', state: 'CA' }, nearby: [ { name: 'El Cajon', url: '/communities/el-cajon-real-estate' }, { name: 'Spring Valley', url: '/communities/spring-valley-real-estate' } ] },
]

// ─── Phase 2 — downtown condo towers (≈5,000/mo cluster) ───────────────────────
const DOWNTOWN: IdxLocation = { neighborhood: 'Downtown', ...SD }
const CONDO = ['condo']
const P2_NEARBY = [
  { name: 'Downtown San Diego', url: '/communities/downtown-san-diego-real-estate' },
  { name: 'Little Italy', url: '/communities/downtown-san-diego-real-estate/little-italy' },
  { name: 'Marina District', url: '/communities/downtown-san-diego-real-estate/marina-district' },
]
const PHASE_2: ExpansionEntry[] = [
  { slug: 'downtown-san-diego-condos', name: 'Downtown San Diego Condos', pageType: 'condo-hub', phase: 2, targetKeyword: 'downtown san diego condos for sale', searchVolume: 720, idx: DOWNTOWN, idxPropertyTypes: CONDO, fallbackIdx: SD, nearby: P2_NEARBY, writerNotes: 'Hub page for all downtown towers; overview of the high-rise market by district (Marina, Columbia, East Village, Cortez Hill, Little Italy, Gaslamp).' },
  { slug: 'cityfront-terrace-condos', name: 'CityFront Terrace', pageType: 'condo-building', phase: 2, targetKeyword: 'cityfront terrace san diego', searchVolume: 1000, idx: { neighborhood: 'Marina District', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: 'Landmark 1990s Marina District complex, brick architecture, 500 W Harbor Dr.' },
  { slug: 'el-cortez-condos', name: 'El Cortez', pageType: 'condo-building', phase: 2, targetKeyword: 'el cortez san diego', searchVolume: 1300, idx: { neighborhood: 'Cortez Hill', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: 'Historic 1927 hotel converted to condos, Cortez Hill landmark; lean into the history (much of this search volume is curiosity about the building — the page should satisfy both historians and buyers). Mills Act tax angle.' },
  { slug: 'pacific-gate-condos', name: 'Pacific Gate', pageType: 'condo-building', phase: 2, targetKeyword: 'pacific gate san diego', searchVolume: 390, idx: { neighborhood: 'Columbia District', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: 'Bosa super-prime curved glass tower at 888 W E St, completed 2018.' },
  { slug: 'the-mark-condos', name: 'The Mark', pageType: 'condo-building', phase: 2, targetKeyword: 'the mark san diego', searchVolume: 320, idx: { neighborhood: 'East Village', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: '800 The Mark Ln, East Village high-rise near Petco Park, completed 2007.' },
  { slug: 'savina-condos', name: 'Savina', pageType: 'condo-building', phase: 2, targetKeyword: 'savina san diego', searchVolume: 260, idx: { neighborhood: 'Columbia District', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: 'Bosa tower at 1388 Kettner Blvd, completed 2019.' },
  { slug: 'harbor-club-condos', name: 'Harbor Club', pageType: 'condo-building', phase: 2, targetKeyword: 'harbor club san diego', searchVolume: 210, idx: { neighborhood: 'Marina District', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: 'Twin 41-story towers at 100 Harbor Dr, iconic 1992 skyline fixture near the Convention Center.' },
  { slug: 'electra-condos', name: 'Electra', pageType: 'condo-building', phase: 2, targetKeyword: 'electra san diego', searchVolume: 170, idx: { neighborhood: 'Columbia District', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: '700 W E St — tallest residential tower downtown at completion (2008), built around the historic SDG&E Station B facade; the "conservatory" lobby.' },
  { slug: 'acqua-vista-condos', name: 'Acqua Vista', pageType: 'condo-building', phase: 2, targetKeyword: 'acqua vista san diego', searchVolume: 170, idx: { neighborhood: 'Little Italy', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: '425 W Beech St, Little Italy; popular with investors and first-time downtown buyers.' },
  { slug: 'pinnacle-marina-tower-condos', name: 'Pinnacle Marina Tower', pageType: 'condo-building', phase: 2, targetKeyword: 'pinnacle marina tower san diego', searchVolume: 170, idx: { neighborhood: 'Marina District', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: '550 Front St, 36 stories, 2005; bay views.' },
  { slug: 'the-legend-condos', name: 'The Legend', pageType: 'condo-building', phase: 2, targetKeyword: 'the legend san diego', searchVolume: 110, idx: { neighborhood: 'East Village', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: '325 7th Ave — overlooks Petco Park outfield; rooftop "sky box" on game nights.' },
  { slug: 'smart-corner-condos', name: 'Smart Corner', pageType: 'condo-building', phase: 2, targetKeyword: 'smart corner san diego', searchVolume: 110, idx: { neighborhood: 'East Village', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: '1080 Park Blvd; trolley stop literally at the base; popular entry-level downtown building.' },
  { slug: 'treo-condos', name: 'Treo', pageType: 'condo-building', phase: 2, targetKeyword: 'treo san diego', searchVolume: 90, idx: { neighborhood: 'Columbia District', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: '1240 India St, twin towers at Columbia/Little Italy edge, 2004.' },
  { slug: 'the-grande-condos', name: 'The Grande', pageType: 'condo-building', phase: 2, targetKeyword: 'the grande san diego', searchVolume: 70, idx: { neighborhood: 'Columbia District', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: 'Twin 39-story towers at 1199/1205 Pacific Hwy, 2004-2005; full-floor penthouses.' },
  { slug: 'la-vita-condos', name: 'La Vita', pageType: 'condo-building', phase: 2, targetKeyword: 'la vita san diego', searchVolume: 70, idx: { neighborhood: 'Little Italy', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: '300 W Beech St, Little Italy mid-rise complex with courtyard.' },
  { slug: 'little-italy-condos', name: 'Little Italy Condos', pageType: 'condo-hub', phase: 2, targetKeyword: 'little italy san diego condos for sale', searchVolume: 140, idx: { neighborhood: 'Little Italy', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: 'Neighborhood condo hub; link to Acqua Vista, La Vita, Savina, Treo pages.' },
  { slug: 'bankers-hill-condos', name: 'Bankers Hill Condos', pageType: 'condo-hub', phase: 2, targetKeyword: 'bankers hill condos for sale', searchVolume: 110, idx: { neighborhood: 'Bankers Hill', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: DOWNTOWN, nearby: P2_NEARBY, writerNotes: 'Park-adjacent quieter alternative to the downtown core; Balboa Park views.' },
]

// ─── Phase 3 — mid-city & urban San Diego (≈5,300/mo) ──────────────────────────
const midCity = (slug: string, name: string, keyword: string, vol: number, nearby: Array<{ name: string; url: string }>, notes?: string): ExpansionEntry => ({
  slug, name, pageType: 'community', phase: 3, targetKeyword: keyword, searchVolume: vol,
  idx: { neighborhood: name, ...SD }, fallbackIdx: SD, nearby, writerNotes: notes,
})
const NP = { name: 'North Park', url: '/communities/north-park-real-estate' }
const MH = { name: 'Mission Hills', url: '/communities/mission-hills-real-estate' }
const MV = { name: 'Mission Valley', url: '/communities/mission-valley-real-estate' }
const PHASE_3: ExpansionEntry[] = [
  midCity('ocean-beach-real-estate', 'Ocean Beach', 'ocean beach san diego homes for sale', 880, [ { name: 'Point Loma', url: '/communities/point-loma-real-estate' }, { name: 'Pacific Beach', url: '/communities/pacific-beach-real-estate' } ], 'Bohemian beach town; the pier, Newport Ave, dog beach.'),
  midCity('tierrasanta-real-estate', 'Tierrasanta', 'tierrasanta homes for sale', 880, [MV, { name: 'Scripps Ranch', url: '/communities/scripps-ranch-real-estate' }], '"The Island in the Hills" — surrounded by Mission Trails.'),
  midCity('clairemont-real-estate', 'Clairemont', 'clairemont homes for sale', 590, [ { name: 'Pacific Beach', url: '/communities/pacific-beach-real-estate' }, MV ]),
  midCity('bay-park-real-estate', 'Bay Park', 'bay park san diego homes for sale', 390, [ { name: 'Pacific Beach', url: '/communities/pacific-beach-real-estate' }, MV ], 'Mission Bay views at non-coastal prices.'),
  midCity('del-cerro-real-estate', 'Del Cerro', 'del cerro homes for sale', 390, [ { name: 'La Mesa', url: '/communities/la-mesa-real-estate' }, MV ]),
  midCity('hillcrest-real-estate', 'Hillcrest', 'hillcrest san diego homes for sale', 320, [NP, MH], 'Walkable urban core adjacent to Balboa Park.'),
  midCity('serra-mesa-real-estate', 'Serra Mesa', 'serra mesa homes for sale', 320, [MV, { name: 'La Mesa', url: '/communities/la-mesa-real-estate' }]),
  midCity('kensington-real-estate', 'Kensington', 'kensington san diego homes for sale', 260, [NP, { name: 'La Mesa', url: '/communities/la-mesa-real-estate' }], 'Historic 1910s-1920s Spanish revival streetcar suburb; one of SD\'s most beloved small neighborhoods.'),
  midCity('linda-vista-real-estate', 'Linda Vista', 'linda vista san diego homes for sale', 260, [MV, { name: 'Pacific Beach', url: '/communities/pacific-beach-real-estate' }], 'USD adjacent.'),
  midCity('south-park-real-estate', 'South Park', 'south park san diego homes for sale', 210, [NP, { name: 'Downtown San Diego', url: '/communities/downtown-san-diego-real-estate' }], 'Craftsman bungalows, indie retail on 30th St.'),
  midCity('allied-gardens-real-estate', 'Allied Gardens', 'allied gardens homes for sale', 170, [{ name: 'La Mesa', url: '/communities/la-mesa-real-estate' }, MV]),
  midCity('golden-hill-real-estate', 'Golden Hill', 'golden hill san diego homes for sale', 140, [NP, { name: 'Downtown San Diego', url: '/communities/downtown-san-diego-real-estate' }], 'Victorian stock, park-adjacent, downtown views.'),
  midCity('normal-heights-real-estate', 'Normal Heights', 'normal heights san diego homes for sale', 140, [NP], 'Adams Avenue antique/coffee corridor.'),
  midCity('san-carlos-real-estate', 'San Carlos', 'san carlos san diego homes for sale', 140, [{ name: 'La Mesa', url: '/communities/la-mesa-real-estate' }], 'Cowles Mountain / Mission Trails access.'),
  midCity('university-city-real-estate', 'University City', 'university city san diego homes for sale', 110, [{ name: 'La Jolla', url: '/communities/la-jolla-real-estate' }], 'UTC, UCSD, biotech corridor; split personality: 1960s south UC vs high-rise UTC.'),
  midCity('university-heights-real-estate', 'University Heights', 'university heights san diego homes for sale', 90, [NP, { name: 'Hillcrest', url: '/communities/hillcrest-real-estate' }]),
  midCity('talmadge-real-estate', 'Talmadge', 'talmadge san diego homes for sale', 50, [{ name: 'Kensington', url: '/communities/kensington-real-estate' }, NP], 'Named for the Talmadge sisters (silent film stars) — gates and vintage streetlights.'),
]

// ─── Phase 4 — lifestyle & property-type hubs (≈15,300/mo) ─────────────────────
const PHASE_4: ExpansionEntry[] = [
  { slug: 'san-diego-condos', name: 'San Diego Condos', pageType: 'lifestyle-hub', phase: 4, targetKeyword: 'san diego condos for sale', searchVolume: 6600, idx: SD, idxPropertyTypes: CONDO, fallbackIdx: SD, nearby: [ { name: 'Downtown San Diego Condos', url: '/communities/downtown-san-diego-condos' }, { name: 'Pacific Beach', url: '/communities/pacific-beach-real-estate' }, { name: 'La Jolla', url: '/communities/la-jolla-real-estate' } ], writerNotes: 'County-wide condo hub: downtown towers vs coastal walk-ups vs suburban complexes; HOA/financing guidance.' },
  { slug: 'san-diego-new-construction', name: 'New Construction Homes in San Diego', pageType: 'lifestyle-hub', phase: 4, targetKeyword: 'san diego new construction homes', searchVolume: 1900, idx: SD, idxPropertyTypes: ALL_TYPES, fallbackIdx: SD, nearby: [ { name: 'Chula Vista', url: '/communities/chula-vista-real-estate' }, { name: 'Carlsbad', url: '/communities/carlsbad-real-estate' }, { name: 'San Marcos', url: '/communities/san-marcos-real-estate' } ], writerNotes: 'Where new construction actually is (Otay Ranch/Millenia, North County masterplans, downtown towers); buyer representation on new builds.' },
  { slug: 'oceanside-condos', name: 'Oceanside Condos', pageType: 'condo-hub', phase: 4, targetKeyword: 'oceanside condos for sale', searchVolume: 1300, idx: { city: 'Oceanside', state: 'CA' }, idxPropertyTypes: CONDO, fallbackIdx: { city: 'Oceanside', state: 'CA' }, nearby: [ { name: 'Oceanside', url: '/communities/oceanside-real-estate' }, { name: 'Carlsbad', url: '/communities/carlsbad-real-estate' } ] },
  { slug: 'san-diego-townhomes', name: 'San Diego Townhomes', pageType: 'lifestyle-hub', phase: 4, targetKeyword: 'townhomes for sale san diego', searchVolume: 1300, idx: SD, idxPropertyTypes: ['townhouse'], fallbackIdx: SD, nearby: [ { name: 'Mission Valley', url: '/communities/mission-valley-real-estate' }, { name: 'Chula Vista', url: '/communities/chula-vista-real-estate' } ] },
  { slug: 'la-jolla-condos', name: 'La Jolla Condos', pageType: 'condo-hub', phase: 4, targetKeyword: 'condos for sale la jolla', searchVolume: 1000, idx: { neighborhood: 'La Jolla', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: SD, nearby: [ { name: 'La Jolla', url: '/communities/la-jolla-real-estate' }, { name: 'Pacific Beach', url: '/communities/pacific-beach-real-estate' } ] },
  { slug: 'san-diego-55-plus-communities', name: '55+ Communities in San Diego', pageType: 'lifestyle-hub', phase: 4, targetKeyword: 'active adult communities san diego', searchVolume: 1040, idx: SD, idxPropertyTypes: ALL_TYPES, fallbackIdx: SD, nearby: [ { name: 'Oceanside', url: '/communities/oceanside-real-estate' }, { name: 'Rancho Bernardo', url: '/communities/rancho-bernardo-real-estate' } ], writerNotes: 'Name the actual major 55+ communities (Oceana, Rancho Bernardo\'s Seven Oaks/Oaks North, Lake San Marcos, Ocean Hills Country Club). CPC $6.62 — high-value intent. There is an existing 55+ blog post to link.' },
  { slug: 'san-diego-waterfront-homes', name: 'Waterfront & Ocean View Homes in San Diego', pageType: 'lifestyle-hub', phase: 4, targetKeyword: 'waterfront homes for sale san diego', searchVolume: 1200, idx: SD, idxPropertyTypes: ALL_TYPES, fallbackIdx: SD, nearby: [ { name: 'Coronado', url: '/communities/coronado-real-estate' }, { name: 'Point Loma', url: '/communities/point-loma-real-estate' }, { name: 'La Jolla', url: '/communities/la-jolla-real-estate' } ], writerNotes: 'Cluster hub: oceanfront vs bayfront vs ocean-view; Coronado Cays boat docks, Sunset Cliffs, La Playa, Mission Bay. Cover "beach houses san diego" intent too.' },
  { slug: 'pacific-beach-condos', name: 'Pacific Beach Condos', pageType: 'condo-hub', phase: 4, targetKeyword: 'pacific beach condos for sale', searchVolume: 320, idx: { neighborhood: 'Pacific Beach', ...SD }, idxPropertyTypes: CONDO, fallbackIdx: SD, nearby: [ { name: 'Pacific Beach', url: '/communities/pacific-beach-real-estate' }, { name: 'Mission Beach', url: '/communities/mission-beach-real-estate' } ] },
  { slug: 'san-diego-luxury-homes', name: 'Luxury Homes in San Diego', pageType: 'lifestyle-hub', phase: 4, targetKeyword: 'luxury homes for sale san diego', searchVolume: 260, idx: SD, idxPropertyTypes: ['house'], fallbackIdx: SD, nearby: [ { name: 'Rancho Santa Fe', url: '/communities/rancho-santa-fe-real-estate' }, { name: 'La Jolla', url: '/communities/la-jolla-real-estate' }, { name: 'Del Mar', url: '/communities/del-mar-real-estate' } ] },
  { slug: 'san-diego-gated-communities', name: 'Gated Communities in San Diego', pageType: 'lifestyle-hub', phase: 4, targetKeyword: 'gated communities san diego', searchVolume: 210, idx: SD, idxPropertyTypes: ['house'], fallbackIdx: SD, nearby: [ { name: 'Rancho Santa Fe', url: '/communities/rancho-santa-fe-real-estate' }, { name: 'Carmel Valley', url: '/communities/carmel-valley-real-estate' } ], writerNotes: 'Name real gated communities: The Covenant/Fairbanks Ranch/The Crosby/Cielo (RSF), Santaluz, Blackhorse, Coronado Cays gated sections.' },
  { slug: 'san-diego-historic-homes', name: 'Historic Homes in San Diego', pageType: 'lifestyle-hub', phase: 4, targetKeyword: 'historic homes san diego', searchVolume: 210, idx: SD, idxPropertyTypes: ['house'], fallbackIdx: SD, nearby: [ { name: 'Mission Hills', url: '/communities/mission-hills-real-estate' }, { name: 'Kensington', url: '/communities/kensington-real-estate' }, { name: 'North Park', url: '/communities/north-park-real-estate' } ], writerNotes: 'Mills Act property-tax savings is the killer content here; Victorian/Craftsman/Spanish revival districts. Ties into the local-history blog engine.' },
  { slug: 'san-diego-horse-property', name: 'Horse Property in San Diego County', pageType: 'lifestyle-hub', phase: 4, targetKeyword: 'horse property for sale san diego', searchVolume: 110, idx: SD, idxPropertyTypes: ['house'], fallbackIdx: SD, nearby: [ { name: 'Ramona', url: '/communities/ramona-real-estate' }, { name: 'Rancho Santa Fe', url: '/communities/rancho-santa-fe-real-estate' } ], writerNotes: 'Ramona, Valley Center, Bonsall, RSF trails system, Olivenhain.' },
]

// ─── Phase 5 — master-planned & coastal enclaves ───────────────────────────────
const PHASE_5: ExpansionEntry[] = [
  { slug: 'lake-san-marcos-real-estate', name: 'Lake San Marcos', pageType: 'enclave', phase: 5, targetKeyword: 'lake san marcos homes for sale', searchVolume: 480, idx: { neighborhood: 'Lake San Marcos', city: 'San Marcos', state: 'CA' }, fallbackIdx: { city: 'San Marcos', state: 'CA' }, nearby: [ { name: 'San Marcos', url: '/communities/san-marcos-real-estate' }, { name: 'Escondido', url: '/communities/escondido-real-estate' } ], writerNotes: 'Lakefront resort community; strong 55+ overlap.' },
  { slug: 'san-elijo-hills-real-estate', name: 'San Elijo Hills', pageType: 'enclave', phase: 5, targetKeyword: 'san elijo hills homes for sale', searchVolume: 320, idx: { neighborhood: 'San Elijo Hills', city: 'San Marcos', state: 'CA' }, fallbackIdx: { city: 'San Marcos', state: 'CA' }, nearby: [ { name: 'San Marcos', url: '/communities/san-marcos-real-estate' }, { name: 'Encinitas', url: '/communities/encinitas-real-estate' } ], writerNotes: 'Hilltop master-planned village with town center and ocean-view ridgelines.' },
  { slug: '4s-ranch-real-estate', name: '4S Ranch', pageType: 'enclave', phase: 5, targetKeyword: '4s ranch homes for sale', searchVolume: 320, idx: { neighborhood: '4S Ranch', ...SD }, fallbackIdx: SD, nearby: [ { name: 'Rancho Bernardo', url: '/communities/rancho-bernardo-real-estate' }, { name: 'Poway', url: '/communities/poway-real-estate' } ], writerNotes: 'Poway Unified schools; family master-plan adjacent to Rancho Bernardo; Del Sur and Black Mountain Ranch belong in the narrative.' },
  { slug: 'aviara-carlsbad-real-estate', name: 'Aviara', pageType: 'enclave', phase: 5, targetKeyword: 'aviara carlsbad homes for sale', searchVolume: 90, idx: { neighborhood: 'Aviara', city: 'Carlsbad', state: 'CA' }, fallbackIdx: { city: 'Carlsbad', state: 'CA' }, nearby: [ { name: 'Carlsbad', url: '/communities/carlsbad-real-estate' }, { name: 'Encinitas', url: '/communities/encinitas-real-estate' } ], writerNotes: 'Park Hyatt Aviara resort/golf; Batiquitos Lagoon.' },
]

export const EXPANSION_QUEUE: ExpansionEntry[] = [
  ...PHASE_1,
  ...PHASE_2,
  ...PHASE_3,
  ...PHASE_4,
  ...PHASE_5,
]

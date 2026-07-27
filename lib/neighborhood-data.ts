import type { Highlight, QuickFact, NearbyCommunity, MelloRoosData } from './community-data'

export interface NeighborhoodData {
  name: string
  parentName: string
  parentSlug: string
  slug: string
  image: string
  badge: string
  subtitle: string
  priceRange: string
  tags: string
  heroStats: Array<{ value: string; label: string }>
  overview: string[]
  quickFacts: QuickFact[]
  highlights: Highlight[]
  ylopoSearch: string
  ylopoLocations: Array<{ city?: string; neighborhood?: string; state: string }>
  nearbyCommunities: NearbyCommunity[]
  melloroos?: MelloRoosData
}

const NEIGHBORHOODS: NeighborhoodData[] = [
  {
    name: 'East Village',
    parentName: 'Downtown San Diego',
    parentSlug: 'downtown-san-diego-real-estate',
    slug: 'east-village',
    image: 'community-downtown-san-diego.jpg',
    badge: 'Urban Hip · Arts & Breweries',
    subtitle: 'Downtown San Diego · California',
    priceRange: '$400K – $1.2M',
    tags: 'Breweries · Petco Park · Hip',
    heroStats: [
      { value: '$400K+', label: 'Starting Price' },
      { value: '97', label: 'Walk Score' },
      { value: '92101', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      "East Village is Downtown San Diego's most dynamic and rapidly evolving neighborhood — a former industrial corridor reimagined as a vibrant urban community anchored by Petco Park, modern residential towers, converted lofts, craft breweries, and a growing dining scene that draws visitors from across the county.",
      'Stretching east from the Gaslamp Quarter toward City College and south toward the Convention Center, East Village offers an energetic mix of urban living options for professionals, Padres fans, creatives, and investors. Its exceptional walkability, proximity to the waterfront, and steady pace of new development make it one of the most compelling real estate stories in all of Downtown San Diego.',
      'Buyers in East Village choose from a diverse inventory: converted warehouse lofts with exposed concrete and high ceilings, boutique mid-rises, and contemporary luxury high-rise condominiums with panoramic city and bay views. Price points span a wide range, making East Village one of the most accessible entry points into Downtown San Diego homeownership.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Urban Neighborhood' },
      { label: 'Parent Community', value: 'Downtown San Diego' },
      { label: 'ZIP Code', value: '92101' },
      { label: 'Architecture', value: 'High-Rise · Loft · Mixed-Use' },
      { label: 'Price Range', value: '$400K – $1.2M' },
      { label: 'Transit', value: 'Trolley · Bus' },
    ],
    highlights: [
      {
        title: 'Petco Park',
        desc: "The home of the San Diego Padres sits at the heart of East Village, transforming this formerly industrial area into one of Downtown's most energetic urban destinations. On game days and beyond, the ballpark drives foot traffic, restaurants, and street life that define the neighborhood's character.",
      },
      {
        title: 'East Village Green',
        desc: "A modern urban park at 13th and Market Street brings green space, walking paths, and community programming to the neighborhood's center. The park represents East Village's ongoing evolution from an industrial past into a genuinely livable, pedestrian-friendly community.",
      },
      {
        title: 'San Diego Central Library',
        desc: "The striking 9-story architectural landmark at Park Blvd and J Street opened in 2013 and has become one of East Village's defining cultural institutions — featuring a rooftop dome, maker spaces, and a robust community programming calendar that draws visitors from across the county.",
      },
      {
        title: 'Craft Breweries & Dining',
        desc: "East Village has emerged as a hub for San Diego's celebrated craft beer culture, with several breweries and an expanding restaurant scene ranging from casual tacos to ambitious culinary concepts — all within walking distance of most residences.",
      },
      {
        title: 'Urban Connectivity',
        desc: 'Served by the San Diego Trolley\'s Blue and Green lines, East Village connects residents to the rest of Downtown, the Gaslamp Quarter, the waterfront, and the broader metro with minimal reliance on a car. Daily errands, commuting, and entertainment all happen on foot or by transit.',
      },
      {
        title: 'Diverse Residential Stock',
        desc: 'From converted warehouse lofts with exposed ceilings and original brick to contemporary luxury high-rises with panoramic bay views, East Village offers one of the most varied downtown residential inventories in San Diego — at nearly every price tier.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=East+Village&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=East+Village&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'East Village', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      {
        name: 'Downtown San Diego',
        slug: 'downtown-san-diego-real-estate',
        from: '$400K',
        whyConsider: 'The full Downtown experience — all neighborhoods, landmarks, and waterfront access in one search',
      },
      {
        name: 'North Park',
        slug: 'north-park-real-estate',
        from: '$750K',
        whyConsider: 'A vibrant urban neighborhood with coffee shops, art galleries, and a thriving restaurant scene just north of Downtown',
      },
      {
        name: 'Point Loma',
        slug: 'point-loma-real-estate',
        from: '$900K',
        whyConsider: 'Single-family homes, coastal character, and harbor views near Downtown — a quieter alternative with strong schools',
      },
    ],
    melloroos: {
      show: true,
      introText:
        'Mello-Roos fees are a type of special tax that can apply to certain properties in California — most commonly in newer developments where public infrastructure was built using Community Facilities District (CFD) bonds. East Village, which experienced significant redevelopment following the opening of Petco Park in 2004, includes a number of properties that may carry these assessments.',
      detailParagraphs: [
        'When a developer builds a new community, they sometimes partner with a public agency to finance infrastructure — roads, parks, utilities, and community facilities — through a bond. That bond is repaid over time through a special tax collected alongside property taxes on homes within the district.',
        'Not every property in East Village carries a Mello-Roos assessment. Older converted buildings and long-established condominiums typically do not. Newer high-rise developments and recently completed projects — particularly those built as part of the post-2004 redevelopment that followed Petco Park — may carry a CFD assessment that varies significantly by building and parcel.',
        'Assessment amounts vary by development, bond size, and how much of the original bond has been paid down. Some assessments are modest; others can add several hundred dollars per year to your overall tax bill. Verifying the current assessment — and its scheduled end date — before making an offer is an important step in understanding your true cost of ownership.',
        'Palisade Realty agents can help you locate CFD parcel tax information for any specific East Village property, interpret the assessment schedule, and factor the full cost into your monthly payment analysis before you commit.',
      ],
      quickFacts: [
        'May apply to newer East Village developments',
        'Helps fund public infrastructure and services',
        'Assessment amounts vary by property',
        'Buyers should verify before purchasing',
      ],
      disclaimer:
        'Mello-Roos assessments vary by property, development, and district. Buyers should verify current assessments with the appropriate public agency and consult their real estate, tax, or legal professional.',
      ctaText:
        'Our team can help you review East Village property details and better understand any additional assessments before you make an offer.',
      ctaLink: '/contact',
    },
  },
]

export function getNeighborhoodBySlug(communitySlug: string, neighborhoodSlug: string): NeighborhoodData | undefined {
  return NEIGHBORHOODS.find((n) => n.parentSlug === communitySlug && n.slug === neighborhoodSlug)
}

export function getAllNeighborhoodParams(): Array<{ slug: string; neighborhood: string }> {
  return NEIGHBORHOODS.map((n) => ({ slug: n.parentSlug, neighborhood: n.slug }))
}

export default NEIGHBORHOODS

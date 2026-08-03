import type { Highlight, QuickFact, NearbyCommunity, MelloRoosData } from './community-data'

export interface NeighborhoodData {
  name: string
  titleFirst: string
  titleRest: string
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
  lifestyleBody?: string[]
  lifestyleBullets?: string[]
  locationMap?: {
    center: [number, number]
    zoom: number
    boundary: [number, number][]
    marker?: [number, number]
  }
}

const NEIGHBORHOODS: NeighborhoodData[] = [

  // ── EAST VILLAGE ──────────────────────────────────────────────────────────
  {
    name: 'East Village',
    titleFirst: 'East',
    titleRest: 'Village',
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
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$400K', whyConsider: 'The full Downtown experience — all neighborhoods, landmarks, and waterfront access in one search' },
      { name: 'North Park', slug: 'north-park-real-estate', from: '$750K', whyConsider: 'A vibrant urban neighborhood with coffee shops, art galleries, and a thriving restaurant scene just north of Downtown' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$900K', whyConsider: 'Single-family homes, coastal character, and harbor views near Downtown — a quieter alternative with strong schools' },
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
      disclaimer: 'Mello-Roos assessments vary by property, development, and district. Buyers should verify current assessments with the appropriate public agency and consult their real estate, tax, or legal professional.',
      ctaText: 'Our team can help you review East Village property details and better understand any additional assessments before you make an offer.',
      ctaLink: '/contact',
    },
  },

  // ── LITTLE ITALY ──────────────────────────────────────────────────────────
  {
    name: 'Little Italy',
    titleFirst: 'Little',
    titleRest: 'Italy',
    parentName: 'Downtown San Diego',
    parentSlug: 'downtown-san-diego-real-estate',
    slug: 'little-italy',
    image: 'community-downtown-san-diego.jpg',
    badge: 'Walkable Village · Arts & Dining',
    subtitle: 'Downtown San Diego · California',
    priceRange: '$600K – $2.5M',
    tags: 'Walkable · Dining · European Feel',
    heroStats: [
      { value: '$600K+', label: 'Starting Price' },
      { value: '98', label: 'Walk Score' },
      { value: '92101', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      "Little Italy is one of San Diego's most beloved urban neighborhoods — a compact, walkable village that has evolved from its Italian fishing community roots into one of Downtown's premier destinations for dining, arts, and urban living. Its blend of old-world charm and contemporary energy is unlike anywhere else in the city.",
      'Stretching along India Street from the waterfront to Washington Street, Little Italy draws residents and visitors with its legendary Saturday Farmers Market, acclaimed restaurants, boutique shops, and a European piazza atmosphere. Residential towers and lofts command premium prices that reflect the neighborhood\'s sustained desirability and consistently strong demand.',
      'The housing inventory ranges from boutique mid-rise condominiums to contemporary luxury high-rises with bay views, alongside a selection of loft-style conversions and newer full-service buildings offering amenities that match the neighborhood\'s upscale character.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Urban Neighborhood' },
      { label: 'Parent Community', value: 'Downtown San Diego' },
      { label: 'ZIP Code', value: '92101' },
      { label: 'Architecture', value: 'High-Rise · Loft · Boutique Mid-Rise' },
      { label: 'Price Range', value: '$600K – $2.5M' },
      { label: 'Transit', value: 'Trolley · Bus · Walkable' },
    ],
    highlights: [
      {
        title: 'Saturday Farmers Market',
        desc: "One of San Diego's largest and most celebrated outdoor markets runs every Saturday along Date Street. The Mercato at Little Italy draws thousands of residents and visitors with fresh produce, artisan foods, flowers, and a festive street atmosphere that exemplifies the neighborhood's village spirit.",
      },
      {
        title: 'World-Class Dining',
        desc: "Little Italy's restaurant scene is among San Diego's finest — spanning acclaimed fine dining, traditional Italian trattorias, vibrant brunch spots, and inviting wine bars. Residents are within walking distance of dozens of exceptional culinary experiences any day of the week.",
      },
      {
        title: 'Piazza della Famiglia',
        desc: 'The neighborhood\'s central piazza serves as a community gathering point for outdoor festivals, weekend events, and everyday street life. With fountain features, café seating, and a distinctly European atmosphere, the piazza gives Little Italy much of its signature character and sense of place.',
      },
      {
        title: 'Waterfront Access',
        desc: 'Little Italy sits adjacent to San Diego Bay, with Waterfront Park and the Embarcadero just a short walk from most residences. Residents enjoy bay views, morning strolls along the water, and easy access to the maritime atmosphere that defines San Diego\'s coastal identity.',
      },
      {
        title: 'Arts & Culture',
        desc: "The ArtWalk festival, year-round gallery events, and a concentration of creative businesses make Little Italy one of San Diego's most culturally vibrant neighborhoods. Public murals, sculpture installations, and design-forward architecture give the streetscape a dynamic visual energy.",
      },
      {
        title: 'Exceptional Walkability',
        desc: "With a Walk Score near 98, Little Italy consistently ranks as one of Downtown San Diego's most pedestrian-friendly neighborhoods. Groceries, coffee, dining, fitness studios, and the trolley are all within a short walk of nearly every address — making car-free living entirely practical.",
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Little+Italy&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Little+Italy&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Little Italy', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$400K', whyConsider: 'The full Downtown experience — all neighborhoods, landmarks, and waterfront access in one search' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic Craftsman homes and boutique dining just north of Little Italy, with a quieter residential feel' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$900K', whyConsider: 'Single-family coastal community with harbor views, minutes from Downtown by car or trolley' },
    ],
  },

  // ── GASLAMP QUARTER ───────────────────────────────────────────────────────
  {
    name: 'Gaslamp Quarter',
    titleFirst: 'Gaslamp',
    titleRest: 'Quarter',
    parentName: 'Downtown San Diego',
    parentSlug: 'downtown-san-diego-real-estate',
    slug: 'gaslamp-quarter',
    image: 'community-downtown-san-diego.jpg',
    badge: 'Historic District · Nightlife & Dining',
    subtitle: 'Downtown San Diego · California',
    priceRange: '$450K – $1.5M',
    tags: 'Nightlife · Historic · Entertainment',
    heroStats: [
      { value: '$450K+', label: 'Starting Price' },
      { value: '16', label: 'Historic Blocks' },
      { value: '92101', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      "The Gaslamp Quarter is Downtown San Diego's most storied and energetic entertainment district — a 16-block National Historic Landmark District where Victorian-era brick buildings house a dense concentration of restaurants, bars, clubs, and boutique shops that make it one of the most visited urban destinations on the West Coast.",
      "Bounded by Broadway to the north, the San Diego Convention Center to the south, and flanked by the Marina District and East Village, the Gaslamp Quarter is uniquely positioned at the center of Downtown's activity. Petco Park is steps away, the Convention Center drives year-round foot traffic, and the trolley provides direct connections across the metro area.",
      'Residential options in the Gaslamp Quarter tend toward smaller condominiums and loft conversions within historic commercial buildings, alongside a small selection of newer purpose-built residences. Buyers drawn here typically prioritize location, walkability, and the unmatched access to Downtown\'s entertainment and cultural core.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Historic Entertainment District' },
      { label: 'Parent Community', value: 'Downtown San Diego' },
      { label: 'ZIP Code', value: '92101' },
      { label: 'Architecture', value: 'Victorian Brick · Loft Conversions' },
      { label: 'Price Range', value: '$450K – $1.5M' },
      { label: 'Transit', value: 'Trolley · Bus · Walkable' },
    ],
    highlights: [
      {
        title: 'National Historic Landmark',
        desc: "The Gaslamp Quarter is listed on the National Register of Historic Places — its 16 blocks contain dozens of preserved Victorian commercial buildings from the late 1800s and early 1900s. The architecture provides a visual identity unlike any other neighborhood in San Diego.",
      },
      {
        title: 'Dining & Nightlife',
        desc: "San Diego's premier entertainment district offers an extraordinary concentration of restaurants, rooftop bars, cocktail lounges, live music venues, and nightclubs. The Gaslamp draws visitors from across the county and beyond — and residents enjoy it all on foot.",
      },
      {
        title: 'Convention Center Proximity',
        desc: "The San Diego Convention Center sits at the neighborhood's southern edge, making the Gaslamp Quarter a top choice for professionals who attend major conferences year-round. Comic-Con, trade expos, and business events consistently animate the surrounding streets.",
      },
      {
        title: 'Petco Park Access',
        desc: "The home of the San Diego Padres is steps from the Gaslamp Quarter's eastern boundary, making this neighborhood one of the most desirable for baseball fans. Pre- and post-game energy on 5th Avenue and J Street adds another layer of life to an already active neighborhood.",
      },
      {
        title: '5th Avenue Character',
        desc: 'The main spine of the Gaslamp Quarter runs along 5th Avenue — a stretch of historic storefronts, sidewalk dining, and illuminated marquees that creates one of San Diego\'s most visually distinctive streets. Walking 5th Avenue on a weekend evening is quintessential San Diego.',
      },
      {
        title: 'Central Connectivity',
        desc: 'Positioned at the geographic center of Downtown, the Gaslamp Quarter is walking distance from the waterfront, the Embarcadero, Balboa Park, East Village, and the Marina District. The San Diego Trolley\'s multiple nearby stops make the entire metro easily accessible.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Gaslamp+Quarter&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Gaslamp+Quarter&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Gaslamp Quarter', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$400K', whyConsider: 'The full Downtown experience — all neighborhoods, landmarks, and waterfront access in one search' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island community with quiet beaches and luxury homes, a short ferry ride from the Embarcadero' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$900K', whyConsider: 'Single-family coastal neighborhood with harbor views and strong schools, minutes from Downtown' },
    ],
  },

  // ── MARINA DISTRICT ───────────────────────────────────────────────────────
  {
    name: 'Marina District',
    titleFirst: 'Marina',
    titleRest: 'District',
    parentName: 'Downtown San Diego',
    parentSlug: 'downtown-san-diego-real-estate',
    slug: 'marina-district',
    image: 'community-downtown-san-diego.jpg',
    badge: 'Bayfront Luxury · High-Rise Living',
    subtitle: 'Downtown San Diego · California',
    priceRange: '$500K – $2M',
    tags: 'Bayfront · Views · Luxury High-Rise',
    heroStats: [
      { value: '$500K+', label: 'Starting Price' },
      { value: 'Bayfront', label: 'Location' },
      { value: '92101', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      "The Marina District is Downtown San Diego's premier bayfront neighborhood — a sleek, upscale enclave of luxury high-rise condominiums positioned along the waterfront between the Gaslamp Quarter and Little Italy. Panoramic views of San Diego Bay, Coronado, and the Pacific define life here.",
      'Home to some of Downtown San Diego\'s most prestigious residential towers, the Marina District draws buyers seeking waterfront proximity, refined amenities, and access to the Embarcadero, Seaport Village, and the broader Downtown lifestyle. Prices reflect the neighborhood\'s commanding location and the quality of its residential stock.',
      'The Marina District is also one of the most walkable corridors in Downtown San Diego, with Seaport Village, the USS Midway Museum, the Convention Center, and the Gaslamp Quarter all within easy reach — giving residents an unmatched urban-coastal lifestyle.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Luxury Urban Neighborhood' },
      { label: 'Parent Community', value: 'Downtown San Diego' },
      { label: 'ZIP Code', value: '92101' },
      { label: 'Architecture', value: 'Luxury High-Rise · Full-Service Tower' },
      { label: 'Price Range', value: '$500K – $2M' },
      { label: 'Views', value: 'Bay · Coronado · Pacific' },
    ],
    highlights: [
      {
        title: 'San Diego Bay Views',
        desc: "The Marina District's most defining feature is its direct relationship with San Diego Bay. Residents of the neighborhood's high-rise towers wake to sweeping bay views, with Coronado Island, the Navy fleet, and Pacific sunsets composing the backdrop of daily life.",
      },
      {
        title: 'Embarcadero & Waterfront',
        desc: 'The Embarcadero waterfront promenade runs along the neighborhood\'s western edge, offering miles of walkable waterfront with public parks, harbor cruise departures, the USS Midway aircraft carrier museum, and some of San Diego\'s most iconic city-to-bay views.',
      },
      {
        title: 'Seaport Village',
        desc: "The open-air shopping and dining complex at the water's edge is a short walk from most Marina District residences. With restaurants, boutique retailers, and waterfront boardwalks, Seaport Village adds a leisure dimension that enhances the neighborhood's already exceptional setting.",
      },
      {
        title: 'Luxury Amenities',
        desc: "The Marina District's residential towers offer amenities that rival full-service hotels — rooftop pools, fitness centers, concierge services, secured parking, and doorman buildings that provide the privacy and service levels that high-end buyers expect.",
      },
      {
        title: 'Convention Center Access',
        desc: "The San Diego Convention Center sits at the neighborhood's southern boundary, making the Marina District a top choice for business travelers who frequently attend conferences and trade events. Its proximity also keeps foot traffic and services concentrated in the area year-round.",
      },
      {
        title: 'Coronado Ferry',
        desc: "The Coronado Ferry landing is steps from the Marina District, providing a scenic 15-minute crossing to Coronado Island — a convenient alternative for day trips, dining, or simply experiencing San Diego Harbor from the water. It adds a rare urban-nautical dimension to daily life.",
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Marina+District&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Marina+District&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Marina District', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$400K', whyConsider: 'The full Downtown experience — all neighborhoods, landmarks, and waterfront access in one search' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island community with world-class beaches and luxury homes, directly across the bay from the Marina District' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$900K', whyConsider: 'Single-family coastal neighborhood with harbor views and top-rated schools, minutes by car or trolley' },
    ],
  },

  // ── CORTEZ HILL ───────────────────────────────────────────────────────────
  {
    name: 'Cortez Hill',
    titleFirst: 'Cortez',
    titleRest: 'Hill',
    parentName: 'Downtown San Diego',
    parentSlug: 'downtown-san-diego-real-estate',
    slug: 'cortez-hill',
    image: 'community-downtown-san-diego.jpg',
    badge: 'Elevated Views · Quiet Urban Living',
    subtitle: 'Downtown San Diego · California',
    priceRange: '$400K – $1.1M',
    tags: 'Views · Quiet · Value',
    heroStats: [
      { value: '$400K+', label: 'Starting Price' },
      { value: 'Hilltop', label: 'Location' },
      { value: '92101', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      "Cortez Hill is Downtown San Diego's most serene and underappreciated neighborhood — an elevated hillside enclave perched above the urban core with sweeping views of the city, San Diego Bay, and beyond. Its quieter streets and residential scale offer a refreshing contrast to the energy of the Gaslamp Quarter and East Village directly below.",
      "Positioned between Balboa Park to the north and Broadway to the south, Cortez Hill attracts buyers who want Downtown convenience — walkability, transit access, dining proximity — without the noise and density of more central neighborhoods. It represents some of the best value in all of Downtown San Diego for buyers seeking views and relative calm.",
      'The housing stock is a mix of older established condominiums, mid-century buildings, and a handful of newer residential towers. Many units command city and bay views that would cost significantly more in the Marina District or Little Italy, making Cortez Hill a compelling value proposition within the Downtown San Diego market.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Residential Urban Neighborhood' },
      { label: 'Parent Community', value: 'Downtown San Diego' },
      { label: 'ZIP Code', value: '92101' },
      { label: 'Architecture', value: 'Mid-Rise · Established Condos · Some New Build' },
      { label: 'Price Range', value: '$400K – $1.1M' },
      { label: 'Views', value: 'City · Bay · Balboa Park' },
    ],
    highlights: [
      {
        title: 'Panoramic City Views',
        desc: "Cortez Hill's elevated position above the Downtown grid affords residents remarkable views of the city skyline, San Diego Bay, Coronado, and the Pacific. Many residences capture views that rival those of more expensive neighborhoods at a fraction of the premium.",
      },
      {
        title: 'Balboa Park Proximity',
        desc: "Cortez Hill borders Balboa Park — one of the nation's great urban parks — to the north. Residents enjoy easy walking access to the park's museums, gardens, hiking trails, the San Diego Zoo, and the cultural programming that animates the park year-round.",
      },
      {
        title: 'Quiet Residential Character',
        desc: 'Unlike the more commercial neighborhoods surrounding it, Cortez Hill maintains a primarily residential scale with tree-lined streets and a pace of life that feels removed from the intensity of the broader Downtown district — while remaining mere minutes from everything.',
      },
      {
        title: 'Downtown Accessibility',
        desc: "Cortez Hill sits at the threshold between Downtown's urban core and Balboa Park's cultural district. Residents walk to the Gaslamp Quarter, Little Italy, and the Embarcadero, while also having direct access to the park's 1,200 acres of green space and cultural institutions.",
      },
      {
        title: 'Value in the Downtown Market',
        desc: 'With price points consistently among the most accessible in all of Downtown San Diego, Cortez Hill appeals to first-time downtown buyers and investors who want city views and central location without the premium commanded by the Marina District or Little Italy.',
      },
      {
        title: 'Transit & Connectivity',
        desc: "Cortez Hill is well-served by the San Diego Metropolitan Transit System, with bus routes along Broadway and easy access to the trolley's downtown stations. Commuting to Mission Valley, Old Town, or the airport is straightforward without relying on a car.",
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Cortez+Hill&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Cortez+Hill&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Cortez Hill', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$400K', whyConsider: 'The full Downtown experience — all neighborhoods, landmarks, and waterfront access in one search' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic neighborhood with Craftsman homes and tree-lined streets, adjacent to Cortez Hill to the north' },
      { name: 'North Park', slug: 'north-park-real-estate', from: '$750K', whyConsider: 'A vibrant arts and dining neighborhood just east of Balboa Park, with strong community character' },
    ],
  },

  // ── COLUMBIA DISTRICT ─────────────────────────────────────────────────────
  {
    name: 'Columbia District',
    titleFirst: 'Columbia',
    titleRest: 'District',
    parentName: 'Downtown San Diego',
    parentSlug: 'downtown-san-diego-real-estate',
    slug: 'columbia-district',
    image: 'community-downtown-san-diego.jpg',
    badge: 'Tech & New Development · Waterfront',
    subtitle: 'Downtown San Diego · California',
    priceRange: '$500K – $1.8M',
    tags: 'Tech HQ · New Build · Investment',
    heroStats: [
      { value: '$500K+', label: 'Starting Price' },
      { value: 'Waterfront', label: 'Location' },
      { value: '92101', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      "The Columbia District is Downtown San Diego's most forward-looking neighborhood — a rapidly developing waterfront corridor where new construction, corporate campuses, and contemporary residential towers are reshaping the city's northwestern downtown edge. The neighborhood sits between Little Italy and the Embarcadero, with direct San Diego Bay access.",
      "Home to major corporate and government presences and the site of significant ongoing development — including the Manchester Pacific Gateway project transforming the former Navy Broadway Complex — the Columbia District represents Downtown San Diego's growth edge. Buyers here are often drawn by newer construction, investment potential, and proximity to the waterfront.",
      'Residential units in the Columbia District tend toward newer builds in contemporary towers, with modern finishes, open-plan layouts, and amenities that reflect the neighborhood\'s newer development character. Views from upper floors capture San Diego Bay, Coronado, and the Pacific in stunning clarity.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Waterfront Development District' },
      { label: 'Parent Community', value: 'Downtown San Diego' },
      { label: 'ZIP Code', value: '92101' },
      { label: 'Architecture', value: 'New Construction · Contemporary High-Rise' },
      { label: 'Price Range', value: '$500K – $1.8M' },
      { label: 'Views', value: 'Bay · Coronado · Pacific' },
    ],
    highlights: [
      {
        title: 'Waterfront Position',
        desc: "The Columbia District runs along San Diego Bay's northwestern shoreline, giving residents direct access to the Embarcadero, harbor promenade, and the maritime activity that defines San Diego's waterfront. Few downtown neighborhoods offer this level of direct bay adjacency.",
      },
      {
        title: 'New Development',
        desc: "The Columbia District is one of Downtown San Diego's most active development zones — with ongoing construction, new residential towers, and commercial projects steadily transforming the waterfront edge. Buyers choosing new construction find contemporary finishes and current building standards throughout.",
      },
      {
        title: 'Corporate & Professional Hub',
        desc: "Major corporate and institutional presences in the Columbia District make it a natural choice for professionals working in the Downtown business community. Proximity to corporate offices, government agencies, and legal and financial firms reduces commute times for many buyers.",
      },
      {
        title: 'Manchester Pacific Gateway',
        desc: "The ongoing Manchester Pacific Gateway redevelopment — transforming the former Navy Broadway Complex — is one of the most significant urban projects in San Diego's recent history. When complete, it will add millions of square feet of office, hotel, retail, and public space to the neighborhood's waterfront edge.",
      },
      {
        title: 'Little Italy Adjacency',
        desc: "The Columbia District borders Little Italy directly to the south, giving residents easy walking access to one of San Diego's finest dining and cultural neighborhoods. The full range of Little Italy's restaurants, markets, and community events is minutes away on foot.",
      },
      {
        title: 'Investment Potential',
        desc: "With active development, corporate demand, and waterfront scarcity driving long-term interest, the Columbia District appeals strongly to investment-minded buyers. New construction units, short-term rental potential, and corporate leasing all contribute to the neighborhood's investment appeal.",
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Columbia+District&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Columbia+District&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Columbia District', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$400K', whyConsider: 'The full Downtown experience — all neighborhoods, landmarks, and waterfront access in one search' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$900K', whyConsider: 'Single-family coastal community with harbor views, walkable to Liberty Station and OB' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island luxury directly across the bay — a short ferry ride from the Columbia District Embarcadero' },
    ],
    melloroos: {
      show: true,
      introText:
        'Mello-Roos fees are a type of special tax that can apply to certain properties in California — most commonly in newer developments where public infrastructure was built using Community Facilities District (CFD) bonds. The Columbia District, as an area of active new development and infrastructure investment, includes a number of properties that may carry these assessments.',
      detailParagraphs: [
        'When a developer builds a new community, they sometimes partner with a public agency to finance infrastructure — roads, parks, utilities, and community facilities — through a bond. That bond is repaid over time through a special tax collected alongside property taxes on homes within the district.',
        'Not every property in the Columbia District carries a Mello-Roos assessment. Older buildings and established condominiums typically do not. Newer developments — particularly those built as part of recent large-scale waterfront projects — may carry a CFD assessment that varies by building and individual parcel.',
        'Assessment amounts vary by development, bond size, and how much of the original bond has been paid down. Some assessments are modest; others can add several hundred dollars per year to your overall tax bill. Verifying the current assessment and its scheduled end date before making an offer is an important part of understanding your full cost of ownership.',
        'Palisade Realty agents can help you locate CFD parcel tax information for any specific Columbia District property, interpret the assessment schedule, and factor the full cost into your monthly payment analysis before you commit.',
      ],
      quickFacts: [
        'More common in newer Columbia District developments',
        'Helps fund public infrastructure and services',
        'Assessment amounts vary by property',
        'Buyers should verify before purchasing',
      ],
      disclaimer: 'Mello-Roos assessments vary by property, development, and district. Buyers should verify current assessments with the appropriate public agency and consult their real estate, tax, or legal professional.',
      ctaText: 'Our team can help you review Columbia District property details and better understand any additional assessments before you make an offer.',
      ctaLink: '/contact',
    },
  },

  // ── CORE DISTRICT ─────────────────────────────────────────────────────────
  {
    name: 'Core District',
    titleFirst: 'Core',
    titleRest: 'District',
    parentName: 'Downtown San Diego',
    parentSlug: 'downtown-san-diego-real-estate',
    slug: 'core-district',
    image: 'community-downtown-san-diego.jpg',
    badge: 'Central Downtown · Best Value',
    subtitle: 'Downtown San Diego · California',
    priceRange: '$350K – $950K',
    tags: 'Value · Central · Transit',
    heroStats: [
      { value: '$350K+', label: 'Starting Price' },
      { value: 'Central', label: 'Location' },
      { value: '92101', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      "The Core District is Downtown San Diego's geographic and civic heart — the original business district and transit hub where Broadway, civic buildings, and the trolley network converge. It is the most centrally positioned neighborhood in all of Downtown, sitting equidistant from the waterfront, Balboa Park, East Village, and Little Italy.",
      "For buyers entering the Downtown San Diego market, the Core District offers some of the most accessible price points in the area. Studios, one-bedrooms, and smaller condominiums here represent genuine value for urban buyers who prioritize location, transit access, and proximity to everything Downtown has to offer.",
      'The neighborhood is anchored by Horton Plaza, civic and government buildings, and the transit center that connects the trolley and bus network across the metro area. While primarily commercial in character, the Core District houses a steady residential population drawn by its central position and value-oriented pricing.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Central Business District' },
      { label: 'Parent Community', value: 'Downtown San Diego' },
      { label: 'ZIP Code', value: '92101' },
      { label: 'Architecture', value: 'Mixed Commercial · Mid-Rise · Loft' },
      { label: 'Price Range', value: '$350K – $950K' },
      { label: 'Transit', value: 'Trolley Hub · Bus · Walkable' },
    ],
    highlights: [
      {
        title: 'Best Value in Downtown',
        desc: "The Core District consistently offers the most accessible entry-level pricing in all of Downtown San Diego. Buyers seeking urban homeownership at manageable price points find genuine value here — with the convenience of the entire Downtown area accessible on foot or by transit.",
      },
      {
        title: 'Transit Hub',
        desc: "Downtown San Diego's primary transit center sits in the Core District, where the Blue, Green, and Orange trolley lines converge alongside multiple bus routes. Getting anywhere in the San Diego metro — from Mission Valley to the airport to SDSU — is straightforward without a car.",
      },
      {
        title: 'Horton Plaza',
        desc: "The redeveloped Horton Plaza brings mixed-use retail, entertainment, and workspace to the heart of the Core District. The ongoing revitalization of this central block is adding new dining and activity to a neighborhood traditionally defined by commercial and government uses.",
      },
      {
        title: 'Civic & Cultural Access',
        desc: "City Hall, the federal courthouse, and several civic institutions anchor the Core District's identity as Downtown's governmental center. Cultural institutions, libraries, and public spaces are all within easy walking distance of residential addresses.",
      },
      {
        title: 'Surrounded by It All',
        desc: "The Core District's greatest advantage is its central position: the Gaslamp Quarter, Marina District, Little Italy, East Village, and Cortez Hill are all within a 10-minute walk. Every Downtown neighborhood and attraction is accessible from a single central address.",
      },
      {
        title: 'Urban Lifestyle',
        desc: "Residents of the Core District live in the most genuinely urban part of San Diego — surrounded by activity, transit, dining, and civic life at all hours. For buyers who want to be at the center of the city's daily rhythm, no neighborhood in Downtown delivers that experience more directly.",
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Core+District&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Core+District&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Core District', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$400K', whyConsider: 'The full Downtown experience — all neighborhoods, landmarks, and waterfront access in one search' },
      { name: 'Mission Valley', slug: 'mission-valley-real-estate', from: '$550K', whyConsider: 'Shopping, dining, and urban convenience in the valley corridor, accessible by trolley from the Core District' },
      { name: 'North Park', slug: 'north-park-real-estate', from: '$750K', whyConsider: 'A vibrant arts neighborhood just north of Downtown with strong community character and excellent dining' },
    ],
  },

  // ── BANKERS HILL ──────────────────────────────────────────────────────────
  {
    name: 'Bankers Hill',
    titleFirst: 'Bankers',
    titleRest: 'Hill',
    parentName: 'Downtown San Diego',
    parentSlug: 'downtown-san-diego-real-estate',
    slug: 'bankers-hill',
    image: 'community-downtown-san-diego.jpg',
    badge: 'Heritage Architecture · Balboa Park',
    subtitle: 'Downtown San Diego · California',
    priceRange: '$600K – $1.8M',
    tags: 'Heritage · Balboa Park · Boutique',
    heroStats: [
      { value: '$600K+', label: 'Starting Price' },
      { value: 'Balboa Park', label: 'Adjacent' },
      { value: '92103', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      "Bankers Hill is one of Downtown San Diego's most architecturally distinguished and quietly residential neighborhoods — an elevated ridge community bordering Balboa Park to the east, with sweeping views of San Diego Bay, the Pacific, and the Downtown skyline to the west. Its tree-lined streets and heritage homes give it a character distinctly different from the more commercial Downtown sub-neighborhoods.",
      "Long home to physicians, attorneys, and creatives who prize proximity to both Downtown and the park, Bankers Hill offers a rare combination: the dining and cultural access of the Downtown core alongside the green space and residential calm of a neighborhood that borders 1,200 acres of Balboa Park. The cross-streets along Laurel and University bring acclaimed restaurants and boutique businesses that serve a sophisticated local clientele.",
      'The housing inventory includes Victorian and Craftsman homes from the early 20th century, Spanish Colonial Revival residences, mid-century apartment buildings, and contemporary condominiums — giving buyers a range of options spanning heritage character to modern urban living.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Urban Residential Neighborhood' },
      { label: 'Parent Community', value: 'Downtown San Diego' },
      { label: 'ZIP Code', value: '92103' },
      { label: 'Architecture', value: 'Victorian · Craftsman · Spanish Revival · Condo' },
      { label: 'Price Range', value: '$600K – $1.8M' },
      { label: 'Adjacent', value: 'Balboa Park · Mission Hills' },
    ],
    highlights: [
      {
        title: 'Balboa Park Access',
        desc: "Bankers Hill sits on Balboa Park's western ridge, with direct pedestrian access to the park's museums, gardens, hiking trails, performing arts venues, and the San Diego Zoo. Few San Diego neighborhoods offer this level of daily green space immersion within an urban setting.",
      },
      {
        title: 'Laurel Street Dining',
        desc: "Laurel Street is Bankers Hill's culinary spine — a stretch of acclaimed restaurants and bistros that has earned regional recognition. Craft and Commerce, Cucina Urbana, and a rotating cast of celebrated dining concepts have made Bankers Hill a dining destination in its own right.",
      },
      {
        title: 'Heritage Architecture',
        desc: "Bankers Hill preserves some of San Diego's finest examples of early 20th-century residential architecture — Victorian cottages, Craftsman bungalows, and Spanish Colonial Revival homes sit alongside mid-century apartment buildings on shaded residential streets that feel far removed from the urban core below.",
      },
      {
        title: 'Bay & Pacific Views',
        desc: "Bankers Hill's elevated position on the canyon rim delivers panoramic views that span from San Diego Bay and Coronado Island to the Pacific Ocean. Select properties on the western face of the ridge command some of the most dramatic views available in all of Downtown San Diego.",
      },
      {
        title: 'Cabrillo Bridge & Park Blvd',
        desc: "The iconic Cabrillo Bridge — the landmark pedestrian crossing into Balboa Park from the west — anchors the neighborhood's eastern edge. Walking across the bridge into the park's Prado corridor is one of San Diego's great daily pleasures, available on foot for Bankers Hill residents.",
      },
      {
        title: 'Upscale Residential Character',
        desc: 'Bankers Hill maintains a quieter, more residential feel than the neighborhoods directly to the south and east, attracting professionals and families who want Downtown proximity without downtown intensity. The neighborhood\'s elevated position and mature tree canopy contribute to its distinctive, unhurried character.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Bankers+Hill&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Bankers+Hill&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Bankers Hill', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$400K', whyConsider: 'The full Downtown experience — all neighborhoods, landmarks, and waterfront access in one search' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: "Adjacent historic neighborhood with Craftsman homes and boutique dining — Bankers Hill's northern neighbor" },
      { name: 'North Park', slug: 'north-park-real-estate', from: '$750K', whyConsider: 'Vibrant arts and dining neighborhood just east of Balboa Park, easily accessible from Bankers Hill' },
    ],
  },

  // ── MISSION HILLS CORE ───────────────────────────────────────────────────
  {
    name: 'Mission Hills Core',
    titleFirst: 'Mission Hills',
    titleRest: 'Core',
    parentName: 'Mission Hills',
    parentSlug: 'mission-hills-real-estate',
    slug: 'mission-hills-core',
    image: 'community-mission-hills.jpg',
    badge: 'Historic District · Best Craftsman Stock',
    subtitle: 'Mission Hills · San Diego, California',
    priceRange: '$1.1M – $3M+',
    tags: 'Best Craftsman Stock · Historic District · Fort Stockton Dr',
    heroStats: [
      { value: '$1.1M+', label: 'Starting Price' },
      { value: '70', label: 'Walk Score' },
      { value: '92103', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Mission Hills Core is the historic heart of the neighborhood — the streets where the community\'s identity was established in 1908, when developer George Marston platted his original subdivision along Sunset Boulevard, Sheridan Avenue, and Lyndon Road. The City of San Diego locally designated this tract a historic district in 2007 and expanded it in 2014 to roughly 129 properties, with a period of architectural significance spanning 1908 to 1942.',
      'The Core sits alongside — and in places overlaps with — the separately designated Fort Stockton Line Historic District, named for the streetcar route that opened the neighborhood to development in 1910. Together, these two districts preserve one of San Diego\'s finest concentrations of Craftsman, Prairie School, and Spanish Colonial Revival homes, designed by architects including William Hebbard, William Templeton Johnson, and Emmor Brooke Weaver.',
      'Buyers drawn to this pocket are typically preservation-minded — many eligible homes qualify for Mills Act contracts, which can reduce property tax bills by 40–70% in exchange for maintaining historic character. It\'s a premium, tightly held slice of Mission Hills, and turnover is historically low.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Historic District Core' },
      { label: 'Parent Community', value: 'Mission Hills' },
      { label: 'ZIP Code', value: '92103' },
      { label: 'Architecture', value: 'Craftsman · Prairie · Spanish Revival' },
      { label: 'Price Range', value: '$1.1M – $3M+' },
      { label: 'Historic Status', value: 'Locally Designated District (2007/2014)' },
    ],
    highlights: [
      {
        title: 'The 1908 Marston Subdivision',
        desc: 'George Marston\'s original 1908 tract along Sunset Boulevard, Sheridan Avenue, and Lyndon Road remains the architectural core of Mission Hills. The City of San Diego locally designated the district in 2007 and expanded it in 2014 to about 129 properties, 68 of them contributing structures — preserving a remarkably intact early-20th-century streetscape.',
      },
      {
        title: 'Mills Act Tax Savings',
        desc: 'Many homes within the Core qualify for a Mills Act contract with the City of San Diego, which can reduce a property\'s tax bill by 40–70% in exchange for a commitment to maintain its historic character — one of the more meaningful financial advantages of owning here.',
      },
      {
        title: 'Kate Sessions\' Street Tree Legacy',
        desc: 'Horticulturist Kate Sessions, best known for shaping Balboa Park, also influenced Mission Hills\' street tree canopy and founded Mission Hills Nursery on Fort Stockton Drive in 1910 — still operating today as one of San Diego\'s oldest continuously run nurseries.',
      },
      {
        title: 'Fort Stockton Line District',
        desc: 'The adjacent, separately designated Fort Stockton Line Historic District traces its name to the 1910–1939 streetcar route that first opened this ridge to development, adding a second layer of protected architecture just steps from the Core.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Mission+Hills+Core&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Mission+Hills+Core&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Mission Hills Core', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'Urban condo lifestyle, walk score 97, bayfront living, and San Diego\'s most vibrant nightlife and dining 10 minutes south.' },
      { name: 'Bankers Hill', slug: 'bankers-hill-real-estate', from: '$700K', whyConsider: 'Mission Hills\' eastern neighbor — similarly historic but with more condo options and direct Balboa Park frontage.' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$800K', whyConsider: 'Peninsula living west of Mission Hills — scenic harbor views, ocean access, and a laid-back coastal character all its own.' },
    ],
    lifestyleBody: [
      'Life in Mission Hills Core moves at the pace of a neighborhood that has never needed to reinvent itself. Original picture windows, wide front porches, and mature street trees set a tone that\'s equal parts civic pride and quiet routine — mornings often begin with a walk down to Fort Stockton or Washington Street for coffee before the day starts.',
      'This pocket draws buyers who want the real thing: a documented, protected historic streetscape rather than a modern approximation of one. Many residents get involved with the neighborhood\'s active preservation community and the annual Mission Hills Home Tour, which has run since 1976.',
    ],
    lifestyleBullets: [
      'Preservation-minded buyers seeking Mills Act eligibility',
      'History and architecture enthusiasts',
      'Long-term owners who value neighborhood continuity',
      'Buyers who want a walkable, tree-canopied historic streetscape',
      'Families and professionals seeking an established, low-turnover market',
    ],
    locationMap: {
      center: [-117.192, 32.757],
      zoom: 14.2,
      boundary: [
        [-117.198, 32.761], [-117.186, 32.761], [-117.184, 32.754],
        [-117.190, 32.750], [-117.198, 32.752], [-117.198, 32.761],
      ],
      marker: [-117.192, 32.757],
    },
  },

  // ── BUNGALOW HAVEN ───────────────────────────────────────────────────────
  {
    name: 'Bungalow Haven',
    titleFirst: 'Bungalow',
    titleRest: 'Haven',
    parentName: 'Mission Hills',
    parentSlug: 'mission-hills-real-estate',
    slug: 'bungalow-haven',
    image: 'community-mission-hills.jpg',
    badge: 'Craftsman Density · Tree-Lined',
    subtitle: 'Mission Hills · San Diego, California',
    priceRange: '$900K – $1.8M',
    tags: 'Craftsman Density · Preserved · Tree-Lined',
    heroStats: [
      { value: '$900K+', label: 'Starting Price' },
      { value: '70', label: 'Walk Score' },
      { value: '92103', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Bungalow Haven is the name Palisade Realty and local buyers use for Mission Hills\' densest, most consistently Craftsman-scaled residential blocks — the tree-lined side streets where the neighborhood\'s 1908–1930 building boom left its heaviest architectural fingerprint. It isn\'t a separately platted or officially bounded district, but rather the informal shorthand for the pocket where small and mid-size bungalows sit shoulder to shoulder beneath a mature street-tree canopy.',
      'The housing stock here leans smaller and more accessible than the premier historic-district streets, making it a common entry point for buyers who want authentic Mission Hills character without competing for the largest, most restored estates. Many homes retain original details — built-in cabinetry, exposed rafter tails, clinker-brick porches — while others have been sensitively updated.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Residential Pocket' },
      { label: 'Parent Community', value: 'Mission Hills' },
      { label: 'ZIP Code', value: '92103' },
      { label: 'Architecture', value: 'Craftsman Bungalow' },
      { label: 'Price Range', value: '$900K – $1.8M' },
      { label: 'Character', value: 'Dense · Preserved · Tree-Lined' },
    ],
    highlights: [
      {
        title: 'Consistent Craftsman Streetscape',
        desc: 'Block after block of 1908–1930 Craftsman bungalows gives this pocket one of the most visually cohesive streetscapes in Mission Hills — a defining feature of the neighborhood\'s broader, well-documented architectural identity.',
      },
      {
        title: 'Mature Tree Canopy',
        desc: 'Decades of street-tree plantings tied to Mission Hills\' horticultural history (Kate Sessions\' influence extended well beyond Balboa Park) give these residential blocks a deep, shaded canopy that\'s become one of the neighborhood\'s signature qualities.',
      },
      {
        title: 'Accessible Entry Point',
        desc: 'Smaller lot sizes and bungalow floor plans generally price below Mission Hills\' premier historic-core streets, making this pocket a common starting point for buyers new to the neighborhood.',
      },
      {
        title: 'Walkable to the Village',
        desc: 'A short walk delivers residents to the Goldfinch Street and Washington Street business core — coffee, dining, and everyday errands without needing a car.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Bungalow+Haven+Mission+Hills&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Bungalow+Haven&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Bungalow Haven', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'Urban condo lifestyle, walk score 97, bayfront living, and San Diego\'s most vibrant nightlife and dining 10 minutes south.' },
      { name: 'Bankers Hill', slug: 'bankers-hill-real-estate', from: '$700K', whyConsider: 'Mission Hills\' eastern neighbor — similarly historic but with more condo options and direct Balboa Park frontage.' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$800K', whyConsider: 'Peninsula living west of Mission Hills — scenic harbor views, ocean access, and a laid-back coastal character all its own.' },
    ],
    lifestyleBody: [
      'Bungalow Haven suits buyers who want the Mission Hills feel — front porches, gardens, neighbors who know each other — without chasing the largest historic estates. It\'s a place where a Saturday might mean weeding the parkway strip, walking the dog past a dozen nearly identical porch swings, then ending up at a Goldfinch Street coffee shop.',
      'The scale is intimate rather than grand, and that\'s the appeal: real Craftsman character at a size and price that keeps the neighborhood accessible to first-time historic-home buyers, not just move-up buyers.',
    ],
    lifestyleBullets: [
      'First-time historic-home buyers',
      'Buyers who want authentic character at an accessible price point',
      'Gardeners and porch-culture enthusiasts',
      'Young professionals and small families',
      'Buyers prioritizing walkability to the village core',
    ],
    locationMap: {
      center: [-117.188, 32.751],
      zoom: 14.2,
      boundary: [
        [-117.194, 32.755], [-117.182, 32.755], [-117.181, 32.748],
        [-117.187, 32.745], [-117.194, 32.747], [-117.194, 32.755],
      ],
      marker: [-117.188, 32.751],
    },
  },

  // ── WEST LEWIS STREET ────────────────────────────────────────────────────
  {
    name: 'West Lewis Street',
    titleFirst: 'West Lewis',
    titleRest: 'Street',
    parentName: 'Mission Hills',
    parentSlug: 'mission-hills-real-estate',
    slug: 'west-lewis-street',
    image: 'community-mission-hills.jpg',
    badge: 'Canyon Rim · Larger Lots',
    subtitle: 'Mission Hills · San Diego, California',
    priceRange: '$1.0M – $2.5M',
    tags: 'Larger Lots · Canyon Views · Quiet',
    heroStats: [
      { value: '$1.0M+', label: 'Starting Price' },
      { value: '70', label: 'Walk Score' },
      { value: '92103', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'West Lewis Street is a real, well-documented Mission Hills corridor and part of the locally designated Fort Stockton Line Historic District, which the City of San Diego recognized in 2007 for its concentration of homes tied to the 1910–1939 streetcar era. The western blocks of the street sit along a canyon rim, and multiple independent brokerage listings — spanning different agencies — describe homes there with panoramic and canyon-facing views, a consistent pattern that lends credibility to the street\'s "view corridor" reputation.',
      'West Lewis Street isn\'t uniform in character along its length. The western residential blocks are quieter and generally sit on larger parcels than much of Mission Hills, while the eastern stretch, closer to Goldfinch Street and India Street, blends into a small cluster of cafés and professional offices. Buyers drawn to this corridor are typically after the former: privacy, canyon exposure, and a sense of separation from the busier village core just a few blocks away.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Canyon-Rim Corridor' },
      { label: 'Parent Community', value: 'Mission Hills' },
      { label: 'ZIP Code', value: '92103' },
      { label: 'Architecture', value: 'Craftsman · Prairie · Spanish Revival' },
      { label: 'Price Range', value: '$1.0M – $2.5M' },
      { label: 'Historic Status', value: 'Fort Stockton Line District (2007)' },
    ],
    highlights: [
      {
        title: 'Canyon Rim Views',
        desc: 'Homes along the western blocks of West Lewis Street sit on a canyon rim, and listings from multiple independent brokerages consistently describe panoramic and canyon-facing views from this stretch — a well-documented pattern, not a one-off marketing claim.',
      },
      {
        title: 'Fort Stockton Line Historic District',
        desc: 'West Lewis Street forms part of the City of San Diego\'s locally designated Fort Stockton Line Historic District (2007), tied to the streetcar route that opened this stretch of Mission Hills to development starting in 1910.',
      },
      {
        title: 'Quiet, Larger-Parcel Blocks',
        desc: 'The western residential blocks trade the density of Mission Hills\' village core for more breathing room between homes — a quieter, more private feel that appeals to buyers who still want walkable access to the neighborhood\'s restaurants and shops.',
      },
      {
        title: 'Café Cluster to the East',
        desc: 'The street\'s eastern end, near Goldfinch and India Street, has its own small commercial pocket — including a neighborhood coffee shop — giving residents an easy walk to a second, quieter dining option beyond the main village strip.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=West+Lewis+Street&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=West+Lewis+Street&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'West Lewis Street', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'Urban condo lifestyle, walk score 97, bayfront living, and San Diego\'s most vibrant nightlife and dining 10 minutes south.' },
      { name: 'Bankers Hill', slug: 'bankers-hill-real-estate', from: '$700K', whyConsider: 'Mission Hills\' eastern neighbor — similarly historic but with more condo options and direct Balboa Park frontage.' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$800K', whyConsider: 'Peninsula living west of Mission Hills — scenic harbor views, ocean access, and a laid-back coastal character all its own.' },
    ],
    lifestyleBody: [
      'West Lewis Street appeals to buyers who want Mission Hills\' walkability and architectural pedigree without living directly on top of the village\'s busiest corner. The canyon-facing western blocks offer a genuine sense of retreat — morning coffee on a rear deck overlooking open space is a real, repeatable experience here, not just a listing photo.',
      'It\'s a corridor for buyers who value privacy and view exposure as much as historic character, and who don\'t mind a slightly longer walk to the village core in exchange for a quieter street.',
    ],
    lifestyleBullets: [
      'Buyers prioritizing canyon or view exposure',
      'Privacy-minded buyers wanting larger parcels',
      'Established professionals and move-up buyers',
      'Owners who want walkable access without direct village-core frontage',
      'Buyers drawn to Fort Stockton Line historic-district homes',
    ],
    locationMap: {
      center: [-117.199, 32.749],
      zoom: 14.2,
      boundary: [
        [-117.205, 32.753], [-117.193, 32.753], [-117.192, 32.746],
        [-117.198, 32.743], [-117.205, 32.745], [-117.205, 32.753],
      ],
      marker: [-117.199, 32.749],
    },
  },

  // ── MISSION HILLS TERRACE ────────────────────────────────────────────────
  {
    name: 'Mission Hills Terrace',
    titleFirst: 'Mission Hills',
    titleRest: 'Terrace',
    parentName: 'Mission Hills',
    parentSlug: 'mission-hills-real-estate',
    slug: 'mission-hills-terrace',
    image: 'community-mission-hills.jpg',
    badge: 'Hillside · Established',
    subtitle: 'Mission Hills · San Diego, California',
    priceRange: '$950K – $2M',
    tags: 'Hillside · Downtown Bay Views · Established',
    heroStats: [
      { value: '$950K+', label: 'Starting Price' },
      { value: '70', label: 'Walk Score' },
      { value: '92103', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Mission Hills sits on a ridge overlooking Old Town, Mission Valley, and San Diego Bay — a documented topographic fact, not a marketing claim — and Mission Hills Terrace is the name used for the neighborhood\'s hillside blocks where that elevation translates into real view exposure. The terrain here generally slopes toward the west and south, opening view corridors toward the bay, Point Loma, and the downtown skyline from select lots.',
      'This is one of Mission Hills\' more established pockets, with a housing stock that reflects decades of ownership continuity alongside the neighborhood\'s usual mix of Craftsman and Spanish Revival influence. Because view exposure varies significantly lot to lot on a hillside, buyers here should expect a wider price range driven by orientation and elevation as much as square footage.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Hillside Residential' },
      { label: 'Parent Community', value: 'Mission Hills' },
      { label: 'ZIP Code', value: '92103' },
      { label: 'Architecture', value: 'Craftsman · Spanish Revival' },
      { label: 'Price Range', value: '$950K – $2M' },
      { label: 'Terrain', value: 'West/Southwest-Facing Hillside' },
    ],
    highlights: [
      {
        title: 'Ridge-Top Position',
        desc: 'Mission Hills occupies a genuine ridge above Old Town and Mission Valley, and Mission Hills Terrace sits on the portion of that ridge where the hillside slopes most dramatically toward the west and south.',
      },
      {
        title: 'View-Oriented Lots',
        desc: 'Select properties on the western-facing slope open toward the bay, Point Loma, and the downtown skyline — view exposure that varies meaningfully by exact lot and elevation, which is part of what drives this pocket\'s wide price range.',
      },
      {
        title: 'Established Ownership',
        desc: 'This pocket skews toward longer-tenured owners and a settled, low-turnover feel — a quieter counterpart to the more transactional blocks closer to the village core.',
      },
      {
        title: 'Sunset-Facing Streets',
        desc: 'The westward slope means many streets here are naturally oriented toward evening light, a quality residents frequently cite as part of the neighborhood\'s appeal.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Mission+Hills+Terrace&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Mission+Hills+Terrace&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Mission Hills Terrace', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'Urban condo lifestyle, walk score 97, bayfront living, and San Diego\'s most vibrant nightlife and dining 10 minutes south.' },
      { name: 'Bankers Hill', slug: 'bankers-hill-real-estate', from: '$700K', whyConsider: 'Mission Hills\' eastern neighbor — similarly historic but with more condo options and direct Balboa Park frontage.' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$800K', whyConsider: 'Peninsula living west of Mission Hills — scenic harbor views, ocean access, and a laid-back coastal character all its own.' },
    ],
    lifestyleBody: [
      'Mission Hills Terrace suits buyers who want elevation and exposure as part of daily life — a deck oriented toward the sunset, a kitchen window that frames a slice of the bay, evenings that end with the downtown skyline lighting up below.',
      'It\'s an established pocket rather than a discovery — many owners have been here for years, and the pace reflects that settled character. Buyers should expect to shop carefully lot by lot, since view exposure (and price) shifts quickly across even adjacent parcels.',
    ],
    lifestyleBullets: [
      'View-motivated buyers',
      'Established professionals and move-up buyers',
      'Long-term owners seeking a settled, low-turnover street',
      'Buyers comfortable evaluating hillside lots individually',
      'Sunset and skyline enthusiasts',
    ],
    locationMap: {
      center: [-117.196, 32.741],
      zoom: 14.2,
      boundary: [
        [-117.202, 32.745], [-117.190, 32.745], [-117.189, 32.738],
        [-117.195, 32.735], [-117.202, 32.737], [-117.202, 32.745],
      ],
      marker: [-117.196, 32.741],
    },
  },

  // ── GOLDFINCH STREET AREA ────────────────────────────────────────────────
  {
    name: 'Goldfinch Street Area',
    titleFirst: 'Goldfinch Street',
    titleRest: 'Area',
    parentName: 'Mission Hills',
    parentSlug: 'mission-hills-real-estate',
    slug: 'goldfinch-street-area',
    image: 'community-mission-hills.jpg',
    badge: 'Village Core · Walk to Everything',
    subtitle: 'Mission Hills · San Diego, California',
    priceRange: '$1.0M – $2.2M',
    tags: 'Walk to Village · Dining · Coffee',
    heroStats: [
      { value: '$1.0M+', label: 'Starting Price' },
      { value: '70', label: 'Walk Score' },
      { value: '92103', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'The Goldfinch Street Area is Mission Hills\' commercial and social hub — the walkable village core where Goldfinch Street meets West Washington Street. This is genuinely one of San Diego\'s more walkable pockets outside Downtown, earning a documented Walk Score of 70 ("Very Walkable") and ranking among the city\'s more pedestrian-friendly neighborhoods.',
      'Homes here put residents within a short walk of a real, current mix of independent restaurants and cafés — Cardellino, Komatsuya, Lefty\'s Chicago Pizzeria, The Huddle, and coffee shops including Heartwork Coffee and Meshuggah Shack on Goldfinch itself, plus Farmer\'s Bottega, Jo\'s Mission Hills Diner, Harley Gray Kitchen & Bar, and Lamplighter just around the corner on Washington Street. For buyers who want to run daily errands on foot, this is the most convenient pocket in Mission Hills.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Village Commercial Core' },
      { label: 'Parent Community', value: 'Mission Hills' },
      { label: 'ZIP Code', value: '92103' },
      { label: 'Architecture', value: 'Craftsman · Mixed-Use' },
      { label: 'Price Range', value: '$1.0M – $2.2M' },
      { label: 'Walk Score', value: '70 (Very Walkable)' },
    ],
    highlights: [
      {
        title: 'Mission Hills\' Main Street',
        desc: 'Goldfinch Street and West Washington Street form the neighborhood\'s genuine commercial spine — an eclectic, walkable strip of independent restaurants, cafés, and shops that predates the chain-restaurant era and gives Mission Hills its "real neighborhood" identity.',
      },
      {
        title: 'A Documented Walk Score of 70',
        desc: 'Walk Score rates this area 70 out of 100 — "Very Walkable" — a verified, independently sourced figure that reflects genuine day-to-day walkability rather than a marketing estimate.',
      },
      {
        title: 'Real, Current Local Businesses',
        desc: 'Cardellino, Komatsuya, Lefty\'s Chicago Pizzeria, The Huddle, Heartwork Coffee, and Meshuggah Shack anchor Goldfinch Street itself, with Farmer\'s Bottega, Jo\'s Mission Hills Diner, Harley Gray Kitchen & Bar, and Lamplighter a block away on Washington Street.',
      },
      {
        title: 'Mixed-Use Density',
        desc: 'Several multi-unit mixed-use buildings sit at the Goldfinch/Washington corner, giving this pocket a denser, more urban-village feel than the surrounding residential streets.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Goldfinch+Street+Area&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Goldfinch+Street+Area&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Goldfinch Street Area', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'Urban condo lifestyle, walk score 97, bayfront living, and San Diego\'s most vibrant nightlife and dining 10 minutes south.' },
      { name: 'Bankers Hill', slug: 'bankers-hill-real-estate', from: '$700K', whyConsider: 'Mission Hills\' eastern neighbor — similarly historic but with more condo options and direct Balboa Park frontage.' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$800K', whyConsider: 'Peninsula living west of Mission Hills — scenic harbor views, ocean access, and a laid-back coastal character all its own.' },
    ],
    lifestyleBody: [
      'This is Mission Hills for people who want the neighborhood\'s charm on tap every day — a five-minute walk to coffee, another five to dinner, no car required. Weekend mornings often start at one of the Goldfinch Street cafés and drift into an afternoon of browsing the handful of independent shops along Washington Street.',
      'It suits buyers who prioritize daily convenience and street life over a quiet cul-de-sac — the tradeoff being a bit more foot and car traffic in exchange for the shortest possible walk to everything the neighborhood has to offer.',
    ],
    lifestyleBullets: [
      'Buyers who want to walk to dinner every night',
      'Coffee-shop regulars and café culture enthusiasts',
      'Empty-nesters downsizing from a larger, car-dependent home',
      'Buyers who prioritize convenience over quiet',
      'Small-business owners and remote workers who want a walkable café office',
    ],
    locationMap: {
      center: [-117.190, 32.749],
      zoom: 14.4,
      boundary: [
        [-117.194, 32.752], [-117.186, 32.752], [-117.185, 32.746],
        [-117.190, 32.744], [-117.194, 32.746], [-117.194, 32.752],
      ],
      marker: [-117.190, 32.749],
    },
  },

  // ── PARK WEST ────────────────────────────────────────────────────────────
  {
    name: 'Park West',
    titleFirst: 'Park',
    titleRest: 'West',
    parentName: 'Mission Hills',
    parentSlug: 'mission-hills-real-estate',
    slug: 'park-west',
    image: 'community-mission-hills.jpg',
    badge: 'Bankers Hill Adjacent · Eclectic',
    subtitle: 'Mission Hills · San Diego, California',
    priceRange: '$850K – $1.5M',
    tags: 'Bankers Hill Adjacent · Eclectic · Value',
    heroStats: [
      { value: '$850K+', label: 'Starting Price' },
      { value: '70', label: 'Walk Score' },
      { value: '92103', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Park West sits on Mission Hills\' southeastern flank, where the neighborhood borders Bankers Hill — a district the City of San Diego officially names "Bankers Hill/Park West" on its own community planning materials. This pocket of Mission Hills is best understood as the transitional edge between the two neighborhoods: it carries Mission Hills\' address and character while sharing an eclectic, walkable energy with its Bankers Hill neighbor just across the boundary.',
      'Because it sits at that seam, Park West tends to offer a more accessible price point than Mission Hills\' historic core, with a housing mix that blends Craftsman-era single-family homes with the smaller apartment and condo buildings more typical of Bankers Hill. It\'s a genuine value pocket for buyers who want proximity to both neighborhoods\' amenities.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Transitional Border Pocket' },
      { label: 'Parent Community', value: 'Mission Hills' },
      { label: 'ZIP Code', value: '92103' },
      { label: 'Architecture', value: 'Craftsman · Small Multi-Family' },
      { label: 'Price Range', value: '$850K – $1.5M' },
      { label: 'Adjacent District', value: 'Bankers Hill / Park West' },
    ],
    highlights: [
      {
        title: 'Borders Bankers Hill/Park West',
        desc: 'This pocket sits directly against the district the City of San Diego formally designates "Bankers Hill/Park West" — giving residents easy access to Bankers Hill\'s restaurants and Balboa Park frontage in addition to everything Mission Hills offers.',
      },
      {
        title: 'Eclectic Housing Mix',
        desc: 'Unlike Mission Hills\' more uniformly Craftsman blocks, this edge pocket blends single-family bungalows with smaller apartment and condo buildings, giving it a more varied streetscape and a wider range of entry price points.',
      },
      {
        title: 'Value Within Mission Hills',
        desc: 'Price points here generally run below the neighborhood\'s historic core, making this one of the more accessible ways to buy into Mission Hills while staying close to Balboa Park and Downtown.',
      },
      {
        title: 'Balboa Park Proximity',
        desc: 'Balboa Park sits roughly a mile to the east via Bankers Hill — close enough for a regular walk or short drive, without living directly on the park\'s busiest frontage.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Park+West+Mission+Hills&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Park+West&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Park West', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'Urban condo lifestyle, walk score 97, bayfront living, and San Diego\'s most vibrant nightlife and dining 10 minutes south.' },
      { name: 'Bankers Hill', slug: 'bankers-hill-real-estate', from: '$700K', whyConsider: 'Mission Hills\' eastern neighbor — similarly historic but with more condo options and direct Balboa Park frontage.' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$800K', whyConsider: 'Peninsula living west of Mission Hills — scenic harbor views, ocean access, and a laid-back coastal character all its own.' },
    ],
    lifestyleBody: [
      'Park West suits buyers who want a foot in both worlds — Mission Hills\' historic residential calm and Bankers Hill\'s livelier, more urban edge, both within a short walk. It\'s a practical choice for buyers priced out of the historic core who still want the Mission Hills name and address.',
      'The eclectic mix of housing stock means less architectural uniformity than elsewhere in the neighborhood, but that variety is part of the appeal for buyers who want character without a strict historic-district price premium.',
    ],
    lifestyleBullets: [
      'Value-conscious buyers wanting a Mission Hills address',
      'Buyers who want easy access to both Mission Hills and Bankers Hill',
      'First-time buyers and small households',
      'Buyers open to condo or small multi-family options',
      'Balboa Park regulars',
    ],
    locationMap: {
      center: [-117.172, 32.740],
      zoom: 14.2,
      boundary: [
        [-117.178, 32.744], [-117.166, 32.744], [-117.163, 32.738],
        [-117.169, 32.734], [-117.176, 32.735], [-117.178, 32.744],
      ],
      marker: [-117.172, 32.740],
    },
  },

  // ── OLD TOWN ADJACENT ────────────────────────────────────────────────────
  {
    name: 'Old Town Adjacent',
    titleFirst: 'Old Town',
    titleRest: 'Adjacent',
    parentName: 'Mission Hills',
    parentSlug: 'mission-hills-real-estate',
    slug: 'old-town-adjacent',
    image: 'community-mission-hills.jpg',
    badge: 'Southern Edge · Historic Park',
    subtitle: 'Mission Hills · San Diego, California',
    priceRange: '$800K – $1.6M',
    tags: 'Southern Edge · Historic Park · Family',
    heroStats: [
      { value: '$800K+', label: 'Starting Price' },
      { value: '70', label: 'Walk Score' },
      { value: '92103', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Old Town Adjacent is Mission Hills\' southwestern edge, where the neighborhood\'s residential streets give way to Presidio Park and, just beyond it, Old Town San Diego State Historic Park — the site of California\'s first European settlement in 1769. Presidio Park itself, more than 1,500 acres including the Junípero Serra Museum, sits directly between the two neighborhoods and is a five-minute walk or drive from this pocket of Mission Hills.',
      'This edge tends to draw families and buyers who want easy access to genuinely unique open space — hiking trails, sweeping views over Mission Valley and the Pacific from Presidio Park, and the museums, restaurants, and annual festivals (including Día de los Muertos each October) down in Old Town itself.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Southern Residential Edge' },
      { label: 'Parent Community', value: 'Mission Hills' },
      { label: 'ZIP Code', value: '92103' },
      { label: 'Architecture', value: 'Craftsman · Spanish Revival' },
      { label: 'Price Range', value: '$800K – $1.6M' },
      { label: 'Adjacent Landmark', value: 'Presidio Park (1,500+ Acres)' },
    ],
    highlights: [
      {
        title: 'Presidio Park at the Doorstep',
        desc: 'Presidio Park — over 1,500 acres, home to the Junípero Serra Museum and considered the birthplace of California — sits directly adjacent to this pocket, offering hiking trails and sweeping views a five-minute walk from home.',
      },
      {
        title: 'Old Town San Diego State Historic Park',
        desc: 'Just beyond Presidio Park, Old Town preserves California\'s first European settlement (1769) with living-history demonstrations, adobe buildings, restaurants, and annual events including the Día de los Muertos festival each October.',
      },
      {
        title: 'Family-Oriented Streets',
        desc: 'This edge of Mission Hills tends toward a quieter, more family-oriented character, with easy access to open space that\'s rare to find this close to a major urban core.',
      },
      {
        title: 'Easy Regional Access',
        desc: 'Proximity to Old Town\'s transit hub (trolley connections to Downtown and Mission Valley) and nearby freeway access make this edge convenient for commuters despite its quieter residential feel.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Old+Town+Adjacent+Mission+Hills&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Old+Town+Adjacent&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Old Town Adjacent', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'Urban condo lifestyle, walk score 97, bayfront living, and San Diego\'s most vibrant nightlife and dining 10 minutes south.' },
      { name: 'Bankers Hill', slug: 'bankers-hill-real-estate', from: '$700K', whyConsider: 'Mission Hills\' eastern neighbor — similarly historic but with more condo options and direct Balboa Park frontage.' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$800K', whyConsider: 'Peninsula living west of Mission Hills — scenic harbor views, ocean access, and a laid-back coastal character all its own.' },
    ],
    lifestyleBody: [
      'This pocket suits families and buyers who want Mission Hills\' walkable village and historic character balanced against genuine, expansive open space next door. Weekend routines often include a walk through Presidio Park before breakfast in Old Town, or an evening stroll to catch the sunset over Mission Valley.',
      'It\'s a quieter, more residential edge of the neighborhood — less about the village\'s café culture and more about proximity to trails, museums, and the kind of open space that\'s genuinely rare this close to Downtown.',
    ],
    lifestyleBullets: [
      'Families seeking proximity to parks and open space',
      'Hikers and outdoor enthusiasts',
      'Buyers who want a quieter, more residential Mission Hills edge',
      'History enthusiasts drawn to Old Town and Presidio Park',
      'Commuters who value nearby trolley and freeway access',
    ],
    locationMap: {
      center: [-117.203, 32.744],
      zoom: 14.2,
      boundary: [
        [-117.209, 32.748], [-117.197, 32.748], [-117.196, 32.740],
        [-117.202, 32.737], [-117.209, 32.739], [-117.209, 32.748],
      ],
      marker: [-117.203, 32.744],
    },
  },

  // ── FORT STOCKTON DRIVE ──────────────────────────────────────────────────
  {
    name: 'Fort Stockton Drive',
    titleFirst: 'Fort Stockton',
    titleRest: 'Drive',
    parentName: 'Mission Hills',
    parentSlug: 'mission-hills-real-estate',
    slug: 'fort-stockton-drive',
    image: 'community-mission-hills.jpg',
    badge: 'Premier Street · Most Preserved',
    subtitle: 'Mission Hills · San Diego, California',
    priceRange: '$1.1M – $2.8M',
    tags: 'Premier Street · Most Preserved · Victorian',
    heroStats: [
      { value: '$1.1M+', label: 'Starting Price' },
      { value: '70', label: 'Walk Score' },
      { value: '92103', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Fort Stockton Drive is Mission Hills\' most storied street — the namesake and spine of the locally designated Fort Stockton Line Historic District, approved by the City of San Diego on July 16, 2007. The street traces the route of the San Diego Electric Railway\'s Line 3, the "Fort Stockton Line" streetcar that operated from 1910 to 1939 and first opened this ridge to residential development.',
      'The official historic district record credits a roster of noted architects and builders — including Requa and Jackson, Nathan Rigdon, Martin Melhorn, Alexander Schreiber, and Henry Lang — with the corridor\'s Craftsman, Prairie-style, and Spanish/Mission Revival homes. It remains one of Mission Hills\' most architecturally intact and sought-after addresses, commanding some of the neighborhood\'s highest prices for fully restored properties.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Premier Historic Street' },
      { label: 'Parent Community', value: 'Mission Hills' },
      { label: 'ZIP Code', value: '92103' },
      { label: 'Architecture', value: 'Craftsman · Prairie · Spanish/Mission Revival' },
      { label: 'Price Range', value: '$1.1M – $2.8M' },
      { label: 'Historic Status', value: 'Fort Stockton Line District (Designated 2007)' },
    ],
    highlights: [
      {
        title: 'The Fort Stockton Line Streetcar',
        desc: 'Fort Stockton Drive traces the route of the San Diego Electric Railway\'s Line 3, which operated from 1910 to 1939 and first opened this stretch of Mission Hills to residential development — the corridor\'s defining historical fact.',
      },
      {
        title: 'Locally Designated Historic District',
        desc: 'The City of San Diego designated the Fort Stockton Line Historic District on July 16, 2007, with a period of architectural significance spanning 1910–1939 and named architects and builders including Requa and Jackson, Nathan Rigdon, and Martin Melhorn.',
      },
      {
        title: 'Mission Hills Nursery',
        desc: 'Kate Sessions founded Mission Hills Nursery on Fort Stockton Drive in 1910 — still operating today, more than a century later, as a living link to the street\'s earliest years.',
      },
      {
        title: 'The Neighborhood\'s Most Preserved Address',
        desc: 'With some of Mission Hills\' most architecturally intact Craftsman, Prairie, and Spanish Revival homes, Fort Stockton Drive commands premium prices and is often the first street buyers ask about when they say they want "the real Mission Hills."',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Fort+Stockton+Drive&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Fort+Stockton+Drive&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Fort Stockton Drive', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'Urban condo lifestyle, walk score 97, bayfront living, and San Diego\'s most vibrant nightlife and dining 10 minutes south.' },
      { name: 'Bankers Hill', slug: 'bankers-hill-real-estate', from: '$700K', whyConsider: 'Mission Hills\' eastern neighbor — similarly historic but with more condo options and direct Balboa Park frontage.' },
      { name: 'Point Loma', slug: 'point-loma-real-estate', from: '$800K', whyConsider: 'Peninsula living west of Mission Hills — scenic harbor views, ocean access, and a laid-back coastal character all its own.' },
    ],
    lifestyleBody: [
      'Fort Stockton Drive is for buyers who want to own a piece of documented San Diego history — a fully restored Craftsman or Spanish Revival home on the street that literally built Mission Hills, a short walk from a nursery that has operated continuously since 1910.',
      'It\'s the neighborhood\'s aspirational address: architecturally uncompromising, tightly held, and priced accordingly. Buyers here tend to be preservation-committed and willing to pay a premium for a documented historic pedigree.',
    ],
    lifestyleBullets: [
      'Preservation-committed buyers seeking premier historic homes',
      'Architecture enthusiasts and collectors',
      'Buyers who want San Diego\'s most documented streetcar-era street',
      'Move-up buyers targeting Mission Hills\' top price tier',
      'Long-term holders focused on irreplaceable, low-inventory streets',
    ],
    locationMap: {
      center: [-117.186, 32.752],
      zoom: 14.4,
      boundary: [
        [-117.198, 32.754], [-117.174, 32.754], [-117.174, 32.750],
        [-117.198, 32.750], [-117.198, 32.754],
      ],
      marker: [-117.186, 32.752],
    },
  },

  // ── POINT LOMA HEIGHTS ───────────────────────────────────────────────────
  {
    name: 'Point Loma Heights',
    titleFirst: 'Point Loma',
    titleRest: 'Heights',
    parentName: 'Point Loma',
    parentSlug: 'point-loma-real-estate',
    slug: 'point-loma-heights',
    image: 'community-point-loma.jpg',
    badge: 'Harbor Views · Central Point Loma',
    subtitle: 'Point Loma · San Diego, California',
    priceRange: '$900K – $1.6M',
    tags: 'Harbor Views · Craftsman · Central',
    heroStats: [
      { value: '$900K+', label: 'Starting Price' },
      { value: '68', label: 'Walk Score' },
      { value: '92107', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Point Loma Heights is an officially recognized neighborhood in the City of San Diego\'s Peninsula Community Plan, sitting in the central-northern part of the Point Loma peninsula — bounded by Froude Street to the west, Point Loma Avenue and Chatsworth Boulevard to the south, Nimitz Boulevard to the east, and Midway Drive and the San Diego River to the north. It borders Ocean Beach to the west, Sunset Cliffs and Roseville-Fleetridge to the south, Loma Portal to the east, and the Midway/Mission Bay Park area to the north.',
      'Within its own boundaries, the community plan further subdivides Point Loma Heights into four smaller pockets — Loma Palisades, Loma Alta, Point Loma Highlands, and Ocean Beach Highlands. Major streets include Catalina Boulevard, Nimitz Boulevard, Narragansett Avenue, and Voltaire Street, with everyday commercial corridors along West Point Loma Boulevard and Voltaire Street putting coffee, dining, and errands within easy reach.',
      'Housing here ranges from older single-family homes near the Ocean Beach border to multi-family buildings closer to Midway, giving buyers a wider mix of price points and property types than some of Point Loma\'s more uniformly single-family pockets.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Central Residential Neighborhood' },
      { label: 'Parent Community', value: 'Point Loma' },
      { label: 'ZIP Code', value: '92107' },
      { label: 'Sub-Pockets', value: 'Loma Palisades · Loma Alta · Highlands' },
      { label: 'Price Range', value: '$900K – $1.6M' },
      { label: 'Housing Mix', value: 'Single-Family · Multi-Family' },
    ],
    highlights: [
      {
        title: 'An Officially Recognized Neighborhood',
        desc: 'Point Loma Heights is named and mapped in the City of San Diego\'s Peninsula Community Plan — a documented, planning-recognized boundary rather than an informal marketing label.',
      },
      {
        title: 'Four Sub-Pockets in One',
        desc: 'The community plan further divides Point Loma Heights into Loma Palisades, Loma Alta, Point Loma Highlands, and Ocean Beach Highlands, each with its own subtle character within the larger neighborhood.',
      },
      {
        title: 'Central Peninsula Position',
        desc: 'Sitting between Ocean Beach and Loma Portal, this neighborhood puts residents within easy reach of the beach, the bay, and Point Loma\'s other enclaves without committing to either extreme.',
      },
      {
        title: 'Everyday Commercial Corridors',
        desc: 'Voltaire Street and West Point Loma Boulevard give residents walkable access to coffee shops, restaurants, and daily errands without a drive to Newport Avenue or Liberty Station.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Point+Loma+Heights&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Point+Loma+Heights&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Point Loma Heights', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'The urban core just 10 minutes away — condos, lofts, and bayfront living with Walk Score 97 and a world-class restaurant scene.' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic Craftsman bungalows and a charming village core — the quieter, tree-lined alternative just north of Old Town with strong architectural character.' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island resort living across the bay — the iconic Hotel del Coronado, a world-famous beach, and an intimate small-town feel minutes from downtown.' },
    ],
    lifestyleBody: [
      'Point Loma Heights suits buyers who want a genuine foothold in Point Loma without picking a side — close enough to walk to Ocean Beach on a Saturday morning, close enough to Loma Portal for a family-friendly evening stroll, and close enough to Midway for a quick freeway on-ramp when it\'s time to head across town.',
      'It\'s a practical, lived-in neighborhood rather than a postcard — real errands get run on Voltaire Street, real neighbors know each other on the residential blocks, and the mix of housing stock means there\'s genuinely something here for a range of budgets within Point Loma.',
    ],
    lifestyleBullets: [
      'Buyers who want a central Point Loma location',
      'First-time Point Loma buyers seeking a range of price points',
      'Renters and buyers of multi-family housing near Midway',
      'Families who want proximity to both Ocean Beach and Loma Portal',
      'Commuters who value quick freeway access',
    ],
    locationMap: {
      center: [-117.246, 32.762],
      zoom: 13.6,
      boundary: [
        [-117.256, 32.768], [-117.238, 32.768], [-117.236, 32.756],
        [-117.248, 32.752], [-117.256, 32.756], [-117.256, 32.768],
      ],
      marker: [-117.246, 32.762],
    },
  },

  // ── LA PLAYA ─────────────────────────────────────────────────────────────
  {
    name: 'La Playa',
    titleFirst: 'La',
    titleRest: 'Playa',
    parentName: 'Point Loma',
    parentSlug: 'point-loma-real-estate',
    slug: 'la-playa',
    image: 'community-point-loma.jpg',
    badge: 'Bayfront · Yacht Club Row',
    subtitle: 'Point Loma · San Diego, California',
    priceRange: '$1.2M – $3.5M+',
    tags: 'Bayfront · Luxury Estates · Yacht Access',
    heroStats: [
      { value: '$1.2M+', label: 'Starting Price' },
      { value: '68', label: 'Walk Score' },
      { value: '92106', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'La Playa — Spanish for "the beach" — is one of San Diego\'s oldest and most historically significant neighborhoods, sitting directly on San Diego Bay and bordered by Naval Base Point Loma to the south, the Wooded Area to the west, Roseville-Fleetridge to the north, and Shelter Island across a narrow channel to the east. European use of the site dates to April 1, 1769, when the Spanish packet San Antonio arrived as part of the Serra-Portolá expedition — a landing traditionally cited as occurring near present-day Ballast Point, alongside Juan Rodríguez Cabrillo\'s earlier 1542 arrival.',
      'The La Playa Trail, described as the oldest commercial trail in the western United States, once connected this anchorage to Mission San Diego de Alcalá. During the Mexican era, roughly 800 residents lived here, centered on cattle-hide processing for Boston trading ships, and La Playa remained San Diego\'s principal port until the 1870s. The site earned California Historical Landmark status (#61) in 1932 and recognition from San Diego\'s Historical Resources Board in 1970.',
      'Today, La Playa is anchored by a row of storied yacht clubs — the San Diego Yacht Club (founded 1886, at its current location since 1924, three-time America\'s Cup winner), the Southwestern Yacht Club (formed 1925), and the La Playa Yacht Club (founded in the early 1930s) — and counts among San Diego\'s most valuable residential real estate, with many bayfront homes offering private dock access.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Historic Bayfront Enclave' },
      { label: 'Parent Community', value: 'Point Loma' },
      { label: 'ZIP Code', value: '92106' },
      { label: 'Historic Status', value: 'California Historical Landmark #61' },
      { label: 'Price Range', value: '$1.2M – $3.5M+' },
      { label: 'Yacht Clubs', value: 'SDYC · Southwestern · La Playa' },
    ],
    highlights: [
      {
        title: 'San Diego\'s Original Harbor',
        desc: 'European use dates to 1769, and La Playa served as San Diego\'s principal port until the 1870s — a history recognized with California Historical Landmark status (#61) since 1932.',
      },
      {
        title: 'The La Playa Trail',
        desc: 'Once the oldest commercial trail in the western United States, connecting this bayside anchorage to Mission San Diego de Alcalá — a documented piece of California\'s earliest colonial-era infrastructure.',
      },
      {
        title: 'Yacht Club Row',
        desc: 'Three historic yacht clubs anchor the waterfront: the San Diego Yacht Club (1886, a three-time America\'s Cup winner), the Southwestern Yacht Club (1925), and the La Playa Yacht Club (early 1930s).',
      },
      {
        title: 'Bayfront Estate Living',
        desc: 'Among San Diego\'s most valuable residential real estate, with many homes along the water offering private dock access — a rare combination of historic pedigree and boating convenience.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=La+Playa&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=La+Playa&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'La Playa', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'The urban core just 10 minutes away — condos, lofts, and bayfront living with Walk Score 97 and a world-class restaurant scene.' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic Craftsman bungalows and a charming village core — the quieter, tree-lined alternative just north of Old Town with strong architectural character.' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island resort living across the bay — the iconic Hotel del Coronado, a world-famous beach, and an intimate small-town feel minutes from downtown.' },
    ],
    lifestyleBody: [
      'La Playa is for buyers who want to live inside San Diego\'s maritime history — mornings on a private dock, afternoons at the yacht club, evenings watching the sun set over the bay from a bluff that\'s been continuously inhabited since 1769.',
      'It\'s a quiet, established, and deeply rooted community rather than a discovery — many families have owned here for generations, and the pace reflects a neighborhood that has never needed to chase trends to justify its place in San Diego\'s story.',
    ],
    lifestyleBullets: [
      'Boating and sailing enthusiasts',
      'Buyers seeking historic pedigree alongside bayfront luxury',
      'Yacht club members and prospective members',
      'History enthusiasts drawn to San Diego\'s founding-era sites',
      'Multi-generational and long-term ownership families',
    ],
    locationMap: {
      center: [-117.228, 32.702],
      zoom: 13.8,
      boundary: [
        [-117.236, 32.708], [-117.220, 32.708], [-117.218, 32.696],
        [-117.228, 32.692], [-117.236, 32.696], [-117.236, 32.708],
      ],
      marker: [-117.228, 32.702],
    },
  },

  // ── SHELTER ISLAND ───────────────────────────────────────────────────────
  {
    name: 'Shelter Island',
    titleFirst: 'Shelter',
    titleRest: 'Island',
    parentName: 'Point Loma',
    parentSlug: 'point-loma-real-estate',
    slug: 'shelter-island',
    image: 'community-point-loma.jpg',
    badge: 'Marina District · Resort Living',
    subtitle: 'Point Loma · San Diego, California',
    priceRange: '$700K – $2.5M+',
    tags: 'Marina · Waterfront · Resort Lifestyle',
    heroStats: [
      { value: '$700K+', label: 'Starting Price' },
      { value: '68', label: 'Walk Score' },
      { value: '92106', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Shelter Island is a genuinely man-made peninsula — originally a sandbar visible only at low tide, built up using bay-dredging spoils starting in 1934 and further raised with material from Navy channel-deepening projects during World War II. In the early 1950s, the San Diego Harbor Commission developed it in earnest: a yacht basin was dredged, a deep-water channel cut, and a causeway built connecting it to the Point Loma mainland. Today it stretches roughly 1.2 miles along a single road, Shelter Island Drive, with all development following a city-mandated Polynesian architectural theme.',
      'The island\'s best-known landmark is the Yokohama Friendship Bell, a gift from the city of Yokohama, Japan presented in 1958 to mark San Diego\'s first sister-city relationship, with the bell first rung on December 10, 1960. Nearby, the Bali Hai restaurant occupies a 1953 building that has served as a tiki dining destination since 1954 — one of the oldest classic mid-century tiki restaurants still operating anywhere. Shoreline Park is also home to the Tunaman\'s Memorial, a 1988 bronze sculpture honoring the Italian, Japanese, Portuguese, and Slavic fishermen who built San Diego\'s historic tuna fleet.',
      'Two long-running resort hotels anchor the marina district: the Kona Kai Resort & Spa and Humphreys Half Moon Inn & Suites, home to the well-known Humphreys Concerts by the Bay outdoor summer concert series. Three historic yacht clubs — Silvergate, San Diego, and Southwestern — also maintain facilities on or near the island.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Man-Made Marina Peninsula' },
      { label: 'Parent Community', value: 'Point Loma' },
      { label: 'ZIP Code', value: '92106' },
      { label: 'Architecture', value: 'Mid-Century Polynesian Overlay' },
      { label: 'Price Range', value: '$700K – $2.5M+' },
      { label: 'Built', value: 'Dredged 1934 – Early 1950s' },
    ],
    highlights: [
      {
        title: 'Built From the Bay Itself',
        desc: 'Shelter Island began as a tidal sandbar, built up with dredging spoils starting in 1934 and further developed by the Harbor Commission in the early 1950s — a genuinely engineered piece of San Diego\'s waterfront.',
      },
      {
        title: 'The Yokohama Friendship Bell',
        desc: 'A 1958 gift from Yokohama, Japan marking San Diego\'s first-ever sister-city relationship, first rung on December 10, 1960 — a landmark that still anchors the island\'s identity.',
      },
      {
        title: 'Bali Hai Restaurant',
        desc: 'Housed in a 1953 building and serving as a tiki dining destination since 1954, Bali Hai is one of the longest continuously operating classic tiki restaurants anywhere.',
      },
      {
        title: 'Humphreys Concerts by the Bay',
        desc: 'The outdoor venue at Humphreys Half Moon Inn hosts a well-known summer concert series each June through September, drawing visitors from across the county.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Shelter+Island&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Shelter+Island&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Shelter Island', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'The urban core just 10 minutes away — condos, lofts, and bayfront living with Walk Score 97 and a world-class restaurant scene.' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic Craftsman bungalows and a charming village core — the quieter, tree-lined alternative just north of Old Town with strong architectural character.' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island resort living across the bay — the iconic Hotel del Coronado, a world-famous beach, and an intimate small-town feel minutes from downtown.' },
    ],
    lifestyleBody: [
      'Shelter Island suits buyers who want resort living as a daily backdrop — a marina view from the kitchen window, a summer concert within walking distance, and a genuine sense of being on vacation without leaving home.',
      'It\'s a small, self-contained district with a distinct architectural identity, appealing to boating enthusiasts and buyers who want waterfront character without the historic weight of neighboring La Playa.',
    ],
    lifestyleBullets: [
      'Boating and yacht club enthusiasts',
      'Buyers who want resort-style waterfront living',
      'Fans of Humphreys Concerts by the Bay and the summer events calendar',
      'Buyers drawn to distinctive mid-century architecture',
      'Second-home and vacation-style buyers',
    ],
    locationMap: {
      center: [-117.220, 32.714],
      zoom: 14.0,
      boundary: [
        [-117.226, 32.720], [-117.213, 32.720], [-117.212, 32.709],
        [-117.219, 32.706], [-117.226, 32.709], [-117.226, 32.720],
      ],
      marker: [-117.220, 32.714],
    },
  },

  // ── LIBERTY STATION ──────────────────────────────────────────────────────
  {
    name: 'Liberty Station',
    titleFirst: 'Liberty',
    titleRest: 'Station',
    parentName: 'Point Loma',
    parentSlug: 'point-loma-real-estate',
    slug: 'liberty-station',
    image: 'community-point-loma.jpg',
    badge: 'Arts District · Adaptive Reuse',
    subtitle: 'Point Loma · San Diego, California',
    priceRange: '$800K – $1.4M',
    tags: 'Arts District · Modern · Community',
    heroStats: [
      { value: '$800K+', label: 'Starting Price' },
      { value: '68', label: 'Walk Score' },
      { value: '92106', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Liberty Station is the redevelopment of the former Naval Training Center San Diego, dedicated on October 27, 1923 and renamed NTC in 1944 after additional schools were added. At its wartime peak in 1942, the base trained 33,000 personnel at once, and over its full operating life more than 1.75 million recruits passed through. The federal Base Realignment and Closure commission ordered its closure in 1993, with a formal closure ceremony held on March 21, 1997.',
      'The City Council adopted a final reuse plan in October 1998, and renovation of the historic buildings began in earnest around 2002 — more than 50 buildings have been restored and repurposed since, with Phase Two (15 buildings) completing in November 2012. The Joan, a new performing arts theater, opened in September 2025 as the 56th renovated building, a sign the district continues to evolve.',
      'Today, Liberty Station spans roughly 360 acres and includes Liberty Public Market — a 25,000-square-foot food hall with 30+ vendors inside a converted 1921 military building — alongside the Arts District Liberty Station, a creative campus of galleries, studios, and nonprofits. Established anchors include Stone Brewing, Trader Joe\'s, Vons, and the High Tech High school network.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Redeveloped Naval Training Center' },
      { label: 'Parent Community', value: 'Point Loma' },
      { label: 'ZIP Code', value: '92106' },
      { label: 'Architecture', value: 'Historic Military · Modern Infill' },
      { label: 'Price Range', value: '$800K – $1.4M' },
      { label: 'Footprint', value: 'Roughly 360 Acres' },
    ],
    highlights: [
      {
        title: 'A Century of History',
        desc: 'From its 1923 dedication as a Naval Training Station through its 1997 closure ceremony to The Joan theater\'s 2025 opening, Liberty Station has spent over a hundred years evolving — first for the Navy, now for the community.',
      },
      {
        title: 'Liberty Public Market',
        desc: 'A 25,000-square-foot food hall with 30+ vendors housed inside a converted 1921 military building — one of San Diego\'s most popular food-hall destinations.',
      },
      {
        title: 'Arts District Liberty Station',
        desc: 'A creative campus of galleries, artist studios, and nonprofit spaces gives this district a cultural density unlike anywhere else in Point Loma.',
      },
      {
        title: 'Established Modern Anchors',
        desc: 'Stone Brewing, Trader Joe\'s, Vons, and the High Tech High school network give residents genuine day-to-day convenience alongside the district\'s historic character.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Liberty+Station&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Liberty+Station&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Liberty Station', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'The urban core just 10 minutes away — condos, lofts, and bayfront living with Walk Score 97 and a world-class restaurant scene.' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic Craftsman bungalows and a charming village core — the quieter, tree-lined alternative just north of Old Town with strong architectural character.' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island resort living across the bay — the iconic Hotel del Coronado, a world-famous beach, and an intimate small-town feel minutes from downtown.' },
    ],
    lifestyleBody: [
      'Liberty Station suits buyers who want a walkable, planned community built around genuine adaptive-reuse architecture — Saturday mornings at Liberty Public Market, an evening gallery walk through the Arts District, a concert or event on the waterfront promenade.',
      'It\'s one of the more modern-feeling pockets of Point Loma despite its century-old bones, appealing to buyers who want community amenities and walkability without sacrificing the historic character the rest of the peninsula is known for.',
    ],
    lifestyleBullets: [
      'Buyers who want walkable, planned-community living',
      'Foodies and Liberty Public Market regulars',
      'Arts and culture enthusiasts',
      'Families drawn to High Tech High and nearby schools',
      'Buyers who appreciate adaptive-reuse architecture',
    ],
    locationMap: {
      center: [-117.214, 32.742],
      zoom: 13.8,
      boundary: [
        [-117.221, 32.748], [-117.208, 32.748], [-117.206, 32.736],
        [-117.216, 32.732], [-117.221, 32.736], [-117.221, 32.748],
      ],
      marker: [-117.214, 32.742],
    },
  },

  // ── LOMA PORTAL ──────────────────────────────────────────────────────────
  {
    name: 'Loma Portal',
    titleFirst: 'Loma',
    titleRest: 'Portal',
    parentName: 'Point Loma',
    parentSlug: 'point-loma-real-estate',
    slug: 'loma-portal',
    image: 'community-point-loma.jpg',
    badge: 'Tree-Lined · Family Favorite',
    subtitle: 'Point Loma · San Diego, California',
    priceRange: '$900K – $1.5M',
    tags: 'Tree-Lined · Family · Quiet',
    heroStats: [
      { value: '$900K+', label: 'Starting Price' },
      { value: '68', label: 'Walk Score' },
      { value: '92106', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Loma Portal is an officially recognized Point Loma neighborhood, occupying a hilly area northwest of Rosecrans Street and northeast of Nimitz Boulevard, overlooking San Diego Bay. Its major streets include Rosecrans Street, Chatsworth Boulevard, and Catalina Boulevard, and it\'s known for a distinctive local quirk: its east-west residential streets are named alphabetically after literary figures, running from Addison to Zola, as documented in the 2014 book Reading Between the Lampposts.',
      'The neighborhood\'s architecture — largely Spanish Revival and Tudor-style homes built from the early 1900s through the 1940s — sits on tree-lined streets that have earned Loma Portal a long-standing reputation as one of Point Loma\'s most family-oriented pockets. Loma Portal Elementary, built in 1914 at 3341 Browning Street after resident George Burnham lobbied for a neighborhood school, still serves the community today and won a California Distinguished School award in 2010.',
      'Local gathering spots include Plumosa Park, a 1.4-acre park known for its annual Christmas Eve luminaria lighting, and the Hervey Point Loma Branch Library, which opened in 2003. Residents also share a local nickname — "the Point Loma Pause" — for the brief lull in conversation when a jet passes overhead on approach to nearby San Diego International Airport.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Family Residential Neighborhood' },
      { label: 'Parent Community', value: 'Point Loma' },
      { label: 'ZIP Code', value: '92106' },
      { label: 'Architecture', value: 'Spanish Revival · Tudor' },
      { label: 'Price Range', value: '$900K – $1.5M' },
      { label: 'Elementary School', value: 'Loma Portal (Est. 1914)' },
    ],
    highlights: [
      {
        title: 'Streets Named for Authors',
        desc: 'Loma Portal\'s east-west streets run alphabetically through literary figures, from Addison to Zola — a documented local naming convention that gives the neighborhood a distinct identity.',
      },
      {
        title: 'Loma Portal Elementary Since 1914',
        desc: 'Built after a resident-led campaign for a neighborhood school, Loma Portal Elementary still serves the community today and earned a California Distinguished School award in 2010.',
      },
      {
        title: 'Plumosa Park\'s Christmas Eve Tradition',
        desc: 'This 1.4-acre neighborhood park hosts an annual Christmas Eve luminaria lighting that has become a beloved local tradition.',
      },
      {
        title: 'Tree-Lined, Family-Oriented Streets',
        desc: 'Spanish Revival and Tudor homes from the early 1900s through the 1940s line quiet, tree-canopied streets that have long made Loma Portal a favorite for families.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Loma+Portal&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Loma+Portal&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Loma Portal', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'The urban core just 10 minutes away — condos, lofts, and bayfront living with Walk Score 97 and a world-class restaurant scene.' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic Craftsman bungalows and a charming village core — the quieter, tree-lined alternative just north of Old Town with strong architectural character.' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island resort living across the bay — the iconic Hotel del Coronado, a world-famous beach, and an intimate small-town feel minutes from downtown.' },
    ],
    lifestyleBody: [
      'Loma Portal is for buyers who want Point Loma\'s coastal proximity wrapped in a genuinely family-first neighborhood — walking kids to a century-old elementary school, gathering at Plumosa Park on Christmas Eve, and knowing the names of half the block.',
      'It\'s one of the more traditionally residential corners of Point Loma, with a settled, multi-generational feel that appeals to buyers looking for stability and community over a beach-town buzz.',
    ],
    lifestyleBullets: [
      'Families with school-age children',
      'Buyers seeking tree-lined, quiet residential streets',
      'Long-term owners who value neighborhood tradition',
      'Buyers who want bay-adjacent living without direct waterfront pricing',
      'Commuters who value proximity to the airport and Rosecrans corridor',
    ],
    locationMap: {
      center: [-117.222, 32.760],
      zoom: 13.8,
      boundary: [
        [-117.230, 32.766], [-117.214, 32.766], [-117.212, 32.754],
        [-117.222, 32.750], [-117.230, 32.754], [-117.230, 32.766],
      ],
      marker: [-117.222, 32.760],
    },
  },

  // ── OCEAN BEACH ──────────────────────────────────────────────────────────
  {
    name: 'Ocean Beach',
    titleFirst: 'Ocean',
    titleRest: 'Beach',
    parentName: 'Point Loma',
    parentSlug: 'point-loma-real-estate',
    slug: 'ocean-beach',
    image: 'community-point-loma.jpg',
    badge: 'Eclectic Beach Town',
    subtitle: 'Point Loma · San Diego, California',
    priceRange: '$800K – $1.3M',
    tags: 'Eclectic · Beach Town · The OB Pier',
    heroStats: [
      { value: '$800K+', label: 'Starting Price' },
      { value: '68', label: 'Walk Score' },
      { value: '92107', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Ocean Beach — known locally as "OB" — was founded in 1887 by developers on land previously used by the Kumeyaay people as a fishing encampment called Hapai. Surfing is credited with arriving here as early as 1916, and OB hosted the 1966 World Surfing Championship, won by Nat Young. The neighborhood embraced a countercultural identity through the 1960s and 70s, earning the nickname "the Haight-Ashbury of San Diego" and a community motto — "Keep OB Weird" — that still holds today.',
      'The Ocean Beach Pier opened July 2, 1966 at 1,971 feet, making it the longest concrete pier in the world at the time. It has been closed to the public since October 2023 due to storm damage, and the City of San Diego has determined a full replacement — estimated at $170–190 million — is the path forward rather than repair; no reopening date has been set as of this writing. Newport Avenue remains OB\'s commercial heart, anchored by Hodad\'s, a burger institution open since 1969 that gained national attention on Diners, Drive-Ins and Dives.',
      'Ocean Beach is also home to Dog Beach, established in 1972 as one of the first officially designated leash-free beaches in the United States, and hosts a Wednesday farmers market on the 4900 block of Newport Avenue that has run for more than three decades.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Beach Town' },
      { label: 'Parent Community', value: 'Point Loma' },
      { label: 'ZIP Code', value: '92107' },
      { label: 'Architecture', value: 'Craftsman Bungalow · Beach Cottage' },
      { label: 'Price Range', value: '$800K – $1.3M' },
      { label: 'Founded', value: '1887' },
    ],
    highlights: [
      {
        title: '"Keep OB Weird"',
        desc: 'Ocean Beach\'s countercultural identity, forged in the 1960s and 70s, is still very much alive today — a genuine, unpolished beach-town character that\'s rare on the California coast.',
      },
      {
        title: 'Hodad\'s Since 1969',
        desc: 'This Newport Avenue burger institution gained national fame on Diners, Drive-Ins and Dives and remains one of San Diego\'s most beloved and enduring local businesses.',
      },
      {
        title: 'Dog Beach, Established 1972',
        desc: 'One of the first officially designated leash-free beaches in the United States, Dog Beach draws residents and visitors from across the county to its quarter-mile stretch of sand.',
      },
      {
        title: 'The Historic OB Pier',
        desc: 'Opened in 1966 as the world\'s longest concrete pier, the OB Pier is currently closed to the public following storm damage, with the city pursuing a full replacement rather than repair — a status worth knowing for anyone considering the neighborhood today.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Ocean+Beach&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Ocean+Beach&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Ocean Beach', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'The urban core just 10 minutes away — condos, lofts, and bayfront living with Walk Score 97 and a world-class restaurant scene.' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic Craftsman bungalows and a charming village core — the quieter, tree-lined alternative just north of Old Town with strong architectural character.' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island resort living across the bay — the iconic Hotel del Coronado, a world-famous beach, and an intimate small-town feel minutes from downtown.' },
    ],
    lifestyleBody: [
      'Ocean Beach suits buyers who want the real, unpolished version of California beach life — a walk to Dog Beach with the family dog, a Wednesday evening at the farmers market, a Hodad\'s burger that tastes the same as it did decades ago.',
      'It\'s a tight-knit, independent-minded community that has actively resisted chain retail and homogenization, appealing to buyers who want genuine local character over a manicured coastal aesthetic.',
    ],
    lifestyleBullets: [
      'Surfers and beach-lifestyle buyers',
      'Dog owners drawn to Dog Beach',
      'Buyers who value independent, non-chain local character',
      'Renters and buyers seeking classic beach-cottage charm',
      'Community-minded buyers who want a walkable town center',
    ],
    locationMap: {
      center: [-117.253, 32.748],
      zoom: 13.8,
      boundary: [
        [-117.262, 32.754], [-117.246, 32.754], [-117.244, 32.742],
        [-117.254, 32.738], [-117.262, 32.742], [-117.262, 32.754],
      ],
      marker: [-117.253, 32.748],
    },
  },

  // ── SUNSET CLIFFS ────────────────────────────────────────────────────────
  {
    name: 'Sunset Cliffs',
    titleFirst: 'Sunset',
    titleRest: 'Cliffs',
    parentName: 'Point Loma',
    parentSlug: 'point-loma-real-estate',
    slug: 'sunset-cliffs',
    image: 'community-point-loma.jpg',
    badge: 'Dramatic Ocean Views',
    subtitle: 'Point Loma · San Diego, California',
    priceRange: '$950K – $2M+',
    tags: 'Ocean Views · Surfer Culture · Dramatic',
    heroStats: [
      { value: '$950K+', label: 'Starting Price' },
      { value: '68', label: 'Walk Score' },
      { value: '92107', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Sunset Cliffs takes its name from Sunset Cliffs Natural Park, a genuinely dramatic 68-acre city park combining an 18-acre stretch of coastal bluffs — between Adair and Ladera streets — with a 50-acre hillside section designated as a multiple-species conservation area. The park\'s sandstone bluffs, sea arches, and sea caves have made it one of San Diego\'s most photographed natural landmarks, with three main viewing areas along Ladera Street, Luscomb Point, and Osprey Street, and seasonal views of migrating gray whales.',
      'The park is intentionally undeveloped — there are no restroom facilities at any of the main viewing areas — and the coastline here is subject to real, ongoing erosion. Bluff collapses have occurred as recently as this year, and the City of San Diego has proposed a $32 million seawall project to address the issue, though as of this writing it remains a proposal facing community discussion rather than a completed structure. Residential streets above the cliffs reflect a mix of eras, from early Spanish Revival cottages to contemporary view-oriented rebuilds.',
      'Sunset Cliffs has also long been recognized as one of San Diego\'s premier surf breaks, drawing wave-riders to its point breaks and reef setups for generations.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Coastal Bluff Neighborhood' },
      { label: 'Parent Community', value: 'Point Loma' },
      { label: 'ZIP Code', value: '92107' },
      { label: 'Architecture', value: 'Spanish Revival · Contemporary Coastal' },
      { label: 'Price Range', value: '$950K – $2M+' },
      { label: 'Adjacent Park', value: 'Sunset Cliffs Natural Park (68 Acres)' },
    ],
    highlights: [
      {
        title: 'Sunset Cliffs Natural Park',
        desc: 'A 68-acre park of sandstone bluffs, sea arches, and sea caves along the Pacific — one of San Diego\'s most striking and photographed natural landscapes, with seasonal gray whale sightings from its clifftop viewpoints.',
      },
      {
        title: 'A Legendary Surf Break',
        desc: 'Generations of surfers have made the pilgrimage to Sunset Cliffs\' point breaks and reef setups, cementing its reputation as one of San Diego\'s premier surf spots.',
      },
      {
        title: 'A Living, Undeveloped Coastline',
        desc: 'With no restroom facilities and an active, documented erosion problem, Sunset Cliffs remains a genuinely natural park rather than a manicured tourist attraction — a quality residents value even as the city studies solutions.',
      },
      {
        title: 'Dramatic View Homes',
        desc: 'Residential streets above the bluffs are oriented toward some of San Diego\'s most striking sunset views, spanning architectural eras from early Spanish Revival cottages to contemporary rebuilds.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Sunset+Cliffs&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Sunset+Cliffs&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Sunset Cliffs', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'The urban core just 10 minutes away — condos, lofts, and bayfront living with Walk Score 97 and a world-class restaurant scene.' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic Craftsman bungalows and a charming village core — the quieter, tree-lined alternative just north of Old Town with strong architectural character.' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island resort living across the bay — the iconic Hotel del Coronado, a world-famous beach, and an intimate small-town feel minutes from downtown.' },
    ],
    lifestyleBody: [
      'Sunset Cliffs is for buyers who want to wake up to the Pacific in its rawest form — dramatic bluffs instead of a manicured boardwalk, a surf check instead of a commute, an evening ritual of watching the sun drop into the ocean from the same cliffs generations of San Diegans have gathered on.',
      'It rewards buyers who value natural drama over polish, and who understand that living on an actively eroding coastline is part of the deal — the same forces that carved the sea caves and arches continue to shape the bluffs today.',
    ],
    lifestyleBullets: [
      'Surfers and ocean-lifestyle buyers',
      'Buyers seeking dramatic, view-oriented properties',
      'Nature enthusiasts who prefer undeveloped coastline',
      'Sunset-watchers and photography enthusiasts',
      'Buyers comfortable with the realities of coastal bluff living',
    ],
    locationMap: {
      center: [-117.258, 32.726],
      zoom: 13.8,
      boundary: [
        [-117.267, 32.732], [-117.250, 32.732], [-117.248, 32.720],
        [-117.259, 32.716], [-117.267, 32.720], [-117.267, 32.732],
      ],
      marker: [-117.258, 32.726],
    },
  },

  // ── WOODED AREA ──────────────────────────────────────────────────────────
  {
    name: 'Wooded Area',
    titleFirst: 'Wooded',
    titleRest: 'Area',
    parentName: 'Point Loma',
    parentSlug: 'point-loma-real-estate',
    slug: 'wooded-area',
    image: 'community-point-loma.jpg',
    badge: 'Established · Tree Canopy',
    subtitle: 'Point Loma · San Diego, California',
    priceRange: '$950K – $1.8M',
    tags: 'Residential · Mature Trees · Established',
    heroStats: [
      { value: '$950K+', label: 'Starting Price' },
      { value: '68', label: 'Walk Score' },
      { value: '92106', label: 'ZIP Code' },
      { value: 'Daily', label: 'Updated' },
    ],
    overview: [
      'Wooded Area is an officially named neighborhood in the City of San Diego\'s Peninsula Community Plan — occupying a hilltop area south of Talbot Street on both sides of Catalina Boulevard, bordered by Naval Base Point Loma to the south, La Playa to the east, Roseville-Fleetridge to the north, and Sunset Cliffs and Point Loma Nazarene University to the west. Its name comes honestly: 19th-century author Richard Henry Dana Jr. described this headland as "well-wooded" in the 1830s, though later logging stripped much of that original vegetation.',
      'The tree canopy that defines the neighborhood today is credited to Katherine Tingley\'s Theosophical Society community, "Lomaland," which arrived around 1900 and systematically replanted eucalyptus and avocado trees across the western slopes. One notable remnant of that era, the 1912 Rosecroft estate — once home to the multi-acre Rosecroft Begonia Gardens tourist attraction before it closed in the 1960s — is listed on the National Register of Historic Places.',
      'Today, Wooded Area remains almost entirely residential, with large lot sizes, some streets without sidewalks, and a semi-rural feel that distinguishes it from the denser pockets of Point Loma closer to the beach — an established, quiet character that has attracted prominent local families over the decades.',
    ],
    quickFacts: [
      { label: 'Type', value: 'Officially Named Residential Enclave' },
      { label: 'Parent Community', value: 'Point Loma' },
      { label: 'ZIP Code', value: '92106' },
      { label: 'Architecture', value: 'Custom Estate' },
      { label: 'Price Range', value: '$950K – $1.8M' },
      { label: 'Historic Landmark', value: 'Rosecroft (NRHP-Listed, 1912)' },
    ],
    highlights: [
      {
        title: 'An Officially Named Neighborhood',
        desc: 'Wooded Area is recognized in the City of San Diego\'s Peninsula Community Plan — a documented boundary, not an informal label, despite its lesser-known name.',
      },
      {
        title: 'Replanted by Lomaland',
        desc: 'The tree canopy that gives this neighborhood its name traces back to Katherine Tingley\'s Theosophical Society community, which replanted eucalyptus and avocado trees across the hillside starting around 1900.',
      },
      {
        title: 'The Rosecroft Estate',
        desc: 'This 1912 estate, once home to the multi-acre Rosecroft Begonia Gardens tourist attraction, is listed on the National Register of Historic Places — a tangible link to the neighborhood\'s early 20th-century character.',
      },
      {
        title: 'Large Lots, Semi-Rural Feel',
        desc: 'Some streets here still lack sidewalks, and generous lot sizes give Wooded Area a quieter, more spread-out character than Point Loma\'s denser coastal pockets.',
      },
    ],
    ylopoSearch:
      'https://search.palisaderealty.com/search?q=Wooded+Area&s%5BorderBy%5D=sourceCreationDate%2Cdesc&s%5Bpage%5D=1&s%5Blocations%5D%5B0%5D%5Bneighborhood%5D=Wooded+Area&s%5Blocations%5D%5B0%5D%5Bstate%5D=CA&s%5Blocations%5D%5B0%5D%5Bcity%5D=San+Diego',
    ylopoLocations: [{ neighborhood: 'Wooded Area', city: 'San Diego', state: 'CA' }],
    nearbyCommunities: [
      { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate', from: '$450K', whyConsider: 'The urban core just 10 minutes away — condos, lofts, and bayfront living with Walk Score 97 and a world-class restaurant scene.' },
      { name: 'Mission Hills', slug: 'mission-hills-real-estate', from: '$900K', whyConsider: 'Historic Craftsman bungalows and a charming village core — the quieter, tree-lined alternative just north of Old Town with strong architectural character.' },
      { name: 'Coronado', slug: 'coronado-real-estate', from: '$1.4M', whyConsider: 'Island resort living across the bay — the iconic Hotel del Coronado, a world-famous beach, and an intimate small-town feel minutes from downtown.' },
    ],
    lifestyleBody: [
      'Wooded Area suits buyers who want space and privacy within Point Loma — generous lots, mature tree cover, and a hilltop setting that feels a world away from the beach crowds, while still being minutes from everything the peninsula offers.',
      'It\'s one of Point Loma\'s quieter, more established corners, appealing to buyers who value a semi-rural feel and long-term neighborhood continuity over walkable density.',
    ],
    lifestyleBullets: [
      'Buyers seeking privacy and larger lots',
      'Families who want a quiet, semi-rural setting',
      'History enthusiasts drawn to the Rosecroft estate',
      'Buyers who value mature tree canopy and shade',
      'Long-term owners seeking an established, low-turnover street',
    ],
    locationMap: {
      center: [-117.238, 32.696],
      zoom: 13.8,
      boundary: [
        [-117.246, 32.702], [-117.230, 32.702], [-117.228, 32.690],
        [-117.238, 32.686], [-117.246, 32.690], [-117.246, 32.702],
      ],
      marker: [-117.238, 32.696],
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

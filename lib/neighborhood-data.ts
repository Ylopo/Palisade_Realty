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
]

export function getNeighborhoodBySlug(communitySlug: string, neighborhoodSlug: string): NeighborhoodData | undefined {
  return NEIGHBORHOODS.find((n) => n.parentSlug === communitySlug && n.slug === neighborhoodSlug)
}

export function getAllNeighborhoodParams(): Array<{ slug: string; neighborhood: string }> {
  return NEIGHBORHOODS.map((n) => ({ slug: n.parentSlug, neighborhood: n.slug }))
}

export default NEIGHBORHOODS

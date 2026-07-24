export interface FeaturedProperty {
  slug: string
  address: string
  city: string
  state: string
  status: string
  hasDetailPage: boolean
  listedBy: { agent: string; agents?: string[]; brokerage: string }
  zip: string
  mls: string
  price: number
  priceDisplay: string
  beds: number
  baths: number
  sqft: number
  lotSize?: string
  yearBuilt: number
  neighborhood?: string
  communitySlug?: string
  tagline?: string
  description: string
  ylopoDetailUrl: string
  features?: string[]
  heroImage: string
  gallery: string[]
  lat?: number
  lng?: number
}

const PROPERTIES: FeaturedProperty[] = [
  {
    slug: 'la-jolla-prospect',
    address: '888 W E Street 3006',
    city: 'San Diego',
    state: 'CA',
    status: 'active',
    hasDetailPage: true,
    listedBy: { agents: ['Hedda Parashos', 'Tom Parashos'], agent: 'Hedda Parashos', brokerage: 'Palisade Realty' },
    zip: '92101',
    mls: 'PTP2605178',
    price: 2195000,
    priceDisplay: '$2,195,000',
    beds: 2,
    baths: 2,
    sqft: 1390,
    lotSize: '6,534 sq ft',
    yearBuilt: 2018,
    neighborhood: 'La Jolla Village',
    communitySlug: 'la-jolla',
    tagline: 'A coastal contemporary masterpiece steps from La Jolla Cove, with sweeping Pacific views and refined interiors.',
    description: 'Experience unparalleled prestige at Pacific Gate, San Diego\'s iconic waterfront luxury tower. This stunning residence offers coastline views from one of the highest points of downtown San Diego. Sweeping views and sophisticated living in the heart of the Embarcadero. Indulge in world-class amenities: a private 45\' yacht (Pacific Dream), resort-style pool and spa, state-of-the-art fitness center, dog recreation area with 24/7 concierge. All of what is still a small part of what is offered at Pacific Gate. 3006 is particularly special. Providing waterfront views and beautiful city skylines coming alive as the sun sets. All visible right from the comfort of your living room. Turn your weekend getaway into your everyday. Concerned about having enough space for your vehicles? This unit is one of the very few with 4 assigned parking spots. Park your weekend toys and dailies with space to spare for guests. Explore outside your new home with Embarcadero, Little Italy, Gaslamp, and the USS Midway all within walking distance.',
    ylopoDetailUrl: 'https://search.palisaderealty.com/search/detail/267019441',
    features: [
      'Panoramic Pacific Ocean views',
      'Chef\'s kitchen with Thermador appliances and quartzite counters',
      'Primary suite with private ocean-view deck',
      'Resort-style pool and built-in outdoor kitchen',
      'Three-car attached garage with EV charging',
      'Solar array with battery backup',
      'Smart home system (lighting, climate, security)',
      'Walking distance to La Jolla Cove and Village',
    ],
    heroImage: 'https://d25fhp1qfwqa2h.cloudfront.net/650feddc55433161124b239fba3a198a,1783629899000_auto_650?phid=19467825129',
    gallery: [
      'https://d25fhp1qfwqa2h.cloudfront.net/650feddc55433161124b239fba3a198a,1783629899000_auto_650?phid=19467825129',
      'https://d25fhp1qfwqa2h.cloudfront.net/100d963f8e43d1941bada9ba75c3b15b,1783629899000_auto_650?phid=19467825130',
      'https://d25fhp1qfwqa2h.cloudfront.net/0c9a40bb33a4b414a372d75b23048ce2,1783629899000_auto_650?phid=19467825131',
      'https://d25fhp1qfwqa2h.cloudfront.net/59bf89317c077630c4c7bcb4472ac90b,1783629899000_auto_650?phid=19467825132',
      'https://d25fhp1qfwqa2h.cloudfront.net/ec4b7327b7bfa686f940c903cb7b5425,1783629899000_auto_650?phid=19467825133',
      'https://d25fhp1qfwqa2h.cloudfront.net/82e5ecb25141eb8a9f2cd54eeaebbac9,1783629899000_auto_650?phid=19467825134',
    ],
  },
  {
    slug: 'coronado-ocean',
    address: '5151 Hastings Road',
    city: 'San Diego',
    state: 'CA',
    status: 'active',
    hasDetailPage: true,
    listedBy: { agent: 'Hedda Parashos', brokerage: 'Palisade Realty' },
    zip: '92116',
    mls: '260015512',
    price: 1849000,
    priceDisplay: '$1,849,000',
    beds: 3,
    baths: 2,
    sqft: 1538,
    lotSize: '7,840 sq ft',
    yearBuilt: 1928,
    neighborhood: 'Coronado Village',
    communitySlug: 'coronado',
    lat: 32.7552,
    lng: -117.0993,
    tagline: 'A rare beachside estate on one of Coronado Island\'s most prestigious streets, with white-water views and resort-caliber amenities.',
    description: 'Kensington Classic Spanish! Extraordinarily well kept and updated single story Hacienda in the middle of Kensington and well north of Adams Avenue. Significant upgrades including paid solar, remodeled kitchen and baths and a striking fireplace! Formal living and dining rooms, breakfast nook and a private rear garden with second fireplace, ideal for entertaining! Detached two car garage. All on a private corner lot!',
    ylopoDetailUrl: 'https://search.palisaderealty.com/search/detail/266368236?s[locations][0][city]=San%20Diego&s[locations][0][state]=CA',
    features: [
      'Direct beach access and white-water Pacific views',
      'Professional-grade kitchen with La Cornue range',
      'Heated saltwater pool and outdoor fire pit',
      'Primary suite with dedicated ocean-view deck',
      'Home theater and temperature-controlled wine room',
      'Four-car garage with car-lift capability',
      'Lutron whole-home smart lighting and AV',
      'Two blocks from Hotel del Coronado',
    ],
    heroImage: 'https://d25fhp1qfwqa2h.cloudfront.net/ec8fb09cfed8dfac32315536ceb82095,1783536596000_auto_650?phid=19459864929',
    gallery: [
      'https://d25fhp1qfwqa2h.cloudfront.net/ec8fb09cfed8dfac32315536ceb82095,1783536596000_auto_650?phid=19459864929',
      'https://d25fhp1qfwqa2h.cloudfront.net/d0b01441bfb58080757a88c8b949f8d1,1783536596000_auto_650?phid=19459864930',
      'https://d25fhp1qfwqa2h.cloudfront.net/138998d194b5771606ae55925d455c72,1783536596000_auto_650?phid=19459864931',
      'https://d25fhp1qfwqa2h.cloudfront.net/37213d6a66a9e17c057f0e237caf382b,1783536596000_auto_650?phid=19459864932',
      'https://d25fhp1qfwqa2h.cloudfront.net/4bf1d6d7df3a21f760ee5b0de77c29a8,1783536596000_auto_650?phid=19459864933',
      'https://d25fhp1qfwqa2h.cloudfront.net/a71ba866f710f559a82bdc4ae6b5c989,1783536596000_auto_650?phid=19459864934',
    ],
  },
  {
    slug: 'san-diego-caminito-bautizo',
    address: '13051 Caminito Bautizo',
    city: 'San Diego',
    state: 'CA',
    status: 'active',
    hasDetailPage: true,
    listedBy: { agent: 'Hedda Parashos', brokerage: 'Palisade Realty' },
    zip: '92130',
    mls: '260016704SD',
    price: 1599000,
    priceDisplay: '$1,599,000',
    beds: 3,
    baths: 3,
    sqft: 1791,
    yearBuilt: 1997,
    communitySlug: 'carmel-valley',
    tagline: 'Move-in ready gated home in Carmel Valley near top-rated schools, minutes from Del Mar beaches.',
    description: 'Move in ready 3-bedroom, 2.5-bath home offering 1,791 sq ft in the gated Canyon Ridge in the heart of Carmel Valley. Situated near top-rated schools including Canyon Crest Academy and Torrey Pines High School. Ideally situated just minutes from the 5 and 56 freeways, you\'ll enjoy easy access throughout San Diego. Close proximity to Del Mar beaches, One Paseo, Del Mar Highlands. This move-in ready residence has been thoughtfully upgraded with BRAND-NEW flooring, new paint, new LowE windows, new washer and dryer, new refrigerator, new furnace, new dual electric/gas heating and cooling.',
    ylopoDetailUrl: 'https://search.palisaderealty.com/search/detail/266990563',
    features: [
      'Gated community — Canyon Ridge in Carmel Valley',
      'Brand-new flooring and LowE windows throughout',
      'New dual electric/gas HVAC system and furnace',
      'New washer, dryer, and refrigerator included',
      'Near Canyon Crest Academy and Torrey Pines High',
      'Minutes from Del Mar beaches and One Paseo',
      'Easy freeway access (I-5 and SR-56)',
      'No HOA special assessments',
    ],
    heroImage: 'https://d25fhp1qfwqa2h.cloudfront.net/7f83d5755647aab044cb38aff65a5541,1783611302000_auto_650?phid=19464289963',
    gallery: [
      'https://d25fhp1qfwqa2h.cloudfront.net/7f83d5755647aab044cb38aff65a5541,1783611302000_auto_650?phid=19464289963',
      'https://d25fhp1qfwqa2h.cloudfront.net/bbef05bcec0970e93d40e18b2b47e6b5,1783611302000_auto_650?phid=19464289964',
      'https://d25fhp1qfwqa2h.cloudfront.net/7e00ea4271680b45fa6425f681a42c0a,1783611302000_auto_650?phid=19464289965',
      'https://d25fhp1qfwqa2h.cloudfront.net/b430576af7e187a88babb9bba87883cd,1783611302000_auto_650?phid=19464289966',
      'https://d25fhp1qfwqa2h.cloudfront.net/1ca3e78b1639dd615547122e2ee4c23c,1783611302000_auto_650?phid=19464289967',
      'https://d25fhp1qfwqa2h.cloudfront.net/4b7488c9881437694f5fb31ca287c6f5,1783611302000_auto_650?phid=19464289968',
    ],
  },
  {
    slug: 'rancho-santa-fe-via',
    address: '1230 W Brookes Ave',
    city: 'San Diego',
    state: 'CA',
    status: 'active',
    hasDetailPage: true,
    listedBy: { agent: 'Hedda Parashos', brokerage: 'Palisade Realty' },
    zip: '92103',
    mls: '260015822',
    price: 2450000,
    priceDisplay: '$2,450,000',
    beds: 4,
    baths: 4,
    sqft: 2924,
    lotSize: '2.1 acres',
    yearBuilt: 2007,
    neighborhood: 'The Covenant',
    communitySlug: 'rancho-santa-fe',
    lat: 32.7438,
    lng: -117.1701,
    tagline: 'A private Covenant estate on 2.1 acres of lush grounds, blending Spanish Colonial architecture with contemporary luxury.',
    description: 'Exceptional custom craftsmanship meets modern luxury in one of San Diego\'s most coveted neighborhoods. Built in 2007 and extensively upgraded, this stunning 4-bedroom, 4-bath residence offers soaring ceilings, elegant travertine floors, multiple fireplaces, and a Viking chef\'s kitchen. The west-facing view deck becomes your private front-row seat to colorful sunsets, Fourth of July fireworks, and peaceful evenings with peek-a-boo bay views. Just blocks away, enjoy Pioneer Park\'s summer concerts, the neighborhood\'s beloved Fourth of July parade, festive Halloween celebrations, and year-round community events. Owned solar, no HOA or Mello-Roos.',
    ylopoDetailUrl: 'https://search.palisaderealty.com/search/detail/266554985',
    features: [
      'Private gated Covenant estate on 2.1 acres',
      'Spanish Colonial architecture with contemporary interiors',
      '60-inch La Canche range and professional prep kitchen',
      'Resort pool with grotto and outdoor kitchen',
      'Sport court and four-stall stable',
      'Primary wing with spa bath and private loggia',
      'Guest casita with full kitchen and private entrance',
      'Minutes from RSF Golf Club and Village shops',
    ],
    heroImage: 'https://d25fhp1qfwqa2h.cloudfront.net/b6471a44b76e2532334e1f6ba61643af,1783544695000_auto_650?phid=19460730774',
    gallery: [
      'https://d25fhp1qfwqa2h.cloudfront.net/b6471a44b76e2532334e1f6ba61643af,1783544695000_auto_650?phid=19460730774',
      'https://d25fhp1qfwqa2h.cloudfront.net/234bbcd403e372a77fef556b404cdc1a,1783544695000_auto_650?phid=19460730775',
      'https://d25fhp1qfwqa2h.cloudfront.net/37a4918f8f04a3dc5787e152c0e52c4c,1783544695000_auto_650?phid=19460730776',
      'https://d25fhp1qfwqa2h.cloudfront.net/c978d867449bac198d9547103198e1f4,1783544695000_auto_650?phid=19460730777',
      'https://d25fhp1qfwqa2h.cloudfront.net/ab5ddda4ee63c1807a0821ad19a48bd8,1783544695000_auto_650?phid=19460730778',
      'https://d25fhp1qfwqa2h.cloudfront.net/19528c5ff22e48952eb600ceb592988c,1783544695000_auto_650?phid=19460730779',
    ],
  },
  {
    slug: 'del-mar-stratford',
    address: '601 Stratford Ct',
    city: 'Del Mar',
    state: 'CA',
    status: 'active',
    hasDetailPage: true,
    listedBy: { agent: 'Hedda Parashos', brokerage: 'Palisade Realty' },
    zip: '92014',
    mls: 'NDP2606500',
    price: 3587000,
    priceDisplay: '$3,587,000',
    beds: 3,
    baths: 4,
    sqft: 2174,
    yearBuilt: 2012,
    communitySlug: 'del-mar',
    tagline: 'Gorgeous ocean view sunsets from this stunning two-story coastal retreat in the heart of Del Mar.',
    description: 'Enjoy Gorgeous ocean view sunsets from this stunning two-story coastal retreat in the heart of Del Mar. Featuring 3 bedrooms and 3.5 bathrooms, this beautiful home is ideally located near the Del Mar Village, world-renowned beaches, Torrey Pines Reserve, premier shopping and dining, and top-rated schools. The light-filled living room showcases spectacular ocean views and opens to an expansive deck, creating the perfect indoor-outdoor living experience. The gourmet kitchen and dining area also enjoy sweeping blue-water views and feature chef-quality appliances, a large center island, and elegant finishes. Rich wood flooring flows throughout the home, complemented by sophisticated stone and tile accents.',
    ylopoDetailUrl: 'https://search.palisaderealty.com/search/detail/266939983',
    features: [
      'Spectacular ocean views from main living areas',
      'Expansive deck for indoor-outdoor entertaining',
      'Gourmet kitchen with chef-quality appliances',
      'Large center island with elegant finishes',
      'Rich hardwood flooring throughout',
      'Near Del Mar Village and world-renowned beaches',
      'Walking distance to Torrey Pines Reserve',
      'Top-rated Del Mar schools',
    ],
    heroImage: 'https://d25fhp1qfwqa2h.cloudfront.net/31cae0f442690c27e7d2dfae983d40b2,1783555495000_auto_650?phid=19461717701',
    gallery: [
      'https://d25fhp1qfwqa2h.cloudfront.net/31cae0f442690c27e7d2dfae983d40b2,1783555495000_auto_650?phid=19461717701',
      'https://d25fhp1qfwqa2h.cloudfront.net/3e89fc23ea95844c8eaa22c8fb5a9bc5,1783555495000_auto_650?phid=19461717702',
      'https://d25fhp1qfwqa2h.cloudfront.net/3f3f549a7bd810adfbc9c8e45fe7934c,1783555495000_auto_650?phid=19461717703',
      'https://d25fhp1qfwqa2h.cloudfront.net/1eab43952240ff26d595db5e5d26a917,1783555495000_auto_650?phid=19461717704',
      'https://d25fhp1qfwqa2h.cloudfront.net/7db78ac9d0448ede10904013b7cd763e,1783555495000_auto_650?phid=19461717705',
      'https://d25fhp1qfwqa2h.cloudfront.net/4d05a1e2a474926342069264af7d7d50,1783555495000_auto_650?phid=19461717706',
    ],
  },
  {
    slug: 'del-mar-portofino',
    address: '13297 Portofino',
    city: 'Del Mar',
    state: 'CA',
    status: 'active',
    hasDetailPage: true,
    listedBy: { agent: 'Hedda Parashos', brokerage: 'Palisade Realty' },
    zip: '92014',
    mls: 'PW26138100',
    price: 3295000,
    priceDisplay: '$3,295,000',
    beds: 5,
    baths: 4,
    sqft: 3409,
    yearBuilt: 1980,
    communitySlug: 'del-mar',
    tagline: 'Masterfully renovated coastal sanctuary in prestigious Del Mar Heights — 5 bed, 4 bath with European oak floors and bi-fold glass doors.',
    description: 'Masterfully Renovated Coastal Sanctuary in Prestigious Del Mar Heights. This masterfully renovated 5-bedroom, 4-bath residence embodies elevated coastal luxury. Every detail has been thoughtfully renewed — new electrical panel, brand new roof, European white oak flooring, and smooth interior finishes. A striking oversized glass pivot front door creates a grand and welcoming entrance. The chef-inspired kitchen features premium Bosch appliances, a modern touchless sink, large center island, dedicated pantry with wine fridge, and a reverse osmosis water filtration system. Brand new bi-fold glass doors open dramatically to the backyard for true indoor-outdoor living.',
    ylopoDetailUrl: 'https://search.palisaderealty.com/search/detail/266366479',
    features: [
      'Complete renovation — new electrical, roof, plumbing',
      'European white oak hardwood floors throughout',
      'Oversized glass pivot front door',
      'Chef\'s kitchen with premium Bosch appliances',
      'Grand chandelier and warm fireplace',
      'Brand-new bi-fold glass doors to backyard',
      'Reverse osmosis water filtration system',
      'Premium finishes and millwork throughout',
    ],
    heroImage: 'https://d25fhp1qfwqa2h.cloudfront.net/67f6c8f13603bf4ffcd0e5b40c67e521,1783040695000_auto_650?phid=19437708979',
    gallery: [
      'https://d25fhp1qfwqa2h.cloudfront.net/67f6c8f13603bf4ffcd0e5b40c67e521,1783040695000_auto_650?phid=19437708979',
      'https://d25fhp1qfwqa2h.cloudfront.net/e44f10ed242de3fb2a41d694793754a0,1783040695000_auto_650?phid=19437708980',
      'https://d25fhp1qfwqa2h.cloudfront.net/599b068a5a20b326e83488ad8df72d6f,1783040695000_auto_650?phid=19437708981',
      'https://d25fhp1qfwqa2h.cloudfront.net/b3982d9d2740246f66f545a14e36e186,1783040695000_auto_650?phid=19437708982',
      'https://d25fhp1qfwqa2h.cloudfront.net/ec75ef867c2e305dae02bd8e72f3b456,1783040695000_auto_650?phid=19437708983',
      'https://d25fhp1qfwqa2h.cloudfront.net/b57a20ae134fdf3645da2548f99edcd6,1783040695000_auto_650?phid=19437708984',
    ],
  },
  {
    slug: 'del-mar-boquita',
    address: '13974 Boquita',
    city: 'Del Mar',
    state: 'CA',
    status: 'active',
    hasDetailPage: true,
    listedBy: { agent: 'Hedda Parashos', brokerage: 'Palisade Realty' },
    zip: '92014',
    mls: '260014005',
    price: 5495000,
    priceDisplay: '$5,495,000',
    beds: 5,
    baths: 5,
    sqft: 4300,
    yearBuilt: 1973,
    communitySlug: 'del-mar',
    tagline: 'A true work of art — masterfully reconstructed Del Mar Heights estate with a new pool, spa, and resort-style outdoor kitchen.',
    description: 'Perched in prestigious Del Mar Heights, this Masterfully reconstructed 5 bed, 5 bath residence of approximately 4,300 sq ft embodies elevated coastal luxury for the most discerning buyer. Every aspect has been thoughtfully renewed — new windows, plumbing, and electrical, to smooth interior/exterior paint and European white oak wood flooring. The sculptural chef\'s kitchen is anchored by Taj Mahal stone counters, massive island, white limestone wrapped pillars, custom millwork, and a suite of Wolf and Zline appliances. Walls of glass open to a resort-style backyard with a brand new pool, spa, porcelain pavers, and a fully equipped outdoor kitchen.',
    ylopoDetailUrl: 'https://search.palisaderealty.com/search/detail/265474195',
    features: [
      'Complete reconstruction — new windows, plumbing, electrical',
      'European white oak flooring throughout',
      'Chef\'s kitchen with Taj Mahal stone counters and Wolf appliances',
      'Brand new pool, spa, and porcelain pavers',
      'Fully equipped outdoor kitchen',
      'Multimedia lounge, private gym, and dry sauna',
      'Climate-controlled wine room',
      'Flexible lower level for complete formal ADU',
    ],
    heroImage: 'https://d25fhp1qfwqa2h.cloudfront.net/86b2d8cfdd162a87c9f3f8f0223a8a55,1782315900000_auto_650?phid=19390547330',
    gallery: [
      'https://d25fhp1qfwqa2h.cloudfront.net/86b2d8cfdd162a87c9f3f8f0223a8a55,1782315900000_auto_650?phid=19390547330',
      'https://d25fhp1qfwqa2h.cloudfront.net/6c6f0ab72a0408b878d9dfa296fdaf24,1782315900000_auto_650?phid=19390547331',
      'https://d25fhp1qfwqa2h.cloudfront.net/f2ab6f8f37a1b50e888a8a80e2dc0335,1782315900000_auto_650?phid=19390547332',
      'https://d25fhp1qfwqa2h.cloudfront.net/00214864ddbc59ffb31ffe7736c5940d,1782315900000_auto_650?phid=19390547333',
      'https://d25fhp1qfwqa2h.cloudfront.net/bf2f5904f062f0191864dda803a8c284,1782315900000_auto_650?phid=19390547334',
      'https://d25fhp1qfwqa2h.cloudfront.net/be5ad4a6514078c5718063471ad35943,1782315900000_auto_650?phid=19390547335',
    ],
  },
]

export function getAllPropertySlugs(): string[] {
  return PROPERTIES.map((p) => p.slug)
}

export function getPropertyBySlug(slug: string): FeaturedProperty | undefined {
  return PROPERTIES.find((p) => p.slug === slug)
}

export function getAllProperties(): FeaturedProperty[] {
  return PROPERTIES
}

export function getOtherProperties(slug: string): FeaturedProperty[] {
  return PROPERTIES.filter((p) => p.slug !== slug).slice(0, 4)
}

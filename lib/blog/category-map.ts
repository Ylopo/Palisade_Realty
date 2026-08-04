// Maps blogPost's real `category` values (content-machine taxonomy) to the
// 4 display buckets the marketing blog UI (BlogListing.tsx / blog.css) understands.
// Those buckets are hardcoded in blog.css filter/badge classes — do not add new ones
// without also updating that CSS.

export type DisplayBucket = 'Buyer' | 'Seller' | 'Homeowner' | 'General'

const CATEGORY_TO_BUCKET: Record<string, DisplayBucket> = {
  'buying-tips': 'Buyer',
  investment: 'Buyer',
  'selling-tips': 'Seller',
  'home-ownership': 'Homeowner',
  financing: 'Homeowner',
  'market-update': 'Homeowner',
  'community-development': 'Homeowner',
  'local-interest': 'Homeowner',
  'community-spotlight': 'General',
  news: 'General',
  events: 'General',
}

export function categoryToDisplayBucket(category: string): DisplayBucket {
  return CATEGORY_TO_BUCKET[category] ?? 'General'
}

import type { DisplayBucket } from './category-map'

export interface Pillar {
  slug: string
  title: string
  shortTitle: string
  eyebrow: string
  description: string
  categories: DisplayBucket[]
}

// Maps the site's existing Buyer/Seller/Homeowner/General blog categories onto
// a 3-pillar hub-and-spoke architecture, per findings/cluster.json from the SEO
// audit. General posts fold into Homeowner Resources rather than getting a 4th
// pillar, since it's a thin catch-all bucket (2 of 45 posts).
export const PILLARS: Pillar[] = [
  {
    slug: 'selling-in-san-diego',
    title: 'The Complete Guide to Selling a Home in San Diego County',
    shortTitle: 'Selling in San Diego',
    eyebrow: "Seller's Guide",
    description:
      'Everything you need to know about preparing, pricing, and closing the sale of a San Diego County home — from curb appeal and staging to negotiating a closing-date extension.',
    categories: ['Seller'],
  },
  {
    slug: 'buying-in-san-diego',
    title: 'The Complete Guide to Buying a Home in San Diego County',
    shortTitle: 'Buying in San Diego',
    eyebrow: "Buyer's Guide",
    description:
      'From budgeting and financing to home inspections and closing costs, this guide walks San Diego County buyers through every step of finding and purchasing a home.',
    categories: ['Buyer'],
  },
  {
    slug: 'homeowner-resources',
    title: 'San Diego Homeowner Resources',
    shortTitle: 'Homeowner Resources',
    eyebrow: "Homeowner's Guide",
    description:
      'Practical guidance for maintaining, improving, and settling into your San Diego County home — from HVAC upkeep to renovation safety and moving-day logistics.',
    categories: ['Homeowner', 'General'],
  },
]

export function getPillarBySlug(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug)
}

export function getPillarForCategory(category: DisplayBucket): Pillar {
  return PILLARS.find((p) => p.categories.includes(category)) ?? PILLARS[2]
}

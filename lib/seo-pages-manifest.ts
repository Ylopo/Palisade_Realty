/**
 * lib/seo-pages-manifest.ts
 *
 * The static SEO/AEO pages that exist on the site — AEO "best-*" landing
 * pages and the community/neighborhood pages. Blog posts are NOT here (they
 * come live from Sanity in the SEO log).
 *
 * Unlike the reference build (which hand-lists routes because its pages only
 * exist as files), this client's community and neighborhood pages are all
 * generated from lib/community-data.ts / lib/neighborhood-data.ts — so the
 * manifest derives from those modules and self-updates when communities are
 * added.
 *
 * ⚠️ AEO_ROUTES is empty because no AEO best-* landing pages have shipped for
 * this client yet (the AEO pages cron was out of scope at build time — see
 * CLAUDE.md). When AEO pages ship, list them here as [city-slug, page-slug]
 * pairs or the SEO log will under-count.
 */

import COMMUNITIES from '@/lib/community-data'
import NEIGHBORHOODS from '@/lib/neighborhood-data'

export type SeoPageType = 'aeo' | 'community' | 'blog'

export interface StaticSeoPage {
  type: Exclude<SeoPageType, 'blog'>
  url: string      // site-relative, e.g. /communities/la-jolla-real-estate
  title: string
  city: string     // display name, e.g. La Jolla
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

// ─── Live AEO / GEO landing pages ──────────────────────────────────────────────
// None shipped yet for Palisade Realty — see the header note.
const AEO_ROUTES: Array<[city: string, slug: string]> = []

export const AEO_PAGES: StaticSeoPage[] = AEO_ROUTES.map(([city, slug]) => ({
  type: 'aeo',
  url: `/${city}/${slug}`,
  title: `${titleCase(slug)} — ${titleCase(city)}`,
  city: titleCase(city),
}))

// ─── Community pages (derived from the site's own data modules) ────────────────
export const COMMUNITY_PAGES: StaticSeoPage[] = [
  ...COMMUNITIES.map((c) => ({
    type: 'community' as const,
    url: `/communities/${c.slug}`,
    title: `${c.name} Community Page`,
    city: c.name,
  })),
  ...NEIGHBORHOODS.map((n) => ({
    type: 'community' as const,
    url: `/communities/${n.parentSlug}/${n.slug}`,
    title: `${n.name} Neighborhood Page`,
    city: n.parentName ?? n.name,
  })),
]

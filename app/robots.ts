import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.palisaderealty.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
      // Explicit, deliberate allow list for AI-search-visibility crawlers,
      // rather than leaving today's "block nothing" default accidental —
      // see findings/geo.md.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

import type { NextConfig } from 'next'
// v2 — forces full rebuild cache bust

const nextConfig: NextConfig = {
  async redirects() {
    // Redirect legacy .html URLs from the old static site
    return [
      { source: '/:path*.html', destination: '/:path*', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      // Legacy team bio path structure (/team-page/:slug) — current routes live at /team/:slug
      { source: '/team-page/:slug*', destination: '/team/:slug*', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'd25fhp1qfwqa2h.cloudfront.net' },
    ],
  },
}

export default nextConfig

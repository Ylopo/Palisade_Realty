import type { NextConfig } from 'next'
// v2 — forces full rebuild cache bust

const nextConfig: NextConfig = {
  async headers() {
    // Note: a full Content-Security-Policy is intentionally NOT included here yet.
    // The site relies on numerous inline <script> tags (Ylopo widget config, JSON-LD,
    // per-page __ppLangData) with no nonce/hash wiring, plus third-party scripts
    // (Mapbox, Ylopo, UserWay, Google Fonts) and the Sanity Studio at /studio —
    // shipping a CSP without first auditing every one of those would risk silently
    // breaking the IDX search widget, the single most important business function
    // on the site. See findings/technical.md ("No security headers beyond HSTS").
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
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

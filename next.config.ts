import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    // Redirect legacy .html URLs from the old static site
    return [
      { source: '/:path*.html', destination: '/:path*', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
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

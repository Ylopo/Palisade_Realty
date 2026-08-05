import type { Metadata } from 'next'
import { Playfair_Display, Manrope, Inter } from 'next/font/google'
import Script from 'next/script'
import OrganizationSchema from '@/components/OrganizationSchema'
import './globals.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-label',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.palisaderealty.com'),
  title: {
    default: 'Palisade Realty | San Diego Real Estate',
    template: '%s | Palisade Realty',
  },
  description:
    'San Diego real estate experts. Search homes, explore communities, and connect with Hedda Parashos and the Palisade Realty team.',
  icons: { icon: '/images/favicon.jpg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${manrope.variable} ${inter.variable}`}
    >
      <head>
        {/* Ylopo widget config — must be set before the widget script loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.YLOPO_WIDGETS = {"domain":"search.palisaderealty.com"};`,
          }}
        />
        {/* Mapbox GL CSS — must be in <head> for map to render correctly */}
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
        />
        {/*
          Mapbox GL JS (1.35MB) — loaded lazyOnload so it never blocks initial
          render on pages that don't use it (every template except home/contact).
          Both homepage-nextjs.js's initMapbox() and ContactHeroMap already poll
          for `window.mapboxgl` and self-heal once this script finishes loading,
          so deferring it here is safe. See findings/performance.md.
        */}
        <Script
          src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"
          strategy="lazyOnload"
        />
        {/* ADA Compliance Widget — UserWay config must be set before widget.js loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window._userway_config={position:'5',size:'small',color:'#808080',mobile:false,account:'gWCTZli47p'};`,
          }}
        />
        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="gWCTZli47p"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <OrganizationSchema />
        {children}
      </body>
    </html>
  )
}

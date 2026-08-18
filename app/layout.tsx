import type { Metadata } from 'next'
import { Playfair_Display, Manrope, Inter } from 'next/font/google'
import Script from 'next/script'
import RouteChrome from '@/components/RouteChrome'
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
        {/* Mapbox GL CSS — must be in <head> for map to render correctly */}
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
        />
        {/* GA4 — renders nothing until NEXT_PUBLIC_GA_MEASUREMENT_ID is set */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body>
        {/* RouteChrome: renders Ylopo widget, Mapbox JS, UserWay, and OrganizationSchema
            only on non-admin routes. Returns null on /config and /studio. */}
        <RouteChrome />
        {children}
      </body>
    </html>
  )
}

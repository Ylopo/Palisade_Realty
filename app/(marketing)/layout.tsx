import Script from 'next/script'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import '@/homepage.css'
import '@/lang.css'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      {/* lang.js must load after React hydration to avoid DOM conflicts */}
      <Script src="/lang.js" strategy="afterInteractive" />
      {/* homepage-nextjs.js = homepage.js minus initMobileMenu (handled by SiteHeader React) */}
      <Script src="/homepage-nextjs.js" strategy="afterInteractive" />
      {/* fp-carousel.js must live in the layout (not page.tsx) so it runs exactly once per session */}
      <Script src="/fp-carousel.js" strategy="afterInteractive" />
    </>
  )
}

import Script from 'next/script'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import LangApplier from '@/components/LangApplier'
import '@/homepage.css'
import '@/lang.css'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <LangApplier />
      <main>{children}</main>
      <SiteFooter />
      {/* lang.js must load after React hydration to avoid DOM conflicts */}
      <Script src="/lang.js" strategy="afterInteractive" />
      {/* homepage-nextjs.js = homepage.js minus initMobileMenu (handled by SiteHeader React) */}
      <Script src="/homepage-nextjs.js" strategy="afterInteractive" />
      {/* fp-carousel.js must live in the layout (not page.tsx) so it runs exactly once per session */}
      <Script src="/fp-carousel.js" strategy="afterInteractive" />
      {/* YLOPO widget — config must be set before the widget script loads */}
      <Script id="ylopo-config" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: 'window.YLOPO_WIDGETS={"domain":"search.palisaderealty.com"}' }} />
      <Script src="https://search.palisaderealty.com/build/js/widgets-1.0.0.js" strategy="afterInteractive" />
    </>
  )
}

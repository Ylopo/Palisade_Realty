"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"
import OrganizationSchema from "./OrganizationSchema"

// Renders marketing-only scripts and schema. Returns null on /config and /studio
// so Ylopo widget, UserWay, and JSON-LD don't pollute the admin panel.
export default function RouteChrome() {
  const pathname = usePathname()
  if (pathname.startsWith("/config") || pathname.startsWith("/studio")) return null

  return (
    <>
      <OrganizationSchema />

      {/* Ylopo widget config — must be set before the widget script loads */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.YLOPO_WIDGETS = {"domain":"search.palisaderealty.com"};`,
        }}
      />

      {/* Mapbox GL JS (1.35MB) — deferred so it never blocks initial render */}
      <Script
        src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"
        strategy="lazyOnload"
      />

      {/* ADA Compliance Widget */}
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
    </>
  )
}

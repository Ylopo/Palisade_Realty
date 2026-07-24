import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Redirect legacy .html URLs to clean URLs (preserves SEO from static site)
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (pathname.endsWith('.html')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -5)
    return NextResponse.redirect(url, 308)
  }
}

export const config = {
  matcher: ['/(.*)\\.html'],
}

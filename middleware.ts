import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isValidSessionCookie, CONFIG_SESSION_COOKIE } from "@/lib/admin/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Legacy .html → clean URL (308 permanent redirect)
  if (pathname.endsWith(".html")) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -5)
    return NextResponse.redirect(url, 308)
  }

  // Admin auth gating for /config/* and /api/admin/*
  const isAdminPage = pathname.startsWith("/config")
  const isAdminApi = pathname.startsWith("/api/admin")

  if (isAdminPage || isAdminApi) {
    // Let login page through so users can authenticate
    if (pathname === "/config/login") return NextResponse.next()

    const valid = await isValidSessionCookie(
      request.cookies.get(CONFIG_SESSION_COOKIE)?.value
    )

    if (valid) return NextResponse.next()

    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const loginUrl = new URL("/config/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/(.*)\\.html", "/config/:path*", "/api/admin/:path*"],
}

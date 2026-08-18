import { NextResponse } from "next/server"
import {
  createSessionCookieValue,
  CONFIG_SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/admin/auth"

export async function POST(req: Request) {
  const { password } = await req.json()

  const stored = process.env.CONFIG_ADMIN_PASSWORD

  if (!password || password.trim() !== stored?.trim()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const cookieValue = await createSessionCookieValue()

  const res = NextResponse.json({ ok: true })
  res.cookies.set(CONFIG_SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
  return res
}

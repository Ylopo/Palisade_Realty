import { NextResponse } from "next/server"
import { CONFIG_SESSION_COOKIE } from "@/lib/admin/auth"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(CONFIG_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
  return res
}

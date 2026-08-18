export const CONFIG_SESSION_COOKIE = "config_session"
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

function getSecret(): string {
  return process.env.CONFIG_SESSION_SECRET || process.env.CONFIG_ADMIN_PASSWORD || "dev-fallback-secret"
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function createSessionCookieValue(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const sig = await hmacHex(getSecret(), String(expiresAt))
  return `${expiresAt}.${sig}`
}

export async function isValidSessionCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false
  const dotIdx = value.indexOf(".")
  if (dotIdx === -1) return false
  const expiresAtRaw = value.slice(0, dotIdx)
  const signature = value.slice(dotIdx + 1)
  const expiresAt = Number(expiresAtRaw)
  if (!expiresAt || isNaN(expiresAt) || Date.now() > expiresAt || !signature) return false
  const expected = await hmacHex(getSecret(), expiresAtRaw)
  return expected === signature
}

export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000 // seconds, for cookie maxAge

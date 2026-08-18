import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { writeClient } from "@/lib/sanity/client"
import { SETTINGS_CONFIG } from "@/lib/admin/settingsConfig"
import { splitSetUnset } from "@/lib/admin/patchFields"

export const dynamic = "force-dynamic"

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const TOKEN = process.env.SANITY_API_TOKEN
const SANITY_URL = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}`

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const cfg = SETTINGS_CONFIG[type]
  if (!cfg) return NextResponse.json({ error: "Unknown settings type" }, { status: 404 })

  const docId = cfg.docId ?? type
  const groq = `*[_id == "${docId}"][0]`
  try {
    const r = await fetch(`${SANITY_URL}?query=${encodeURIComponent(groq)}`, {
      headers: { ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
      cache: "no-store",
    })
    const d = await r.json()
    return NextResponse.json(d.result ?? null)
  } catch (err) {
    console.error(`[admin/settings/${type}] fetch error:`, err)
    return NextResponse.json(null)
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const cfg = SETTINGS_CONFIG[type]
  if (!cfg) return NextResponse.json({ error: "Unknown settings type" }, { status: 404 })

  const docId = cfg.docId ?? type
  const body = await req.json()
  const { setFields, unsetFields } = splitSetUnset(body)

  await writeClient.createIfNotExists({ _id: docId, _type: docId })

  let patch = writeClient.patch(docId)
  if (Object.keys(setFields).length) patch = patch.set(setFields)
  if (unsetFields.length) patch = patch.unset(unsetFields)
  const updated = await patch.commit()

  revalidateTag("sanity")
  return NextResponse.json(updated)
}

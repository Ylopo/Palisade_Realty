import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { writeClient } from "@/lib/sanity/client"
import { COLLECTIONS_CONFIG } from "@/lib/admin/collectionsConfig"

export const dynamic = "force-dynamic"

const TOKEN = process.env.SANITY_API_TOKEN
const SANITY_URL = `https://qjhzi2t2.api.sanity.io/v2024-01-01/data/query/production`

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const cfg = COLLECTIONS_CONFIG[type]
  if (!cfg) return NextResponse.json({ error: "Unknown collection type" }, { status: 404 })

  const filter = cfg.listFilter ? ` && (${cfg.listFilter})` : ""
  const projection = cfg.listProjection ? ` {..., ${cfg.listProjection}}` : ""
  const groq = `*[_type == "${cfg.type}"${filter}] | order(${cfg.sort})${projection}`

  console.log(`[admin/collections/${type}] query:`, groq)
  console.log(`[admin/collections/${type}] token set:`, !!TOKEN)

  try {
    // Use raw Sanity HTTP API (same approach as /api/team) to avoid next-sanity client caching
    const r = await fetch(`${SANITY_URL}?query=${encodeURIComponent(groq)}`, {
      headers: {
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      cache: "no-store",
    })
    const d = await r.json()
    const items = d.result ?? []
    console.log(`[admin/collections/${type}] result count:`, items.length, "error:", d.error)
    return NextResponse.json(items)
  } catch (err) {
    console.error(`[admin/collections/${type}] fetch error:`, err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const cfg = COLLECTIONS_CONFIG[type]
  if (!cfg) return NextResponse.json({ error: "Unknown collection type" }, { status: 404 })

  const body = await req.json()
  const created = await writeClient.create({ _type: cfg.type, ...body })
  revalidateTag("sanity")
  return NextResponse.json(created, { status: 201 })
}

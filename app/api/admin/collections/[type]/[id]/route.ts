import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { writeClient } from "@/lib/sanity/client"
import { COLLECTIONS_CONFIG } from "@/lib/admin/collectionsConfig"
import { splitSetUnset } from "@/lib/admin/patchFields"

export const dynamic = "force-dynamic"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params
  const cfg = COLLECTIONS_CONFIG[type]
  if (!cfg) return NextResponse.json({ error: "Unknown collection type" }, { status: 404 })

  const body = await req.json()
  const { setFields, unsetFields } = splitSetUnset(body)

  let patch = writeClient.patch(id)
  if (Object.keys(setFields).length) patch = patch.set(setFields)
  if (unsetFields.length) patch = patch.unset(unsetFields)
  const updated = await patch.commit()

  revalidateTag("sanity")
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params
  const cfg = COLLECTIONS_CONFIG[type]
  if (!cfg) return NextResponse.json({ error: "Unknown collection type" }, { status: 404 })

  await writeClient.delete(id)
  revalidateTag("sanity")
  return NextResponse.json({ ok: true })
}

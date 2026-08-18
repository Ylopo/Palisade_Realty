import { NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity/client"

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "image/jpeg"
  const filename = req.headers.get("x-filename") ?? "upload"

  if (!req.body) {
    return NextResponse.json({ error: "No body" }, { status: 400 })
  }

  const buffer = Buffer.from(await req.arrayBuffer())

  const asset = await writeClient.assets.upload("image", buffer, {
    filename,
    contentType,
  })

  return NextResponse.json({
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
    url: asset.url,
  })
}

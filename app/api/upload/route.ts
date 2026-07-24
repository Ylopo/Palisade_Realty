import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN      = process.env.SANITY_API_TOKEN
const SECRET     = process.env.ADMIN_SECRET

export async function POST(request: NextRequest) {
  if (SECRET && request.headers.get('x-admin-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { imageBase64, filename, mimeType } = await request.json()
    if (!imageBase64) return NextResponse.json({ error: 'imageBase64 required' }, { status: 400 })

    const buffer = Buffer.from(imageBase64, 'base64')
    const url    = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/${DATASET}`
                 + `?filename=${encodeURIComponent(filename || 'upload.jpg')}`

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':   mimeType || 'image/jpeg',
        'Authorization':  `Bearer ${TOKEN}`,
        'Content-Length': String(buffer.length),
      },
      body: buffer,
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 200 : 400 })
  } catch (err: unknown) {
    console.error('[api/upload]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN      = process.env.SANITY_API_TOKEN
const SECRET     = process.env.ADMIN_SECRET
const BASE       = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`
const QUERY_URL  = `${BASE}/data/query/${DATASET}`
const MUTATE_URL = `${BASE}/data/mutate/${DATASET}`
const HDR        = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` } as Record<string,string>)
const CORS       = { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }

const PUBLIC_GROQ = `*[_type == "headerCarousel" && active == true] | order(displayOrder asc) {
  _id, title, altText, caption, headline, headlineEs, subheadline, subheadlineEs, buttonText, buttonUrl,
  displayOrder, active,
  "imageUrl": image.asset->url
}`

const ADMIN_GROQ = `*[_type == "headerCarousel"] | order(displayOrder asc) {
  _id, title, altText, caption, headline, subheadline, buttonText, buttonUrl,
  displayOrder, active,
  "imageUrl": image.asset->url,
  "imageRef": image.asset->_id
}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDoc(b: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: Record<string, any> = {
    _type:        'headerCarousel',
    title:        b.title        || '',
    altText:      b.altText      || '',
    caption:      b.caption      || '',
    headline:     b.headline     || '',
    subheadline:  b.subheadline  || '',
    buttonText:   b.buttonText   || '',
    buttonUrl:    b.buttonUrl    || '',
    displayOrder: Number(b.displayOrder) || 0,
    active:       b.active !== false,
  }
  if (b.imageRef) doc.image = { _type: 'image', asset: { _type: 'reference', _ref: b.imageRef } }
  return doc
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPatch(b: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p: Record<string, any> = {}
  const set = (k: string, v: unknown) => { if (v !== undefined) p[k] = v }
  set('title',        b.title)
  set('altText',      b.altText)
  set('caption',      b.caption)
  set('headline',     b.headline)
  set('subheadline',  b.subheadline)
  set('buttonText',   b.buttonText)
  set('buttonUrl',    b.buttonUrl)
  if (b.displayOrder !== undefined) p.displayOrder = Number(b.displayOrder)
  set('active',       b.active)
  if (b.imageRef !== undefined) {
    p.image = b.imageRef
      ? { _type: 'image', asset: { _type: 'reference', _ref: b.imageRef } }
      : null
  }
  return p
}

export async function GET(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  const groq = isAdmin ? ADMIN_GROQ : PUBLIC_GROQ
  try {
    const r = await fetch(`${QUERY_URL}?query=${encodeURIComponent(groq)}`, { headers: HDR() })
    const d = await r.json()
    return NextResponse.json(d.result || [], { headers: CORS })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  try {
    const b = await request.json()
    const r = await fetch(MUTATE_URL, {
      method: 'POST', headers: HDR(),
      body: JSON.stringify({ mutations: [{ create: toDoc(b) }] }),
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 201 : 400, headers: CORS })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  try {
    const b = await request.json()
    if (!b._id) return NextResponse.json({ error: '_id required' }, { status: 400, headers: CORS })
    const r = await fetch(MUTATE_URL, {
      method: 'POST', headers: HDR(),
      body: JSON.stringify({ mutations: [{ patch: { id: b._id, set: toPatch(b) } }] }),
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 200 : 400, headers: CORS })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  try {
    const b = await request.json()
    if (!b._id) return NextResponse.json({ error: '_id required' }, { status: 400, headers: CORS })
    const r = await fetch(MUTATE_URL, {
      method: 'POST', headers: HDR(),
      body: JSON.stringify({ mutations: [{ delete: { id: b._id } }] }),
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 200 : 400, headers: CORS })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}

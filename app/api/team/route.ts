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

const FIELDS = `_id, name, "slug": slug.current, role, location, phone, email, bio, bioEs, fullBio, fullBioEs, linkedin, instagram, facebook, websiteUrl,
  department, imageAlt, showOnHomepage, showOnTeamPage,
  displayOrder, active, featured,
  "photoUrl": photo.asset->url`

const PUBLIC_HOME_GROQ = `*[_type == "teamMember" && active != false && showOnHomepage != false] | order(displayOrder asc) { ${FIELDS} }`
const PUBLIC_TEAM_GROQ = `*[_type == "teamMember" && active != false && showOnTeamPage != false] | order(displayOrder asc) { ${FIELDS} }`
const ADMIN_GROQ       = `*[_type == "teamMember"] | order(displayOrder asc) { ${FIELDS}, "photoRef": photo.asset->_id }`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDoc(b: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: Record<string, any> = {
    _type:          'teamMember',
    name:           b.name         || '',
    role:           b.role         || 'Real Estate Agent',
    location:       b.location     || 'Las Vegas, NV',
    phone:          b.phone        || '',
    email:          b.email        || '',
    bio:            b.bio          || '',
    fullBio:        b.fullBio      || '',
    linkedin:       b.linkedin     || '',
    instagram:      b.instagram    || '',
    facebook:       b.facebook     || '',
    websiteUrl:     b.websiteUrl   || '',
    department:     b.department   || 'agent',
    imageAlt:       b.imageAlt     || '',
    displayOrder:   Number(b.displayOrder) || 0,
    active:         b.active         !== false,
    featured:       !!b.featured,
    showOnHomepage: b.showOnHomepage !== false,
    showOnTeamPage: b.showOnTeamPage !== false,
  }
  if (b.photoRef) doc.photo = { _type: 'image', asset: { _type: 'reference', _ref: b.photoRef } }
  return doc
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPatch(b: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p: Record<string, any> = {}
  const set = (k: string, v: unknown) => { if (v !== undefined) p[k] = v }
  set('name',           b.name)
  set('role',           b.role)
  set('location',       b.location)
  set('phone',          b.phone)
  set('email',          b.email)
  set('bio',            b.bio)
  set('fullBio',        b.fullBio)
  set('linkedin',       b.linkedin)
  set('instagram',      b.instagram)
  set('facebook',       b.facebook)
  set('websiteUrl',     b.websiteUrl)
  set('department',     b.department)
  set('imageAlt',       b.imageAlt)
  if (b.displayOrder !== undefined) p.displayOrder = Number(b.displayOrder)
  set('active',         b.active)
  set('featured',       b.featured)
  set('showOnHomepage', b.showOnHomepage)
  set('showOnTeamPage', b.showOnTeamPage)
  if (b.photoRef !== undefined) {
    p.photo = b.photoRef
      ? { _type: 'image', asset: { _type: 'reference', _ref: b.photoRef } }
      : null
  }
  return p
}

export async function GET(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  const page    = request.nextUrl.searchParams.get('page')
  const groq    = isAdmin ? ADMIN_GROQ : page === 'team' ? PUBLIC_TEAM_GROQ : PUBLIC_HOME_GROQ
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

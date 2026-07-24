import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN      = process.env.SANITY_API_TOKEN
const SECRET     = process.env.ADMIN_SECRET
const BASE       = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`
const QUERY      = `${BASE}/data/query/${DATASET}`
const MUTATE     = `${BASE}/data/mutate/${DATASET}`
const HDR        = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` } as Record<string,string>)
const CORS       = { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }

const GROQ = `*[_type == "featuredListing"] | order(displayOrder asc, _createdAt asc) {
  _id, title, price, status, featured, active, externalListingId, displayOrder, listingUrl, shortDescription,
  "street": address.street, "city": address.city, "state": address.state, "zip": address.zip,
  bedrooms, bathrooms, squareFootage,
  "mainImageUrl": mainImage.asset->url,
  "mainImageRef": mainImage.asset->_id
}`

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDocument(b: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: Record<string, any> = {
    _type:            'featuredListing',
    title:            b.title            || '',
    price:            b.price            || '',
    status:           b.status           || 'for-sale',
    featured:         b.featured         !== false,
    active:           b.active           !== false,
    displayOrder:     Number(b.displayOrder) || 0,
    shortDescription: b.shortDescription || '',
    listingUrl:       b.listingUrl       || '',
    address: { street: b.street||'', city: b.city||'', state: b.state||'NV', zip: b.zip||'' },
  }
  if (b.bedrooms)          doc.bedrooms          = Number(b.bedrooms)
  if (b.bathrooms)         doc.bathrooms         = Number(b.bathrooms)
  if (b.squareFootage)     doc.squareFootage     = Number(b.squareFootage)
  if (b.mainImageRef)      doc.mainImage         = { _type: 'image', asset: { _type: 'reference', _ref: b.mainImageRef } }
  if (b.externalListingId) doc.externalListingId = String(b.externalListingId)
  if (b.title)             doc.slug              = { _type: 'slug', current: slugify(b.title) }
  return doc
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPatch(b: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p: Record<string, any> = {}
  const set = (k: string, v: unknown) => { if (v !== undefined) p[k] = v }
  set('title',             b.title)
  set('price',             b.price)
  set('status',            b.status)
  set('featured',          b.featured)
  set('active',            b.active)
  if (b.displayOrder !== undefined) p.displayOrder = Number(b.displayOrder)
  set('shortDescription',  b.shortDescription)
  set('listingUrl',        b.listingUrl)
  set('externalListingId', b.externalListingId)
  p.bedrooms      = b.bedrooms     ? Number(b.bedrooms)      : (b.bedrooms === ''     ? null : undefined)
  p.bathrooms     = b.bathrooms    ? Number(b.bathrooms)     : (b.bathrooms === ''    ? null : undefined)
  p.squareFootage = b.squareFootage? Number(b.squareFootage) : (b.squareFootage === '' ? null : undefined)
  if (p.bedrooms      === undefined) delete p.bedrooms
  if (p.bathrooms     === undefined) delete p.bathrooms
  if (p.squareFootage === undefined) delete p.squareFootage
  set('address.street', b.street)
  set('address.city',   b.city)
  set('address.state',  b.state)
  set('address.zip',    b.zip)
  if (b.mainImageRef) p.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: b.mainImageRef } }
  if (b.title)        p.slug      = { _type: 'slug', current: slugify(b.title) }
  return p
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS })
}

export async function GET(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })

  // Geocode proxy
  if (request.nextUrl.searchParams.get('action') === 'geocode') {
    const area        = (request.nextUrl.searchParams.get('area')        || '').trim()
    const cityContext = (request.nextUrl.searchParams.get('cityContext')  || '').trim()
    if (!area) return NextResponse.json({ error: 'Area name required' }, { status: 400, headers: CORS })
    const requireNV = /henderson|nevada/i.test(cityContext)
    const searchQ   = cityContext ? `${area}, ${cityContext}` : area
    try {
      const url = 'https://nominatim.openstreetmap.org/search?'
        + 'q=' + encodeURIComponent(searchQ)
        + '&format=json&limit=5&addressdetails=1'
      const r = await fetch(url, { headers: { 'User-Agent': 'CrightonRinaldiAdmin/1.0' } })
      if (!r.ok) return NextResponse.json({ error: 'Geocoding service unavailable. Please try again.' }, { status: 502, headers: CORS })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results = await r.json() as any[]
      if (!results || !results.length) {
        const hint = requireNV ? `"${area}, Henderson, Nevada"` : `"${area}, CA" or "${area}, Nevada"`
        return NextResponse.json({ error: `Could not find "${area}". Try ${hint}.` }, { status: 404, headers: CORS })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let hit = results[0] as any
      if (requireNV) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nvHit = results.find((r: any) => {
          const addr = r.address || {}
          const iso  = addr['ISO3166-2-lvl4'] || ''
          const st   = addr.state || ''
          return iso === 'US-NV' || /nevada/i.test(st)
        })
        if (!nvHit) {
          return NextResponse.json({
            error: `No Nevada result found for "${area}". Try "${area}, Henderson, Nevada" or "${area}, NV".`,
          }, { status: 404, headers: CORS })
        }
        hit = nvHit
      }
      const lat = Math.round(parseFloat(hit.lat) * 10000) / 10000
      const lng = Math.round(parseFloat(hit.lon) * 10000) / 10000
      const addr = hit.address || {}
      const cityName = addr.city || addr.town || addr.village || addr.county || hit.name || area
      let stateAbbr = ''
      const isoCode = addr['ISO3166-2-lvl4'] || ''
      if (isoCode) stateAbbr = isoCode.replace(/^[A-Z]+-/, '')
      else if (addr.state) stateAbbr = addr.state
      const subLabel = stateAbbr ? `${cityName}, ${stateAbbr}` : cityName
      return NextResponse.json({
        areaName: cityName, subLabel, lat, lng,
        formattedAddress: hit.display_name || subLabel,
        state: stateAbbr, country: addr.country || '',
      }, { headers: CORS })
    } catch (err: unknown) {
      return NextResponse.json({ error: (err as Error).message || 'Geocoding failed' }, { status: 500, headers: CORS })
    }
  }

  try {
    const r = await fetch(`${QUERY}?query=${encodeURIComponent(GROQ)}`, { headers: HDR() })
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
    const r = await fetch(MUTATE, {
      method: 'POST', headers: HDR(),
      body: JSON.stringify({ mutations: [{ create: toDocument(b) }] }),
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 200 : 400, headers: CORS })
  } catch (err: unknown) {
    console.error('[api/admin]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  try {
    const b = await request.json()
    if (!b._id) return NextResponse.json({ error: '_id required' }, { status: 400, headers: CORS })
    const r = await fetch(MUTATE, {
      method: 'POST', headers: HDR(),
      body: JSON.stringify({ mutations: [{ patch: { id: b._id, set: toPatch(b) } }] }),
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 200 : 400, headers: CORS })
  } catch (err: unknown) {
    console.error('[api/admin]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  try {
    const b = await request.json()
    if (!b._id) return NextResponse.json({ error: '_id required' }, { status: 400, headers: CORS })
    const r = await fetch(MUTATE, {
      method: 'POST', headers: HDR(),
      body: JSON.stringify({ mutations: [{ delete: { id: b._id } }] }),
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 200 : 400, headers: CORS })
  } catch (err: unknown) {
    console.error('[api/admin]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}

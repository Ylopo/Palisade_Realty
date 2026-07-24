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

const PUBLIC_GROQ = `*[_type == "testimonial" && active == true]
  | order(featured desc, displayOrder asc) {
  _id, name, title, review, reviewEs, rating, category, imageAlt, featured, active, displayOrder,
  "imageUrl": image.asset->url
}`

const ADMIN_GROQ = `*[_type == "testimonial"] | order(featured desc, displayOrder asc) {
  _id, name, title, review, rating, category, imageAlt, featured, active, displayOrder,
  "imageUrl": image.asset->url,
  "imageRef": image.asset->_id
}`

const PAGE_GROQ = `*[_id == "testimonialsPage"][0]{
  testHero {
    eyebrow, headline, subheadline, ratingScore, reviewCount,
    "bgImageUrl": bgImage.asset->url,
    "bgImageRef": bgImage.asset->_id,
    active
  },
  testStatsBar {
    "stats": stats[] | order(displayOrder asc) { value, label, displayOrder, active },
    active
  },
  ctaSection {
    eyebrow, headline, buttonText, buttonUrl, button2Text, button2Url,
    "bgImageUrl": bgImage.asset->url,
    "bgImageRef": bgImage.asset->_id,
    active
  },
  seoTitle, seoDescription,
  "ogImageUrl": ogImage.asset->url,
  "ogImageRef": ogImage.asset->_id
}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDoc(b: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: Record<string, any> = {
    _type:        'testimonial',
    name:         b.name         || '',
    title:        b.title        || '',
    review:       b.review       || '',
    rating:       Math.max(1, Math.min(5, Number(b.rating) || 5)),
    category:     b.category     || '',
    imageAlt:     b.imageAlt     || '',
    displayOrder: Number(b.displayOrder) || 0,
    active:       b.active !== false,
    featured:     !!b.featured,
  }
  if (b.imageRef) doc.image = { _type: 'image', asset: { _type: 'reference', _ref: b.imageRef } }
  return doc
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPatch(b: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p: Record<string, any> = {}
  const set = (k: string, v: unknown) => { if (v !== undefined) p[k] = v }
  set('name',         b.name)
  set('title',        b.title)
  set('review',       b.review)
  if (b.rating !== undefined) p.rating = Math.max(1, Math.min(5, Number(b.rating) || 5))
  set('category',     b.category)
  set('imageAlt',     b.imageAlt)
  if (b.displayOrder !== undefined) p.displayOrder = Number(b.displayOrder)
  set('active',       b.active)
  set('featured',     b.featured)
  if (b.imageRef !== undefined) {
    p.image = b.imageRef
      ? { _type: 'image', asset: { _type: 'reference', _ref: b.imageRef } }
      : null
  }
  return p
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS })
}

export async function GET(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  const isPage  = request.nextUrl.searchParams.get('section') === 'page'

  if (isPage) {
    try {
      const r = await fetch(`${QUERY_URL}?query=${encodeURIComponent(PAGE_GROQ)}`, { headers: HDR() })
      const d = await r.json()
      return NextResponse.json(d.result || {}, { headers: CORS })
    } catch {
      return NextResponse.json({}, { headers: CORS })
    }
  }

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
  const isPage = request.nextUrl.searchParams.get('section') === 'page'

  try {
    const b = await request.json()

    if (isPage) {
      const buildImg = (ref: string | undefined) => ref
        ? { _type: 'image', asset: { _type: 'reference', _ref: ref } }
        : undefined
      const heroImg = buildImg(b.testHero?.bgImageRef)
      const ctaImg  = buildImg(b.ctaSection?.bgImageRef)
      const ogImg   = buildImg(b.ogImageRef)
      const doc = {
        _id: 'testimonialsPage', _type: 'testimonialsPage',
        testHero: {
          eyebrow: b.testHero?.eyebrow || '', headline: b.testHero?.headline || '',
          subheadline: b.testHero?.subheadline || '', ratingScore: b.testHero?.ratingScore || '',
          reviewCount: b.testHero?.reviewCount || '', active: b.testHero?.active !== false,
          ...(heroImg ? { bgImage: heroImg } : {}),
        },
        testStatsBar: {
          active: b.testStatsBar?.active !== false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          stats: (b.testStatsBar?.stats || []).map((s: any, i: number) => ({
            _type: 'object', _key: `stat-${i}`,
            value: s.value || '', label: s.label || '',
            displayOrder: Number(s.displayOrder) || i,
            active: s.active !== false,
          })),
        },
        ctaSection: {
          eyebrow: b.ctaSection?.eyebrow || '', headline: b.ctaSection?.headline || '',
          buttonText: b.ctaSection?.buttonText || '', buttonUrl: b.ctaSection?.buttonUrl || '',
          button2Text: b.ctaSection?.button2Text || '', button2Url: b.ctaSection?.button2Url || '',
          active: b.ctaSection?.active !== false,
          ...(ctaImg ? { bgImage: ctaImg } : {}),
        },
        seoTitle: b.seoTitle || '', seoDescription: b.seoDescription || '',
        ...(ogImg ? { ogImage: ogImg } : {}),
      }
      const r = await fetch(MUTATE_URL, {
        method: 'POST', headers: HDR(),
        body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
      })
      const d = await r.json()
      return NextResponse.json(d, { status: r.ok ? 200 : 400, headers: CORS })
    }

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

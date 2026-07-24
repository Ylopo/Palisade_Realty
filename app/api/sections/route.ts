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

const DEFAULT_SECTIONS = [
  { id:'hero',        label:'Header',           type:'Section', visible:true,  order:0,  updatedAt:'2024-05-12', sectionKey:'hero',        data:{} },
  { id:'communities', label:'Communities',       type:'Section', visible:true,  order:1,  updatedAt:'2024-05-12', sectionKey:'communities',  data:{} },
  { id:'about',       label:'About Us',          type:'Section', visible:true,  order:2,  updatedAt:'2024-05-11', sectionKey:'about',        data:{} },
  { id:'stats',       label:'Stats',             type:'Section', visible:true,  order:3,  updatedAt:'2024-05-11', sectionKey:'stats',        data:{} },
  { id:'listings',    label:'Featured Listings', type:'Section', visible:true,  order:4,  updatedAt:'2024-05-10', sectionKey:'listings',     data:{} },
  { id:'testimonial', label:'Client Reviews',    type:'Section', visible:true,  order:5,  updatedAt:'2024-05-10', sectionKey:'testimonial',  data:{} },
  { id:'team',        label:'Team',              type:'Section', visible:true,  order:6,  updatedAt:'2024-05-09', sectionKey:'team',         data:{} },
  { id:'blog',        label:'Blog',              type:'Page',    visible:true,  order:7,  updatedAt:'2024-05-09', sectionKey:'blog',         data:{} },
  { id:'faq',         label:'FAQ',               type:'Section', visible:true,  order:8,  updatedAt:'2024-05-08', sectionKey:'faq',          data:{} },
  { id:'cta',         label:'CTA',               type:'Section', visible:true,  order:9,  updatedAt:'2024-05-08', sectionKey:'cta',          data:{} },
]

export async function GET(request: NextRequest) {
  // Lightweight Mapbox token endpoint
  if (request.nextUrl.searchParams.has('mapboxOnly')) {
    return NextResponse.json(
      { token: process.env.MAPBOX_PUBLIC_TOKEN || '' },
      { headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate', 'Access-Control-Allow-Origin': '*' } }
    )
  }

  try {
    const groq = `*[_id == "homepage-settings"][0]{ sections }`
    const r    = await fetch(`${QUERY_URL}?query=${encodeURIComponent(groq)}`, { headers: HDR() })
    const d    = await r.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stored = d.result?.sections as any[] | undefined
    if (Array.isArray(stored) && stored.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storedMap = Object.fromEntries(stored.map((s: any) => [s.id, s]))
      const merged = DEFAULT_SECTIONS.map(def => storedMap[def.id] ? { ...def, ...storedMap[def.id] } : def)
      return NextResponse.json(merged, { headers: CORS })
    }
    return NextResponse.json(DEFAULT_SECTIONS, { headers: CORS })
  } catch {
    return NextResponse.json(DEFAULT_SECTIONS, { headers: CORS })
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  try {
    const b = await request.json()
    const { sections } = b
    if (!Array.isArray(sections)) return NextResponse.json({ error: 'sections array required' }, { status: 400, headers: CORS })
    const r = await fetch(MUTATE_URL, {
      method: 'POST', headers: HDR(),
      body: JSON.stringify({
        mutations: [{
          createOrReplace: { _id: 'homepage-settings', _type: 'homepageSettings', sections },
        }],
      }),
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 200 : 400, headers: CORS })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}

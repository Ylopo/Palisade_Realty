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

const GROQ = `*[_id == "teamPage"][0]{
  hero { eyebrow, headline, subheadline, "bgImageUrl": bgImage.asset->url, "bgImageRef": bgImage.asset->_id },
  stats { s1Value, s1Label, s2Value, s2Label, s3Value, s3Label, s4Value, s4Label },
  pageContent { eyebrow, title, subtitle },
  cta { eyebrow, headline, btn1Text, btn1Url, btn2Text, btn2Url },
  seo { title, description, "ogImageUrl": ogImage.asset->url, "ogImageRef": ogImage.asset->_id }
}`

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS })
}

export async function GET() {
  try {
    const r = await fetch(`${QUERY_URL}?query=${encodeURIComponent(GROQ)}`, { headers: HDR() })
    const d = await r.json()
    return NextResponse.json(d.result || {}, { headers: CORS })
  } catch {
    return NextResponse.json({}, { headers: CORS })
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = SECRET && request.headers.get('x-admin-secret') === SECRET
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  try {
    const b = await request.json()
    const buildImageRef = (ref: string | undefined) => ref
      ? { _type: 'image', asset: { _type: 'reference', _ref: ref } }
      : undefined
    const heroImg = buildImageRef(b.hero?.bgImageRef)
    const ogImg   = buildImageRef(b.seo?.ogImageRef)
    const doc = {
      _id:   'teamPage',
      _type: 'teamPage',
      hero: {
        eyebrow:     b.hero?.eyebrow     || '',
        headline:    b.hero?.headline    || '',
        subheadline: b.hero?.subheadline || '',
        ...(heroImg ? { bgImage: heroImg } : {}),
      },
      stats: {
        s1Value: b.stats?.s1Value || '', s1Label: b.stats?.s1Label || '',
        s2Value: b.stats?.s2Value || '', s2Label: b.stats?.s2Label || '',
        s3Value: b.stats?.s3Value || '', s3Label: b.stats?.s3Label || '',
        s4Value: b.stats?.s4Value || '', s4Label: b.stats?.s4Label || '',
      },
      pageContent: {
        eyebrow:  b.pageContent?.eyebrow  || '',
        title:    b.pageContent?.title    || '',
        subtitle: b.pageContent?.subtitle || '',
      },
      cta: {
        eyebrow:  b.cta?.eyebrow  || '',
        headline: b.cta?.headline || '',
        btn1Text: b.cta?.btn1Text || '',
        btn1Url:  b.cta?.btn1Url  || '',
        btn2Text: b.cta?.btn2Text || '',
        btn2Url:  b.cta?.btn2Url  || '',
      },
      seo: {
        title:       b.seo?.title       || '',
        description: b.seo?.description || '',
        ...(ogImg ? { ogImage: ogImg } : {}),
      },
    }
    const r = await fetch(MUTATE_URL, {
      method: 'POST', headers: HDR(),
      body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
    })
    const d = await r.json()
    return NextResponse.json(d, { status: r.ok ? 200 : 400, headers: CORS })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: CORS })
  }
}

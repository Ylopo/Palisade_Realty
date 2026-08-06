import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

// The real community names this site has pages for (app/(marketing)/communities/CommunitiesGrid.tsx).
// Longer/more specific names are listed first so a substring match on the
// haystack can't get short-circuited by a shorter name it also contains
// (e.g. "Pacific & Mission Beach" checked before "Pacific Beach"/"Mission Beach").
const SAN_DIEGO_AREAS = [
  'Pacific & Mission Beach',
  'Rancho Peñasquitos',
  'Rancho Santa Fe',
  'Downtown San Diego',
  'Mission Valley',
  'Mission Beach',
  'Pacific Beach',
  'Mission Hills',
  'Scripps Ranch',
  'Solana Beach',
  'Spring Valley',
  'Carmel Valley',
  'Chula Vista',
  'Point Loma',
  'Coronado',
  'La Jolla',
  'Del Mar',
  'Encinitas',
  'Carlsbad',
  'Oceanside',
  'North Park',
  'La Mesa',
  'El Cajon',
]

interface PortableTextSpanLike {
  text?: string
}
interface PortableTextBlockLike {
  _type?: string
  children?: PortableTextSpanLike[]
}
interface SanityPost {
  title?: string
  excerpt?: string
  videoScript?: string
  body?: PortableTextBlockLike[]
}

function portableTextToPlainText(body: PortableTextBlockLike[] | undefined): string {
  if (!Array.isArray(body)) return ''
  return body
    .filter((block) => block?._type === 'block' && Array.isArray(block.children))
    .map((block) => (block.children ?? []).map((child) => child?.text ?? '').join(' '))
    .join(' ')
}

/**
 * Detects which of this site's real community pages are mentioned in the
 * post's actual content — the script first (that's what the operator is
 * about to record/publish), then the article body/title/excerpt as a
 * fallback source. Plain case-insensitive substring matching against a
 * fixed, known list is deliberately simpler than an LLM call here: the list
 * is short, matching a real place name is unambiguous, and there's nothing
 * for a model to usefully infer beyond string containment.
 */
function detectAreas(haystack: string): string[] {
  const lower = haystack.toLowerCase()
  return SAN_DIEGO_AREAS.filter((area) => lower.includes(area.toLowerCase()))
}

/**
 * POST /api/content/suggest-idx-areas?secret=...
 * Body: { postId: string, title?: string, excerpt?: string }
 *
 * Reads the post's videoScript + body from Sanity (title/excerpt from the
 * request body are used as a supplementary fallback, e.g. if called before
 * a script exists yet) and returns whichever real San Diego community pages
 * are mentioned, for the operator to add to the Blog Listings IDX area list.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: unknown; title?: unknown; excerpt?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postId } = body
  if (typeof postId !== 'string' || postId.length === 0) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  try {
    const post = await writeClient.fetch<SanityPost | null>(
      `*[_id==$postId][0]{title,excerpt,videoScript,body}`,
      { postId }
    )
    if (!post) {
      return NextResponse.json({ error: `Post ${postId} not found` }, { status: 404 })
    }

    const haystack = [
      post.videoScript ?? '',
      post.title ?? (typeof body.title === 'string' ? body.title : ''),
      post.excerpt ?? (typeof body.excerpt === 'string' ? body.excerpt : ''),
      portableTextToPlainText(post.body),
    ].join(' \n ')

    const areas = detectAreas(haystack)

    return NextResponse.json({ areas })
  } catch (err: unknown) {
    console.error('[api/content/suggest-idx-areas]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { writeClient } from '@/lib/sanity/client'
import { portableTextToMarkdown, markdownToPortableText } from '@/lib/portable-text-utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Matches link syntax left as literal text by the old MD_LINK_RE, which only
// recognized absolute http(s) URLs — i.e. relative links like
// "[Point Loma](/communities/point-loma-real-estate)".
const UNPARSED_RELATIVE_LINK_RE = /\[[^\]]+\]\(\/[^)\s]*\)/

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

type Block = { _type: string; children?: Array<{ text?: string }> }

function blockHasUnparsedLink(block: Block): boolean {
  return block._type === 'block' &&
    (block.children ?? []).some((c) => UNPARSED_RELATIVE_LINK_RE.test(c.text ?? ''))
}

/**
 * GET/POST /api/content/repair-links?secret=...
 *
 * One-off repair for blog posts published while markdown-link parsing only
 * handled absolute URLs: rebuilds just the body blocks that still contain
 * literal "[text](/path)" syntax, so they render as real links. Blocks
 * without the problem (and non-block content) are left untouched.
 */
async function repair(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts = await writeClient.fetch<Array<{
    _id: string
    slug?: string
    body?: Block[]
  }>>(`*[_type == "blogPost" && defined(body)]{ _id, "slug": slug.current, body }`)

  const repaired: Array<{ _id: string; slug?: string; blocksFixed: number }> = []

  for (const post of posts) {
    const body = post.body ?? []
    if (!body.some(blockHasUnparsedLink)) continue

    let blocksFixed = 0
    const newBody = body.map((block) => {
      if (!blockHasUnparsedLink(block)) return block
      // Round-trip a single block: markdown restores existing link markDefs
      // as [text](url), then the (fixed) parser rebuilds every link — old
      // and previously-unparsed relative ones alike — preserving the style.
      const rebuilt = markdownToPortableText(portableTextToMarkdown([block]))[0]
      if (!rebuilt) return block
      blocksFixed++
      return rebuilt
    })

    await writeClient.patch(post._id).set({ body: newBody }).commit()
    repaired.push({ _id: post._id, slug: post.slug, blocksFixed })

    if (post.slug) revalidatePath(`/blog/${post.slug}`)
  }

  if (repaired.length > 0) revalidatePath('/blog')

  return NextResponse.json({ ok: true, scanned: posts.length, repaired })
}

export async function GET(request: NextRequest) {
  return repair(request)
}

export async function POST(request: NextRequest) {
  return repair(request)
}

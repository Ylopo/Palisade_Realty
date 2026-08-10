import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { client, writeClient } from '@/lib/sanity/client'
import { waitForCdn } from '@/lib/sanity/cdn-sync'
import { portableTextToMarkdown, markdownToPortableText } from '@/lib/portable-text-utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Admin body-editing tool. Round-trips a post's body through markdown, applies
 * literal find→replace edits, and converts back with the link-aware parser —
 * so any legacy literal [text](url) links and inline [SELLER_CTA: ...] macros
 * in the body get repaired as a side effect of the round trip.
 *
 * GET  /api/content/edit-post?secret=...&preset=<name>[&dryRun=1]
 * POST /api/content/edit-post?secret=...   { postId, replacements: [{find, replace}], dryRun? }
 */

interface Replacement { find: string; replace: string }

const FIRST_POST_ID = 'isvxExfKGAZ4WMrYLtWn5k'
const FASTEXPERT_URL = 'https://www.fastexpert.com/blog/san-diego-housing-market'
const FREDDIE_URL = 'https://www.freddiemac.com/pmms'
const VA_URL = 'https://www.va.gov/housing-assistance/home-loans/'

// One-off edits for the first published post: outbound source citations,
// a proper named Sources line, and stripping literal **bold** markers.
const PRESETS: Record<string, { postId: string; replacements: Replacement[] }> = {
  'first-post-sources': {
    postId: FIRST_POST_ID,
    replacements: [
      {
        find: 'Median home prices in San Diego are projected to reach around $1,050,000 by late 2026, reflecting roughly 3% year-over-year growth.',
        replace: `Median home prices in San Diego are projected to reach around $1,050,000 by late 2026, reflecting roughly 3% year-over-year growth, according to [FastExpert's San Diego housing market forecast](${FASTEXPERT_URL}).`,
      },
      {
        find: 'Current 30-year fixed rates are running between 6.0% and 6.8%, with a gradual easing expected as the year progresses.',
        replace: `Current 30-year fixed rates are running between 6.0% and 6.8%, with a gradual easing expected as the year progresses — you can track the weekly national average through [Freddie Mac's Primary Mortgage Market Survey](${FREDDIE_URL}).`,
      },
      {
        find: 'the combination of more inventory and VA loan eligibility',
        replace: `the combination of more inventory and [VA loan](${VA_URL}) eligibility`,
      },
      { find: '**Buyers:**', replace: 'Buyers:' },
      { find: '**Sellers:**', replace: 'Sellers:' },
      { find: '**Homeowners staying put:**', replace: 'Homeowners staying put:' },
      { find: '**Investors:**', replace: 'Investors:' },
      {
        find: `Source: [Web](${FASTEXPERT_URL})`,
        replace: `Sources: [FastExpert — San Diego Housing Market Forecast](${FASTEXPERT_URL}), [Freddie Mac — Primary Mortgage Market Survey](${FREDDIE_URL}), [U.S. Department of Veterans Affairs — VA Home Loans](${VA_URL})`,
      },
    ],
  },
}

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

async function applyEdits(postId: string, replacements: Replacement[], dryRun: boolean) {
  const post = await writeClient.fetch<{
    _id: string
    slug?: string
    body?: Array<{ _type: string }>
  } | null>(`*[_id == $postId][0]{ _id, "slug": slug.current, body }`, { postId })

  if (!post?.body) {
    return NextResponse.json({ error: `Post ${postId} not found or has no body` }, { status: 404 })
  }
  if (post.body.some((b) => b._type !== 'block')) {
    return NextResponse.json(
      { error: 'Body contains non-block content — markdown round-trip would drop it; refusing.' },
      { status: 400 },
    )
  }

  let markdown = portableTextToMarkdown(post.body)
  const applied: string[] = []
  const missed: string[] = []

  for (const { find, replace } of replacements) {
    if (markdown.includes(find)) {
      markdown = markdown.split(find).join(replace)
      applied.push(find.slice(0, 80))
    } else {
      missed.push(find.slice(0, 80))
    }
  }

  const newBody = markdownToPortableText(markdown)

  let cdnSynced: boolean | undefined
  if (!dryRun) {
    await writeClient.patch(post._id).set({ body: newBody }).commit()
    // The public pages read through Sanity's CDN, which lags writes — wait for
    // the new body to be visible there before revalidating, or Next re-caches
    // the stale version for an hour.
    const expected = JSON.stringify(newBody)
    cdnSynced = await waitForCdn(async () => {
      const cdnBody = await client.fetch(`*[_id == $postId][0].body`, { postId: post._id })
      return JSON.stringify(cdnBody) === expected
    })
    revalidatePath('/blog')
    if (post.slug) revalidatePath(`/blog/${post.slug}`)
  }

  return NextResponse.json({ ok: true, dryRun, postId: post._id, slug: post.slug, applied, missed, cdnSynced })
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const presetName = request.nextUrl.searchParams.get('preset') ?? ''
  const preset = PRESETS[presetName]
  if (!preset) {
    return NextResponse.json({ error: `Unknown preset. Available: ${Object.keys(PRESETS).join(', ')}` }, { status: 400 })
  }
  const dryRun = request.nextUrl.searchParams.get('dryRun') === '1'
  return applyEdits(preset.postId, preset.replacements, dryRun)
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => null) as
    | { postId?: string; replacements?: Replacement[]; dryRun?: boolean }
    | null
  if (!body?.postId || !Array.isArray(body.replacements)) {
    return NextResponse.json({ error: 'postId and replacements[] are required' }, { status: 400 })
  }
  return applyEdits(body.postId, body.replacements, Boolean(body.dryRun))
}

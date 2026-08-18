import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { Redis } from '@upstash/redis'
import { writeClient } from '@/lib/sanity/client'
import { EXPANSION_QUEUE } from '@/lib/expansion-queue'
import { buildExpansionPage } from '@/lib/expansion-writer'
import { sourcePageImages } from '@/lib/expansion-images'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Each page = Tavily research + a full Opus write (~1-3 min); pages run in
// parallel so a 5-page day fits comfortably.
export const maxDuration = 600

const PAGES_PER_RUN = 5
const ENABLED_KEY = 'hps:expansion:enabled'

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

async function builtSlugs(): Promise<Set<string>> {
  const slugs = await writeClient.fetch<string[]>(`*[_type == "communityPage"].slug.current`)
  return new Set(slugs)
}

async function runBatch(count: number) {
  const built = await builtSlugs()
  const pending = EXPANSION_QUEUE.filter((e) => !built.has(e.slug))
  const batch = pending.slice(0, count)

  if (batch.length === 0) {
    return { built: [], remaining: 0, message: 'Queue complete — every expansion page has been built.' }
  }

  const results = await Promise.allSettled(batch.map((entry) => buildExpansionPage(entry)))

  const succeeded: string[] = []
  const failed: Array<{ slug: string; error: string }> = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      succeeded.push(batch[i].slug)
      revalidatePath(`/communities/${batch[i].slug}`)
    } else {
      failed.push({ slug: batch[i].slug, error: r.reason instanceof Error ? r.reason.message : String(r.reason) })
      console.error('[expansion-pages] failed:', batch[i].slug, r.reason)
    }
  })
  revalidatePath('/sitemap.xml')

  return {
    built: succeeded,
    failed: failed.length > 0 ? failed : undefined,
    remaining: pending.length - succeeded.length,
    totalQueue: EXPANSION_QUEUE.length,
  }
}

/**
 * GET — Vercel cron (Bearer CRON_SECRET). Builds the next PAGES_PER_RUN queue
 * entries, but only while the rollout is enabled (hps:expansion:enabled in
 * Redis) — the switch stays off until the first page's format is approved.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const enabled = await getRedis().get(ENABLED_KEY)
  if (String(enabled) !== '1') {
    return NextResponse.json({ skipped: true, reason: 'Expansion rollout is not enabled (hps:expansion:enabled != 1)' })
  }

  try {
    return NextResponse.json(await runBatch(PAGES_PER_RUN))
  } catch (err) {
    console.error('[expansion-pages][cron]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'run failed' }, { status: 500 })
  }
}

/**
 * POST — admin actions (?secret=ADMIN_SECRET):
 *   { "action": "run", "count": 1, "slug": "escondido-real-estate"? }  → build now (specific slug or next N)
 *   { "action": "enable" } / { "action": "disable" }                   → flip the daily cron switch
 *   { "action": "status" }                                             → queue progress
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as { action?: string; count?: number; slug?: string }

  try {
    if (body.action === 'enable' || body.action === 'disable') {
      await getRedis().set(ENABLED_KEY, body.action === 'enable' ? '1' : '0')
      return NextResponse.json({ ok: true, enabled: body.action === 'enable' })
    }

    if (body.action === 'status') {
      const built = await builtSlugs()
      const enabled = await getRedis().get(ENABLED_KEY)
      return NextResponse.json({
        enabled: String(enabled) === '1',
        built: EXPANSION_QUEUE.filter((e) => built.has(e.slug)).map((e) => e.slug),
        next: EXPANSION_QUEUE.filter((e) => !built.has(e.slug)).slice(0, 5).map((e) => e.slug),
        progress: `${built.size}/${EXPANSION_QUEUE.length}`,
      })
    }

    if (body.action === 'images') {
      // Backfill licensed local photos onto an existing page without
      // rewriting its content.
      if (!body.slug) return NextResponse.json({ error: 'slug is required' }, { status: 400 })
      const doc = await writeClient.fetch<{ _id: string; name?: string; pageType?: string } | null>(
        `*[_type == "communityPage" && slug.current == $slug][0]{ _id, name, pageType }`,
        { slug: body.slug }
      )
      if (!doc) return NextResponse.json({ error: `No page for slug: ${body.slug}` }, { status: 404 })
      const images = await sourcePageImages(doc.name ?? body.slug, doc.pageType ?? 'community', 2)
      await writeClient.patch(doc._id).set({ images: images.map((img, i) => ({ _key: `img-${i}`, ...img })) }).commit()
      revalidatePath(`/communities/${body.slug}`)
      return NextResponse.json({ ok: true, slug: body.slug, images: images.map((i) => ({ alt: i.alt, credit: i.credit, license: i.license })) })
    }

    if (body.action === 'run') {
      if (body.slug) {
        const entry = EXPANSION_QUEUE.find((e) => e.slug === body.slug)
        if (!entry) return NextResponse.json({ error: `Unknown slug: ${body.slug}` }, { status: 400 })
        const result = await buildExpansionPage(entry)
        revalidatePath(`/communities/${entry.slug}`)
        return NextResponse.json({ built: [result.slug] })
      }
      return NextResponse.json(await runBatch(Math.min(body.count ?? 1, PAGES_PER_RUN)))
    }

    return NextResponse.json({ error: 'action must be run | images | enable | disable | status' }, { status: 400 })
  } catch (err) {
    console.error('[expansion-pages][admin]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'action failed' }, { status: 500 })
  }
}

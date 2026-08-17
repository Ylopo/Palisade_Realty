/**
 * lib/oneup-analytics.ts
 *
 * Unified cross-platform analytics for the admin dashboard, sourced from
 * OneUp's analytics API at `analyze.oneupapp.io` (a separate host from the
 * publish/status API in `lib/oneup-client.ts`, which lives at
 * `www.oneupapp.io/api`).
 *
 * Verified contract (docs.oneupapp.io → Analytics, confirmed live against
 * this client's accounts):
 *
 *   GET https://analyze.oneupapp.io/api/{platform}/overview
 *       ?apiKey=...&social_network_id=...&preset=last_30_days
 *
 *   → { success: true, data: { metrics: [
 *         { key, name, value_current_period, value_last_period,
 *           percentage_change: "+36%", description }, ... ],
 *       // youtube also returns: total_subscribers, video_performance
 *     } }
 *
 * Auth is the shared ONEUP_API_KEY plus the PER-ACCOUNT social_network_id
 * (NOT the category id). Analytics requires OneUp's Intermediate plan or
 * higher — on Basic the endpoints error, which surfaces here as null
 * (rendered as "Awaiting first metrics" per platform, never a crash).
 *
 * LinkedIn and X are intentionally excluded — their OneUp account IDs are
 * not yet provisioned for this client (see CLAUDE.md).
 */

const ANALYTICS_BASE_URL = 'https://analyze.oneupapp.io/api'

export type OneUpPlatform = 'youtube' | 'facebook' | 'tiktok' | 'instagram'
export type OneUpAnalyticsPeriod = 'last_30_days' | 'last_7_days'

export interface OneUpTopPost {
  title: string
  reach: number
}

export interface OneUpPlatformAnalytics {
  reach: number
  changePercent: number
  topPost?: OneUpTopPost
}

const PLATFORMS: OneUpPlatform[] = ['youtube', 'facebook', 'tiktok', 'instagram']

/** Per-platform OneUp social_network_id (set when each account was connected). */
const ACCOUNT_ID_ENV: Record<OneUpPlatform, string | undefined> = {
  facebook: process.env.ONEUP_FACEBOOK_ACCOUNT_ID,
  instagram: process.env.ONEUP_INSTAGRAM_ACCOUNT_ID,
  tiktok: process.env.ONEUP_TIKTOK_ACCOUNT_ID,
  youtube: process.env.ONEUP_YOUTUBE_CHANNEL_ID,
}

/**
 * The metric that best represents "reach" per platform, in preference order —
 * confirmed against live responses (Facebook exposes page-level media views,
 * TikTok/YouTube expose views, Instagram exposes reach).
 */
const REACH_METRIC_KEYS: Record<OneUpPlatform, string[]> = {
  facebook: ['page_total_media_view_unique', 'page_media_view', 'page_views_total'],
  instagram: ['reach', 'impressions', 'views'],
  tiktok: ['views'],
  youtube: ['views'],
}

interface OverviewMetric {
  key?: string
  name?: string
  value_current_period?: number | string
  value_last_period?: number | string
  percentage_change?: string | number
  description?: string
}

interface OverviewResponse {
  success?: boolean
  message?: string
  data?: {
    metrics?: OverviewMetric[]
    video_performance?: {
      most_viewed?: Array<{ title?: string; name?: string; views?: number | string; value?: number | string }>
    }
  }
}

function toNumber(value: number | string | undefined): number {
  if (value === undefined || value === null) return 0
  const n = Number(String(value).replace(/[,%+]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/** "+40,350%" → 40350, "-53%" → -53, "0%" → 0 */
function parseChangePercent(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0
  const n = Number(String(value).replace(/[,%\s]/g, ''))
  return Number.isFinite(n) ? Math.round(n) : 0
}

async function fetchPlatformAnalytics(
  platform: OneUpPlatform,
  period: OneUpAnalyticsPeriod,
  apiKey: string,
  socialNetworkId: string
): Promise<OneUpPlatformAnalytics | null> {
  try {
    const url = new URL(`${ANALYTICS_BASE_URL}/${platform}/overview`)
    url.searchParams.set('apiKey', apiKey)
    url.searchParams.set('social_network_id', socialNetworkId)
    url.searchParams.set('preset', period)

    const res = await fetch(url.toString(), { next: { revalidate: 900 } })
    if (!res.ok) {
      console.error(`[oneup-analytics] ${platform} HTTP ${res.status}`)
      return null
    }

    const data = (await res.json().catch(() => null)) as OverviewResponse | null
    if (!data?.success || !Array.isArray(data.data?.metrics)) {
      console.error(`[oneup-analytics] ${platform} unexpected response`, data?.message ?? '')
      return null
    }

    const metrics = data.data.metrics
    const byKey = new Map(metrics.map((m) => [m.key ?? '', m]))

    let reachMetric: OverviewMetric | undefined
    for (const key of REACH_METRIC_KEYS[platform]) {
      const m = byKey.get(key)
      if (m && m.value_current_period !== undefined) { reachMetric = m; break }
    }

    // YouTube's overview includes a most-viewed video list when available.
    const mostViewed = data.data.video_performance?.most_viewed?.[0]
    const topPost: OneUpTopPost | undefined = mostViewed
      ? {
          title: mostViewed.title ?? mostViewed.name ?? 'Top video',
          reach: toNumber(mostViewed.views ?? mostViewed.value),
        }
      : undefined

    return {
      reach: toNumber(reachMetric?.value_current_period),
      changePercent: parseChangePercent(reachMetric?.percentage_change),
      topPost,
    }
  } catch (err) {
    console.error(`[oneup-analytics] ${platform} threw`, err)
    return null
  }
}

/**
 * Fetches unified analytics for all four OneUp-analytics-supported platforms
 * in parallel. Each platform is wrapped independently — one platform's
 * failure (missing account id, plan gate, transient API error) returns
 * `null` for that platform only and never throws or blocks the others.
 */
export async function getAllPlatformAnalytics(
  period: OneUpAnalyticsPeriod
): Promise<Record<OneUpPlatform, OneUpPlatformAnalytics | null>> {
  const apiKey = process.env.ONEUP_API_KEY
  if (!apiKey) {
    return { youtube: null, facebook: null, tiktok: null, instagram: null }
  }

  const results = await Promise.all(
    PLATFORMS.map((platform) => {
      const accountId = ACCOUNT_ID_ENV[platform]
      if (!accountId) return Promise.resolve(null)
      return fetchPlatformAnalytics(platform, period, apiKey, accountId).catch((err) => {
        console.error(`[oneup-analytics] ${platform} rejected unexpectedly`, err)
        return null
      })
    })
  )

  return {
    youtube: results[0],
    facebook: results[1],
    tiktok: results[2],
    instagram: results[3],
  }
}

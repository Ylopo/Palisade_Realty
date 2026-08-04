/**
 * lib/oneup-analytics.ts
 *
 * Unified cross-platform analytics for the admin dashboard, sourced from
 * OneUp's analytics API at `analyze.oneupapp.io` (a separate host from the
 * publish/status API in `lib/oneup-client.ts`, which lives at
 * `www.oneupapp.io/api`).
 *
 * GUESS / best-effort notice: OneUp's public docs describe this host as
 * providing "unified metrics for YouTube, Facebook, TikTok, Instagram" but
 * don't publish an exact REST path or response shape alongside the main
 * publish API docs used to build `lib/oneup-client.ts`. The request shape
 * below (`GET /api/analytics/{platform}?apiKey=...&category_id=...&period=...`)
 * and the response field names it tries (`reach`/`total_reach`/`impressions`,
 * `change_percent`, `top_post`/`topPost`) are a reasonable guess based on
 * OneUp's other endpoints' conventions (apiKey + category_id query auth,
 * snake_case JSON), NOT a confirmed contract. If the real endpoint differs,
 * every platform will simply come back `null` (see below) until this is
 * corrected against a live account with analytics enabled.
 *
 * LinkedIn and X are intentionally excluded — per the source system's
 * documented scope, OneUp's analytics API only unifies YouTube, Facebook,
 * TikTok, and Instagram.
 *
 * Analytics must be manually enabled per OneUp category (a known
 * multi-hour turnaround) — so every platform call is independently
 * try/caught. One platform being not-yet-enabled (or erroring for any other
 * reason) must not take down the other three; it returns `null` for that
 * platform only, and the dashboard should render that as an "OFFLINE" badge
 * rather than crashing the page.
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

function getApiKey(): string | null {
  return process.env.ONEUP_API_KEY ?? null
}

function getCategoryId(): string | null {
  return process.env.ONEUP_CATEGORY_ID ?? null
}

// Loose shape — the actual response contract is unconfirmed (see file header).
interface RawAnalyticsPost {
  title?: string
  caption?: string
  content?: string
  reach?: number | string
  impressions?: number | string
}

interface RawAnalyticsResponse {
  error?: boolean | string
  message?: string
  reach?: number | string
  total_reach?: number | string
  impressions?: number | string
  change_percent?: number | string
  reach_change_percent?: number | string
  top_post?: RawAnalyticsPost
  topPost?: RawAnalyticsPost
  posts?: RawAnalyticsPost[]
}

function toNumber(value: number | string | undefined): number {
  if (value === undefined) return 0
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

async function fetchPlatformAnalytics(
  platform: OneUpPlatform,
  period: OneUpAnalyticsPeriod,
  apiKey: string,
  categoryId: string
): Promise<OneUpPlatformAnalytics | null> {
  try {
    const url = new URL(`${ANALYTICS_BASE_URL}/analytics/${platform}`)
    url.searchParams.set('apiKey', apiKey)
    url.searchParams.set('category_id', categoryId)
    url.searchParams.set('period', period)

    const res = await fetch(url.toString())
    if (!res.ok) {
      console.error(`[oneup-analytics] ${platform} HTTP ${res.status}`)
      return null
    }

    const data = (await res.json().catch(() => null)) as RawAnalyticsResponse | null
    if (!data || data.error) {
      console.error(`[oneup-analytics] ${platform} returned an error`, data?.message)
      return null
    }

    const reach = toNumber(data.reach ?? data.total_reach ?? data.impressions)
    const changePercent = toNumber(data.change_percent ?? data.reach_change_percent)

    const rawTopPost = data.top_post ?? data.topPost ?? data.posts?.[0]
    const topPost: OneUpTopPost | undefined = rawTopPost
      ? {
          title: rawTopPost.title ?? rawTopPost.caption ?? rawTopPost.content ?? 'Untitled post',
          reach: toNumber(rawTopPost.reach ?? rawTopPost.impressions),
        }
      : undefined

    return { reach, changePercent, topPost }
  } catch (err) {
    // Covers: analytics not yet enabled for this category (a known,
    // multi-hour manual OneUp step), network failure, malformed response.
    console.error(`[oneup-analytics] ${platform} threw`, err)
    return null
  }
}

/**
 * Fetches unified analytics for all four OneUp-analytics-supported platforms
 * in parallel. Each platform is wrapped independently — one platform's
 * failure (most commonly: analytics not yet enabled on this OneUp category)
 * returns `null` for that platform only and never throws or blocks the
 * others.
 */
export async function getAllPlatformAnalytics(
  period: OneUpAnalyticsPeriod
): Promise<Record<OneUpPlatform, OneUpPlatformAnalytics | null>> {
  const apiKey = getApiKey()
  const categoryId = getCategoryId()

  if (!apiKey || !categoryId) {
    return { youtube: null, facebook: null, tiktok: null, instagram: null }
  }

  const results = await Promise.all(
    PLATFORMS.map((platform) =>
      fetchPlatformAnalytics(platform, period, apiKey, categoryId).catch((err) => {
        console.error(`[oneup-analytics] ${platform} rejected unexpectedly`, err)
        return null
      })
    )
  )

  return {
    youtube: results[0],
    facebook: results[1],
    tiktok: results[2],
    instagram: results[3],
  }
}

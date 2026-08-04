/**
 * lib/refresh-engine.ts
 *
 * Best-effort content-refresh scoring for the admin "Refresh Queue" — a
 * simple, from-scratch implementation of the *concept* (evaluate every
 * published post, flag the stale ones, hand back a prioritized to-do list
 * with a rewrite checklist), not a port of any unseen source-repo scoring
 * system.
 *
 * NOTE ON FILE NAME / SHAPE: two sibling-built consumers already exist and
 * both import types from this exact path —
 * `app/admin/refresh-queue/page.tsx` and `lib/email.ts` (`sendRefreshDigest`)
 * — so this file is named and shaped to match what they already expect
 * (`RefreshCandidate.recommendedAction` / `.refreshTier` / `.isOverdue` /
 * `.daysUntilDue` / `.nextReviewDate`, etc.), rather than the originally
 * planned `lib/refresh-evaluation.ts` / `RefreshCandidate.action` /
 * `.tier` shape.
 *
 * Scoring model (kept intentionally simple):
 *   1. Each `refreshTier` maps to a review-interval in days (how overdue a
 *      post can get before it needs attention).
 *   2. `ageInDays` = days since `lastRefreshedAt` (or `publishedAt` if the
 *      post has never been refreshed).
 *   3. `overdueRatio` = ageInDays / interval. 0 = just refreshed / published,
 *      1.0 = exactly at the review interval, >1 = overdue.
 *   4. `priorityScore` = clamp(overdueRatio * 65, 0, 100) + a small category
 *      bump for categories that date fastest (`market-update`, `financing`),
 *      then clamped again to [0, 100].
 *   5. `recommendedAction` is derived directly from the final `priorityScore`
 *      via the thresholds below.
 *
 * A post is excluded entirely if `refreshExcluded` is true (checked in the
 * Sanity query) or if it has an active 30-day skip snooze in Redis (set by
 * `app/api/content/refresh-skip/route.ts`).
 */

import { writeClient } from '@/lib/sanity/client'
import { Redis } from '@upstash/redis'
import type { ArticleCategory } from '@/lib/types'

export type RefreshTier =
  | 'fast-changing'
  | 'news-trend'
  | 'competitive'
  | 'money-page'
  | 'pillar'
  | 'seasonal'
  | 'evergreen'

export type RefreshAction = 'full-refresh' | 'light-refresh' | 'review-only' | 'do-not-touch'

export interface RefreshCandidate {
  postId: string
  title: string
  slug: string
  category: string
  refreshTier: RefreshTier
  recommendedAction: RefreshAction
  priorityScore: number
  ageInDays: number
  isOverdue: boolean
  /** Days remaining until the next review is due. Negative when already overdue. */
  daysUntilDue: number
  /** ISO datetime of the next scheduled review (referenceDate + tier interval). */
  nextReviewDate: string
  refreshCount: number
  refreshReasons: string[]
  playbook: string[]
}

/** Review interval per tier, in days. `seasonal` is simplified to 180 for now (pre-season-peak nuance not modeled). */
const TIER_INTERVAL_DAYS: Record<RefreshTier, number> = {
  evergreen: 365,
  pillar: 180,
  competitive: 180,
  seasonal: 180,
  'fast-changing': 90,
  'money-page': 120,
  'news-trend': 60,
}

/** Default tier when a post has no `refreshTier` set, inferred from its category. */
const CATEGORY_DEFAULT_TIER: Partial<Record<ArticleCategory, RefreshTier>> = {
  'market-update': 'fast-changing',
  financing: 'fast-changing',
  news: 'news-trend',
  events: 'news-trend',
  'buying-tips': 'pillar',
  'selling-tips': 'pillar',
  'community-development': 'competitive',
  'community-spotlight': 'evergreen',
  'local-interest': 'evergreen',
  'local-history': 'evergreen',
  'home-ownership': 'evergreen',
  lifestyle: 'evergreen',
  'waterfront-living': 'evergreen',
  investment: 'money-page',
  'cost-breakdown': 'money-page',
  'flood-and-risk': 'competitive',
}

/** Categories that date fastest — small score bump beyond what the tier interval already implies. */
const FAST_DATING_CATEGORIES = new Set<string>(['market-update', 'financing'])
const FAST_DATING_BUMP = 10

const TIER_LABEL: Record<RefreshTier, string> = {
  evergreen: 'Evergreen',
  pillar: 'Pillar',
  competitive: 'Competitive',
  'fast-changing': 'Fast-Changing',
  seasonal: 'Seasonal',
  'news-trend': 'News/Trend',
  'money-page': 'Money Page',
}

interface RawBlogPost {
  _id: string
  title: string
  slug: string | null
  category: string | null
  refreshTier: RefreshTier | null
  lastRefreshedAt: string | null
  publishedAt: string | null
  refreshCount: number | null
}

const PUBLISHED_POSTS_QUERY = `*[_type == "blogPost" && workflowStatus == "published" && refreshExcluded != true]{
  _id,
  title,
  "slug": slug.current,
  category,
  refreshTier,
  lastRefreshedAt,
  publishedAt,
  refreshCount
}`

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function skipKey(postId: string): string {
  return `hps:refresh:skip:${postId}`
}

/**
 * Returns the set of postIds currently snoozed via `refresh-skip` (30-day
 * TTL keys in Redis). Redis being unreachable is treated as "nothing is
 * snoozed" rather than failing the whole evaluation.
 */
async function getSkippedPostIds(postIds: string[]): Promise<Set<string>> {
  const redis = getRedis()
  if (!redis || postIds.length === 0) return new Set()

  try {
    const flags = await Promise.all(postIds.map((id) => redis.exists(skipKey(id))))
    const skipped = new Set<string>()
    postIds.forEach((id, i) => {
      if (flags[i]) skipped.add(id)
    })
    return skipped
  } catch (err) {
    console.error('[refresh-engine] failed to read skip snooze keys', err)
    return new Set()
  }
}

function resolveTier(category: string | null, refreshTier: RefreshTier | null): RefreshTier {
  if (refreshTier && refreshTier in TIER_INTERVAL_DAYS) return refreshTier
  return CATEGORY_DEFAULT_TIER[category as ArticleCategory] ?? 'evergreen'
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function actionFromScore(score: number): RefreshAction {
  if (score >= 70) return 'full-refresh'
  if (score >= 40) return 'light-refresh'
  if (score >= 20) return 'review-only'
  return 'do-not-touch'
}

function formatAge(days: number): string {
  if (days < 30) return `${days} day${days === 1 ? '' : 's'}`
  const months = Math.round(days / 30.44)
  return `${months} month${months === 1 ? '' : 's'}`
}

function buildReasons(opts: {
  ageInDays: number
  lastRefreshedAt: string | null
  intervalDays: number
  overdueRatio: number
  tier: RefreshTier
  category: string | null
  categoryBumped: boolean
}): string[] {
  const reasons: string[] = []
  const ageLabel = formatAge(Math.max(opts.ageInDays, 0))

  reasons.push(
    opts.lastRefreshedAt
      ? `Last refreshed ${ageLabel} ago`
      : `Published ${ageLabel} ago and never refreshed`
  )

  reasons.push(`${TIER_LABEL[opts.tier]} content typically needs review every ${Math.round(opts.intervalDays / 30.44)} months`)

  if (opts.overdueRatio >= 1) {
    const pctOverdue = Math.round((opts.overdueRatio - 1) * 100)
    reasons.push(
      pctOverdue > 0
        ? `Currently ${pctOverdue}% past its review interval`
        : 'Just reached its review interval'
    )
  } else {
    reasons.push(`${Math.round(opts.overdueRatio * 100)}% of the way to its next scheduled review`)
  }

  if (opts.categoryBumped) {
    reasons.push(`Category (${opts.category}) typically needs the most frequent updates — figures and rates go stale fast`)
  }

  return reasons
}

const BASE_PLAYBOOK = [
  'Update any dated statistics or dollar figures',
  'Re-verify community/school links still resolve',
  'Check if a more recent comparable post exists to cross-link',
  'Confirm the featured/hero image still looks current',
]

const CATEGORY_PLAYBOOK_EXTRAS: Record<string, string[]> = {
  'market-update': ['Refresh median price, inventory, and days-on-market figures with the latest data'],
  financing: ['Update interest rate and loan-limit figures to current values'],
  'buying-tips': ['Confirm any referenced program eligibility rules or limits are still accurate'],
  'selling-tips': ['Confirm any referenced closing-cost or commission figures are still accurate'],
}

function buildPlaybook(category: string | null, action: RefreshAction): string[] {
  const playbook = [...BASE_PLAYBOOK]
  const extra = category ? CATEGORY_PLAYBOOK_EXTRAS[category] : undefined
  if (extra) playbook.push(...extra)

  if (action === 'full-refresh') {
    playbook.push('Consider rewriting the intro to reflect current market conditions')
  }
  if (action === 'review-only') {
    return playbook.slice(0, 3)
  }

  return playbook.slice(0, 6)
}

/**
 * Evaluates every published, non-excluded, non-snoozed `blogPost` and
 * returns a prioritized refresh queue (highest `priorityScore` first).
 */
export async function evaluateRefreshCandidates(): Promise<RefreshCandidate[]> {
  const posts = await writeClient.fetch<RawBlogPost[]>(PUBLISHED_POSTS_QUERY)
  if (!posts || posts.length === 0) return []

  const skipped = await getSkippedPostIds(posts.map((p) => p._id))
  const now = new Date()

  const candidates: RefreshCandidate[] = []

  for (const post of posts) {
    if (skipped.has(post._id)) continue
    if (!post.slug) continue

    const tier = resolveTier(post.category, post.refreshTier)
    const intervalDays = TIER_INTERVAL_DAYS[tier]

    const referenceDateStr = post.lastRefreshedAt ?? post.publishedAt
    const referenceDate = referenceDateStr ? new Date(referenceDateStr) : now
    const ageInDays = Math.max(daysBetween(referenceDate, now), 0)
    const overdueRatio = intervalDays > 0 ? ageInDays / intervalDays : 0

    const categoryBumped = Boolean(post.category && FAST_DATING_CATEGORIES.has(post.category))
    const rawScore = overdueRatio * 65 + (categoryBumped ? FAST_DATING_BUMP : 0)
    const priorityScore = Math.round(clamp(rawScore, 0, 100))

    const recommendedAction = actionFromScore(priorityScore)

    const nextReviewDate = new Date(referenceDate.getTime() + intervalDays * 24 * 60 * 60 * 1000)
    const daysUntilDue = intervalDays - ageInDays

    candidates.push({
      postId: post._id,
      title: post.title,
      slug: post.slug,
      category: post.category ?? 'uncategorized',
      refreshTier: tier,
      recommendedAction,
      priorityScore,
      ageInDays,
      isOverdue: daysUntilDue < 0,
      daysUntilDue,
      nextReviewDate: nextReviewDate.toISOString(),
      refreshCount: post.refreshCount ?? 0,
      refreshReasons: buildReasons({
        ageInDays,
        lastRefreshedAt: post.lastRefreshedAt,
        intervalDays,
        overdueRatio,
        tier,
        category: post.category,
        categoryBumped,
      }),
      playbook: buildPlaybook(post.category, recommendedAction),
    })
  }

  return candidates.sort((a, b) => b.priorityScore - a.priorityScore)
}

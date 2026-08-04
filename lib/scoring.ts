/**
 * lib/scoring.ts
 *
 * Deterministic scoring helpers for the idea engine.
 * The LLM scoring dimensions (localRelevance, formatFit, audienceValue, seoPotential)
 * are computed inside the Claude batch call in research.ts.
 * This module handles the deterministic dimensions and final assembly.
 *
 * Scoring dimensions (100 pts total):
 *   localRelevance    0–25  (LLM)
 *   timeliness        0–20  (deterministic — from publishedDate)
 *   formatFit         0–15  (LLM)
 *   audienceValue     0–15  (LLM)
 *   sourceCredibility 0–10  (deterministic — from domain)
 *   novelty           0–10  (deterministic — from covered topics)
 *   seoPotential      0–5   (LLM)
 */

import { sourceCredibilityScore, sourceBonus, isDisqualified } from '@/lib/source-rules'
import type { IdeaScore, IdeaUrgency } from '@/lib/types'

// ─── Timeliness ───────────────────────────────────────────────────────────────

/**
 * Score 0–20 based on how recently the source was published.
 * Also returns the urgency classification.
 */
export function computeTimeliness(publishedDate?: string): { score: number; urgency: IdeaUrgency } {
  if (!publishedDate) return { score: 8, urgency: 'evergreen' }

  const published = new Date(publishedDate)
  const now = new Date()
  const hoursDiff = (now.getTime() - published.getTime()) / (1000 * 60 * 60)

  if (hoursDiff < 6)   return { score: 20, urgency: 'breaking' }
  if (hoursDiff < 24)  return { score: 18, urgency: 'breaking' }
  if (hoursDiff < 48)  return { score: 16, urgency: 'timely' }
  if (hoursDiff < 72)  return { score: 14, urgency: 'timely' }
  if (hoursDiff < 168) return { score: 11, urgency: 'timely' }   // within 1 week
  if (hoursDiff < 336) return { score: 8,  urgency: 'evergreen' } // within 2 weeks
  if (hoursDiff < 720) return { score: 5,  urgency: 'evergreen' } // within 1 month
  return { score: 2, urgency: 'evergreen' }
}

// ─── Source credibility ───────────────────────────────────────────────────────

/**
 * Score 0–10 based on the primary source domain.
 * Caps at 10 regardless of bonus.
 */
export function computeSourceCredibility(domains: string[]): number {
  if (domains.length === 0) return 4

  // Use the highest-credibility domain in the set
  const scores = domains.map((d) => sourceCredibilityScore(d))
  return Math.max(...scores)
}

/**
 * Checks if ALL primary source domains are disqualified.
 * If so, the idea should be dropped entirely.
 */
export function shouldDisqualify(domains: string[]): boolean {
  if (domains.length === 0) return false
  return domains.every((d) => isDisqualified(d))
}

// ─── Novelty ─────────────────────────────────────────────────────────────────

/**
 * Score 0–10 based on how different this topic is from what we've already published.
 * Simple keyword overlap check against the covered topics set.
 */
export function computeNovelty(title: string, coveredTopics: Set<string>): number {
  if (coveredTopics.size === 0) return 10

  const words = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3)

  // Check how many covered topics share significant keyword overlap
  let maxOverlap = 0
  for (const topic of coveredTopics) {
    const topicWords = topic.split(/[-\s]+/).filter((w) => w.length > 3)
    const overlap = words.filter((w) => topicWords.includes(w)).length
    const overlapRatio = overlap / Math.min(words.length, topicWords.length)
    if (overlapRatio > maxOverlap) maxOverlap = overlapRatio
  }

  if (maxOverlap > 0.7) return 1   // near duplicate
  if (maxOverlap > 0.5) return 3   // significant overlap
  if (maxOverlap > 0.3) return 6   // some overlap, different angle
  if (maxOverlap > 0.1) return 8   // loosely related
  return 10                         // fresh topic
}

// ─── Near-duplicate title detection (queue de-flooding) ────────────────────────
//
// The daily research run turns several news articles about the SAME story into
// several near-identical idea titles, and the same ongoing story recurs day after
// day. computeNovelty only guards against *published* topics, so unpublished
// rephrasings accumulate in the pending queue. These helpers collapse those
// near-duplicates by comparing the meaningful subject words of two headlines.

// Geography + boilerplate that appears in nearly every San Diego headline —
// stripped before comparison so the actual subject drives similarity.
const TITLE_STOPWORDS = new Set([
  'san', 'diego', 'california', 'county', 'downtown', 'carmel', 'valley', 'mission',
  'chula', 'vista', 'point', 'loma', 'north', 'park', 'coronado', 'southern', 'news',
  'what', 'whats', 'your', 'youre', 'here', 'heres', 'that', 'thats', 'this', 'from', 'with', 'into', 'about',
  'really', 'matters', 'matter', 'need', 'needs', 'know', 'means', 'mean', 'right', 'now',
  '2026', '2027', 'every', 'even', 'still', 'when', 'where', 'which', 'while', 'because', 'though',
  'they', 'them', 'then', 'will', 'would', 'should', 'could', 'have', 'been',
])

function titleContentTokens(title: string): Set<string> {
  return new Set(
    title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter((w) => w.length > 3 && !TITLE_STOPWORDS.has(w))
  )
}

/**
 * Containment coefficient (0–1) of the two headlines' subject words:
 * shared meaningful tokens / size of the smaller token set.
 * Chosen over Jaccard so a short rephrasing that is a subset of a longer one
 * still scores high.
 */
export function titleSimilarity(a: string, b: string): number {
  const ta = titleContentTokens(a)
  const tb = titleContentTokens(b)
  const minSize = Math.min(ta.size, tb.size)
  if (minSize === 0) return 0
  let inter = 0
  for (const w of ta) if (tb.has(w)) inter++
  return inter / minSize
}

/**
 * At/above this containment, two headlines are treated as the same topic.
 * Tuned to 0.55: rephrasings of one story swap synonyms (e.g. "apartments" ↔
 * "project", "exceed limits" ↔ "breaks rules"), leaving only the core subject
 * words shared — while genuinely distinct topics stay at/below ~0.5.
 */
export const NEAR_DUPLICATE_THRESHOLD = 0.55

/** True if `title` is a near-duplicate of any headline in `existing`. */
export function isNearDuplicateTitle(
  title: string,
  existing: Iterable<string>,
  threshold = NEAR_DUPLICATE_THRESHOLD,
): boolean {
  for (const other of existing) {
    if (titleSimilarity(title, other) >= threshold) return true
  }
  return false
}

/**
 * Collapses near-duplicate items, keeping the FIRST occurrence of each topic.
 * Caller should pre-sort by score (descending) so the highest-scoring variant wins.
 */
export function collapseNearDuplicates<T>(
  items: T[],
  getTitle: (item: T) => string,
  threshold = NEAR_DUPLICATE_THRESHOLD,
): T[] {
  const kept: T[] = []
  const keptTitles: string[] = []
  for (const item of items) {
    const title = getTitle(item)
    if (isNearDuplicateTitle(title, keptTitles, threshold)) continue
    kept.push(item)
    keptTitles.push(title)
  }
  return kept
}

// ─── End-of-month event boost ─────────────────────────────────────────────────

/**
 * During the last week of each month (days 22–31), community and local news
 * posts get a scoring boost so event/attractions content surfaces above other
 * categories in the idea queue. Gives operators a heads-up for the upcoming
 * month's events.
 */
export function computeEndOfMonthEventBoost(category: string, now: Date = new Date()): number {
  const isEventCategory = category === 'community-spotlight' || category === 'news'
  if (!isEventCategory) return 0
  const day = now.getDate()
  if (day >= 25) return 15
  if (day >= 22) return 8
  return 0
}

// ─── Final assembly ───────────────────────────────────────────────────────────

export interface LLMDimensions {
  localRelevance: number   // 0–25
  formatFit: number        // 0–15
  audienceValue: number    // 0–15
  seoPotential: number     // 0–5
}

export function assembleScore(
  llm: LLMDimensions,
  timeliness: number,
  sourceCredibility: number,
  novelty: number,
  sourceDomains: string[],
  category?: string,
): IdeaScore {
  // Apply source bonus (caps individual dimension, not total)
  const bestBonus = sourceDomains.length > 0
    ? Math.max(...sourceDomains.map((d) => sourceBonus(d)))
    : 0

  const localRelevance   = Math.min(25, llm.localRelevance)
  const timelinessScore  = Math.min(20, timeliness)
  const formatFitScore   = Math.min(15, llm.formatFit + (bestBonus > 3 ? 1 : 0))
  const audienceScore    = Math.min(15, llm.audienceValue)
  const credScore        = Math.min(10, sourceCredibility)
  const noveltyScore     = Math.min(10, novelty)
  const seoScore         = Math.min(5,  llm.seoPotential)
  const eventBoost       = category ? computeEndOfMonthEventBoost(category) : 0

  const total = localRelevance + timelinessScore + formatFitScore + audienceScore + credScore + noveltyScore + seoScore + eventBoost

  return {
    total,
    localRelevance,
    timeliness:        timelinessScore,
    formatFit:         formatFitScore,
    audienceValue:     audienceScore,
    sourceCredibility: credScore,
    novelty:           noveltyScore,
    seoPotential:      seoScore,
  }
}

// ─── Threshold ────────────────────────────────────────────────────────────────

/** Ideas below this score are dropped before reaching the review queue. */
export const SCORE_THRESHOLD = 55

/** Ideas at or above this score are flagged as top picks in the review UI. */
export const TOP_PICK_THRESHOLD = 75

/** Ideas at or above this score with urgency='breaking' trigger an immediate alert. */
export const BREAKING_ALERT_THRESHOLD = 85

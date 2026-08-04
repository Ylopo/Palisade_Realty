/**
 * lib/dedupe.ts
 *
 * Lightweight near-duplicate title detection used by the research pipeline
 * to avoid re-queuing an idea that's phrased differently but covers the same
 * underlying story as something already sitting in the pending review queue.
 * (computeNovelty inside the scoring pass only compares against *published*
 * topics, so unpublished rephrasings of the same story would otherwise pile
 * up day after day.)
 */

/** Score at/above which a 'breaking' idea triggers an immediate email alert. */
export const BREAKING_ALERT_THRESHOLD = 85

/** Jaccard similarity (by word) at/above which two titles are treated as the same story. */
const SIMILARITY_THRESHOLD = 0.6

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(' ').filter(Boolean))
  const setB = new Set(b.split(' ').filter(Boolean))
  if (setA.size === 0 && setB.size === 0) return 1

  let intersection = 0
  for (const token of setA) {
    if (setB.has(token)) intersection++
  }
  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

/**
 * Returns true if `title` is an exact normalized match OR shares enough
 * words (Jaccard similarity >= SIMILARITY_THRESHOLD) with any title in
 * `existingTitles` to be considered the same underlying story.
 */
export function isNearDuplicateTitle(title: string, existingTitles: string[]): boolean {
  const normalized = normalizeTitle(title)
  if (!normalized) return false

  for (const existing of existingTitles) {
    const normalizedExisting = normalizeTitle(existing)
    if (!normalizedExisting) continue
    if (normalized === normalizedExisting) return true
    if (jaccardSimilarity(normalized, normalizedExisting) >= SIMILARITY_THRESHOLD) return true
  }
  return false
}

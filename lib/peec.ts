/**
 * lib/peec.ts — AEO visibility from Peec AI for the analytics dashboard.
 *
 * Peec tracks how often Palisade Realty is mentioned in AI-engine answers
 * (ChatGPT, Perplexity, AI Overviews, ...). "Visibility" is the share of
 * tracked AI answers that mention the brand (0-1 ratio; we display ×100).
 *
 * Auth: PEEC_API_TOKEN (company-scoped key) via the x-api-key header.
 * The project id is pinned to the verified Palisade Realty project — it is
 * not a secret, and an env override caused a wrong-client mixup once
 * (or_d8ed84e0... is Legacy Home Team), so the constant is authoritative.
 */

const PEEC_BASE = 'https://api.peec.ai/customer/v1'
const PALISADE_PROJECT_ID = 'or_5ee73fcf-8fbb-42ec-8115-66a28059a2ca'
const PALISADE_BRAND_ID = 'kw_13359a58-5771-49eb-99ab-32f04d787c4b' // is_own brand in that project

export interface AeoVisibility {
  /** Current 30-day visibility, percent (0-100). */
  currentPct: number
  /** Prior 30-day window visibility, percent. */
  previousPct: number
  /** currentPct - previousPct, percentage points. */
  deltaPts: number
  /** Raw mention count in the current window. */
  mentionCount: number
}

interface BrandRow {
  brand?: { id?: string; name?: string }
  visibility?: number
  mention_count?: number
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

async function fetchWindowVisibility(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<{ visibility: number; mentions: number } | null> {
  const res = await fetch(`${PEEC_BASE}/reports/brands?project_id=${PALISADE_PROJECT_ID}`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ start_date: startDate, end_date: endDate, limit: 100 }),
    next: { revalidate: 3600 },
  })
  if (!res.ok) {
    console.error(`[peec] brands report HTTP ${res.status}`)
    return null
  }
  const data = (await res.json()) as { data?: BrandRow[] }
  const own = data.data?.find((r) => r.brand?.id === PALISADE_BRAND_ID)
    ?? data.data?.find((r) => (r.brand?.name ?? '').toLowerCase().includes('palisade'))
  if (!own) return { visibility: 0, mentions: 0 } // tracked window exists, brand not yet mentioned
  return { visibility: own.visibility ?? 0, mentions: own.mention_count ?? 0 }
}

/**
 * Palisade's AEO visibility for the last 30 days vs the prior 30 days.
 * Returns null when Peec isn't configured or the API fails — the dashboard
 * renders that as an offline card, never a crash.
 */
export async function fetchAeoVisibility(): Promise<AeoVisibility | null> {
  const apiKey = process.env.PEEC_API_TOKEN
  if (!apiKey) return null

  try {
    const now = new Date()
    const d30 = new Date(now.getTime() - 30 * 86400 * 1000)
    const d60 = new Date(now.getTime() - 60 * 86400 * 1000)

    const [current, previous] = await Promise.all([
      fetchWindowVisibility(apiKey, iso(d30), iso(now)),
      fetchWindowVisibility(apiKey, iso(d60), iso(d30)),
    ])
    if (!current) return null

    const currentPct = current.visibility * 100
    const previousPct = (previous?.visibility ?? 0) * 100
    return {
      currentPct,
      previousPct,
      deltaPts: currentPct - previousPct,
      mentionCount: current.mentions,
    }
  } catch (err) {
    console.error('[peec] fetchAeoVisibility failed', err)
    return null
  }
}

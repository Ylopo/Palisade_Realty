/**
 * lib/ga4.ts
 *
 * Minimal GA4 Data API client for the admin dashboard's KPI cards. Talks to
 * `analyticsdata.googleapis.com` via raw `fetch()` — no `googleapis` /
 * `google-auth-library` SDK dependency, since neither is in package.json and
 * pulling one in just for two report calls isn't worth it.
 *
 * Auth: a Google service-account key (JSON, single-line, in
 * `GOOGLE_SERVICE_ACCOUNT_JSON`) is used to hand-build a JWT assertion
 * (RS256, signed with Node's `crypto`), exchanged at Google's OAuth token
 * endpoint for a short-lived access token, which is then sent as a Bearer
 * token to the GA4 Data API's `runReport` endpoint.
 *
 * This client's GA4 property (`GA4_PROPERTY_ID` — the numeric Property ID,
 * NOT the `G-XXXX` measurement ID) has not been provisioned as of this
 * build. Every exported function checks for the required env vars up front
 * and returns a zeroed/empty result instead of throwing — the dashboard
 * should degrade gracefully (an unconfigured KPI card showing zeros) rather
 * than crash the whole admin page.
 */

import crypto from 'node:crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'
const GA4_API_BASE = 'https://analyticsdata.googleapis.com/v1beta'

interface ServiceAccountKey {
  client_email: string
  private_key: string
}

export interface GA4TopPage {
  path: string
  sessions: number
}

export interface GA4TrendPoint {
  /** YYYYMMDD as returned by the GA4 Data API's `date` dimension. */
  date: string
  sessions: number
}

export interface GA4Overview {
  sessions: number
  /** Percent change vs. the immediately preceding period of equal length. Positive = growth. */
  sessionsChangePercent: number
  topPage?: GA4TopPage
  /** Daily sessions across the requested window, oldest first. */
  trend?: GA4TrendPoint[]
}

export interface GA4Lifetime {
  /** Cumulative sessions since `daysSinceStart` days ago. */
  sessions: number
  topPage?: GA4TopPage
  /** Daily sessions across the requested window, oldest first. */
  trend?: GA4TrendPoint[]
}

const EMPTY_OVERVIEW: GA4Overview = { sessions: 0, sessionsChangePercent: 0 }
const EMPTY_LIFETIME: GA4Lifetime = { sessions: 0 }

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function parseServiceAccount(): ServiceAccountKey | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccountKey>
    if (!parsed.client_email || !parsed.private_key) return null
    return { client_email: parsed.client_email, private_key: parsed.private_key }
  } catch {
    return null
  }
}

/**
 * Builds and signs a Google service-account JWT assertion, then exchanges it
 * at the OAuth token endpoint for a short-lived access token. Returns null on
 * any failure (missing/invalid key, network error, non-2xx response) so
 * callers can fall back to a safe empty result rather than throwing.
 */
async function getAccessToken(sa: ServiceAccountKey): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000)
    const header = { alg: 'RS256', typ: 'JWT' }
    const claimSet = {
      iss: sa.client_email,
      scope: GA4_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }

    const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claimSet))}`
    const signer = crypto.createSign('RSA-SHA256')
    signer.update(unsigned)
    signer.end()
    const signature = signer.sign(sa.private_key)
    const assertion = `${unsigned}.${base64url(signature)}`

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
    })

    if (!res.ok) {
      console.error('[ga4] token exchange failed', res.status, await res.text().catch(() => ''))
      return null
    }

    const data = (await res.json()) as { access_token?: string }
    return data.access_token ?? null
  } catch (err) {
    console.error('[ga4] token exchange threw', err)
    return null
  }
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

function daysAgo(n: number): Date {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  return d
}

interface RunReportBody {
  dateRanges: Array<{ startDate: string; endDate: string }>
  metrics: Array<{ name: string }>
  dimensions?: Array<{ name: string }>
  orderBys?: Array<{ metric: { metricName: string }; desc?: boolean }>
  limit?: string
}

interface RunReportRow {
  dimensionValues?: Array<{ value?: string }>
  metricValues?: Array<{ value?: string }>
}

interface RunReportResponse {
  rows?: RunReportRow[]
}

async function runReport(
  propertyId: string,
  accessToken: string,
  body: RunReportBody
): Promise<RunReportResponse | null> {
  try {
    const res = await fetch(`${GA4_API_BASE}/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error('[ga4] runReport failed', res.status, await res.text().catch(() => ''))
      return null
    }

    return (await res.json()) as RunReportResponse
  } catch (err) {
    console.error('[ga4] runReport threw', err)
    return null
  }
}

async function fetchSessionsTotal(
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<number> {
  const report = await runReport(propertyId, accessToken, {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: 'sessions' }],
  })
  const value = report?.rows?.[0]?.metricValues?.[0]?.value
  return value ? Number(value) : 0
}

async function fetchSessionsTrend(
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<GA4TrendPoint[]> {
  const report = await runReport(propertyId, accessToken, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }],
  })
  const rows = report?.rows ?? []
  return rows
    .map((row) => ({
      date: row.dimensionValues?.[0]?.value ?? '',
      sessions: Number(row.metricValues?.[0]?.value ?? 0),
    }))
    .filter((d) => d.date)
    .sort((a, b) => a.date.localeCompare(b.date))
}

async function fetchTopPage(
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<GA4TopPage | undefined> {
  const report = await runReport(propertyId, accessToken, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: '1',
  })
  const row = report?.rows?.[0]
  const path = row?.dimensionValues?.[0]?.value
  const sessions = row?.metricValues?.[0]?.value
  if (!path || !sessions) return undefined
  return { path, sessions: Number(sessions) }
}

/**
 * Returns a dashboard-ready GA4 KPI summary: sessions over the trailing
 * `days` window, the percent change vs. the immediately preceding window of
 * the same length, and the top page by sessions in the current window.
 *
 * Returns a zeroed result (never throws) when GA4 isn't configured yet or
 * any API call fails.
 */
export async function fetchSiteGA4Overview(days: number): Promise<GA4Overview> {
  const propertyId = process.env.GA4_PROPERTY_ID
  const sa = parseServiceAccount()
  if (!propertyId || !sa) return EMPTY_OVERVIEW

  const accessToken = await getAccessToken(sa)
  if (!accessToken) return EMPTY_OVERVIEW

  try {
    const currentEnd = formatDate(daysAgo(0))
    const currentStart = formatDate(daysAgo(days - 1))
    const previousEnd = formatDate(daysAgo(days))
    const previousStart = formatDate(daysAgo(2 * days - 1))

    const [currentSessions, previousSessions, topPage, trend] = await Promise.all([
      fetchSessionsTotal(propertyId, accessToken, currentStart, currentEnd),
      fetchSessionsTotal(propertyId, accessToken, previousStart, previousEnd),
      fetchTopPage(propertyId, accessToken, currentStart, currentEnd),
      fetchSessionsTrend(propertyId, accessToken, currentStart, currentEnd),
    ])

    const sessionsChangePercent =
      previousSessions > 0
        ? Math.round(((currentSessions - previousSessions) / previousSessions) * 1000) / 10
        : currentSessions > 0
          ? 100
          : 0

    return { sessions: currentSessions, sessionsChangePercent, topPage, trend }
  } catch (err) {
    console.error('[ga4] fetchSiteGA4Overview failed', err)
    return EMPTY_OVERVIEW
  }
}

/**
 * Returns cumulative ("lifetime") sessions over the `daysSinceStart` window
 * (e.g. days since the site/GA4 property went live), plus the all-time top
 * page. There's no meaningful "previous period" for a lifetime metric, so
 * unlike `fetchSiteGA4Overview` this has no change-percent field.
 *
 * Returns a zeroed result (never throws) when GA4 isn't configured yet or
 * any API call fails.
 */
export async function fetchSiteGA4Lifetime(daysSinceStart: number): Promise<GA4Lifetime> {
  const propertyId = process.env.GA4_PROPERTY_ID
  const sa = parseServiceAccount()
  if (!propertyId || !sa) return EMPTY_LIFETIME

  const accessToken = await getAccessToken(sa)
  if (!accessToken) return EMPTY_LIFETIME

  try {
    const endDate = formatDate(daysAgo(0))
    const startDate = formatDate(daysAgo(Math.max(daysSinceStart - 1, 0)))

    const [sessions, topPage, trend] = await Promise.all([
      fetchSessionsTotal(propertyId, accessToken, startDate, endDate),
      fetchTopPage(propertyId, accessToken, startDate, endDate),
      fetchSessionsTrend(propertyId, accessToken, startDate, endDate),
    ])

    return { sessions, topPage, trend }
  } catch (err) {
    console.error('[ga4] fetchSiteGA4Lifetime failed', err)
    return EMPTY_LIFETIME
  }
}

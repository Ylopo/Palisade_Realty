import { createHash } from 'crypto'

/**
 * API adapter for the shared Ylopo Enterprise video-render platform. This platform
 * is shared across every branded-site client (Palisade Realty is one tenant among
 * many) — that's why two separate identifiers exist below and must never be
 * confused with each other:
 *
 * - `ENTERPRISE_CLIENT_ID` — a per-client UUID that identifies *this* tenant
 *   (Palisade Realty) on the shared platform. It goes in the request BODY as
 *   `clientId`.
 * - `ENTERPRISE_VIDEO_API_KEY` — a Bearer token SHARED across all clients on the
 *   platform. It goes in the `Authorization` HEADER, never in the body.
 *
 * CRITICAL GOTCHA: swapping these two (e.g. sending the API key as `clientId`, or
 * the client UUID as the Bearer token) produces a 400 error from the platform.
 * They are not interchangeable even though both are opaque strings.
 */

const BASE_URL = process.env.ENTERPRISE_VIDEO_BASE_URL
const API_KEY = process.env.ENTERPRISE_VIDEO_API_KEY
const CLIENT_ID = process.env.ENTERPRISE_CLIENT_ID

/** Hard cap on script word count enforced by the render platform. */
export const WORD_CAP = 175

export interface SubmitRenderInput {
  script: string
  imageUrls: string[]
  thumbnailUrl?: string
  lookId?: string
  voiceId?: string
  idempotencyKey?: string
}

export interface SubmitRenderResult {
  videoId: string
}

export type RenderStatusResult =
  | { status: 'processing' }
  | { status: 'completed'; videoUrl: string; durationSeconds: number }
  | { status: 'failed'; error?: string }

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`enterprise-video: missing required env var ${name}`)
  }
  return value
}

/**
 * Submits a script + image set to the shared Ylopo Enterprise video-render
 * platform for a Digital Twin render.
 *
 * CRITICAL: `lookId` and `voiceId` are sent explicitly on every call even though
 * the platform's API might treat them as optional. If omitted, the platform falls
 * back to a "default" twin, which can silently resolve to the WRONG person for
 * this client. Callers should always resolve a lookId/voiceId (see
 * `lib/video-settings.ts`) before calling this function.
 */
export async function submitRender(input: SubmitRenderInput): Promise<SubmitRenderResult> {
  const baseUrl = requireEnv(BASE_URL, 'ENTERPRISE_VIDEO_BASE_URL')
  const apiKey = requireEnv(API_KEY, 'ENTERPRISE_VIDEO_API_KEY')
  const clientId = requireEnv(CLIENT_ID, 'ENTERPRISE_CLIENT_ID')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Shared Bearer token — identifies the platform caller, NOT the tenant.
    Authorization: `Bearer ${apiKey}`,
  }
  if (input.idempotencyKey) {
    headers['Idempotency-Key'] = input.idempotencyKey
  }

  // Build the optional fields conditionally rather than always including the
  // key — callers occasionally pass through a Sanity-sourced `null` (GROQ
  // returns null, not undefined, for an unset field) for thumbnailUrl/lookId/
  // voiceId, and the platform's schema rejects an explicit null on an
  // optional field ("expected string, received null") even though omitting
  // the key entirely is fine. This is the same fix at the boundary that
  // callers should also apply themselves — belt and suspenders.
  const res = await fetch(`${baseUrl}/api/v1/videos`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      // Per-client UUID — identifies the tenant, NOT the caller/credential.
      clientId,
      script: input.script,
      layout: 'animated',
      imageUrls: input.imageUrls,
      ...(input.lookId ? { lookId: input.lookId } : {}),
      ...(input.voiceId ? { voiceId: input.voiceId } : {}),
      ...(input.thumbnailUrl ? { thumbnailUrl: input.thumbnailUrl } : {}),
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`enterprise-video: submitRender failed (${res.status}): ${body}`)
  }

  const data = (await res.json()) as { videoId: string }
  return { videoId: data.videoId }
}

/**
 * Polls the shared platform for the current status of a submitted render.
 */
export async function getRenderStatus(videoId: string): Promise<RenderStatusResult> {
  const baseUrl = requireEnv(BASE_URL, 'ENTERPRISE_VIDEO_BASE_URL')
  const apiKey = requireEnv(API_KEY, 'ENTERPRISE_VIDEO_API_KEY')

  const res = await fetch(`${baseUrl}/api/v1/videos/${videoId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`enterprise-video: getRenderStatus failed (${res.status}): ${body}`)
  }

  const data = (await res.json()) as {
    status: 'processing' | 'completed' | 'failed'
    videoUrl?: string
    durationSeconds?: number
    error?: string
  }

  if (data.status === 'completed') {
    return { status: 'completed', videoUrl: data.videoUrl ?? '', durationSeconds: data.durationSeconds ?? 0 }
  }
  if (data.status === 'failed') {
    return { status: 'failed', error: data.error }
  }
  return { status: 'processing' }
}

/**
 * Builds a content-derived idempotency key for a render submission.
 *
 * CRITICAL: this must be derived from the actual render content (including the
 * resolved `lookId`), never from `postId` alone. If only `postId` were used, every
 * re-submit for that post — even one intentionally re-rendered with a new script,
 * image set, or look — would collide with the very first render's idempotency key
 * and the platform would just return that stale render forever. Keying off content
 * means a genuinely new render (different script/images/look/voice) gets a fresh
 * key, while an identical re-submit (e.g. a retried request after a network error)
 * correctly reuses the same render.
 */
export function buildIdempotencyKey(
  postId: string,
  script: string,
  imageUrls: string[],
  thumbnailUrl: string | undefined,
  lookId: string | undefined,
  voiceId: string | undefined
): string {
  const payload = JSON.stringify({ script, imageUrls, thumbnailUrl, lookId, voiceId })
  const hash = createHash('sha256').update(payload).digest('hex').slice(0, 12)
  return `${postId}-${hash}`
}

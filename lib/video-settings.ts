import { createHash } from 'crypto'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/** Redis hash key holding this client's (Palisade Realty's) Digital Twin avatar settings. */
const AVATAR_KEY = 'hps:video:avatar'

const MAX_LOOK_IDS = 5

export interface VideoSettings {
  lookIds: string[]
  voiceId: string | null
}

/**
 * Reads the operator-configured look IDs and voice ID for this client's Digital
 * Twin. Returns an empty `lookIds` array / `null` voiceId if nothing has been
 * saved yet (rather than throwing) so callers can distinguish "not configured"
 * from an error.
 */
export async function getVideoSettings(): Promise<VideoSettings> {
  const hash = await redis.hgetall<{ lookIds?: string; voiceId?: string }>(AVATAR_KEY)

  if (!hash) {
    return { lookIds: [], voiceId: null }
  }

  let lookIds: string[] = []
  if (hash.lookIds) {
    try {
      const parsed = JSON.parse(hash.lookIds)
      if (Array.isArray(parsed)) {
        lookIds = parsed.filter((id): id is string => typeof id === 'string')
      }
    } catch {
      lookIds = []
    }
  }

  return {
    lookIds,
    voiceId: hash.voiceId ?? null,
  }
}

/**
 * Saves the operator-configured look IDs (up to 5) and single voice ID for this
 * client's Digital Twin.
 */
export async function saveVideoSettings(lookIds: string[], voiceId: string): Promise<void> {
  if (lookIds.length === 0) {
    throw new Error('video-settings: at least one lookId is required')
  }
  if (lookIds.length > MAX_LOOK_IDS) {
    throw new Error(`video-settings: at most ${MAX_LOOK_IDS} lookIds are allowed, got ${lookIds.length}`)
  }
  if (!voiceId) {
    throw new Error('video-settings: voiceId is required')
  }

  await redis.hset(AVATAR_KEY, {
    lookIds: JSON.stringify(lookIds),
    voiceId,
  })
}

/**
 * Deterministically picks one look ID per post from the configured pool, using a
 * stable hash of `seed` (the postId) modulo `lookIds.length`. The same post always
 * resolves to the same look across re-renders — this stability is required for
 * the content-derived idempotency key in `lib/enterprise-video.ts` to behave as
 * intended: if the look flip-flopped randomly on every call, an operator-intended
 * "just retry this exact render" would look like a brand-new render every time.
 * (An operator who explicitly wants a different look for a post should change the
 * configured pool or pass an override upstream — this function itself never
 * randomizes.)
 */
export function pickLookForPost(lookIds: string[], seed: string): string {
  if (lookIds.length === 0) {
    throw new Error('video-settings: pickLookForPost requires a non-empty lookIds array')
  }
  if (lookIds.length === 1) {
    return lookIds[0]
  }

  const hashHex = createHash('sha256').update(seed).digest('hex').slice(0, 8)
  const hashInt = parseInt(hashHex, 16)
  const index = hashInt % lookIds.length

  return lookIds[index]
}

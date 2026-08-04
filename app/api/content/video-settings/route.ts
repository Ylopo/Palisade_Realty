import { NextRequest, NextResponse } from 'next/server'
import { getVideoSettings, saveVideoSettings } from '@/lib/video-settings'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Mirrors the hard cap enforced inside lib/video-settings.ts (saveVideoSettings). */
const MAX_LOOK_IDS = 5

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/**
 * GET /api/content/video-settings?secret=...
 * Returns the operator-configured Digital Twin look pool + voice for this client.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const settings = await getVideoSettings()
    return NextResponse.json(settings)
  } catch (err: unknown) {
    console.error('[api/content/video-settings][GET]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

/**
 * POST /api/content/video-settings?secret=...
 * Body: { lookIds: string[]; voiceId: string }
 * Saves up to 5 look IDs and a single voice ID for this client's Digital Twin.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { lookIds?: unknown; voiceId?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { lookIds, voiceId } = body

  if (
    !Array.isArray(lookIds) ||
    lookIds.length === 0 ||
    !lookIds.every((id): id is string => typeof id === 'string' && id.length > 0)
  ) {
    return NextResponse.json(
      { error: 'lookIds must be a non-empty array of strings' },
      { status: 400 }
    )
  }
  if (lookIds.length > MAX_LOOK_IDS) {
    return NextResponse.json(
      { error: `at most ${MAX_LOOK_IDS} lookIds are allowed` },
      { status: 400 }
    )
  }
  if (typeof voiceId !== 'string' || voiceId.length === 0) {
    return NextResponse.json({ error: 'voiceId is required' }, { status: 400 })
  }

  try {
    await saveVideoSettings(lookIds, voiceId)
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('[api/content/video-settings][POST]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

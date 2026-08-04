import { NextRequest, NextResponse } from 'next/server'
import { evaluateRefreshCandidates } from '@/lib/refresh-engine'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/**
 * GET /api/content/refresh-queue?secret=...
 * Returns the current prioritized content-refresh queue for the admin dashboard.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const candidates = await evaluateRefreshCandidates()
    return NextResponse.json({ candidates })
  } catch (err: unknown) {
    console.error('[api/content/refresh-queue][GET]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

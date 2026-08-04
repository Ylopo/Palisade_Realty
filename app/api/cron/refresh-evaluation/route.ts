import { NextRequest, NextResponse } from 'next/server'
import { evaluateRefreshCandidates } from '@/lib/refresh-engine'
import { sendRefreshDigest } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`
}

/**
 * GET /api/cron/refresh-evaluation
 * Auth: Authorization: Bearer <CRON_SECRET>
 *
 * The admin refresh-queue page (`app/admin/refresh-queue/page.tsx`) reads
 * `evaluateRefreshCandidates()` on demand via `/api/content/refresh-queue`,
 * so this cron's real job is just to run the evaluation on a schedule and
 * (best-effort, non-blocking) send the weekly operator digest email via
 * `sendRefreshDigest()` — `lib/email.ts` already no-ops that call when
 * `RESEND_API_KEY`/`FROM_EMAIL`/`OPERATOR_EMAIL` aren't configured. No
 * separate persisted queue is built here.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const candidates = await evaluateRefreshCandidates()

    if (candidates.length > 0) {
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.palisaderealty.com').replace(/\/+$/, '')
      const adminSecret = process.env.ADMIN_SECRET ?? ''
      const queueUrl = `${appUrl}/admin/refresh-queue?secret=${encodeURIComponent(adminSecret)}`
      await sendRefreshDigest(candidates, queueUrl).catch((e) =>
        console.error('[cron/refresh-evaluation] digest email failed:', e instanceof Error ? e.message : e)
      )
    }

    return NextResponse.json({ candidatesFound: candidates.length })
  } catch (err: unknown) {
    console.error('[api/cron/refresh-evaluation][GET]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

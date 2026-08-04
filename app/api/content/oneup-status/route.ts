import { NextResponse } from 'next/server'
import { getPostStatus } from '@/lib/oneup-client'

export const dynamic = 'force-dynamic'

// Polled by the Media Review post editor after /api/content/publish returns a
// { postSubmissionId } for a platform — OneUp's schedule call doesn't confirm
// the post went live synchronously, so the UI polls this until it does.
// (Named oneup-status, not blotato-status — Blotato is fully retired.)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const postSubmissionId = searchParams.get('postSubmissionId')
  if (!postSubmissionId) {
    return NextResponse.json({ error: 'postSubmissionId is required' }, { status: 400 })
  }

  const status = await getPostStatus(postSubmissionId)
  return NextResponse.json(status)
}

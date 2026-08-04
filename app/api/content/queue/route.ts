import { NextResponse } from 'next/server'
import { getVAQueue } from '@/lib/sanity/queries'

export const dynamic = 'force-dynamic'

// Full Media Review grid: everything not yet published (or recently
// published), bucketed by getVAQueue() into Needs Media / Ready to Publish /
// Scheduled / In Progress-Recent per the source app's admin UI.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts = await getVAQueue()
  return NextResponse.json(posts)
}

import { NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export const dynamic = 'force-dynamic'

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await request.json().catch(() => ({}))
  if (!postId) return NextResponse.json({ error: 'postId is required' }, { status: 400 })

  await writeClient.delete(postId)

  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import { getAllIdeas } from '@/lib/idea-store'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const posts = await client.fetch<{ category: string | null }[]>(
      `*[_type == "blogPost" && workflowStatus == "published"]{ category }`
    )

    const published: Record<string, number> = {}
    for (const post of posts) {
      const cat = post.category ?? 'uncategorized'
      published[cat] = (published[cat] ?? 0) + 1
    }

    const ideas = await getAllIdeas()
    const pending: Record<string, number> = {}
    for (const idea of ideas) {
      if (idea.status !== 'pending') continue
      const cat = idea.category ?? 'uncategorized'
      pending[cat] = (pending[cat] ?? 0) + 1
    }

    return NextResponse.json({ published, pending })
  } catch (err) {
    console.error('[GET /api/content/ideas/category-stats]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

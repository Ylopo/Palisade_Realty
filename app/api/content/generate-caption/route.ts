import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'
import { generatePlatformCaptions, type SanityBlogPost } from '@/lib/publish-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

type PostFields = Pick<SanityBlogPost, 'title' | 'excerpt' | 'category'>

/**
 * POST /api/content/generate-caption?secret=...
 * Body: { postId: string } OR { title: string, excerpt?: string, category?: string }
 *
 * Generates a Facebook post caption via the shared platform-caption
 * generator (lib/publish-service.ts), which already applies the Fair
 * Housing rules and the Hedda Parashos / Palisade Realty voice.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: unknown; title?: unknown; excerpt?: unknown; category?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    let postFields: PostFields

    if (typeof body.postId === 'string' && body.postId.length > 0) {
      const post = await writeClient.fetch<PostFields | null>(
        `*[_id==$postId][0]{title,excerpt,category}`,
        { postId: body.postId },
      )
      if (!post) {
        return NextResponse.json({ error: `Post ${body.postId} not found` }, { status: 404 })
      }
      postFields = post
    } else {
      if (typeof body.title !== 'string' || body.title.length === 0) {
        return NextResponse.json({ error: 'postId, or title, is required' }, { status: 400 })
      }
      postFields = {
        title: body.title,
        excerpt: typeof body.excerpt === 'string' ? body.excerpt : undefined,
        category: typeof body.category === 'string' ? body.category : undefined,
      }
    }

    const captions = await generatePlatformCaptions(postFields)
    return NextResponse.json({ caption: captions.facebook })
  } catch (err) {
    console.error('[generate-caption] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to generate caption' }, { status: 500 })
  }
}

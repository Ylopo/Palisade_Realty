import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'
import { submitRender, buildIdempotencyKey } from '@/lib/enterprise-video'
import { getVideoSettings, pickLookForPost } from '@/lib/video-settings'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface VideoScene {
  keyword: string
  phrase: string
  imageUrl: string
  order: number
  approved: boolean
  source?: string
}

interface PostVideoFields {
  videoScript?: string
  videoScenes?: VideoScene[]
  videoThumbnailUrl?: string
  /** A previously-saved look override for this post, persisted by a prior render. */
  videoLookId?: string
}

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

const POST_VIDEO_FIELDS_QUERY = `*[_type == "blogPost" && _id == $postId][0]{
  videoScript,
  videoScenes,
  videoThumbnailUrl,
  videoLookId
}`

/**
 * POST /api/content/generate-enterprise-video?secret=...
 * Body: { postId: string; lookOverride?: string }
 *
 * Kicks off an Enterprise Digital Twin render for a post. The look resolution
 * order (explicit override -> previously-saved override -> deterministic pick)
 * and the idempotency key (which MUST fold in the chosen look) are both
 * load-bearing: they're what makes "change the look, get a new render" and
 * "retry the exact same request, get the same render" both work correctly.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: unknown; lookOverride?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postId, lookOverride } = body
  if (typeof postId !== 'string' || postId.length === 0) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }
  if (lookOverride !== undefined && typeof lookOverride !== 'string') {
    return NextResponse.json({ error: 'lookOverride must be a string' }, { status: 400 })
  }

  try {
    // a. Fetch the post's video fields from Sanity.
    const post = await writeClient.fetch<PostVideoFields | null>(POST_VIDEO_FIELDS_QUERY, { postId })
    if (!post) {
      return NextResponse.json({ error: `Post ${postId} not found` }, { status: 404 })
    }
    if (!post.videoScript) {
      return NextResponse.json({ error: `Post ${postId} has no videoScript` }, { status: 400 })
    }

    // b. Load operator-configured look pool + voice.
    const { lookIds, voiceId } = await getVideoSettings()

    // c. Choose the look: explicit override > previously-saved override > deterministic pick.
    let chosenLook: string
    if (lookOverride) {
      chosenLook = lookOverride
    } else if (post.videoLookId) {
      chosenLook = post.videoLookId
    } else {
      if (lookIds.length === 0) {
        return NextResponse.json(
          { error: 'No lookIds configured; set video settings before generating a render' },
          { status: 400 }
        )
      }
      chosenLook = pickLookForPost(lookIds, postId)
    }

    // d. Build imageUrls from approved scenes only, in order.
    const approvedScenes = (post.videoScenes ?? [])
      .filter((scene) => scene.approved)
      .sort((a, b) => a.order - b.order)
    const imageUrls = approvedScenes.map((scene) => scene.imageUrl)

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: `Post ${postId} has no approved video scenes` },
        { status: 400 }
      )
    }

    // e. Idempotency key MUST include the chosen look so a look change forces a new render.
    const idempotencyKey = buildIdempotencyKey(
      postId,
      post.videoScript,
      imageUrls,
      post.videoThumbnailUrl,
      chosenLook,
      voiceId ?? undefined
    )

    // f. Submit the render. Script is sent RAW — never number-normalized — the
    // Enterprise platform animates numbers itself.
    const { videoId } = await submitRender({
      script: post.videoScript,
      imageUrls,
      // Sanity/GROQ returns null (not undefined) for an unset field — the
      // Enterprise API's schema rejects an explicit null for an optional
      // field ("expected string, received null"), so this must be coerced.
      thumbnailUrl: post.videoThumbnailUrl ?? undefined,
      lookId: chosenLook,
      voiceId: voiceId ?? undefined,
      idempotencyKey,
    })

    // g. Persist job state + the resolved look override so re-renders stay consistent.
    await writeClient
      .patch(postId)
      .set({
        enterpriseVideoJobId: videoId,
        enterpriseVideoStatus: 'processing',
        videoLookId: chosenLook,
      })
      .commit()

    // h. Return the new job id + the look that was used.
    return NextResponse.json({ videoId, lookId: chosenLook })
  } catch (err: unknown) {
    console.error('[api/content/generate-enterprise-video]', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

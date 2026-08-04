import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getIdea, updateIdeaStatus, addCoveredTopic } from '@/lib/idea-store'
import { writePostFromIdea } from '@/lib/idea-writer'
import { publishBlogPost } from '@/lib/sanity/write'
import { checkFairHousing, saveFHResult } from '@/lib/fair-housing'
import { sendFairHousingAlertEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const maxDuration = 120 // writing takes ~20-30s

function readLearnings(): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'LEARNINGS.md'), 'utf-8')
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ideaId } = await req.json().catch(() => ({}))
  if (!ideaId) return NextResponse.json({ error: 'ideaId is required' }, { status: 400 })

  const idea = await getIdea(ideaId)
  if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
  if (idea.status === 'approved') {
    return NextResponse.json({ error: 'Already approved' }, { status: 409 })
  }

  try {
    // 1. Read LEARNINGS.md for voice/style context
    const learningsContext = readLearnings()

    // 2. Write the blog post
    const draft = await writePostFromIdea(idea, learningsContext)

    // 3. Publish to Sanity as media_pending
    const postId = await publishBlogPost(draft)

    // 4. Fair Housing check
    const fhContent = [
      draft.title,
      draft.excerpt,
      ...draft.body.map((b) => b.children?.map((c) => c.text ?? '').join('') ?? ''),
    ]
      .filter(Boolean)
      .join('\n')

    let fhSeverity: 'clear' | 'warning' | 'violation' = 'clear'
    try {
      const fhResult = await checkFairHousing(fhContent, 'blog-post')
      fhSeverity = fhResult.severity
      await saveFHResult(postId, fhResult)

      if (fhResult.severity === 'violation') {
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.palisaderealty.com').replace(/\/+$/, '')
        const adminSecret = process.env.ADMIN_SECRET ?? ''
        // Fire-and-forget: never let an email failure fail the approval.
        await sendFairHousingAlertEmail({
          postId,
          postTitle: draft.title,
          vaQueueUrl: `${appUrl}/admin/va-queue/${postId}?secret=${encodeURIComponent(adminSecret)}`,
          result: fhResult,
        }).catch((e) => console.error('[ideas/approve] FH alert email failed:', e instanceof Error ? e.message : e))
      }
    } catch (e) {
      console.error('[ideas/approve] FH check failed:', e instanceof Error ? e.message : e)
    }

    // 5. Mark idea approved + record topic as covered
    await updateIdeaStatus(ideaId, 'approved')
    await addCoveredTopic(draft.slug)

    return NextResponse.json({
      success: true,
      postId,
      slug: draft.slug,
      title: draft.title,
      vaQueueUrl: `/admin/va-queue/${postId}`,
      fairHousing: fhSeverity,
    })
  } catch (err) {
    console.error('[ideas/approve] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Writing failed' },
      { status: 500 }
    )
  }
}

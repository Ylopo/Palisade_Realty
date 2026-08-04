import { NextResponse } from 'next/server'
import { fetchAndScoreArticles, fetchAndScoreIdeas } from '@/lib/research'
import { saveIdea, getCoveredTopics, getPendingIdeas } from '@/lib/idea-store'
import { isNearDuplicateTitle, BREAKING_ALERT_THRESHOLD } from '@/lib/dedupe'
import { sendBreakingAlert } from '@/lib/breaking-alert'
import type { IdeaCandidate } from '@/lib/types'

export const maxDuration = 60

// Vercel cron: GET with Bearer CRON_SECRET
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runResearch()
}

// Also allow POST for manual testing
export async function POST(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const body = await request.json().catch(() => ({}))
  if (body.secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runResearch()
}

async function runResearch() {
  const date = new Date().toISOString().split('T')[0]

  try {
    console.log(`[research] Starting daily research for ${date}`)

    // Legacy article scoring pass — kept for parity with the source pipeline.
    // This San Diego build has no blog-picker UI yet, so results are only
    // logged here rather than persisted to a separate article store.
    const legacyArticles = await fetchAndScoreArticles()
    console.log(`[research] Scored ${legacyArticles.length} legacy article(s)`)

    // New: score as ideas and route to the unified queue
    const coveredTopics = await getCoveredTopics()
    const ideas = await fetchAndScoreIdeas(coveredTopics)
    console.log(`[research] ${ideas.length} ideas passed threshold`)

    let savedCount = 0
    let skippedDupes = 0
    const breakingIdeas: IdeaCandidate[] = []

    // Guard against re-queuing an ongoing story that is already pending review.
    // (Novelty scoring only compares against *published* topics, so unpublished
    // rephrasings of the same story would otherwise pile up day after day.)
    const seenTitles: string[] = (await getPendingIdeas()).map((i) => i.title)

    for (const idea of ideas) {
      if (isNearDuplicateTitle(idea.title, seenTitles)) {
        skippedDupes++
        console.log(`[research] Skipping near-duplicate of a pending idea: "${idea.title}"`)
        continue
      }
      await saveIdea(idea)
      seenTitles.push(idea.title)
      savedCount++
      if (idea.urgency === 'breaking' && idea.score.total >= BREAKING_ALERT_THRESHOLD) {
        breakingIdeas.push(idea)
      }
    }

    // Send breaking news alerts (immediate, bypasses weekly queue)
    if (breakingIdeas.length > 0) {
      await sendBreakingAlert(breakingIdeas)
      console.log(`[research] Breaking alert sent for ${breakingIdeas.length} idea(s)`)
    }

    console.log(
      `[research] Saved ${savedCount} ideas to queue (skipped ${skippedDupes} duplicate(s) of pending ideas)`
    )

    return NextResponse.json({
      success: true,
      date,
      ideasQueued: savedCount,
      duplicatesSkipped: skippedDupes,
      breakingAlerts: breakingIdeas.length,
      titles: ideas.map((i) => `[${i.score.total}] ${i.title}`),
    })
  } catch (error) {
    console.error('[research] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

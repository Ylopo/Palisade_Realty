import { NextRequest, NextResponse } from 'next/server'
import { fetchAndScoreIdeas } from '@/lib/research'
import { fetchLocalHistoryIdeas } from '@/lib/local-history-research'
import { saveIdea, getCoveredTopics, getPendingIdeas } from '@/lib/idea-store'
import { isNearDuplicateTitle, BREAKING_ALERT_THRESHOLD } from '@/lib/dedupe'
import { sendBreakingAlert } from '@/lib/breaking-alert'
import type { IdeaCandidate } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 300

// On-demand "Generate Ideas Now" admin action — same flow as
// app/api/cron/research (dedupe against pending ideas + breaking alert),
// minus the legacy article-scoring pass, which is cron-only housekeeping.
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const coveredTopics = await getCoveredTopics()
    // News-driven ideas and local-history story scouting run in parallel —
    // both feed the same queue and dedupe loop below.
    const [newsIdeas, historyIdeas] = await Promise.all([
      fetchAndScoreIdeas(coveredTopics),
      fetchLocalHistoryIdeas(coveredTopics).catch((err) => {
        console.error('[ideas/generate] Local-history scout failed:', err instanceof Error ? err.message : err)
        return [] as IdeaCandidate[]
      }),
    ])
    const ideas = [...newsIdeas, ...historyIdeas]

    let skippedDupes = 0
    const breakingIdeas: IdeaCandidate[] = []
    const saved: IdeaCandidate[] = []
    const seenTitles: string[] = (await getPendingIdeas()).map((i) => i.title)

    for (const idea of ideas) {
      if (isNearDuplicateTitle(idea.title, seenTitles)) {
        skippedDupes++
        continue
      }
      await saveIdea(idea)
      seenTitles.push(idea.title)
      saved.push(idea)
      if (idea.urgency === 'breaking' && idea.score.total >= BREAKING_ALERT_THRESHOLD) {
        breakingIdeas.push(idea)
      }
    }

    if (breakingIdeas.length > 0) {
      await sendBreakingAlert(breakingIdeas)
    }

    return NextResponse.json({
      count: saved.length,
      duplicatesSkipped: skippedDupes,
      breakingAlerts: breakingIdeas.length,
      ideas: saved.map((i) => ({ id: i.id, title: i.title, score: i.score.total })),
    })
  } catch (err) {
    console.error('[POST /api/content/ideas/generate]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

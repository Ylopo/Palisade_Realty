import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { writeClient } from '@/lib/sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_WORDS = 150
const TARGET_MIN_WORDS = 110
const TARGET_MAX_WORDS = 150

// Real, nameable San Diego communities the writer is allowed to attach to a
// scene's `place` field. Anything else (or Hedda's own personal
// neighborhood) must be omitted rather than guessed at.
const KNOWN_PLACES = [
  'Downtown San Diego',
  'Carmel Valley',
  'Mission Valley',
  'Chula Vista',
  'Point Loma',
  'North Park',
  'Coronado',
]

interface PortableTextSpanLike {
  text?: string
}
interface PortableTextBlockLike {
  _type?: string
  children?: PortableTextSpanLike[]
}

interface SanityPost {
  title?: string
  excerpt?: string
  category?: string
  body?: PortableTextBlockLike[]
}

interface VideoScene {
  keyword: string
  phrase: string
  imageQuery: string
  place?: string
}

interface ScriptPayload {
  script: string
  scenes: VideoScene[]
}

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

/** Flattens Portable Text blocks to plain text: each block's span texts are
 * joined with spaces, blocks are joined with newlines. Non-text blocks
 * (e.g. images) are skipped. */
function portableTextToPlainText(body: PortableTextBlockLike[] | undefined): string {
  if (!Array.isArray(body)) return ''
  return body
    .filter((block) => block?._type === 'block' && Array.isArray(block.children))
    .map((block) => (block.children ?? []).map((child) => child?.text ?? '').join(' ').trim())
    .filter(Boolean)
    .join('\n')
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Hard-truncates to the last full sentence whose cumulative word count is
 * still under maxWords. Falls back to a plain word-count truncation if the
 * text has no clear sentence boundaries. */
function truncateToSentenceBoundary(text: string, maxWords: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) ?? [text]
  let out = ''
  let words = 0
  for (const sentence of sentences) {
    const sentenceWords = countWords(sentence)
    if (words + sentenceWords > maxWords) break
    out += sentence
    words += sentenceWords
  }
  out = out.trim()
  if (out) return out

  // No sentence fit under the cap (or no boundaries found) — hard word-cut.
  return text.trim().split(/\s+/).slice(0, maxWords).join(' ')
}

function stripJsonFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
}

// Local-history posts get a story-teaser treatment instead of the default
// market-commentary style — hook first, hold something back, no sales angle.
const LOCAL_HISTORY_STYLE = `
LOCAL HISTORY MODE: this is a neighborhood-history story, not market commentary.
- Open with the single most surprising fact or question from the article — never a greeting or preamble.
- Name the recognizable neighborhood, street, or landmark in the first two sentences.
- Reveal enough of the story to be satisfying, but HOLD BACK one or two fascinating details so viewers have a reason to read the full article.
- Sound like a curious local sharing something they can't believe they just learned — not a history lecture, a news report, or a real estate ad. Zero selling.
- End with a curiosity-based invitation to read the complete story at the link in the description (e.g. "the full story — including what happened to it — is at the link in the description"), never a sales CTA.`

function buildSystemPrompt(title: string, excerpt: string, sourceText: string, category?: string): string {
  const isLocalHistory = category === 'local-history' || category === 'local-interest'
  return `You are writing a short-form video script spoken in first person AS Hedda Parashos, a San Diego brokerage owner. She is speaking as a neighbor and local voice sharing something she noticed — NOT introduced as "a real estate agent," "realtor," or any professional title, and the brokerage name must never appear in the spoken script itself.
${isLocalHistory ? LOCAL_HISTORY_STYLE : ''}

DATA-GROUNDING (critical): The only facts, numbers, statistics, and dates you may use are the ones that appear in the ARTICLE BODY below. Never invent, estimate, or infer a statistic that isn't explicitly present in the source material. If the article doesn't contain a number, don't say one — speak generally instead.

LOCATION PRIVACY (critical): Never name the specific city, neighborhood, or street where Hedda personally lives. San Diego as a broad market/region is fine to reference.

LENGTH: Target ${TARGET_MIN_WORDS}–${TARGET_MAX_WORDS} spoken words. Never exceed ${MAX_WORDS} words under any circumstance.

CALL TO ACTION: Must point to "the link in the description" (or equivalent phrasing like "the link below"). Never say "link in bio" and never ask viewers to call.

STYLE: Conversational, first person ("I", "my"), like talking to a neighbor. No stage directions, no section labels, no bullet points — flowing spoken sentences only.

ARTICLE TITLE: ${title}
EXCERPT: ${excerpt || 'None provided.'}
ARTICLE BODY (only source of facts/numbers — use nothing outside this):
"""
${sourceText || 'No body content available — speak generally about the title/excerpt without citing any statistics.'}
"""

Return ONLY valid JSON, no markdown fences, no other text, in this exact shape:
{"script": "<the spoken script — no stage directions, no section labels>", "scenes": [{"keyword": "...", "phrase": "...", "imageQuery": "...", "place": "... , California"}, ...]}

Rules for "scenes":
- 3 to 5 scene objects.
- Each "phrase" should be a short verbatim (or near-verbatim) excerpt from the script it illustrates.
- Include "place" ONLY when the keyword/phrase corresponds to a real, nameable San Diego community from this exact list: ${KNOWN_PLACES.join(', ')}. Format it as "<Community Name>, California". If it doesn't correspond to one of these, omit the "place" field entirely (do not invent a place or use Hedda's personal neighborhood).`
}

async function generateScriptPayload(title: string, excerpt: string, sourceText: string, category?: string): Promise<ScriptPayload> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: buildSystemPrompt(title, excerpt, sourceText, category) }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(stripJsonFences(raw)) as { script?: string; scenes?: VideoScene[] }

  if (!parsed.script || typeof parsed.script !== 'string') {
    throw new Error('Model response missing "script" string')
  }

  const scenes = Array.isArray(parsed.scenes) ? parsed.scenes : []
  const normalizedScenes: VideoScene[] = scenes.slice(0, 5).map((scene) => {
    const out: VideoScene = {
      keyword: String(scene.keyword ?? ''),
      phrase: String(scene.phrase ?? ''),
      imageQuery: String(scene.imageQuery ?? ''),
    }
    if (scene.place && typeof scene.place === 'string' && scene.place.trim()) {
      out.place = scene.place.trim()
    }
    return out
  })

  return { script: parsed.script.trim(), scenes: normalizedScenes }
}

async function condenseScript(script: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Condense the following first-person video script to STRICTLY under 150 spoken words while preserving the core message, the first-person voice, and the "link in the description" call to action. Do not invent any new facts or numbers. Return ONLY the condensed script text — no JSON, no markdown, no explanation.

SCRIPT:
"""
${script}
"""`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : script
  return text.trim()
}

/**
 * POST /api/content/generate-script?secret=...
 * Body: { postId: string }
 *
 * Data-grounded script generator: fetches the post's actual body from
 * Sanity and instructs Claude to use only facts present in that body.
 * Enforces the 150-word hard cap server-side (condense retry, then a
 * sentence-boundary hard-trim) rather than trusting the prompt alone.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { postId } = body
  if (typeof postId !== 'string' || postId.length === 0) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  try {
    const post = await writeClient.fetch<SanityPost | null>(
      `*[_id==$postId][0]{title,excerpt,category,body}`,
      { postId },
    )
    if (!post) {
      return NextResponse.json({ error: `Post ${postId} not found` }, { status: 404 })
    }

    const sourceText = portableTextToPlainText(post.body)
    const title = post.title ?? ''
    const excerpt = post.excerpt ?? ''

    let { script, scenes } = await generateScriptPayload(title, excerpt, sourceText, post.category)
    let wordCount = countWords(script)

    // Server-side enforcement of the 150-word hard cap: retry once via a
    // condense call, then fall back to a hard sentence-boundary trim.
    if (wordCount > MAX_WORDS) {
      try {
        const condensed = await condenseScript(script)
        const condensedCount = countWords(condensed)
        if (condensedCount <= MAX_WORDS) {
          script = condensed
          wordCount = condensedCount
        } else {
          script = truncateToSentenceBoundary(condensed, MAX_WORDS)
          wordCount = countWords(script)
        }
      } catch (condenseErr) {
        console.warn('[generate-script] Condense retry failed, hard-trimming:', condenseErr instanceof Error ? condenseErr.message : condenseErr)
        script = truncateToSentenceBoundary(script, MAX_WORDS)
        wordCount = countWords(script)
      }
    }

    // Persist immediately — without this, the script/scenes only ever lived
    // in the browser's React state, so refreshing the page (or coming back
    // later) before scene images were found/approved silently lost them and
    // reset the Scene Images card to "Generate a video script above first."
    await writeClient
      .patch(postId)
      .set({
        videoScript: script,
        videoScenes: scenes.map((scene, order) => ({
          ...scene,
          order,
          approved: false,
        })),
      })
      .commit()

    return NextResponse.json({
      script,
      scenes,
      wordCount,
      estimatedDurationSeconds: Math.round(wordCount / 2.5),
    })
  } catch (err) {
    console.error('[generate-script] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 })
  }
}

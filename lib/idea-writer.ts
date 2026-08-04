import Anthropic from '@anthropic-ai/sdk'
import type { IdeaCandidate, BlogPostDraft, PortableTextBlock, PortableTextSpan } from '@/lib/types'
import { FAIR_HOUSING_RULES } from '@/lib/fair-housing'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SELLER_URL = 'https://search.palisaderealty.com/seller'

const COMMUNITY_LINKS =
  '[Downtown San Diego](/communities/downtown-san-diego-real-estate), ' +
  '[Carmel Valley](/communities/carmel-valley-real-estate), ' +
  '[Mission Valley](/communities/mission-valley-real-estate), ' +
  '[Chula Vista](/communities/chula-vista-real-estate), ' +
  '[Point Loma](/communities/point-loma-real-estate), ' +
  '[North Park](/communities/north-park-real-estate), ' +
  '[Coronado](/communities/coronado-real-estate)'

function makeKey(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 96)
}

/** Converts a single markdown-flavored line into one Portable Text block. */
function lineToBlock(line: string, style: PortableTextBlock['style'] = 'normal'): PortableTextBlock {
  const span: PortableTextSpan = { _type: 'span', _key: makeKey('span'), text: line, marks: [] }
  return { _type: 'block', _key: makeKey('block'), style, markDefs: [], children: [span] }
}

/**
 * Expands [SELLER_CTA: text] macros into a link-styled Portable Text block and
 * converts the AI's markdown-flavored JSON body (## / ### headings, plain
 * paragraphs) into Sanity Portable Text blocks.
 */
function bodyTextToBlocks(bodyText: string): PortableTextBlock[] {
  const lines = bodyText.split('\n').filter((l) => l.trim().length > 0)
  const blocks: PortableTextBlock[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()

    const sellerCtaMatch = line.match(/^\[SELLER_CTA:\s*(.+?)\]$/)
    if (sellerCtaMatch) {
      const ctaText = sellerCtaMatch[1]
      const markDefKey = makeKey('link')
      blocks.push({
        _type: 'block',
        _key: makeKey('block'),
        style: 'blockquote',
        markDefs: [{ _key: markDefKey, _type: 'link', href: SELLER_URL }],
        children: [{ _type: 'span', _key: makeKey('span'), text: ctaText, marks: [markDefKey] }],
      })
      continue
    }

    if (line.startsWith('### ')) {
      blocks.push(lineToBlock(line.replace(/^###\s*/, ''), 'h3'))
    } else if (line.startsWith('## ')) {
      blocks.push(lineToBlock(line.replace(/^##\s*/, ''), 'h2'))
    } else {
      blocks.push(lineToBlock(line, 'normal'))
    }
  }

  return blocks
}

function stripJsonFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
}

/**
 * Turns an approved IdeaCandidate into a full BlogPostDraft via Claude Sonnet.
 * Persona is Hedda Parashos, owner/CEO of Palisade Realty (San Diego) — written
 * as the brokerage leader with a decade-plus of direct market ownership, not as
 * a "resident/parent/investor" (that framing doesn't fit an owner/CEO identity
 * and was deliberately not carried over from the source persona).
 */
export async function writePostFromIdea(idea: IdeaCandidate, learningsContext: string): Promise<BlogPostDraft> {
  const isLocalHistory = idea.contentType === 'Local History'

  const identity = `You are writing for Hedda Parashos, Owner and President of Palisade Realty in San Diego. Hedda acquired Palisade Realty in 2012 (the brokerage was founded in 2006) and has built it into one of Southern California's leading independent brokerages — over 100 agent partners across San Diego, Orange, and Riverside counties. She writes to genuinely inform local buyers, sellers, homeowners, and investors — not to sell, but to help them make smarter decisions, drawing on what she sees across her entire agent network and thousands of closed transactions, not just her own deals.`

  const structureRules = isLocalHistory
    ? `Voice: vivid, narrative, journalistic. Hedda has led a San Diego brokerage for over a decade and genuinely loves this region's history and neighborhoods. Write like you're telling a story over coffee, not like a Wikipedia article.

Structure: open with the most dramatic or surprising fact — never "Did you know…" — then historical context, then 2-3 "##" sections going deeper, then "## Why It Still Matters Today", then "## Frequently Asked Questions" (exactly 3 questions as "###" headings, 2-3 sentence answers).

Length: 600-900 words. No Seller CTA — this is community-authority content, not lead generation. Tie the history to a specific San Diego neighborhood or landmark; include a military-history angle where it naturally fits (Naval Base San Diego, NAS North Island in Coronado, MCRD San Diego, Camp Pendleton).

COMMUNITY LINK RULE: when referencing San Diego communities by name, link to their community pages using this exact list where relevant: ${COMMUNITY_LINKS}`
    : `Voice: knowledgeable, warm, direct. Feels like advice from a brokerage owner who knows the market cold across every San Diego neighborhood — not a pitch.

Structure: open with 1-2 sentences directly answering the reader's likely question (a featured-snippet-style hook, e.g. "Closing costs in San Diego typically run 2-3% for buyers…"), then 2-3 "##" body sections, then "## What This Means For You" (3-4 bullets), then a brief closing, then "## Frequently Asked Questions" (exactly 3 questions as "###" headings, 2-3 sentence answers).

Length: 400-500 words total. Include a military/PCS angle where it naturally fits (Naval Base San Diego, NAS North Island in Coronado, MCRD San Diego, Camp Pendleton near Oceanside/Carlsbad).

SELLER CTA RULE: you may inline a "[SELLER_CTA: Find out what your home is worth →]"-style macro (exact bracket syntax), max 2 per post, only where it genuinely fits the content — never force it.

COMMUNITY LINK RULE: when referencing San Diego communities by name, link to their community pages using this exact list where relevant: ${COMMUNITY_LINKS}`

  const seoRules = `SEO: use the target keyword in the opening paragraph, in 1 heading, and 2-3 times in the body. End with exactly 3 FAQ questions as "###" headings with 2-3 sentence answers. Include 1 internal link to a relevant page.`

  const learningsBlock = learningsContext
    ? `\n\nVOICE + PERFORMANCE LEARNINGS (apply these, they come from what has actually worked on this blog):\n${learningsContext}`
    : ''

  const renickBlock = idea.renickTitle
    ? `\n\nA comparable post ("${idea.renickTitle}") drove ${idea.renickLift ?? 'a meaningful'} traffic lift in a comparable market. Match that post's format and intent, translated to San Diego.`
    : ''

  const prompt = `${identity}

${structureRules}

${seoRules}
${renickBlock}
${learningsBlock}

FAIR HOUSING RULES (must comply exactly — this is not optional):
${FAIR_HOUSING_RULES}

IDEA TO WRITE:
Title angle: ${idea.title}
Angle: ${idea.angle}
Why it matters: ${idea.whyItMatters}
Category: ${idea.category}
Audiences: ${idea.audiences.join(', ')}
Target keyword: ${idea.targetKeyword ?? idea.title}
${idea.researchData ? `\nRESEARCH DATA (ground the post in this — use real facts/numbers from here, never invent):\n${idea.researchData}` : ''}
${idea.sourceUrls.length ? `\nSOURCES: ${idea.sourceUrls.join(', ')}` : ''}

Respond with ONLY valid JSON, no other text, in this exact shape:
{
  "title": "<final post title>",
  "excerpt": "<1-2 sentence summary for the blog listing / SEO description>",
  "metaTitle": "<SEO title, <=60 chars>",
  "metaDescription": "<SEO description, <=155 chars>",
  "bodyMarkdown": "<the full post body as markdown — ## and ### headings, [SELLER_CTA: text] macros where used, plain paragraphs>"
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const parsed = JSON.parse(stripJsonFences(raw)) as {
    title: string
    excerpt: string
    metaTitle: string
    metaDescription: string
    bodyMarkdown: string
  }

  const slug = slugify(parsed.title)
  const body = bodyTextToBlocks(parsed.bodyMarkdown)

  // Source credit block, appended to every generated post.
  if (idea.sourceUrls.length > 0) {
    const markDefKey = makeKey('link')
    body.push({
      _type: 'block',
      _key: makeKey('block'),
      style: 'normal',
      markDefs: [{ _key: markDefKey, _type: 'link', href: idea.sourceUrls[0] }],
      children: [
        { _type: 'span', _key: makeKey('span'), text: 'Source: ', marks: [] },
        { _type: 'span', _key: makeKey('span'), text: idea.sourceLabels[0] ?? idea.sourceDomains[0] ?? idea.sourceUrls[0], marks: [markDefKey] },
      ],
    })
  }

  return {
    title: parsed.title,
    slug,
    excerpt: parsed.excerpt,
    category: idea.category,
    metaTitle: parsed.metaTitle,
    metaDescription: parsed.metaDescription,
    body,
    sourceUrl: idea.sourceUrls[0] ?? '',
    sourceTitle: idea.sourceLabels[0] ?? idea.title,
  }
}

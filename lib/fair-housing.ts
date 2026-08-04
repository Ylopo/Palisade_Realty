import Anthropic from '@anthropic-ai/sdk'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const FH_TTL = 60 * 60 * 24 * 90 // 90 days

function fhKey(postId: string) {
  return `hps:fh:${postId}`
}

export type FHContentType = 'blog-post' | 'social-caption'

export interface FHViolation {
  severity: 'violation' | 'warning'
  excerpt: string
  reason: string
  suggestion: string
}

export interface FHCheckResult {
  severity: 'clear' | 'warning' | 'violation'
  violations: FHViolation[]
  checkedAt: string
  reviewedAt?: string
}

/**
 * Injected into every Claude writer prompt (blog post writer, blog-picker writer,
 * social-caption generator) as prevention. California adds protected classes beyond
 * the federal Fair Housing Act: ancestry, age, genetic information,
 * immigration/citizenship status, primary language, veteran/military status,
 * medical condition — none of which are in the Virginia list this was ported from.
 */
export const FAIR_HOUSING_RULES = `
All content must comply with the Fair Housing Act and California fair housing law
(the California Fair Employment and Housing Act / FEHA, and the Unruh Civil Rights
Act). California's protected classes are broader than the federal list.

PROTECTED CLASSES: race, color, religion, national origin, ancestry, sex, sexual
orientation, gender identity, disability, familial status, marital status, source
of income, age, genetic information, immigration/citizenship status, primary
language, veteran/military status, medical condition.

Intent is irrelevant. The legal standard is the "ordinary reader test" — if a
reasonable person could interpret the content as expressing a preference, limitation,
or discrimination related to a protected class, it's a violation, even if that was
not the intent.

NEVER:
- Use "family-friendly," "perfect for families," "great for growing families,"
  "perfect for empty nesters," "ideal for retirees," "adult community" (unless
  legally designated 55+ housing), "active adult," "mature community"
- Reference specific churches, temples, mosques, or synagogues by name as amenities,
  or say "walking distance to [religious institution]"
- Describe neighborhood demographics by race, ethnicity, religion, or cultural origin
- Use "master bedroom" — use "primary bedroom" or "owner's suite" instead
- Use "man cave," "bachelor pad," "wife's dream kitchen," or gendered room descriptions
- Use "safe neighborhood" or "safe area" subjectively — only cite specific crime
  statistics with a named source
- Use "established neighborhood," "up-and-coming area," "exclusive enclave,"
  "sought-after neighborhood," "quiet neighborhood," "close-knit community" without
  objective, factual support — these are often coded demographic signals
- Suggest who should or shouldn't live in a property or neighborhood
- Use "young professional," "hip area," or "young couples" — these imply age or
  demographic preferences (California explicitly protects age as its own class,
  not just familial status)
- Reference a buyer's or reader's immigration status, citizenship, or assume English
  fluency (e.g. "must speak English," "English-speaking community only")
- Reference military/veteran status as a qualifier for who belongs in a community
  ("perfect for young families, not veterans on fixed income" etc.)
- Reference a specific medical condition or disability as disqualifying interest in
  a property

ALWAYS:
- Describe the property, not the ideal resident
- Use objective distance measurements ("0.4 miles" / "8 minutes to") not "walking
  distance"
- Cite verifiable school ratings ("[School Name], rated X/10 by GreatSchools.org
  (year)"), never "great schools" unsourced
- Use "primary bedroom" / "owner's suite," never "master bedroom"
- Describe amenities and accessibility factually (state what exists — "No elevator,
  stairs required to access unit," "ADA-accessible features include...") rather than
  judging who the property does or doesn't suit
`.trim()

function stripJsonFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
}

export async function checkFairHousing(
  content: string,
  contentType: FHContentType
): Promise<FHCheckResult> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a Fair Housing compliance reviewer for a California real estate brokerage (Palisade Realty, San Diego). Review the following ${contentType === 'blog-post' ? 'blog post' : 'social media caption'} for Fair Housing Act and California fair housing law violations.

PROTECTED CLASSES (federal + California): Race, Color, Religion, National Origin, Ancestry, Sex, Sexual Orientation, Gender Identity, Disability, Familial Status, Marital Status, Source of Income, Age, Genetic Information, Immigration/Citizenship Status, Primary Language, Veteran/Military Status, Medical Condition.

HARD VIOLATIONS (severity: "violation") — language that directly implies a preference, limitation, or discrimination based on a protected class. Examples: "family-friendly," "perfect for families," "great for growing families," "adult community" (unless legally-designated 55+), "active adult," "mature community," "young couples," referencing a specific religious institution as an amenity, describing neighborhood demographics by race/ethnicity/religion, "master bedroom," gendered room descriptions, citizenship/immigration-based language, language-requirement language, steering language (directing a buyer toward/away from a neighborhood based on a protected characteristic).

CONTEXTUAL WARNINGS (severity: "warning") — coded or borderline language that passes the "ordinary reader test" concern but may have legitimate factual grounding. Examples: "walking distance to [specific religious institution]," "great schools" without citing a specific school name + verifiable rating source, "sought-after neighborhood" without objective explanation, "close-knit community" without factual context, "safe neighborhood" without cited crime statistics.

Respond with ONLY valid JSON, no other text, in this exact shape:
{"severity": "clear" | "warning" | "violation", "violations": [{"severity": "violation" | "warning", "excerpt": "<exact quoted phrase from the content>", "reason": "<which protected class / rule this triggers>", "suggestion": "<a compliant replacement phrase>"}]}

If there are zero issues, respond with {"severity": "clear", "violations": []}.
If the highest-severity issue found is a "warning", set the top-level severity to "warning". If any "violation" is found, set the top-level severity to "violation".

CONTENT TO REVIEW:
"""
${content}
"""`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : '{"severity":"clear","violations":[]}'
  const parsed = JSON.parse(stripJsonFences(raw)) as { severity: FHCheckResult['severity']; violations: FHViolation[] }

  return {
    severity: parsed.severity,
    violations: parsed.violations ?? [],
    checkedAt: new Date().toISOString(),
  }
}

export async function saveFHResult(postId: string, result: FHCheckResult): Promise<void> {
  await redis.set(fhKey(postId), JSON.stringify(result), { ex: FH_TTL })
}

export async function getFHResult(postId: string): Promise<FHCheckResult | null> {
  const raw = await redis.get<string | FHCheckResult>(fhKey(postId))
  if (!raw) return null
  return typeof raw === 'string' ? (JSON.parse(raw) as FHCheckResult) : raw
}

export async function markFHReviewed(postId: string): Promise<FHCheckResult | null> {
  const existing = await getFHResult(postId)
  if (!existing) return null
  const updated: FHCheckResult = { ...existing, reviewedAt: new Date().toISOString() }
  await saveFHResult(postId, updated)
  return updated
}

function violationKey(v: FHViolation): string {
  return `${v.excerpt ?? ''}::${v.reason ?? ''}`
}

/**
 * Dismisses one violation from the cached FH result without touching post content.
 * Used by both fh-fix-violation (after the body edit succeeds) and
 * fh-ignore-violation (which never touches post content).
 */
export async function resolveViolation(postId: string, violationIndex: number): Promise<FHCheckResult | null> {
  const existing = await getFHResult(postId)
  if (!existing) return null
  if (violationIndex < 0 || violationIndex >= existing.violations.length) return null

  const removedKey = violationKey(existing.violations[violationIndex])
  const remaining = existing.violations.filter((v) => violationKey(v) !== removedKey)

  const updated: FHCheckResult = {
    ...existing,
    violations: remaining,
    severity: remaining.length === 0 ? 'clear' : remaining.some((v) => v.severity === 'violation') ? 'violation' : 'warning',
  }
  await saveFHResult(postId, updated)
  return updated
}

/**
 * Finds the violation's flagged excerpt as a literal substring inside the post's
 * Sanity body (portable text) and replaces it with the suggested phrase. Only
 * matches plain-text spans — if the excerpt isn't found verbatim, returns
 * found: false so the caller can tell the operator to edit manually.
 */
export async function applyFixToPostBody(
  postId: string,
  excerpt: string,
  suggestion: string
): Promise<{ found: boolean }> {
  const { writeClient } = await import('@/lib/sanity/client')
  const post = await writeClient.fetch<{ body?: Array<{ _key: string; children?: Array<{ _key: string; text?: string }> }> }>(
    `*[_id == $postId][0]{ body }`,
    { postId }
  )
  if (!post?.body) return { found: false }

  let found = false
  const patches: Array<{ blockKey: string; childKey: string; text: string }> = []

  for (const block of post.body) {
    if (!block.children) continue
    for (const span of block.children) {
      if (typeof span.text === 'string' && span.text.includes(excerpt)) {
        patches.push({ blockKey: block._key, childKey: span._key, text: span.text.split(excerpt).join(suggestion) })
        found = true
      }
    }
  }

  if (!found) return { found: false }

  let patch = writeClient.patch(postId)
  for (const p of patches) {
    patch = patch.set({
      [`body[_key=="${p.blockKey}"].children[_key=="${p.childKey}"].text`]: p.text,
    })
  }
  await patch.commit()

  return { found: true }
}

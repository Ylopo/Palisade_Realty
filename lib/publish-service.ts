/**
 * Publish service — orchestrates website + social publish in one action.
 *
 * Always publishes to Facebook (requires cover image), and now also
 * unconditionally publishes to LinkedIn + X (they only need the image +
 * caption, not video). YouTube + TikTok + Instagram/Facebook Reels publish
 * only when post.videoUrl is set; otherwise Instagram falls back to an
 * image post.
 *
 * NOTE: `content-workflow.ts` / `sanity-write.ts` (the source repo's
 * separate workflow-status + write-client helper modules) were not part of
 * this build's file list, so the Sanity workflowStatus patching they used
 * to do is inlined here directly against `writeClient` from
 * '@/lib/sanity/client'. Field names follow the Palisade Realty schema
 * (oneup*SubmissionId / oneupFacebookStatus / *PostUrl) rather than the
 * source's `blotato*`-prefixed names.
 */

import Anthropic from '@anthropic-ai/sdk'
import imageUrlBuilder from '@sanity/image-url'
import { FAIR_HOUSING_RULES } from '@/lib/fair-housing'
import { client, writeClient } from '@/lib/sanity/client'
import {
  publishToFacebook,
  publishToFacebookReel,
  publishToYouTube,
  publishToTikTok,
  publishToInstagram,
  publishToInstagramReel,
  publishToLinkedIn,
  publishToX,
} from '@/lib/oneup-client'

// ─── Minimal Sanity blogPost shape used by this module ────────────────────────
// (lib/sanity/queries.ts doesn't yet export a shared type for the full
// blogPost document — this is the subset publish-service actually reads.)

export interface SanityBlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  category?: string
  videoUrl?: string
  videoThumbnailUrl?: string
  coverImage?: any
}

// ─── Per-platform hashtags ────────────────────────────────────────────────────

const TIKTOK_BASE_HASHTAGS = [
  '#sandiego', '#sandiegorealestate', '#realestate', '#realtor',
  '#coronado', '#lajolla', '#pointloma', '#carlsbad',
  '#heddaparashos', '#palisaderealty',
]

const TIKTOK_CATEGORY_HASHTAGS: Record<string, string[]> = {
  'market-update':       ['#realestatemarket', '#housingmarket', '#marketupdate', '#homeprices'],
  'buying-tips':         ['#homebuyer', '#firsttimehomebuyer', '#buyingahome', '#homebuyingtips'],
  'selling-tips':        ['#homeseller', '#sellingyourhome', '#listingagent', '#homesellingtips'],
  'community-spotlight': ['#sandiegoliving', '#lajollaliving', '#movingtosandiego'],
  'investment':          ['#realestateinvesting', '#investmentproperty', '#rentalincome'],
  'news':                ['#realestatenews', '#housingmarket', '#mortgagerates'],
  'cost-breakdown':      ['#closingcosts', '#homebuying', '#realestatetips'],
  'flood-and-risk':      ['#floodinsurance', '#coastalliving', '#sandiego'],
}

const LINKEDIN_CATEGORY_HASHTAGS: Record<string, string[]> = {
  'market-update':       ['#HousingMarket', '#RealEstateMarket', '#MarketUpdate'],
  'buying-tips':         ['#HomeBuying', '#HomeBuyer', '#FirstTimeHomeBuyer'],
  'selling-tips':        ['#HomeSelling', '#ListingAgent', '#HomeValue'],
  'community-spotlight': ['#SanDiegoLiving', '#LaJollaLiving', '#CommunityLife'],
  'investment':          ['#RealEstateInvesting', '#InvestmentProperty', '#PassiveIncome'],
  'news':                ['#HousingNews', '#MortgageRates', '#RealEstateNews'],
  'cost-breakdown':      ['#ClosingCosts', '#HomeBuyingTips', '#RealEstateFinance'],
  'flood-and-risk':      ['#FloodInsurance', '#CoastalRealEstate', '#RiskManagement'],
}

const X_CATEGORY_HASHTAGS: Record<string, string> = {
  'market-update':       '#realestate #housingmarket',
  'buying-tips':         '#homebuying #realestate',
  'selling-tips':        '#homeseller #realestate',
  'community-spotlight': '#sandiego #lajolla',
  'investment':          '#realestate #investing',
  'news':                '#realestate #housingmarket',
  'cost-breakdown':      '#homebuying #closingcosts',
  'flood-and-risk':      '#realestate #floodinsurance',
}

export function buildTikTokCaption(copy: string, category: string | undefined, articleUrl: string): string {
  const categoryTags = TIKTOK_CATEGORY_HASHTAGS[category ?? ''] ?? []
  const allTags = [...TIKTOK_BASE_HASHTAGS, ...categoryTags]
  return `${copy}\n\n${articleUrl}\n\n${allTags.join(' ')}`
}

export function buildLinkedInCaption(copy: string, category: string | undefined, articleUrl: string): string {
  const categoryTags = LINKEDIN_CATEGORY_HASHTAGS[category ?? ''] ?? []
  const baseTags = ['#RealEstate', '#SanDiego', '#SanDiegoRealEstate']
  const allTags = [...baseTags, ...categoryTags]
  return `${copy}\n\n${articleUrl}\n\n${allTags.join(' ')}`
}

export function buildXCaption(copy: string, category: string | undefined, articleUrl: string): string {
  const tags = X_CATEGORY_HASHTAGS[category ?? ''] ?? '#realestate'
  // X: keep total under 280 chars — copy + url (23) + tags
  const suffix = `\n\n${articleUrl} ${tags}`
  const maxCopy = 280 - suffix.length - 3
  const safeCopy = copy.length > maxCopy ? copy.slice(0, maxCopy) + '...' : copy
  return `${safeCopy}${suffix}`
}

export function buildInstagramCaption(copy: string, category: string | undefined, articleUrl: string): string {
  const tagMap: Record<string, string> = {
    'market-update':       '#SanDiego #RealEstate #SanDiegoRealEstate #LaJolla #RealEstateMarket',
    'buying-tips':         '#HomeBuying #SanDiego #RealEstate #FirstTimeHomeBuyer #Coronado',
    'selling-tips':        '#HomeSelling #SanDiego #RealEstate #SellingYourHome #PointLoma',
    'community-spotlight': '#SanDiego #LaJolla #Community #LivingInSD #CoastalLiving',
    'investment':          '#RealEstateInvesting #SanDiego #InvestmentProperty #RealEstate',
    'news':                '#SanDiego #RealEstate #RealEstateNews #Carlsbad',
    'cost-breakdown':      '#HomeBuying #RealEstate #SanDiego #HomeCosts #Carlsbad',
    'flood-and-risk':      '#SanDiego #FloodInsurance #CoastalLiving #RealEstate #Coronado',
  }
  const tags = tagMap[category ?? ''] ?? '#SanDiego #RealEstate #PalisadeRealty'
  return `${copy}\n\n${tags}\n\n${articleUrl}`
}

// ─── Platform captions ────────────────────────────────────────────────────────

export interface PlatformCaptions {
  facebook: string
  tiktok: string
  youtube: string
  instagram: string
  linkedin: string
  x: string
}

export async function generatePlatformCaptions(
  post: Pick<SanityBlogPost, 'title' | 'excerpt' | 'category'>,
): Promise<PlatformCaptions> {
  const categoryLabels: Record<string, string> = {
    'market-update': 'market update', 'buying-tips': 'home buying tips',
    'selling-tips': 'home selling tips', 'community-spotlight': 'community spotlight',
    'investment': 'real estate investment', 'news': 'real estate news',
    'cost-breakdown': 'cost breakdown', 'flood-and-risk': 'flood and risk',
  }

  const fallback: PlatformCaptions = {
    facebook: `I've been watching the San Diego market for over a decade — ${post.title.toLowerCase()} is something every local homeowner and buyer should understand right now.`,
    tiktok: post.excerpt ?? post.title,
    youtube: post.excerpt ?? `${post.title} — insights from Hedda Parashos at Palisade Realty in San Diego.`,
    instagram: post.excerpt ?? `${post.title} — new on the Palisade Realty blog.`,
    linkedin: post.excerpt ?? `${post.title} — insights from Hedda Parashos, Owner and President of Palisade Realty in San Diego.`,
    x: post.excerpt ?? post.title,
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Write 6 unique social media captions for the same San Diego real estate blog post by Hedda Parashos, Owner and President of Palisade Realty. Same core message, different delivery for each platform.

Article:
Title: ${post.title}
Category: ${categoryLabels[post.category ?? ''] ?? post.category ?? 'real estate'}
Excerpt: ${post.excerpt ?? ''}

${FAIR_HOUSING_RULES}

Return a JSON object with EXACTLY these 6 fields. No markdown fences.

{
  "facebook": "2–3 sentences. First person as Hedda. Teaser that makes someone stop scrolling. Pick ONE hook: surprising fact, question, local angle, myth-busting, direct value, or client story. Conversational and warm. No hashtags. Natural CTA.",
  "tiktok": "1–2 short casual sentences. Hook-first. Very conversational. No hashtags (appended separately).",
  "youtube": "2–3 sentences describing what viewers will learn. Informative. Mention San Diego specifically. No hashtags.",
  "instagram": "2–3 visually evocative sentences. Lifestyle + local angle. First person as Hedda. Warm and personal. No hashtags (those are appended separately).",
  "linkedin": "2–3 sentences. Professional tone, written as the brokerage owner sharing market insight with her network. No hashtags (appended separately).",
  "x": "1 short, punchy sentence, well under 200 characters. No hashtags (appended separately)."
}`,
      }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim())

    return {
      facebook:  parsed.facebook  || fallback.facebook,
      tiktok:    parsed.tiktok    || fallback.tiktok,
      youtube:   parsed.youtube   || fallback.youtube,
      instagram: parsed.instagram || fallback.instagram,
      linkedin:  parsed.linkedin  || fallback.linkedin,
      x:         parsed.x         || fallback.x,
    }
  } catch {
    return fallback
  }
}

// Keep for backward compatibility (used in generate-caption API route)
export async function generateSocialCopy(post: Pick<SanityBlogPost, 'title' | 'excerpt' | 'category'>): Promise<string> {
  const caps = await generatePlatformCaptions(post)
  return caps.facebook
}

// ─── Image URL resolver ───────────────────────────────────────────────────────

function getSanityImageUrl(coverImage: any): string | null {
  if (!coverImage?.asset?._ref) return null

  const builder = imageUrlBuilder(client)
  // Force JPEG @ quality 80 to keep files under platform limits.
  // X (Twitter) rejects images >5MB; Sanity's default (preserving source PNG)
  // can blow past that on detailed thumbnails. 1200×*, JPG 80 typically
  // lands well under 1MB and looks visually identical to higher-quality
  // PNGs at social-feed display sizes.
  return builder.image(coverImage).width(1200).quality(80).format('jpg').url()
}

// ─── Publish result types ─────────────────────────────────────────────────────

export type PlatformResult = { postSubmissionId: string } | { error: string } | null

export type PublishResult =
  | {
      ok: true
      facebook: PlatformResult
      facebookReel: PlatformResult
      youtube: PlatformResult
      tiktok: PlatformResult
      instagram: PlatformResult
      linkedin: PlatformResult
      x: PlatformResult
    }
  | { ok: false; error: string }

// ─── Inline Sanity workflow-status helpers ─────────────────────────────────────
// (Inlined here — see file-level note above on why content-workflow.ts /
// sanity-write.ts are not used.)

async function markPublishing(postId: string): Promise<void> {
  await writeClient.patch(postId).set({ workflowStatus: 'publishing' }).commit()
}

async function markPublishFailed(postId: string): Promise<void> {
  await writeClient.patch(postId).set({ workflowStatus: 'publish_failed' }).commit()
}

async function markPublished(
  postId: string,
  facebookSubmissionId: string,
  youtubeSubmissionId?: string,
  tiktokSubmissionId?: string,
  instagramSubmissionId?: string,
  linkedinSubmissionId?: string,
  xSubmissionId?: string,
  publishedAtOverride?: string,
): Promise<void> {
  const patch: Record<string, unknown> = {
    workflowStatus: 'published',
    publishedAt: publishedAtOverride ?? new Date().toISOString(),
    oneupFacebookSubmissionId: facebookSubmissionId,
    oneupFacebookStatus: 'pending',
  }
  if (youtubeSubmissionId) patch.oneupYoutubeSubmissionId = youtubeSubmissionId
  if (tiktokSubmissionId) patch.oneupTiktokSubmissionId = tiktokSubmissionId
  if (instagramSubmissionId) patch.oneupInstagramSubmissionId = instagramSubmissionId
  if (linkedinSubmissionId) patch.oneupLinkedinSubmissionId = linkedinSubmissionId
  if (xSubmissionId) patch.oneupXSubmissionId = xSubmissionId
  await writeClient.patch(postId).set(patch).commit()
}

/** For already-published posts getting social treatment for the first time. */
async function patchSocialSubmission(postId: string, facebookSubmissionId: string, socialCopy: string): Promise<void> {
  await writeClient
    .patch(postId)
    .set({ oneupFacebookSubmissionId: facebookSubmissionId, oneupFacebookStatus: 'pending', socialCopy })
    .commit()
}

function appBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim())
    ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '')
    : 'https://www.palisaderealty.com'
}

// ─── Social-only (for already-published posts) ────────────────────────────────

export async function publishSocialOnly(
  post: SanityBlogPost,
  socialCopy?: string,
): Promise<PublishResult> {
  const postId = post._id
  try {
    const captions = socialCopy
      ? { facebook: socialCopy, tiktok: socialCopy, youtube: socialCopy, instagram: socialCopy, linkedin: socialCopy, x: socialCopy }
      : await generatePlatformCaptions(post)

    const imageUrl = getSanityImageUrl(post.coverImage)
    if (!imageUrl) {
      return { ok: false, error: 'No cover image — cannot post without an image.' }
    }

    const articleUrl = `${appBaseUrl()}/blog/${post.slug}`

    const fbCopy = `${captions.facebook}\n\n${articleUrl}`
    const igCopy = buildInstagramCaption(captions.instagram, post.category, articleUrl)
    const liCopy = buildLinkedInCaption(captions.linkedin, post.category, articleUrl)
    const xCopy  = buildXCaption(captions.x, post.category, articleUrl)

    const [fbRes, igRes, liRes, xRes] = await Promise.allSettled([
      publishToFacebook(fbCopy, imageUrl),
      post.videoUrl
        ? publishToInstagramReel(igCopy, post.videoUrl)
        : publishToInstagram(igCopy, imageUrl),
      publishToLinkedIn(liCopy, imageUrl),
      publishToX(xCopy, imageUrl),
    ])

    const toResult = (r: PromiseSettledResult<{ postSubmissionId: string }>, label: string): PlatformResult =>
      r.status === 'fulfilled'
        ? { postSubmissionId: r.value.postSubmissionId }
        : { error: r.reason instanceof Error ? r.reason.message : `${label} publish failed` }

    const fbResult = toResult(fbRes, 'Facebook')
    const igResult = toResult(igRes, 'Instagram')
    const liResult = toResult(liRes, 'LinkedIn')
    const xResult  = toResult(xRes, 'X')

    // Use Facebook submission ID as the primary one for patchSocialSubmission
    const primaryId = fbResult && 'postSubmissionId' in fbResult ? fbResult.postSubmissionId : ''
    await patchSocialSubmission(postId, primaryId, captions.facebook)

    const extraPatch: Record<string, unknown> = {}
    if (igResult && 'postSubmissionId' in igResult) extraPatch.oneupInstagramSubmissionId = igResult.postSubmissionId
    if (liResult && 'postSubmissionId' in liResult) extraPatch.oneupLinkedinSubmissionId = liResult.postSubmissionId
    if (xResult && 'postSubmissionId' in xResult) extraPatch.oneupXSubmissionId = xResult.postSubmissionId
    if (Object.keys(extraPatch).length > 0) {
      await writeClient.patch(postId).set(extraPatch).commit()
    }

    return { ok: true, facebook: fbResult, facebookReel: null, youtube: null, tiktok: null, instagram: igResult, linkedin: liResult, x: xResult }
  } catch (err) {
    console.error('[publish-service] Social-only publish error:', err instanceof Error ? err.message : err)
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown publish error' }
  }
}

// ─── Full publish (website + all social platforms) ────────────────────────────

async function tryVideoThenImage(
  publishFn: (text: string, url: string) => Promise<{ postSubmissionId: string }>,
  text: string,
  videoUrl: string,
  imageUrl: string,
  platformLabel: string,
): Promise<PlatformResult> {
  try {
    const r = await publishFn(text, videoUrl)
    return { postSubmissionId: r.postSubmissionId }
  } catch (videoErr) {
    console.warn(`[publish-service] ${platformLabel} video rejected, falling back to image:`, videoErr instanceof Error ? videoErr.message : videoErr)
    try {
      const r = await publishFn(text, imageUrl)
      return { postSubmissionId: r.postSubmissionId }
    } catch (imgErr) {
      const msg = imgErr instanceof Error ? imgErr.message : `${platformLabel} publish failed`
      console.error(`[publish-service] ${platformLabel} fallback image also failed:`, msg)
      return { error: msg }
    }
  }
}

export async function publishPostToAll(
  post: SanityBlogPost,
  socialCopy?: string,
  publishedAtOverride?: string,
): Promise<PublishResult> {
  const postId = post._id

  try {
    await markPublishing(postId)

    const captions = socialCopy
      ? { facebook: socialCopy, tiktok: socialCopy, youtube: socialCopy, instagram: socialCopy, linkedin: socialCopy, x: socialCopy }
      : await generatePlatformCaptions(post)

    const imageUrl = getSanityImageUrl(post.coverImage)
    if (!imageUrl) {
      await markPublishFailed(postId)
      return { ok: false, error: 'No cover image set — cannot publish without an image.' }
    }

    const articleUrl = `${appBaseUrl()}/blog/${post.slug}`

    const fbCopy = `${captions.facebook}\n\n${articleUrl}`
    const igCopy = buildInstagramCaption(captions.instagram, post.category, articleUrl)
    const liCopy = buildLinkedInCaption(captions.linkedin, post.category, articleUrl)
    const xCopy  = buildXCaption(captions.x, post.category, articleUrl)

    // Always publish to Facebook (image post)
    const fbResult = await publishToFacebook(fbCopy, imageUrl)

    let reelResult: PlatformResult = null
    let ytResult: PlatformResult = null
    let ttResult: PlatformResult = null
    let igResult: PlatformResult = null

    // LinkedIn + X don't need video — publish unconditionally alongside Facebook.
    const liXPromise = Promise.allSettled([
      publishToLinkedIn(liCopy, imageUrl),
      publishToX(xCopy, imageUrl),
    ])

    if (post.videoUrl) {
      const videoDescription = `${captions.youtube}\n\n${articleUrl}`
      const tiktokCaption = buildTikTokCaption(captions.tiktok, post.category, articleUrl)

      const [reelOutcome, ytOutcome, ttOutcome, igOutcome] = await Promise.allSettled([
        publishToFacebookReel(fbCopy, post.videoUrl),
        publishToYouTube(post.title, videoDescription, post.videoUrl, post.videoThumbnailUrl),
        publishToTikTok(tiktokCaption, post.videoUrl),
        // Instagram: try reel, fall back to image
        tryVideoThenImage(publishToInstagramReel, igCopy, post.videoUrl, imageUrl, 'Instagram'),
      ])

      reelResult = reelOutcome.status === 'fulfilled'
        ? { postSubmissionId: reelOutcome.value.postSubmissionId }
        : { error: reelOutcome.reason instanceof Error ? reelOutcome.reason.message : 'Facebook Reel publish failed' }
      if (reelResult && 'error' in reelResult) console.error('[publish-service] Facebook Reel error:', reelResult.error)

      ytResult = ytOutcome.status === 'fulfilled'
        ? { postSubmissionId: ytOutcome.value.postSubmissionId }
        : { error: ytOutcome.reason instanceof Error ? ytOutcome.reason.message : 'YouTube publish failed' }
      if (ytResult && 'error' in ytResult) console.error('[publish-service] YouTube error:', ytResult.error)

      ttResult = ttOutcome.status === 'fulfilled'
        ? { postSubmissionId: ttOutcome.value.postSubmissionId }
        : { error: ttOutcome.reason instanceof Error ? ttOutcome.reason.message : 'TikTok publish failed' }
      if (ttResult && 'error' in ttResult) console.error('[publish-service] TikTok error:', ttResult.error)

      igResult = igOutcome.status === 'fulfilled' ? igOutcome.value : { error: igOutcome.reason instanceof Error ? igOutcome.reason.message : 'Instagram publish failed' }
    } else {
      // No video — Instagram gets an image post
      igResult = await publishToInstagram(igCopy, imageUrl).then(
        (r) => ({ postSubmissionId: r.postSubmissionId }) as PlatformResult,
      ).catch((err) => ({ error: err instanceof Error ? err.message : 'Instagram publish failed' }) as PlatformResult)
      if (igResult && 'error' in igResult) console.error('[publish-service] Instagram error:', igResult.error)
    }

    const [liOutcome, xOutcome] = await liXPromise
    const liResult: PlatformResult = liOutcome.status === 'fulfilled'
      ? { postSubmissionId: liOutcome.value.postSubmissionId }
      : { error: liOutcome.reason instanceof Error ? liOutcome.reason.message : 'LinkedIn publish failed' }
    if (liResult && 'error' in liResult) console.error('[publish-service] LinkedIn error:', liResult.error)

    const xResult: PlatformResult = xOutcome.status === 'fulfilled'
      ? { postSubmissionId: xOutcome.value.postSubmissionId }
      : { error: xOutcome.reason instanceof Error ? xOutcome.reason.message : 'X publish failed' }
    if (xResult && 'error' in xResult) console.error('[publish-service] X error:', xResult.error)

    await markPublished(
      postId,
      fbResult.postSubmissionId,
      ytResult && 'postSubmissionId' in ytResult ? ytResult.postSubmissionId : undefined,
      ttResult && 'postSubmissionId' in ttResult ? ttResult.postSubmissionId : undefined,
      igResult && 'postSubmissionId' in igResult ? igResult.postSubmissionId : undefined,
      liResult && 'postSubmissionId' in liResult ? liResult.postSubmissionId : undefined,
      xResult && 'postSubmissionId' in xResult ? xResult.postSubmissionId : undefined,
      publishedAtOverride,
    )

    if (!socialCopy) {
      await writeClient.patch(postId).set({ socialCopy: captions.facebook }).commit()
    }

    return {
      ok: true,
      facebook: { postSubmissionId: fbResult.postSubmissionId },
      facebookReel: reelResult,
      youtube: ytResult,
      tiktok: ttResult,
      instagram: igResult,
      linkedin: liResult,
      x: xResult,
    }
  } catch (err) {
    console.error('[publish-service] Publish error:', err instanceof Error ? err.message : err)
    try { await markPublishFailed(postId) } catch { /* ignore secondary error */ }
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown publish error' }
  }
}

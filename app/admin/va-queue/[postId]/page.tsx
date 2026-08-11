'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { upload } from '@vercel/blob/client'
import { AdminNav } from '@/components/AdminNav'
import type { FHViolation, FHCheckResult } from '@/lib/fair-housing'
import type { Scene, SourcedScene } from '@/lib/scene-images'

const BRAND = '#58172a'
const BRAND_TINT = '#fdf2f4'
const BRAND_BORDER = '#e5b9c4'

// ─── Types ────────────────────────────────────────────────────────────────────
// `@/sanity/queries` doesn't export a shared blogPost type in this codebase —
// lib/publish-service.ts defines its own local subset for the same reason,
// using `oneup*`-prefixed submission-id fields instead of the source repo's
// `blotato*` naming. This page follows the same convention.

export type WorkflowStatus =
  | 'media_pending'
  | 'media_ready'
  | 'publish_pending'
  | 'publishing'
  | 'scheduled'
  | 'published'
  | 'publish_failed'

export interface SanityBlogPost {
  _id: string
  title: string
  slug: string
  category?: string
  excerpt?: string
  publishedAt?: string
  coverImage?: { asset?: { _ref: string } }
  workflowStatus?: WorkflowStatus
  socialCopy?: string
  socialDeclined?: boolean
  videoScript?: string
  idxAreas?: string[]
  videoScenes?: Array<{
    keyword: string
    phrase: string
    imageQuery: string
    place?: string
    imageUrl?: string
    order?: number
    approved?: boolean
    source?: string
  }>
  videoUrl?: string
  videoThumbnailUrl?: string
  videoCoverUrl?: string
  scheduledPublishAt?: string
  vaQueuePriority?: number
  oneupFacebookSubmissionId?: string
  oneupFacebookStatus?: string
  facebookPostUrl?: string
  oneupFacebookReelSubmissionId?: string
  oneupYoutubeSubmissionId?: string
  oneupTiktokSubmissionId?: string
  oneupInstagramSubmissionId?: string
  youtubePostUrl?: string
  tiktokPostUrl?: string
}

type ThumbnailState =
  | { type: 'none' }
  | { type: 'upload'; file: File; previewUrl: string }
  | { type: 'saved'; previewUrl?: string }

type VideoState =
  | { type: 'none' }
  | { type: 'uploading'; progress: number }
  | { type: 'ready'; url: string; filename: string }
  | { type: 'saved'; url: string }

type PlatformStatus =
  | { phase: 'idle' }
  | { phase: 'publishing' }
  | { phase: 'polling'; submissionId: string }
  | { phase: 'done'; postUrl?: string }
  | { phase: 'error'; message: string }

type PublishState =
  | { phase: 'idle' }
  | { phase: 'saving' }
  | { phase: 'publishing' }
  | {
      phase: 'polling'
      facebook: PlatformStatus
      facebookReel: PlatformStatus
      youtube: PlatformStatus
      tiktok: PlatformStatus
      instagram: PlatformStatus
    }
  | {
      phase: 'done'
      facebook: PlatformStatus
      facebookReel: PlatformStatus
      youtube: PlatformStatus
      tiktok: PlatformStatus
      instagram: PlatformStatus
    }
  | { phase: 'error'; message: string }

// ── New Enterprise video-pipeline state ──────────────────────────────────────

type EnterpriseVideoState =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'polling'; videoId: string; elapsedSec: number }
  | { phase: 'done'; videoUrl: string }
  | { phase: 'error'; message: string }

const ENTERPRISE_POLL_MS = 15000
const ENTERPRISE_TIMEOUT_SEC = 40 * 60 // 40 minutes

const CATEGORY_LABELS: Record<string, string> = {
  'market-update': 'Market Update',
  'buying-tips':   'Buying Tips',
  'selling-tips':  'Selling Tips',
  'community-spotlight': 'Community Spotlight',
  'investment':    'Investment',
  'news':          'News',
}

const DELAY_OPTIONS: Array<{ label: string; hours: number | null }> = [
  { label: 'Now', hours: null },
  { label: '+1h', hours: 1 },
  { label: '+2h', hours: 2 },
  { label: '+4h', hours: 4 },
  { label: '+8h', hours: 8 },
  { label: '+12h', hours: 12 },
  { label: '+1 day', hours: 24 },
  { label: '+2 days', hours: 48 },
  { label: '+3 days', hours: 72 },
]

export default function VAPostPage() {
  const params = useParams()
  const postId = params.postId as string

  const secret = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('secret') ?? ''
    : ''

  const [post, setPost] = useState<SanityBlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fair Housing state
  const [fhResult, setFhResult] = useState<FHCheckResult | null>(null)
  const [fhExpanded, setFhExpanded] = useState(true)
  const [markingReviewed, setMarkingReviewed] = useState(false)
  // Per-violation action state. Keyed by excerpt+reason so it survives the array
  // reshuffle that happens after a violation is removed.
  const [violationActions, setViolationActions] = useState<Record<string, { state: 'fixing' | 'ignoring' | 'error'; error?: string }>>({})

  // Media editor state
  const [thumbnail, setThumbnail] = useState<ThumbnailState>({ type: 'none' })
  const [socialCopy, setSocialCopy] = useState('')
  const [generatingCaption, setGeneratingCaption] = useState(false)
  const [videoScript, setVideoScript] = useState('')
  const [generatingScript, setGeneratingScript] = useState(false)
  const [scenes, setScenes] = useState<Scene[]>([]) // scenes returned alongside the script — feeds the Scene Images card
  const [video, setVideo] = useState<VideoState>({ type: 'none' })
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string | null>(null)
  const [uploadingVideoThumb, setUploadingVideoThumb] = useState(false)
  const [videoUploadedAt, setVideoUploadedAt] = useState<Date | null>(null)
  const [videoPublishState, setVideoPublishState] = useState<
    | { phase: 'idle' }
    | { phase: 'publishing' }
    | { phase: 'done'; facebookReel: { postSubmissionId?: string; error?: string }; youtube: { postSubmissionId?: string; error?: string }; tiktok: { postSubmissionId?: string; error?: string } }
    | { phase: 'error'; message: string }
  >({ phase: 'idle' })

  // Publish state
  const [publishState, setPublishState] = useState<PublishState>({ phase: 'idle' })
  const pollRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({})

  // Schedule state
  const [publishDelay, setPublishDelay] = useState<number | null>(null) // hours, null = now
  const [scheduleState, setScheduleState] = useState<'idle' | 'scheduling' | 'cancelling'>('idle')
  const [scheduleError, setScheduleError] = useState('')

  // ── NEW: Blog Listings — IDX Area(s) state ──────────────────────────────────
  // NOTE: /api/content/suggest-idx-areas and /api/content/save-idx-areas are
  // wired here per the build spec, but the backend routes themselves were not
  // part of this pass — this card degrades gracefully (silently no-ops) if
  // they 404 until a backend engineer adds them.
  const [idxAreas, setIdxAreas] = useState<string[]>([])
  const [idxNewArea, setIdxNewArea] = useState('')
  const [idxSuggesting, setIdxSuggesting] = useState(false)
  const [idxSaving, setIdxSaving] = useState(false)
  const [idxSaved, setIdxSaved] = useState(false)

  // ── NEW: Avatar & Voice (Look IDs / Voice ID) state ─────────────────────────
  const [lookIds, setLookIds] = useState<string[]>(['', '', '', '', ''])
  const [voiceId, setVoiceId] = useState('')
  const [avatarLoading, setAvatarLoading] = useState(true)
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [avatarSaved, setAvatarSaved] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  // ── NEW: Scene Images (keyword-matched backgrounds) state ──────────────────
  const [sourcedScenes, setSourcedScenes] = useState<SourcedScene[]>([])
  const [findingImages, setFindingImages] = useState(false)
  const [findImagesError, setFindImagesError] = useState('')
  const [findImagesWarnings, setFindImagesWarnings] = useState<string[]>([])
  const [approvedScenes, setApprovedScenes] = useState<Record<number, string>>({})
  const [uploadingSceneIndex, setUploadingSceneIndex] = useState<number | null>(null)
  const [savingScenes, setSavingScenes] = useState(false)
  const [scenesSaved, setScenesSaved] = useState(false)
  const [saveScenesError, setSaveScenesError] = useState('')

  // ── NEW: Generate Video — Ylopo Enterprise state ────────────────────────────
  const [enterpriseCoverUrl, setEnterpriseCoverUrl] = useState<string | null>(null)
  const [uploadingEnterpriseCover, setUploadingEnterpriseCover] = useState(false)
  const [lookOverride, setLookOverride] = useState('') // '' = random from saved looks
  const [enterpriseState, setEnterpriseState] = useState<EnterpriseVideoState>({ phase: 'idle' })
  const enterprisePollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Load post ────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      if (!secret) { setError('Unauthorized'); setLoading(false); return }
      try {
        const res = await fetch(`/api/content/post?secret=${encodeURIComponent(secret)}&postId=${encodeURIComponent(postId)}`)
        if (res.status === 401) { setError('Unauthorized'); return }
        if (res.status === 404) { setError('Post not found.'); return }
        if (!res.ok) { setError('Failed to load post'); return }
        const found: SanityBlogPost = await res.json()
        setPost(found)

        if (found) {
          setSocialCopy(found.socialCopy ?? '')
          setVideoScript(found.videoScript ?? '')
          if (found.idxAreas?.length) setIdxAreas(found.idxAreas)
          // Rehydrate scenes saved by a previous generate-script call — without
          // this, refreshing the page after generating a script (but before
          // finding/approving images) wipes the Scene Images card back to
          // "Generate a video script above first" even though a script exists.
          if (found.videoScenes?.length) {
            setScenes(found.videoScenes.map((s) => ({
              keyword: s.keyword,
              phrase: s.phrase,
              imageQuery: s.imageQuery,
              ...(s.place ? { place: s.place } : {}),
            })))
            // Also rehydrate which scenes were already approved + saved, keyed
            // by array order, so a previously-saved selection still shows as
            // selected instead of looking unset after a reload.
            const approved: Record<number, string> = {}
            found.videoScenes.forEach((s, i) => {
              if (s.approved && s.imageUrl) approved[i] = s.imageUrl
            })
            if (Object.keys(approved).length > 0) setApprovedScenes(approved)
          }

          // mark-ready always advances workflowStatus regardless of whether an
          // image was ever uploaded (e.g. it's also used to save caption/script
          // edits before a thumbnail exists) — so workflowStatus alone can't
          // tell us a cover image is actually saved. Check the real data.
          if (found.coverImage?.asset) {
            setThumbnail({ type: 'saved' })
          }

          if (found.videoUrl) {
            setVideo({ type: 'saved', url: found.videoUrl })
          }
          if (found.videoThumbnailUrl) {
            setVideoThumbnailUrl(found.videoThumbnailUrl)
          }
          if (found.videoCoverUrl) {
            setEnterpriseCoverUrl(found.videoCoverUrl)
          }

          // Fetch FH result
          fetch(`/api/content/fh-status?secret=${encodeURIComponent(secret)}&postIds=${encodeURIComponent(found._id)}`)
            .then(r => r.ok ? r.json() : {})
            .then((map: Record<string, FHCheckResult>) => {
              const result = map[found._id]
              if (result && (result.severity === 'warning' || result.severity === 'violation')) {
                setFhResult(result)
              }
            })
            .catch(() => {})
        }
      } catch {
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [postId, secret])

  // ── Load saved avatar/voice settings ────────────────────────────────────────
  useEffect(() => {
    if (!secret) return
    fetch(`/api/content/video-settings?secret=${encodeURIComponent(secret)}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: { lookIds?: string[]; voiceId?: string | null } | null) => {
        if (data?.lookIds?.length) {
          const padded = [...data.lookIds, '', '', '', '', ''].slice(0, 5)
          setLookIds(padded)
        }
        if (data?.voiceId) setVoiceId(data.voiceId)
      })
      .catch(() => {})
      .finally(() => setAvatarLoading(false))
  }, [secret])

  // ── Cleanup polls on unmount ─────────────────────────────────────────────────
  useEffect(() => () => {
    Object.values(pollRefs.current).forEach(clearInterval)
    if (enterprisePollRef.current) clearInterval(enterprisePollRef.current)
  }, [])

  // ── Mark FH reviewed ────────────────────────────────────────────────────────
  async function handleMarkFHReviewed() {
    setMarkingReviewed(true)
    try {
      await fetch(`/api/content/fh-mark-reviewed?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      setFhResult(prev => prev ? { ...prev, reviewedAt: new Date().toISOString() } : prev)
    } catch { /* ignore */ } finally {
      setMarkingReviewed(false)
    }
  }

  // ── Fix or Ignore a single FH violation ─────────────────────────────────────
  function violationKey(v: { excerpt?: string; reason?: string }): string {
    return `${v.excerpt ?? ''}::${v.reason ?? ''}`
  }

  async function refetchPost() {
    try {
      const res = await fetch(`/api/content/post?secret=${encodeURIComponent(secret)}&postId=${encodeURIComponent(postId)}`)
      if (!res.ok) return
      const updated: SanityBlogPost = await res.json()
      setPost(updated)
    } catch { /* ignore */ }
  }

  async function handleFixViolation(index: number, v: FHViolation) {
    const key = violationKey(v)
    setViolationActions(prev => ({ ...prev, [key]: { state: 'fixing' } }))
    try {
      const res = await fetch(`/api/content/fh-fix-violation?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, violationIndex: index }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setViolationActions(prev => ({ ...prev, [key]: { state: 'error', error: data.error ?? 'Fix failed' } }))
        return
      }
      setViolationActions(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      if (data.fhResult && Array.isArray(data.fhResult.violations) && data.fhResult.violations.length > 0) {
        setFhResult(data.fhResult)
      } else {
        setFhResult(null)
      }
      await refetchPost()
    } catch (err) {
      setViolationActions(prev => ({
        ...prev,
        [key]: { state: 'error', error: err instanceof Error ? err.message : 'Fix failed' },
      }))
    }
  }

  async function handleIgnoreViolation(index: number, v: FHViolation) {
    const key = violationKey(v)
    setViolationActions(prev => ({ ...prev, [key]: { state: 'ignoring' } }))
    try {
      const res = await fetch(`/api/content/fh-ignore-violation?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, violationIndex: index }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setViolationActions(prev => ({ ...prev, [key]: { state: 'error', error: data.error ?? 'Ignore failed' } }))
        return
      }
      setViolationActions(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      if (data.fhResult && Array.isArray(data.fhResult.violations) && data.fhResult.violations.length > 0) {
        setFhResult(data.fhResult)
      } else {
        setFhResult(null)
      }
    } catch (err) {
      setViolationActions(prev => ({
        ...prev,
        [key]: { state: 'error', error: err instanceof Error ? err.message : 'Ignore failed' },
      }))
    }
  }

  // ── Generate Facebook caption ────────────────────────────────────────────────
  async function handleGenerateCaption() {
    if (!post) return
    setGeneratingCaption(true)
    try {
      const res = await fetch(`/api/content/generate-caption?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: post.title, excerpt: post.excerpt, category: post.category }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setSocialCopy(data.caption)
    } catch {
      // leave existing copy unchanged
    } finally {
      setGeneratingCaption(false)
    }
  }

  // ── Generate video script (v2 — data-grounded, postId-only, returns scenes) ─
  async function handleGenerateScript() {
    if (!post) return
    setGeneratingScript(true)
    try {
      const res = await fetch(`/api/content/generate-script?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setVideoScript(data.script)
      setScenes(Array.isArray(data.scenes) ? data.scenes : [])
    } catch {
      // leave existing script unchanged
    } finally {
      setGeneratingScript(false)
    }
  }

  // ── Video upload via Vercel Blob ─────────────────────────────────────────────
  async function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setVideo({ type: 'uploading', progress: 0 })

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `/api/content/upload-video?secret=${encodeURIComponent(secret)}`,
        onUploadProgress: ({ percentage }) => {
          setVideo({ type: 'uploading', progress: Math.round(percentage) })
        },
      })

      setVideo({ type: 'ready', url: blob.url, filename: file.name })
      setVideoUploadedAt(new Date())
    } catch (err) {
      setVideo({ type: 'none' })
      alert(err instanceof Error ? err.message : 'Video upload failed')
    }

    // Reset input so the same file can be re-selected
    e.target.value = ''
  }

  function handleRemoveVideo() {
    setVideo({ type: 'none' })
  }

  // ── Re-publish video to all platforms for already-published posts ───────────
  async function handlePublishVideoOnly() {
    if (video.type !== 'ready') return
    setVideoPublishState({ phase: 'publishing' })
    try {
      const res = await fetch(`/api/content/publish-video?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          videoUrl: video.url,
          ...(videoThumbnailUrl ? { videoThumbnailUrl } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Publish failed')
      setVideoPublishState({
        phase: 'done',
        facebookReel: data.facebookReel ?? {},
        youtube:      data.youtube      ?? {},
        tiktok:       data.tiktok       ?? {},
      })
    } catch (err) {
      setVideoPublishState({ phase: 'error', message: err instanceof Error ? err.message : 'Publish failed' })
    }
  }

  // ── Replace saved video on a published post ──────────────────────────────────
  function handleReplaceVideo() {
    setVideo({ type: 'none' })
    setVideoPublishState({ phase: 'idle' })
  }

  async function handleVideoThumbnailSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideoThumb(true)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `/api/content/upload-video?secret=${encodeURIComponent(secret)}`,
      })
      setVideoThumbnailUrl(blob.url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Thumbnail upload failed')
    } finally {
      setUploadingVideoThumb(false)
      e.target.value = ''
    }
  }

  // Uploads the selected blog thumbnail to Vercel Blob first — sending the raw
  // file through the mark-ready multipart route hits the ~4.5MB serverless
  // request-body cap on larger images and dies with a browser "Failed to fetch".
  async function uploadThumbnailToBlob(file: File): Promise<string> {
    const blob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: `/api/content/upload-video?secret=${encodeURIComponent(secret)}`,
    })
    return blob.url
  }

  // ── Upload thumbnail ─────────────────────────────────────────────────────────
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setThumbnail({ type: 'upload', file, previewUrl })
    // Persist immediately — a thumbnail that only lives in component state is
    // silently lost when the operator navigates away without hitting Mark
    // Ready/Publish, and the Media Review queue can't show it.
    void persistThumbnail(file, previewUrl)
  }

  async function persistThumbnail(file: File, previewUrl: string) {
    try {
      const blobUrl = await uploadThumbnailToBlob(file)
      const form = new FormData()
      form.append('postId', postId)
      form.append('imageUrl', blobUrl)
      form.append('advance', 'false') // save the image only — don't touch workflowStatus
      const res = await fetch(`/api/content/mark-ready?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('thumbnail save failed')
      setThumbnail({ type: 'saved', previewUrl })
    } catch {
      // Leave state as 'upload' — Mark Ready / Publish / Schedule still upload
      // it as before, so nothing is lost if this background save fails.
    }
  }

  // ── NEW: Blog Listings — Area(s) handlers ───────────────────────────────────
  async function handleSuggestAreas() {
    if (!post) return
    setIdxSuggesting(true)
    try {
      const res = await fetch(`/api/content/suggest-idx-areas?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, title: post.title, excerpt: post.excerpt }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && Array.isArray(data?.areas)) {
        setIdxAreas(prev => Array.from(new Set([...prev, ...data.areas])))
      }
    } catch { /* leave list unchanged */ } finally {
      setIdxSuggesting(false)
    }
  }

  function handleAddArea() {
    const v = idxNewArea.trim()
    if (!v) return
    setIdxAreas(prev => Array.from(new Set([...prev, v])))
    setIdxNewArea('')
  }

  function handleRemoveArea(area: string) {
    setIdxAreas(prev => prev.filter(a => a !== area))
  }

  async function handleSaveAreas() {
    setIdxSaving(true)
    setIdxSaved(false)
    try {
      const res = await fetch(`/api/content/save-idx-areas?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, areas: idxAreas }),
      })
      if (res.ok) setIdxSaved(true)
    } catch { /* ignore */ } finally {
      setIdxSaving(false)
    }
  }

  // ── NEW: Avatar & Voice handlers ────────────────────────────────────────────
  function updateLookId(index: number, value: string) {
    setLookIds(prev => prev.map((v, i) => (i === index ? value : v)))
  }

  async function handleSaveAvatarSettings() {
    setAvatarSaving(true)
    setAvatarSaved(false)
    setAvatarError('')
    const cleanLookIds = lookIds.map(s => s.trim()).filter(Boolean)
    if (cleanLookIds.length === 0) { setAvatarError('At least one Look ID is required.'); setAvatarSaving(false); return }
    if (!voiceId.trim()) { setAvatarError('Voice ID is required.'); setAvatarSaving(false); return }
    try {
      const res = await fetch(`/api/content/video-settings?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lookIds: cleanLookIds, voiceId: voiceId.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setAvatarSaved(true)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setAvatarSaving(false)
    }
  }

  // ── NEW: Scene Images handlers ──────────────────────────────────────────────
  async function handleFindImages() {
    if (scenes.length === 0) return
    setFindingImages(true)
    setFindImagesError('')
    setFindImagesWarnings([])
    try {
      const res = await fetch(`/api/content/source-scene-images?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error ?? `Image sourcing failed (HTTP ${res.status})`)
      }
      if (Array.isArray(data.scenes)) {
        setSourcedScenes(data.scenes)
        if (Array.isArray(data.warnings) && data.warnings.length > 0) {
          setFindImagesWarnings(data.warnings)
        }
        if (data.scenes.every((s: SourcedScene) => s.candidates.length === 0)) {
          setFindImagesError('No images could be sourced for any scene — check the warnings above (or Vercel logs) for the failing provider.')
        }
      }
    } catch (err) {
      setFindImagesError(err instanceof Error ? err.message : 'Image sourcing failed')
    } finally {
      setFindingImages(false)
    }
  }

  function handleApproveCandidate(sceneIndex: number, url: string) {
    setApprovedScenes(prev => ({ ...prev, [sceneIndex]: url }))
    setScenesSaved(false)
  }

  async function handleUploadOwnScene(sceneIndex: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingSceneIndex(sceneIndex)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `/api/content/upload-video?secret=${encodeURIComponent(secret)}`,
      })
      setApprovedScenes(prev => ({ ...prev, [sceneIndex]: blob.url }))
      setScenesSaved(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingSceneIndex(null)
      e.target.value = ''
    }
  }

  // /api/content/save-scenes expects the full scene shape it can persist
  // (keyword/phrase/order/approved/imageUrl), not a bare list of URLs —
  // send every scene so metadata for not-yet-approved ones survives too.
  // Shared by the Save Scenes button and the HeyGen generate button (which
  // auto-saves so a forgotten click can't cause "no approved video scenes").
  async function saveScenesToSanity(): Promise<void> {
    const scenesPayload = scenes.map((scene, sceneIndex) => ({
      keyword: scene.keyword,
      phrase: scene.phrase,
      imageQuery: scene.imageQuery,
      ...(scene.place ? { place: scene.place } : {}),
      imageUrl: approvedScenes[sceneIndex] ?? '',
      order: sceneIndex,
      approved: sceneIndex in approvedScenes,
    }))
    const res = await fetch(`/api/content/save-scenes?secret=${encodeURIComponent(secret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, scenes: scenesPayload }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error ?? 'Save failed')
    setScenesSaved(true)
  }

  async function handleSaveScenes() {
    setSavingScenes(true)
    setScenesSaved(false)
    setSaveScenesError('')
    try {
      await saveScenesToSanity()
    } catch (err) {
      setSaveScenesError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSavingScenes(false)
    }
  }

  // ── NEW: Generate Video — Ylopo Enterprise handlers ─────────────────────────
  async function handleUploadEnterpriseCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingEnterpriseCover(true)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `/api/content/upload-video?secret=${encodeURIComponent(secret)}`,
      })
      setEnterpriseCoverUrl(blob.url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Cover thumbnail upload failed')
    } finally {
      setUploadingEnterpriseCover(false)
      e.target.value = ''
    }
  }

  async function handleGenerateEnterpriseVideo() {
    if (enterprisePollRef.current) clearInterval(enterprisePollRef.current)
    setEnterpriseState({ phase: 'submitting' })
    try {
      // Auto-save uploaded/approved scene images first — the render reads them
      // from Sanity, so an unsaved selection would fail with "no approved
      // video scenes" even though the images are visible on this page.
      if (scenes.length > 0 && Object.keys(approvedScenes).length > 0 && !scenesSaved) {
        await saveScenesToSanity()
      }
      const res = await fetch(`/api/content/generate-enterprise-video?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, ...(lookOverride ? { lookOverride } : {}), ...(enterpriseCoverUrl ? { coverUrl: enterpriseCoverUrl } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to start render')

      const videoId = data.videoId
      setEnterpriseState({ phase: 'polling', videoId, elapsedSec: 0 })

      let elapsedSec = 0
      enterprisePollRef.current = setInterval(async () => {
        elapsedSec += 15
        try {
          const statusRes = await fetch(
            `/api/content/enterprise-status?secret=${encodeURIComponent(secret)}&videoId=${encodeURIComponent(videoId)}&postId=${encodeURIComponent(postId)}`
          )
          const statusData = await statusRes.json()

          if (statusData.status === 'completed') {
            clearInterval(enterprisePollRef.current!)
            setEnterpriseState({ phase: 'done', videoUrl: statusData.videoUrl })
          } else if (statusData.status === 'failed') {
            clearInterval(enterprisePollRef.current!)
            setEnterpriseState({ phase: 'error', message: statusData.error ?? 'Render failed' })
          } else if (elapsedSec >= ENTERPRISE_TIMEOUT_SEC) {
            clearInterval(enterprisePollRef.current!)
            setEnterpriseState({ phase: 'error', message: 'Render timed out after 40 minutes. Try again.' })
          } else {
            setEnterpriseState({ phase: 'polling', videoId, elapsedSec })
          }
        } catch { /* keep polling */ }
      }, ENTERPRISE_POLL_MS)
    } catch (err) {
      setEnterpriseState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to start render' })
    }
  }

  // ── Mark Ready ───────────────────────────────────────────────────────────────
  async function handleMarkReady() {
    if (thumbnail.type !== 'upload') return

    setPublishState({ phase: 'saving' })

    try {
      const form = new FormData()
      form.append('postId', postId)
      form.append('socialCopy', socialCopy)
      if (videoScript) form.append('videoScript', videoScript)

      const videoUrl = video.type === 'ready' ? video.url :
                       video.type === 'saved' ? video.url : null
      if (videoUrl) form.append('videoUrl', videoUrl)
      if (videoThumbnailUrl) form.append('videoThumbnailUrl', videoThumbnailUrl)

      if (thumbnail.type === 'upload') {
        form.append('imageUrl', await uploadThumbnailToBlob(thumbnail.file))
      }

      const res = await fetch(`/api/content/mark-ready?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        body: form,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to save')

      setThumbnail({ type: 'saved' })
      if (video.type === 'ready') {
        setVideo(prev => prev.type === 'ready' ? { type: 'saved', url: prev.url } : prev)
      }
      setPost(prev => prev ? { ...prev, workflowStatus: 'media_ready' as WorkflowStatus } : prev)
      setPublishState({ phase: 'idle' })
    } catch (err) {
      setPublishState({ phase: 'error', message: err instanceof Error ? err.message : 'Save failed' })
    }
  }

  // ── Poll a single platform ───────────────────────────────────────────────────
  function startPoll(
    platform: 'facebook' | 'facebookReel' | 'youtube' | 'tiktok' | 'instagram',
    submissionId: string,
    onUpdate: (status: PlatformStatus) => void,
  ) {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(
          `/api/content/oneup-status?secret=${encodeURIComponent(secret)}&postSubmissionId=${encodeURIComponent(submissionId)}&postId=${encodeURIComponent(postId)}&platform=${platform}`
        )
        const data = await res.json()

        if (data.status === 'published') {
          clearInterval(interval)
          delete pollRefs.current[platform]
          onUpdate({ phase: 'done', postUrl: data.postUrl })
        } else if (data.status === 'failed') {
          clearInterval(interval)
          delete pollRefs.current[platform]
          onUpdate({ phase: 'error', message: data.errorMessage ?? `${platform} publish failed` })
        } else if (attempts >= 30) {
          clearInterval(interval)
          delete pollRefs.current[platform]
          onUpdate({ phase: 'done' })
        }
      } catch { /* keep trying */ }
    }, 10000)

    pollRefs.current[platform] = interval
  }

  // ── Publish ──────────────────────────────────────────────────────────────────
  async function handlePublish() {
    setPublishState({ phase: 'saving' })

    try {
      // If thumbnail hasn't been uploaded to Sanity yet, do it now
      if (thumbnail.type === 'upload') {
        const form = new FormData()
        form.append('postId', postId)
        form.append('socialCopy', socialCopy)
        if (videoScript) form.append('videoScript', videoScript)
        if (video.type === 'ready') form.append('videoUrl', video.url)
        if (videoThumbnailUrl) form.append('videoThumbnailUrl', videoThumbnailUrl)
        form.append('imageUrl', await uploadThumbnailToBlob(thumbnail.file))

        const markRes = await fetch(`/api/content/mark-ready?secret=${encodeURIComponent(secret)}`, {
          method: 'POST',
          body: form,
        })
        if (!markRes.ok) {
          const d = await markRes.json()
          throw new Error(d.error ?? 'Failed to save thumbnail')
        }
        setThumbnail({ type: 'saved' })
        if (video.type === 'ready') {
          setVideo(prev => prev.type === 'ready' ? { type: 'saved', url: prev.url } : prev)
        }
      }

      setPublishState({ phase: 'publishing' })

      // Always pass the current video URL — if it was uploaded after mark-ready it won't be in Sanity yet
      const currentVideoUrl = video.type === 'ready' ? video.url : video.type === 'saved' ? video.url : undefined

      const res = await fetch(`/api/content/publish?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          socialCopy,
          ...(currentVideoUrl ? { videoUrl: currentVideoUrl } : {}),
          ...(videoThumbnailUrl ? { videoThumbnailUrl } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Publish failed')

      const initFb: PlatformStatus = data.facebook?.postSubmissionId
        ? { phase: 'polling', submissionId: data.facebook.postSubmissionId }
        : { phase: 'idle' }
      const initReel: PlatformStatus = data.facebookReel?.postSubmissionId
        ? { phase: 'polling', submissionId: data.facebookReel.postSubmissionId }
        : data.facebookReel?.error
        ? { phase: 'error', message: data.facebookReel.error }
        : { phase: 'idle' }
      const initYt: PlatformStatus = data.youtube?.postSubmissionId
        ? { phase: 'polling', submissionId: data.youtube.postSubmissionId }
        : data.youtube?.error
        ? { phase: 'error', message: data.youtube.error }
        : { phase: 'idle' }
      const initTt: PlatformStatus = data.tiktok?.postSubmissionId
        ? { phase: 'polling', submissionId: data.tiktok.postSubmissionId }
        : data.tiktok?.error
        ? { phase: 'error', message: data.tiktok.error }
        : { phase: 'idle' }
      const initIg: PlatformStatus = data.instagram?.postSubmissionId
        ? { phase: 'polling', submissionId: data.instagram.postSubmissionId }
        : data.instagram?.error
        ? { phase: 'error', message: data.instagram.error }
        : { phase: 'idle' }

      setPublishState({ phase: 'polling', facebook: initFb, facebookReel: initReel, youtube: initYt, tiktok: initTt, instagram: initIg })
      setPost(prev => prev ? { ...prev, workflowStatus: 'published' as WorkflowStatus } : prev)
      // Mark video as saved so the secondary "Publish Video" button doesn't appear
      setVideo(prev => prev.type === 'ready' ? { type: 'saved', url: prev.url } : prev)

      const resolved = {
        facebook: initFb.phase === 'idle',
        facebookReel: initReel.phase === 'idle',
        youtube: initYt.phase === 'idle',
        tiktok: initTt.phase === 'idle',
        instagram: initIg.phase === 'idle',
      }
      const statuses: Record<string, PlatformStatus> = {
        facebook: initFb, facebookReel: initReel,
        youtube: initYt, tiktok: initTt,
        instagram: initIg,
      }

      function checkAllDone() {
        if (resolved.facebook && resolved.facebookReel && resolved.youtube && resolved.tiktok && resolved.instagram) {
          setPublishState({ phase: 'done', facebook: statuses.facebook, facebookReel: statuses.facebookReel, youtube: statuses.youtube, tiktok: statuses.tiktok, instagram: statuses.instagram })
        }
      }

      if (data.facebook?.postSubmissionId) {
        startPoll('facebook', data.facebook.postSubmissionId, (s) => {
          statuses.facebook = s
          resolved.facebook = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, facebook: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.facebook = true
      }

      if (data.facebookReel?.postSubmissionId) {
        startPoll('facebookReel', data.facebookReel.postSubmissionId, (s) => {
          statuses.facebookReel = s
          resolved.facebookReel = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, facebookReel: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.facebookReel = true
      }

      if (data.youtube?.postSubmissionId) {
        startPoll('youtube', data.youtube.postSubmissionId, (s) => {
          statuses.youtube = s
          resolved.youtube = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, youtube: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.youtube = true
      }

      if (data.tiktok?.postSubmissionId) {
        startPoll('tiktok', data.tiktok.postSubmissionId, (s) => {
          statuses.tiktok = s
          resolved.tiktok = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, tiktok: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.tiktok = true
      }

      if (data.instagram?.postSubmissionId) {
        startPoll('instagram', data.instagram.postSubmissionId, (s) => {
          statuses.instagram = s
          resolved.instagram = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, instagram: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.instagram = true
      }

      checkAllDone()
    } catch (err) {
      setPublishState({ phase: 'error', message: err instanceof Error ? err.message : 'Publish failed' })
    }
  }

  async function handleSchedule() {
    if (!post || publishDelay === null) return
    setScheduleError('')
    setScheduleState('scheduling')
    try {
      // Save thumbnail + video URL to Sanity if not already done (mirrors handlePublish)
      if (thumbnail.type === 'upload') {
        const form = new FormData()
        form.append('postId', postId)
        form.append('socialCopy', socialCopy)
        if (videoScript) form.append('videoScript', videoScript)
        if (video.type === 'ready') form.append('videoUrl', video.url)
        if (videoThumbnailUrl) form.append('videoThumbnailUrl', videoThumbnailUrl)
        form.append('imageUrl', await uploadThumbnailToBlob(thumbnail.file))
        const markRes = await fetch(`/api/content/mark-ready?secret=${encodeURIComponent(secret)}`, {
          method: 'POST',
          body: form,
        })
        if (!markRes.ok) {
          const d = await markRes.json()
          throw new Error(d.error ?? 'Failed to save thumbnail')
        }
        setThumbnail({ type: 'saved' })
        if (video.type === 'ready') {
          setVideo(prev => prev.type === 'ready' ? { type: 'saved', url: prev.url } : prev)
        }
      }

      const scheduledPublishAt = new Date(Date.now() + publishDelay * 3600 * 1000).toISOString()
      const videoUrl = video.type === 'ready' ? video.url : video.type === 'saved' ? video.url : undefined
      const res = await fetch(`/api/content/schedule?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post._id, scheduledPublishAt, videoUrl, videoThumbnailUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to schedule')
      setPost(prev => prev ? { ...prev, workflowStatus: 'scheduled', scheduledPublishAt } : prev)
      setScheduleState('idle')
    } catch (err) {
      setScheduleError(err instanceof Error ? err.message : 'Failed to schedule')
      setScheduleState('idle')
    }
  }

  async function handleCancelSchedule() {
    if (!post) return
    setScheduleState('cancelling')
    try {
      const res = await fetch(`/api/content/schedule?secret=${encodeURIComponent(secret)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post._id }),
      })
      if (!res.ok) throw new Error('Failed to cancel')
      setPost(prev => prev ? { ...prev, workflowStatus: 'media_ready', scheduledPublishAt: undefined } : prev)
      setPublishDelay(null)
      setScheduleState('idle')
    } catch {
      setScheduleState('idle')
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const thumbnailPreviewUrl =
    thumbnail.type === 'upload' ? thumbnail.previewUrl :
    thumbnail.type === 'saved' && thumbnail.previewUrl ? thumbnail.previewUrl :
    thumbnail.type === 'saved' && post?.coverImage?.asset
      ? `https://cdn.sanity.io/images/qjhzi2t2/production/${post.coverImage.asset._ref.replace('image-', '').replace(/-(\w+)$/, '.$1')}`
      : null

  const isReady = post?.workflowStatus === 'media_ready'
  const isPublished = post?.workflowStatus === 'published'
  const isScheduled = post?.workflowStatus === 'scheduled'
  const videoUploading = video.type === 'uploading'
  const canPublish = !isPublished && !isScheduled && (thumbnail.type === 'saved' || thumbnail.type === 'upload') && !videoUploading
  const publishInProgress = ['saving', 'publishing', 'polling'].includes(publishState.phase)
  const hasVideo = video.type === 'ready' || video.type === 'saved'

  // Script word count / duration estimate for the updated Video Script card
  const scriptWordCount = videoScript.trim() ? videoScript.trim().split(/\s+/).length : 0
  const scriptEstSeconds = Math.round(scriptWordCount / 2.5) // ~150 wpm speaking pace
  const scriptOverLimit = scriptWordCount > 150

  const savedLookOptions = lookIds.map((id, i) => ({ id: id.trim(), n: i + 1 })).filter(l => l.id)

  if (loading) return <PageShell><p style={{ padding: 32, color: '#64748b' }}>Loading…</p></PageShell>
  if (error) return <PageShell><p style={{ padding: 32, color: '#dc2626' }}>{error}</p></PageShell>
  if (!post) return <PageShell><p style={{ padding: 32, color: '#64748b' }}>Post not found in queue.</p></PageShell>

  return (
    <PageShell>
      {/* Nav */}
      <AdminNav />
      {/* Post title bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
        {post.workflowStatus && (
          <span style={{ flexShrink: 0, fontSize: 11, background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 99, fontWeight: 600 }}>
            {post.workflowStatus.replace(/_/g, ' ').toUpperCase()}
          </span>
        )}
      </div>

      {/* Fair Housing panel — ported verbatim from source */}
      {fhResult && (
        <div style={{
          margin: '0 auto',
          maxWidth: 1200,
          padding: '0 24px',
          marginTop: 16,
        }}>
          <div style={{
            border: fhResult.severity === 'violation' ? '1.5px solid #fca5a5' : '1.5px solid #fcd34d',
            borderRadius: 10,
            background: fhResult.severity === 'violation' ? '#fef2f2' : '#fffbeb',
            overflow: 'hidden',
          }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setFhExpanded(p => !p)}
            >
              <span style={{ fontSize: 16 }}>{fhResult.severity === 'violation' ? '🚨' : '⚠️'}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: fhResult.severity === 'violation' ? '#dc2626' : '#b45309', flex: 1 }}>
                Fair Housing {fhResult.severity === 'violation' ? 'Hold' : 'Review'} — {fhResult.violations.length} issue{fhResult.violations.length !== 1 ? 's' : ''} flagged
                {fhResult.reviewedAt && <span style={{ fontWeight: 400, color: '#64748b', marginLeft: 8 }}>· Reviewed</span>}
              </span>
              {!fhResult.reviewedAt && (
                <button
                  onClick={e => { e.stopPropagation(); handleMarkFHReviewed() }}
                  disabled={markingReviewed}
                  style={{
                    padding: '5px 14px', background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: markingReviewed ? 'wait' : 'pointer',
                    color: '#475569',
                  }}
                >
                  {markingReviewed ? 'Saving…' : 'Mark as Reviewed'}
                </button>
              )}
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{fhExpanded ? '▲' : '▼'}</span>
            </div>
            {fhExpanded && (
              <div style={{ borderTop: `1px solid ${fhResult.severity === 'violation' ? '#fca5a5' : '#fcd34d'}`, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {fhResult.violations.map((v: FHViolation, i: number) => {
                  const key = violationKey(v)
                  const action = violationActions[key]
                  const busy = action?.state === 'fixing' || action?.state === 'ignoring'
                  return (
                    <div key={key + '-' + i} style={{ background: '#fff', borderRadius: 8, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: v.severity === 'violation' ? '#dc2626' : '#b45309' }}>
                          {v.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontStyle: 'italic', color: '#374151', background: '#f8f7f4', borderRadius: 6, padding: '6px 10px', marginBottom: 6 }}>
                        &quot;{v.excerpt}&quot;
                      </div>
                      <div style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}><strong>Why:</strong> {v.reason}</div>
                      <div style={{ fontSize: 13, color: '#059669', marginBottom: 10 }}><strong>Use instead:</strong> {v.suggestion}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                          onClick={() => handleFixViolation(i, v)}
                          disabled={busy}
                          style={{
                            padding: '5px 12px',
                            background: '#059669',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: busy ? 'wait' : 'pointer',
                            opacity: busy ? 0.7 : 1,
                          }}
                        >
                          {action?.state === 'fixing' ? 'Fixing…' : 'Fix'}
                        </button>
                        <button
                          onClick={() => handleIgnoreViolation(i, v)}
                          disabled={busy}
                          style={{
                            padding: '5px 12px',
                            background: '#fff',
                            color: '#475569',
                            border: '1px solid #e2e8f0',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: busy ? 'wait' : 'pointer',
                            opacity: busy ? 0.7 : 1,
                          }}
                        >
                          {action?.state === 'ignoring' ? 'Ignoring…' : 'Ignore'}
                        </button>
                        {action?.state === 'error' && action.error && (
                          <span style={{ fontSize: 12, color: '#dc2626', flex: 1 }}>
                            {action.error}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                  <strong>Fix</strong> applies the suggested replacement directly in the post body.
                  <strong> Ignore</strong> dismisses just this one violation without changing the post.
                  Use &quot;Mark as Reviewed&quot; above to clear the entire hold at once.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32, alignItems: 'start' }}>

        {/* ── LEFT ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Article context */}
          <Card title="Article">
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {post.category && (
                <span style={{ fontSize: 11, fontWeight: 700, background: BRAND_TINT, color: BRAND, padding: '3px 10px', borderRadius: 99 }}>
                  {CATEGORY_LABELS[post.category] ?? post.category}
                </span>
              )}
              {post.publishedAt && (
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a', lineHeight: 1.4 }}>{post.title}</h2>
            {post.excerpt && <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>}
          </Card>

          {/* NEW — Blog Listings, Area(s) */}
          <Card title="Blog Listings — Area(s)">
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.5 }}>
              IDX-area listings shown at the bottom of the published post. Add one or more San Diego
              areas/neighborhoods and we&apos;ll pull in nearby active listings automatically.
            </p>

            {idxAreas.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', margin: '0 0 14px' }}>
                No areas set — click &quot;Suggest from article&quot; or add one.
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {idxAreas.map(area => (
                  <span key={area} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 600, color: BRAND, background: BRAND_TINT,
                    border: `1px solid ${BRAND_BORDER}`, borderRadius: 99, padding: '5px 6px 5px 12px',
                  }}>
                    {area}
                    <button
                      onClick={() => handleRemoveArea(area)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: BRAND, fontSize: 13, lineHeight: 1, padding: '2px 4px' }}
                      title="Remove area"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={idxNewArea}
                onChange={e => setIdxNewArea(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddArea() } }}
                placeholder="e.g. La Jolla, Coronado…"
                style={{
                  flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8,
                  fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1a1a1a',
                }}
              />
              <button
                onClick={handleAddArea}
                style={{
                  padding: '8px 14px', background: '#fff', color: BRAND,
                  border: `1px solid ${BRAND_BORDER}`, borderRadius: 8, fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                ＋ Add area
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={handleSuggestAreas}
                disabled={idxSuggesting}
                style={{
                  padding: '7px 14px', background: BRAND_TINT, color: BRAND,
                  border: `1px solid ${BRAND_BORDER}`, borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: idxSuggesting ? 'wait' : 'pointer',
                }}
              >
                {idxSuggesting ? 'Suggesting…' : '✨ Suggest from article'}
              </button>
              <button
                onClick={handleSaveAreas}
                disabled={idxSaving}
                style={{
                  padding: '7px 16px', background: BRAND, color: '#fff',
                  border: 'none', borderRadius: 6, fontSize: 12,
                  fontWeight: 700, cursor: idxSaving ? 'wait' : 'pointer',
                }}
              >
                {idxSaving ? 'Saving…' : 'Save areas'}
              </button>
              {idxSaved && <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>✓ Saved</span>}
            </div>
          </Card>

          {/* Social copy */}
          <Card title="Facebook Post Caption">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                This text will be posted to the Palisade Realty Facebook page. Edit it before publishing.
              </p>
              <button
                onClick={handleGenerateCaption}
                disabled={generatingCaption}
                style={{
                  flexShrink: 0, marginLeft: 12,
                  padding: '5px 14px', background: BRAND_TINT, color: BRAND,
                  border: `1px solid ${BRAND_BORDER}`, borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: generatingCaption ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {generatingCaption ? 'Writing…' : '✨ Generate Caption'}
              </button>
            </div>
            <textarea
              value={socialCopy}
              onChange={e => setSocialCopy(e.target.value)}
              placeholder="Facebook post caption will appear here after generating or editing…"
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: 12, border: '1px solid #e2e8f0', borderRadius: 8,
                fontSize: 14, lineHeight: 1.6, resize: 'vertical',
                fontFamily: 'Inter, sans-serif', color: '#1a1a1a',
              }}
            />
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
              The blog post URL will be appended automatically when published.
            </p>
          </Card>

          {/* Video script — v2, data-grounded, populates scenes for card (c) below */}
          <Card title="Video Script">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                A short script for Hedda&apos;s Digital Twin to narrate — high-level takeaways, what it means for the local market, and a direct call to action.
              </p>
              <button
                onClick={handleGenerateScript}
                disabled={generatingScript}
                style={{
                  flexShrink: 0,
                  padding: '5px 14px', background: BRAND_TINT, color: BRAND,
                  border: `1px solid ${BRAND_BORDER}`, borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: generatingScript ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {generatingScript ? 'Writing…' : '🎬 Generate Script'}
              </button>
            </div>
            <textarea
              value={videoScript}
              onChange={e => setVideoScript(e.target.value)}
              placeholder="Video script will appear here after generating…"
              rows={14}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: 12, border: '1px solid #e2e8f0', borderRadius: 8,
                fontSize: 13, lineHeight: 1.7, resize: 'vertical',
                fontFamily: '"Courier New", Courier, monospace', color: '#1a1a1a',
                background: '#fafafa',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>
                {scriptWordCount} word{scriptWordCount === 1 ? '' : 's'} · ~{scriptEstSeconds}s estimated
              </span>
              {scriptOverLimit && (
                <span style={{ fontSize: 11, color: '#b45309', fontWeight: 600 }}>
                  ⚠️ Over 150 words — consider trimming for a tighter video
                </span>
              )}
              {scenes.length > 0 && (
                <span style={{ fontSize: 11, color: '#166534' }}>
                  {scenes.length} scene{scenes.length === 1 ? '' : 's'} ready for image sourcing below
                </span>
              )}
            </div>
          </Card>

          {/* NEW — Avatar & Voice */}
          <Card title="Avatar & Voice (Look IDs / Voice ID)">
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.5 }}>
              Configure up to 5 Look IDs so Digital Twin videos don&apos;t always use the same face,
              plus a single Voice ID used across every render. Saved settings apply to every future post
              for this client.
            </p>
            {avatarLoading ? (
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Loading saved settings…</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {lookIds.map((val, i) => (
                    <input
                      key={i}
                      value={val}
                      onChange={e => updateLookId(i, e.target.value)}
                      placeholder={i === 0 ? 'Look ID 1' : `Look ID ${i + 1} (optional)`}
                      style={{
                        padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8,
                        fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1a1a1a',
                      }}
                    />
                  ))}
                </div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Voice ID
                </label>
                <input
                  value={voiceId}
                  onChange={e => setVoiceId(e.target.value)}
                  placeholder="Voice ID"
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '8px 12px',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13,
                    fontFamily: 'Inter, sans-serif', color: '#1a1a1a', marginBottom: 12,
                  }}
                />
                {avatarError && (
                  <p style={{ fontSize: 12, color: '#dc2626', margin: '0 0 10px' }}>{avatarError}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={handleSaveAvatarSettings}
                    disabled={avatarSaving}
                    style={{
                      padding: '8px 18px', background: BRAND, color: '#fff',
                      border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 700,
                      cursor: avatarSaving ? 'wait' : 'pointer',
                    }}
                  >
                    {avatarSaving ? 'Saving…' : 'Save'}
                  </button>
                  {avatarSaved && <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>✓ Saved</span>}
                </div>
              </>
            )}
          </Card>

          {/* NEW — Scene Images */}
          <Card title="Scene Images (keyword-matched backgrounds)">
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.5 }}>
              We source 3–5 candidate background images matched to keywords from the script above.
              Approve one per scene (or upload your own), then save.
            </p>

            {scenes.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
                Generate a video script above first — scenes will appear here.
              </p>
            ) : (
              <>
                <button
                  onClick={handleFindImages}
                  disabled={findingImages}
                  style={{
                    padding: '7px 16px', background: BRAND_TINT, color: BRAND,
                    border: `1px solid ${BRAND_BORDER}`, borderRadius: 6, fontSize: 12,
                    fontWeight: 600, cursor: findingImages ? 'wait' : 'pointer', marginBottom: 16,
                  }}
                >
                  {findingImages ? 'Searching…' : '🔍 Find Images'}
                </button>

                {findImagesWarnings.map((w, i) => (
                  <p key={i} style={{ fontSize: 12, color: '#92400e', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 6, padding: '6px 10px', margin: '0 0 8px' }}>
                    ⚠ {w}
                  </p>
                ))}
                {findImagesError && (
                  <p style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, padding: '6px 10px', margin: '0 0 8px' }}>
                    {findImagesError}
                  </p>
                )}

                {sourcedScenes.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
                    {sourcedScenes.map((scene, sceneIndex) => (
                      <div key={sceneIndex} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
                          Scene {sceneIndex + 1} — {scene.keyword}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontStyle: 'italic' }}>
                          &quot;{scene.phrase}&quot;
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {scene.candidates.map((candidate, ci) => {
                            const isApproved = approvedScenes[sceneIndex] === candidate.url
                            return (
                              <div key={ci} style={{ position: 'relative' }}>
                                {/* candidate.url is a same-origin URL already proxied by the image-proxy route */}
                                <img
                                  src={candidate.url}
                                  alt={`${scene.keyword} candidate ${ci + 1}`}
                                  style={{
                                    width: 96, height: 96, objectFit: 'cover', borderRadius: 6,
                                    border: isApproved ? `2px solid ${BRAND}` : '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => handleApproveCandidate(sceneIndex, candidate.url)}
                                />
                                {isApproved && (
                                  <span style={{
                                    position: 'absolute', top: 4, right: 4,
                                    background: BRAND, color: '#fff', fontSize: 10, fontWeight: 700,
                                    borderRadius: 99, width: 18, height: 18, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    ✓
                                  </span>
                                )}
                              </div>
                            )
                          })}
                          {(() => {
                            const approvedUrl = approvedScenes[sceneIndex]
                            const isOwnUpload = approvedUrl && !scene.candidates.some(c => c.url === approvedUrl)
                            if (isOwnUpload) {
                              // Show the uploaded image itself (not just a static
                              // placeholder) so it's obvious the upload registered
                              // and is the one that'll be saved for this scene.
                              return (
                                <div style={{ position: 'relative' }}>
                                  <label style={{ display: 'block', cursor: uploadingSceneIndex === sceneIndex ? 'wait' : 'pointer' }}>
                                    <img
                                      src={approvedUrl}
                                      alt={`${scene.keyword} — your upload`}
                                      style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 6, border: `2px solid ${BRAND}` }}
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={e => handleUploadOwnScene(sceneIndex, e)}
                                      style={{ display: 'none' }}
                                    />
                                  </label>
                                  <span style={{
                                    position: 'absolute', top: 4, right: 4,
                                    background: BRAND, color: '#fff', fontSize: 10, fontWeight: 700,
                                    borderRadius: 99, width: 18, height: 18, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    ✓
                                  </span>
                                  <span style={{
                                    position: 'absolute', bottom: -18, left: 0, right: 0,
                                    fontSize: 10, color: BRAND, fontWeight: 600, textAlign: 'center',
                                  }}>
                                    Your upload
                                  </span>
                                </div>
                              )
                            }
                            return (
                              <label style={{
                                width: 96, height: 96, borderRadius: 6, border: '1.5px dashed #cbd5e1',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, color: '#94a3b8', textAlign: 'center', cursor: uploadingSceneIndex === sceneIndex ? 'wait' : 'pointer',
                                padding: 4,
                              }}>
                                {uploadingSceneIndex === sceneIndex ? 'Uploading…' : 'Upload your own'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => handleUploadOwnScene(sceneIndex, e)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                            )
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={handleSaveScenes}
                    disabled={savingScenes || Object.keys(approvedScenes).length === 0}
                    style={{
                      padding: '8px 18px',
                      background: Object.keys(approvedScenes).length === 0 ? '#e2e8f0' : BRAND,
                      color: Object.keys(approvedScenes).length === 0 ? '#94a3b8' : '#fff',
                      border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 700,
                      cursor: savingScenes ? 'wait' : 'pointer',
                    }}
                  >
                    {savingScenes ? 'Saving…' : `Save ${Object.keys(approvedScenes).length} approved scene${Object.keys(approvedScenes).length === 1 ? '' : 's'}`}
                  </button>
                  {scenesSaved && <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>✓ Saved</span>}
                  {saveScenesError && <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>{saveScenesError}</span>}
                </div>
              </>
            )}
          </Card>

          {/* NEW — Generate Video, Ylopo Enterprise */}
          <Card title="Generate Video — HeyGen Enterprise">
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
              Renders through the HeyGen Enterprise account using the saved look/voice above, the video
              script, and the scene images you uploaded/approved. The finished video appears here for
              review and is attached to the post automatically. Typically takes several minutes.
            </p>

            {/* Cover thumbnail */}
            <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Cover / First-Frame Thumbnail (16:9, optional)
              </div>
              {enterpriseCoverUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={enterpriseCoverUrl} alt="Cover thumbnail" style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  <label style={{ fontSize: 12, color: '#166534', fontWeight: 600, cursor: 'pointer' }}>
                    Replace
                    <input type="file" accept="image/*" onChange={handleUploadEnterpriseCover} style={{ display: 'none' }} />
                  </label>
                </div>
              ) : (
                <label style={{
                  display: 'inline-block', padding: '9px 18px', background: '#16a34a', color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: uploadingEnterpriseCover ? 'wait' : 'pointer',
                }}>
                  {uploadingEnterpriseCover ? 'Uploading…' : 'Upload Cover Thumbnail'}
                  <input type="file" accept="image/*" onChange={handleUploadEnterpriseCover} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            {/* Avatar look override */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                Avatar look for this post
              </label>
              <select
                value={lookOverride}
                onChange={e => setLookOverride(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8,
                  fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#1a1a1a', background: '#fff',
                }}
              >
                <option value="">🎲 Random from saved looks (default)</option>
                {savedLookOptions.map(({ id, n }) => (
                  <option key={id} value={id}>Lock: Look {n} ({id})</option>
                ))}
              </select>
            </div>

            {/* Generate + status */}
            {enterpriseState.phase === 'idle' && (
              <button
                onClick={handleGenerateEnterpriseVideo}
                disabled={savedLookOptions.length === 0 && !avatarLoading}
                style={{
                  padding: '10px 20px',
                  background: BRAND,
                  color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                🤖 Generate with HeyGen
              </button>
            )}

            {enterpriseState.phase === 'submitting' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: BRAND, fontWeight: 600 }}>
                <span style={{ display: 'inline-block', animation: 'ent-spin 1s linear infinite' }}>⏳</span>
                Starting render…
              </div>
            )}

            {enterpriseState.phase === 'polling' && (
              <div style={{ padding: '14px 16px', background: BRAND_TINT, border: `1px solid ${BRAND_BORDER}`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 18, display: 'inline-block', animation: 'ent-spin 1.4s linear infinite' }}>🎬</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: BRAND }}>Rendering on HeyGen Enterprise…</div>
                    <div style={{ fontSize: 12, color: BRAND }}>
                      {Math.floor(enterpriseState.elapsedSec / 60)}m {enterpriseState.elapsedSec % 60}s elapsed
                    </div>
                  </div>
                </div>
                <div style={{ height: 4, background: BRAND_BORDER, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '100%', background: BRAND, borderRadius: 99, animation: 'ent-pulse 1.5s ease-in-out infinite' }} />
                </div>
                <p style={{ fontSize: 11, color: BRAND, marginTop: 8, marginBottom: 0 }}>
                  Can take up to 40 minutes. This page can stay open — it checks every 15 seconds.
                </p>
              </div>
            )}

            {enterpriseState.phase === 'error' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 12, fontSize: 13, color: '#991b1b' }}>
                {enterpriseState.message}
                <button
                  onClick={() => setEnterpriseState({ phase: 'idle' })}
                  style={{ marginLeft: 8, background: 'none', border: 'none', color: '#991b1b', textDecoration: 'underline', cursor: 'pointer', fontSize: 12 }}
                >
                  Retry
                </button>
              </div>
            )}

            {enterpriseState.phase === 'done' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>Video rendered</span>
                </div>
                <video src={enterpriseState.videoUrl} controls style={{ width: '100%', borderRadius: 8, background: '#000' }} />
                <button
                  onClick={() => setEnterpriseState({ phase: 'idle' })}
                  style={{ marginTop: 10, fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  Generate another
                </button>
              </div>
            )}
          </Card>

          {/* Video upload (legacy path — YouTube + TikTok + Facebook Reel) */}
          <Card title={isPublished ? 'Video — Replace & Re-publish' : 'Video (YouTube + TikTok + Facebook Reel)'}>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
              Optional manual fallback. The Generate with HeyGen button above renders and attaches the video automatically — use this only to upload your own final cut instead. Supports MP4, MOV, or WebM up to 500 MB.
            </p>

            {/* Manual upload fallback */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Upload Final Video
              </div>

              {video.type === 'none' && (
                <>
                  <label style={{
                    display: 'inline-block',
                    padding: '10px 20px', background: '#f1f5f9', color: '#475569',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                    fontWeight: 600, cursor: 'pointer',
                  }}>
                    📹 Upload Video
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
                      onChange={handleVideoSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                    No video uploaded — only the Facebook image post will be published.
                  </p>
                </>
              )}

              {video.type === 'uploading' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569', marginBottom: 6 }}>
                    <span>Uploading video…</span>
                    <span>{video.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${video.progress}%`, background: BRAND, borderRadius: 99, transition: 'width 0.3s' }} />
                  </div>
                </div>
              )}

              {(video.type === 'ready' || video.type === 'saved') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
                  <span style={{ fontSize: 20 }}>🎥</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>
                      {video.type === 'saved' ? 'Video saved' : `Video uploaded at ${videoUploadedAt?.toLocaleTimeString() ?? '—'}`}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {video.type === 'ready' ? video.filename : video.url.split('/').pop()}
                    </div>
                  </div>
                  {video.type === 'ready' && (
                    <button
                      onClick={handleRemoveVideo}
                      style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
                    >
                      Remove
                    </button>
                  )}
                  {video.type === 'saved' && isPublished && (
                    <button
                      onClick={handleReplaceVideo}
                      style={{ fontSize: 12, color: BRAND, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontWeight: 600 }}
                    >
                      Replace
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* YouTube Thumbnail (only when video is ready — TikTok doesn't support external thumbnails) */}
            {(video.type === 'ready' || video.type === 'saved') && (
              <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 4 }}>
                  YouTube Thumbnail <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
                </label>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Custom thumbnail for YouTube. JPG or PNG, 1280×720 recommended. TikTok uses a frame from the video automatically.
                </p>

                {videoThumbnailUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={videoThumbnailUrl}
                      alt="Video thumbnail"
                      style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>✓ Thumbnail ready</div>
                      <label style={{ fontSize: 11, color: BRAND, cursor: 'pointer', display: 'block', marginTop: 4 }}>
                        Replace
                        <input type="file" accept="image/*" onChange={handleVideoThumbnailSelect} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label style={{
                    display: 'inline-block',
                    padding: '8px 16px', background: '#f1f5f9', color: '#475569',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13,
                    fontWeight: 600, cursor: uploadingVideoThumb ? 'wait' : 'pointer',
                    opacity: uploadingVideoThumb ? 0.7 : 1,
                  }}>
                    {uploadingVideoThumb ? 'Uploading…' : '🖼 Upload YouTube Thumbnail'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVideoThumbnailSelect}
                      disabled={uploadingVideoThumb}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            )}
          </Card>

        </div>

        {/* ── RIGHT: Preview + Publish ── */}
        <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Thumbnail */}
          <Card title="Thumbnail">
            <div style={{
              aspectRatio: '16/9', background: '#f1f5f9', borderRadius: 8, overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              {thumbnailPreviewUrl ? (
                <img src={thumbnailPreviewUrl} alt="Thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🖼</div>
                  <div style={{ fontSize: 13 }}>No thumbnail yet</div>
                </div>
              )}
            </div>

            {thumbnail.type === 'saved' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>✓ Thumbnail saved</span>
                <label style={{ fontSize: 12, color: BRAND, cursor: 'pointer', fontWeight: 600 }}>
                  Replace
                  <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                </label>
              </div>
            ) : (
              <label style={{
                display: 'block', width: '100%', boxSizing: 'border-box', marginBottom: 10,
                padding: '10px 0', textAlign: 'center',
                background: '#f1f5f9', color: '#475569',
                border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
              }}>
                📷 Upload Thumbnail
                <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
              </label>
            )}

          </Card>

          {/* Publish panel */}
          <Card title="Publish">
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, lineHeight: 1.5 }}>
              Pressing Publish will:
            </p>
            <ul style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, margin: '0 0 16px', paddingLeft: 18 }}>
              <li>Make the post live on the website</li>
              <li>Post to the Palisade Realty Facebook page</li>
              {hasVideo && <li>Publish as a Facebook Reel</li>}
              {hasVideo && <li>Upload the video to YouTube</li>}
              {hasVideo && <li>Post the video to TikTok</li>}
              <li>Post to Instagram {hasVideo ? '(Reel)' : '(image)'}</li>
            </ul>

            {/* Per-platform publish status */}
            {(publishState.phase === 'polling' || publishState.phase === 'done') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <PlatformStatusRow
                  icon="🌐"
                  label="Website"
                  status={{ phase: 'done' }}
                />
                <PlatformStatusRow
                  icon="👥"
                  label="Facebook"
                  status={publishState.facebook}
                />
                {publishState.facebookReel.phase !== 'idle' && (
                  <PlatformStatusRow icon="🎬" label="Facebook Reel" status={publishState.facebookReel} />
                )}
                {publishState.youtube.phase !== 'idle' && (
                  <PlatformStatusRow icon="▶️" label="YouTube" status={publishState.youtube} />
                )}
                {publishState.tiktok.phase !== 'idle' && (
                  <PlatformStatusRow icon="🎵" label="TikTok" status={publishState.tiktok} />
                )}
                {publishState.instagram.phase !== 'idle' && (
                  <PlatformStatusRow icon="📸" label="Instagram" status={publishState.instagram} />
                )}
              </div>
            )}

            {publishState.phase === 'error' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: '#991b1b' }}>
                {publishState.message}
              </div>
            )}

            {publishState.phase === 'done' && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: '#166534' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>✓ Published!</div>
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block' }}>
                  View blog post →
                </a>
                {publishState.facebook.phase === 'done' && publishState.facebook.postUrl && (
                  <a href={publishState.facebook.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View Facebook post →
                  </a>
                )}
                {publishState.facebookReel.phase === 'done' && publishState.facebookReel.postUrl && (
                  <a href={publishState.facebookReel.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View Facebook Reel →
                  </a>
                )}
                {publishState.youtube.phase === 'done' && publishState.youtube.postUrl && (
                  <a href={publishState.youtube.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View YouTube video →
                  </a>
                )}
                {publishState.tiktok.phase === 'done' && publishState.tiktok.postUrl && (
                  <a href={publishState.tiktok.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View TikTok post →
                  </a>
                )}
              </div>
            )}

            {/* ── Scheduled state ── */}
            {isScheduled && post?.scheduledPublishAt && (
              <div style={{ background: BRAND_TINT, border: `1.5px solid ${BRAND_BORDER}`, borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: BRAND, marginBottom: 4 }}>
                  📅 Scheduled
                </div>
                <div style={{ fontSize: 13, color: BRAND, marginBottom: 10 }}>
                  {new Date(post.scheduledPublishAt).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
                  })}
                </div>
                <div style={{ fontSize: 12, color: BRAND, marginBottom: 10, lineHeight: 1.5 }}>
                  The post will go live on the website and all social platforms at this time.
                </div>
                <button
                  onClick={handleCancelSchedule}
                  disabled={scheduleState === 'cancelling'}
                  style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  {scheduleState === 'cancelling' ? 'Cancelling…' : 'Cancel scheduled publish'}
                </button>
              </div>
            )}

            {isPublished ? (
              <div>
                {/* Persistent platform status — shown from Sanity data on reload */}
                {publishState.phase === 'idle' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                    <PlatformStatusRow icon="🌐" label="Website" status={{ phase: 'done' }} />
                    <PlatformStatusRow
                      icon="👥" label="Facebook"
                      status={post.oneupFacebookStatus === 'published' || post.facebookPostUrl
                        ? { phase: 'done', postUrl: post.facebookPostUrl }
                        : post.oneupFacebookSubmissionId
                        ? { phase: 'done' }
                        : { phase: 'idle' }}
                    />
                    {post.oneupFacebookReelSubmissionId && (
                      <PlatformStatusRow icon="🎬" label="Facebook Reel" status={{ phase: 'done' }} />
                    )}
                    {post.oneupYoutubeSubmissionId && (
                      <PlatformStatusRow icon="▶️" label="YouTube" status={{ phase: 'done', postUrl: post.youtubePostUrl }} />
                    )}
                    {post.oneupTiktokSubmissionId && (
                      <PlatformStatusRow icon="🎵" label="TikTok" status={{ phase: 'done', postUrl: post.tiktokPostUrl }} />
                    )}
                  </div>
                )}
                <div style={{ fontSize: 13, color: '#166534', fontWeight: 600, padding: '8px 0', textAlign: 'center', marginBottom: 8 }}>
                  ✓ Already published
                </div>
                {video.type === 'ready' && videoPublishState.phase === 'idle' && (
                  <button
                    onClick={handlePublishVideoOnly}
                    style={{
                      width: '100%', padding: '11px 0',
                      background: BRAND, color: '#fff',
                      border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ▶️ Re-publish Video to All Platforms
                  </button>
                )}
                {videoPublishState.phase === 'publishing' && (
                  <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center', padding: '8px 0' }}>Publishing video to all platforms…</div>
                )}
                {videoPublishState.phase === 'done' && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 12, fontSize: 13 }}>
                    <div style={{ fontWeight: 700, color: '#166534', marginBottom: 8 }}>✓ Video re-published!</div>
                    {[
                      { icon: '🎬', label: 'Facebook Reel', result: videoPublishState.facebookReel },
                      { icon: '▶️', label: 'YouTube',       result: videoPublishState.youtube },
                      { icon: '🎵', label: 'TikTok',        result: videoPublishState.tiktok },
                    ].map(({ icon, label, result }) => (
                      <div key={label} style={{ color: result.error ? '#991b1b' : '#166534', marginTop: 4 }}>
                        {icon} {label}: {result.error ? result.error : 'queued'}
                      </div>
                    ))}
                  </div>
                )}
                {videoPublishState.phase === 'error' && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 12, fontSize: 13, color: '#991b1b' }}>
                    {videoPublishState.message}
                  </div>
                )}
              </div>
            ) : !isScheduled ? (
              <div>
                {/* Delay picker */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    When to publish
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {DELAY_OPTIONS.map(({ label, hours }) => (
                      <button
                        key={label}
                        onClick={() => setPublishDelay(hours)}
                        style={{
                          padding: '5px 10px', fontSize: 12, fontWeight: 600, borderRadius: 6,
                          border: '1px solid',
                          borderColor: publishDelay === hours ? BRAND : '#e2e8f0',
                          background: publishDelay === hours ? BRAND : '#fff',
                          color: publishDelay === hours ? '#fff' : '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {publishDelay !== null && (
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                      Publishes at:{' '}
                      {new Date(Date.now() + publishDelay * 3600 * 1000).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
                      })}
                    </div>
                  )}
                </div>

                {scheduleError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#991b1b' }}>
                    {scheduleError}
                  </div>
                )}

                {/* Video upload in-progress lock banner */}
                {videoUploading && video.type === 'uploading' && (
                  <div style={{
                    background: '#fffbeb',
                    border: '1.5px solid #fbbf24',
                    borderRadius: 8,
                    padding: '12px 14px',
                    marginBottom: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 16 }}>⏳</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
                          Video uploading — {video.progress}%
                        </div>
                        <div style={{ fontSize: 11, color: '#b45309', lineHeight: 1.4 }}>
                          Publishing is locked until the upload finishes.
                        </div>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#d97706' }}>{video.progress}%</span>
                    </div>
                    <div style={{ height: 5, background: '#fde68a', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${video.progress}%`,
                        background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                        borderRadius: 99,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                )}

                {publishDelay === null ? (
                  <button
                    onClick={handlePublish}
                    disabled={!canPublish || publishInProgress}
                    style={{
                      width: '100%', padding: '13px 0',
                      background: canPublish && !publishInProgress ? BRAND : '#e2e8f0',
                      color: canPublish && !publishInProgress ? '#fff' : '#94a3b8',
                      border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
                      cursor: canPublish && !publishInProgress ? 'pointer' : 'not-allowed',
                      transition: 'background 0.2s',
                    }}
                  >
                    {publishState.phase === 'publishing' ? 'Publishing…' :
                     publishState.phase === 'polling'    ? 'Waiting for confirmation…' :
                     publishState.phase === 'saving'     ? 'Preparing…' :
                     '🚀 Publish'}
                  </button>
                ) : (
                  <button
                    onClick={handleSchedule}
                    disabled={!canPublish || scheduleState === 'scheduling'}
                    style={{
                      width: '100%', padding: '13px 0',
                      background: canPublish && scheduleState !== 'scheduling' ? '#0f766e' : '#e2e8f0',
                      color: canPublish && scheduleState !== 'scheduling' ? '#fff' : '#94a3b8',
                      border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
                      cursor: canPublish && scheduleState !== 'scheduling' ? 'pointer' : 'not-allowed',
                      transition: 'background 0.2s',
                    }}
                  >
                    {scheduleState === 'scheduling' ? 'Scheduling…' : '📅 Schedule'}
                  </button>
                )}

                {!canPublish && !publishInProgress && (
                  <p style={{ fontSize: 12, color: videoUploading ? '#b45309' : '#94a3b8', textAlign: 'center', marginTop: 8 }}>
                    {videoUploading
                      ? 'Publishing will unlock once the video upload is complete.'
                      : 'Upload a thumbnail to enable publishing.'}
                  </p>
                )}
              </div>
            ) : null}

            {!canPublish && !isPublished && isScheduled && (
              <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
                Upload a thumbnail to enable publishing.
              </p>
            )}
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes ent-spin { to { transform: rotate(360deg); } }
        @keyframes ent-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </PageShell>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlatformStatusRow({ icon, label, status }: {
  icon: string
  label: string
  status: PlatformStatus
}) {
  const isPolling = status.phase === 'polling'
  const isDone = status.phase === 'done'
  const isError = status.phase === 'error'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px',
      background: isDone ? '#f0fdf4' : isError ? '#fef2f2' : BRAND_TINT,
      border: `1px solid ${isDone ? '#86efac' : isError ? '#fca5a5' : BRAND_BORDER}`,
      borderRadius: 8, fontSize: 13,
    }}>
      <span>{icon}</span>
      <span style={{ fontWeight: 600, color: isDone ? '#166534' : isError ? '#991b1b' : BRAND }}>
        {label}
      </span>
      <span style={{ marginLeft: 'auto', color: isDone ? '#166534' : isError ? '#991b1b' : BRAND }}>
        {isPolling ? 'Waiting…' : isDone ? '✓ Published' : isError ? `✗ ${status.message}` : ''}
      </span>
    </div>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Inter, sans-serif' }}>
      {children}
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

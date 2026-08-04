# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

---

# Content Machine Architecture

## What This Is
Palisade Realty's marketing site (above) has an AI content pipeline bolted onto
it — research → write → Fair Housing check → media/video → social publish —
replicated from a system built for a different client (Legacy Home Search,
Hampton Roads VA) and customized for San Diego / Hedda Parashos.

## Key Facts
- **Sanity project ID**: `qjhzi2t2`
- **Sanity dataset**: `production`
- **Redis key prefix**: `hps:` (hardcoded literally in key templates, not env-driven — matches source convention)
- **Persona**: Hedda Parashos, Owner/President of Palisade Realty — written as a brokerage owner/San Diego market leader, NOT a "resident/parent/investor" persona (that framing didn't fit her actual bio and was deliberately not carried over)
- **Video**: shared Ylopo Enterprise render platform (`ENTERPRISE_CLIENT_ID`, `ENTERPRISE_VIDEO_BASE_URL`, `ENTERPRISE_VIDEO_API_KEY`) — NOT a per-client HeyGen account. Look IDs + Voice ID are set by the VA in `/admin/va-queue/[postId]`, never hardcoded.
- **Social publish**: OneUp (one shared agency account, this client's own category `ONEUP_CATEGORY_ID`), 6 platforms — Facebook, Instagram, TikTok, YouTube, LinkedIn, X. Threads is not supported by OneUp.
- **Fair Housing**: California list (federal 7 + ancestry, age, genetic information, immigration/citizenship status, primary language, veteran/military status, medical condition, plus the sexual-orientation/gender-identity/marital-status/source-of-income classes already covered federally-adjacent). See `lib/fair-housing.ts`.

## Pipeline
Research (Tavily, daily cron) → scored ideas in Redis → `/admin/idea-review`
(approve/defer/skip) → Claude Sonnet writes post → Fair Housing check (Claude
Haiku) → Sanity `blogPost` doc (`workflowStatus: media_pending`) →
`/admin/va-queue/[postId]` (script → look/voice → scene images → Enterprise
render → thumbnail) → Publish → OneUp fans out to all 6 platforms + the post
goes live on `/blog` → `/admin/blog-dashboard` analytics.

Key lib files: `lib/research.ts`, `lib/idea-store.ts`, `lib/idea-writer.ts`,
`lib/publish-service.ts`, `lib/oneup-client.ts`, `lib/fair-housing.ts`,
`lib/required-topics.ts`, `lib/fed-research.ts`, `lib/events-research.ts`,
`lib/enterprise-video.ts`, `lib/video-settings.ts`, `lib/scene-images.ts`.

- Voice/style intelligence (updated periodically): **LEARNINGS.md**
- Replication source + hard rules this build followed: see the original
  operator's replication kit (external to this repo)

## Blog Schema Consolidation
The marketing site's `/blog` pages were originally built against a simple
Sanity type `post` (empty, unused). This was consolidated onto the content
machine's richer `blogPost` type — `/blog` now reads only `blogPost` documents
with `workflowStatus == 'published'`. The `post` type is still registered in
the schema but has no active consumers.

## Scope Notes / What Wasn't Built
Several source-system subsystems were intentionally left out of this build
(out of scope per the replication plan, or not requested):
- Market Reports pipeline (Altos Research integration) — not built
- Renick competitor-analytics pipeline — not built (no data feed for this client; references to it were genericized in UI copy/topic text)
- AI Content Assistant (`/admin/assistant`) — not built
- AEO pages cron, idx-proof cron, tiktok-scrape cron — not built
- Refresh-queue evaluation logic is a simplified best-effort implementation, not a faithful port (no source file existed to copy)
- Blog Listings / IDX area-selector card in the video pipeline UI may be UI-only (no backend) depending on what the implementing pass chose — check `app/admin/va-queue/[postId]/page.tsx` for a TODO comment if so

## Current Status (August 2026)
- Content machine build in progress — see the session that created this section for the full file list
- LinkedIn + X OneUp account IDs were not yet available at build time — `ONEUP_LINKEDIN_ACCOUNT_ID` / `ONEUP_X_ACCOUNT_ID` env vars are referenced but unset; those two platforms will silently fail to publish until set
- GA4 property ID / measurement ID / service account JSON were not yet available at build time — `lib/ga4.ts` degrades gracefully (returns empty data) until those are set
- Domain: `palisaderealty.com`

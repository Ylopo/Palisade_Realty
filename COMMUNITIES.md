# Shana Gates — Community Pages Reference

Single source of truth for how the Coachella Valley community pages are
structured, what content lives on each one, and how to replicate the
pattern on a new real estate site in a different market.

`MAPS.md` covers everything map-related in depth — this file refers to it
for map specifics rather than repeating them.

---

## What a "Community Page" Is

A community page is a single long-scroll page about one city or
neighborhood, designed to do four jobs at once:

1. **Rank in local search** for `"<city> homes for sale"` and related terms
2. **Earn AI/LLM citations** by answering buyer questions clearly (the FAQ
   block in particular is structured for snippet/AEO use)
3. **Convert visitors to leads** via Shana's contact CTAs in 3+ positions
4. **Show live listings** via the YLOPO MLS widget so the page never goes stale

Every Coachella Valley city has one of these pages and they all follow the
same anatomy. The 9 city pages share a single CSS file (`community.css`)
and a single JS file (`community-map.js`); everything that changes per
city is either inline HTML content or an inline `window.CV_MAP_CONFIG`
object.

---

## File Inventory

Everything you need to touch when replicating the pattern.

```
── HTML (one per city + a home + a gated hub) ─────────────────────────
palm-springs.html          Community page (one per city, 9 total)
palm-desert.html           ↑ palm-desert / la-quinta / indio /
rancho-mirage.html          cathedral-city / desert-hot-springs /
indian-wells.html           coachella ALSO include a #new-construction
la-quinta.html              section between #parks-rec and #schools
indio.html
cathedral-city.html
desert-hot-springs.html
coachella.html
behind-the-gates.html      Hub page linking out to gated communities
gated/*.html               21+ per-gated-community detail pages linked
                             from each community page's Behind the Gates
                             dropdown
index.html                 Homepage — hosts the valley-overview map that
                             each community page's #valley-location links
                             back to

── Shared front-end ───────────────────────────────────────────────────
community.css              Shared styles for all 9 pages (4,368 lines)
community-map.js           Shared Mapbox 3D map init (reads CV_MAP_CONFIG)
ylopo-tracking.js          Site-wide YLOPO click tracking — appends UTM
                             params to every YLOPO-domain link and fires
                             a gtag `idx_property_click` event
blog/community-posts.js    Injects a "Recent from the Blog" section into
                             each community page by fetching
                             /api/blog/posts?city=<slug>&limit=3

── Server side (Vercel Node runtime) ──────────────────────────────────
api/community.ts           GET /api/community?slug=<city> — reads Sanity
                             overrides used by the CMS-sync inline script
lib/sanity.ts              Sanity client + CommunityOverride schema

── Reference docs ─────────────────────────────────────────────────────
MAPS.md                    Full Mapbox reference (boundaries, roads, palette)
COMMUNITIES.md             This file

── Not needed to touch, but linked from community pages ───────────────
blog/index.html            Blog listing (visited from the community-posts.js
                             section on each page)
blog/post.html             Individual post viewer
```

Each city page is a standalone, fully-rendered HTML file (~1,000 lines).
The **community pages themselves have no build step** — the HTML you
edit is the HTML you serve. But the CMS-override endpoint
(`/api/community`) is TypeScript that Vercel compiles server-side, so a
new site replicating this pattern needs a Vercel deployment with the
Node.js runtime enabled (any modern Vercel project has this by default).
Vercel auto-deploys on `git push` to `main`.

---

## Page Anatomy — Top to Bottom

Every community page uses the same **15 `<section>` blocks** in the same
order, wrapped by a shared `<nav>` at the top and `<footer>` at the
bottom. The IDs below are real `<section id="…">` anchors used in the
HTML and styled by `community.css`.

| # | Section ID | What it does | Per-city content |
|---|---|---|---|
| — | `<nav>` (top) | Sticky top nav — logo + 4 dropdowns + phone CTA. See **Nav** below for details | None — identical across pages |
| 1 | `community-hero` | Full-bleed 3D map with city name overlay + 4 hero stats | City name, 4 stats (listings count, median price, property types, "Updated") |
| 2 | `valley-location` | Smaller orientation map showing this city highlighted in the valley + 4 drive-time cards | Drive-time facts (e.g. "~30 min to Palm Desert via Hwy 111") |
| 3 | `overview` | Two-column layout: 3-paragraph editorial intro + "At a Glance" quick facts sidebar | Editorial copy, 8 quick-fact pairs |
| 4 | `demographics` | Single row of 5 census-style stats with `Source: U.S. Census Bureau` note | Pop, median age, avg income, households, ownership rate |
| 5 | `highlights` | 6-card grid — "What makes it special" | 6 icon + title + 1-paragraph items |
| 6 | `neighborhoods` | Compact grid of neighborhood cards with price range + tags | 8–12 neighborhood cards |
| 7 | `city-stats` | Decorative row of 5 SVG-icon stats (sunny days, pools, golf, etc.) | 5 number + label pairs |
| 8 | `listings` | YLOPO MLS widget showing 12 live listings + "View All" link | None — widget config drives data |
| 9 | `hoa-fees` | Two-column: HOA fee table + "What HOAs cover" bullets | Fee ranges by community type |
| 10 | `parks-rec` | 3+ park cards with address, size, amenity bullets | Park names, addresses, amenities |
| 10a | `new-construction` | **On 6 of 9 pages** — builder cards for active new-home communities. See section below. Present on: Palm Desert · La Quinta · Indio · Cathedral City · Desert Hot Springs · Coachella | Builder name, development name, price range, links |
| 11 | `schools` | Tabbed (Public / Private & Charter) school tables with disclaimer | School name, grades, district |
| 12 | `nearby-communities` | Comparison table linking out to the other 8 city pages | "Why consider" one-liners |
| 13 | `faq` | 6–10 accordion FAQ items written for AEO/featured-snippet capture | The questions buyers actually ask |
| 14 | `lifestyle` | Two-column: editorial copy + interactive lazy-loaded 3D map | Lifestyle bullets (events, attractions) |
| — | `community-blog-posts` **(runtime-injected)** | 3 most-recent city-tagged blog posts. Injected by `/blog/community-posts.js` BEFORE `#community-cta` on load. Nothing to put in the HTML — the script builds the section | None — fetched from `/api/blog/posts?city=<slug>&limit=3` |
| 15 | `community-cta` | Final pitch with phone + email buttons | None — identical |
| — | `<footer>` (bottom) | Brand, communities list, quick links, social, MLS disclaimer | None — identical |

The order matters. It moves the reader through *orientation* (where is
this place?) → *desirability* (why live here?) → *practical info*
(neighborhoods, fees, new construction, schools) → *live inventory* →
*common objections* (FAQ) → *recent content* → *call to action*.

---

## Nav

Every community page (and the homepage) uses an identical sticky `<nav>`
with 4 dropdown menus and a phone-number CTA on the right. Copy it
wholesale from any community page — only the highlighted-active-link
CSS changes per page (and CSS handles that via `body[data-page=…]`).

```html
<nav>
  <a href="/" class="nav-logo"><img src="/images/C&B-logo+R.png" alt="…" /></a>
  <ul class="nav-links">
    <!-- Dropdown 1: all city pages -->
    <li class="nav-communities">
      <span class="nav-communities-trigger">Communities</span>
      <div class="communities-dropdown">
        <a href="/palm-springs.html">Palm Springs</a>
        <!-- + 8 more -->
      </div>
    </li>

    <!-- Dropdown 2: external YLOPO search + featured listings anchor -->
    <li class="nav-properties">
      <a href="https://search.<yoursubdomain>.com/search" class="nav-properties-trigger" target="_blank">Properties</a>
      <div class="properties-dropdown">
        <a href="/#featured-properties">Featured Properties</a>
      </div>
    </li>

    <!-- Dropdown 3: gated/luxury community subpages + View All -->
    <li class="nav-gated">
      <a href="/behind-the-gates.html" class="nav-gated-trigger">Behind the Gates</a>
      <div class="gated-dropdown">
        <a href="/gated/pga-west.html">PGA West</a>
        <!-- 10 more -->
        <a href="/behind-the-gates.html" style="color:var(--bronze)">View All Communities →</a>
      </div>
    </li>

    <li><a href="/blog/">Blog</a></li>
    <li><a href="/#about">About Shana</a></li>
    <li><a href="/#search-listings">Search</a></li>
  </ul>
  <a href="tel:7602324054" class="nav-cta">760.232.4054</a>
</nav>
```

**Per-agent things to swap when replicating:**
- Logo image path
- All 9 city pages in the Communities dropdown
- YLOPO search subdomain in the Properties link
- Gated-community subpages OR delete the whole Behind the Gates dropdown if the market has no gated-community angle
- Phone number in the top-right CTA

---

## Hero — Section 1 (`#community-hero`)

The most distinctive element on the page. A 100vh map fills the
background; an overlay div darkens it; an oversized serif title + 4
hero stats sit on top.

```html
<section id="community-hero">
  <div id="hero-map"></div>            <!-- Mapbox 3D city view -->
  <div class="hero-map-overlay"></div> <!-- Dark gradient -->
  <div class="hero-content">
    <div class="breadcrumb">
      <a href="/">Home</a> · <a href="/#communities">Communities</a> · <span class="current">Palm Springs</span>
    </div>
    <p class="hero-eyebrow">Coachella Valley · California</p>
    <h1 class="hero-title">Palm <em>Springs</em></h1>
    <div class="hero-stats">
      <div class="hero-stat"><span class="hero-stat-value">500+</span><span class="hero-stat-label">Active Listings</span></div>
      <div class="hero-divider-v"></div>
      <div class="hero-stat"><span class="hero-stat-value">$650K</span><span class="hero-stat-label">Median Price</span></div>
      <!-- two more stats -->
    </div>
  </div>
</section>
```

The `<em>` wrapping the second word of the title (`Palm <em>Springs</em>`)
gets the *Cormorant Garamond italic* serif treatment. Every page does
this — it's the visual signature of the H1.

The map at `#hero-map` is initialized by `community-map.js` — see
**Shared Map System** below.

---

## Valley Location — Section 2 (`#valley-location`)

A standalone "where is this city" orientation map. Smaller than the hero
map, shows all 9 CV cities with the current one highlighted in yellow,
plus the I-10 and Hwy 111 roads colored. Below the map: four drive-time
"to X via Y" cards.

The script for this map is **inlined per-page** (roughly lines 894–960
of any community HTML file — search for `valley-context-map`) because
the highlighting needs to know which city is "current." Each page has
its own copy with `CURRENT_SLUG` set to the matching city slug.

**Style divergence worth knowing:** this map uses
`mapbox://styles/mapbox/dark-v11` — NOT the Standard style + `night`
light preset that the hero + lifestyle maps use. That's intentional
(flatter overview look, no lit 3D buildings competing with the yellow
current-city highlight), but it means the Mapbox access token is
**duplicated inline in every community page** in addition to the copy
in `community-map.js`. If you ever rotate the token, you need to update
~10 places, not 1. Consider hoisting the token into a `<meta>` tag or a
tiny shared config script if you build a v2.

```html
<section id="valley-location">
  <div class="valley-loc-head">
    <p class="valley-loc-eyebrow">Location</p>
    <h2 class="valley-loc-title">Where is <em>Palm Springs?</em></h2>
    <p class="valley-loc-desc">The western gateway of the Coachella Valley — ...</p>
  </div>
  <div class="valley-loc-map-wrap">
    <div id="valley-context-map"></div>
    <div class="valley-loc-legend"> ... </div>
  </div>
  <div class="valley-loc-cards">
    <div class="valley-loc-card">
      <span class="valley-loc-card-time">~1.5 hrs</span>
      <span class="valley-loc-card-dest">to Los Angeles</span>
      <span class="valley-loc-card-via">via I-10 West</span>
    </div>
    <!-- 3 more cards -->
  </div>
</section>
```

---

## Overview + Quick Facts — Section 3 (`#overview`)

The most visited block on the page. Three paragraphs of warm,
specific-to-this-city editorial copy on the left; a 2-col "At a Glance"
fact sidebar on the right. Both columns slide in via `.reveal` animation
when scrolled into view.

The sidebar facts use a consistent set of labels across all pages so the
**Sanity CMS override system** can update them by label name (see
**CMS Overrides** below).

```html
<section id="overview">
  <div class="overview-text reveal">
    <p class="section-eyebrow">The Iconic Desert City</p>
    <h2 class="overview-title">Where <em>Mid-Century</em><br>Meets Modern Luxury</h2>
    <div class="overview-divider"></div>
    <p class="overview-body">Palm Springs is the crown jewel of …</p>
    <p class="overview-body">…</p>
    <p class="overview-body">…</p>
    <div class="overview-cta">
      <a href="mailto:shana@craftbauer.com" class="btn-primary">Connect With Shana</a>
      <a href="#listings" class="btn-text">View Listings ↓</a>
    </div>
  </div>

  <div class="quick-facts reveal reveal-delay-2">
    <p class="quick-facts-heading">At a Glance</p>
    <div class="quick-fact"><span class="fact-label">City Type</span><span class="fact-value">Incorporated City</span></div>
    <div class="quick-fact"><span class="fact-label">County</span><span class="fact-value">Riverside County</span></div>
    <div class="quick-fact"><span class="fact-label">Population</span><span class="fact-value">~47,000</span></div>
    <div class="quick-fact"><span class="fact-label">Median Home Price</span><span class="fact-value">$650,000</span></div>
    <div class="quick-fact"><span class="fact-label">Architecture</span><span class="fact-value">Mid-Century Modern</span></div>
    <div class="quick-fact"><span class="fact-label">Elevation</span><span class="fact-value">479 ft</span></div>
    <div class="quick-fact"><span class="fact-label">Airport</span><span class="fact-value">PSP (2 mi)</span></div>
    <div class="quick-fact"><span class="fact-label">Drive to LA</span><span class="fact-value">~2 hours</span></div>
  </div>
</section>
```

### Quick-fact labels actually used

`City Type` · `County` · `Population` · `Median Home Price` · `Architecture` · `Known For` · `Elevation` · `Golf Courses` · `Airport` · `Drive to LA`

(Not every page uses every label; pages choose ~8 that fit best.)

The CMS-sync script matches labels **case-insensitively** (`.toLowerCase()`
on both sides), so a Sanity edit like `Median home price` will still find
`Median Home Price` on the page. Labels are trimmed before matching.
See the **CMS Overrides** section for the full sync behavior.

---

## Highlights, Neighborhoods, City Stats — Sections 5–7

These three are pure HTML — no JS, no APIs.

**`#highlights`** — 6-card grid. Each card has an emoji icon, a short
title, and a 1-paragraph body. Use icons that match the city's identity
(🏛️ for architecture, ⛳ for golf, 🎵 for festivals).

**`#neighborhoods`** — Compact grid of `.neighborhood-card` items, each
with a name, a price range, and 1–2 descriptor tags. 8–12 cards per page
is the sweet spot.

**`#city-stats`** — A decorative band of 5 stats with inline SVG icons.
Round numbers that read like trivia (350 sunny days, 8,000+ pools,
100+ golf courses). Use this for *feel*, not precision.

---

## Listings — Section 8 (`#listings`)

The MLS data block. This is a YLOPO widget — drop in a `<div>` with a
`data-search` JSON attribute and the YLOPO script renders a 12-listing
grid. **Always use `"limit":12`** across the site so the YLOPO "View All"
flow works consistently.

```html
<section id="listings">
  <div class="listings-header reveal">
    <div>
      <p class="section-eyebrow">Live MLS Data</p>
      <h2 class="section-title">Palm Springs Homes For Sale</h2>
    </div>
    <a class="view-all-link" target="_blank" rel="noopener"
       href="https://search.searchcoachellavalleyhomes.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Palm+Springs&s[locations][0][state]=CA">
       View All Listings →
    </a>
  </div>
  <div class="reveal">
    <div class="YLOPO_resultsWidget"
         data-search='{"locations":[{"city":"Palm Springs","state":"CA"}],"propertyTypes":["house","condo","townhouse"],"limit":12}'></div>
  </div>
  <div class="listings-cta-row reveal">
    <a class="btn-view-all" target="_blank" rel="noopener" href="…/search?…">View All Palm Springs Properties →</a>
  </div>
</section>
```

Required setup in `<head>`:

```html
<script>
  var YLOPO_HOSTNAME = 'search.searchcoachellavalleyhomes.com';
  window.YLOPO_WIDGETS = { domain: 'search.searchcoachellavalleyhomes.com' };
</script>
```

Required at end of `<body>`:

```html
<script src="https://search.searchcoachellavalleyhomes.com/build/js/widgets-1.0.0.js" defer></script>
```

The YLOPO widget only renders on domains registered with YLOPO. On
`localhost` and Vercel preview URLs it will show empty grid — that's
expected.

See `CLAUDE.md` (YLOPO Widget System) for the full `data-search` schema.

---

## HOA Fees, Parks — Sections 9–10

Both are content blocks with no dynamic data.

**`#hoa-fees`** — A monthly-HOA-by-community-type table + a "What HOAs
typically cover" bullet list. Keep the values realistic for the market.

**`#parks-rec`** — 3+ `.park-card` items per page. Each card has a name,
a real street address, an acreage chip, and an amenities bullet list.
Real addresses and acreages signal local authority.

---

## New Construction — Section 10a (`#new-construction`, 6 of 9 pages)

**This section is only on the 6 growth-market pages** — Palm Desert, La
Quinta, Indio, Cathedral City, Desert Hot Springs, and Coachella. Palm
Springs, Rancho Mirage, and Indian Wells don't have meaningful active
new-construction so the section is intentionally omitted there.

A `.builders-grid` of `.builder-card` items — each represents an active
new-home development. Fields:

```html
<section id="new-construction">
  <p class="section-eyebrow reveal">New Home Construction</p>
  <h2 class="section-title reveal">Brand-New Homes<br>in <em>Palm Desert</em></h2>
  <div class="builders-grid">
    <div class="builder-card reveal">
      <div class="builder-name">GHA Communities</div>
      <div class="builder-development">Shadow Ridge Estates</div>
      <div class="builder-specs">From $700K · 3–4 BR · 1,800–2,400 sq ft</div>
      <p class="builder-desc">Gated collection of 42 single-family homes …</p>
      <a class="builder-link" href="…" target="_blank" rel="noopener">Visit Builder →</a>
    </div>
    <!-- 3–6 more cards -->
  </div>
</section>
```

Class reference: `.builders-grid` · `.builder-card` · `.builder-name` ·
`.builder-development` · `.builder-specs` · `.builder-desc` ·
`.builder-link` — all styled in `community.css` (~line 1577).

When replicating on a new market: only include this section for cities
that actually have active new-home inventory. In stable/mature markets
it looks weird ("New Homes: none currently") — better to skip.

---

## Schools — Section 11 (`#schools`)

A tabbed component with a `Public` panel and a `Private & Charter`
panel. The HTML has inline `onclick="switchTab(…)"` handlers; the toggle
script is at the bottom of the page (see **Inline JavaScript** below).

**Always include a school-zoning disclaimer** at the bottom — school
assignments are address-specific and federal Fair Housing rules limit
how agents can talk about them. The disclaimer is boilerplate but
non-optional.

---

## Nearby Communities — Section 12 (`#nearby-communities`)

A 7-row table linking to the other 8 city pages. Each row: city name,
starting price, a 1-sentence "Why consider" pitch, and a → arrow. This
is **the most important internal-linking section** on the page — it
keeps users moving sideways through your community pages instead of
bouncing.

```html
<tr>
  <td class="nearby-name-cell"><a href="cathedral-city.html">Cathedral City</a></td>
  <td class="nearby-price-cell">From $280K</td>
  <td>Most affordable entry point adjacent to Palm Springs. Growing dining and arts scene with easy access to PS amenities.</td>
  <td class="nearby-arrow-cell">→</td>
</tr>
```

---

## FAQ — Section 13 (`#faq`)

This is the AEO (answer-engine optimization) workhorse. 6–10 accordion
items, each posed as the question a buyer *would actually type into
Google* and answered in 2–4 sentences with specific local detail.

```html
<div class="faq-item">
  <div class="faq-question" onclick="toggleFaq(this)">
    <span class="faq-question-text">What is the median home price in Palm Springs?</span>
    <div class="faq-toggle"><span class="faq-toggle-icon">+</span></div>
  </div>
  <div class="faq-answer">
    <div class="faq-answer-inner">The median home price in Palm Springs is approximately $650,000 as of 2026, though …</div>
  </div>
</div>
```

### FAQ question patterns that work

- `What is the median home price in <city>?`
- `Is <city> a good market for vacation rentals?`
- `What ZIP codes cover <city>?`
- `Are there 55+ / gated communities in <city>?`
- `What architectural styles are most common in <city>?`
- `How hot does it get in <city>?` (or weather/climate question)
- `Is <city> a good place to buy for investment?`
- `What is the land-lease situation in <city>?` (Palm Springs specific —
  every market has its own version of this)

Each answer should mention Shana by name at least once across the set
(but not in every answer — that looks spammy).

---

## Lifestyle + Recent Blog + CTA + Footer — Sections 14–15 + injected

**`#lifestyle` (14)** — Two-column. Left: 2 paragraphs of vibe-y editorial
copy + a 5-bullet list of can't-miss events/attractions. Right: an
interactive 3D Mapbox map (52° pitch, navigation controls) that
lazy-loads when scrolled into view.

**`#community-blog-posts` (runtime-injected)** — A "Recent from the
Blog" section that's **not in the HTML you edit**. `/blog/community-posts.js`
(loaded near the bottom of every community page) fetches
`/api/blog/posts?city=<slug>&limit=3`, filters posts by matching city
metadata, and injects a new `<section id="community-blog-posts">` before
`#community-cta` at page-load time. If the fetch fails or returns
nothing, no section appears. Styled via `.cbp-*` classes in
`community.css` (~line 2117).

**`#community-cta` (15)** — Final pitch. Big "Ready to find your X home?"
title, phone button + email button. Identical across all 9 pages except
the eyebrow line.

**`<footer>`** — Same on every page. Brand block, communities column,
quick links, social row, and the legally-required MLS attribution +
DRE/CalDRE disclaimer.

> **Bug worth flagging for replication:** the "Quick Links" `<ul>` in
> the footer currently contains an accidentally-pasted copy of the
> `<li class="nav-properties">` markup (with its whole dropdown) as a
> list item. It renders OK because CSS handles the dropdown position,
> but it's messy HTML. If you're building a new site from scratch,
> clean that up — put a simple `<li><a href="/properties/…">Properties</a></li>` there instead.

---

## Shared Map System

Every community page loads three pieces and the map system handles
itself:

```html
<!-- in <head> -->
<link href="https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css" rel="stylesheet" />

<!-- near </body> -->
<script src="https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js"></script>
<script>
  window.CV_MAP_CONFIG = {
    "city": "Palm Springs",
    "subtitle": "Coachella Valley, CA",
    "lng": -116.5453,
    "lat": 33.8303,
    "heroZoom": 11.5,
    "lifestyleZoom": 11,
    "boundary": [ /* [lng,lat] closed polygon */ ],
    "pois": [ /* 4–6 POI objects with name, desc, lng, lat, icon */ ]
  }
</script>
<script src="/community-map.js"></script>
```

`community-map.js` reads `window.CV_MAP_CONFIG` and creates:

- **Hero map** at `#hero-map` — non-interactive, 45° pitch, immediate load
- **Lifestyle map** at `#lifestyle-map` — interactive, 52° pitch, lazy-loaded
  via `IntersectionObserver`, with `NavigationControl` and a corner label

Both maps automatically get:

- Mapbox Standard style + `night` light preset (dark + lit 3D buildings)
- I-10 (blue) and Hwy 111 (bronze) GeoJSON line layers
- The city boundary polygon as a fill + outline
- POI markers with click-to-open dark glassmorphism popups

For all the map-specific detail — boundary polygons, road waypoints,
color palette, POI marker CSS, alternative-map ideas — see
**`MAPS.md`** in this repo. It's the single source of truth for the map
implementation; this doc covers the page-level integration.

The valley-location map (section 3) is a **separate** per-page inline
script because the highlighted-current-city logic needs `CURRENT_SLUG`
hardcoded. It lives at the bottom of each HTML file. To replicate it on
a new page, copy the IIFE wholesale and change one line: `var CURRENT_SLUG = 'palm-springs'` → your city's slug.

---

## CMS Overrides (Sanity)

Each community page has an inline `fetch` block near the bottom that
hits `/api/community?slug=<city-slug>` and overlays any CMS-edited
values on top of the hardcoded HTML defaults. This is what lets Shana
update stats via the AI Content Assistant without redeploying.

### Sanity setup

| Item | Value |
|---|---|
| Project ID | `ll3zy5cp` |
| Dataset | `production` |
| Document type | `communityPage` |
| Env vars (Vercel) | `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_WRITE_TOKEN` |
| Public read | via `apicdn.sanity.io` (no auth needed for the runtime fetch) |
| Client library | `@sanity/client` (in `lib/sanity.ts`) |

**No Sanity Studio required.** Documents get created on first write via
the AI Content Assistant — you don't need to stand up a Studio UI for
Shana to edit stats.

### Schema — 7 fields defined, only 2 wired up

`lib/sanity.ts` defines the `CommunityOverride` type with **7 override
fields**:

```ts
interface CommunityOverride {
  quickStats?:     Array<{ key: string; value: string }>
  heroImage?:      { asset: { url: string } } | null
  sectionImages?:  Array<{ role: string; image: { asset: { url: string } } }>
  heroHeadline?:   string
  heroSubheadline?: string
  overviewTitle?:  string
  metaTitle?:      string
  metaDescription?: string
}
```

**But the inline sync script on each community page only reads `quickStats`
and `heroImage`.** The other 5 fields (`sectionImages`, `heroHeadline`,
`heroSubheadline`, `overviewTitle`, `metaTitle`, `metaDescription`) are
defined in Sanity but not wired to the frontend. Two options if you
want them live:

1. **Extend the inline sync script** on each community page to consume
   the extra fields. Straightforward — the API already returns them.
2. **Leave them as latent capacity** — they're harmless when unread and
   useful the day you decide to build a headless CMS view.

### What actually gets synced today

```js
fetch('/api/community?slug=palm-springs')
  .then(r => r.json())
  .then(doc => {
    if (!doc || (!doc.quickStats && !doc.heroImage)) return

    // 1. quickStats — array of { key, value }. Match by case-insensitive
    //    label text against every .hero-stat-label and .fact-label on the
    //    page. Overwrite the matching .hero-stat-value / .fact-value.
    if (doc.quickStats?.length) {
      doc.quickStats.forEach(stat => {
        const keyLower = stat.key.toLowerCase()
        document.querySelectorAll('.hero-stat').forEach(el => {
          const lbl = el.querySelector('.hero-stat-label')
          const val = el.querySelector('.hero-stat-value')
          if (lbl && val && lbl.textContent.trim().toLowerCase() === keyLower) {
            val.textContent = stat.value
          }
        })
        document.querySelectorAll('.quick-fact').forEach(el => {
          const lbl = el.querySelector('.fact-label')
          const val = el.querySelector('.fact-value')
          if (lbl && val && lbl.textContent.trim().toLowerCase() === keyLower) {
            val.textContent = stat.value
          }
        })
      })
    }

    // 2. heroImage — if set, REPLACES the 3D Mapbox hero with a real photo
    //    (a solid background-image overlay div). The hero map stays in the
    //    DOM but is hidden. This is how Shana can override the map with a
    //    curated photograph on any city page.
    if (doc.heroImage?.asset?.url) {
      const heroSection = document.getElementById('community-hero')
      const heroMap = document.getElementById('hero-map')
      if (heroSection && heroMap) {
        const overlay = document.createElement('div')
        overlay.style.cssText = 'position:absolute;inset:0;background-image:url(' +
          doc.heroImage.asset.url + ');background-size:cover;background-position:center;z-index:1;'
        heroSection.insertBefore(overlay, heroMap.nextSibling)
        heroMap.style.display = 'none'
      }
    }
  })
  .catch(() => {})  // silent fallback — HTML defaults win if anything errors
```

### Key details

- **Match is case-insensitive** — `.toLowerCase()` on both sides. A
  Sanity edit like `median home price` will still find the page's
  `Median Home Price` label.
- **Label match is trimmed** — trailing/leading whitespace is stripped
  before comparison.
- **Silent fallback** — if the fetch fails, the API returns 404, or
  the doc has no `quickStats`/`heroImage`, the page keeps its HTML
  defaults. This is important: **the HTML is always the source of truth
  in the worst case.** Nothing on the page depends on Sanity being up.
- **Hero image REPLACES the map** — it doesn't overlay a transparent
  image on top. If you set `heroImage`, you're telling the site
  "show a photo here instead of the 3D map." Use with intent (e.g. a
  city that has a famous skyline photo that outperforms the map).

### API endpoint (`/api/community`)

Simple Node route in `api/community.ts` that:
1. Reads the `slug` query param
2. Calls the Sanity CDN client to fetch the `communityPage` doc where `slug.current == $slug`
3. Returns the raw override doc as JSON
4. Sets `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
   — Sanity edits appear on the site within ~1 minute; stale content
   served up to 5 minutes if the CDN is warm

### Replication options

If you're building a new site and want CMS overrides, three paths:

1. **Keep the Sanity sync** — port `api/community.ts` and `lib/sanity.ts`,
   create a new Sanity project (free tier is enough), swap the project
   ID, add the env vars in Vercel. Worth it if the client will actually
   edit stats themselves.
2. **Remove the sync entirely** — delete the inline fetch script and
   just edit the HTML directly when stats need to change. Simplest
   option. Suits sites where a developer touches the code anyway.
3. **Swap the data source** — point the fetch at a different endpoint
   (Google Sheets via API, Airtable, Webflow CMS, a simple JSON file
   in `public/`, whatever). The matching-by-label logic doesn't care
   where the data comes from — it just needs `{ quickStats: [{key,
   value}], heroImage: {asset:{url}} }` shape back.

---

## Head Content (Full Order)

Every community page's `<head>` follows this exact order. Order matters
for the tracking pixels — they need to fire before anything heavy loads:

```
1.  <!DOCTYPE html> / <html lang="en"> / <head>
2.  RAEK tracking pixel  ← 3rd-party, per-agent ID
3.  OIR / Aggle tracking pixel  ← 3rd-party, per-agent ID
4.  MM (mm-uxrv) tracking pixel  ← 3rd-party, per-agent ID
5.  Google Analytics 4 gtag script + config
6.  <meta charset="UTF-8">
7.  <meta name="viewport" ...>
8.  <link rel="icon" href="/images/favcon.png">  ← note: "favcon" is a typo, keep for consistency
9.  <title>City Homes For Sale | Agent — Market</title>
10. <meta name="description" ...>
11. Google Fonts preconnect + Cormorant Garamond + Jost stylesheet
12. Mapbox GL CSS (v3.4.0)
13. <link rel="stylesheet" href="community.css">
14. YLOPO widget config (var YLOPO_HOSTNAME + window.YLOPO_WIDGETS)
15. Canonical URL injector (small inline IIFE)
</head>
```

Details for the pieces that are per-agent secrets or hidden gotchas:

### Marketing tracking pixels (block #2–4)

Three 3rd-party pixels, dropped in at the very top of `<head>` so they
fire before anything else. **Every ID here is per-agent and must be
swapped when replicating.** Verbatim copy from `palm-springs.html:4–35`:

```html
<!-- Start RAEK Code for www.shanasells.com -->
<script>
(function(window, document, id){
    var script = document.createElement('script');
    script.id = 'raekTag';
    script.type = 'text/javascript';
    script.src = 'https://cdn.raek.net/js/raek.min.js?id='+id;
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);
})(window, document, "6767…YOUR_128_CHAR_RAEK_SITE_ID_HERE…070");
</script>
<!-- End RAEK Code -->

<!-- OIR / Aggle -->
<script type='text/javascript'>!function(e) { e._oirtrk = e._oirtrk || []; }(window);</script>
<script type="text/javascript">
  !(function (s) {
    let o = s.createElement('script'), u = s.getElementsByTagName('script')[0];
    o.src = 'https://cdn.aggle.net/oir/oir.min.js';
    o.async = !0
    o.setAttribute('oirtyp', 'YOUR_OIR_TYP_HERE')     // e.g. '6311ae17'
    o.setAttribute('oirid',  'YOUR_OIR_ID_HERE')       // e.g. 'PP3977C5P'
    u.parentNode.insertBefore(o, u)
  })(document);
</script>

<!-- MM (mm-uxrv) -->
<script async="async" src="https://mm-uxrv.com/js/mm_YOUR_MM_UUID_HERE.js"></script>
```

Per-agent IDs to swap:
- **RAEK** — 128-char site ID (from the RAEK dashboard, one per site)
- **OIR** — `oirtyp` (site type) + `oirid` (account ID)
- **MM** — UUID inside the JS filename
- **GA4** — `G-XXXXXXXXXX` measurement ID (in the gtag block, block #5)

There's no shared config — all four are hardcoded in every one of the
47 public HTML pages on the site. Use find-and-replace across the repo
when swapping.

### Title + description pattern

```html
<title>Palm Springs Homes For Sale | Shana Gates — Coachella Valley Real Estate</title>
<meta name="description" content="Explore homes for sale in Palm Springs, CA. Mid-century modern icons, celebrity estates, and desert living at its finest. Shana Gates, Craft & Bauer | Real Broker." />
```

Always 50–60 chars title, 140–160 chars description, city + "Homes For
Sale" leading, agent + brokerage trailing.

### Canonical URL injector (block #15)

Small IIFE that adds a `<link rel="canonical">` tag pointing at the
production domain, regardless of which host the page is being served
from (Vercel preview URL, Vercel alias, custom domain, etc.):

```html
<script>
!function(){
  var p = location.pathname.replace(/\/index\.html$/,'/')
  var s = p.indexOf('post.html') !== -1 ? location.search : ''
  var l = document.createElement('link')
  l.rel = 'canonical'
  l.href = 'https://www.shanasells.com' + p + s
  document.head.appendChild(l)
}()
</script>
```

**Domain is hardcoded** — swap `https://www.shanasells.com` when
replicating. This is the same string in every one of the 47 pages.

### Favicon

Path is `/images/favcon.png` — note the "favcon" spelling (missing an
`i`, historical typo). Keep it consistent with the actual filename in
the `images/` directory rather than "fixing" it, since dozens of pages
reference it.

---

## Body Content Load Order

Scripts near `</body>` load in this order — order matters because
`community-map.js` needs `mapboxgl` and `CV_MAP_CONFIG` already
present:

```html
<!-- 1. YLOPO listing widget — renders the MLS grid -->
<script src="https://search.<yoursubdomain>.com/build/js/widgets-1.0.0.js" defer></script>

<!-- 2. Blog-posts injector — adds #community-blog-posts before #community-cta -->
<script src="/blog/community-posts.js" defer></script>

<!-- 3. Mapbox library -->
<script src="https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js"></script>

<!-- 4. Per-page config for community-map.js -->
<script>window.CV_MAP_CONFIG = { /* per-city — see Shared Map System below */ }</script>

<!-- 5. Shared map init — creates the hero + lifestyle 3D maps -->
<script src="/community-map.js"></script>

<!-- 6. Per-page valley-context inline map (highlights current city in the overview) -->
<script>(function(){ /* see Valley Location section — ~60 lines */ })()</script>

<!-- 7. FAQ accordion + Schools tabs -->
<script>
  function toggleFaq(btn) { /* … */ }
  function switchTab(tab, panelId) { /* … */ }
</script>

<!-- 8. CMS override sync — see CMS Overrides section -->
<script>(function(){ fetch('/api/community?slug=<city>').then(/* … */) })()</script>

<!-- 9. YLOPO click tracking — appends UTM params + fires idx_property_click gtag events -->
<script src="/ylopo-tracking.js" defer></script>
```

### `/ylopo-tracking.js`

A tiny site-wide script that:
1. Finds every anchor pointing at the YLOPO search subdomain
2. Appends UTM parameters (`utm_source=<agent-site>`, etc.) to those links
3. Fires a `gtag('event', 'idx_property_click', {...})` on click so the
   click can be attributed in GA4

Loaded on every community page (and the homepage). It's not
community-page-specific — swap the YLOPO domain and UTM values when
replicating.

### `/blog/community-posts.js`

Runs on every community page. Reads the page slug from the URL, fetches
`/api/blog/posts?city=<slug>&limit=3`, and if it gets back matching
posts, injects a `<section id="community-blog-posts">` before
`#community-cta` with three post cards. If the fetch returns empty, the
section simply doesn't appear.

Styled via `.cbp-*` classes in `community.css` around line 2117. The
blog post URL structure (`/blog/post/<slug>`) and the API endpoint
(`/api/blog/posts?city=…`) must exist on the destination site — this
depends on the blog pipeline (see `BLOG.md`).

### FAQ + Schools inline handlers

The two tiniest scripts — inline because they're small and removing the
network round-trip helps perceived performance:

```html
<script>
  function toggleFaq(btn) {
    var item = btn.parentElement
    var wasOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'))
    if (!wasOpen) item.classList.add('open')
  }
  function switchTab(tab, panelId) {
    var section = tab.closest('section')
    section.querySelectorAll('.schools-tab').forEach(t => t.classList.remove('active'))
    section.querySelectorAll('.schools-panel').forEach(p => p.classList.remove('active'))
    tab.classList.add('active')
    var panel = document.getElementById(panelId)
    if (panel) panel.classList.add('active')
  }
</script>
```

### Scroll-reveal animations

The slide-in-on-scroll effect for elements with `.reveal` is handled by
`community-map.js` (bottom of the file, `~line 224`). Anything with the
`.reveal` class gets a `visible` class added when it crosses into the
viewport. No per-page setup needed — just add `class="reveal"` to
whatever should animate in.

---

## Design Tokens

Defined at the top of `community.css`:

```css
:root {
  --dark:         #0d0d0d;
  --dark-2:       #131313;
  --dark-3:       #1a1a1a;
  --cream:        #F2EDE4;
  --cream-2:      #E8E1D5;
  --bronze:       #C8C8C8;
  --bronze-light: #DCDCDC;
  --bronze-dim:   rgba(200,200,200,0.18);
  --text-light:   #F2EDE4;
  --text-muted:   rgba(242,237,228,0.55);
  --text-dark:    #1a1814;
  --text-mid:     #4a4540;
  --serif:        'Cormorant Garamond', Georgia, serif;
  --sans:         'Jost', system-ui, sans-serif;
}
```

When replicating on a different brand: change `--bronze` (the accent),
`--cream`/`--cream-2` (warm tones), the `--text-*` pair, and the two
fonts. The dark background palette holds up well across most luxury
real-estate brands — it makes the night-mode 3D map feel native.

---

## How to Add a 10th CV Community Page (Same Project)

1. Pick the slug (e.g. `bermuda-dunes.html`)
2. Copy any existing community HTML file as the starting template. Pick
   one that reflects whether the new city has `#new-construction`
   (Palm Desert / La Quinta / Indio / Cathedral City / Desert Hot
   Springs / Coachella) or not (Palm Springs / Rancho Mirage / Indian
   Wells).
3. **Update the `<head>`:** title, description, canonical URL. Leave the
   4 tracking-pixel blocks and the GA4 gtag ID alone — those are the
   same across all pages.
4. **Update the nav** in every other community page's Communities dropdown
   AND in the footer Communities column. This means opening 9 files and
   adding one line to each. Same for the homepage.
5. **Update content for each of the 15 sections:**
   - Hero: city name, 4 hero stats
   - Valley location: drive-time cards
   - Overview: 3 editorial paragraphs + 8 quick-facts
   - Demographics: 5 census stats
   - Highlights: 6 cards
   - Neighborhoods: 8–12 cards
   - City stats: 5 SVG-icon stats
   - Listings: YLOPO `data-search` `city` param + the "View All" URL
   - HOA fees, Parks: as researched
   - New Construction: 3–5 builder cards (or delete the section if the
     market doesn't have active new-home inventory)
   - Schools: public + private lists + disclaimer
   - Nearby communities: row order updated to reflect proximity
   - FAQ: 6–10 city-specific Q&As
   - Lifestyle bullets
6. **Update `CV_MAP_CONFIG`** at the bottom — center lng/lat, zoom levels,
   boundary polygon, 4–6 POIs (see MAPS.md for the polygon format)
7. **Update the valley-location inline script** — change `CURRENT_SLUG`
   to the new slug and add the new city to the `CITIES` array
8. **Update `sitemap.xml`** + `index.html`'s communities grid + the
   homepage `COMMUNITIES` array in `index.html` (boundary polygon
   duplicated there — keep in sync)
9. `git add . && git commit && git push` — Vercel auto-deploys

---

## How to Replicate the Whole Pattern on a New Site / New Market

This is the big one. The pattern is portable to any real estate market
with 4+ named submarkets. Here's the minimum work to ship it for a new
agent:

### Phase 1 — Strip + Rebrand

1. Copy `community.css`, `community-map.js`, `ylopo-tracking.js`,
   `blog/community-posts.js`, `api/community.ts`, `lib/sanity.ts`,
   **MAPS.md**, and **COMMUNITIES.md** to the new project.
2. Pick a representative community HTML file (e.g. `palm-springs.html`) and copy it as your template.
3. Replace **brand tokens** in `community.css`: `--bronze`, `--cream*`, and the two font references in `--serif`/`--sans`.
4. Replace **agent strings** site-wide: name, brokerage, phone, email, CalDRE, contact address, social handles.
5. Replace **market strings** site-wide: "Coachella Valley" → new market name, "CV" → new abbreviation if any.

### Phase 2 — Map system

The map system is geo-agnostic — it just needs new coordinates.

6. **Pick your roads.** Replace I-10 and Hwy 111 waypoints in `community-map.js` with the freeway + commercial corridor in the new market (or remove the road layers entirely if the market doesn't have signature roads).
7. **Get boundary polygons.** For each city you'll cover, build a closed `[lng,lat]` polygon. Sources: OpenStreetMap → export, US Census TIGER shapefiles → convert with `mapshaper`, or hand-draw in `geojson.io` for approximate ones (good enough for visual purposes — these aren't legal boundaries).
8. **Pick POIs per city** — 4–6 named landmarks with `name`, `desc`, `lng`, `lat`, and an emoji icon.
9. Update the **homepage valley-overview map** (in `index.html`) — same boundary polygons, same road lines, but flat (`pitch: 0`) and zoomed out to fit all cities. Lay each city polygon as a clickable layer that navigates to its page.
10. Update the **per-page valley-location inline script** — same data, but highlight just the current city in yellow. Also decide if you want to keep the Mapbox `dark-v11` style used here or switch to Standard/night for consistency with the hero + lifestyle maps.
11. **Get a new Mapbox access token** for the new site (public token, safe to commit) and swap it in `community-map.js` AND in every page's inline valley-context map. There are ~10 copies — use find-and-replace.

### Phase 3 — Content for each city page

For each city, gather:

- 3-paragraph overview (warm, locally-specific, no hype)
- 8 quick-facts (population, county, median price, elevation, etc.)
- 5 demographics stats (cite the Census ACS as source)
- 6 "what makes it special" highlights
- 8–12 neighborhoods with price ranges
- 5 city-stat trivia numbers
- HOA fee ranges + standard "what HOAs cover" bullets
- 3+ park cards with real addresses and amenities
- (Optional) 3–5 active new-home builder cards if the market has meaningful new construction
- Public + private school lists (then add the zoning disclaimer)
- 6–10 FAQs written as the question buyers actually type into Google
- 5 lifestyle bullets

This is where the work actually lives. If you're building 6 city pages,
plan ~3–6 hours of research per city for genuinely authoritative content.
**Don't shortcut this.** The whole point of the page is depth — generic
content reads instantly as AI slop and fails both search and AEO.

### Phase 4 — Plumbing

12. Wire up the **YLOPO widget** (or whatever IDX provider the new agent uses — same pattern: a div with a JSON config attribute + a CDN script tag). Update `YLOPO_HOSTNAME` in the head config to the agent's specific YLOPO subdomain. YLOPO only renders on domains registered to that agent's account — the widget will appear empty on localhost and Vercel preview URLs (expected).
13. **Update `ylopo-tracking.js`** — this script watches for clicks on
    the YLOPO subdomain and appends UTM parameters + fires
    `idx_property_click` gtag events. Swap the hostname it watches for
    and any hardcoded UTM values.
14. **Tracking pixels** — swap all 4 IDs when replicating:
    - **RAEK** — 128-char site ID (get it from the agent's RAEK
      dashboard)
    - **OIR** — `oirtyp` + `oirid` values from OIR/Aggle
    - **MM** — the UUID inside the mm-uxrv script filename
    - **GA4** — `G-XXXXXXXXXX` measurement ID
    
    Every one of these is repeated in every public HTML page.
    Bulk find-and-replace across the repo before shipping. Delete any
    pixel block the new agent doesn't use.
15. **Canonical URL injector** — swap the hardcoded
    `https://www.shanasells.com` in every page's canonical script to
    the new site's production domain.
16. **Sanity CMS overrides** — decide whether to port them. If yes:
    create a new Sanity project (free tier is enough), port
    `lib/sanity.ts` + `api/community.ts`, swap the project ID, add
    `SANITY_PROJECT_ID` / `SANITY_DATASET` / `SANITY_WRITE_TOKEN` env
    vars in Vercel. If no: delete the inline `fetch('/api/community…')`
    IIFE from every community page.
17. **Blog integration** — if the new site has the same blog pipeline
    (see `BLOG.md`), `/blog/community-posts.js` will inject the "Recent
    from the Blog" section automatically. If the new site doesn't have
    that blog structure, delete the `<script src="/blog/community-posts.js" defer>` include from each page.
18. **Vercel deploy.** Community HTML has no build step. The
    `api/community.ts` and any other TS routes are compiled by Vercel's
    Node runtime automatically. Push to GitHub, connect Vercel, done.

---

## What Holds Up Across Markets vs. What Breaks

**Holds up well** (use as-is):
- The 15-section page anatomy
- The CSS file structure and reveal animations
- The Mapbox Standard / night-preset visual treatment
- The FAQ accordion + Schools tabs JS
- The YLOPO widget integration pattern (`community-map.js` +
  `ylopo-tracking.js`)
- The footer structure and disclaimer placement
- The CMS-overlay-by-label sync pattern
- The runtime blog-post injector (`/blog/community-posts.js`) — as long
  as the destination site has a similar `/api/blog/posts?city=` endpoint

**Needs market-specific work**:
- All road lines (`I-10`, `HWY111`) — only relevant to CV
- All city boundary polygons
- POI sets per city
- The "drive-time cards" (section 2) — destinations are CV-specific
- The Nearby Communities table — needs your actual neighboring cities
- The Behind the Gates dropdown + `gated/*.html` pages — CV-specific
  luxury/gated communities. Delete if the new market doesn't have this
  angle
- New Construction section presence — include only in cities that have
  active builder inventory (was 6/9 for CV)
- The HOA fee ranges, school district names, park names — obviously
- The brand color palette and fonts
- All 4 tracking pixel IDs (RAEK, OIR, MM, GA4)
- The canonical-URL injector's hardcoded production domain
- Mapbox access token (get a new one from the agent's own Mapbox account
  — token is public, safe to commit)

**Needs editorial work, not just copy/paste**:
- All editorial copy across all sections
- The FAQ — must match how *your* buyers in *your* market actually search
- The Lifestyle bullets — locally-specific events and attractions
- Neighborhoods, HOA fee tables, park cards, school lists, new-home
  builder cards — each needs real local research

---

## File Cross-Reference

| If you're touching… | Also check… |
|---|---|
| A new POI on the city map | `MAPS.md` (POI schema + how to add) |
| A boundary polygon change | `MAPS.md` (boundary format) + `index.html` (homepage map has a duplicate copy) + the per-page valley-context inline script (each page has its own copy of every polygon) |
| A new community page | `sitemap.xml`, `index.html` communities grid + `COMMUNITIES` array, all 9 existing community pages' nav dropdowns + footer Communities column |
| The Sanity stat sync logic | `api/community.ts`, `lib/sanity.ts`, `CLAUDE.md` (AI Content Assistant section) |
| The YLOPO widget config | `CLAUDE.md` (YLOPO Widget System section), `ylopo-tracking.js` |
| The runtime blog-post injector | `/blog/community-posts.js`, `/api/blog/posts.ts`, `BLOG.md` |
| Tracking pixel changes | All 47 public HTML pages — use the same bulk-sed pattern from commit `d34ac37` |
| Rotating the Mapbox token | `community-map.js:17` + every community page's inline valley-context map (~10 copies) |
| Canonical URL / production domain change | Every community page's inline canonical script (~10 copies) + the same string in the CMS-sync IIFE where article URLs get built |

---

## Maintenance Instructions

After every significant change to a community page, update this file to
reflect:
- New sections added or removed
- New CSS classes or design tokens
- Changes to the map system or `CV_MAP_CONFIG` schema
- New CMS sync behavior
- New tracking or analytics integrations

---

---

# Palisade Realty San Diego — Community Pages (2026 Adaptation)

This section documents how the Shana Gates / Coachella Valley pattern
above was adapted for **Palisade Realty**, a San Diego County brokerage
run by Hedda Parashos. First completed page: `communities/downtown-san-diego-real-estate.html`.

Repo: `jomylopo/Palisade_Realty` — Vercel auto-deploys on push to `main`.

---

## Key Differences vs. Shana Gates Pattern

| Aspect | Shana Gates (Coachella Valley) | Palisade Realty (San Diego) |
|---|---|---|
| Shared CSS | `community.css` (4,368-line shared file) | Inline `<style>` per page + `../homepage.css` for nav/footer |
| Shared map JS | `community-map.js` | `community-map.js` (same pattern, different config key) |
| Config key | `window.CV_MAP_CONFIG` | `window.SD_COMMUNITY_CONFIG` |
| Mapbox version | v3.4.0 | v3.3.0 (hero + lifestyle); v3.3.0 (location map) |
| Fonts | Cormorant Garamond + Jost | Playfair Display + Manrope + Inter |
| Roads | I-10 (blue) + Hwy 111 (bronze) | I-5 (blue `#7dbfff`) + Harbor Drive (gold `#b89a5e`) |
| Nav style | Dropdown menus | Flat links — left `Buy · Sell · Communities · Testimonials`, right `Financing · Team · Resources · Contact` |
| Communities hub | `index.html` communities section (anchor) | `communities.html` — dedicated hub page |
| IDX domain | `search.searchcoachellavalleyhomes.com` | `search.palisaderealty.com` |
| CMS overrides | Sanity + `/api/community` | None — HTML is the source of truth |
| Blog injection | `/blog/community-posts.js` | Not implemented |
| Tracking pixels | RAEK + OIR + MM + GA4 | None (to be added) |

---

## File Structure

```
Branded Sites/Palisade_Realty/
│
├── communities/                       ← per-community detail pages
│   └── downtown-san-diego-real-estate.html   ← COMPLETED (July 2026)
│
├── communities.html                   ← Hub: 18-community grid, region filter, Mapbox map
├── community-map.js                   ← Shared map system for all community detail pages
├── homepage.css                       ← Base styles (nav, footer, shared utilities)
├── homepage.js                        ← Nav scroll/mobile menu/scroll-reveal for homepage
└── index.html                         ← Homepage
```

**Community detail pages** use:
- `../homepage.css` for nav and footer styles
- An inline `<style>` block for all community-specific dark-theme styles
- `../community-map.js` for Mapbox hero + lifestyle maps + scroll reveal

There is no shared `community.css` yet. Each page carries its own styles. When
a second community page is built, extract shared rules into `community.css` and
link it alongside `homepage.css`.

---

## Brand Tokens (Palisade Realty)

```css
--brand:      #58172a;   /* deep burgundy/maroon — CTAs, city stats band */
--accent:     #eeca00;   /* bright gold — primary buttons, highlights */
--gold:       #b89a5e;   /* warm gold — section eyebrows, road lines, borders */
--near-black: #212121;
--off-white:  #f5f5f5;

/* Community page dark theme */
--cd-dark:    #0b0808;
--cd-dark-2:  #121010;
--cd-dark-3:  #1c1818;
--cd-dark-4:  #252020;
--cd-cream:   #F2EDE4;
--cd-muted:   rgba(242,237,228,0.55);
```

Fonts:
- `'Playfair Display'` — display/headings (`--cd-serif`)
- `'Manrope'` — body copy (`--cd-sans`)
- `'Inter'` — labels, stats, UI text (`--cd-label`)

---

## Map System — `community-map.js`

Same file pattern as the Shana Gates version. Each community page sets
`window.SD_COMMUNITY_CONFIG` before loading the script.

### Config Schema

```js
window.SD_COMMUNITY_CONFIG = {
  city:          "Downtown San Diego",    // used as corner map label
  subtitle:      "San Diego County · California",
  lng:            -117.1590,             // map center longitude
  lat:             32.7152,              // map center latitude
  heroZoom:        13.5,                 // hero map zoom (non-interactive)
  lifestyleZoom:   13.0,                 // lifestyle map zoom (interactive)
  boundary: [                            // closed [lng,lat] polygon
    [-117.176, 32.730], ...
  ],
  pois: [
    { name: "Petco Park", desc: "…", lng: -117.1569, lat: 32.7073, icon: "⚾" },
    // 4–6 POIs per city
  ]
};
```

### Map Behavior

| Map | Element ID | Pitch | Bearing | Interactive | Notes |
|---|---|---|---|---|---|
| Hero | `#hero-map` | 45° | -10° | No | Loads immediately on page load |
| Location (orientation) | `#location-map` | 0° | — | No | Inline per-page script; dark-v11 style |
| Lifestyle | `#lifestyle-map` | 52° | -17° | Yes | IntersectionObserver lazy-load |

Both hero and lifestyle use `mapbox://styles/mapbox/standard` + `night` light preset.
The orientation map uses `mapbox://styles/mapbox/dark-v11` (same as the Shana
Gates valley-location map — flat look, no 3D buildings competing with the
current-city highlight).

### Road Layers

```js
// I-5 — runs north-south through San Diego
I5_COORDS = [
  [-117.107, 32.671], [-117.120, 32.690], [-117.130, 32.703],
  [-117.136, 32.718], [-117.143, 32.735], [-117.152, 32.760],
  [-117.157, 32.783], [-117.162, 32.812], [-117.168, 32.845],
  [-117.173, 32.877], [-117.175, 32.903]
];
// Glow #5ba4ff opacity 0.22 blur 5  •  Line #7dbfff opacity 0.72

// Harbor Drive — bayfront waterfront corridor (west side of downtown)
HARBOR_COORDS = [
  [-117.136, 32.699], [-117.148, 32.706], [-117.158, 32.711],
  [-117.163, 32.717], [-117.169, 32.722], [-117.173, 32.727],
  [-117.175, 32.731]
];
// Glow #b89a5e opacity 0.20 blur 5  •  Line #b89a5e opacity 0.65
```

Boundary polygon: fill `#eeca00` opacity 0.07 · line `#eeca00` opacity 0.55 · line-width 1.5

Mapbox token: `pk.eyJ1Ijoiam9tLW1hcGJveCIsImEiOiJjbXFxaGJva3AwNDVqMnBxcnlvaW54aWRoIn0.f4TeZyya7vaALl39DaWK5Q`

---

## Page Anatomy — Palisade Realty SD Version

Same 15-section structure as Shana Gates. All section IDs below are `id=""` anchors:

| # | Section ID | Palisade SD Implementation Notes |
|---|---|---|
| — | `<header class="site-header">` | Standard PR nav. Transparent → scrolled-dark. Dark-page overrides in inline `<style>` |
| 1 | `community-hero` | 100svh, Mapbox `#hero-map`, gradient overlay, breadcrumb (absolute top), eyebrow + `<h1>`, 4 hero stats |
| 2 | `location-context` | Orientation map at `#location-map` (dark-v11, county context + boundary highlight) + 4 drive-time cards |
| 3 | `overview` | 2-col: editorial left + `.quick-facts` sticky sidebar right |
| 4 | `demographics` | Full-width crimson-dark-3 band; 5 census stats |
| 5 | `highlights` | 6-card grid |
| 6 | `neighborhoods` | 8-card grid (4 cols) |
| 7 | `city-stats` | `background: var(--cd-brand)` (#58172a) band; 5 stats in `--cd-accent` (#eeca00) |
| 8 | `listings` | Ylopo `YLOPO_resultsWidget` div; `data-search` targets Downtown San Diego |
| 9 | `hoa-fees` | 2-col: fee table left, "What HOAs cover" bullets right |
| 10 | `parks-rec` | 2×2 park cards |
| 11 | `schools` | Tabbed (Public / Private & Charter); `switchTab()` inline handler |
| 12 | `nearby-communities` | `<table>` with 6 neighboring SD communities |
| 13 | `faq` | 8 accordion items; `toggleFaq()` inline handler |
| 14 | `lifestyle` | 2-col: editorial left + `#lifestyle-map` right (lazy-loaded, interactive) |
| 15 | `community-cta` | Phone + email CTAs |
| — | `<footer class="site-footer">` | Standard PR footer (same as homepage) |

---

## Script Load Order (community detail pages)

```html
<!-- 1. Ylopo widget -->
<script src="https://search.palisaderealty.com/build/js/32e06f9e150f998b6c50.js"></script>
<script src="https://search.palisaderealty.com/build/js/widgets-1.0.0.js" defer></script>

<!-- 2. Homepage JS (handles nav scroll + mobile menu) -->
<script src="../homepage.js"></script>

<!-- 3. Mapbox GL JS v3.3.0 -->
<script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>

<!-- 4. Per-page config -->
<script>window.SD_COMMUNITY_CONFIG = { /* ... */ };</script>

<!-- 5. Shared community map system — creates hero + lifestyle maps + scroll reveal -->
<script src="../community-map.js"></script>

<!-- 6. Per-page inline location map (orientation, dark-v11, shows county context) -->
<script>(function(){ /* ~60 lines, CURRENT_SLUG hardcoded, county boundary + current city highlighted */ })()</script>

<!-- 7. FAQ accordion + Schools tabs -->
<script>
  function toggleFaq(btn) { /* ... */ }
  function switchTab(tab, panelId) { /* ... */ }
</script>
```

Note: `community-map.js` also handles the `.reveal` scroll-reveal system (adds `.visible`
via IntersectionObserver). No separate scroll-reveal script needed.

---

## How to Add a New San Diego Community Page

1. **Create the file** at `communities/<slug>.html` (e.g. `communities/la-jolla-real-estate.html`)
2. **Copy** `communities/downtown-san-diego-real-estate.html` as the template
3. **Update `<head>`** — title, description, canonical path
4. **Update nav** — no change needed (nav links are relative to `../`)
5. **Update `SD_COMMUNITY_CONFIG`** — city name, lng/lat, zoom, boundary polygon, POIs
6. **Update location-map inline script** — change center coordinates + boundary polygon to match the new city
7. **Update all 15 sections** with city-specific content (editorial, stats, neighborhoods, schools, parks, FAQ, etc.)
8. **Add the new page to `communities.html`** — add a `.comm-card` to the grid with the correct `data-region` attribute
9. **Update `communities.html` nav link list** (`.lfyp-cities`) if applicable
10. `git add . && git commit -m "Add <city> community page" && git push` — Vercel auto-deploys

### Community Card Template (for `communities.html` grid)

```html
<div class="comm-card" data-region="coastal">
  <div class="comm-card-img">
    <img src="images/communities/<city-slug>.jpg" alt="<City Name> homes" loading="lazy">
  </div>
  <div class="comm-card-body">
    <h3 class="comm-card-title"><City Name></h3>
    <p class="comm-card-meta">From $XXXk · Condos + Single-Family</p>
    <a href="communities/<city-slug>-real-estate.html" class="comm-card-link">Explore <City Name> →</a>
  </div>
</div>
```

`data-region` values: `coastal` | `north-county` | `east-south`

---

## Completed Community Detail Pages

| Page | Status | File |
|---|---|---|
| Downtown San Diego | ✅ Complete | `communities/downtown-san-diego-real-estate.html` |

---

## Communities Hub (`communities.html`)

The hub page at `communities.html` serves as a browsable index of all
18 San Diego communities Palisade Realty covers. Key elements:

- **Hero** — full-bleed La Jolla background + "San Diego Communities" heading
- **Intro stats** — 18 Communities · $700K–$5M+ · Daily Updated · Expert Local Guide
- **Region filter tabs** — All · Coastal · North County · East & South (JS-driven `.is-hidden` toggle on `.comm-card`)
- **18-card grid** — 4-col, each card `data-region` tagged, links to individual community pages
- **"Find Your Place" Mapbox map** — reuses `#lfyp-map` + `homepage.js` (same map as homepage "Find Your Place" section, dark-v11 style)
- **CTA** — links to `/#cta` on homepage

The communities hub nav link (`Communities`) points to `communities.html` across
all pages — updated in: `index.html` left-nav, `index.html` mobile drawer,
`index.html` map section "See All Communities" button, `index.html` footer,
and all community detail page navs.

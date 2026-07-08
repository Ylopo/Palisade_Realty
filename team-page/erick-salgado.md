# Erick Salgado — Agent Profile Page

**File:** `team-page/erick-salgado.html`
**Live URL:** https://palisade-realty-inky.vercel.app/team-page/erick-salgado.html
**Canonical:** https://palisaderealty.com/team-page/erick-salgado

---

## Agent Details

| Field | Value |
|---|---|
| Name | Erick Salgado |
| Title | REALTOR® |
| Brokerage | Palisade Realty |
| DRE | CA DRE #01999413 |
| Phone | (619) 800-4839 |
| Email | erick@palisaderealty.com |
| Ylopo Site | https://erick.palisaderealty.com |
| Home Valuation | https://erick.palisaderealty.com/seller |

---

## Page Sections

### 1. Hero (`ap-hero`)
Dark brand background (`#28000c`) with radial gradient overlays. Displays agent name, title/DRE meta row, and three CTA buttons:
- **Call** → `tel:+16198004839`
- **Send an Email** → `mailto:erick@palisaderealty.com`
- **View Listings** (gold) → `https://search.palisaderealty.com/`

### 2. Bio (`ap-bio`, `id="about"`)
3-column grid: photo left, bio center, contact sidebar right.
- **Photo:** `../assets/images/agents/erick-salgado.jpg`
- **Bio:** Two paragraphs of real agent copy sourced from palisaderealty.com
- **Sidebar CTAs:** Send a Message (→ `#contact`), Get a Home Valuation (→ `https://erick.palisaderealty.com/seller`)

### 3. Awards (`ap-awards`)
3-card grid highlighting:
- 2017 — Top Agent (Palisade Realty)
- 2018 — Top Producer (Palisade Realty)
- 2019 — Excellence in Customer Service (Homesnap + Google)

### 4. Areas Served (`ap-areas`)
White/black color scheme with brand accent. Two-column layout:
- **Left:** heading + 18 community chips with `data-slug` and `data-city` attributes; each links to the corresponding community page under `../communities/`
- **Right:** Mapbox interactive map (`id="ap-areas-map"`), sticky at `top: 96px`, `height: 580px`

**Mapbox config:**
- Library: Mapbox GL JS v3.3.0 (CDN)
- Token: `pk.eyJ1Ijoiam9tLW1hcGJveCIsImEiOiJjbXFxaGJva3AwNDVqMnBxcnlvaW54aWRoIn0.f4TeZyya7vaALl39DaWK5Q`
- Style: `mapbox://styles/mapbox/dark-v11`
- Center: `[-117.35, 33.10]`, Zoom: `9.0`
- Renders SD County boundary polygon + 18 community fill polygons with hover interaction

**Communities (18):**
Downtown San Diego, Mission Hills, Point Loma, Coronado, Pacific & Mission Beach, Mission Valley, La Jolla, Del Mar, Carmel Valley, Solana Beach, Rancho Santa Fe, Encinitas, Carlsbad, Oceanside, Spring Valley, Chula Vista, La Mesa, El Cajon

### 5. Featured Listings Carousel (`.listings-outer`, `id="listings"`)
Empty anchor div — the `.fl-wrapper` carousel is injected **before** this element by `../featured-listings.js` at runtime. Full-bleed image carousel with 5 property slides, arrows, dots, and ken-burns animation. CSS in `../featured-listings.css`.

### 6. All Listings — Ylopo Widget (`ap-all-listings`)
Ylopo IDX results widget showing active listings across San Diego County.

**Widget config:**
```html
<!-- Head -->
<script>window.YLOPO_WIDGETS = {"domain": "search.palisaderealty.com"}</script>

<!-- Body -->
<div class="YLOPO_resultsWidget" data-search='{"locations":[
  {"city":"San Diego","state":"CA"},
  {"city":"La Jolla","state":"CA"},
  {"city":"Coronado","state":"CA"},
  {"city":"Del Mar","state":"CA"},
  {"city":"Encinitas","state":"CA"},
  {"city":"Carlsbad","state":"CA"},
  {"city":"Oceanside","state":"CA"},
  {"city":"Solana Beach","state":"CA"},
  {"city":"Chula Vista","state":"CA"}
]}'></div>

<!-- Footer (before </body>) -->
<script src="https://search.palisaderealty.com/build/js/widgets-1.0.0.js" defer></script>
```

> **Note:** Widget only renders on domains registered in the Ylopo HSS account. On unregistered domains (e.g., the Vercel preview URL) the div renders empty. To fix, add `palisade-realty-inky.vercel.app` to allowed domains in the Ylopo dashboard, or test on `palisaderealty.com`.

### 7. Contact Form (`ap-contact`, `id="contact"`)
Two-column layout: contact info left, form right.
- Fields: First Name, Last Name, Email, Phone, Interest (dropdown), Message
- Consent disclaimer (TCPA)
- Office address: 3434 Grove Street, Lemon Grove, CA 91945

### 8. Related Agents (`ap-related`)
Grid of other team agent cards linking back to `../team.html` or individual agent pages.

### 9. Footer
Shared site footer with logo, nav links, contact info, DRE disclaimers, and social icons.

---

## Dependencies

| Resource | Source |
|---|---|
| `homepage.css` | `../homepage.css` — shared design tokens, nav, footer, reveal animations |
| `featured-listings.css` | `../featured-listings.css` — carousel styles |
| `homepage.js` | `../homepage.js` — nav scroll, mobile menu, scroll reveal |
| `featured-listings.js` | `../featured-listings.js` — injects `.fl-wrapper` carousel |
| Mapbox GL JS v3.3.0 | CDN: `https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js` |
| Mapbox GL CSS | CDN: `https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css` |
| Ylopo widget | `https://search.palisaderealty.com/build/js/widgets-1.0.0.js` |
| Google Fonts | Playfair Display, Manrope, Inter |

---

## Design Tokens (inherited from `homepage.css`)

| Token | Value |
|---|---|
| `--brand` | `#58172a` |
| `--brand-dark` | `#4a0e1f` |
| `--brand-darker` | `#28000c` |
| `--accent` | `#eeca00` |
| `--gold` | `#b89a5e` |
| `--near-black` | `#212121` |
| `--off-white` | `#f5f5f5` |
| `--font-display` | `'Playfair Display'` |
| `--font-body` | `'Manrope'` |
| `--font-label` | `'Inter'` |

---

## Navigation

The page uses the shared site header from `homepage.css`/`homepage.js`:
- **Left nav:** Buy · Sell · Communities (dropdown with 18 communities) · Testimonials
- **Right nav:** Financing · Team (active) · Resources · Contact
- **Logo:** `../images/logo.png` → links to `../`
- **Mobile:** Hamburger drawer with Communities sub-list

---

## Adding This Page to Other Files

**Homepage carousel** (`homepage.js`): The agent card for Erick Salgado links to `/team-page/erick-salgado.html` (local page, not the Squarespace URL).

**Team page** (`team.html`): Uses an `OVERRIDES` map:
```javascript
var OVERRIDES = {
  'erick-salgado': '/team-page/erick-salgado.html'
};
```
Cards with an override open in the same tab; all others open in a new tab to `palisaderealty.com/team-page/{slug}`.

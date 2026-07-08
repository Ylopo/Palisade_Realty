# Agent Page — Content & Structure Reference

Template file: `team-page/erick-salgado.html`

---

## Page Meta

| Field | Value |
|---|---|
| Title | Erick Salgado — REALTOR® \| Palisade Realty San Diego |
| Description | Erick Salgado is a REALTOR® with Palisade Realty serving San Diego County since 2014. Top Agent 2017, Top Producer 2018. DRE# 01999413. Call (619) 800-4839. |
| Canonical | https://palisaderealty.com/team-page/erick-salgado |

---

## Hero Section

| Field | Value |
|---|---|
| First Name | Erick |
| Last Name | Salgado |
| Title | REALTOR® |
| Brokerage | Palisade Realty |
| DRE | CA DRE #01999413 |

**CTAs**
- Call (619) 800-4839 → `tel:+16198004839`
- Send an Email → `mailto:erick@palisaderealty.com`
- View Listings → `https://search.palisaderealty.com/`

---

## Bio Section

**Photo**
- Path: `../assets/images/agents/erick-salgado.jpg`
- Dimensions: 240 × 320

**Bio Paragraphs**

> With so much at stake in real estate, who you work with is especially critical. Whether you are purchasing your first home or selling your family home of 30 years, you can expect my level of dedication and performance as a REALTOR® to be high. Constantly educating myself and my clientele on housing trends and the health of the market is fundamental to making critical decisions in real estate. My expertise in analyzing, marketing, and transacting residential real estate allows me to help my clients realize their real estate goals.

> Since 2014, I have been part of creating and growing the team at Palisade Realty. My expertise in real estate technology and exceptional customer service has helped elevate our brokerage in the real estate industry. In 2017, I earned the Top Agent award at Palisade Realty, followed by a Top Producer award in 2018. This year I earned Excellence in Customer Service from Homesnap + Google. Hundreds of transactions representing local and international clients across San Diego County has given our whole team intimate knowledge of the buying and selling process to deliver consistent results to our clients. In addition, my years of experience as a paralegal affords my clients a clearer understanding of their agreements. Effective negotiations, excellent customer service and delivering results to our clients in every transaction is what we strive for and consistently achieve.

**Contact Sidebar**
- Phone: (619) 800-4839 → `tel:+16198004839`
- Email: erick@palisaderealty.com → `mailto:erick@palisaderealty.com`
- CTA 1 (fill): Send a Message → `#contact`
- CTA 2 (outline): Get a Home Valuation → `https://erick.palisaderealty.com/seller`

---

## Awards Section

| Year | Award | Description |
|---|---|---|
| 2017 | Top Agent | Recognized as the top performing agent at Palisade Realty for outstanding sales volume and client satisfaction across San Diego County. |
| 2018 | Top Producer | Earned Top Producer designation at Palisade Realty, reflecting exceptional transaction volume and consistent results delivered to clients. |
| 2019 | Excellence in Customer Service | Awarded Excellence in Customer Service by Homesnap + Google — a testament to a client-first approach at every stage of the transaction. |

---

## Areas Served — Community List

18 communities. Each chip has: `href`, `data-slug`, `data-city`, `aria-label`.

| Community | Slug | URL |
|---|---|---|
| Downtown San Diego | `downtown-san-diego` | `../communities/downtown-san-diego-real-estate.html` |
| Mission Hills | `mission-hills` | `../communities/mission-hills-real-estate.html` |
| Point Loma | `point-loma` | `../communities/point-loma-real-estate.html` |
| Coronado | `coronado` | `../communities/coronado-real-estate.html` |
| Pacific & Mission Beach | `pacific-mission-beach` | `../communities/pacific-mission-beach-real-estate.html` |
| Mission Valley | `mission-valley` | `../communities/mission-valley-real-estate.html` |
| La Jolla | `la-jolla` | `../communities/la-jolla-real-estate.html` |
| Del Mar | `del-mar` | `../communities/del-mar-real-estate.html` |
| Carmel Valley | `carmel-valley` | `../communities/carmel-valley-real-estate.html` |
| Solana Beach | `solana-beach` | `../communities/solana-beach-real-estate.html` |
| Rancho Santa Fe | `rancho-santa-fe` | `../communities/rancho-santa-fe-real-estate.html` |
| Encinitas | `encinitas` | `../communities/encinitas-real-estate.html` |
| Carlsbad | `carlsbad` | `../communities/carlsbad-real-estate.html` |
| Oceanside | `oceanside` | `../communities/oceanside-real-estate.html` |
| Spring Valley | `spring-valley` | `../communities/spring-valley-real-estate.html` |
| Chula Vista | `chula-vista` | `../communities/chula-vista-real-estate.html` |
| La Mesa | `la-mesa` | `../communities/la-mesa-real-estate.html` |
| El Cajon | `el-cajon` | `../communities/el-cajon-real-estate.html` |

---

## Areas Served — Map

**Mapbox Config**

| Field | Value |
|---|---|
| Token | `pk.eyJ1Ijoiam9tLW1hcGJveCIsImEiOiJjbXFxaGJva3AwNDVqMnBxcnlvaW54aWRoIn0.f4TeZyya7vaALl39DaWK5Q` |
| Style | `mapbox://styles/mapbox/dark-v11` |
| Container | `#ap-areas-map` |
| Initial Center | `[-117.35, 33.10]` |
| Initial Zoom | `9.0` |
| Min Zoom | `7` |
| Max Zoom | `15` |
| Fit Bounds Padding | `40px` (auto-fit on load) |
| FlyTo Zoom | `11.8` |
| FlyTo Duration | `1000ms` |

**Map Layer IDs**

| Layer | Source | Type | Purpose |
|---|---|---|---|
| `ap-sd-county-fill` | `ap-sd-county` | fill | County boundary tint |
| `ap-sd-county-border` | `ap-sd-county` | line | County border line |
| `ap-city-fill` | `ap-cities` | fill | Community polygon fill (hover/active states) |
| `ap-city-border` | `ap-cities` | line | Community polygon border |
| `ap-city-label` | `ap-cities` | symbol | Community name labels |

**Interaction Pattern**
- Map polygon click → `activateCity(feat.id, slug, center)` → highlights polygon + flyTo + navigates to community page after 380ms delay
- Chip click → `activateCity(slug, slug, center, false)` → highlights polygon + flyTo, does NOT navigate
- Chip mouseenter/mouseleave ↔ map feature-state `hover` sync (bidirectional)
- Popup on map hover (community name, no pointer events)

---

## All Listings Widget

**Ylopo Widget Config**

```json
{
  "locations": [
    {"city": "San Diego", "state": "CA"},
    {"city": "La Jolla", "state": "CA"},
    {"city": "Coronado", "state": "CA"},
    {"city": "Del Mar", "state": "CA"},
    {"city": "Encinitas", "state": "CA"},
    {"city": "Carlsbad", "state": "CA"},
    {"city": "Oceanside", "state": "CA"},
    {"city": "Solana Beach", "state": "CA"},
    {"city": "Chula Vista", "state": "CA"}
  ]
}
```

Widget loader: `https://search.palisaderealty.com/build/js/widgets-1.0.0.js`
Domain config: `window.YLOPO_WIDGETS = {"domain": "search.palisaderealty.com"}`

---

## Contact Section

| Field | Value |
|---|---|
| Phone | (619) 800-4839 |
| Email | erick@palisaderealty.com |
| Address | 3434 Grove Street, Lemon Grove, CA 91945 |

**Contact Form Fields**
- First Name (text, required)
- Last Name (text, required)
- Email Address (email, required)
- Phone Number (tel)
- I'm Interested In (select): Buying a Home / Selling My Home / Buying & Selling / Investment Property / Other
- Message (textarea)

---

## Related Agents

| Name | Role | Photo | Profile URL |
|---|---|---|---|
| Hedda Parashos | CEO & Principal Broker | `../assets/images/agents/hedda-parashos.jpg` | `https://palisaderealty.com/team-page/hedda-parashos` |
| Tom Parashos | Principal / Co-Owner | `../assets/images/agents/tom-parashos.jpg` | `https://palisaderealty.com/team-page/tom-parashos` |
| Britney Bartlett | Director of Operations | `../assets/images/agents/britney-bartlett.jpg` | `https://palisaderealty.com/team-page/britney-bartlett` |
| Melissa Maxwell | REALTOR® | `../assets/images/agents/melissa-maxwell.jpg` | `https://palisaderealty.com/team-page/melissa-maxwell` |

---

## CTA Section

| Field | Value |
|---|---|
| Eyebrow | Ready to Get Started? |
| Heading | Let's Find Your Dream Home |
| Body | Erick is ready to guide you — whether you're buying, selling, or exploring your options. Reach out today for a no-pressure conversation. |
| CTA 1 (fill) | Contact Erick → `#contact` |
| CTA 2 (outline) | Search Properties → `https://search.palisaderealty.com/` |
| Background Image | `../images/hero-background/hero-4.jpg` |

---

## Scripts & Dependencies

| Asset | URL / Path | Load |
|---|---|---|
| Mapbox GL CSS | `https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css` | `<link>` in `<head>` |
| Mapbox GL JS | `https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js` | `<script>` in `<head>` |
| Google Fonts | Playfair Display, Manrope, Inter | `<link>` in `<head>` |
| homepage.css | `../homepage.css` | `<link>` in `<head>` |
| featured-listings.css | `../featured-listings.css` | `<link>` in `<head>` |
| Ylopo widget loader | `https://search.palisaderealty.com/build/js/widgets-1.0.0.js` | `defer` before `</body>` |
| homepage.js | `../homepage.js` | before `</body>` |
| featured-listings.js | `../featured-listings.js` | before `</body>` |
| Map script | inline `<script>` | after loaders |
| Reveal animations | inline `<script>` | last before `</body>` |

---

## Page Structure (Section Order)

1. `<header>` — Site nav with Communities dropdown (18 communities) + mobile drawer
2. `<section class="ap-hero">` — Agent name, meta, 3 CTAs
3. `<section class="ap-bio">` — Photo + bio copy + contact sidebar
4. `<section class="ap-awards">` — 3 award cards on dark background
5. `<section class="ap-areas">` — Community chip grid (left) + Mapbox map (right)
6. `<div class="listings-outer">` — Featured listings injected by `featured-listings.js`
7. `<section class="ap-all-listings">` — Ylopo IDX widget
8. `<section class="ap-contact">` — Contact info + form
9. `<section class="ap-related">` — 4 related agent cards
10. `<section class="tp-cta">` — Full-bleed CTA banner
11. `<footer>` — Logo, DRE, social, quick links, address

---

## Notes

- Hero section ID: none (breadcrumb nav links back to `/team.html`)
- Listings anchor: `id="listings"` on the `listings-outer` div (used by hero CTA "View Listings")
- Contact anchor: `id="contact"` on `.ap-contact` section
- About anchor: `id="about"` on `.ap-bio` section
- Seller valuation URL is agent-specific subdomain: `https://erick.palisaderealty.com/seller`
- Featured listings section is injected dynamically by `featured-listings.js` — no static HTML
- Ylopo widget renders only on registered domain (`search.palisaderealty.com`), not localhost

---

## All Agent Pages

| Name | Slug | Title | Image | Local URL |
|---|---|---|---|---|
| Hedda Parashos | hedda-parashos | CEO & Principal Broker | ../assets/images/agents/hedda-parashos.jpg | /team-page/hedda-parashos.html |
| Tom Parashos | tom-parashos | Principal / Co-Owner | ../assets/images/agents/tom-parashos.jpg | /team-page/tom-parashos.html |
| Britney Bartlett | britney-bartlett | Director of Operations | ../assets/images/agents/britney-bartlett.jpg | /team-page/britney-bartlett.html |
| Michael DiVita | michael-divita | REALTOR® | ../assets/images/agents/michael-divita.jpg | /team-page/michael-divita.html |
| Michael Guzman | michael-guzman | REALTOR® | ../assets/images/agents/michael-guzman.jpg | /team-page/michael-guzman.html |
| Nicole Ward | nicole-ward | REALTOR® | ../assets/images/agents/nicole-ward.png | /team-page/nicole-ward.html |
| Danielle Patterson | danielle-patterson | REALTOR® | ../assets/images/agents/danielle-patterson.jpg | /team-page/danielle-patterson.html |
| Lisa Florendo | lisa-florendo | REALTOR® | ../assets/images/agents/lisa-florendo.png | /team-page/lisa-florendo.html |
| Kelly Chan | kelly-chan | REALTOR® | ../assets/images/agents/kelly-chan.jpg | /team-page/kelly-chan.html |
| Fermin Perez | fermin-perez | REALTOR® | ../assets/images/agents/fermin-perez.jpg | /team-page/fermin-perez.html |
| Erick Salgado | erick-salgado | REALTOR® | ../assets/images/agents/erick-salgado.jpg | /team-page/erick-salgado.html |
| Melissa Maxwell | melissa-maxwell | REALTOR® | ../assets/images/agents/melissa-maxwell.jpg | /team-page/melissa-maxwell.html |
| Patty Aguilar | patty-aguilar | REALTOR® | ../assets/images/agents/patty-aguilar.jpg | /team-page/patty-aguilar.html |
| Deborah Trevino | deborah-trevino | REALTOR® | ../assets/images/agents/deborah-trevino.jpg | /team-page/deborah-trevino.html |
| Sarah Bautista | sarah-bautista | REALTOR® | ../assets/images/agents/sarah-bautista.jpg | /team-page/sarah-bautista.html |
| Piper Stein | piper-stein | REALTOR® | ../assets/images/agents/piper-stein.jpg | /team-page/piper-stein.html |
| Jason Wallace | jason-wallace | REALTOR® | ../assets/images/agents/jason-wallace.jpg | /team-page/jason-wallace.html |
| Mariko Tortolero | mariko-tortolero | REALTOR® | ../assets/images/agents/mariko-tortolero.png | /team-page/mariko-tortolero.html |
| Eric Hayman | eric-hayman | REALTOR® | ../assets/images/agents/eric-hayman.jpg | /team-page/eric-hayman.html |
| Keith Agnello | keith-agnello | REALTOR® | ../assets/images/agents/keith-agnello.jpg | /team-page/keith-agnello.html |
| Vanda Fernandes | vanda-fernandes | REALTOR® | ../assets/images/agents/vanda-fernandes.jpg | /team-page/vanda-fernandes.html |
| Patty Samii | patty-samii | REALTOR® | ../assets/images/agents/patty-samii.png | /team-page/patty-samii.html |
| Robby Gmur | robby-gmur | REALTOR® | ../assets/images/agents/robby-gmur.jpg | /team-page/robby-gmur.html |
| Brandy Bell | brandy-bell | REALTOR® | ../assets/images/agents/brandy-bell.jpg | /team-page/brandy-bell.html |
| Hervin Ugalde | hervin-ugalde | REALTOR® | ../assets/images/agents/hervin-ugalde.jpg | /team-page/hervin-ugalde.html |
| Ivan Butrus | ivan-butrus | REALTOR® | ../assets/images/agents/ivan-butrus.jpg | /team-page/ivan-butrus.html |
| Anh Lam | anh-lam | REALTOR® | ../assets/images/agents/anh-lam.jpg | /team-page/anh-lam.html |
| Katya Schumaker | katya-schumaker | REALTOR® | ../assets/images/agents/katya-schumaker.jpg | /team-page/katya-schumaker.html |
| Meghan McNutt | meghan-mcnutt | REALTOR® | ../assets/images/agents/meghan-mcnutt.jpg | /team-page/meghan-mcnutt.html |
| Debbie Lawes | debbie-lawes | REALTOR® | ../assets/images/agents/debbie-lawes.jpg | /team-page/debbie-lawes.html |
| Martina Toma | martina-toma | REALTOR® | ../assets/images/agents/martina-toma.jpg | /team-page/martina-toma.html |
| Alexandra Polles | alexandra-polles | REALTOR® | ../assets/images/agents/alexandra-polles.jpg | /team-page/alexandra-polles.html |
| Fia Ierino | fia-ierino | REALTOR® | ../assets/images/agents/fia-ierino.jpg | /team-page/fia-ierino.html |
| Diana Beezley | diana-beezley | REALTOR® | ../assets/images/agents/diana-beezley.jpg | /team-page/diana-beezley.html |
| Lyna Rawlings | lyna-rawlings | REALTOR® | ../assets/images/agents/lyna-rawlings.jpg | /team-page/lyna-rawlings.html |
| Yvonne Mulgrew | yvonne-mulgrew | REALTOR® | ../assets/images/agents/yvonne-mulgrew.jpg | /team-page/yvonne-mulgrew.html |
| Allison Asher | allison-asher | REALTOR® | ../assets/images/agents/allison-asher.png | /team-page/allison-asher.html |
| Alan Luken | alan-luken | REALTOR® | ../assets/images/agents/alan-luken.jpg | /team-page/alan-luken.html |
| Delilah Bejarano-Armendariz | delilah-bejarano-armendariz | REALTOR® | ../assets/images/agents/delilah-bejarano-armendariz.jpg | /team-page/delilah-bejarano-armendariz.html |
| Jaymie Santiago | jaymie-santiago | REALTOR® | ../assets/images/agents/jaymie-santiago.png | /team-page/jaymie-santiago.html |
| Jodi Kirkwood | jodi-kirkwood | REALTOR® | ../assets/images/agents/jodi-kirkwood.jpg | /team-page/jodi-kirkwood.html |
| Marla Drexler | marla-drexler | REALTOR® | ../assets/images/agents/marla-drexler.jpg | /team-page/marla-drexler.html |
| Lacy McFarland | lacy-mcfarland | REALTOR® | ../assets/images/agents/lacy-mcfarland.jpg | /team-page/lacy-mcfarland.html |
| Renata Rios | renata-rios | REALTOR® | ../assets/images/agents/renata-rios.jpg | /team-page/renata-rios.html |
| Juanito So Jr. | juanito-so-jr | REALTOR® | ../assets/images/agents/juanito-so-jr.jpg | /team-page/juanito-so-jr.html |
| Kalen Esguerra | kalen-esguerra | REALTOR® | ../assets/images/agents/kalen-esguerra.jpg | /team-page/kalen-esguerra.html |
| Debbie No | debbie-no | REALTOR® | ../assets/images/agents/debbie-no.jpg | /team-page/debbie-no.html |
| Chip Morgan | chip-morgan | REALTOR® | ../assets/images/agents/chip-morgan.jpg | /team-page/chip-morgan.html |
| Daniel Kappler | daniel-kappler | REALTOR® | ../assets/images/agents/daniel-kappler.jpg | /team-page/daniel-kappler.html |
| Diane Van Korlaar | diane-van-korlaar | REALTOR® | ../assets/images/agents/diane-van-korlaar.jpg | /team-page/diane-van-korlaar.html |
| Ryan Stein | ryan-stein | REALTOR® | ../assets/images/agents/ryan-stein.jpg | /team-page/ryan-stein.html |
| Brandon Le | brandon-le | REALTOR® | ../assets/images/agents/brandon-le.jpg | /team-page/brandon-le.html |
| Zach Campbell | zach-campbell | REALTOR® | ../assets/images/agents/zach-campbell.jpg | /team-page/zach-campbell.html |
| Aubrey Foulk | aubrey-foulk | REALTOR® | ../assets/images/agents/aubrey-foulk.jpg | /team-page/aubrey-foulk.html |
| Jeremy McHone | jeremy-mchone | REALTOR® | ../assets/images/agents/jeremy-mchone.png | /team-page/jeremy-mchone.html |
| Laura Pachlin | laura-pachlin | REALTOR® | ../assets/images/agents/laura-pachlin.jpg | /team-page/laura-pachlin.html |
| Samuel Minero | samuel-minero | REALTOR® | ../assets/images/agents/samuel-minero.jpg | /team-page/samuel-minero.html |
| Jim Stengel | jim-stengel | REALTOR® | ../assets/images/agents/jim-stengel.jpg | /team-page/jim-stengel.html |
| Brandon Khieu | brandon-khieu | REALTOR® | ../assets/images/agents/brandon-khieu.jpg | /team-page/brandon-khieu.html |
| Mona Hassan | mona-hassan | REALTOR® | ../assets/images/agents/mona-hassan.jpg | /team-page/mona-hassan.html |
| Kirsten Blessum | kirsten-blessum | REALTOR® | ../assets/images/agents/kirsten-blessum.jpg | /team-page/kirsten-blessum.html |
| Wally Dally | wally-dally | REALTOR® | ../assets/images/agents/wally-dally.png | /team-page/wally-dally.html |
| Devyn Iglehart | devyn-iglehart | REALTOR® | ../assets/images/agents/devyn-iglehart.jpg | /team-page/devyn-iglehart.html |
| Chris Nguyen | chris-nguyen | REALTOR® | ../assets/images/agents/chris-nguyen.jpg | /team-page/chris-nguyen.html |
| Jared Lawrence | jared-lawrence | REALTOR® | ../assets/images/agents/jared-lawrence.jpg | /team-page/jared-lawrence.html |
| Jonathan Cohen-Kurzrock | jonathan-cohen-kurzrock | REALTOR® | ../assets/images/agents/jonathan-cohen-kurzrock.png | /team-page/jonathan-cohen-kurzrock.html |
| Chittra Cruz | chittra-cruz | REALTOR® | ../assets/images/agents/chittra-cruz.jpg | /team-page/chittra-cruz.html |
| Kelsey Barry-Farnsworth | kelsey-barry-farnsworth | REALTOR® | ../assets/images/agents/kelsey-barry-farnsworth.jpg | /team-page/kelsey-barry-farnsworth.html |
| Edelia Eveland | edelia-eveland | REALTOR® | ../assets/images/agents/edelia-eveland.png | /team-page/edelia-eveland.html |
| Sabrina Alvarado | sabrina-alvarado | REALTOR® | ../assets/images/agents/sabrina-alvarado.jpg | /team-page/sabrina-alvarado.html |
| Andrew Lopez | andrew-lopez | REALTOR® | ../assets/images/agents/andrew-lopez.jpg | /team-page/andrew-lopez.html |
| Taylor Schunk | taylor-schunk | REALTOR® | ../assets/images/agents/taylor-schunk.jpg | /team-page/taylor-schunk.html |
| Louis Goletto | louis-goletto | REALTOR® | ../assets/images/agents/louis-goletto.png | /team-page/louis-goletto.html |
| Atzay Estrada | atzay-estrada | REALTOR® | ../assets/images/agents/atzay-estrada.jpg | /team-page/atzay-estrada.html |
| Cynthia Mayorga | cynthia-mayorga | REALTOR® | ../assets/images/agents/cynthia-mayorga.png | /team-page/cynthia-mayorga.html |
| Casie O'Donnell | casie-o-donnell | REALTOR® | ../assets/images/agents/casie-o-donnell.jpg | /team-page/casie-o-donnell.html |
| Sergio Yturralde | sergio-yturralde | REALTOR® | ../assets/images/agents/sergio-yturralde.jpg | /team-page/sergio-yturralde.html |
| Melissa Campos | melissa-campos | REALTOR® | ../assets/images/agents/melissa-campos.jpg | /team-page/melissa-campos.html |
| Emma Dearing | emma-dearing | REALTOR® | ../assets/images/agents/emma-dearing.jpg | /team-page/emma-dearing.html |
| Tristen Campanella | tristen-campanella | REALTOR® | ../assets/images/agents/tristen-campanella.png | /team-page/tristen-campanella.html |
| Rachel O'Hara | rachel-ohara | REALTOR® | ../assets/images/agents/rachel-ohara.png | /team-page/rachel-ohara.html |
| Jennifer Crosby | jennifer-crosby | REALTOR® | ../assets/images/agents/jennifer-crosby.jpg | /team-page/jennifer-crosby.html |
| Glennis Dawson | glennis-dawson | REALTOR® | ../assets/images/agents/glennis-dawson.jpg | /team-page/glennis-dawson.html |
| Gina Romeo | gina-romeo | REALTOR® | ../assets/images/agents/gina-romeo.jpg | /team-page/gina-romeo.html |
| Corinne Mauro | corinne-mauro | REALTOR® | ../assets/images/agents/corinne-mauro.jpg | /team-page/corinne-mauro.html |
| Jules Marchisio | jules-marchisio | REALTOR® | ../assets/images/agents/jules-marchisio.jpg | /team-page/jules-marchisio.html |
| Greg Lathem | greg-lathem | REALTOR® | ../assets/images/agents/greg-lathem.jpg | /team-page/greg-lathem.html |
| James McNab | james-mcnab | REALTOR® | ../assets/images/agents/james-mcnab.jpg | /team-page/james-mcnab.html |
| Jarrod Norris | jarrod-norris | REALTOR® | ../assets/images/agents/jarrod-norris.jpg | /team-page/jarrod-norris.html |
| Hannah Ohman | hannah-ohman | REALTOR® | ../assets/images/agents/hannah-ohman.png | /team-page/hannah-ohman.html |
| Katie Lussier | katie-lussier | REALTOR® | ../assets/images/agents/katie-lussier.jpg | /team-page/katie-lussier.html |
| John Verdin | john-verdin | REALTOR® | ../assets/images/agents/john-verdin.jpg | /team-page/john-verdin.html |

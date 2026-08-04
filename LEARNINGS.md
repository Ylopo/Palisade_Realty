# Palisade Realty — Content Intelligence Log

This file is automatically maintained by the content pipeline. It records weekly
learnings, approval signals, and performance data to improve future content
generation. Claude reads this entire file before generating new posts — the
pipeline should get smarter over time.

**How it works:**
- Daily research cron scores new ideas into the review queue
- Weekly digest → Hedda (or the VA) approves/defers/skips
- This file is updated periodically with what's actually working
- Every generation cycle, Claude reads this entire file first

**Signal hierarchy:**
1. Approval/skip decisions in `/admin/idea-review` (immediate signal)
2. GA4 organic sessions in the 7 days after publish (performance signal, lags by 1 week)
3. OneUp per-platform reach/engagement (pattern signal, once analytics is enabled on the OneUp category)

Note: this client has no external competitor-benchmark data feed (the source
system this was replicated from used a third-party analytics dashboard for
pattern-matching — that integration was deliberately not carried over for
Palisade Realty). Every signal below comes from this site's own approval
decisions and GA4/OneUp performance once there's enough published history to
measure.

---

## Week 1 Seed — Voice Principles + Market Context (August 2026)

This is the foundational seed. There is no performance history yet — these are
starting principles, not measured lift. Future entries (added periodically as
real performance data accumulates) will be prepended above this section.

### Voice

- Written as Hedda Parashos, Owner/President of Palisade Realty — a brokerage
  owner and San Diego market leader, not a "resident/parent/investor" persona.
  She speaks from what she sees across 100+ agent partners and thousands of
  closed transactions, not just her own deals.
- Warm, direct, knowledgeable — advice from someone who knows the market cold,
  never a sales pitch.
- Never invent statistics. Ground every number in the source research data
  provided for that post.

### San Diego Market Context

- Primary communities: Downtown San Diego, Carmel Valley, Mission Valley,
  Chula Vista, Point Loma, North Park, Coronado — plus San Diego County broadly
  (Palisade Realty also serves parts of Orange and Riverside counties).
- California is an escrow state (title/escrow officer handles closing, not
  attorneys). No Virginia-style attorney-closing content applies here.
- Disclosure-heavy state: Transfer Disclosure Statement (TDS) + Natural Hazard
  Disclosure (NHD) report are the two documents buyers most need explained.
- Mello-Roos special tax districts are a recurring point of confusion for
  buyers in newer/master-planned areas (Carmel Valley especially) — always
  worth a plain-language explanation when relevant.
- Wildfire insurance availability (CA FAIR Plan) is a live, worsening issue —
  don't shy away from it, buyers actively search for it.
- Coastal bluff erosion (La Jolla, Del Mar, Sunset Cliffs) is a real, ongoing
  local story — California Coastal Commission jurisdiction applies to any
  shoreline armoring/development discussion.
- Military presence is real but secondary to the source market this was
  replicated from: Naval Base San Diego, NAS North Island (Coronado), MCRD San
  Diego, Camp Pendleton (near North County). Include a military/PCS/VA-loan
  angle where it naturally fits, don't force it into every post.
- Proposition 19 (property-tax basis portability for 55+/disabled/disaster
  victims) is San-Diego-relevant and has no equivalent in the source market —
  worth its own explainer content.

### Instructions for Next Generation Cycle

1. There is no established topic-priority signal yet — lean on the required-
   topics registry (`lib/required-topics.ts`) to fill obvious evergreen gaps
   first (cost-to-buy/sell, closing costs, market outlook per community).
2. Always cover at least one of the 7 primary communities per week once volume
   ramps up — don't let coverage concentrate on just one or two.
3. Avoid pure seller-commission content until there's a real approval signal
   on it — start with buyer education and market-update content.
4. Flag anything that reads like it needs a licensed-attorney review (Mello-
   Roos, Coastal Commission, Prop 19) for a light human legal check before the
   first few posts on those topics go out — the content is drafted to be
   accurate but this is new subject matter for this specific pipeline.

---

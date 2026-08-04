/**
 * Required Evergreen Topics — high-performing post templates that must be
 * covered for every San Diego community Palisade Realty serves.
 *
 * The coverage system checks Sanity for existing posts matching each goal and
 * seeds gaps as IdeaCandidates so they appear on the idea-review page for
 * approval.
 *
 * Adding a new required topic: append to REQUIRED_TOPICS below.
 * Removing: remove the entry. Existing posts are unaffected.
 */

import type { ArticleCategory, IdeaAudience } from '@/lib/types'

// ─── Communities ────────────────────────────────────────────────────────────

export const SAN_DIEGO_COMMUNITIES = [
  { slug: 'san-diego',                    label: 'San Diego' },  // umbrella
  { slug: 'downtown-san-diego-real-estate', label: 'Downtown San Diego' },
  { slug: 'carmel-valley-real-estate',      label: 'Carmel Valley' },
  { slug: 'mission-valley-real-estate',     label: 'Mission Valley' },
  { slug: 'chula-vista-real-estate',        label: 'Chula Vista' },
  { slug: 'point-loma-real-estate',         label: 'Point Loma' },
  { slug: 'north-park-real-estate',         label: 'North Park' },
  { slug: 'coronado-real-estate',           label: 'Coronado' },
] as const

export type City = typeof SAN_DIEGO_COMMUNITIES[number]

// ─── Topic goal type ────────────────────────────────────────────────────────

export interface TopicGoal {
  id: string                 // unique slug, e.g. "cost-to-buy:carmel-valley-real-estate"
  topicGroup: string         // e.g. "cost-to-buy"
  title: string              // proposed post title
  category: ArticleCategory
  audiences: IdeaAudience[]
  whyItMatters: string       // for the idea-review card
  brief: string              // brief for the writer when approved
  targetKeyword: string
  cityLabel: string          // for display & match
  /** Match if a published post's title or slug contains ALL of these substrings (case-insensitive). */
  matchAllOf: string[]
}

// ─── Coastal vs inland helper (drives which climate-risk framing applies) ────

const COASTAL_SLUGS = new Set(['downtown-san-diego-real-estate', 'point-loma-real-estate', 'coronado-real-estate'])

function isCoastalCommunity(slug: string): boolean {
  return COASTAL_SLUGS.has(slug)
}

// ─── Goal generators ────────────────────────────────────────────────────────

function costToBuyGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `cost-to-buy:${c.slug}`,
    topicGroup: 'cost-to-buy',
    title: `What Does It Cost to Buy a Home in ${c.label} in 2026?`,
    category: 'cost-breakdown',
    audiences: ['buyer'],
    whyItMatters: `${c.label} buyers consistently search for total cost of buying — down payment, closing costs, inspection, taxes. This is one of the most consistently searched formats for this audience.`,
    brief: `Cover all upfront costs to buy in ${c.label}: down payment ranges by loan type (VA/FHA/conventional), closing costs, inspections, appraisal, escrow/title fees, first-year property tax estimate under Proposition 13, insurance setup. Include a summary table in the first third of the post. Use real local numbers where possible.`,
    targetKeyword: `cost to buy a home in ${c.label.toLowerCase()}`,
    cityLabel: c.label,
    matchAllOf: ['cost', 'buy', c.label],
  }))
}

function costToSellGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `cost-to-sell:${c.slug}`,
    topicGroup: 'cost-to-sell',
    title: `What Does It Cost to Sell a Home in ${c.label}?`,
    category: 'cost-breakdown',
    audiences: ['seller'],
    whyItMatters: `Sellers in ${c.label} need to know net proceeds. Covers commissions, San Diego County documentary transfer tax, prep costs, payoff coordination — searched constantly.`,
    brief: `Cover all costs to sell in ${c.label}: agent commissions (and how the new buyer-rep rules affect this), San Diego County documentary transfer tax ($1.10 per $1,000 of sale price), prep/staging, repairs, mortgage payoff, prorated property taxes. Include a net-proceeds example calculation. Summary table in first third.`,
    targetKeyword: `cost to sell a home in ${c.label.toLowerCase()}`,
    cityLabel: c.label,
    matchAllOf: ['cost', 'sell', c.label],
  }))
}

function propertyTaxBuyerGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `property-tax-buyers:${c.slug}`,
    topicGroup: 'property-tax-buyers',
    title: `How Do California Property Taxes Work for ${c.label} Home Buyers?`,
    category: 'buying-tips',
    audiences: ['buyer'],
    whyItMatters: `New buyers in ${c.label} routinely underestimate property tax in their monthly housing payment. This is a top recurring search and a credibility-builder.`,
    brief: `Explain California's Proposition 13 property tax system from a buyer perspective for ${c.label}: the 1% base rate on assessed (purchase) value, local voter-approved bonds and assessments layered on top, how reassessment works at sale, when the bill comes, how escrow/impound accounts handle it, and Mello-Roos special tax districts buyers should ask about in newer master-planned communities. Real numbers for a typical ${c.label} purchase.`,
    targetKeyword: `${c.label.toLowerCase()} property tax for buyers`,
    cityLabel: c.label,
    matchAllOf: ['property tax', 'buyer', c.label],
  }))
}

function comparisonGoals(): TopicGoal[] {
  // Pre-defined high-value pairs. Each pair generates a buyer + investor variant.
  const pairs: Array<[string, string]> = [
    ['Downtown San Diego', 'North Park'],
    ['Downtown San Diego', 'Point Loma'],
    ['Carmel Valley', 'Mission Valley'],
    ['Chula Vista', 'Coronado'],
    ['Point Loma', 'Coronado'],
  ]
  const goals: TopicGoal[] = []
  for (const [a, b] of pairs) {
    for (const audience of ['buyer', 'investor'] as const) {
      const audLabel = audience === 'buyer' ? 'Home Buyers' : 'Investors'
      goals.push({
        id: `vs:${a.toLowerCase().replace(/\s+/g, '-')}:${b.toLowerCase().replace(/\s+/g, '-')}:${audience}`,
        topicGroup: 'city-vs-city',
        title: `${a} vs ${b}: Which Is Better for ${audLabel} in 2026?`,
        category: 'community-spotlight',
        audiences: [audience as IdeaAudience],
        whyItMatters: `Direct head-to-head comparisons drive heavy organic traffic. Buyers/investors actively search "${a} vs ${b}" when narrowing options.`,
        brief: `Comparison post: ${a} vs ${b} for ${audience}s in 2026. Cover median price, price/sqft, property tax and Mello-Roos exposure, schools (for buyers) or rental yield + cap rate (for investors), commute, growth signals. End with an explicit "Best for ${audLabel}: X" conclusion — don't leave the reader to decide.`,
        targetKeyword: `${a.toLowerCase()} vs ${b.toLowerCase()}`,
        cityLabel: `${a} vs ${b}`,
        matchAllOf: [a, b, 'vs', audience],
      })
    }
  }
  return goals
}

function goodTimeToBuyGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `good-time-to-buy:${c.slug}`,
    topicGroup: 'good-time-to-buy',
    title: `Is 2026 a Good Time to Buy in ${c.label}?`,
    category: 'buying-tips',
    audiences: ['buyer'],
    whyItMatters: `Indecision content. ${c.label} buyers search this monthly. Forces a clear stance using current market data.`,
    brief: `Take a clear stance on whether 2026 is a good time to buy in ${c.label}. Use current data: median price trend, days on market, inventory, mortgage rate environment, local job/military growth signals. Address both sides honestly. End with a "Who should buy now / who should wait" segmentation.`,
    targetKeyword: `is now a good time to buy a home in ${c.label.toLowerCase()}`,
    cityLabel: c.label,
    matchAllOf: ['good time', 'buy', c.label],
  }))
}

function afterOfferAcceptedGoal(): TopicGoal {
  return {
    id: 'after-offer:california',
    topicGroup: 'after-offer',
    title: `What Happens After Your Offer Is Accepted in California?`,
    category: 'buying-tips',
    audiences: ['buyer'],
    whyItMatters: `First-time buyers in every San Diego community need this — covers acceptance through closing in California's escrow-based process. Funnel-bottom content with strong "agent who explained this clearly" credibility.`,
    brief: `Step-by-step timeline from offer acceptance to closing day in California: accepted offer → escrow opened with a neutral title/escrow officer → earnest money deposit into escrow → home inspection window → appraisal → loan underwriting → Natural Hazard Disclosure (NHD) report review → title work → final walkthrough → close of escrow. Explain that California is an escrow state (a neutral escrow/title officer handles closing, not an attorney, unlike attorney states). Numbered steps, what each step means, who does it, typical timing.`,
    targetKeyword: `what happens after offer accepted california`,
    cityLabel: 'California',
    matchAllOf: ['offer', 'accepted'],
  }
}

function wildfireEarthquakeRiskGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => {
    const coastal = isCoastalCommunity(c.slug)
    const brief = coastal
      ? `Buyer-focused guide to natural hazard risk in ${c.label}: how to read the Natural Hazard Disclosure (NHD) report for wildfire, flood, and earthquake fault zones, what California Coastal Commission jurisdiction means for any shoreline development, seawall, or bluff-armoring work on or near the property, how coastal bluff erosion (an active, visible issue in Southern California) can affect long-term value and insurability, and the CA FAIR Plan and California Earthquake Authority (CEA) coverage options every ${c.label} buyer should ask about before going under contract.`
      : `Buyer-focused guide to natural hazard risk in ${c.label}: how to read the Natural Hazard Disclosure (NHD) report for wildfire and earthquake fault zones, what a wildfire-hazard-severity-zone designation means for insurability and monthly cost, the CA FAIR Plan as an insurer-of-last-resort amid the state's growing homeowners-insurance availability crisis, California Earthquake Authority (CEA) coverage, and questions every ${c.label} buyer should ask before going under contract.`
    return {
      id: `wildfire-earthquake-risk:${c.slug}`,
      topicGroup: 'wildfire-earthquake-risk',
      title: `What Do Wildfire and Earthquake Risk Mean for Home Buyers in ${c.label}?`,
      category: 'flood-and-risk',
      audiences: ['buyer'],
      whyItMatters: `${c.label} buyers are increasingly asking about insurance availability before they ask about price. This is one of the most consistently searched formats for this audience, and the buyer-angle is currently uncovered.`,
      brief,
      targetKeyword: `${c.label.toLowerCase()} wildfire earthquake risk buyers guide`,
      cityLabel: c.label,
      matchAllOf: ['risk', 'buyer', c.label],
    }
  })
}

// ─── High-value evergreen formats ────────────────────────────────────────────

function closingCostsBuyerGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `closing-costs-buyer:${c.slug}`,
    topicGroup: 'closing-costs-buyer',
    title: `What Are the Closing Costs for Home Buyers in ${c.label}?`,
    category: 'cost-breakdown',
    audiences: ['buyer'],
    whyItMatters: `One of the most consistently searched formats for this audience. ${c.label} buyers consistently search for closing cost totals before making an offer — lender fees, title, escrow, prepaid items. A detailed local breakdown builds trust and generates early-funnel leads.`,
    brief: `Break down every closing cost a buyer pays in ${c.label}: lender origination fees, title insurance (owner + lender), escrow fees (split with seller per local custom), appraisal, home inspection, prepaid homeowners insurance, prepaid property taxes, HOA setup/transfer fees (if applicable), VA funding fee or FHA MIP if applicable. Include a sample closing cost table for a $700K and $1M purchase. Note what can be negotiated via seller concessions.`,
    targetKeyword: `closing costs for home buyers in ${c.label.toLowerCase()}`,
    cityLabel: c.label,
    matchAllOf: ['closing costs', 'buyer', c.label],
  }))
}

function closingCostsSellerGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `closing-costs-seller:${c.slug}`,
    topicGroup: 'closing-costs-seller',
    title: `How Much Are Closing Costs for Home Sellers in ${c.label}?`,
    category: 'cost-breakdown',
    audiences: ['seller'],
    whyItMatters: `One of the highest-lift format categories by consistent search volume. Sellers in ${c.label} need a clear net-proceeds picture before listing. This is the entry-point search that turns into listing appointments.`,
    brief: `Cover every closing cost a seller pays in ${c.label}: agent commissions (and how post-NAR-settlement buyer-rep agreements work), San Diego County documentary transfer tax ($1.10 per $1,000 of sale price), escrow/title fees, natural hazard disclosure report fee, HOA disclosure/transfer fee, prorated property taxes, any required repairs from inspection. Include a net-proceeds example for a $900K sale. Note the difference between "costs" and "concessions offered to buyer."`,
    targetKeyword: `closing costs for home sellers in ${c.label.toLowerCase()}`,
    cityLabel: c.label,
    matchAllOf: ['closing costs', 'seller', c.label],
  }))
}

function homeStageToSellGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `home-staging:${c.slug}`,
    topicGroup: 'home-staging',
    title: `How Do You Stage a ${c.label} Home to Sell Faster?`,
    category: 'selling-tips',
    audiences: ['seller'],
    whyItMatters: `One of the highest individual-post-lift formats by consistent search volume. Sellers actively search staging tips before listing. Positions Hedda's team as the agents who help sellers maximize value, not just list and hope.`,
    brief: `Practical staging guide for ${c.label} sellers: declutter and depersonalize priorities, curb appeal quick wins (fresh paint, drought-tolerant landscaping touch-ups), interior staging room by room (entry, living room, kitchen, primary bedroom, bathrooms), what to do with occupied furniture vs. vacant staging, photography prep, and what NOT to over-invest in before listing. Include a "Day before photos" checklist. Keep advice grounded in what ${c.label} buyers actually notice.`,
    targetKeyword: `how to stage a home in ${c.label.toLowerCase()} to sell`,
    cityLabel: c.label,
    matchAllOf: ['stage', 'sell', c.label],
  }))
}

function marketOutlookGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `market-outlook:${c.slug}`,
    topicGroup: 'market-outlook',
    title: `What's the 2026 Housing Market Outlook for ${c.label}?`,
    category: 'market-update',
    audiences: ['buyer', 'seller'],
    whyItMatters: `One of the most consistently searched formats for this audience. Buyers and sellers both search this before acting. Sets Hedda's team as the go-to local market authority and drives search intent at the top of the decision funnel.`,
    brief: `Cover the current ${c.label} market conditions and 2026 outlook: median home prices (current and trend), inventory levels (months of supply), days on market, list-to-sale price ratio, mortgage rate impact on buyer demand, local military/employment/biotech drivers (mention specific bases or employers), any new development or infrastructure projects affecting values. End with a clear verdict: is 2026 a buyer's market, seller's market, or neutral? Include a "What this means if you're buying" and "What this means if you're selling" section.`,
    targetKeyword: `${c.label.toLowerCase()} housing market outlook 2026`,
    cityLabel: c.label,
    matchAllOf: ['outlook', '2026', c.label],
  }))
}

function risksOfWaitingGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `risks-of-waiting:${c.slug}`,
    topicGroup: 'risks-of-waiting',
    title: `What Are the Real Risks of Waiting to Buy in ${c.label}?`,
    category: 'buying-tips',
    audiences: ['buyer'],
    whyItMatters: `Fence-sitters search this constantly. A concrete, data-driven answer to "should I wait?" positions Hedda's team as an honest advisor rather than a pushy agent, and converts hesitant leads.`,
    brief: `Address the "I'll wait until rates drop / prices fall" objection head-on for ${c.label}. Cover: what historical price appreciation in ${c.label} looks like (data-driven), how the cost of waiting one year compounds across a typical mortgage, local inventory dynamics and whether waiting means less choice, the lock-in dilemma (when you can refinance, when you can't), who should legitimately wait vs. who is losing equity by waiting. Be balanced and honest — include "valid reasons to wait" alongside the risks.`,
    targetKeyword: `risks of waiting to buy a home in ${c.label.toLowerCase()}`,
    cityLabel: c.label,
    matchAllOf: ['risk', 'wait', 'buy', c.label],
  }))
}

function relocateCostGoals(): TopicGoal[] {
  const relocateCities = SAN_DIEGO_COMMUNITIES.filter((c) =>
    ['san-diego', 'coronado-real-estate', 'point-loma-real-estate'].includes(c.slug)
  )
  return relocateCities.map((c) => ({
    id: `relocation-cost:${c.slug}`,
    topicGroup: 'relocation-cost',
    title: `What Does It Really Cost to Relocate to ${c.label}?`,
    category: 'cost-breakdown',
    audiences: ['buyer'],
    whyItMatters: `San Diego is a major military relocation hub — PCS orders, DITY moves, BAH rates for Naval Base San Diego, NAS North Island, MCRD San Diego, and Camp Pendleton. This topic captures both military and civilian relocators searching total move costs before committing.`,
    brief: `Full relocation cost breakdown for someone moving to ${c.label}: moving company estimates (local vs. long-distance), storage costs, temporary housing (30-60 day range), VA home loan vs. conventional for relocators, BAH rates relevant to Naval Base San Diego / NAS North Island / MCRD San Diego / Camp Pendleton (if military-focused), realtor timeline from PCS orders to keys, California state income tax considerations, cost of living index vs. national average, first-year homeownership costs to budget for. Frame as both a military PCS guide and a civilian relocation guide.`,
    targetKeyword: `cost to relocate to ${c.label.toLowerCase()}`,
    cityLabel: c.label,
    matchAllOf: ['relocat', 'cost', c.label],
  }))
}

function buyingVsRentingGoals(): TopicGoal[] {
  return SAN_DIEGO_COMMUNITIES.map((c) => ({
    id: `buy-vs-rent:${c.slug}`,
    topicGroup: 'buy-vs-rent',
    title: `Is Buying or Renting in ${c.label} Smarter in 2026?`,
    category: 'buying-tips',
    audiences: ['buyer'],
    whyItMatters: `High evergreen search volume. Fence-sitters run this calculation constantly. A real answer with current ${c.label} numbers — rent costs, purchase prices, break-even horizon — outperforms vague "it depends" blog posts and drives direct inquiries.`,
    brief: `Run a real buy vs. rent calculation for ${c.label} in 2026: current median rent for a 2BR/3BR, current median purchase price, estimated monthly PITI at current rates, break-even point in years (factoring appreciation and rent increases), equity build over 5 and 10 years, scenarios where renting wins (short time horizon, waiting for relocation orders, high-cost market), scenarios where buying wins (long-term plans, equity capture, stable income). Include a simple comparison table. Give a clear recommendation for the average ${c.label} resident.`,
    targetKeyword: `buying vs renting in ${c.label.toLowerCase()} 2026`,
    cityLabel: c.label,
    matchAllOf: ['buy', 'rent', c.label],
  }))
}

// ─── One-off California transaction goals ───────────────────────────────────
// Replaces the source repo's virginia-specific transaction goals with the
// California-specific equivalents: escrow-state process, TDS/NHD disclosure,
// Davis-Stirling HOA law, Mello-Roos, Proposition 19, Coastal Commission
// jurisdiction, wildfire/earthquake insurance, and assumable VA loans.

function californiaTransactionGoals(): TopicGoal[] {
  return [
    {
      id: 'tds-nhd:california',
      topicGroup: 'tds-nhd',
      title: 'What Is a California Transfer Disclosure Statement (TDS) and NHD Report?',
      category: 'buying-tips',
      audiences: ['buyer', 'seller'],
      whyItMatters: `California requires far more seller disclosure than most states, and both buyers and sellers are confused about what the TDS and NHD actually cover. Clear guidance here reduces anxiety and speeds up escrow.`,
      brief: `Explain the two core California disclosure documents: the Transfer Disclosure Statement (TDS) — a seller's sworn statement of known material defects and property condition — and the Natural Hazard Disclosure (NHD) report — a third-party report on wildfire zone, flood zone, earthquake fault zone, and other statutory hazard designations. Cover who prepares each, when in escrow they're delivered, what a buyer's rescission rights look like after receiving them, and common mistakes sellers make (under-disclosing known issues vs. relying solely on the NHD report for hazard disclosure).`,
      targetKeyword: 'california transfer disclosure statement NHD report explained',
      cityLabel: 'California',
      matchAllOf: ['disclosure', 'california'],
    },
    {
      id: 'rpa-contingencies:california',
      topicGroup: 'rpa-contingencies',
      title: 'What Are the Contingencies in a California Residential Purchase Agreement (RPA)?',
      category: 'buying-tips',
      audiences: ['buyer'],
      whyItMatters: `Buyers don't fully understand what the CAR Residential Purchase Agreement's contingencies protect them from or how waiving them affects risk. Understanding this is the difference between a confident buyer and a paralyzed one.`,
      brief: `Explain every major contingency in the CAR (California Association of Realtors) standard Residential Purchase Agreement (RPA): loan contingency, appraisal contingency, investigation/inspection contingency, and the interplay between them. Cover the standard contingency removal timelines, what "active" vs "passive" contingency removal means under the RPA, and the real risk of waiving contingencies in a competitive San Diego market. Explain what happens to earnest money at each stage.`,
      targetKeyword: 'contingencies in a california purchase agreement',
      cityLabel: 'California',
      matchAllOf: ['contingencies', 'california'],
    },
    {
      id: 'earnest-money:california',
      topicGroup: 'earnest-money',
      title: 'How Does Earnest Money Work in California Real Estate?',
      category: 'buying-tips',
      audiences: ['buyer'],
      whyItMatters: `First-time buyers are confused about earnest money — how much, when it's at risk, how to protect it. A clear guide reduces anxiety and builds confidence in the process.`,
      brief: `Cover earnest money (initial deposit) for California buyers: typical amounts in San Diego (% of purchase price), who holds it and where (a neutral escrow company — not the seller or either agent), when you can get it back (within active contingency periods under the RPA), when you risk losing it (after contingencies are removed and you default), how it's applied at close of escrow, and what "non-refundable deposit" clauses can mean in competitive offers. Use a timeline showing when each contingency deadline affects the deposit.`,
      targetKeyword: 'how does earnest money work california',
      cityLabel: 'California',
      matchAllOf: ['earnest money', 'california'],
    },
    {
      id: 'seller-net-sheet:california',
      topicGroup: 'seller-net-sheet',
      title: 'What Is a Seller Net Sheet in California Real Estate?',
      category: 'selling-tips',
      audiences: ['seller'],
      whyItMatters: `Every seller's first question is "what will I walk away with?" A clear explanation of the net sheet builds trust before a listing appointment and positions Hedda's team as the transparent, numbers-first brokerage.`,
      brief: `Explain what a seller net sheet is and how to read one in California: what it calculates (gross sale price minus all costs = net proceeds), every line item included (commission, San Diego County documentary transfer tax, escrow and title fees, payoff amount, prorated property taxes, any HOA transfer fees, any seller concessions), how to use it to compare listing price scenarios, why the net sheet is an estimate (not a guarantee), how the final closing/settlement statement differs from the estimate, and how Hedda's team prepares a net sheet at every listing presentation for San Diego sellers.`,
      targetKeyword: 'seller net sheet california real estate',
      cityLabel: 'California',
      matchAllOf: ['seller net sheet', 'california'],
    },
    {
      id: 'real-estate-commissions:california',
      topicGroup: 'real-estate-commissions',
      title: 'What Do Sellers Pay in California Real Estate Commissions in 2026?',
      category: 'selling-tips',
      audiences: ['seller'],
      whyItMatters: `Post-NAR settlement, commission structure changed significantly — sellers need clarity on what they actually owe and to whom. This is a top listing-appointment driver.`,
      brief: `Explain how real estate commissions work in California post-NAR settlement (August 2024 changes): sellers no longer automatically pay buyer-agent compensation through the MLS, how buyer-rep agreements work now, what the "decoupled" commission model means for San Diego sellers, typical listing fee ranges, how commission is negotiated (and what you get at different price points), the difference between discount brokers and full-service, and how seller concessions can be used to help buyers cover their agent fees. Be transparent and fair — this post should serve as a pre-listing consultation primer.`,
      targetKeyword: 'california real estate commission for sellers 2026',
      cityLabel: 'California',
      matchAllOf: ['commission', 'seller', 'california'],
    },
    {
      id: 'capital-gains:california',
      topicGroup: 'capital-gains',
      title: 'How Does Capital Gains Tax Work When Selling a Home in California?',
      category: 'selling-tips',
      audiences: ['seller', 'homeowner'],
      whyItMatters: `Sellers who have owned their home for years, especially in an appreciating market like San Diego, often have substantial gains and are anxious about taxes. Clear guidance here is a pre-listing credibility builder.`,
      brief: `Explain federal capital gains rules for California home sellers: the $250K/$500K primary residence exclusion, the 2-of-5-year ownership and use test, what counts as "improvements" to your cost basis, short-term vs. long-term capital gains tax rates. Then explain the California-specific wrinkle: California taxes capital gains as ordinary income at the state level — there is no separate, lower state capital-gains rate the way there is federally. Include a simple calculation example for a San Diego homeowner who bought years ago and is sitting on significant appreciation.`,
      targetKeyword: 'capital gains tax selling home california',
      cityLabel: 'California',
      matchAllOf: ['capital gains', 'california'],
    },
    {
      id: 'prop-19:california',
      topicGroup: 'prop-19',
      title: 'How Does Proposition 19 Let San Diego Homeowners Transfer Their Property Tax Basis?',
      category: 'selling-tips',
      audiences: ['seller', 'homeowner', 'buyer'],
      whyItMatters: `Long-time San Diego homeowners sitting on a low Prop 13 tax basis are often the most hesitant to sell and move, fearing a huge property tax jump. Prop 19 directly addresses this and is one of the highest-value, least-understood topics for this audience.`,
      brief: `Explain California Proposition 19 (which replaced the older Prop 60/90): homeowners who are 55+, severely disabled, or victims of a wildfire or other declared disaster can transfer their existing property tax assessed value to a new home anywhere in California, up to three times, even if the new home costs more (with a partial adjustment upward). Cover eligibility requirements, the deadlines to file the claim with the County Assessor, how this changes the buy-vs-stay calculus for a longtime San Diego homeowner in a home that's outgrown their needs, and how this interacts with the current wildfire-risk environment for disaster victims specifically.`,
      targetKeyword: 'proposition 19 property tax transfer san diego',
      cityLabel: 'California',
      matchAllOf: ['proposition 19', 'california'],
    },
    {
      id: 'davis-stirling-hoa:california',
      topicGroup: 'davis-stirling-hoa',
      title: 'How Does the Davis-Stirling Act Govern HOAs in San Diego?',
      category: 'buying-tips',
      audiences: ['buyer'],
      whyItMatters: `Buyers in condo and planned communities across San Diego routinely underestimate what governs their HOA and what documents they're entitled to review. A transparent guide prevents surprises after close of escrow.`,
      brief: `Explain California's Davis-Stirling Common Interest Development Act: what it requires HOAs to disclose to prospective buyers (CC&Rs, budget, reserve study, meeting minutes, pending litigation), the buyer's statutory review period for HOA documents, what typically shows up in HOA fees across San Diego condo and planned communities, how to evaluate reserve fund health and spot a special-assessment risk, and rental restriction rules that can affect investor buyers. Include a "what to request and review before removing contingencies" checklist.`,
      targetKeyword: 'davis-stirling act HOA san diego buyers',
      cityLabel: 'California',
      matchAllOf: ['davis-stirling', 'hoa'],
    },
    {
      id: 'mello-roos:san-diego',
      topicGroup: 'mello-roos',
      title: 'What Is a Mello-Roos Tax and Why Does It Matter in Carmel Valley?',
      category: 'buying-tips',
      audiences: ['buyer'],
      whyItMatters: `Buyers looking at newer master-planned San Diego communities like Carmel Valley are frequently blindsided by a Mello-Roos line item on their tax bill that has no equivalent anywhere else in the country. This is a high-value, California-specific education topic.`,
      brief: `Explain Mello-Roos special tax districts: what they are (a special tax district created to fund infrastructure — schools, roads, parks — in newer master-planned communities, layered on top of the standard Prop 13 1% base rate), why they're common in newer developments like Carmel Valley, how to find out if a specific property carries a Mello-Roos assessment (the property's tax bill or a title report), typical additional annual cost, how long the assessment typically lasts before it's paid off, and how to factor it into a real monthly housing payment comparison against an older, non-Mello-Roos neighborhood.`,
      targetKeyword: 'mello-roos tax carmel valley san diego',
      cityLabel: 'Carmel Valley',
      matchAllOf: ['mello-roos'],
    },
    {
      id: 'coastal-commission:san-diego',
      topicGroup: 'coastal-commission',
      title: 'What Does California Coastal Commission Jurisdiction Mean for San Diego Buyers?',
      category: 'buying-tips',
      audiences: ['buyer', 'homeowner'],
      whyItMatters: `Buyers looking at bluff-top or shoreline-adjacent property near Point Loma, Coronado, and the broader San Diego coast are often unaware that a separate state agency — not the city — controls what they can build or repair. This is a high-differentiation topic for coastal buyers.`,
      brief: `Explain the California Coastal Commission's role in San Diego coastal real estate: what triggers Coastal Commission review (shoreline development, seawalls, bluff armoring, major remodels within the coastal zone), how this differs from standard city permitting, why coastal bluff erosion (an active, visible issue up and down Southern California, including areas adjacent to San Diego) makes this relevant even for existing homes, what a Coastal Development Permit process and timeline typically look like, and questions a buyer should ask before purchasing a coastal-zone property about existing permits, prior violations, or pending bluff-stabilization needs.`,
      targetKeyword: 'california coastal commission san diego property buyers',
      cityLabel: 'San Diego',
      matchAllOf: ['coastal commission'],
    },
    {
      id: 'wildfire-insurance-fair-plan:california',
      topicGroup: 'wildfire-insurance-fair-plan',
      title: 'How Does Wildfire Insurance and the CA FAIR Plan Work for San Diego Homeowners?',
      category: 'flood-and-risk',
      audiences: ['buyer', 'homeowner'],
      whyItMatters: `Insurance availability has become one of the top concerns for California homebuyers as major carriers pull back from wildfire-exposed areas. Explaining the FAIR Plan clearly is now essential pre-purchase education.`,
      brief: `Cover wildfire insurance for San Diego buyers and homeowners: how a wildfire-hazard-severity-zone designation affects standard homeowners insurance availability and cost, why some major carriers have pulled back from writing new policies in higher-risk zones statewide, what the California FAIR Plan is (the state's insurer-of-last-resort program) and how it differs from standard coverage (coverage limits, what it does and doesn't cover, typical premium ranges), the role of a "wrap" or difference-in-conditions policy to supplement FAIR Plan coverage, and steps a homeowner can take (defensible space, home-hardening) that may improve insurability over time. Note this is a growing statewide crisis, not a one-time rate hike.`,
      targetKeyword: 'wildfire insurance FAIR plan san diego homeowners',
      cityLabel: 'California',
      matchAllOf: ['wildfire', 'insurance'],
    },
    {
      id: 'earthquake-insurance-cea:california',
      topicGroup: 'earthquake-insurance-cea',
      title: 'Do San Diego Homeowners Need Earthquake Insurance Through the CEA?',
      category: 'flood-and-risk',
      audiences: ['buyer', 'homeowner'],
      whyItMatters: `Standard homeowners insurance in California does not cover earthquake damage, and most buyers don't learn this until after they've closed. This is an under-covered but high-value education topic.`,
      brief: `Explain earthquake insurance for San Diego buyers and homeowners: why standard homeowners policies exclude earthquake damage entirely, what the California Earthquake Authority (CEA) is and how CEA policies are priced (deductible options, typical premium ranges, coverage for the dwelling vs. personal property vs. loss-of-use), how San Diego's seismic risk compares to other parts of California, and how to weigh the cost of a CEA policy against the (generally lower, but non-zero) probability of major seismic damage in San Diego specifically. Give a buyer a clear framework for deciding whether to carry it.`,
      targetKeyword: 'earthquake insurance CEA san diego',
      cityLabel: 'California',
      matchAllOf: ['earthquake insurance'],
    },
    {
      id: 'escrow-closing-process:california',
      topicGroup: 'escrow-closing-process',
      title: 'What Happens at a California Escrow Closing?',
      category: 'buying-tips',
      audiences: ['buyer', 'seller'],
      whyItMatters: `First-time buyers and sellers search this before every closing. A comprehensive guide demystifies the most intimidating part of the transaction and reduces anxiety-driven delays.`,
      brief: `Walk through a California real estate closing step by step: who's involved (buyer, seller, neutral escrow officer, title company — California is an escrow state, so a title/escrow officer handles closing, not an attorney, which surprises buyers relocating from attorney states like Virginia or New York), what documents buyers sign (deed of trust, promissory note, closing disclosure, title insurance, escrow instructions), what sellers sign (grant deed, closing statement), how funds are transferred (wire to escrow, lender funding), when the deed records with the County Recorder, keys and possession logistics, and what to bring to the final signing. Include a "Day before closing checklist."`,
      targetKeyword: 'what happens at closing in california real estate',
      cityLabel: 'California',
      matchAllOf: ['closing', 'escrow', 'california'],
    },
    {
      id: 'appraisal-competitive-market:san-diego',
      topicGroup: 'appraisal-competitive-market',
      title: 'What Do San Diego Buyers Need to Know About Appraisals in a Competitive Market?',
      category: 'buying-tips',
      audiences: ['buyer'],
      whyItMatters: `Buyers routinely confuse appraisal with inspection, don't understand how appraisal gaps work, and don't know their options if the appraisal comes in low in a competitive coastal market. This is a high-anxiety topic that drives early-stage buyer engagement.`,
      brief: `Explain the appraisal process for San Diego buyers: what appraisers look for and how they select comparables in a market with wide price variation between neighborhoods, how the appraised value affects your loan (LTV ratio, loan amount caps), what happens when appraisal = purchase price vs. when it comes in low in a bidding-war scenario, buyer's options on a low appraisal (renegotiate, appraisal gap coverage clause, challenge the value, walk away), who orders and pays for the appraisal, and VA appraisal specifics for military buyers near San Diego's bases. Include a timeline of when appraisal happens in the escrow process.`,
      targetKeyword: 'home appraisal for buyers san diego competitive market',
      cityLabel: 'San Diego',
      matchAllOf: ['appraisal', 'buyer'],
    },
    {
      id: 'assumable-va-loans:san-diego',
      topicGroup: 'assumable-va-loans',
      title: 'How Do Assumable VA Loans Work for Military Buyers Near San Diego’s Bases?',
      category: 'financing',
      audiences: ['buyer', 'seller'],
      whyItMatters: `With Naval Base San Diego, NAS North Island, MCRD San Diego, and nearby Camp Pendleton driving a huge population of active-duty and veteran homeowners, San Diego has an unusually large pool of assumable VA loans. This is a high-differentiation topic for the market.`,
      brief: `Explain assumable mortgages for San Diego buyers and sellers: what loan types are assumable (VA, FHA, USDA — not conventional), why a low-rate VA assumable loan is enormously valuable in a higher-rate environment, how the assumption process works (lender qualification, entitlement restoration for the seller, timeline), the risks for the seller (entitlement tied up until the buyer pays off the loan or refinances), how to find assumable listings near San Diego's military communities, and what to offer a seller to compensate for their low rate. Include real examples showing the monthly payment difference.`,
      targetKeyword: 'assumable VA loans san diego military buyers',
      cityLabel: 'San Diego',
      matchAllOf: ['assumable', 'va loan'],
    },
    {
      id: 'home-inspection-report:california',
      topicGroup: 'home-inspection-report',
      title: 'How Do You Read a California Home Inspection Report?',
      category: 'buying-tips',
      audiences: ['buyer'],
      whyItMatters: `First-time buyers are intimidated by inspection reports. A clear guide demystifying what the inspector flags, what matters vs. what's cosmetic, and how to negotiate repairs turns a scary document into a confident close of escrow.`,
      brief: `Walk a buyer through a California home inspection report: what's covered (structure, roof, HVAC, plumbing, electrical, foundation, insulation), how inspectors rate issues (safety hazard vs. deferred maintenance vs. informational), which items are red flags that could kill a deal vs. normal wear-and-tear, how the report interacts with the buyer's investigation contingency under the CAR RPA, how to use the report to negotiate seller repairs or a price/credit adjustment, and California-specific items (termite/wood-destroying pest inspection, sewer lateral inspection common in older San Diego neighborhoods, chimney inspection). Include a sample "negotiation priority list" format.`,
      targetKeyword: 'how to read a home inspection report california',
      cityLabel: 'California',
      matchAllOf: ['home inspection', 'report'],
    },
    {
      id: 'repairs-after-inspection:california',
      topicGroup: 'repairs-after-inspection',
      title: 'How Do You Handle Repairs After a Home Inspection in California?',
      category: 'buying-tips',
      audiences: ['buyer', 'seller'],
      whyItMatters: `The negotiation after the inspection is where most deals fall apart or get rescued. A clear guide on how California buyers make repair requests — and what sellers should and shouldn't agree to — is essential for both sides.`,
      brief: `Walk through the repair negotiation process in California: how a buyer requests repairs, credits, or a price reduction under the RPA's investigation contingency, what sellers can agree to vs. refuse, the difference between a repair, a credit, and a price reduction (and when each makes sense in escrow), which inspection items are worth negotiating hard vs. accepting, how to handle major vs. minor repairs, and what happens when parties can't agree (contingency removal deadlines, cancellation rights, return of earnest money deposit). Include Hedda's team's approach to keeping deals together through this stage.`,
      targetKeyword: 'repairs after home inspection california',
      cityLabel: 'California',
      matchAllOf: ['repairs', 'inspection', 'california'],
    },
    {
      id: 'buyer-back-out:california',
      topicGroup: 'buyer-back-out',
      title: 'Can a Buyer Back Out of a Real Estate Contract in California?',
      category: 'buying-tips',
      audiences: ['buyer'],
      whyItMatters: `Buyers research their rights before making offers. This is a high-urgency, late-stage search that consistently drives strong engagement.`,
      brief: `Explain California buyer cancellation rights: yes, buyers can back out — but when, how, and with what consequences. Cover: canceling during an active contingency period (loan, appraisal, investigation) with full deposit protection, how to properly cancel to get the earnest money deposit back, what happens to the deposit if a buyer cancels after removing contingencies without cause, what "liquidated damages" clauses in the RPA can mean for the seller's remedy, and how the escrow company processes a cancellation and deposit return. Use a "safe exit" timeline showing when each cancellation right expires.`,
      targetKeyword: 'can a buyer back out of real estate contract in california',
      cityLabel: 'California',
      matchAllOf: ['buyer', 'back out', 'california'],
    },
  ]
}

// ─── Full registry ──────────────────────────────────────────────────────────

export const REQUIRED_TOPICS: TopicGoal[] = [
  // Original evergreen templates
  ...costToBuyGoals(),
  ...costToSellGoals(),
  ...propertyTaxBuyerGoals(),
  ...comparisonGoals(),
  ...goodTimeToBuyGoals(),
  afterOfferAcceptedGoal(),
  ...wildfireEarthquakeRiskGoals(),
  // High-value evergreen formats (adapted for San Diego)
  ...closingCostsBuyerGoals(),
  ...closingCostsSellerGoals(),
  ...homeStageToSellGoals(),
  ...marketOutlookGoals(),
  ...risksOfWaitingGoals(),
  ...relocateCostGoals(),
  ...buyingVsRentingGoals(),
  // California / San Diego one-off transaction goals
  ...californiaTransactionGoals(),
]

// ─── Match logic ────────────────────────────────────────────────────────────

/** Returns true if a Sanity post covers this goal (title OR slug contains all match strings). */
export function postMatchesGoal(
  post: { title: string; slug: string },
  goal: TopicGoal,
): boolean {
  const haystack = `${post.title} ${post.slug}`.toLowerCase()
  return goal.matchAllOf.every((needle) => haystack.includes(needle.toLowerCase()))
}

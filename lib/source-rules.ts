/**
 * lib/source-rules.ts
 *
 * Classifies article sources by domain into credibility tiers.
 * Used by the idea scoring engine to assign sourceCredibility (0–10)
 * and to hard-disqualify low-trust sources before they reach the review queue.
 */

export type SourceType =
  | 'local-news'          // San Diego Union-Tribune, KPBS, NBC 7, etc.
  | 'local-government'    // sandiego.gov, sandiegocounty.gov, chulavistaca.gov, etc.
  | 'state-government'    // ca.gov, dre.ca.gov, coastal.ca.gov, etc.
  | 'federal-government'  // fema.gov, hud.gov, census.gov, etc.
  | 'military'            // navy.mil, cnic.navy.mil, marines.mil, etc.
  | 'national-outlet'     // wsj.com, bloomberg.com, nytimes.com, etc.
  | 'market-data'         // redfin.com, zillow.com, nar.realtor, etc.
  | 'real-estate-assoc'   // sdar.com, car.org, etc.
  | 'generic-re-site'     // inman.com, realtor.com, houselogic.com (when not data)
  | 'agent-blog'          // Individual agent or team blog
  | 'content-farm'        // Sites producing bulk low-quality RE content
  | 'unknown'

// ─── Trusted local news ───────────────────────────────────────────────────────

const LOCAL_NEWS_DOMAINS = new Set([
  'sandiegouniontribune.com',
  'kpbs.org',
  'nbcsandiego.com',
  '10news.com',
  'cbs8.com',
  'fox5sandiego.com',
  'timesofsandiego.com',
  'sandiegoreader.com',
  'sandiegomagazine.com',
  'voiceofsandiego.org',
  'lajollalight.com',
  'delmartimes.net',
  'coronadotimes.com',
  'ranchosantafereview.com',
  'sandiegobusinessjournal.com',
  'sdnews.com',
])

// ─── Local government ─────────────────────────────────────────────────────────

const LOCAL_GOV_DOMAINS = new Set([
  'sandiego.gov',
  'sandiegocounty.gov',
  'chulavistaca.gov',
  'coronado.ca.us',
  'portofsandiego.org',
  'sdcda.org',
  'sandag.org',
])

// ─── State government ─────────────────────────────────────────────────────────

const STATE_GOV_DOMAINS = new Set([
  'ca.gov',
  'gov.ca.gov',
  'dre.ca.gov',       // Dept of Real Estate
  'coastal.ca.gov',   // California Coastal Commission
  'insurance.ca.gov', // CDI / CA FAIR Plan oversight
  'boe.ca.gov',
  'ftb.ca.gov',       // Franchise Tax Board
  'sco.ca.gov',
  'hcd.ca.gov',
  'dinsurance.ca.gov',
  'earthquakeauthority.com', // California Earthquake Authority (CEA)
])

// ─── Federal government ───────────────────────────────────────────────────────

const FEDERAL_GOV_DOMAINS = new Set([
  'fema.gov',
  'hud.gov',
  'va.gov',
  'census.gov',
  'irs.gov',
  'freddiemac.com',
  'fanniemae.com',
  'cfpb.gov',
  'federalreserve.gov',
  'bls.gov',
  'commerce.gov',
])

// ─── Military ─────────────────────────────────────────────────────────────────

const MILITARY_DOMAINS = new Set([
  'navy.mil',
  'af.mil',
  'army.mil',
  'marines.mil',
  'cnic.navy.mil',      // Naval Base San Diego / NAS North Island
  'public.navy.mil',
  'pendleton.marines.mil', // Camp Pendleton
  'militarytimes.com',
  'stripes.com',
  'navytimes.com',
  'marinecorpstimes.com',
  'dod.gov',
  'defense.gov',
])

// ─── Trusted national outlets ─────────────────────────────────────────────────

const NATIONAL_OUTLET_DOMAINS = new Set([
  'wsj.com',
  'bloomberg.com',
  'reuters.com',
  'apnews.com',
  'nytimes.com',
  'washingtonpost.com',
  'cnbc.com',
  'marketwatch.com',
  'fortune.com',
  'businessinsider.com',
  'theatlantic.com',
  'axios.com',
  'npr.org',
  'pbs.org',
  'politico.com',
  'usatoday.com',
])

// ─── Market data / real estate data providers ─────────────────────────────────

const MARKET_DATA_DOMAINS = new Set([
  'altosresearch.com',
  'redfin.com',
  'zillow.com',
  'trulia.com',
  'corelogic.com',
  'attomdata.com',
  'blackknightinc.com',
  'mba.org',             // Mortgage Bankers Association
  'nar.realtor',
  'housingwire.com',
  'firstam.com',
  'rismedia.com',
])

// ─── Real estate associations ─────────────────────────────────────────────────

const REALTORS_ASSOC_DOMAINS = new Set([
  'sdar.com',    // San Diego Association of Realtors
  'car.org',     // California Association of Realtors
  'nar.realtor',
  'realtor.org',
])

// ─── Generic real estate sites (low value, not disqualified) ─────────────────

const GENERIC_RE_DOMAINS = new Set([
  'realtor.com',
  'homes.com',
  'houselogic.com',
  'inman.com',
  'rismedia.com',
  'propertywire.com',
  'realestaterama.com',
])

// ─── Hard-disqualified: content farms + agent blogs ───────────────────────────
// These are filtered out before scoring. Add to this list as new ones appear.

const DISQUALIFIED_DOMAINS = new Set([
  // Content farms
  'realtytimes.com',
  'realtytoday.com',
  'agentadvice.com',
  'theclose.com',
  'keepingcurrentmatters.com',  // produces syndicated "tips" used by thousands of agents
  'placester.com',
  'curaytor.com',
  'homesnap.com',
  'contactually.com',
  'buffiniandcompany.com',
  'tomferry.com',
  'outboundengine.com',
  // Generic advice / low credibility
  'wikihow.com',
  'ehow.com',
  'hunker.com',
  'thespruce.com',   // only if RE-adjacent, not decor context
])

// ─── Pattern-based agent blog detection ───────────────────────────────────────
// Domains that look like individual agent/team blogs even if not in the list above.

const AGENT_BLOG_PATTERNS = [
  /yoursandiegoagent/i,
  /youragentname/i,
  /yourfriendlyagent/i,
  /palisaderealty/i, // our own site — never self-cite as a source
]

// ─── Public API ───────────────────────────────────────────────────────────────

export function classifySource(domain: string): SourceType {
  const d = domain.toLowerCase().replace(/^www\./, '')

  if (LOCAL_NEWS_DOMAINS.has(d)) return 'local-news'
  if (LOCAL_GOV_DOMAINS.has(d)) return 'local-government'
  if (STATE_GOV_DOMAINS.has(d) || d.endsWith('.ca.gov')) return 'state-government'
  if (FEDERAL_GOV_DOMAINS.has(d) || d.endsWith('.gov') || d.endsWith('.mil')) return 'federal-government'
  if (MILITARY_DOMAINS.has(d) || d.endsWith('.mil')) return 'military'
  if (NATIONAL_OUTLET_DOMAINS.has(d)) return 'national-outlet'
  if (MARKET_DATA_DOMAINS.has(d)) return 'market-data'
  if (REALTORS_ASSOC_DOMAINS.has(d)) return 'real-estate-assoc'
  if (GENERIC_RE_DOMAINS.has(d)) return 'generic-re-site'
  if (DISQUALIFIED_DOMAINS.has(d)) return 'content-farm'
  if (AGENT_BLOG_PATTERNS.some((p) => p.test(d))) return 'agent-blog'

  return 'unknown'
}

export function isDisqualified(domain: string): boolean {
  const d = domain.toLowerCase().replace(/^www\./, '')
  if (DISQUALIFIED_DOMAINS.has(d)) return true
  if (AGENT_BLOG_PATTERNS.some((p) => p.test(d))) return true
  return false
}

export function sourceCredibilityScore(domain: string): number {
  const type = classifySource(domain)
  switch (type) {
    case 'local-news':        return 9
    case 'local-government':  return 10
    case 'state-government':  return 10
    case 'federal-government':return 9
    case 'military':          return 9
    case 'national-outlet':   return 7
    case 'market-data':       return 8
    case 'real-estate-assoc': return 7
    case 'generic-re-site':   return 4
    case 'agent-blog':        return 1
    case 'content-farm':      return 0
    case 'unknown':           return 4
  }
}

export function sourceTypeLabel(domain: string): string {
  const type = classifySource(domain)
  switch (type) {
    case 'local-news':        return 'Local News'
    case 'local-government':  return 'Local Government'
    case 'state-government':  return 'State Government'
    case 'federal-government':return 'Federal Government'
    case 'military':          return 'Military / Defense'
    case 'national-outlet':   return 'National Outlet'
    case 'market-data':       return 'Market Data'
    case 'real-estate-assoc': return 'RE Association'
    case 'generic-re-site':   return 'Real Estate Site'
    case 'agent-blog':        return 'Agent Blog'
    case 'content-farm':      return 'Low Quality'
    case 'unknown':           return 'Web'
  }
}

/** Credibility modifier to add on top of other scores. */
export function sourceBonus(domain: string): number {
  const type = classifySource(domain)
  switch (type) {
    case 'local-news':        return 5
    case 'local-government':  return 5
    case 'state-government':  return 5
    case 'federal-government':return 5
    case 'military':          return 5
    case 'national-outlet':   return 3
    case 'market-data':       return 3
    case 'real-estate-assoc': return 2
    default:                  return 0
  }
}

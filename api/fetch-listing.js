// Fetches a Ylopo listing page and extracts structured data.
// Extraction layers (in order):
//   0a. __NEXT_DATA__ embedded JSON (Next.js initial props)
//   0b. window.__*__ variable assignments in script tags
//   1.  JSON-LD structured data
//   2.  Targeted key-value regex across all script content
//   3.  Open Graph / Twitter meta tags
//   4.  HTML text regex patterns
// Also checks Sanity for duplicate listings by URL.

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;
const SANITY_Q   = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}`;
const SANITY_HDR = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` });

// All known field name aliases for each property attribute
const BED_KEYS = [
  'BedsTotal','BedroomsTotal','Bedrooms','bedrooms','beds','bedCount',
  'bedroom_count','numberOfBedrooms','TotalBedrooms','BedroomCount',
  'numBedrooms','bedroomsTotal','ListBedrooms','bed_count','totalBedrooms',
  'Beds','BEDS','NumBeds',
];
const BATH_KEYS = [
  'BathsTotal','BathroomsTotalInteger','BathsFull','Bathrooms',
  'bathrooms','baths','bathCount','bathroom_count','numberOfBathroomsTotal',
  'TotalBathrooms','BathroomCount','numBathrooms','bathroomsTotal',
  'BathroomsFull','numberOfBathrooms','bath_count','Baths','BATHS',
  'BathsFullDecimal','NumBaths',
];
const SQFT_KEYS = [
  'SqFtTotal','LivingArea','BuildingAreaTotal','SquareFootage',
  'squareFeet','sqft','squareFootage','finishedArea','propertySize',
  'GrossArea','approxSqFt','SqFt','SqFtLiving','square_feet',
  'square_footage','TotalSqFt','AboveGradeFinishedArea','FloorSize',
  'floorSize','livingArea','buildingArea','FinishedSqFt','TotalFinishedSqFt',
  'SQFT','sqFt','SquareFeet','LivingAreaSqFt',
];

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (SECRET && req.headers['x-admin-secret'] !== SECRET) return res.status(401).json({ error: 'Unauthorized' });

  let { url, listingId } = req.body || {};
  if (!url && listingId) url = `https://search.palisaderealty.com/search/detail/${String(listingId).trim()}`;
  if (!url) return res.status(400).json({ error: 'url or listingId required' });

  let parsedUrl;
  try { parsedUrl = new URL(url); }
  catch { return res.status(400).json({ error: 'Invalid URL format' }); }

  const idMatch = parsedUrl.pathname.match(/\/search\/detail\/(\w+)/i);
  const extId   = idMatch ? idMatch[1] : null;

  // Fetch the listing page HTML
  let html;
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':          'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control':   'no-cache',
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) return res.status(502).json({ error: `Listing page returned HTTP ${r.status}` });
    html = await r.text();
  } catch (err) {
    return res.status(502).json({ error: `Could not reach listing page: ${err.message}` });
  }

  const { data, debug } = extractListingData(html, url, extId);

  // Debug logs — visible in Vercel function logs
  console.log('[fetch-listing] URL:', url);
  console.log('[fetch-listing] Beds found:', data.bedrooms ?? 'NOT FOUND', '| source:', debug.bedsSource || 'none');
  console.log('[fetch-listing] Baths found:', data.bathrooms ?? 'NOT FOUND', '| source:', debug.bathsSource || 'none');
  console.log('[fetch-listing] SQFT found:', data.squareFootage ?? 'NOT FOUND', '| source:', debug.sqftSource || 'none');
  console.log('[fetch-listing] Price:', data.price || 'NOT FOUND', '| Title:', data.title ? 'YES' : 'NO');
  console.log('[fetch-listing] Raw debug:', JSON.stringify(debug));

  const isClientRendered = !data.title && !data.price && !data.street && !data.imageUrl;
  const missing = [];
  if (!data.bedrooms)      missing.push('Beds');
  if (!data.bathrooms)     missing.push('Baths');
  if (!data.squareFootage) missing.push('SQFT');

  let warning = null;
  if (isClientRendered) {
    warning = 'The listing page is client-rendered — only the URL and listing ID could be captured. Please fill in all details manually.';
  } else if (missing.length === 3) {
    warning = 'Beds, Baths, and SQFT could not be detected automatically — please enter them manually.';
  } else if (missing.length > 0) {
    warning = `Unable to auto-detect: ${missing.join(', ')}. Please enter manually.`;
  }

  // Duplicate check
  let duplicateId = null;
  try {
    const groq = `*[_type == "featuredListing" && listingUrl == $url][0]{ _id }`;
    const dupR = await fetch(
      `${SANITY_Q}?query=${encodeURIComponent(groq)}&$url=${encodeURIComponent(JSON.stringify(url))}`,
      { headers: SANITY_HDR() }
    );
    const dupD = await dupR.json();
    duplicateId = dupD.result?._id || null;
  } catch { /* non-fatal */ }

  return res.status(200).json({ data, duplicateId, warning, _debug: debug });
};

/* ─────────────────────────────────────────────────────────────────────
   EXTRACTION ENGINE
───────────────────────────────────────────────────────────────────── */

function extractListingData(html, sourceUrl, extId) {
  const data  = { listingUrl: sourceUrl };
  const debug = {};
  if (extId) data.externalListingId = extId;

  // Collect all <script> tag bodies (skip tiny ones)
  const scriptBodies = [];
  let totalScriptLen = 0;
  const scriptRe = /<script(?:\s[^>]*)?>([^<]{15,})<\/script>/gi;
  let sm;
  while ((sm = scriptRe.exec(html)) !== null) {
    const body = sm[1].trim();
    if (totalScriptLen + body.length <= 800000) { // cap at 800 KB total
      scriptBodies.push(body);
      totalScriptLen += body.length;
    }
  }
  const allScripts = scriptBodies.join('\n');

  // ── Layer 0a: __NEXT_DATA__ (Next.js) ────────────────────────────
  {
    const m = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
    if (m) {
      try {
        applyDeepSearch(JSON.parse(m[1]), data, debug, '__NEXT_DATA__');
      } catch { /* malformed */ }
    }
  }

  // ── Layer 0b: window.__FOO__ = {...} assignments ─────────────────
  if (needsMore(data)) {
    const winRe = /window\.__([A-Z][A-Z_0-9]*)__\s*=\s*\{/g;
    let wm;
    while ((wm = winRe.exec(allScripts)) !== null && needsMore(data)) {
      const jsonStr = extractBalancedBraces(allScripts, wm.index + wm[0].length - 1);
      if (jsonStr) {
        try { applyDeepSearch(JSON.parse(jsonStr), data, debug, `window.__${wm[1]}__`); }
        catch { /* malformed */ }
      }
    }
  }

  // ── Layer 1: JSON-LD ─────────────────────────────────────────────
  {
    const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let jm;
    while ((jm = re.exec(html)) !== null) {
      try {
        const obj   = JSON.parse(jm[1].trim());
        const nodes = Array.isArray(obj['@graph']) ? obj['@graph'] : [obj];
        for (const node of nodes) applyJsonLd(node, data, debug);
      } catch { /* malformed */ }
    }
  }

  // ── Layer 2: Targeted key-value regex across all script content ───
  // This is the primary fix — catches embedded JSON in minified React bundles
  // without full JSON parsing. Handles both "key": value and key: value formats.
  if (needsMore(data)) {
    if (!data.bedrooms) {
      const r = findNumericKey(allScripts, BED_KEYS, 1, 20);
      if (r) { data.bedrooms = r.value; debug.bedsSource = `script-regex:${r.key}`; }
    }
    if (!data.bathrooms) {
      const r = findNumericKey(allScripts, BATH_KEYS, 0.5, 15);
      if (r) { data.bathrooms = r.value; debug.bathsSource = `script-regex:${r.key}`; }
    }
    if (!data.squareFootage) {
      const r = findNumericKey(allScripts, SQFT_KEYS, 200, 99999);
      if (r) { data.squareFootage = Math.round(r.value); debug.sqftSource = `script-regex:${r.key}`; }
    }
    if (!data.price) {
      const r = findNumericKey(allScripts,
        ['ListPrice','Price','CurrentPrice','SalePrice','AskingPrice','ListingPrice'],
        10000, 100000000);
      if (r) { data.price = formatPrice(r.value); debug.priceSource = `script-regex:${r.key}`; }
    }
  }

  // ── Layer 3: Open Graph / Twitter meta ───────────────────────────
  function metaContent(prop) {
    const r1 = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"'<>]+)["']`, 'i');
    const r2 = new RegExp(`<meta[^>]+content=["']([^"'<>]+)["'][^>]+(?:property|name)=["']${prop}["']`, 'i');
    return (html.match(r1) || html.match(r2) || [])[1]?.trim() || null;
  }
  if (!data.title)       data.title       = metaContent('og:title')       || metaContent('twitter:title');
  if (!data.description) data.description = metaContent('og:description') || metaContent('twitter:description');
  if (!data.imageUrl)    data.imageUrl    = metaContent('og:image')        || metaContent('twitter:image');

  // ── Layer 4: HTML text regex (last resort) ────────────────────────
  if (!data.price) {
    const m = html.match(/\$\s*[\d,]{4,}/);
    if (m) data.price = m[0].replace(/\s/g, '');
  }
  if (!data.street) {
    const m = html.match(/\b(\d{1,6})\s+(?:[NSEW]\s+)?([A-Z][a-zA-Z0-9 ]{2,35}(?:Dr|St|Ave|Blvd|Rd|Ln|Way|Ct|Pl|Cir|Loop|Pkwy|Hwy|Trl)\.?)\b/);
    if (m) data.street = m[0].trim();
  }
  if (!data.city || !data.state) {
    const m = html.match(/([A-Z][a-zA-Z ]{2,20}),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/);
    if (m) {
      data.city  = data.city  || m[1].trim();
      data.state = data.state || m[2];
      data.zip   = data.zip   || m[3];
    }
  }
  if (!data.bedrooms) {
    for (const re of [
      /(\d+(?:\.\d)?)\s*(?:bed(?:room)?s?|bd(?:rm)?s?)\b/i,
      /"(?:beds?|bedrooms?)":\s*(\d+(?:\.\d+)?)/i,
      /\bbed(?:room)?s?\s*:\s*(\d+(?:\.\d+)?)/i,
    ]) {
      const m = html.match(re);
      if (m) { const v = parseFloat(m[1]); if (v > 0 && v < 20) { data.bedrooms = v; debug.bedsSource = 'html-text-regex'; break; } }
    }
  }
  if (!data.bathrooms) {
    for (const re of [
      /(\d+(?:\.\d)?)\s*(?:bath(?:room)?s?|ba(?:th)?s?)\b/i,
      /"(?:baths?|bathrooms?)":\s*(\d+(?:\.\d+)?)/i,
      /\bbath(?:room)?s?\s*:\s*(\d+(?:\.\d+)?)/i,
    ]) {
      const m = html.match(re);
      if (m) { const v = parseFloat(m[1]); if (v > 0 && v < 15) { data.bathrooms = v; debug.bathsSource = 'html-text-regex'; break; } }
    }
  }
  if (!data.squareFootage) {
    for (const re of [
      /([\d,]{3,6})\s*(?:sq\.?\s*ft\.?|sqft|SF|square\s+feet|sq\s+ft)\b/i,
      /"(?:sqft|squareFeet|squareFootage|LivingArea)":\s*([\d,]+)/i,
    ]) {
      const m = html.match(re);
      if (m) { const v = parseInt(m[1].replace(/,/g,''), 10); if (v > 100 && v < 100000) { data.squareFootage = v; debug.sqftSource = 'html-text-regex'; break; } }
    }
  }

  // Normalize numeric fields
  if (data.bedrooms != null)      data.bedrooms      = +parseFloat(data.bedrooms).toFixed(1);
  if (data.bathrooms != null)     data.bathrooms     = +parseFloat(data.bathrooms).toFixed(1);
  if (data.squareFootage != null) data.squareFootage = Math.round(Number(data.squareFootage));

  // Remove empty/null fields
  Object.keys(data).forEach(k => { if (data[k] == null || data[k] === '') delete data[k]; });

  return { data, debug };
}

function needsMore(data) {
  return !data.bedrooms || !data.bathrooms || !data.squareFootage;
}

/* ── Recursive deep-object search ─────────────────────────────────── */
function applyDeepSearch(obj, data, debug, source) {
  if (!obj || typeof obj !== 'object') return;

  if (!data.bedrooms) {
    const { val, key } = findInObj(obj, BED_KEYS);
    if (val != null) { const n = toFloat(val); if (n > 0 && n < 30) { data.bedrooms = n; debug.bedsSource = `${source}:${key}`; } }
  }
  if (!data.bathrooms) {
    const { val, key } = findInObj(obj, BATH_KEYS);
    if (val != null) { const n = toFloat(val); if (n > 0 && n < 20) { data.bathrooms = n; debug.bathsSource = `${source}:${key}`; } }
  }
  if (!data.squareFootage) {
    const { val, key } = findInObj(obj, SQFT_KEYS);
    if (val != null) { const n = toInt(val); if (n > 100 && n < 100000) { data.squareFootage = n; debug.sqftSource = `${source}:${key}`; } }
  }
  if (!data.price) {
    const { val } = findInObj(obj, ['ListPrice','Price','CurrentPrice','SalePrice','AskingPrice','ListingPrice']);
    if (val != null) { data.price = formatPrice(val); debug.priceSource = source; }
  }
  if (!data.street) {
    const { val } = findInObj(obj, ['StreetAddress','streetAddress','Street','address1','UnparsedAddress','FullAddress']);
    if (val) data.street = String(val).trim();
  }
  if (!data.city) {
    const { val } = findInObj(obj, ['City','city','addressLocality']);
    if (val) data.city = String(val).trim();
  }
  if (!data.state) {
    const { val } = findInObj(obj, ['StateOrProvince','State','state','addressRegion']);
    if (val && /^[A-Z]{2}$/i.test(String(val).trim())) data.state = String(val).trim().toUpperCase();
  }
  if (!data.zip) {
    const { val } = findInObj(obj, ['PostalCode','Zip','zip','postalCode','zipCode']);
    if (val) data.zip = String(val).trim();
  }
  if (!data.imageUrl) {
    const { val } = findInObj(obj, ['MediaURL','primaryPhotoURL','MainPhotoUrl','imageUrl','primaryImage','PhotoUrl','photo_url']);
    if (val) data.imageUrl = Array.isArray(val) ? val[0] : String(val);
  }
}

/* ── JSON-LD node ─────────────────────────────────────────────────── */
function applyJsonLd(node, data, debug) {
  if (!data.title       && node.name)          { data.title       = String(node.name).trim();        debug.titleSource = 'json-ld'; }
  if (!data.description && node.description)     data.description = String(node.description).trim();
  if (!data.imageUrl    && node.image)           data.imageUrl    = Array.isArray(node.image) ? node.image[0] : String(node.image);
  if (!data.price       && node.price)         { data.price       = formatPrice(node.price);          debug.priceSource = 'json-ld'; }
  if (!data.price       && node.offers?.price) { data.price       = formatPrice(node.offers.price);   debug.priceSource = 'json-ld'; }

  if (node.address) {
    data.street = data.street || node.address.streetAddress   || null;
    data.city   = data.city   || node.address.addressLocality || null;
    data.state  = data.state  || node.address.addressRegion   || null;
    data.zip    = data.zip    || node.address.postalCode       || null;
  }

  for (const k of ['numberOfBedrooms','BedroomsTotal','Bedrooms']) {
    if (!data.bedrooms && node[k] != null) {
      const v = toFloat(node[k]); if (v > 0) { data.bedrooms = v; debug.bedsSource = `json-ld:${k}`; break; }
    }
  }
  for (const k of ['numberOfBathroomsTotal','numberOfBathrooms','BathroomsTotal','Bathrooms']) {
    if (!data.bathrooms && node[k] != null) {
      const v = toFloat(node[k]); if (v > 0) { data.bathrooms = v; debug.bathsSource = `json-ld:${k}`; break; }
    }
  }
  const sqftCandidates = [
    ['floorSize',   node.floorSize?.value ?? (typeof node.floorSize === 'number' ? node.floorSize : null)],
    ['livingArea',  node.livingArea?.value ?? (typeof node.livingArea === 'number' ? node.livingArea : null)],
    ['floorSizeValue', node.floorSizeValue],
  ];
  for (const [k, raw] of sqftCandidates) {
    if (!data.squareFootage && raw != null) {
      const v = toInt(raw); if (v > 100) { data.squareFootage = v; debug.sqftSource = `json-ld:${k}`; break; }
    }
  }
}

/* ── Helpers ─────────────────────────────────────────────────────── */

// Recursively search object for first matching key (max depth 8)
function findInObj(obj, keys, depth = 0) {
  if (depth > 8 || !obj || typeof obj !== 'object') return { val: null, key: null };
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return { val: obj[key], key };
  }
  for (const v of Object.values(obj)) {
    if (typeof v === 'object' && v !== null) {
      const r = findInObj(v, keys, depth + 1);
      if (r.val !== null) return r;
    }
  }
  return { val: null, key: null };
}

// Fast regex scan for "key": value or key: value in script content
function findNumericKey(scripts, keys, min, max) {
  for (const key of keys) {
    // JSON format: "key": 123 or "key": "123"
    let re = new RegExp(`"${key}"\\s*:\\s*"?(\\d+(?:\\.\\d+)?)"?`, 'i');
    let m = scripts.match(re);
    if (!m) {
      // Unquoted JS object format: key: 123
      re = new RegExp(`\\b${key}\\s*:\\s*(\\d+(?:\\.\\d+)?)`, 'i');
      m = scripts.match(re);
    }
    if (m) {
      const v = parseFloat(m[1]);
      if (!isNaN(v) && v >= min && v <= max) return { value: v, key };
    }
  }
  return null;
}

// Extract a balanced {...} block from a string starting at index `start`
function extractBalancedBraces(str, start) {
  if (str[start] !== '{') {
    const idx = str.indexOf('{', start);
    if (idx === -1) return null;
    start = idx;
  }
  const MAX = Math.min(str.length, start + 300000);
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < MAX; i++) {
    const c = str[i];
    if (esc)        { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"')  { inStr = !inStr; continue; }
    if (inStr)      continue;
    if (c === '{')  depth++;
    else if (c === '}') { depth--; if (depth === 0) return str.slice(start, i + 1); }
  }
  return null;
}

function toFloat(v) {
  if (v == null) return null;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? null : +n.toFixed(2);
}

function toInt(v) {
  if (v == null) return null;
  const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? null : n;
}

function formatPrice(raw) {
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
  if (isNaN(n)) return String(raw);
  return '$' + n.toLocaleString('en-US');
}

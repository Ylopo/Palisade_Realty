// Server-side CRUD proxy for featuredListing documents.
// All Sanity mutations use SANITY_API_TOKEN — never exposed to browser.
// Requires X-Admin-Secret header matching ADMIN_SECRET env var.

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;

const BASE   = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`;
const QUERY  = `${BASE}/data/query/${DATASET}`;
const MUTATE = `${BASE}/data/mutate/${DATASET}`;
const HDR    = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` });

const GROQ = `*[_type == "featuredListing"] | order(displayOrder asc, _createdAt asc) {
  _id, title, price, status, featured, active, externalListingId, displayOrder, listingUrl, shortDescription,
  "street": address.street, "city": address.city, "state": address.state, "zip": address.zip,
  bedrooms, bathrooms, squareFootage,
  "mainImageUrl": mainImage.asset->url,
  "mainImageRef": mainImage.asset->_id
}`;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (SECRET && req.headers['x-admin-secret'] !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Geocode proxy — accepts optional cityContext to bias results to a specific city/state.
  // For Henderson pages, pass cityContext=Henderson,+NV to reject non-Nevada results.
  if (req.method === 'GET' && req.query.action === 'geocode') {
    const area        = (req.query.area        || '').trim();
    const cityContext = (req.query.cityContext  || '').trim();
    if (!area) return res.status(400).json({ error: 'Area name required' });
    const requireNV = /henderson|nevada/i.test(cityContext);
    const searchQ   = cityContext ? `${area}, ${cityContext}` : area;
    try {
      const url = 'https://nominatim.openstreetmap.org/search?'
        + 'q=' + encodeURIComponent(searchQ)
        + '&format=json&limit=5&addressdetails=1';
      const r = await fetch(url, { headers: { 'User-Agent': 'CrightonRinaldiAdmin/1.0' } });
      if (!r.ok) return res.status(502).json({ error: 'Geocoding service unavailable. Please try again.' });
      const results = await r.json();
      if (!results || !results.length) {
        const hint = requireNV ? `"${area}, Henderson, Nevada"` : `"${area}, CA" or "${area}, Nevada"`;
        return res.status(404).json({ error: `Could not find "${area}". Try ${hint}.` });
      }
      // When Nevada context required, find first Nevada result; reject otherwise
      let hit = results[0];
      if (requireNV) {
        const nvHit = results.find(r => {
          const addr = r.address || {};
          const iso  = addr['ISO3166-2-lvl4'] || '';
          const st   = addr.state || '';
          return iso === 'US-NV' || /nevada/i.test(st);
        });
        if (!nvHit) {
          return res.status(404).json({
            error: `No Nevada result found for "${area}". Try "${area}, Henderson, Nevada" or "${area}, NV".`,
          });
        }
        hit = nvHit;
      }
      const lat = Math.round(parseFloat(hit.lat) * 10000) / 10000;
      const lng = Math.round(parseFloat(hit.lon) * 10000) / 10000;
      const addr = hit.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.county || hit.name || area;
      let stateAbbr = '';
      const isoCode = addr['ISO3166-2-lvl4'] || '';
      if (isoCode) stateAbbr = isoCode.replace(/^[A-Z]+-/, '');
      else if (addr.state) stateAbbr = addr.state;
      const subLabel = stateAbbr ? `${cityName}, ${stateAbbr}` : cityName;
      return res.status(200).json({
        areaName: cityName, subLabel, lat, lng,
        formattedAddress: hit.display_name || subLabel,
        state: stateAbbr, country: addr.country || '',
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Geocoding failed' });
    }
  }

  try {
    // LIST ALL
    if (req.method === 'GET') {
      const r = await fetch(`${QUERY}?query=${encodeURIComponent(GROQ)}`, { headers: HDR() });
      const d = await r.json();
      return res.status(200).json(d.result || []);
    }

    // CREATE
    if (req.method === 'POST') {
      const doc = toDocument(req.body);
      const r = await fetch(MUTATE, {
        method: 'POST', headers: HDR(),
        body: JSON.stringify({ mutations: [{ create: doc }] }),
      });
      const d = await r.json();
      return res.status(r.ok ? 200 : 400).json(d);
    }

    // UPDATE
    if (req.method === 'PUT') {
      const { _id } = req.body;
      if (!_id) return res.status(400).json({ error: '_id required' });
      const r = await fetch(MUTATE, {
        method: 'POST', headers: HDR(),
        body: JSON.stringify({ mutations: [{ patch: { id: _id, set: toPatch(req.body) } }] }),
      });
      const d = await r.json();
      return res.status(r.ok ? 200 : 400).json(d);
    }

    // DELETE
    if (req.method === 'DELETE') {
      const { _id } = req.body;
      if (!_id) return res.status(400).json({ error: '_id required' });
      const r = await fetch(MUTATE, {
        method: 'POST', headers: HDR(),
        body: JSON.stringify({ mutations: [{ delete: { id: _id } }] }),
      });
      const d = await r.json();
      return res.status(r.ok ? 200 : 400).json(d);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/admin]', err.message);
    return res.status(500).json({ error: err.message });
  }
};

function slug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toDocument(b) {
  const doc = {
    _type: 'featuredListing',
    title:            b.title            || '',
    price:            b.price            || '',
    status:           b.status           || 'for-sale',
    featured:         b.featured         !== false,
    active:           b.active           !== false,
    displayOrder:     Number(b.displayOrder) || 0,
    shortDescription: b.shortDescription || '',
    listingUrl:       b.listingUrl       || '',
    address: { street: b.street||'', city: b.city||'', state: b.state||'NV', zip: b.zip||'' },
  };
  if (b.bedrooms)           doc.bedrooms           = Number(b.bedrooms);
  if (b.bathrooms)          doc.bathrooms          = Number(b.bathrooms);
  if (b.squareFootage)      doc.squareFootage      = Number(b.squareFootage);
  if (b.mainImageRef)       doc.mainImage          = { _type: 'image', asset: { _type: 'reference', _ref: b.mainImageRef } };
  if (b.externalListingId)  doc.externalListingId  = String(b.externalListingId);
  if (b.title)              doc.slug               = { _type: 'slug', current: slug(b.title) };
  return doc;
}

function toPatch(b) {
  const p = {};
  const set = (k, v) => { if (v !== undefined) p[k] = v; };
  set('title',              b.title);
  set('price',              b.price);
  set('status',             b.status);
  set('featured',           b.featured);
  set('active',             b.active);
  set('displayOrder',       b.displayOrder !== undefined ? Number(b.displayOrder) : undefined);
  set('shortDescription',   b.shortDescription);
  set('listingUrl',         b.listingUrl);
  set('externalListingId',  b.externalListingId);
  set('bedrooms',         b.bedrooms     ? Number(b.bedrooms)      : (b.bedrooms === '' ? null : undefined));
  set('bathrooms',        b.bathrooms    ? Number(b.bathrooms)     : (b.bathrooms === '' ? null : undefined));
  set('squareFootage',    b.squareFootage? Number(b.squareFootage) : (b.squareFootage === '' ? null : undefined));
  set('address.street',   b.street);
  set('address.city',     b.city);
  set('address.state',    b.state);
  set('address.zip',      b.zip);
  if (b.mainImageRef)    p.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: b.mainImageRef } };
  if (b.title)           p.slug      = { _type: 'slug', current: slug(b.title) };
  return p;
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;
const BASE       = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`;
const QUERY_URL  = `${BASE}/data/query/${DATASET}`;
const MUTATE_URL = `${BASE}/data/mutate/${DATASET}`;
const HDR        = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` });

const PUBLIC_GROQ = `*[_type == "headerCarousel" && active == true] | order(displayOrder asc) {
  _id, title, altText, caption, headline, headlineEs, subheadline, subheadlineEs, buttonText, buttonUrl,
  displayOrder, active,
  "imageUrl": image.asset->url
}`;

const ADMIN_GROQ = `*[_type == "headerCarousel"] | order(displayOrder asc) {
  _id, title, altText, caption, headline, subheadline, buttonText, buttonUrl,
  displayOrder, active,
  "imageUrl": image.asset->url,
  "imageRef": image.asset->_id
}`;

function toDoc(b) {
  const doc = {
    _type: 'headerCarousel',
    title:        b.title        || '',
    altText:      b.altText      || '',
    caption:      b.caption      || '',
    headline:     b.headline     || '',
    subheadline:  b.subheadline  || '',
    buttonText:   b.buttonText   || '',
    buttonUrl:    b.buttonUrl    || '',
    displayOrder: Number(b.displayOrder) || 0,
    active:       b.active !== false,
  };
  if (b.imageRef) {
    doc.image = { _type: 'image', asset: { _type: 'reference', _ref: b.imageRef } };
  }
  return doc;
}

function toPatch(b) {
  const p = {};
  if (b.title        !== undefined) p.title        = b.title;
  if (b.altText      !== undefined) p.altText      = b.altText;
  if (b.caption      !== undefined) p.caption      = b.caption;
  if (b.headline     !== undefined) p.headline     = b.headline;
  if (b.subheadline  !== undefined) p.subheadline  = b.subheadline;
  if (b.buttonText   !== undefined) p.buttonText   = b.buttonText;
  if (b.buttonUrl    !== undefined) p.buttonUrl    = b.buttonUrl;
  if (b.displayOrder !== undefined) p.displayOrder = Number(b.displayOrder);
  if (b.active       !== undefined) p.active       = b.active;
  if (b.imageRef !== undefined) {
    p.image = b.imageRef
      ? { _type: 'image', asset: { _type: 'reference', _ref: b.imageRef } }
      : null;
  }
  return p;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const isAdmin = SECRET && req.headers['x-admin-secret'] === SECRET;

  if (req.method === 'GET') {
    const groq = isAdmin ? ADMIN_GROQ : PUBLIC_GROQ;
    try {
      const r = await fetch(`${QUERY_URL}?query=${encodeURIComponent(groq)}`, { headers: HDR() });
      const d = await r.json();
      return res.status(200).json(d.result || []);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    try {
      const r = await fetch(MUTATE_URL, {
        method: 'POST', headers: HDR(),
        body: JSON.stringify({ mutations: [{ create: toDoc(req.body || {}) }] }),
      });
      const d = await r.json();
      return res.status(r.ok ? 201 : 400).json(d);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'PUT') {
    const b = req.body || {};
    if (!b._id) return res.status(400).json({ error: '_id required' });
    try {
      const r = await fetch(MUTATE_URL, {
        method: 'POST', headers: HDR(),
        body: JSON.stringify({ mutations: [{ patch: { id: b._id, set: toPatch(b) } }] }),
      });
      const d = await r.json();
      return res.status(r.ok ? 200 : 400).json(d);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const { _id } = req.body || {};
    if (!_id) return res.status(400).json({ error: '_id required' });
    try {
      const r = await fetch(MUTATE_URL, {
        method: 'POST', headers: HDR(),
        body: JSON.stringify({ mutations: [{ delete: { id: _id } }] }),
      });
      const d = await r.json();
      return res.status(r.ok ? 200 : 400).json(d);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

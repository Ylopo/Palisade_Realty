const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;
const BASE       = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`;
const QUERY_URL  = `${BASE}/data/query/${DATASET}`;
const MUTATE_URL = `${BASE}/data/mutate/${DATASET}`;
const HDR        = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` });

const FIELDS = `_id, name, "slug": slug.current, role, location, phone, email, bio, fullBio, linkedin, instagram, facebook, websiteUrl,
  department, imageAlt, showOnHomepage, showOnTeamPage,
  displayOrder, active, featured,
  "photoUrl": photo.asset->url`;

// Homepage carousel — all active members that aren't explicitly hidden from homepage
const PUBLIC_HOME_GROQ = `*[_type == "teamMember" && active != false && showOnHomepage != false] | order(displayOrder asc) {
  ${FIELDS}
}`;

// Team page grid — all active members that aren't explicitly hidden from team page
const PUBLIC_TEAM_GROQ = `*[_type == "teamMember" && active != false && showOnTeamPage != false] | order(displayOrder asc) {
  ${FIELDS}
}`;

// Admin — all members regardless of visibility flags
const ADMIN_GROQ = `*[_type == "teamMember"] | order(displayOrder asc) {
  ${FIELDS},
  "photoRef": photo.asset->_id
}`;

function toDoc(b) {
  const doc = {
    _type:        'teamMember',
    name:         b.name         || '',
    role:         b.role         || 'Real Estate Agent',
    location:     b.location     || 'Las Vegas, NV',
    phone:        b.phone        || '',
    email:        b.email        || '',
    bio:          b.bio          || '',
    fullBio:      b.fullBio      || '',
    linkedin:     b.linkedin     || '',
    instagram:    b.instagram    || '',
    facebook:     b.facebook     || '',
    websiteUrl:   b.websiteUrl   || '',
    department:   b.department   || 'agent',
    imageAlt:     b.imageAlt     || '',
    displayOrder: Number(b.displayOrder) || 0,
    active:           b.active           !== false,
    featured:         !!b.featured,
    showOnHomepage:   b.showOnHomepage    !== false,
    showOnTeamPage:   b.showOnTeamPage    !== false,
  };
  if (b.photoRef) {
    doc.photo = { _type: 'image', asset: { _type: 'reference', _ref: b.photoRef } };
  }
  return doc;
}

function toPatch(b) {
  const p = {};
  if (b.name         !== undefined) p.name         = b.name;
  if (b.role         !== undefined) p.role         = b.role;
  if (b.location     !== undefined) p.location     = b.location;
  if (b.phone        !== undefined) p.phone        = b.phone;
  if (b.email        !== undefined) p.email        = b.email;
  if (b.bio          !== undefined) p.bio          = b.bio;
  if (b.fullBio      !== undefined) p.fullBio      = b.fullBio;
  if (b.linkedin     !== undefined) p.linkedin     = b.linkedin;
  if (b.instagram    !== undefined) p.instagram    = b.instagram;
  if (b.facebook     !== undefined) p.facebook     = b.facebook;
  if (b.websiteUrl   !== undefined) p.websiteUrl   = b.websiteUrl;
  if (b.department   !== undefined) p.department   = b.department;
  if (b.imageAlt     !== undefined) p.imageAlt     = b.imageAlt;
  if (b.displayOrder !== undefined) p.displayOrder = Number(b.displayOrder);
  if (b.active             !== undefined) p.active           = b.active;
  if (b.featured           !== undefined) p.featured         = b.featured;
  if (b.showOnHomepage     !== undefined) p.showOnHomepage   = b.showOnHomepage;
  if (b.showOnTeamPage     !== undefined) p.showOnTeamPage   = b.showOnTeamPage;
  if (b.photoRef !== undefined) {
    p.photo = b.photoRef
      ? { _type: 'image', asset: { _type: 'reference', _ref: b.photoRef } }
      : null;
  }
  return p;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const isAdmin = SECRET && req.headers['x-admin-secret'] === SECRET;

  if (req.method === 'GET') {
    let groq;
    if (isAdmin) {
      groq = ADMIN_GROQ;
    } else if (req.query?.page === 'team') {
      groq = PUBLIC_TEAM_GROQ;
    } else {
      groq = PUBLIC_HOME_GROQ;
    }
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

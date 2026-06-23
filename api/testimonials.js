const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;
const BASE       = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`;
const QUERY_URL  = `${BASE}/data/query/${DATASET}`;
const MUTATE_URL = `${BASE}/data/mutate/${DATASET}`;
const HDR        = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` });

const PUBLIC_GROQ = `*[_type == "testimonial" && active == true]
  | order(featured desc, displayOrder asc) {
  _id, name, title, review, rating, category, imageAlt, featured, active, displayOrder,
  "imageUrl": image.asset->url
}`;

const ADMIN_GROQ = `*[_type == "testimonial"] | order(featured desc, displayOrder asc) {
  _id, name, title, review, rating, category, imageAlt, featured, active, displayOrder,
  "imageUrl": image.asset->url,
  "imageRef": image.asset->_id
}`;

function toDoc(b) {
  const doc = {
    _type:        'testimonial',
    name:         b.name         || '',
    title:        b.title        || '',
    review:       b.review       || '',
    rating:       Math.max(1, Math.min(5, Number(b.rating) || 5)),
    category:     b.category     || '',
    imageAlt:     b.imageAlt     || '',
    displayOrder: Number(b.displayOrder) || 0,
    active:       b.active !== false,
    featured:     !!b.featured,
  };
  if (b.imageRef) {
    doc.image = { _type: 'image', asset: { _type: 'reference', _ref: b.imageRef } };
  }
  return doc;
}

function toPatch(b) {
  const p = {};
  if (b.name         !== undefined) p.name         = b.name;
  if (b.title        !== undefined) p.title        = b.title;
  if (b.review       !== undefined) p.review       = b.review;
  if (b.rating       !== undefined) p.rating       = Math.max(1, Math.min(5, Number(b.rating) || 5));
  if (b.category     !== undefined) p.category     = b.category;
  if (b.imageAlt     !== undefined) p.imageAlt     = b.imageAlt;
  if (b.displayOrder !== undefined) p.displayOrder = Number(b.displayOrder);
  if (b.active       !== undefined) p.active       = b.active;
  if (b.featured     !== undefined) p.featured     = b.featured;
  if (b.imageRef !== undefined) {
    p.image = b.imageRef
      ? { _type: 'image', asset: { _type: 'reference', _ref: b.imageRef } }
      : null;
  }
  return p;
}

/* ── Page singleton (testimonialsPage) ── */
const PAGE_GROQ = `*[_id == "testimonialsPage"][0]{
  testHero {
    eyebrow, headline, subheadline, ratingScore, reviewCount,
    "bgImageUrl": bgImage.asset->url,
    "bgImageRef": bgImage.asset->_id,
    active
  },
  testStatsBar {
    "stats": stats[] | order(displayOrder asc) { value, label, displayOrder, active },
    active
  },
  ctaSection {
    eyebrow, headline, buttonText, buttonUrl, button2Text, button2Url,
    "bgImageUrl": bgImage.asset->url,
    "bgImageRef": bgImage.asset->_id,
    active
  },
  seoTitle, seoDescription,
  "ogImageUrl": ogImage.asset->url,
  "ogImageRef": ogImage.asset->_id
}`;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const isAdmin = SECRET && req.headers['x-admin-secret'] === SECRET;
  const isPage  = req.query.section === 'page';

  /* ── Page singleton routes ── */
  if (isPage) {
    if (req.method === 'GET') {
      try {
        const r = await fetch(`${QUERY_URL}?query=${encodeURIComponent(PAGE_GROQ)}`, { headers: HDR() });
        const d = await r.json();
        return res.status(200).json(d.result || {});
      } catch (err) {
        return res.status(200).json({});
      }
    }
    if (req.method === 'PUT') {
      if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' });
      const b = req.body || {};
      const buildImg = (ref) => ref
        ? { _type: 'image', asset: { _type: 'reference', _ref: ref } }
        : undefined;
      const heroImg = buildImg(b.testHero?.bgImageRef);
      const ctaImg  = buildImg(b.ctaSection?.bgImageRef);
      const ogImg   = buildImg(b.ogImageRef);
      const doc = {
        _id: 'testimonialsPage', _type: 'testimonialsPage',
        testHero: {
          eyebrow: b.testHero?.eyebrow || '', headline: b.testHero?.headline || '',
          subheadline: b.testHero?.subheadline || '', ratingScore: b.testHero?.ratingScore || '',
          reviewCount: b.testHero?.reviewCount || '', active: b.testHero?.active !== false,
          ...(heroImg ? { bgImage: heroImg } : {}),
        },
        testStatsBar: {
          active: b.testStatsBar?.active !== false,
          stats: (b.testStatsBar?.stats || []).map((s, i) => ({
            _type: 'object', _key: `stat-${i}`,
            value: s.value || '', label: s.label || '',
            displayOrder: Number(s.displayOrder) || i,
            active: s.active !== false,
          })),
        },
        ctaSection: {
          eyebrow: b.ctaSection?.eyebrow || '', headline: b.ctaSection?.headline || '',
          buttonText: b.ctaSection?.buttonText || '', buttonUrl: b.ctaSection?.buttonUrl || '',
          button2Text: b.ctaSection?.button2Text || '', button2Url: b.ctaSection?.button2Url || '',
          active: b.ctaSection?.active !== false,
          ...(ctaImg ? { bgImage: ctaImg } : {}),
        },
        seoTitle: b.seoTitle || '', seoDescription: b.seoDescription || '',
        ...(ogImg ? { ogImage: ogImg } : {}),
      };
      try {
        const r = await fetch(MUTATE_URL, {
          method: 'POST', headers: HDR(),
          body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
        });
        const d = await r.json();
        return res.status(r.ok ? 200 : 400).json(d);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

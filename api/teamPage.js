// Team page singleton settings — hero, stats, page content, CTA, SEO.
// Stored as a single Sanity document (_id: "teamPage").
// GET is public (no auth). PUT requires X-Admin-Secret.

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;
const BASE       = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`;
const QUERY_URL  = `${BASE}/data/query/${DATASET}`;
const MUTATE_URL = `${BASE}/data/mutate/${DATASET}`;
const HDR        = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` });

const GROQ = `*[_id == "teamPage"][0]{
  hero { eyebrow, headline, subheadline, "bgImageUrl": bgImage.asset->url, "bgImageRef": bgImage.asset->_id },
  stats { s1Value, s1Label, s2Value, s2Label, s3Value, s3Label, s4Value, s4Label },
  pageContent { eyebrow, title, subtitle },
  cta { eyebrow, headline, btn1Text, btn1Url, btn2Text, btn2Url },
  seo { title, description, "ogImageUrl": ogImage.asset->url, "ogImageRef": ogImage.asset->_id }
}`;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const r = await fetch(`${QUERY_URL}?query=${encodeURIComponent(GROQ)}`, { headers: HDR() });
      const d = await r.json();
      return res.status(200).json(d.result || {});
    } catch (err) {
      return res.status(200).json({});
    }
  }

  if (req.method === 'PUT') {
    if (SECRET && req.headers['x-admin-secret'] !== SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const b = req.body || {};

    const buildImageRef = (ref) => ref
      ? { _type: 'image', asset: { _type: 'reference', _ref: ref } }
      : undefined;

    const heroImg    = buildImageRef(b.hero?.bgImageRef);
    const ogImg      = buildImageRef(b.seo?.ogImageRef);

    const doc = {
      _id:   'teamPage',
      _type: 'teamPage',
      hero: {
        eyebrow:      b.hero?.eyebrow      || '',
        headline:     b.hero?.headline     || '',
        subheadline:  b.hero?.subheadline  || '',
        ...(heroImg ? { bgImage: heroImg } : {}),
      },
      stats: {
        s1Value: b.stats?.s1Value || '', s1Label: b.stats?.s1Label || '',
        s2Value: b.stats?.s2Value || '', s2Label: b.stats?.s2Label || '',
        s3Value: b.stats?.s3Value || '', s3Label: b.stats?.s3Label || '',
        s4Value: b.stats?.s4Value || '', s4Label: b.stats?.s4Label || '',
      },
      pageContent: {
        eyebrow:  b.pageContent?.eyebrow  || '',
        title:    b.pageContent?.title    || '',
        subtitle: b.pageContent?.subtitle || '',
      },
      cta: {
        eyebrow:  b.cta?.eyebrow  || '',
        headline: b.cta?.headline || '',
        btn1Text: b.cta?.btn1Text || '',
        btn1Url:  b.cta?.btn1Url  || '',
        btn2Text: b.cta?.btn2Text || '',
        btn2Url:  b.cta?.btn2Url  || '',
      },
      seo: {
        title:       b.seo?.title       || '',
        description: b.seo?.description || '',
        ...(ogImg ? { ogImage: ogImg } : {}),
      },
    };

    try {
      const r = await fetch(MUTATE_URL, {
        method: 'POST',
        headers: HDR(),
        body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
      });
      const d = await r.json();
      return res.status(r.ok ? 200 : 400).json(d);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

// Homepage section settings — visibility, order, and lightweight content data.
// Stored as a single Sanity singleton document (_id: "homepage-settings").
// GET is public (no auth). PUT requires X-Admin-Secret.

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;
const BASE       = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`;
const QUERY_URL  = `${BASE}/data/query/${DATASET}`;
const MUTATE_URL = `${BASE}/data/mutate/${DATASET}`;
const HDR        = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` });

const DEFAULT_SECTIONS = [
  { id:'hero',        label:'Header',           type:'Section', visible:true,  order:0,  updatedAt:'2024-05-12', sectionKey:'hero',        data:{} },
  { id:'communities', label:'Communities',       type:'Section', visible:true,  order:1,  updatedAt:'2024-05-12', sectionKey:'communities',  data:{} },
  { id:'about',       label:'About Us',          type:'Section', visible:true,  order:2,  updatedAt:'2024-05-11', sectionKey:'about',        data:{} },
  { id:'stats',       label:'Stats',             type:'Section', visible:true,  order:3,  updatedAt:'2024-05-11', sectionKey:'stats',        data:{} },
  { id:'listings',    label:'Featured Listings', type:'Section', visible:true,  order:4,  updatedAt:'2024-05-10', sectionKey:'listings',     data:{} },
  { id:'testimonial', label:'Client Reviews',    type:'Section', visible:true,  order:5,  updatedAt:'2024-05-10', sectionKey:'testimonial',  data:{} },
  { id:'team',        label:'Team',              type:'Section', visible:true,  order:6,  updatedAt:'2024-05-09', sectionKey:'team',         data:{} },
  { id:'blog',        label:'Blog',              type:'Page',    visible:true,  order:7,  updatedAt:'2024-05-09', sectionKey:'blog',         data:{} },
  { id:'faq',         label:'FAQ',               type:'Section', visible:true,  order:8,  updatedAt:'2024-05-08', sectionKey:'faq',          data:{} },
  { id:'cta',         label:'CTA',               type:'Section', visible:true,  order:9,  updatedAt:'2024-05-08', sectionKey:'cta',          data:{} },
];

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // PUT requires auth; GET is public
  if (req.method === 'PUT' && SECRET && req.headers['x-admin-secret'] !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const groq = `*[_id == "homepage-settings"][0]{ sections }`;
      const r    = await fetch(`${QUERY_URL}?query=${encodeURIComponent(groq)}`, { headers: HDR() });
      const d    = await r.json();
      const stored = d.result?.sections;
      if (Array.isArray(stored) && stored.length > 0) {
        // Merge stored with defaults so new sections added later appear
        const storedMap = Object.fromEntries(stored.map(s => [s.id, s]));
        const merged = DEFAULT_SECTIONS.map(def => storedMap[def.id] ? { ...def, ...storedMap[def.id] } : def);
        return res.status(200).json(merged);
      }
      return res.status(200).json(DEFAULT_SECTIONS);
    } catch {
      return res.status(200).json(DEFAULT_SECTIONS);
    }
  }

  if (req.method === 'PUT') {
    const { sections } = req.body || {};
    if (!Array.isArray(sections)) return res.status(400).json({ error: 'sections array required' });
    try {
      const r = await fetch(MUTATE_URL, {
        method: 'POST',
        headers: HDR(),
        body: JSON.stringify({
          mutations: [{
            createOrReplace: {
              _id: 'homepage-settings',
              _type: 'homepageSettings',
              sections,
            }
          }]
        }),
      });
      const d = await r.json();
      return res.status(r.ok ? 200 : 400).json(d);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

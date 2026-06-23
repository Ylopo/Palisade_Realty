const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;
const BASE       = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`;
const QUERY_URL  = `${BASE}/data/query/${DATASET}`;
const MUTATE_URL = `${BASE}/data/mutate/${DATASET}`;
const HDR        = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` });

const PUBLIC_FIELDS = `
  _id, name, "slug": slug.current, jobTitle, licenseNumber,
  "profilePhotoUrl": photo.asset->url,
  "heroImageUrl": heroImage.asset->url,
  heroHeadline, heroSubheadline, heroCTAText, heroCTAUrl,
  email, phone, officePhone, address, websiteUrl, linkedin, instagram, facebook, youtubeUrl, appointmentUrl,
  biographyHeadline, bio, fullBio,
  stats[] | order(displayOrder asc) { label, value, displayOrder, active },
  featuredListings[]-> {
    _id, title, price,
    "street": address.street, "city": address.city, "state": address.state,
    bedrooms, bathrooms, squareFootage,
    "mainImageUrl": mainImage.asset->url,
    listingUrl, status, active, displayOrder
  },
  mapArea { centerLat, centerLng, zoom, areaTitle, areaDescription, serviceAreas[] { name, sub, lat, lng } },
  seoTitle, seoDescription, "ogImageUrl": ogImage.asset->url,
  active, department, featured, role, location
`;

const ADMIN_EXTRA = `,
  "profilePhotoRef": photo.asset->_id,
  "heroImageRef": heroImage.asset->_id,
  "ogImageRef": ogImage.asset->_id,
  "featuredListingIds": featuredListings[]._ref
`;

function buildSet(b) {
  const s = {};
  const strFields = [
    'jobTitle','licenseNumber','heroHeadline','heroSubheadline','heroCTAText','heroCTAUrl',
    'officePhone','address','appointmentUrl','youtubeUrl','biographyHeadline',
    'bio','fullBio','seoTitle','seoDescription',
  ];
  strFields.forEach(f => { if (b[f] !== undefined) s[f] = b[f]; });

  if (b.slug !== undefined) s['slug.current'] = b.slug;
  if (b.profilePhotoRef !== undefined) {
    s.photo = b.profilePhotoRef
      ? { _type: 'image', asset: { _type: 'reference', _ref: b.profilePhotoRef } }
      : null;
  }
  if (b.heroImageRef !== undefined) {
    s.heroImage = b.heroImageRef
      ? { _type: 'image', asset: { _type: 'reference', _ref: b.heroImageRef } }
      : null;
  }
  if (b.ogImageRef !== undefined) {
    s.ogImage = b.ogImageRef
      ? { _type: 'image', asset: { _type: 'reference', _ref: b.ogImageRef } }
      : null;
  }
  if (b.stats !== undefined) {
    s.stats = (b.stats || []).map((st, i) => ({
      _type: 'object',
      _key: `stat_${i}`,
      label: st.label || '',
      value: st.value || '',
      displayOrder: Number(st.displayOrder) || i,
      active: st.active !== false,
    }));
  }
  if (b.featuredListingIds !== undefined) {
    s.featuredListings = (b.featuredListingIds || []).map((ref, i) => ({
      _type: 'reference', _ref: ref, _key: `listing_${i}`,
    }));
  }
  if (b.mapArea !== undefined) {
    const ma = b.mapArea || {};
    s.mapArea = {
      centerLat: ma.centerLat != null ? Number(ma.centerLat) : null,
      centerLng: ma.centerLng != null ? Number(ma.centerLng) : null,
      zoom: ma.zoom != null ? Number(ma.zoom) : 10,
      areaTitle: ma.areaTitle || '',
      areaDescription: ma.areaDescription || '',
      serviceAreas: (ma.serviceAreas || []).map((a, i) => ({
        _type: 'object', _key: `area_${i}`,
        name: a.name || '', sub: a.sub || '',
        lat: Number(a.lat) || 0, lng: Number(a.lng) || 0,
      })),
    };
  }
  return s;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const isAdmin = SECRET && req.headers['x-admin-secret'] === SECRET;

  if (req.method === 'GET') {
    const { slug, id } = req.query || {};

    let groq;
    if (id && isAdmin) {
      groq = `*[_type == "teamMember" && _id == "${id}"][0]{ ${PUBLIC_FIELDS} ${ADMIN_EXTRA} }`;
    } else if (slug) {
      groq = `*[_type == "teamMember" && slug.current == "${slug}" && active != false][0]{ ${PUBLIC_FIELDS} }`;
    } else {
      return res.status(400).json({ error: 'slug or id required' });
    }

    try {
      const r = await fetch(`${QUERY_URL}?query=${encodeURIComponent(groq)}`, { headers: HDR() });
      const d = await r.json();
      if (!d.result) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(d.result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'PUT') {
    const b = req.body || {};
    if (!b._id) return res.status(400).json({ error: '_id required' });
    const set = buildSet(b);
    if (!Object.keys(set).length) return res.status(400).json({ error: 'No fields to update' });
    try {
      const r = await fetch(MUTATE_URL, {
        method: 'POST', headers: HDR(),
        body: JSON.stringify({ mutations: [{ patch: { id: b._id, set } }] }),
      });
      const d = await r.json();
      return res.status(r.ok ? 200 : 400).json(d);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

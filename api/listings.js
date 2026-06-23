// Vercel serverless function — fetches featured listings from Sanity
// SANITY_API_TOKEN is server-side only; it is never exposed to the browser.

const GROQ = `*[_type == "featuredListing" && featured == true && active != false] | order(displayOrder asc) {
  _id,
  title,
  price,
  "street": address.street,
  "city": address.city,
  "state": address.state,
  "zip": address.zip,
  bedrooms,
  bathrooms,
  squareFootage,
  shortDescription,
  status,
  listingUrl,
  "slug": slug.current,
  "mainImageUrl": mainImage.asset->url
}`;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token     = process.env.SANITY_API_TOKEN;

  if (!projectId) {
    console.error('[api/listings] NEXT_PUBLIC_SANITY_PROJECT_ID is not set');
    res.status(500).json({ error: 'Server misconfiguration' });
    return;
  }

  const url =
    `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}` +
    `?query=${encodeURIComponent(GROQ)}`;

  const reqHeaders = { 'Content-Type': 'application/json' };
  if (token) reqHeaders['Authorization'] = `Bearer ${token}`;

  try {
    const sanityRes = await fetch(url, { headers: reqHeaders });

    if (!sanityRes.ok) {
      const body = await sanityRes.text();
      console.error('[api/listings] Sanity error', sanityRes.status, body);
      res.status(502).json({ error: 'Sanity API error', status: sanityRes.status });
      return;
    }

    const data = await sanityRes.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(data.result || []);
  } catch (err) {
    console.error('[api/listings] Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

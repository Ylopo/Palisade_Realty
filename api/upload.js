// Image upload proxy — converts base64 from browser and POSTs binary to Sanity asset API.
// Keeps SANITY_API_TOKEN server-side only.

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (SECRET && req.headers['x-admin-secret'] !== SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { imageBase64, filename, mimeType } = req.body || {};
  if (!imageBase64) return res.status(400).json({ error: 'imageBase64 required' });

  const buffer   = Buffer.from(imageBase64, 'base64');
  const url      = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/${DATASET}` +
                   `?filename=${encodeURIComponent(filename || 'upload.jpg')}`;

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':   mimeType || 'image/jpeg',
        'Authorization':  `Bearer ${TOKEN}`,
        'Content-Length': String(buffer.length),
      },
      body: buffer,
    });
    const d = await r.json();
    return res.status(r.ok ? 200 : 400).json(d);
  } catch (err) {
    console.error('[api/upload]', err.message);
    return res.status(500).json({ error: err.message });
  }
};

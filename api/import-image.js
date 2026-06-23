// Downloads a remote image by URL and uploads it to Sanity as an asset.
// Keeps SANITY_API_TOKEN server-side only — never exposed to browser.

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN      = process.env.SANITY_API_TOKEN;
const SECRET     = process.env.ADMIN_SECRET;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (SECRET && req.headers['x-admin-secret'] !== SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { imageUrl } = req.body || {};
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });

  try { new URL(imageUrl); }
  catch { return res.status(400).json({ error: 'Invalid imageUrl' }); }

  // Download image from remote URL
  let buffer, mimeType, filename;
  try {
    const r = await fetch(imageUrl, {
      headers: {
        'User-Agent':    'Mozilla/5.0 (compatible; ListingImporter/1.0)',
        'Accept':        'image/*,*/*;q=0.8',
        'Referer':       'https://search.palisaderealty.com/',
      },
      signal: AbortSignal.timeout(20000),
      redirect: 'follow',
    });
    if (!r.ok) return res.status(502).json({ error: `Image fetch returned ${r.status}` });

    mimeType = (r.headers.get('content-type') || 'image/jpeg').split(';')[0].trim();
    const ab = await r.arrayBuffer();
    buffer   = Buffer.from(ab);

    // Derive a clean filename from the URL
    const rawName = new URL(imageUrl).pathname.split('/').pop() || 'listing';
    const ext     = mimeType === 'image/png' ? '.png'
                  : mimeType === 'image/webp' ? '.webp'
                  : mimeType === 'image/gif'  ? '.gif'
                  : '.jpg';
    filename = rawName.match(/\.(jpe?g|png|webp|gif)$/i) ? rawName : rawName.replace(/\.[^.]*$/, '') + ext || 'listing' + ext;
  } catch (err) {
    return res.status(502).json({ error: `Image download failed: ${err.message}` });
  }

  // Upload to Sanity asset API
  const uploadUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/${DATASET}` +
                    `?filename=${encodeURIComponent(filename)}`;
  try {
    const r = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type':   mimeType,
        'Authorization':  `Bearer ${TOKEN}`,
        'Content-Length': String(buffer.length),
      },
      body: buffer,
    });
    const d = await r.json();
    return res.status(r.ok ? 200 : 400).json(d);
  } catch (err) {
    return res.status(500).json({ error: `Sanity upload failed: ${err.message}` });
  }
};

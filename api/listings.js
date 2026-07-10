// Serves featured-properties.json live from GitHub so homepage updates
// appear within seconds of an admin save — no Vercel redeploy required.

const OWNER = 'jomylopo';
const REPO  = 'Palisade_Realty';
const FILE  = 'data/featured-properties.json';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN;

  try {
    const ghRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
          'User-Agent': 'palisade-realty-site',
          ...(token && { Authorization: `token ${token}` }),
        },
      }
    );

    if (!ghRes.ok) {
      console.error('[api/listings] GitHub error', ghRes.status);
      return res.status(502).json({ error: 'GitHub API error', status: ghRes.status });
    }

    const data = await ghRes.json();
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('[api/listings] Fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

// Serves featured-properties.json (and agent-listings-config.json) live from
// GitHub so updates appear within seconds of an admin save — no Vercel redeploy.
// Pass ?type=config to fetch the per-agent featured-listings configuration.

const OWNER = 'jomylopo';
const REPO  = 'Palisade_Realty';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN;
  const isConfig = req.query && req.query.type === 'config';
  const FILE = isConfig
    ? 'data/agent-listings-config.json'
    : 'data/featured-properties.json';

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

    // Config file may not exist yet — return empty object as graceful default
    if (isConfig && ghRes.status === 404) {
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({});
    }

    if (!ghRes.ok) {
      console.error('[api/listings] GitHub error', ghRes.status, FILE);
      return res.status(502).json({ error: 'GitHub API error', status: ghRes.status });
    }

    const data = await ghRes.json();
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Content-Type', 'application/json');

    if (isConfig) {
      return res.status(200).json(
        data && typeof data === 'object' && !Array.isArray(data) ? data : {}
      );
    }
    return res.status(200).json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('[api/listings] Fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

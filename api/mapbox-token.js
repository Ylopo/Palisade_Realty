export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.json({ token: process.env.MAPBOX_PUBLIC_TOKEN || '' });
}

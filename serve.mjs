import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { get as httpsGet } from 'https';
import { get as httpGet } from 'http';
import { exec } from 'child_process';
import { promisify } from 'util';

const PORT = 3000;
const ROOT = fileURLToPath(new URL('.', import.meta.url));
const execAsync = promisify(exec);

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function jsonRes(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function fetchUrl(targetUrl, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    const get = targetUrl.startsWith('https') ? httpsGet : httpGet;
    const r = get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 12000,
    }, resp => {
      if ([301, 302, 303, 307, 308].includes(resp.statusCode) && resp.headers.location) {
        const next = resp.headers.location.startsWith('http')
          ? resp.headers.location
          : new URL(resp.headers.location, targetUrl).href;
        return fetchUrl(next, redirectCount + 1).then(resolve).catch(reject);
      }
      let d = '';
      resp.setEncoding('utf8');
      resp.on('data', c => (d += c));
      resp.on('end', () => resolve(d));
      resp.on('error', reject);
    });
    r.on('error', reject);
    r.on('timeout', () => { r.destroy(); reject(new Error('Request timed out')); });
  });
}

createServer(async (req, res) => {
  const host = req.headers.host || '';
  const rawUrl = req.url || '/';
  const qs = new URLSearchParams(rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?') + 1) : '');
  const url = decodeURIComponent(rawUrl.split('?')[0]);
  const isLocal = host.startsWith('localhost') || host.startsWith('127.');

  // ── Scrape listing from URL ────────────────────────────────────────────
  if (req.method === 'POST' && url === '/api/scrape-listing') {
    if (!isLocal) return jsonRes(res, 403, { ok: false, error: 'Forbidden' });
    try {
      const body = await readBody(req);
      const { listingUrl } = JSON.parse(body);
      if (!listingUrl || !/^https?:\/\//.test(listingUrl)) {
        return jsonRes(res, 400, { ok: false, error: 'Invalid URL' });
      }
      const html = await fetchUrl(listingUrl);
      const data = {};

      // Try __NEXT_DATA__ (Ylopo / Next.js apps)
      const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      if (ndMatch) {
        try {
          const nd = JSON.parse(ndMatch[1]);
          const pp = nd?.props?.pageProps || {};
          const l = pp.listing || pp.property || pp.listingDetail?.listing
               || pp.initialData?.listing || null;
          if (l) {
            const numMatch = (l.streetAddress || l.fullAddress || '').match(/^(\d+)\s+(.*)/);
            data.addressNumber = l.streetNumber || (numMatch ? numMatch[1] : '');
            data.street        = l.streetName   || (numMatch ? numMatch[2] : l.streetAddress || '');
            data.city          = l.city || '';
            data.state         = l.stateOrProvince || l.state || '';
            data.zip           = l.postalCode || l.zipCode || '';
            data.price         = l.listPrice || l.price || 0;
            data.beds          = l.bedroomsTotal || l.bedrooms || 0;
            data.baths         = l.bathroomsFull || l.bathrooms || 0;
            data.sqft          = l.livingArea || l.squareFeet || 0;
            data.lotSize       = l.lotSizeArea ? l.lotSizeArea + ' sqft' : (l.lotSizeAcres ? l.lotSizeAcres + ' acres' : '');
            data.yearBuilt     = l.yearBuilt || 0;
            data.mls           = l.mlsNumber || l.listingId || l.id || '';
            data.description   = l.publicRemarks || l.description || '';
            if (Array.isArray(l.features) && l.features.length) data.features = l.features;
            if (Array.isArray(l.media)) {
              data.photos = l.media.map(m => m.mediaURL || m.url || m.MediaURL || '').filter(Boolean).slice(0, 30);
            } else if (Array.isArray(l.photos)) {
              data.photos = l.photos.map(p => p.url || p.mediaURL || p).filter(s => typeof s === 'string').slice(0, 30);
            }
          }
        } catch { /* silently continue */ }
      }

      // Fallback: og:image, og:description
      if (!data.photos?.length) {
        const ogImg = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
        if (ogImg) data.photos = [ogImg[1]];
      }
      if (!data.description) {
        const ogDesc = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/);
        if (ogDesc) data.description = ogDesc[1];
      }

      return jsonRes(res, 200, { ok: true, data });
    } catch (e) {
      return jsonRes(res, 500, { ok: false, error: e.message });
    }
  }

  // ── Write JSON + git commit + push ────────────────────────────────────
  if (req.method === 'POST' && url === '/api/write-json') {
    if (!isLocal) return jsonRes(res, 403, { ok: false, error: 'Forbidden' });
    const file = qs.get('file') || '';
    if (!/^[a-z][a-z0-9-]*$/.test(file)) {
      return jsonRes(res, 400, { ok: false, error: 'Invalid file name' });
    }
    const filePath = join(ROOT, 'data', file + '.json');
    try {
      const body = await readBody(req);
      JSON.parse(body); // validate JSON before writing
      await writeFile(filePath, body, 'utf8');

      // Attempt git commit + push
      let committed = false, pushed = false, gitError = null;
      const msg = (qs.get('commit') || `Update ${file} via admin`).replace(/"/g, "'");
      try {
        await execAsync(`git add "data/${file}.json"`, { cwd: ROOT });
        await execAsync(`git commit -m "${msg}"`, { cwd: ROOT });
        committed = true;
        try {
          await execAsync('git push', { cwd: ROOT, timeout: 30000 });
          pushed = true;
        } catch (pe) {
          gitError = pe.stderr || pe.message;
        }
      } catch (ce) {
        gitError = ce.stderr || ce.message;
      }

      return jsonRes(res, 200, { ok: true, committed, pushed, gitError });
    } catch (e) {
      return jsonRes(res, 400, { ok: false, error: e.message });
    }
  }

  // ── Create property detail page from template ──────────────────────────
  if (req.method === 'POST' && url === '/api/create-property-page') {
    if (!isLocal) return jsonRes(res, 403, { ok: false, error: 'Forbidden' });
    const slug = qs.get('slug') || '';
    if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
      return jsonRes(res, 400, { ok: false, error: 'Invalid slug' });
    }
    const templatePath = join(ROOT, 'properties', '_template.html');
    const outputPath = join(ROOT, 'properties', slug + '.html');
    try {
      let tpl = await readFile(templatePath, 'utf8');
      tpl = tpl.replace("window.PROPERTY_SLUG = '__SLUG__'", `window.PROPERTY_SLUG = '${slug}'`);
      tpl = tpl.replace(/<title[^>]*>.*?<\/title>/, `<title id="pp-title">${slug} — Palisade Realty</title>`);
      await writeFile(outputPath, tpl, 'utf8');
      return jsonRes(res, 200, { ok: true, path: `/properties/${slug}.html` });
    } catch (e) {
      return jsonRes(res, 500, { ok: false, error: e.message });
    }
  }

  // ── Static file serving ────────────────────────────────────────────────
  const filePath = join(ROOT, url === '/' ? 'index.html' : url);
  try {
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));

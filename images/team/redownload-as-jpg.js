// Re-download all images with Accept header that avoids WebP, so we get JPEG/PNG
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const DIR = path.join(__dirname);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchResponse(url, max = 6) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        // No image/webp → server returns JPEG or PNG
        'Accept': 'image/jpeg,image/png,image/gif,*/*;q=0.5',
      },
    }, (res) => {
      if ([301,302,307,308].includes(res.statusCode) && res.headers.location && max > 0) {
        res.resume();
        const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        return fetchResponse(next, max - 1).then(resolve).catch(reject);
      }
      resolve(res);
    }).on('error', reject).setTimeout(30000, function(){ this.destroy(new Error('Timeout')); });
  });
}

async function download(url, destNoExt) {
  const res = await fetchResponse(url);
  const ct = res.headers['content-type'] || '';
  let ext;
  if      (ct.includes('png'))  ext = '.png';
  else if (ct.includes('gif'))  ext = '.gif';
  else                           ext = '.jpg';

  // Remove old webp file if present
  const webpPath = destNoExt + '.webp';
  if (fs.existsSync(webpPath)) fs.unlinkSync(webpPath);

  const dest = destNoExt + ext;
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => file.close(() => resolve({ dest, ext, ct })));
    file.on('error', err => { try { fs.unlinkSync(dest); } catch(_){} reject(err); });
    res.on('error', reject);
  });
}

function toSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const agents = JSON.parse(fs.readFileSync(path.join(DIR, 'agents.json'), 'utf8'));
  console.log(`\nRe-downloading ${agents.length} images as JPEG/PNG (no WebP)...\n`);

  let ok = 0;
  for (let i = 0; i < agents.length; i++) {
    const a = agents[i];
    const slug = toSlug(a.name);
    const destBase = path.join(DIR, slug);
    process.stdout.write(`  [${String(i+1).padStart(2)}/${agents.length}] ${a.name.padEnd(28)} `);
    try {
      const { dest, ext, ct } = await download(a.image_url, destBase);
      agents[i].local_image = slug + ext;
      console.log(`→ ${slug + ext}  (${ct.split(';')[0]})`);
      ok++;
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
    if (i < agents.length - 1) await sleep(200);
  }

  // Update agents.json with new local_image paths
  fs.writeFileSync(path.join(DIR, 'agents.json'), JSON.stringify(agents, null, 2), 'utf8');
  console.log(`\n✓ Done — ${ok}/${agents.length} images re-downloaded`);
  console.log('✓ agents.json updated with new filenames');
  console.log('\nNow run:  node patch-roles.js   (to regenerate CSV + PDF with the correct images)\n');
}

main().catch(e => { console.error(e); process.exit(1); });

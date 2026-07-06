import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

const OUT_DIR = './assets/images/blog';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Curated Unsplash photo IDs matched to each blog topic
const IMAGES = [
  { file: 'blog-01-sd-luxury-market.jpg',    id: 'photo-1506905925346-21bda4d32df4' }, // San Diego skyline
  { file: 'blog-02-la-jolla.jpg',            id: 'photo-1505118380757-91f5f5632de0' }, // La Jolla coastline
  { file: 'blog-03-home-pricing.jpg',        id: 'photo-1564013799919-ab600027ffc6' }, // Luxury home exterior
  { file: 'blog-04-1031-exchange.jpg',       id: 'photo-1560518883-ce09059eeffa' },    // Modern investment building
  { file: 'blog-05-coronado.jpg',            id: 'photo-1507525428034-b723cf961d3e' }, // Beach/island
  { file: 'blog-06-home-inspection.jpg',     id: 'photo-1558618666-fcd25c85cd64' },    // Home exterior
  { file: 'blog-07-first-time-buyer.jpg',    id: 'photo-1573497019940-1c28c88b4f3e' }, // Couple at home
  { file: 'blog-08-rancho-santa-fe.jpg',     id: 'photo-1512917774080-9991f1c4c750' }, // Luxury estate
  { file: 'blog-09-interest-rates.jpg',      id: 'photo-1611974789855-9c2a0a7236a3' }, // Financial charts
  { file: 'blog-10-smart-upgrades.jpg',      id: 'photo-1484154218962-a197022b5858' }, // Modern kitchen
  { file: 'blog-11-contingencies.jpg',       id: 'photo-1450101499163-c8848c66ca85' }, // Contract signing
  { file: 'blog-12-del-mar.jpg',             id: 'photo-1559494007-9f5847c49d94' },    // Coastal town
  { file: 'blog-13-rent-vs-buy.jpg',         id: 'photo-1486325212027-8081e485255e' }, // House exterior
  { file: 'blog-14-multiple-offers.jpg',     id: 'photo-1571003123894-1f0594d2b5d9' }, // House for sale sign
  { file: 'blog-15-staging.jpg',             id: 'photo-1618219908412-a29a1bb7b86e' }, // Staged living room
  { file: 'blog-16-school-districts.jpg',    id: 'photo-1494526585095-c41746248156' }, // Neighborhood street
  { file: 'blog-17-rental-property.jpg',     id: 'photo-1545324418-cc1a3fa10c00' },    // Apartment building
  { file: 'blog-18-driveway.jpg',            id: 'photo-1568605114967-8130f3a36994' }, // Home with driveway
  { file: 'blog-19-landscaping.jpg',         id: 'photo-1416879595882-3373a0480b5b' }, // Garden/landscaping
  { file: 'blog-20-cash-to-close.jpg',       id: 'photo-1560472355-536de3962603' },    // Handshake/deal closing
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = url.startsWith('https') ? https : http;
    function fetch(u) {
      get.get(u, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fetch(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) { reject(new Error(`${res.statusCode} ${u}`)); return; }
        res.pipe(file);
        file.on('finish', () => { file.close(resolve); });
      }).on('error', e => { fs.unlink(dest, ()=>{}); reject(e); });
    }
    fetch(url);
  });
}

let done = 0;
for (const img of IMAGES) {
  const dest = path.join(OUT_DIR, img.file);
  const url  = `https://images.unsplash.com/${img.id}?w=728&h=480&fit=crop&crop=center&q=80`;
  try {
    await download(url, dest);
    const kb = Math.round(fs.statSync(dest).size / 1024);
    console.log(`✓ ${img.file} (${kb}kb)`);
    done++;
  } catch (e) {
    console.error(`✗ ${img.file} — ${e.message}`);
  }
}
console.log(`\nDone: ${done}/${IMAGES.length}`);

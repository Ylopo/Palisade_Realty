import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'images', 'henderson-communities');
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const COMMUNITIES = [
  { slug: 'real-estate-macdonald-highlands', file: 'macdonald-highlands.jpg' },
  { slug: 'real-estate-ascaya',              file: 'ascaya.jpg' },
  { slug: 'real-estate-lake-las-vegas',      file: 'lake-las-vegas.jpg' },
  { slug: 'real-estate-green-valley-ranch',  file: 'green-valley-ranch.jpg' },
  { slug: 'real-estate-anthem-country-club', file: 'anthem-country-club.jpg' },
  { slug: 'real-estate-seven-hills',         file: 'seven-hills.jpg' },
  { slug: 'real-estate-inspirada',           file: 'inspirada.jpg' },
  { slug: 'real-estate-cadence',             file: 'cadence.jpg' },
  { slug: 'real-estate-sun-city-anthem',     file: 'sun-city-anthem.jpg' },
];

for (const c of COMMUNITIES) {
  const url = `https://www.palisaderealty.com/henderson-communities/${c.slug}`;
  console.log(`Visiting: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));

    const imgSrc = await page.evaluate(() => {
      const og = document.querySelector('meta[property="og:image"]');
      if (og && og.content && !og.content.includes('palisaderealty.png')) return og.content;
      // Try largest img on page
      const imgs = Array.from(document.querySelectorAll('img[src]'));
      for (const img of imgs) {
        const src = img.src || '';
        if (src.includes('squarespace') && !src.includes('palisaderealty')) return src;
      }
      return null;
    });

    if (!imgSrc) { console.log(`  No image for ${c.file}`); continue; }
    console.log(`  Src: ${imgSrc.substring(0, 80)}`);

    const res = await fetch(imgSrc);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(join(OUT, c.file), buf);
    console.log(`  Saved ${c.file} (${buf.length} bytes)`);
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }
}

await browser.close();
console.log('\nDone.');

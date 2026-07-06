import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const url = 'http://localhost:3000/homepage-test-1.html';
const dir = './temporary screenshots';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Force all reveals
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});
await new Promise(r => setTimeout(r, 300));

// Get section positions
const positions = await page.evaluate(() => {
  const sections = {
    hero: document.getElementById('hero'),
    listings: document.getElementById('listings'),
    homematch: document.getElementById('homematch'),
    sell: document.getElementById('sell'),
    communities: document.getElementById('communities'),
    team: document.getElementById('team'),
    contact: document.getElementById('contact'),
  };
  return Object.fromEntries(
    Object.entries(sections).map(([k, el]) => [k, el ? el.getBoundingClientRect().top + window.scrollY : 0])
  );
});

const sections = [
  { name: 'hero', y: 0 },
  { name: 'listings', y: positions.listings },
  { name: 'homematch', y: positions.homematch },
  { name: 'sell', y: positions.sell },
  { name: 'communities', y: positions.communities },
  { name: 'team', y: positions.team },
  { name: 'contact', y: positions.contact },
];

let n = 1;
while (existsSync(`${dir}/screenshot-${n}-hp-hero.png`)) n++;

for (const s of sections) {
  await page.evaluate((y) => window.scrollTo(0, y), s.y);
  await new Promise(r => setTimeout(r, 250));
  await page.screenshot({ path: `${dir}/screenshot-${n}-hp-${s.name}.png` }); // viewport only, no fullPage
  console.log(`${s.name}: screenshot-${n}-hp-${s.name}.png`);
}

await browser.close();

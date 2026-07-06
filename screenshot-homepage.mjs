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

// Scroll slowly through page to trigger IntersectionObservers
const height = await page.evaluate(() => document.body.scrollHeight);
const steps = Math.ceil(height / 600);
for (let i = 0; i <= steps; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * 600);
  await new Promise(r => setTimeout(r, 100));
}
// Force all reveal elements visible
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});
// Scroll back to top
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 500));

// Full page
let n = 1;
while (existsSync(`${dir}/screenshot-${n}-homepage-full.png`)) n++;
await page.screenshot({ path: `${dir}/screenshot-${n}-homepage-full.png`, fullPage: true });
console.log(`Full page: ${dir}/screenshot-${n}-homepage-full.png`);

// Hero crop
await page.screenshot({ path: `${dir}/screenshot-${n}-hero.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log(`Hero: ${dir}/screenshot-${n}-hero.png`);

// Intro + cards crop
await page.evaluate(() => window.scrollTo(0, 900));
await new Promise(r => setTimeout(r, 200));
await page.screenshot({ path: `${dir}/screenshot-${n}-intro.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log(`Intro: ${dir}/screenshot-${n}-intro.png`);

await browser.close();

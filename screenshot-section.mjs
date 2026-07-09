import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const dir = './temporary screenshots';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000/communities/mission-hills-real-estate.html', { waitUntil: 'networkidle2', timeout: 60000 });

// Force reveals + dropdown open
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  const dd = document.querySelector('.nav-dropdown');
  if (dd) dd.classList.add('is-open');
});
await new Promise(r => setTimeout(r, 400));

// Dropdown
await page.screenshot({ path: `${dir}/screenshot-mh2-dropdown.png`, clip: { x: 0, y: 0, width: 700, height: 420 } });

// Full page
await page.evaluate(() => { const dd = document.querySelector('.nav-dropdown'); if (dd) dd.classList.remove('is-open'); });
await page.screenshot({ path: `${dir}/screenshot-mh2-full.png`, fullPage: true });

await browser.close();
console.log('Done');

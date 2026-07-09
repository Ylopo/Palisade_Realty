import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const dir = './temporary screenshots';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

// index.html dropdown
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 60000 });
await page.evaluate(() => {
  const dd = document.querySelector('.nav-dropdown');
  if (dd) dd.classList.add('is-open');
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: `${dir}/screenshot-index-dropdown.png`, clip: { x: 0, y: 0, width: 900, height: 380 } });
console.log('index dropdown done');

// communities.html dropdown
await page.goto('http://localhost:3000/communities.html', { waitUntil: 'networkidle2', timeout: 60000 });
await page.evaluate(() => {
  const dd = document.querySelector('.nav-dropdown');
  if (dd) dd.classList.add('is-open');
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: `${dir}/screenshot-communities-dropdown.png`, clip: { x: 0, y: 0, width: 900, height: 380 } });
console.log('communities dropdown done');

await browser.close();
console.log('All done');

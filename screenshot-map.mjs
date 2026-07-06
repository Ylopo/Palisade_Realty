import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const dir = './temporary screenshots';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000/mapsample.html', { waitUntil: 'networkidle2', timeout: 30000 });
// Wait for Mapbox tiles to render (GL rendering happens after network idle)
await new Promise(r => setTimeout(r, 5000));

let n = 1;
while (existsSync(`${dir}/screenshot-${n}-map-dark.png`)) n++;
await page.screenshot({ path: `${dir}/screenshot-${n}-map-dark.png` });
console.log(`Saved: ${dir}/screenshot-${n}-map-dark.png`);
await browser.close();

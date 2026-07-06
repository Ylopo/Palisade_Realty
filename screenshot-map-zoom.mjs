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
await new Promise(r => setTimeout(r, 4000));

// Screenshot just the map container element
const mapEl = await page.$('#lfyp-map');
let n = 1;
while (existsSync(`${dir}/screenshot-${n}-map-sd-zoom.png`)) n++;
await mapEl.screenshot({ path: `${dir}/screenshot-${n}-map-sd-zoom.png` });
console.log(`Saved: ${dir}/screenshot-${n}-map-sd-zoom.png`);
await browser.close();

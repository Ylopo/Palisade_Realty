import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));

// Scroll stats section into view to trigger IntersectionObserver
await page.evaluate(() => document.getElementById('stats').scrollIntoView());
await new Promise(r => setTimeout(r, 2200)); // wait for 1800ms animation + buffer

const section = await page.$('#stats');
await section.screenshot({ path: './temporary screenshots/screenshot-stats-counter.png' });
console.log('Saved');
await browser.close();

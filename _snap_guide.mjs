import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/anthem-country-club.html', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 600));

// Scroll to buyer guide section header
const headerY = await page.evaluate(() => {
  const el = document.querySelector('.buyer-guide-section');
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), headerY);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: './temporary screenshots/guide-1-header.png' });

// Scroll to first image (sticky list visible)
const imgY = await page.evaluate(() => {
  const el = document.querySelector('.buyer-guide-img-item');
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
await page.evaluate(top => window.scrollTo({ top: top + 200, behavior: 'instant' }), imgY);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: './temporary screenshots/guide-2-sticky.png' });

// Scroll to 2nd image
await page.evaluate(top => window.scrollTo({ top: top + 900, behavior: 'instant' }), imgY);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: './temporary screenshots/guide-3-scroll.png' });

console.log('Done');
await browser.close();

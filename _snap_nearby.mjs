import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/anthem-country-club.html', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 800));

const y = await page.evaluate(() => {
  const el = document.querySelector('.nearby-section');
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: './temporary screenshots/nearby-1-default.png' });

// Activate card 2 (MacDonald Highlands) via arrow click and screenshot
await page.click('#nearbyNext');
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: './temporary screenshots/nearby-2-card2.png' });

// Activate card 4 (Ascaya)
await page.click('#nearbyNext');
await page.click('#nearbyNext');
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: './temporary screenshots/nearby-3-card4.png' });

console.log('Done');
await browser.close();

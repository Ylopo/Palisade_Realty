import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/anthem-country-club.html', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 600));

// Scroll to listings section
const y = await page.evaluate(() => {
  const el = document.getElementById('listings');
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: './temporary screenshots/acc-listings-top.png' });

// Scroll down one viewport to see the grid
await page.evaluate(top => window.scrollTo({ top: top + 900, behavior: 'instant' }), y);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: './temporary screenshots/acc-listings-mid.png' });

console.log('Done');
await browser.close();

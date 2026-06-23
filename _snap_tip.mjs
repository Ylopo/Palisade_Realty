import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/anthem-country-club.html', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 500));

const y = await page.evaluate(() => {
  const tips = document.querySelectorAll('.buyer-tip');
  return tips[0] ? tips[0].getBoundingClientRect().top + window.scrollY : 0;
});
await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: './temporary screenshots/acc-tip1.png' });

const y2 = await page.evaluate(() => {
  const tips = document.querySelectorAll('.buyer-tip');
  return tips[0] ? tips[0].getBoundingClientRect().top + window.scrollY + 900 : 900;
});
await page.evaluate(top => window.scrollTo({ top: top, behavior: 'instant' }), y2);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: './temporary screenshots/acc-tip1b.png' });

console.log('Done');
await browser.close();

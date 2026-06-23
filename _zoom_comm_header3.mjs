import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 2000 });
await page.goto('http://localhost:3000/henderson-community.html', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 400));

// Take full page screenshot and find section visually
await page.screenshot({ path: './temporary screenshots/screenshot-full-page.png', fullPage: false });

// Get the header rect
const rect = await page.evaluate(() => {
  const el = document.querySelector('.sticky-comm-header');
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, left: r.left, width: r.width, height: r.height };
});
console.log('Header rect:', rect);

// Screenshot just that element
const el = await page.$('.sticky-comm-header');
await el.screenshot({ path: './temporary screenshots/screenshot-more-comm-header.png' });
console.log('Done');
await browser.close();

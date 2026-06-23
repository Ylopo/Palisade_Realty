import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/henderson-community.html', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 400));

// Scroll to the sticky-comm-header and grab viewport at that position
const headerY = await page.evaluate(() => {
  const el = document.querySelector('.sticky-comm-header');
  return el.getBoundingClientRect().top + window.scrollY;
});
await page.evaluate(y => window.scrollTo({ top: y - 20, behavior: 'instant' }), headerY);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: './temporary screenshots/screenshot-comm-header2.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });

console.log('Done');
await browser.close();

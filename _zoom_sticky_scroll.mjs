import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/henderson-community.html', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));

// Screenshot the header of the sticky section
await page.evaluate(() => document.querySelector('.sticky-comm-section').scrollIntoView());
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: './temporary screenshots/screenshot-sticky-top.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

// Scroll so the 3rd image (The Fountains) is centered — simulates mid-scroll state
await page.evaluate(() => {
  const imgs = document.querySelectorAll('.sticky-comm-img-item');
  imgs[3].scrollIntoView({ behavior: 'instant', block: 'center' });
});
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: './temporary screenshots/screenshot-sticky-mid.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

// Screenshot just the full sticky section from the section start for overall view
await page.evaluate(() => document.querySelector('.sticky-comm-wrap').scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 300));
const wrap = await page.$('.sticky-comm-wrap');
await wrap.screenshot({ path: './temporary screenshots/screenshot-sticky-wrap.png' });

console.log('Done');
await browser.close();

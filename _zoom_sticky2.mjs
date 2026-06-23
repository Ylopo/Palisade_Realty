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

// Find the exact scroll position of the 4th image (The Fountains) center
const scrollY = await page.evaluate(() => {
  const img = document.querySelectorAll('.sticky-comm-img-item')[3];
  const rect = img.getBoundingClientRect();
  // Scroll so the center of this image is at 50% of viewport
  return window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
});
await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: './temporary screenshots/screenshot-sticky-viewport.png' });

// Also screenshot from start of sticky section
const sectionTop = await page.evaluate(() => {
  return document.querySelector('.sticky-comm-section').getBoundingClientRect().top + window.scrollY;
});
await page.evaluate(y => window.scrollTo({ top: y + 80, behavior: 'instant' }), sectionTop);
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: './temporary screenshots/screenshot-sticky-start.png' });

console.log('Done');
await browser.close();

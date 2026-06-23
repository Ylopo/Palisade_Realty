import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 600));
const section = await page.$('#hero');
await section.screenshot({ path: './temporary screenshots/screenshot-hero-carousel.png' });
console.log('Saved hero screenshot');
await browser.close();

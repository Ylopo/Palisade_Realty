import puppeteer from 'puppeteer-core';
const exe = String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`;
const browser = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000/homepage.html', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1200));
const clip = await page.evaluate(() => {
  const el = document.getElementById('blog');
  const r = el.getBoundingClientRect();
  return { x: 0, y: r.top + window.scrollY, width: 1440, height: r.height };
});
await page.screenshot({ path: './temporary screenshots/screenshot-blog.png', clip });
await browser.close();
console.log('saved', clip);

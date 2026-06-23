import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await page.evaluate(() => document.getElementById('blog').scrollIntoView());
await new Promise(r => setTimeout(r, 600));
const section = await page.$('#blog');
await section.screenshot({ path: './temporary screenshots/screenshot-blog.png' });
console.log('Saved blog screenshot');

// Click "Buyer" filter
const btns = await page.$$('.blog-filter-btn');
if (btns[1]) {
  await btns[1].click();
  await new Promise(r => setTimeout(r, 400));
  await section.screenshot({ path: './temporary screenshots/screenshot-blog-buyer.png' });
  console.log('Saved buyer filter screenshot');
}

await browser.close();

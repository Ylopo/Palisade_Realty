import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

// Force all reveal elements visible
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});
await new Promise(r => setTimeout(r, 400));

const section = await page.$('#testimonial');
await section.screenshot({ path: './temporary screenshots/screenshot-3-testimonial-v1.png' });
console.log('Screenshot 1 saved');

// Click 3rd avatar (DL)
const btns = await page.$$('.tp-avatar-btn');
if (btns[2]) {
  await btns[2].click();
  await new Promise(r => setTimeout(r, 700));
  await section.screenshot({ path: './temporary screenshots/screenshot-4-testimonial-v1-slot3.png' });
  console.log('Screenshot 2 (slot 3 - Dioselina Lopez) saved');
}

await browser.close();

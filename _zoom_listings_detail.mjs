import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await page.evaluate(() => document.getElementById('listings').scrollIntoView());
await new Promise(r => setTimeout(r, 400));

// Crop to just the first card's info strip
const card = await page.$('.prop-card:nth-child(2) .p-info');
await card.screenshot({ path: './temporary screenshots/screenshot-listings-card-detail.png' });
console.log('Saved card detail');
await browser.close();

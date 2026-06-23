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

// Screenshot listings section header
await page.evaluate(() => document.getElementById('listings').scrollIntoView());
await new Promise(r => setTimeout(r, 300));
const listingsHeader = await page.$('#listings .section-header');
await listingsHeader.screenshot({ path: './temporary screenshots/screenshot-listings-header.png' });

// Screenshot sticky-comm header
await page.evaluate(() => document.querySelector('.sticky-comm-section').scrollIntoView());
await new Promise(r => setTimeout(r, 300));
const commHeader = await page.$('.sticky-comm-header');
await commHeader.screenshot({ path: './temporary screenshots/screenshot-comm-header.png' });

console.log('Done');
await browser.close();

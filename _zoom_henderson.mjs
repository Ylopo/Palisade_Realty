import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/henderson-community.html', { waitUntil: 'networkidle2' });

// Force all reveals visible
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 600));

// Screenshot hero
const hero = await page.$('.hero-section');
await hero.screenshot({ path: './temporary screenshots/screenshot-henderson-hero.png' });

// Scroll to intro
await page.evaluate(() => document.querySelector('.intro-section').scrollIntoView());
await new Promise(r => setTimeout(r, 400));
const intro = await page.$('.intro-section');
await intro.screenshot({ path: './temporary screenshots/screenshot-henderson-intro.png' });

// Scroll to community grid
await page.evaluate(() => document.querySelector('.comm-section').scrollIntoView());
await new Promise(r => setTimeout(r, 600));
const commSection = await page.$('.comm-section');
await commSection.screenshot({ path: './temporary screenshots/screenshot-henderson-communities.png' });

// Scroll to all-communities
await page.evaluate(() => document.querySelector('.all-comm-section').scrollIntoView());
await new Promise(r => setTimeout(r, 400));
const allComm = await page.$('.all-comm-section');
await allComm.screenshot({ path: './temporary screenshots/screenshot-henderson-allcomm.png' });

console.log('All Henderson screenshots saved');
await browser.close();

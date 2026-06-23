import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Screenshot dropdown on index.html
await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle2' });
await page.hover('.nav-has-dropdown');
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: './temporary screenshots/dropdown-index.png' });

// Screenshot dropdown on henderson-community.html
await page.goto('http://localhost:3000/henderson-community.html', { waitUntil: 'networkidle2' });
await page.hover('.nav-has-dropdown');
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: './temporary screenshots/dropdown-henderson.png' });

// Screenshot dropdown on anthem-country-club.html
await page.goto('http://localhost:3000/anthem-country-club.html', { waitUntil: 'networkidle2' });
await page.hover('.nav-has-dropdown');
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: './temporary screenshots/dropdown-anthem.png' });

console.log('Done');
await browser.close();

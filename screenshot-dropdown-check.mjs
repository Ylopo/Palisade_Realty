import puppeteer from 'puppeteer-core';

const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000/team.html', { waitUntil: 'networkidle2', timeout: 20000 });
await page.click('.nav-dropdown-trigger');
await new Promise(r => setTimeout(r, 350));
await page.screenshot({ path: './temporary screenshots/screenshot-31-dropdown.png', clip: { x:0, y:0, width:1440, height:500 } });
await browser.close();
console.log('done');

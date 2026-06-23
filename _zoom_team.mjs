import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
const section = await page.$('#team');
if (section) {
  await section.screenshot({ path: './temporary screenshots/screenshot-2-team-zoom.png' });
  console.log('Saved');
} else {
  console.log('Not found');
}
await browser.close();

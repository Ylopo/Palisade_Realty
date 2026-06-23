import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://www.rangedevelopmentsgroup.com/', { waitUntil: 'networkidle2', timeout: 45000 });
await new Promise(r => setTimeout(r, 3000));

// Find the section-4-v2-b element and screenshot it
const section = await page.$('.section-4-v2-b');
if (section) {
  await section.screenshot({ path: './temporary screenshots/screenshot-range-section4.png' });
  console.log('Saved section-4-v2-b screenshot');
} else {
  // Full page screenshot to locate visually
  await page.screenshot({ path: './temporary screenshots/screenshot-range-full.png', fullPage: true });
  console.log('section-4-v2-b not found, saved full page');
}

// Also get the outer HTML of the section
const html = await page.evaluate(() => {
  const el = document.querySelector('.section-4-v2-b');
  return el ? el.outerHTML.substring(0, 4000) : 'Not found — checking all sections';
});
console.log('\n--- Section HTML ---\n', html.substring(0, 2000));

await browser.close();

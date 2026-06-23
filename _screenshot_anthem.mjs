import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/anthem-country-club.html', { waitUntil: 'networkidle2' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 600));

async function snapAt(selector, file) {
  const y = await page.evaluate(sel => {
    const el = document.querySelector(sel);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }, selector);
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: file });
}

await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 200));
await page.screenshot({ path: './temporary screenshots/acc-1-hero.png' });

await snapAt('.intro-section', './temporary screenshots/acc-2-intro.png');
await snapAt('.buyer-tips-section', './temporary screenshots/acc-3-tips-header.png');
await snapAt('.buyer-tip:nth-child(1)', './temporary screenshots/acc-3-tip1.png');
await snapAt('.faq-section', './temporary screenshots/acc-4-faq.png');
await snapAt('.testimonials-section', './temporary screenshots/acc-5-testimonials.png');
await snapAt('.nearby-section', './temporary screenshots/acc-6-nearby.png');
await snapAt('.cta-section', './temporary screenshots/acc-7-cta.png');

console.log('Done');
await browser.close();

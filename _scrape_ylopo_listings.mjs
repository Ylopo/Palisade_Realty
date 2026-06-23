import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'fs';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

// Try the Ylopo search filtered to Henderson
const url = 'https://search.palisaderealty.com/?searchType=city&city=Henderson&state=NV&status=active&sortBy=listingDate&sortOrder=desc';
console.log('Loading:', url);

await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
await new Promise(r => setTimeout(r, 6000));

const result = await page.evaluate(() => {
  // Try various selectors for property cards
  const trySelectors = [
    '.listing-card',
    '.property-card',
    '[class*="ListingCard"]',
    '[class*="PropertyCard"]',
    '[class*="listing-item"]',
    '[data-testid*="listing"]',
    '.card',
    'article',
    '[class*="result"]',
  ];

  const found = {};
  for (const sel of trySelectors) {
    const els = document.querySelectorAll(sel);
    if (els.length > 0) {
      found[sel] = { count: els.length, sample: els[0].outerHTML.substring(0, 400) };
    }
  }

  return {
    url: window.location.href,
    title: document.title,
    found,
    bodyPreview: document.body.innerText.substring(0, 2000),
  };
});

console.log('URL:', result.url);
console.log('Title:', result.title);
console.log('Selectors found:', Object.keys(result.found));
if (Object.keys(result.found).length > 0) {
  console.log('First match sample:', JSON.stringify(Object.values(result.found)[0], null, 2));
}
console.log('Body preview:', result.bodyPreview.substring(0, 1000));

// Take a screenshot to see the page visually
await page.screenshot({ path: './temporary screenshots/screenshot-ylopo-search.png' });
console.log('Screenshot saved');

await browser.close();

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

console.log('Loading Henderson real estate page...');
await page.goto('https://www.palisaderealty.com/communities/henderson-real-estate', {
  waitUntil: 'networkidle2',
  timeout: 45000
});

// Wait for IDX listings to render
await new Promise(r => setTimeout(r, 6000));

// Try to find listing elements
const listings = await page.evaluate(() => {
  const results = [];

  // Common IDX/property card selectors
  const selectors = [
    '[class*="listing"]',
    '[class*="property"]',
    '[class*="prop-"]',
    '[class*="card"]',
    '.idx-listing',
    '.listing-card',
    '.property-card',
    '[data-listing]',
    '[data-property]',
    'article',
  ];

  // Check what's on page
  for (const sel of selectors) {
    const els = document.querySelectorAll(sel);
    if (els.length > 0) {
      results.push({ selector: sel, count: els.length, sample: els[0].textContent.trim().substring(0, 200) });
    }
  }

  // Also dump all iframes
  const iframes = Array.from(document.querySelectorAll('iframe')).map(f => ({
    src: f.src,
    id: f.id,
    className: f.className,
    width: f.width,
    height: f.height,
  }));

  // Dump full page text to see what's there
  const bodyText = document.body.innerText.substring(0, 3000);

  return { results, iframes, bodyText };
});

console.log('Iframes found:', listings.iframes);
console.log('Selectors with content:', listings.results.slice(0, 10));
console.log('Body text sample:', listings.bodyText);

await browser.close();

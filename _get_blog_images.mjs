import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'images', 'blogs-image');
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Target posts: slug → filename, category
const POSTS = [
  { slug: '2026/6/11/why-having-a-good-driveway-matters-when-selling-your-home',       file: 'driveway-selling.jpg',      cat: 'Seller', date: 'Jun 11, 2026', title: "Here's Why Having A Good Driveway Matters When Selling Your Home" },
  { slug: '2026/5/21/landscaping-costs-homebuyers-forget-to-budget-for',               file: 'landscaping-buyer.jpg',     cat: 'Buyer',  date: 'May 21, 2026', title: "One Thing Most Home Buyers Forget to Budget For: Landscaping" },
  { slug: '2026/4/15/understanding-cash-to-close-in-real-estate',                      file: 'cash-to-close.jpg',         cat: 'Buyer',  date: 'Apr 14, 2026', title: "Understanding Cash to Close When Purchasing A Home" },
  { slug: '2026/3/27/easy-and-inexpensive-bathroom-updates-you-can-make-before-selling-your-home', file: 'bathroom-updates-seller.jpg', cat: 'Seller', date: 'Mar 26, 2026', title: "Easy and Inexpensive Bathroom Updates Before Selling Your Home" },
  { slug: '2026/3/16/where-to-keep-your-down-payment-savings',                         file: 'down-payment-savings.jpg',  cat: 'Buyer',  date: 'Mar 16, 2026', title: "Where to Keep Your Down Payment Savings For Your Dream Home" },
  { slug: '2025/9/16/how-many-showings-does-it-take-to-sell-a-house',                  file: 'showings-seller.jpg',       cat: 'Seller', date: 'Sep 15, 2025', title: "How Many Showings Does It Take To Sell A House?" },
];

const results = [];

for (const post of POSTS) {
  const url = `https://www.palisaderealty.com/blog/${post.slug}`;
  console.log(`Visiting: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Get the main hero/featured image src
  const imgSrc = await page.evaluate(() => {
    // Try meta og:image first (most reliable for featured image)
    const og = document.querySelector('meta[property="og:image"]');
    if (og && og.content) return og.content;
    // Fallback: first large img in the article/main content
    const imgs = Array.from(document.querySelectorAll('img[src]'));
    for (const img of imgs) {
      const w = img.naturalWidth || img.width;
      if (w > 300) return img.src;
    }
    return null;
  });

  if (!imgSrc) {
    console.log(`  No image found for ${post.file}`);
    results.push({ ...post, localPath: null });
    continue;
  }

  console.log(`  Image: ${imgSrc.substring(0, 80)}...`);

  // Download via fetch in Node
  try {
    const res = await fetch(imgSrc);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const outPath = join(OUT, post.file);
    const { writeFileSync } = await import('fs');
    writeFileSync(outPath, buf);
    console.log(`  Saved → ${post.file} (${buf.length} bytes)`);
    results.push({ ...post, localPath: `images/blogs-image/${post.file}` });
  } catch (e) {
    console.log(`  Download failed: ${e.message}`);
    results.push({ ...post, localPath: null });
  }
}

await browser.close();

console.log('\n=== RESULTS ===');
results.forEach(r => console.log(JSON.stringify({ file: r.file, cat: r.cat, date: r.date, title: r.title, ok: !!r.localPath })));

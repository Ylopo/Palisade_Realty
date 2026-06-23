import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'index.html');
let html = readFileSync(file, 'utf8');

// ── NEW CSS (appended after existing .blog-cta rule) ──────────────────────────
const OLD_CSS_TAIL = `    .blog-cta {
      display: flex;
      justify-content: center;
      margin-top: 48px;
    }`;

const NEW_CSS_TAIL = `    .blog-cta {
      display: flex;
      justify-content: center;
      margin-top: 48px;
    }
    /* — Blog filter — */
    .blog-filter-bar {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 40px;
    }
    .blog-filter-btn {
      font-family: var(--font-label);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 8px 22px;
      border-radius: 40px;
      border: 1.5px solid rgba(0,0,0,0.15);
      background: transparent;
      color: var(--near-black);
      cursor: pointer;
      transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
    }
    .blog-filter-btn:hover {
      border-color: var(--gold);
      color: var(--gold);
    }
    .blog-filter-btn.is-active {
      background: var(--gold);
      border-color: var(--gold);
      color: var(--white);
    }
    /* — Blog card extras — */
    .blog-card-cat {
      display: inline-block;
      font-family: var(--font-label);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 6px;
    }
    .blog-card-excerpt {
      font-family: var(--font-body);
      font-size: 13px;
      line-height: 1.65;
      color: #6b6b6b;
      margin-top: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .blog-card-read {
      display: inline-block;
      margin-top: 14px;
      font-family: var(--font-label);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--gold);
      text-decoration: none;
      border-bottom: 1px solid rgba(184,154,94,0.35);
      transition: border-color 0.2s ease, color 0.2s ease;
    }
    .blog-card-read:hover { border-color: var(--gold); }
    /* — Filter hide/show — */
    .blog-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.35s ease;
    }
    .blog-card[data-hidden] {
      opacity: 0;
      pointer-events: none;
      position: absolute;
      visibility: hidden;
    }
    .blog-grid-wrap {
      position: relative;
    }`;

html = html.replace(OLD_CSS_TAIL, NEW_CSS_TAIL);
console.log('CSS updated.');

// ── NEW HTML SECTION ─────────────────────────────────────────────────────────
const POSTS = [
  {
    file: 'driveway-selling.jpg',
    cat: 'Seller',
    date: 'Jun 11, 2026',
    title: "Here's Why Having A Good Driveway Matters When Selling Your Home",
    excerpt: "If you're preparing your house to hit the market, your driveway plays a crucial role in curb appeal. Simple improvements can boost appearance, functionality, and value.",
    url: 'https://www.palisaderealty.com/blog/2026/6/11/why-having-a-good-driveway-matters-when-selling-your-home',
  },
  {
    file: 'landscaping-buyer.jpg',
    cat: 'Buyer',
    date: 'May 21, 2026',
    title: "One Thing Most Home Buyers Forget to Budget For: Landscaping",
    excerpt: "Understanding the true costs of landscaping before purchasing can help first-time home buyers avoid financial surprises down the road.",
    url: 'https://www.palisaderealty.com/blog/2026/5/21/landscaping-costs-homebuyers-forget-to-budget-for',
  },
  {
    file: 'cash-to-close.jpg',
    cat: 'Buyer',
    date: 'Apr 14, 2026',
    title: "Understanding Cash to Close When Purchasing A Home",
    excerpt: "Beyond the purchase price and down payment, there are dozens of smaller fees and adjustments in any real estate transaction. Here's what to expect.",
    url: 'https://www.palisaderealty.com/blog/2026/4/15/understanding-cash-to-close-in-real-estate',
  },
  {
    file: 'bathroom-updates-seller.jpg',
    cat: 'Seller',
    date: 'Mar 26, 2026',
    title: "Easy and Inexpensive Bathroom Updates Before Selling Your Home",
    excerpt: "These easy, affordable upgrades bring style and boost functionality without breaking the bank — and are perfect even if your DIY skills are a little rusty.",
    url: 'https://www.palisaderealty.com/blog/2026/3/27/easy-and-inexpensive-bathroom-updates-you-can-make-before-selling-your-home',
  },
  {
    file: 'down-payment-savings.jpg',
    cat: 'Buyer',
    date: 'Mar 16, 2026',
    title: "Where to Keep Your Down Payment Savings For Your Dream Home",
    excerpt: "Saving for a down payment is the biggest hurdle to homeownership for many. Here's where to keep that money so it grows safely until you're ready.",
    url: 'https://www.palisaderealty.com/blog/2026/3/16/where-to-keep-your-down-payment-savings',
  },
  {
    file: 'showings-seller.jpg',
    cat: 'Seller',
    date: 'Sep 15, 2025',
    title: "How Many Showings Does It Take To Sell A House?",
    excerpt: "Photos and virtual tours are great, but nothing replaces stepping inside a home. Here's what the data says about showings and how to make each one count.",
    url: 'https://www.palisaderealty.com/blog/2025/9/16/how-many-showings-does-it-take-to-sell-a-house',
  },
];

function card(p, i) {
  const stagger = (i % 3) + 1;
  return (
    `\n      <article class="blog-card reveal stagger-${stagger}" data-cat="${p.cat}">`
    + `\n        <a href="${p.url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">`
    + `\n        <div class="blog-card-img">`
    + `\n          <img src="images/blogs-image/${p.file}" alt="${p.title}" loading="lazy">`
    + `\n          <span class="blog-card-date">${p.date}</span>`
    + `\n        </div>`
    + `\n        <div class="blog-card-body">`
    + `\n          <span class="blog-card-cat">${p.cat}</span>`
    + `\n          <h3 class="blog-card-title">${p.title}</h3>`
    + `\n          <p class="blog-card-excerpt">${p.excerpt}</p>`
    + `\n          <span class="blog-card-read">Read More &rarr;</span>`
    + `\n        </div>`
    + `\n        </a>`
    + `\n      </article>`
  );
}

const NEW_SECTION =
  `  <!-- ── BLOG ──────────────────────────────────────────────────────── -->\n`
  + `  <section class="blog-section" id="blog" aria-label="Blog and market insights">\n`
  + `    <div class="section-header">\n`
  + `      <p class="eyebrow reveal">Latest Insights &amp; Market Trends</p>\n`
  + `      <h2 class="section-title reveal stagger-1">Real Estate Tips &amp; Expert Advice</h2>\n`
  + `    </div>\n\n`
  + `    <div class="blog-filter-bar reveal stagger-2">\n`
  + `      <button class="blog-filter-btn is-active" data-filter="all">All</button>\n`
  + `      <button class="blog-filter-btn" data-filter="Buyer">Buyer</button>\n`
  + `      <button class="blog-filter-btn" data-filter="Seller">Seller</button>\n`
  + `    </div>\n\n`
  + `    <div class="blog-grid-wrap">\n`
  + `    <div class="blog-grid" id="blogGrid">`
  + POSTS.map(card).join('')
  + `\n    </div>\n`
  + `    </div>\n\n`
  + `    <div class="blog-cta reveal stagger-4">\n`
  + `      <a href="https://www.palisaderealty.com/blog" target="_blank" rel="noopener" class="btn-outline-gold">View All Posts</a>\n`
  + `    </div>\n`
  + `  </section>`;

const HTML_START = '  <!-- ── BLOG ──────────────────────────────────────────────────────── -->';
const HTML_END   = '\n\n  <!-- ── FAQ ─';
const hS = html.indexOf(HTML_START);
const hE = html.indexOf(HTML_END);
if (hS === -1) { console.error('Blog HTML start not found'); process.exit(1); }
if (hE === -1) { console.error('Blog HTML end not found'); process.exit(1); }
html = html.slice(0, hS) + NEW_SECTION + html.slice(hE);
console.log('HTML replaced.');

// ── NEW JS (inject before hero carousel) ─────────────────────────────────────
const JS_MARKER = '    /* ── 7. HERO CAROUSEL ──────────────────────────────────────────── */';
const FILTER_JS = `    /* ── 7. BLOG FILTER ───────────────────────────────────────────────── */
    (function () {
      var btns  = document.querySelectorAll('.blog-filter-btn');
      var cards = document.querySelectorAll('.blog-card[data-cat]');
      if (!btns.length) return;

      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          btns.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          var filter = btn.dataset.filter;
          cards.forEach(function (card) {
            if (filter === 'all' || card.dataset.cat === filter) {
              card.removeAttribute('data-hidden');
            } else {
              card.setAttribute('data-hidden', '');
            }
          });
        });
      });
    })();

    /* ── 8. HERO CAROUSEL ──────────────────────────────────────────── */`;

html = html.replace(JS_MARKER, FILTER_JS);
console.log('JS injected.');

writeFileSync(file, html, 'utf8');
console.log('Done! Blog section updated.');

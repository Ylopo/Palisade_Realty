import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'index.html');
let html = readFileSync(file, 'utf8');

// ── NEW CSS ────────────────────────────────────────────────────────────────
const NEW_CSS = `    /* ── TESTIMONIAL POPOUT ────────────────────────────────────────── */
    .tp-section {
      padding: 100px var(--pad-x);
      background: #0d0d0d;
      overflow: hidden;
    }
    .tp-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      margin-bottom: 52px;
    }
    .tp-eyebrow {
      font-family: var(--font-label);
      font-size: 11px;
      font-weight: 500;
      color: var(--gold);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .tp-heading {
      font-family: var(--font-display);
      font-size: clamp(36px, 5vw, 64px);
      color: var(--white);
      line-height: 1.0;
      letter-spacing: -0.01em;
    }
    /* — Avatar row — */
    .tp-avatar-row {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 32px;
    }
    .tp-avatar-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }
    .tp-avatar-initials {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: rgba(184,154,94,0.12);
      border: 2px solid rgba(184,154,94,0.22);
      color: var(--gold);
      font-family: var(--font-label);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.04em;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94),
                  box-shadow 0.28s ease,
                  border-color 0.28s ease,
                  background 0.28s ease;
    }
    .tp-avatar-btn:hover .tp-avatar-initials {
      transform: translateY(-5px);
    }
    .tp-avatar-btn.is-active .tp-avatar-initials {
      border-color: var(--gold);
      background: rgba(184,154,94,0.2);
      box-shadow: 0 0 0 3px rgba(184,154,94,0.28), 0 0 20px rgba(184,154,94,0.18);
    }
    .tp-avatar-name {
      font-family: var(--font-label);
      font-size: 10px;
      color: rgba(255,255,255,0.3);
      letter-spacing: 0.05em;
      transition: color 0.28s;
      white-space: nowrap;
    }
    .tp-avatar-btn.is-active .tp-avatar-name {
      color: rgba(255,255,255,0.72);
    }
    /* — Bubble — */
    .tp-bubble-wrap {
      position: relative;
      max-width: 720px;
      margin: 0 auto;
    }
    .tp-caret {
      position: absolute;
      top: 0;
      width: 0; height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 12px solid rgba(255,255,255,0.08);
      transform: translateX(-50%);
      transition: left 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      z-index: 1;
    }
    .tp-caret::after {
      content: '';
      position: absolute;
      top: 1px;
      left: -9px;
      width: 0; height: 0;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 11px solid rgba(255,255,255,0.04);
    }
    .tp-bubble {
      position: relative;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 20px;
      min-height: 230px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0,0,0,0.5);
    }
    .tp-slide {
      position: absolute;
      inset: 0;
      padding: 40px 44px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.45s ease, transform 0.45s ease;
      pointer-events: none;
    }
    .tp-slide.is-active {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .tp-stars {
      display: flex;
      gap: 3px;
      color: var(--gold);
      font-size: 17px;
      line-height: 1;
    }
    .tp-quote-mark {
      font-family: var(--font-display);
      font-size: 72px;
      color: var(--gold);
      line-height: 0.55;
      opacity: 0.55;
      user-select: none;
    }
    .tp-quote-text {
      font-family: var(--font-body);
      font-size: 17px;
      line-height: 1.68;
      color: rgba(255,255,255,0.82);
    }
    .tp-attrib {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 2px;
    }
    .tp-attrib-name {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 600;
      color: var(--white);
    }
    .tp-attrib-sep {
      color: rgba(255,255,255,0.22);
      font-size: 14px;
    }
    .tp-attrib-role {
      font-family: var(--font-label);
      font-size: 11px;
      color: rgba(255,255,255,0.42);
      letter-spacing: 0.06em;
    }`;

// ── NEW HTML SECTION ───────────────────────────────────────────────────────
const TESTIMONIALS = [
  { initials: 'TM', short: 'Tracy M.',   name: 'Tracy Monroe',     role: 'Home Buyer',      quote: 'We cannot say enough about this team! Mike, Ryan, and Frank were all amazing &#8212; collaborative, responsive, and truly outstanding. They even helped coordinate contractors before we moved in. Everything about our experience has been outstanding. We highly recommend them!' },
  { initials: 'BM', short: 'Bill M.',    name: 'Bill Moore',       role: 'Home Buyer',      quote: 'Leslie made buying a home a piece of cake. Professional, friendly, and answered all my questions in a timely manner. Buying a home is stressful, but she made it easy. I highly recommend her and the Palisade Realty.' },
  { initials: 'DL', short: 'Dioselina L.', name: 'Dioselina Lopez', role: 'Home Seller',    quote: 'Ana and Ryan are phenomenal! They sold my house FAST. Very communicative throughout the entire process and always got back to me in a timely manner. I would definitely go with them again!' },
  { initials: 'JO', short: 'Jackie O.',  name: 'Jackie Oliver',    role: 'Home Buyer',      quote: 'Mike truly makes you feel like you\'re the most important client he has. His communication was impressive &#8212; always available even after normal business hours. My experience was fantastic and I plan to work with him again on future purchases.' },
  { initials: 'ML', short: 'Mara L.',    name: 'Mara L.',          role: 'Home Buyer',      quote: 'Working with Leslie was a great experience &#8212; helpful every step of the way, professional, and funny. I would definitely recommend her and the entire Palisade Realty to friends and family.' },
  { initials: 'RW', short: 'Richie W.',  name: 'Richie Whitmore',  role: 'First-Time Buyer', quote: 'Michael was an excellent agent who helped us understand the process and found us the perfect home. His knowledge and expertise was invaluable to us as first time home buyers.' },
];

function avatarBtn(t, i) {
  const active = i === 0 ? ' is-active' : '';
  return (
    '\n      <button class="tp-avatar-btn' + active + '" data-idx="' + i + '" aria-label="' + t.name + '">'
    + '\n        <div class="tp-avatar-initials">' + t.initials + '</div>'
    + '\n        <span class="tp-avatar-name">' + t.short + '</span>'
    + '\n      </button>'
  );
}

function slide(t, i) {
  const active = i === 0 ? ' is-active' : '';
  return (
    '\n        <div class="tp-slide' + active + '" data-idx="' + i + '">'
    + '\n          <div class="tp-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>'
    + '\n          <p class="tp-quote-mark">&#8220;</p>'
    + '\n          <p class="tp-quote-text">' + t.quote + '</p>'
    + '\n          <div class="tp-attrib">'
    + '\n            <span class="tp-attrib-name">' + t.name + '</span>'
    + '\n            <span class="tp-attrib-sep">&#183;</span>'
    + '\n            <span class="tp-attrib-role">' + t.role + '</span>'
    + '\n          </div>'
    + '\n        </div>'
  );
}

const NEW_SECTION =
  '  <!-- ── TESTIMONIAL ───────────────────────────────────────────────── -->\n'
  + '  <section class="tp-section" id="testimonial" aria-label="Client testimonials">\n'
  + '    <div class="tp-header reveal">\n'
  + '      <p class="tp-eyebrow">Client Reviews</p>\n'
  + '      <h2 class="tp-heading">What Our Clients Say</h2>\n'
  + '    </div>\n\n'
  + '    <div class="tp-avatar-row reveal stagger-1" id="tpAvatarRow">'
  + TESTIMONIALS.map(avatarBtn).join('')
  + '\n    </div>\n\n'
  + '    <div class="tp-bubble-wrap reveal stagger-2">\n'
  + '      <div class="tp-caret" id="tpCaret"></div>\n'
  + '      <div class="tp-bubble">'
  + TESTIMONIALS.map(slide).join('')
  + '\n      </div>\n'
  + '    </div>\n'
  + '  </section>';

// ── NEW JS ─────────────────────────────────────────────────────────────────
const NEW_JS = `
    /* ── 4. TESTIMONIAL POPOUT ──────────────────────────────────────── */
    (function () {
      var btns   = document.querySelectorAll('.tp-avatar-btn');
      var slides = document.querySelectorAll('.tp-slide');
      var caret  = document.getElementById('tpCaret');
      var wrap   = document.querySelector('.tp-bubble-wrap');
      if (!btns.length || !wrap) return;

      var current = 0;
      var timer;

      function moveCaret(btn) {
        var wrapRect = wrap.getBoundingClientRect();
        var btnRect  = btn.getBoundingClientRect();
        caret.style.left = (btnRect.left - wrapRect.left + btnRect.width / 2) + 'px';
      }

      function goTo(idx) {
        btns[current].classList.remove('is-active');
        slides[current].classList.remove('is-active');
        current = idx;
        btns[current].classList.add('is-active');
        slides[current].classList.add('is-active');
        moveCaret(btns[current]);
      }

      function startAuto() {
        clearInterval(timer);
        timer = setInterval(function() { goTo((current + 1) % btns.length); }, 5500);
      }

      btns.forEach(function(btn, i) {
        btn.addEventListener('click', function() { goTo(i); startAuto(); });
      });

      requestAnimationFrame(function() { moveCaret(btns[0]); });
      window.addEventListener('resize', function() { moveCaret(btns[current]); });
      startAuto();
    })();`;

// ── APPLY REPLACEMENTS ─────────────────────────────────────────────────────

// 1. CSS — replace testimonial block
const CSS_START = '    /* ── TESTIMONIAL ─';
const CSS_END_MARKER = '    .test-role {';
let cssS = html.indexOf(CSS_START);
// find closing brace of .test-role { ... }
let cssE = html.indexOf(CSS_END_MARKER);
let braceDepth = 0, cssBlockEnd = cssE;
for (let i = cssE; i < html.length; i++) {
  if (html[i] === '{') braceDepth++;
  if (html[i] === '}') { braceDepth--; if (braceDepth === 0) { cssBlockEnd = i + 1; break; } }
}
if (cssS === -1) { console.error('CSS start marker not found'); process.exit(1); }
if (cssE === -1) { console.error('CSS end marker not found'); process.exit(1); }
html = html.slice(0, cssS) + NEW_CSS + html.slice(cssBlockEnd);
console.log('CSS replaced.');

// 2. HTML — replace testimonial section
// Find the comment line that precedes the section
const HTML_START_COMMENT = '  <!-- ── TESTIMONIAL ─';
const HTML_END_MARKER    = '<!-- ── TEAM ─';
let htmlS = html.indexOf(HTML_START_COMMENT);
let htmlE = html.indexOf(HTML_END_MARKER);
if (htmlS === -1) { console.error('HTML start comment not found'); process.exit(1); }
if (htmlE === -1) { console.error('HTML end marker (STATS) not found'); process.exit(1); }
html = html.slice(0, htmlS) + NEW_SECTION + '\n\n  ' + html.slice(htmlE);
console.log('HTML section replaced.');

// 3. JS — inject after scroll-reveal block ends (before FAQ accordion comment)
const FAQ_MARKER = '    /* ── 4. FAQ ACCORDION ─';
let faqIdx = html.indexOf(FAQ_MARKER);
if (faqIdx === -1) { console.error('FAQ marker not found'); process.exit(1); }
html = html.slice(0, faqIdx) + NEW_JS + '\n\n    ' + html.slice(faqIdx);
console.log('JS injected.');

// 4. Remove old responsive testimonial rules
html = html.replace(/\s*\.testimonial-section \{ padding: 90px 10% 90px 12%; \}\n/g, '\n');
html = html.replace(/\s*\.testimonial-section \{ padding: 72px var\(--pad-x\); \}\n/g, '\n');
console.log('Responsive rules cleaned.');

writeFileSync(file, html, 'utf8');
console.log('Done! Testimonial Popout section implemented.');

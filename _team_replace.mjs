import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'index.html');
let html = readFileSync(file, 'utf8');

const CDN = 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/';
const AGENTS = [
  { n:'01', name:'Frank Rinaldi',          phone:'7026050759', ph:'(702) 605-0759', email:'frank@crhometeam.com',       featured:true,  img:'1769122311738-6IOYSU6N2XCK90O7LVCC/83230156_172430979_img_6820.jpg' },
  { n:'02', name:'Scott Reading',           phone:'7023256530', ph:'(702) 325-6530', email:'scott@crhometeam.com',       featured:true,  img:'1742807007555-4GIXYI3FTM6FH1FEOPQQ/83230156_172430979_9c8530591713465dbc0225e1249cfa9a.jpeg' },
  { n:'03', name:'Ryan Crighton',           phone:'7022171048', ph:'(702) 217-1048', email:'ryan@crhometeam.com',        featured:false, img:'1765322326986-8JNC746E8QTI0UV5QPR5/83230156_172430981_ryan_crighton_.png' },
  { n:'04', name:'Danny Rinaldi',           phone:'7026050759', ph:'(702) 605-0759', email:'danny@crhometeam.com',       featured:false, img:'1767138332517-J8NQP7WFZ4IHAQWN3ZXC/83230156_172430979_danny_rinaldi_headshot.png' },
  { n:'05', name:'Aymeric Monello-Fuentes', phone:'7027476985', ph:'(702) 747-6985', email:'aymeric@crhometeam.com',    featured:false, img:'1766196406961-VQASN0XUO8WKZP6P6HTT/pro-square.jpg' },
  { n:'06', name:'Bailey Padilla',          phone:'7255256496', ph:'(725) 525-6496', email:'bailey@crhometeam.com',      featured:false, img:'1776791291544-9566V0JBGH64WT1FPF5G/83230156_172430979_img_8878.jpg' },
  { n:'07', name:'Bobbie McPherson',        phone:'4804696184', ph:'(480) 469-6184', email:'bobbie@crhometeam.com',      featured:false, img:'1765914236034-5JKYMYFXX03DFTEQGOZP/83230156_172430979_headshot3.png' },
  { n:'08', name:'Brayden Keith',           phone:'7027650147', ph:'(702) 765-0147', email:'brayden@crhometeam.com',     featured:false, img:'1766009321080-LOOMQ8EQXWVPQTNUS0GJ/83230156_172430979_brayden_keith_headshot.jpg' },
  { n:'09', name:'Chris Brown',             phone:'7024451330', ph:'(702) 445-1330', email:'chrisbrown22@gmail.com',     featured:false, img:'1682451620887-8BXNVK2KVNVPQGN9J9KF/ChrisBrown_83230158_unnamed.jpeg' },
  { n:'10', name:'Christian Cortes',        phone:'7027431302', ph:'(702) 743-1302', email:'christian@crhometeam.com',   featured:false, img:'1768248829082-2XZVQE5FXRHDZCK4AWS9/83230156_172430979_christian_cortes_headshot.png' },
  { n:'11', name:'Dakota Hanson-Rudkins',   phone:'7029947451', ph:'(702) 994-7451', email:'dakota@crhometeam.com',      featured:false, img:'1767140819164-A11ZFEQGNP7QOWC2O2B1/83230156_172430979_dakota_hansonrudkins_headshot.jpg' },
  { n:'12', name:'Dewey Burns',             phone:'7255774244', ph:'(725) 577-4244', email:'dewey@crhometeam.com',       featured:false, img:'1765315328349-XSXFK52M0GZBAQQ2BB6N/efdbc18c-902f-44f5-9727-de3d1f7e5f8b.png' },
  { n:'13', name:'Emmanuel Sanchez',        phone:'7252553235', ph:'(725) 255-3235', email:'emmanuel@crhometeam.com',    featured:false, img:'1767131890454-JV631TPJBZLML64VM8W0/83230156_172430979_emmanuel_sanchez_headshot.jpg' },
  { n:'14', name:'Gram Burt',               phone:'7027790210', ph:'(702) 779-0210', email:'gram@crhometeam.com',        featured:false, img:'1765321450745-N0515WPCQ1XC2JADGSUH/83230156_172430979_gram_burt_headshot.jpg' },
  { n:'15', name:'Jackie Bowers',           phone:'2106397308', ph:'(210) 639-7308', email:'jackie@crhometeam.com',      featured:false, img:'1780097177730-KJKQVXXY40SF69OZC1LE/Jackie+Bowers.png' },
  { n:'16', name:'Jonathan Masci',          phone:'7173862913', ph:'(717) 386-2913', email:'jonathan@crhometeam.com',    featured:false, img:'1765319114981-T7IQI1KGH6M4SBSLU180/83230156_172430979_jonathan_masci.jpg' },
  { n:'17', name:'Lin-Veronica Light',      phone:'7027679703', ph:'(702) 767-9703', email:'lin@crhometeam.com',         featured:false, img:'1765319420298-9NASAFRRRKOZNT2Q9PEL/83230156_172430979_linveronica_light.jpg' },
  { n:'18', name:'Lydia Bell',              phone:'7027452508', ph:'(702) 745-2508', email:'lydia@crhometeam.com',       featured:false, img:'1778602858732-KJLONI81VL5S4SM81JRQ/83230156_172430979_lydia_bell_agent_headshot_extended_bg.png' },
  { n:'19', name:'Michael Czmil',           phone:'7027203505', ph:'(702) 720-3505', email:'MikeCzmil@Gmail.com',        featured:false, img:'1765315201394-X8EUI31VB95Q7B83J3MF/d99f9c4d-205b-43ef-a045-6b359eb3fe1b.jpg' },
  { n:'20', name:'Michelle Rinaldi',        phone:'9177837408', ph:'(917) 783-7408', email:'michelle@crhometeam.com',    featured:false, img:'1765324174060-YFVRJVQV39KMMQFMSZ7G/83230156_172430981_michelle_rinaldi_headshot.jpeg' },
  { n:'21', name:'Paul Oh',                 phone:'7025392290', ph:'(702) 539-2290', email:'paul@crhometeam.com',        featured:false, img:'1768340867628-IYHDLCS23KNSH14W6J27/83230156_172430979_paul_oh_headshot+%281%29.png' },
  { n:'22', name:'Pete Kalkas',             phone:'7023285623', ph:'(702) 328-5623', email:'kalkasrealestate@gmail.com', featured:false, img:'1682451880038-XOR0USEXH2MJBOP1AIH0/PeteKalkas_83230158_Photo.JPG' },
  { n:'23', name:'Rebecca Williams',        phone:'7026236520', ph:'(702) 623-6520', email:'rebecca@crhometeam.com',     featured:false, img:'1776191384347-K545RLO1KC9Z8A0TVGH1/83230156_172430979_0814b36690e44ff29bd5d8a09736f10a_2.png' },
  { n:'24', name:'Reyna Christen',          phone:'7023896463', ph:'(702) 389-6463', email:'reyna@crhometeam.com',       featured:false, img:'1774922226275-TNVT7YI8XRDZD8FNUXYH/83230156_172430979_reyna_christian_agent_headshot2.jpg' },
  { n:'25', name:'Robert Barnes',           phone:'7024796847', ph:'(702) 479-6847', email:'robert@crhometeam.com',      featured:false, img:'1765315104159-Z0J6FHMIRUW05XSPUYY8/4636a43d-fe51-47b8-ad3c-5cf61b553188.jpg' },
  { n:'26', name:'Stefan Crighton',         phone:'7024780516', ph:'(702) 478-0516', email:'stefan@rothwellgornt.com',   featured:false, img:'1777510560555-AZFBK8XCOI3JES0QKSEP/83230156_172430979_stefan_crighton_agent_headshot.png' },
  { n:'27', name:'Victor Kipp',             phone:'8454534957', ph:'(845) 453-4957', email:'victor@crhometeam.com',      featured:false, img:'1696039304373-GN5UDWMC2MGEIISL5A8W/Vic+Pic+1.jpg' },
  { n:'28', name:'Victoria Rose',           phone:'7025414381', ph:'(702) 541-4381', email:'victoria@crhometeam.com',    featured:false, img:'1747227024659-A6A0SZLDNRR2WJF99GL8/83230156_172430979_victoria_pic+%281%29-Picsart-AiImageEnhancer.jpg' },
  { n:'29', name:'Zolt Szorenyi',           phone:'7023214006', ph:'(702) 321-4006', email:'zolt@crhometeam.com',        featured:false, img:'1780429048510-RGZBX42O1VPW8ACG8GW3/Zolt+Szorenyi.jpg' },
];

const TOTAL = AGENTS.length;
const PAD   = String(TOTAL).padStart(2, '0');

function card(a) {
  const badge = a.featured
    ? '\n            <span class="tcv1-dot" aria-hidden="true"></span>\n            <span class="tcv1-badge">Featured</span>'
    : '';
  return (
    '\n      <article class="tcv1-card reveal">'
    + '\n        <span class="tcv1-num">' + a.n + ' / ' + PAD + '</span>'
    + '\n        <div class="tcv1-photo">'
    + '\n          <img src="' + CDN + a.img + '?format=400w" alt="' + a.name + '" loading="lazy">'
    + '\n        </div>'
    + '\n        <div class="tcv1-info">'
    + '\n          <p class="tcv1-role">Real Estate Agent</p>'
    + '\n          <h3 class="tcv1-name">' + a.name + '</h3>'
    + '\n          <div class="tcv1-meta">'
    + '\n            <span class="tcv1-loc">Las Vegas, NV</span>' + badge
    + '\n          </div>'
    + '\n          <div class="tcv1-links">'
    + '\n            <a href="tel:' + a.phone + '" class="tcv1-link">Call &#x2197;</a>'
    + '\n            <a href="mailto:' + a.email + '" class="tcv1-link">Email &#x2197;</a>'
    + '\n          </div>'
    + '\n        </div>'
    + '\n      </article>'
  );
}

// ── NEW CSS ─────────────────────────────────────────────────────────────────
const NEW_CSS = `    /* ── TEAM CAROUSEL V1 ─────────────────────────────────────────── */
    .tcv1-section {
      padding: 100px 0 80px var(--pad-x);
      background: #0d0d0d;
      overflow: hidden;
    }
    .tcv1-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-right: var(--pad-x);
      margin-bottom: 44px;
    }
    .tcv1-head-left { display: flex; flex-direction: column; gap: 8px; }
    .tcv1-eyebrow {
      font-family: var(--font-label);
      font-size: 11px;
      font-weight: 500;
      color: var(--gold);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .tcv1-heading {
      font-family: var(--font-display);
      font-size: clamp(36px, 5vw, 68px);
      color: var(--white);
      line-height: 1.0;
      letter-spacing: -0.01em;
    }
    .tcv1-head-right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
      padding-bottom: 6px;
    }
    .tcv1-counter {
      font-family: var(--font-label);
      font-size: 13px;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.06em;
      min-width: 60px;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .tcv1-nav-btn {
      width: 48px; height: 48px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.18);
      background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: background 0.22s, border-color 0.22s;
      flex-shrink: 0;
    }
    .tcv1-nav-btn:hover:not(:disabled) {
      background: var(--gold);
      border-color: var(--gold);
    }
    .tcv1-nav-btn svg {
      width: 18px; height: 18px;
      stroke: rgba(255,255,255,0.8);
      transition: stroke 0.22s;
    }
    .tcv1-nav-btn:hover:not(:disabled) svg { stroke: var(--white); }
    .tcv1-nav-btn:disabled { opacity: 0.2; pointer-events: none; }
    .tcv1-viewport {
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      cursor: grab;
      -webkit-user-select: none;
      user-select: none;
    }
    .tcv1-viewport::-webkit-scrollbar { display: none; }
    .tcv1-viewport.is-dragging { cursor: grabbing; scroll-snap-type: none; }
    .tcv1-track {
      display: flex;
      gap: 16px;
      padding-right: var(--pad-x);
      padding-bottom: 8px;
      width: max-content;
    }
    .tcv1-card {
      flex: 0 0 285px;
      background: var(--white);
      border-radius: 18px;
      overflow: hidden;
      scroll-snap-align: start;
      transition: transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  box-shadow 0.38s ease;
    }
    .tcv1-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 32px 64px rgba(0,0,0,0.45);
    }
    .tcv1-num {
      display: block;
      padding: 18px 20px 0;
      font-family: var(--font-label);
      font-size: 10px;
      color: rgba(0,0,0,0.22);
      letter-spacing: 0.06em;
    }
    .tcv1-photo {
      height: 340px;
      margin: 10px 10px 0;
      border-radius: 12px;
      overflow: hidden;
      background: #d8d8d8;
    }
    .tcv1-photo img {
      width: 100%; height: 100%;
      object-fit: cover;
      object-position: top center;
      transition: transform 0.55s ease;
    }
    .tcv1-card:hover .tcv1-photo img { transform: scale(1.05); }
    .tcv1-info { padding: 16px 20px 20px; }
    .tcv1-role {
      font-family: var(--font-label);
      font-size: 10px;
      font-weight: 500;
      color: var(--gold);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .tcv1-name {
      font-family: var(--font-display);
      font-size: 22px;
      color: var(--black);
      line-height: 1.05;
      margin-bottom: 10px;
    }
    .tcv1-meta {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }
    .tcv1-loc {
      font-family: var(--font-label);
      font-size: 10px;
      color: rgba(0,0,0,0.36);
      letter-spacing: 0.04em;
    }
    .tcv1-dot {
      width: 3px; height: 3px;
      border-radius: 50%;
      background: rgba(0,0,0,0.18);
      flex-shrink: 0;
    }
    .tcv1-badge {
      display: inline-block;
      padding: 2px 8px;
      background: var(--gold);
      color: white;
      font-family: var(--font-label);
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      border-radius: 2px;
    }
    .tcv1-links {
      display: flex;
      gap: 8px;
      padding-top: 14px;
      border-top: 1px solid rgba(0,0,0,0.07);
    }
    .tcv1-link {
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 500;
      color: rgba(0,0,0,0.52);
      padding: 6px 14px;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 50px;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .tcv1-link:hover { background: var(--gold); color: var(--white); border-color: var(--gold); }
    .tcv1-progress-wrap {
      height: 2px;
      background: rgba(255,255,255,0.08);
      margin: 28px var(--pad-x) 0;
      border-radius: 1px;
      overflow: hidden;
    }
    .tcv1-progress-fill {
      height: 100%;
      background: var(--gold);
      width: 3.45%;
      border-radius: 1px;
      transition: width 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }`;

// ── NEW HTML SECTION ──────────────────────────────────────────────────────
const NEW_SECTION =
  '  <section class="tcv1-section" id="team" aria-label="Meet our team">\n'
  + '    <div class="tcv1-header reveal">\n'
  + '      <div class="tcv1-head-left">\n'
  + '        <p class="tcv1-eyebrow">Licensed Professionals</p>\n'
  + '        <h2 class="tcv1-heading">Meet Our Team</h2>\n'
  + '      </div>\n'
  + '      <div class="tcv1-head-right">\n'
  + '        <span class="tcv1-counter" id="tcv1Counter">01 / ' + PAD + '</span>\n'
  + '        <button class="tcv1-nav-btn" id="tcv1Prev" aria-label="Previous agents" disabled>\n'
  + '          <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><path d="M15 18l-6-6 6-6"/></svg>\n'
  + '        </button>\n'
  + '        <button class="tcv1-nav-btn" id="tcv1Next" aria-label="Next agents">\n'
  + '          <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><path d="M9 18l6-6-6-6"/></svg>\n'
  + '        </button>\n'
  + '      </div>\n'
  + '    </div>\n\n'
  + '    <div class="tcv1-viewport" id="tcv1Viewport">\n'
  + '      <div class="tcv1-track" id="tcv1Track">'
  + AGENTS.map(card).join('')
  + '\n      </div>\n'
  + '    </div>\n\n'
  + '    <div class="tcv1-progress-wrap">\n'
  + '      <div class="tcv1-progress-fill" id="tcv1Progress"></div>\n'
  + '    </div>\n'
  + '  </section>';

// ── NEW JS ────────────────────────────────────────────────────────────────
const NEW_JS = `    /* ── 5. TEAM CAROUSEL V1 ──────────────────────────────────────── */
    (function () {
      const viewport  = document.getElementById('tcv1Viewport');
      const track     = document.getElementById('tcv1Track');
      const prevBtn   = document.getElementById('tcv1Prev');
      const nextBtn   = document.getElementById('tcv1Next');
      const counter   = document.getElementById('tcv1Counter');
      const progress  = document.getElementById('tcv1Progress');
      if (!viewport || !track) return;

      const TOTAL_CARDS = track.querySelectorAll('.tcv1-card').length;
      let currentIdx   = 0;
      let isDragging   = false;
      let dragStartX   = 0;
      let dragStartSL  = 0;

      function getCards() { return Array.from(track.querySelectorAll('.tcv1-card')); }

      function scrollToCard(idx, smooth) {
        if (smooth === undefined) smooth = true;
        const cards = getCards();
        idx = Math.max(0, Math.min(idx, TOTAL_CARDS - 1));
        currentIdx = idx;
        viewport.scrollTo({ left: cards[idx].offsetLeft, behavior: smooth ? 'smooth' : 'instant' });
        updateUI();
      }

      function updateUI() {
        var padded = String(currentIdx + 1).padStart(2, '0');
        counter.textContent = padded + ' / ' + String(TOTAL_CARDS).padStart(2, '0');
        progress.style.width = ((currentIdx + 1) / TOTAL_CARDS * 100) + '%';
        prevBtn.disabled = currentIdx === 0;
        nextBtn.disabled = currentIdx >= TOTAL_CARDS - 1;
      }

      prevBtn.addEventListener('click', function() { scrollToCard(currentIdx - 1); });
      nextBtn.addEventListener('click', function() { scrollToCard(currentIdx + 1); });

      viewport.setAttribute('tabindex', '0');
      viewport.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft')  { scrollToCard(currentIdx - 1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { scrollToCard(currentIdx + 1); e.preventDefault(); }
      });

      viewport.addEventListener('mousedown', function(e) {
        isDragging  = true;
        dragStartX  = e.clientX;
        dragStartSL = viewport.scrollLeft;
        viewport.classList.add('is-dragging');
      });
      window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        viewport.scrollLeft = dragStartSL - (e.clientX - dragStartX);
      });
      window.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        viewport.classList.remove('is-dragging');
        var cards = getCards(), closest = 0, minDist = Infinity;
        cards.forEach(function(c, i) {
          var dist = Math.abs(c.offsetLeft - viewport.scrollLeft);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        scrollToCard(closest);
      });

      var scrollTimer;
      viewport.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
          var cards = getCards(), closest = 0, minDist = Infinity;
          cards.forEach(function(c, i) {
            var dist = Math.abs(c.offsetLeft - viewport.scrollLeft);
            if (dist < minDist) { minDist = dist; closest = i; }
          });
          if (closest !== currentIdx) { currentIdx = closest; updateUI(); }
        }, 80);
      }, { passive: true });

      updateUI();
    })();`;

// ── APPLY REPLACEMENTS ────────────────────────────────────────────────────

// 1. CSS
const CSS_START_MARKER = '    /* ── TEAM SECTION ──────────────────────────────────────────────── */';
const CSS_END_MARKER   = '    .team-cta-row {';
let cssS = html.indexOf(CSS_START_MARKER);
let cssE = html.indexOf(CSS_END_MARKER);
// find end of .team-cta-row block by locating the closing } after it
let braceDepth = 0, cssBlockEnd = cssE;
for (let i = cssE; i < html.length; i++) {
  if (html[i] === '{') braceDepth++;
  if (html[i] === '}') { braceDepth--; if (braceDepth === 0) { cssBlockEnd = i + 1; break; } }
}
if (cssS === -1) { console.error('CSS start marker not found. Dumping nearby text...'); process.exit(1); }
if (cssE === -1) { console.error('CSS end marker not found'); process.exit(1); }
html = html.slice(0, cssS) + NEW_CSS + html.slice(cssBlockEnd);
console.log('CSS replaced.');

// 2. HTML section
const HTML_START = '  <section class="team-section" id="team"';
const BLOG_MARKER = '  <!-- ── BLOG ─';
let htmlS = html.indexOf(HTML_START);
let blogIdx = html.indexOf(BLOG_MARKER);
// Walk back from BLOG_MARKER to find the </section> that precedes it
let htmlE = html.lastIndexOf('</section>', blogIdx) + '</section>'.length;
if (htmlS === -1) { console.error('HTML start marker not found'); process.exit(1); }
if (blogIdx === -1) { console.error('Blog marker not found'); process.exit(1); }
html = html.slice(0, htmlS) + NEW_SECTION + '\n\n' + html.slice(blogIdx);
console.log('HTML section replaced.');

// 3. JS
const JS_START = '    /* ── 5. TEAM CAROUSEL ─';
const jsS = html.indexOf(JS_START);
if (jsS === -1) { console.error('JS start marker not found'); process.exit(1); }
// Find the end of the IIFE: })();  followed by whitespace and </script>
const SCRIPT_END = '  </script>';
const scriptEndIdx = html.indexOf(SCRIPT_END, jsS);
if (scriptEndIdx === -1) { console.error('</script> not found after JS'); process.exit(1); }
html = html.slice(0, jsS) + NEW_JS + '\n  </script>' + html.slice(scriptEndIdx + SCRIPT_END.length);
console.log('JS replaced.');

// 4. Remove old responsive team rules (best-effort)
html = html.replace(/\s*\.team-card \{ flex: 0 0 calc\(33\.333% - 13\.4px\); \}\n/g, '\n');
html = html.replace(/\s*\.team-featured-row \{ grid-template-columns: 1fr; \}\n\s*\.team-card \{ flex: 0 0 calc\(50% - 10px\); \}\n\s*\.tf-photo \{ height: 300px; \}\n/g, '\n');
html = html.replace(/\s*@media \(max-width: 480px\) \{\n\s*\.team-card \{ flex: 0 0 82%; \}\n\s*\}\n/g, '\n');
console.log('Responsive rules cleaned.');

writeFileSync(file, html, 'utf8');
console.log('Done! index.html updated with Team Carousel V1.');

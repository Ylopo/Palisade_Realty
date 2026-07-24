/* Featured Properties carousel — data loaded from /api/listings (GitHub-backed)
   Loaded via next/script strategy="afterInteractive" in the marketing layout.
   Script runs exactly once per session; window.__fpReinit handles back-navigation remounts. */

var __fpTimer = null; // module-level: tracks the autoplay interval so reinit can clear it

(function () {
  'use strict'

  function pad(n) { return String(n).padStart(2, '0'); }
  function fmtSqft(n) { return typeof n === 'number' ? n.toLocaleString('en-US') : n; }

  var ICON_BEDS  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6"/><path d="M3 18h18"/><path d="M3 12V8"/><path d="M21 12V8"/></svg>';
  var ICON_BATHS = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6a1 1 0 0 1 2 0v2H9V6z"/><path d="M4 14h16v1a6 6 0 0 1-12 0v-1z"/><path d="M4 14V5a2 2 0 0 1 4 0"/></svg>';
  var ICON_SQFT  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>';
  var ICON_ARROW = '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6.5h9"/><path d="M7.5 2.5 11.5 6.5 7.5 10.5"/></svg>';

  function buildSlide(p, i, total) {
    var statusLabel = p.status === 'active' ? 'For Sale' : (p.status || 'For Sale');
    var statusMod   = p.status === 'pending' ? ' fl-status--pending' : (p.status === 'sold' ? ' fl-status--sold' : '');
    var cityLine    = [p.city, p.state, p.zip].filter(Boolean).join(', ');
    var url         = p.hasDetailPage ? '/properties/' + p.slug : (p.ylopoDetailUrl || 'https://search.palisaderealty.com/search');
    var target      = p.hasDetailPage ? '' : ' target="_blank" rel="noopener noreferrer"';
    var loading     = i === 0 ? 'eager' : 'lazy';
    return (
      '<div class="fl-slide' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '">' +
        '<img class="fl-slide-img" src="' + p.heroImage + '" alt="' + p.address + ', ' + cityLine + '" loading="' + loading + '" decoding="async">' +
        '<div class="fl-slide-overlay"></div>' +
        '<div class="fl-slide-content">' +
          '<div class="fl-slide-info">' +
            '<span class="fl-status' + statusMod + '">' + statusLabel + '</span>' +
            '<p class="fl-address">' + p.address +
              '<span class="fl-address-city">' + cityLine + '</span>' +
            '</p>' +
            '<p class="fl-price">' + (p.priceDisplay || '') + '</p>' +
            '<div class="fl-meta">' +
              (p.beds  ? '<div class="fl-meta-item">' + ICON_BEDS  + p.beds  + ' Bed'  + (p.beds  !== 1 ? 's' : '') + '</div><div class="fl-meta-divider"></div>' : '') +
              (p.baths ? '<div class="fl-meta-item">' + ICON_BATHS + p.baths + ' Bath' + (p.baths !== 1 ? 's' : '') + '</div><div class="fl-meta-divider"></div>' : '') +
              (p.sqft  ? '<div class="fl-meta-item">' + ICON_SQFT  + fmtSqft(p.sqft)  + ' Sq Ft</div>' : '') +
            '</div>' +
          '</div>' +
          '<a href="' + url + '"' + target + ' class="fl-view-btn">View Property ' + ICON_ARROW + '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderCarousel(allProps) {
    var props = allProps.filter(function (p) { return p.status !== 'inactive'; });
    if (!props.length) return;

    var stage   = document.getElementById('fp-stage');
    var dotsEl  = document.getElementById('fp-dots');
    var prevBtn = document.getElementById('fp-prev');
    var nextBtn = document.getElementById('fp-next');
    var countEl = document.getElementById('fl-counter-current');
    var totalEl = document.getElementById('fl-counter-total');
    var section = stage && stage.closest('.fl-section');

    if (!stage || !dotsEl) return;

    var total = props.length;
    if (totalEl) totalEl.textContent = pad(total);

    stage.innerHTML  = props.map(function (p, i) { return buildSlide(p, i, total); }).join('');
    dotsEl.innerHTML = props.map(function (_, i) {
      return '<button class="fl-dot' + (i === 0 ? ' is-active' : '') + '" role="tab" ' +
             'aria-selected="' + (i === 0 ? 'true' : 'false') + '" ' +
             'aria-label="Go to slide ' + (i + 1) + '" data-index="' + i + '" type="button"></button>';
    }).join('');

    var slides     = Array.prototype.slice.call(stage.querySelectorAll('.fl-slide'));
    var dots       = Array.prototype.slice.call(dotsEl.querySelectorAll('.fl-dot'));
    var current    = 0;
    var timer      = null;
    var paused     = false;
    var INTERVAL   = 6000;
    var dragStartX = 0;
    var dragActive = false;

    function activate(idx) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');
      current = ((idx % total) + total) % total;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
      if (countEl) countEl.textContent = pad(current + 1);
      var img = slides[current].querySelector('.fl-slide-img');
      if (img) { img.style.animation = 'none'; img.offsetHeight; img.style.animation = ''; }
    }

    function startTimer() { clearInterval(timer); clearInterval(__fpTimer); if (!paused) { timer = setInterval(function () { activate(current + 1); }, INTERVAL); __fpTimer = timer; } }
    function pause()      { paused = true;  clearInterval(timer); }
    function resume()     { paused = false; startTimer(); }

    if (prevBtn) prevBtn.addEventListener('click', function () { activate(current - 1); startTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { activate(current + 1); startTimer(); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { activate(i); startTimer(); }); });

    if (section) {
      section.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { activate(current + 1); startTimer(); }
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { activate(current - 1); startTimer(); }
      });
      section.addEventListener('mouseenter', pause);
      section.addEventListener('mouseleave', function () { resume(); dragActive = false; });
      section.addEventListener('focusin',  pause);
      section.addEventListener('focusout', resume);
      section.addEventListener('touchstart', function (e) { dragStartX = e.touches[0].clientX; dragActive = true; }, { passive: true });
      section.addEventListener('touchend', function (e) {
        if (!dragActive) return; dragActive = false;
        var diff = e.changedTouches[0].clientX - dragStartX;
        if (Math.abs(diff) > 48) { diff < 0 ? activate(current + 1) : activate(current - 1); startTimer(); }
      });
      section.addEventListener('mousedown', function (e) { dragStartX = e.clientX; dragActive = true; });
      section.addEventListener('mouseup', function (e) {
        if (!dragActive) return; dragActive = false;
        var diff = e.clientX - dragStartX;
        if (Math.abs(diff) > 48) { diff < 0 ? activate(current + 1) : activate(current - 1); startTimer(); }
      });
    }

    startTimer();
  }

  // Exposed for HomepageInit.tsx — called on every homepage mount after back-navigation
  window.__fpReinit = function () {
    clearInterval(__fpTimer); __fpTimer = null;
    var data = window.__featuredProperties;
    if (data && data.length) renderCarousel(data);
  };

  // Load listings from the API (reads GitHub-committed data), fall back to the static file
  fetch('/api/listings')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (data) {
      if (Array.isArray(data) && data.length) {
        window.__featuredProperties = data;
        renderCarousel(data);
      } else {
        return Promise.reject('empty');
      }
    })
    .catch(function () {
      fetch('/data/featured-properties.json')
        .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function (data) {
          if (Array.isArray(data) && data.length) {
            window.__featuredProperties = data;
            renderCarousel(data);
          }
        })
        .catch(function () { /* carousel stays empty */ });
    });
})();

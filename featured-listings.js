/* ============================================================
   Featured Listings — Hero Carousel  (v2: live agent data)
   Palisade Realty
   ============================================================ */
(function () {
  'use strict';

  /* ── Helpers ── */
  function pad(n) { return String(n).padStart(2, '0'); }

  function slugify(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function getAgentSlug() {
    var parts = window.location.pathname.split('/');
    var last  = (parts[parts.length - 1] || parts[parts.length - 2] || '').replace(/\.html$/, '');
    return last || null;
  }

  function formatNum(n) {
    return typeof n === 'number' ? n.toLocaleString('en-US') : String(n);
  }

  function fetchJSON(url, fallback) {
    return fetch(url)
      .then(function (r) { return r.ok ? r.json() : fallback; })
      .catch(function () { return fallback; });
  }

  /* ── SVG icons ── */
  function iconBeds() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6"/><path d="M3 18h18"/><path d="M3 12V8"/><path d="M21 12V8"/></svg>';
  }
  function iconBaths() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6a1 1 0 0 1 2 0v2H9V6z"/><path d="M4 14h16v1a6 6 0 0 1-12 0v-1z"/><path d="M4 14V5a2 2 0 0 1 4 0"/></svg>';
  }
  function iconSqft() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>';
  }
  function iconArrow() {
    return '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6.5h9"/><path d="M7.5 2.5 11.5 6.5 7.5 10.5"/></svg>';
  }

  /* ── Map JSON listing to carousel card ── */
  function mapListing(l) {
    var rawStatus = (l.listingStatus || l.status || '').toLowerCase();
    var statusText = 'For Sale';
    var statusMod  = '';
    if (rawStatus === 'pending') { statusText = 'Pending'; statusMod = 'fl-status--pending'; }
    else if (rawStatus === 'sold') { statusText = 'Sold';    statusMod = 'fl-status--sold';    }

    var cityStr  = [l.city, l.state, l.zip].filter(Boolean).join(', ');
    var priceStr = l.priceDisplay || (l.price ? '$' + formatNum(l.price) : 'Inquire');
    var sqftStr  = l.sqft ? formatNum(typeof l.sqft === 'number' ? l.sqft : parseInt(l.sqft, 10) || l.sqft) : '–';

    var href = l.hasDetailPage
      ? '/properties/' + l.slug + '.html'
      : (l.ylopoDetailUrl || 'https://search.palisaderealty.com/');

    return {
      status:     statusText,
      statusMod:  statusMod,
      address:    l.address || '',
      city:       cityStr,
      price:      priceStr,
      beds:       l.beds  || '–',
      baths:      l.baths || '–',
      sqft:       sqftStr,
      url:        href,
      isInternal: !!l.hasDetailPage,
      img:        l.heroImage || 'https://placehold.co/1600x900/58172a/ffffff?text=Property+Photo'
    };
  }

  /* ── Build one slide ── */
  function buildSlide(card, i, total) {
    var statusClass = 'fl-status' + (card.statusMod ? ' ' + card.statusMod : '');
    var target = card.isInternal ? '' : ' target="_blank" rel="noopener noreferrer"';
    return (
      '<div class="fl-slide' + (i === 0 ? ' is-active' : '') + '" ' +
          'role="group" aria-roledescription="slide" ' +
          'aria-label="' + (i + 1) + ' of ' + total + '" data-index="' + i + '">' +
        '<img class="fl-slide-img" ' +
             'src="' + card.img + '" ' +
             'alt="' + card.address + ', ' + card.city + '" ' +
             'loading="' + (i === 0 ? 'eager' : 'lazy') + '" decoding="async">' +
        '<div class="fl-slide-overlay"></div>' +
        '<div class="fl-slide-content">' +
          '<div class="fl-slide-info">' +
            '<span class="' + statusClass + '">' + card.status + '</span>' +
            '<p class="fl-address">' + card.address +
              '<span class="fl-address-city">' + card.city + '</span>' +
            '</p>' +
            '<p class="fl-price">' + card.price + '</p>' +
            '<div class="fl-meta">' +
              '<div class="fl-meta-item">' + iconBeds()  + card.beds  + ' Beds</div>'  +
              '<div class="fl-meta-divider"></div>' +
              '<div class="fl-meta-item">' + iconBaths() + card.baths + ' Baths</div>' +
              '<div class="fl-meta-divider"></div>' +
              '<div class="fl-meta-item">' + iconSqft()  + card.sqft  + ' Sq Ft</div>' +
            '</div>' +
          '</div>' +
          '<a href="' + card.url + '"' + target + ' class="fl-view-btn">' +
            'View Property ' + iconArrow() +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  /* ── Build the full fl-wrapper section ── */
  function buildSection(cards, heading) {
    var total    = cards.length;
    var slidesHtml = cards.map(function (c, i) { return buildSlide(c, i, total); }).join('');

    var dotsHtml = '';
    for (var i = 0; i < total; i++) {
      dotsHtml +=
        '<button class="fl-dot' + (i === 0 ? ' is-active' : '') + '" ' +
                'role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '" ' +
                'aria-label="Go to slide ' + (i + 1) + '" ' +
                'data-index="' + i + '" type="button"></button>';
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'fl-wrapper';
    wrapper.innerHTML =
      '<div class="fl-header">' +
        '<span class="fl-header-eyebrow">Palisade Realty</span>' +
        '<h2 class="fl-header-title">' + heading + '</h2>' +
      '</div>' +
      '<div class="fl-section" id="fl-section" ' +
           'role="region" aria-label="Featured property listings" ' +
           'aria-roledescription="carousel" tabindex="0">' +
        '<div class="fl-slide-container">' + slidesHtml + '</div>' +
        '<div class="fl-arrows" role="group" aria-label="Carousel navigation">' +
          '<button class="fl-arrow fl-arrow-prev" id="fl-prev" aria-label="Previous listing" type="button">' +
            '<svg viewBox="0 0 18 18"><polyline points="11 14 6 9 11 4"/></svg>' +
          '</button>' +
          '<button class="fl-arrow fl-arrow-next" id="fl-next" aria-label="Next listing" type="button">' +
            '<svg viewBox="0 0 18 18"><polyline points="7 4 12 9 7 14"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="fl-dots" role="tablist" aria-label="Listing slides">' + dotsHtml + '</div>' +
        '<div class="fl-counter" aria-hidden="true">' +
          '<span class="fl-counter-current">01</span> / ' + pad(total) +
        '</div>' +
      '</div>';
    return wrapper;
  }

  /* ── Carousel logic ── */
  function initCarousel(wrapperEl, total) {
    var section  = wrapperEl.querySelector('#fl-section');
    if (!section) return;

    var slides   = Array.prototype.slice.call(section.querySelectorAll('.fl-slide'));
    var dots     = Array.prototype.slice.call(section.querySelectorAll('.fl-dot'));
    var counter  = section.querySelector('.fl-counter-current');
    var prevBtn  = section.querySelector('#fl-prev');
    var nextBtn  = section.querySelector('#fl-next');

    var current    = 0;
    var timer      = null;
    var paused     = false;
    var dragStartX = 0;
    var dragActive = false;
    var INTERVAL   = 6000;

    if (total <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }

    function activate(idx) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');
      current = ((idx % total) + total) % total;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
      if (counter) counter.textContent = pad(current + 1);
    }

    function next()  { activate(current + 1); }
    function startTimer() { clearInterval(timer); if (!paused) timer = setInterval(next, INTERVAL); }
    function pause()  { paused = true;  clearInterval(timer); }
    function resume() { paused = false; startTimer(); }

    if (nextBtn) nextBtn.addEventListener('click', function () { activate(current + 1); startTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { activate(current - 1); startTimer(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { activate(i); startTimer(); });
    });

    section.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { activate(current + 1); startTimer(); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { activate(current - 1); startTimer(); }
    });

    section.addEventListener('mouseenter', pause);
    section.addEventListener('mouseleave', resume);
    section.addEventListener('focusin',    pause);
    section.addEventListener('focusout',   resume);

    section.addEventListener('touchstart', function (e) {
      dragStartX = e.touches[0].clientX; dragActive = true;
    }, { passive: true });
    section.addEventListener('touchend', function (e) {
      if (!dragActive) return; dragActive = false;
      var diff = e.changedTouches[0].clientX - dragStartX;
      if (Math.abs(diff) > 48) { diff < 0 ? activate(current + 1) : activate(current - 1); startTimer(); }
    });
    section.addEventListener('mousedown',  function (e) { dragStartX = e.clientX; dragActive = true; });
    section.addEventListener('mouseup',    function (e) {
      if (!dragActive) return; dragActive = false;
      var diff = e.clientX - dragStartX;
      if (Math.abs(diff) > 48) { diff < 0 ? activate(current + 1) : activate(current - 1); startTimer(); }
    });
    section.addEventListener('mouseleave', function () { dragActive = false; });

    startTimer();
  }

  /* ── Main init ── */
  function init() {
    var target = document.querySelector('.listings-outer');
    if (!target) return;

    var agentSlug = getAgentSlug();

    // Fetch agent config and all listings in parallel
    Promise.all([
      fetchJSON('/api/listings?type=config', {}),
      fetchJSON('/api/listings', [])
    ]).then(function (results) {
      var configMap   = results[0] || {};
      var allListings = results[1] || [];

      // Resolve per-agent config, falling back to default then to empty object
      var agentConfig = configMap[agentSlug] || configMap['default'] || {};

      // Respect explicit disable
      if (agentConfig.enabled === false) return;

      var heading       = agentConfig.heading || 'Featured Properties';
      var maxListings   = Number(agentConfig.maxListings) || 6;
      var listingsAgent = agentConfig.listingsAgent || agentSlug;

      // Only consider active listings
      var activeAll = allListings.filter(function (l) {
        return (l.status || '').toLowerCase() === 'active';
      });

      var listings;

      if (agentConfig.manualSlugs && agentConfig.manualSlugs.length) {
        // Manual override: show exactly these slugs (preserving order)
        listings = agentConfig.manualSlugs
          .map(function (slug) { return activeAll.find(function (l) { return l.slug === slug; }); })
          .filter(Boolean);
      } else {
        // Filter by assigned agent (slugify display name for comparison)
        listings = activeAll.filter(function (l) {
          if (!l.listedBy) return false;
          var name = l.listedBy.agent || l.listedBy.name || '';
          return slugify(name) === listingsAgent;
        });
        // Fallback: if no listings match the assigned agent, show all active listings
        if (!listings.length) listings = activeAll;
      }

      listings = listings.slice(0, maxListings);
      if (!listings.length) return;

      var cards   = listings.map(mapListing);
      var section = buildSection(cards, heading);
      target.parentNode.insertBefore(section, target);
      initCarousel(section, cards.length);
    }).catch(function (err) {
      console.warn('[featured-listings] Load error:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());

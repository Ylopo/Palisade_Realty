/* ============================================================
   Featured Listings — Hero Carousel
   Palisade Realty
   ============================================================ */
(function () {
  'use strict';

  var LISTINGS = [
    {
      status:  'For Sale',
      address: '1254 Prospect Street',
      city:    'La Jolla, CA 92037',
      price:   '$4,250,000',
      beds: 5, baths: '4.5', sqft: '4,820',
      url: 'https://search.palisaderealty.com/',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=900&fit=crop&q=82'
    },
    {
      status:  'For Sale',
      address: '456 Ocean Boulevard',
      city:    'Coronado, CA 92118',
      price:   '$3,895,000',
      beds: 4, baths: '3.5', sqft: '3,650',
      url: 'https://search.palisaderealty.com/',
      img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&h=900&fit=crop&q=82'
    },
    {
      status:  'For Sale',
      address: '789 Camino Del Mar',
      city:    'Del Mar, CA 92014',
      price:   '$5,100,000',
      beds: 6, baths: 5, sqft: '5,420',
      url: 'https://search.palisaderealty.com/',
      img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&h=900&fit=crop&q=82'
    },
    {
      status:  'Pending',
      statusMod: 'fl-status--pending',
      address: '2200 Via de la Valle',
      city:    'Rancho Santa Fe, CA 92067',
      price:   '$6,750,000',
      beds: 7, baths: 6, sqft: '7,200',
      url: 'https://search.palisaderealty.com/',
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&h=900&fit=crop&q=82'
    },
    {
      status:  'For Sale',
      address: '3820 Sunset Cliffs Blvd',
      city:    'Point Loma, CA 92107',
      price:   '$2,850,000',
      beds: 4, baths: 3, sqft: '3,100',
      url: 'https://search.palisaderealty.com/',
      img: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1600&h=900&fit=crop&q=82'
    }
  ];

  var total = LISTINGS.length;

  /* ── SVG icons ── */
  function iconBeds() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6"/><path d="M3 18h18"/><path d="M3 12V8"/><path d="M21 12V8"/></svg>';
  }
  function iconBaths() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6a1 1 0 0 1 2 0v2H9V6z"/><path d="M4 14h16v1a6 6 0 0 1-12 0v-1z"/><path d="M4 14V5a2 2 0 0 1 4 0"/></svg>';
  }
  function iconSqft() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>';
  }
  function iconArrow() {
    return '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6.5h9"/><path d="M7.5 2.5 11.5 6.5 7.5 10.5"/></svg>';
  }

  /* ── Build HTML ── */
  function buildSlide(l, i) {
    var statusClass = 'fl-status' + (l.statusMod ? ' ' + l.statusMod : '');
    var loading = i === 0 ? 'eager' : 'lazy';
    return (
      '<div class="fl-slide' + (i === 0 ? ' is-active' : '') + '" ' +
          'role="group" aria-roledescription="slide" ' +
          'aria-label="' + (i + 1) + ' of ' + total + '" data-index="' + i + '">' +
        '<img class="fl-slide-img" ' +
             'src="' + l.img + '" ' +
             'alt="' + l.address + ', ' + l.city + '" ' +
             'loading="' + loading + '" decoding="async">' +
        '<div class="fl-slide-overlay"></div>' +
        '<div class="fl-slide-content">' +
          '<div class="fl-slide-info">' +
            '<span class="' + statusClass + '">' + l.status + '</span>' +
            '<p class="fl-address">' + l.address +
              '<span class="fl-address-city">' + l.city + '</span>' +
            '</p>' +
            '<p class="fl-price">' + l.price + '</p>' +
            '<div class="fl-meta">' +
              '<div class="fl-meta-item">' + iconBeds() + l.beds + ' Beds</div>' +
              '<div class="fl-meta-divider"></div>' +
              '<div class="fl-meta-item">' + iconBaths() + l.baths + ' Baths</div>' +
              '<div class="fl-meta-divider"></div>' +
              '<div class="fl-meta-item">' + iconSqft() + l.sqft + ' Sq Ft</div>' +
            '</div>' +
          '</div>' +
          '<a href="' + l.url + '" target="_blank" rel="noopener noreferrer" ' +
             'class="fl-view-btn">' +
            'View Property ' + iconArrow() +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function buildSection() {
    var dotsHtml = '';
    for (var i = 0; i < total; i++) {
      dotsHtml +=
        '<button class="fl-dot' + (i === 0 ? ' is-active' : '') + '" ' +
                'role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '" ' +
                'aria-label="Go to slide ' + (i + 1) + '" ' +
                'data-index="' + i + '" type="button"></button>';
    }
    var slidesHtml = LISTINGS.map(buildSlide).join('');

    var wrapper = document.createElement('div');
    wrapper.className = 'fl-wrapper';
    wrapper.innerHTML =
      '<div class="fl-header">' +
        '<span class="fl-header-eyebrow">Palisade Realty</span>' +
        '<h2 class="fl-header-title">Featured Properties</h2>' +
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

  function pad(n) { return String(n).padStart(2, '0'); }

  /* ── Carousel logic ── */
  function initCarousel() {
    var section  = document.getElementById('fl-section');
    if (!section) return;

    var slides   = Array.prototype.slice.call(section.querySelectorAll('.fl-slide'));
    var dots     = Array.prototype.slice.call(section.querySelectorAll('.fl-dot'));
    var counter  = section.querySelector('.fl-counter-current');
    var prevBtn  = section.querySelector('#fl-prev');
    var nextBtn  = section.querySelector('#fl-next');

    var current  = 0;
    var timer    = null;
    var paused   = false;
    var dragStartX = 0;
    var dragActive = false;
    var INTERVAL = 6000;

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

    function next() { activate(current + 1); }
    function prev() { activate(current - 1); }

    function startTimer() {
      clearInterval(timer);
      if (!paused) timer = setInterval(next, INTERVAL);
    }

    function pause()  { paused = true;  clearInterval(timer); }
    function resume() { paused = false; startTimer(); }

    /* Controls */
    nextBtn.addEventListener('click', function () { activate(current + 1); startTimer(); });
    prevBtn.addEventListener('click', function () { activate(current - 1); startTimer(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { activate(i); startTimer(); });
    });

    /* Keyboard */
    section.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { activate(current + 1); startTimer(); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { activate(current - 1); startTimer(); }
    });

    /* Hover / focus pause */
    section.addEventListener('mouseenter', pause);
    section.addEventListener('mouseleave', resume);
    section.addEventListener('focusin',    pause);
    section.addEventListener('focusout',   resume);

    /* Touch swipe */
    section.addEventListener('touchstart', function (e) {
      dragStartX = e.touches[0].clientX;
      dragActive = true;
    }, { passive: true });

    section.addEventListener('touchend', function (e) {
      if (!dragActive) return;
      dragActive = false;
      var diff = e.changedTouches[0].clientX - dragStartX;
      if (Math.abs(diff) > 48) {
        diff < 0 ? activate(current + 1) : activate(current - 1);
        startTimer();
      }
    });

    /* Mouse drag */
    section.addEventListener('mousedown', function (e) {
      dragStartX = e.clientX;
      dragActive = true;
    });

    section.addEventListener('mouseup', function (e) {
      if (!dragActive) return;
      dragActive = false;
      var diff = e.clientX - dragStartX;
      if (Math.abs(diff) > 48) {
        diff < 0 ? activate(current + 1) : activate(current - 1);
        startTimer();
      }
    });

    section.addEventListener('mouseleave', function () { dragActive = false; });

    startTimer();
  }

  /* ── Init ── */
  function init() {
    var target = document.querySelector('.listings-outer');
    if (!target) return;
    var section = buildSection();
    target.parentNode.insertBefore(section, target);
    initCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());

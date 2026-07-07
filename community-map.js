/* ── community-map.js — Palisade Realty San Diego ─────────────────────────
 * Shared Mapbox map system for all community detail pages.
 * Each page sets window.SD_COMMUNITY_CONFIG then loads this file.
 *
 * Creates:
 *   • Hero map     #hero-map      — 45° pitch, non-interactive, immediate
 *   • Lifestyle    #lifestyle-map — 52° pitch, interactive, lazy-loaded
 *
 * Token and style are hardcoded here; per-city data lives in SD_COMMUNITY_CONFIG.
 * ─────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var TOKEN = 'pk.eyJ1Ijoiam9tLW1hcGJveCIsImEiOiJjbXFxaGJva3AwNDVqMnBxcnlvaW54aWRoIn0.f4TeZyya7vaALl39DaWK5Q';
  var STYLE = 'mapbox://styles/mapbox/standard';

  /* ── San Diego key roads ──────────────────────────────────────────────── */

  // I-5 — coastal freeway, north-south corridor
  // Glow: #5ba4ff  •  Line: #7dbfff  (blue)
  var I5_COORDS = [
    [-117.107, 32.671], [-117.120, 32.690], [-117.130, 32.703],
    [-117.136, 32.718], [-117.143, 32.735], [-117.152, 32.760],
    [-117.157, 32.783], [-117.162, 32.812], [-117.168, 32.845],
    [-117.173, 32.877], [-117.175, 32.903]
  ];

  // Harbor Drive — bayfront waterfront corridor
  // Glow: #b89a5e  •  Line: #b89a5e  (Palisade gold)
  var HARBOR_COORDS = [
    [-117.136, 32.699], [-117.148, 32.706], [-117.158, 32.711],
    [-117.163, 32.717], [-117.169, 32.722], [-117.173, 32.727],
    [-117.175, 32.731]
  ];

  /* ── Map factory ──────────────────────────────────────────────────────── */

  function buildMap(containerId, zoom, pitch, bearing, interactive, cfg) {
    var container = document.getElementById(containerId);
    if (!container || !window.mapboxgl) return null;

    mapboxgl.accessToken = TOKEN;

    var map = new mapboxgl.Map({
      container:        containerId,
      style:            STYLE,
      center:           [cfg.lng, cfg.lat],
      zoom:             zoom,
      pitch:            pitch,
      bearing:          bearing,
      interactive:      interactive,
      attributionControl: false
    });

    map.on('load', function () {
      map.setConfigProperty('basemap', 'lightPreset', 'night');

      /* I-5 — blue double-layer glow + line */
      map.addSource('pr-i5', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: I5_COORDS } }
      });
      map.addLayer({ id: 'pr-i5-glow', type: 'line', source: 'pr-i5',
        paint: { 'line-color': '#5ba4ff', 'line-width': 6, 'line-opacity': 0.22, 'line-blur': 5 }
      });
      map.addLayer({ id: 'pr-i5-line', type: 'line', source: 'pr-i5',
        paint: { 'line-color': '#7dbfff', 'line-width': 2, 'line-opacity': 0.72 }
      });

      /* Harbor Drive — gold double-layer glow + line */
      map.addSource('pr-harbor', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: HARBOR_COORDS } }
      });
      map.addLayer({ id: 'pr-harbor-glow', type: 'line', source: 'pr-harbor',
        paint: { 'line-color': '#b89a5e', 'line-width': 6, 'line-opacity': 0.20, 'line-blur': 5 }
      });
      map.addLayer({ id: 'pr-harbor-line', type: 'line', source: 'pr-harbor',
        paint: { 'line-color': '#b89a5e', 'line-width': 2, 'line-opacity': 0.65 }
      });

      /* Community boundary polygon */
      if (cfg.boundary && cfg.boundary.length) {
        map.addSource('pr-boundary', {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [cfg.boundary] } }
        });
        map.addLayer({ id: 'pr-boundary-fill', type: 'fill', source: 'pr-boundary',
          paint: { 'fill-color': '#eeca00', 'fill-opacity': 0.07 }
        });
        map.addLayer({ id: 'pr-boundary-line', type: 'line', source: 'pr-boundary',
          paint: { 'line-color': '#eeca00', 'line-width': 1.5, 'line-opacity': 0.55 }
        });
      }

      /* POI markers */
      (cfg.pois || []).forEach(function (poi) {
        var markerEl = document.createElement('div');
        markerEl.className = 'pr-map-poi';
        markerEl.textContent = poi.icon;

        var popup = new mapboxgl.Popup({ offset: 24, closeButton: false })
          .setHTML(
            '<div class="pr-poi-popup">' +
              '<p class="pr-poi-name">' + poi.name + '</p>' +
              '<p class="pr-poi-desc">' + poi.desc + '</p>' +
            '</div>'
          );

        new mapboxgl.Marker(markerEl)
          .setLngLat([poi.lng, poi.lat])
          .setPopup(popup)
          .addTo(map);
      });

      /* Navigation + corner label (lifestyle map only) */
      if (interactive) {
        map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');

        var label = document.createElement('div');
        label.className = 'pr-map-label';
        label.textContent = cfg.city;
        map.getContainer().appendChild(label);
      }
    });

    return map;
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */

  function initMaps() {
    var cfg = window.SD_COMMUNITY_CONFIG;
    if (!cfg || !window.mapboxgl) return;

    /* Hero map — immediate, non-interactive */
    buildMap('hero-map', cfg.heroZoom || 13, 45, -10, false, cfg);

    /* Lifestyle map — lazy-loaded on scroll */
    var lifestyleEl = document.getElementById('lifestyle-map');
    if (lifestyleEl && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) {
          obs.disconnect();
          buildMap('lifestyle-map', cfg.lifestyleZoom || (cfg.heroZoom - 0.5), 52, -17, true, cfg);
        }
      }, { threshold: 0.1 }).observe(lifestyleEl);
    }
  }

  /* ── Scroll reveal ────────────────────────────────────────────────────── */

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });

    els.forEach(function (el) { obs.observe(el); });
  }

  /* ── Boot ─────────────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initMaps(); initReveal(); });
  } else {
    initMaps();
    initReveal();
  }

})();

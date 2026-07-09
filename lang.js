/* ============================================================
   PALISADE REALTY — Language Toggle (EN / ES)
   lang.js — loaded on every page
   ============================================================ */

(function () {
  'use strict';

  /* ── Dictionary ─────────────────────────────────────────── */
  var DICT = {
    en: {
      /* NAV */
      buy: 'Buy',
      sell: 'Sell',
      communities: 'Communities',
      commLabel: 'San Diego Communities',
      commViewAll: 'View All Communities',
      testimonials: 'Testimonials',
      properties: 'Properties',
      team: 'Team',
      blog: 'Blog',
      contact: 'Contact',
      mobileComm: 'Communities ▾',

      /* FOOTER */
      footerLinksTitle: 'Quick Links',
      footerContactTitle: 'Contact',
      footerBuy: 'Buy a Home',
      footerSell: 'Sell Your Home',
      footerCommunities: 'Communities',
      footerTestimonials: 'Testimonials',
      footerBlog: 'Blog',
      footerTeam: 'Our Team',
      footerContactUs: 'Contact Us',
      footerHours: 'Mon – Fri: 9:00 AM – 5:00 PM',

      /* HOMEPAGE — hero */
      heroSubtitle: "Experience the new way of Buying and Selling real estate<br>in today’s shifting market.",
      heroCta1: 'Find Your Dream Home',
      heroCta2: "Let’s Connect",
      heroSearchLabel: 'Enter City / Neighborhood',
      heroSearchPlaceholder: 'City or Neighborhood',
      heroTypeLabel: 'Property Type',
      heroPriceLabel: 'Price Limit',
      heroSearchBtn: 'SEARCH',
      propResidential: 'Residential',
      propCondo: 'Condo',
      propTownhouse: 'Townhouse',
      propMultiFamily: 'Multi-Family',
      propLand: 'Land',
      priceAny: 'Any Price',
      price500k: 'Under $500K',
      price1m: 'Under $1M',
      price2m: 'Under $2M',
      price5m: 'Under $5M',
      price10m: 'Under $10M',

      /* HOMEPAGE — communities */
      commEyebrow: 'Where We Work',
      commHeading: 'Explore Our Communities',
      commExplore: 'Explore',

      /* HOMEPAGE — find your place */
      fypEyebrow: 'Explore the Region',
      fypTitle: "Let’s Find Your Place",
      fypSubtitle: "Click any location to dive deeper into what it’s really like to live there.",
      fypCta: 'See All Communities',

      /* HOMEPAGE — about */
      aboutTitle: 'Principal Broker / CEO',
      aboutBio: "Hedda founded Palisade Realty in 2010 and has built it into one of San Diego’s most trusted luxury real estate firms — with a team of 60+ agents and over 15 years of market expertise. Her commitment to innovative representation, deep local knowledge, and genuine care for every client has positioned Palisade Realty as the go-to brokerage across the greater San Diego region. From first-time buyers to seasoned investors, Hedda’s team delivers the professional, efficient, and rewarding experience today’s market demands.",
      aboutCta: 'Meet Our Team',

      /* HOMEPAGE — team carousel */
      teamEyebrow: 'The Palisade Realty Team',
      teamHeading: 'Meet Our Agents',
      teamCta: 'View All Agents',

      /* HOMEPAGE — listings */
      listingsEyebrow: 'Handpicked Just for You',
      listingsHeading: 'Our Listings',
      listingsCta: 'View All Listings',

      /* HOMEPAGE — testimonials */
      testEyebrow: 'Client Reviews',
      testHeading: 'What Our Clients Say',
      testReviewFor: 'Review for',
      testCta: 'Read All Client Reviews',

      /* HOMEPAGE — blog */
      blogEyebrow: 'Latest Insights &amp; Market Trends',
      blogHeading: 'Real Estate Tips &amp; Expert Advice',
      blogReadMore: 'Read More →',
      blogCta: 'View All Articles',

      /* HOMEPAGE — CTA banner */
      ctaEyebrow: 'Work With Us',
      ctaHeading: 'Find Your Dream Home Today',
      ctaPrimary: "Let’s Connect",
      ctaOutline: 'View Properties',

      /* CONTACT PAGE */
      contactHeroEyebrow: 'Palisade Realty, Inc.',
      contactHeroTitle: "Let’s <em>Connect</em>",
      contactHeroSub: "Whether you’re buying, selling, or just exploring — our team is ready to guide you every step of the way.",
      contactHeroBtn: 'Send Us a Message',
      contactInfoEyebrow: 'How to Reach Us',
      contactInfoHeading: "We’re Here to Help",
      contactFormEyebrow: 'Send a Message',
      contactFormHeading: 'Talk to Our <em style="font-style:italic;color:var(--brand)">Team</em>',
      contactFormIntro: 'Fill out the form below and a member of the Palisade Realty team will reach out within one business day.',
      formFirstName: 'First Name',
      formLastName: 'Last Name',
      formEmail: 'Email Address',
      formPhone: 'Phone Number',
      formSubject: 'Subject',
      formMessage: 'Message',
      formSubjectPlaceholder: 'Select a topic…',
      formSubjectBuying: "I’m interested in buying a home",
      formSubjectSelling: "I’d like to sell my home",
      formSubjectValuation: 'I want a home valuation',
      formSubjectCommunities: 'Community information',
      formSubjectFinancing: 'Financing questions',
      formSubjectOther: 'Other',
      formSendBtn: 'Send Message',
      formSuccessTitle: 'Message Received!',
      formSuccessMsg: "Thank you for reaching out. We’ll be in touch within one business day.",

      /* COMMUNITIES PAGE */
      commHeroEyebrow: 'Palisade Realty',
      commHeroTitle: 'San Diego Communities',
      commIntroEyebrow: 'Our Coverage',
      commIntroTitle: 'Find Your Perfect Place in San Diego',
      commIntroCta: 'Talk to a Local Expert',
      commGridEyebrow: 'Explore Every Area',
      commGridTitle: 'Our Communities',
      commCtaEyebrow: 'Work With Us',
      commCtaTitle: "Ready to Find Your Dream Community?",
      commCtaPrimary: "Let’s Connect",
      commCtaOutline: 'View Properties',
      commStatPremier: 'Premier Communities',
      commStatYears: 'Years of Experience',
      commStatAgents: 'Expert Agents',

      /* TEAM PAGE */
      teamHeroEyebrow: 'San Diego Real Estate',
      teamHeroTitle: 'Meet Our Team',
      teamHeroSub: 'Palisade Realty is a team of experienced, licensed real estate professionals serving the San Diego metro and surrounding communities.',
      teamHeroPrimary: 'Connect With Us',
      teamHeroOutline: 'Search Homes',
      teamWhyLocal: 'Local Expertise',
      teamWhyClient: 'Client-First Service',
      teamWhyProven: 'Proven Results',
      teamWhyReachable: 'Always Reachable',
      teamCtaEyebrow: 'Ready to Get Started?',
      teamCtaTitle: "Let’s Find Your Dream Home",
      teamCtaSub: 'Our team is ready to guide you through every step of the real estate process.',
      teamCtaPrimary: 'Contact an Agent',
      teamCtaOutline: 'Search Properties',

      /* TESTIMONIALS PAGE */
      testiHeroEyebrow: 'Trusted by Hundreds of Families',
      testiHeroTitle: 'Client Testimonials',
      testiHeroSub: 'Hear what our clients have to say about working with Palisade Realty.',
      testiStatFamilies: '500+ Families Helped',
      testiStatRating: '4.9★ Average Rating',
      testiStatYears: '15+ Years of Experience',
      testiStatAgents: '60+ Dedicated Agents',
      testiGalleryEyebrow: 'Client Photos',
      testiGalleryTitle: 'What Our Clients Are Sharing',
      testiGallerySub: 'Real moments from real clients across San Diego.',
      testiCtaEyebrow: 'Start Your Journey',
      testiCtaTitle: 'Ready to Experience the Palisade Difference?',
      testiCtaSub: 'Join the hundreds of families who trusted Palisade Realty to guide them home.',
      testiCtaBtn: 'Get in Touch',

      /* BLOG PAGE */
      blogHeroEyebrow: 'Resources &amp; Insights',
      blogHeroTitle: 'San Diego Real Estate Blog',
      blogHeroSub: 'Expert tips, local market insights, and practical advice for buyers, sellers, and homeowners throughout San Diego County.',
      blogFilterAll: 'All Posts',
      blogFilterBuyer: 'Buyer',
      blogFilterSeller: 'Seller',
      blogFilterHomeowner: 'Homeowner',
      blogFilterGeneral: 'General',
      blogCtaEyebrow: 'Ready to Make Your Move?',
      blogCtaTitle: 'Expert Guidance for Every Step',
      blogCtaSub: "Whether you’re buying your first home or selling a prized property in San Diego, our team is here to help.",
      blogCtaPrimary: 'Talk to an Agent',
      blogCtaOutline: 'Meet Our Team',
    },

    es: {
      /* NAV */
      buy: 'Comprar',
      sell: 'Vender',
      communities: 'Comunidades',
      commLabel: 'Comunidades de San Diego',
      commViewAll: 'Ver Todas las Comunidades',
      testimonials: 'Testimonios',
      properties: 'Propiedades',
      team: 'Equipo',
      blog: 'Blog',
      contact: 'Contacto',
      mobileComm: 'Comunidades ▾',

      /* FOOTER */
      footerLinksTitle: 'Enlaces Rápidos',
      footerContactTitle: 'Contacto',
      footerBuy: 'Comprar una Casa',
      footerSell: 'Vender tu Casa',
      footerCommunities: 'Comunidades',
      footerTestimonials: 'Testimonios',
      footerBlog: 'Blog',
      footerTeam: 'Nuestro Equipo',
      footerContactUs: 'Contáctanos',
      footerHours: 'Lun – Vie: 9:00 AM – 5:00 PM',

      /* HOMEPAGE — hero */
      heroSubtitle: 'Descubra la nueva forma de Comprar y Vender bienes raíces<br>en el mercado actual.',
      heroCta1: 'Encuentra tu Hogar Ideal',
      heroCta2: 'Conectemos',
      heroSearchLabel: 'Ciudad / Vecindario',
      heroSearchPlaceholder: 'Ciudad o Vecindario',
      heroTypeLabel: 'Tipo de Propiedad',
      heroPriceLabel: 'Precio Máximo',
      heroSearchBtn: 'BUSCAR',
      propResidential: 'Residencial',
      propCondo: 'Condominio',
      propTownhouse: 'Casa Adosada',
      propMultiFamily: 'Multifamiliar',
      propLand: 'Terreno',
      priceAny: 'Cualquier Precio',
      price500k: 'Menos de $500K',
      price1m: 'Menos de $1M',
      price2m: 'Menos de $2M',
      price5m: 'Menos de $5M',
      price10m: 'Menos de $10M',

      /* HOMEPAGE — communities */
      commEyebrow: 'Dónde Trabajamos',
      commHeading: 'Explore Nuestras Comunidades',
      commExplore: 'Explorar',

      /* HOMEPAGE — find your place */
      fypEyebrow: 'Explore la Región',
      fypTitle: 'Encontremos tu Lugar Ideal',
      fypSubtitle: 'Haz clic en cualquier ubicación para conocer más sobre cómo es vivir en esa comunidad.',
      fypCta: 'Ver Todas las Comunidades',

      /* HOMEPAGE — about */
      aboutTitle: 'Corredora Principal / CEO',
      aboutBio: 'Hedda fundó Palisade Realty en 2010 y la ha convertido en una de las firmas de bienes raíces de lujo más confiables de San Diego — con un equipo de más de 60 agentes y más de 15 años de experiencia en el mercado. Su compromiso con la representación innovadora, el profundo conocimiento local y el genuino cuidado por cada cliente han posicionado a Palisade Realty como la correduría preferida en toda la región de San Diego. Desde compradores primerizos hasta inversores experimentados, el equipo de Hedda ofrece la experiencia profesional, eficiente y gratificante que el mercado actual exige.',
      aboutCta: 'Conoce a Nuestro Equipo',

      /* HOMEPAGE — team carousel */
      teamEyebrow: 'El Equipo de Palisade Realty',
      teamHeading: 'Conozca a Nuestros Agentes',
      teamCta: 'Ver Todos los Agentes',

      /* HOMEPAGE — listings */
      listingsEyebrow: 'Seleccionados Especialmente para Usted',
      listingsHeading: 'Nuestras Propiedades',
      listingsCta: 'Ver Todas las Propiedades',

      /* HOMEPAGE — testimonials */
      testEyebrow: 'Reseñas de Clientes',
      testHeading: 'Lo Que Dicen Nuestros Clientes',
      testReviewFor: 'Reseña para',
      testCta: 'Leer Todas las Reseñas',

      /* HOMEPAGE — blog */
      blogEyebrow: 'Últimas Noticias y Tendencias del Mercado',
      blogHeading: 'Consejos de Bienes Raíces y Asesoría Experta',
      blogReadMore: 'Leer Más →',
      blogCta: 'Ver Todos los Artículos',

      /* HOMEPAGE — CTA banner */
      ctaEyebrow: 'Trabaje con Nosotros',
      ctaHeading: 'Encuentre su Hogar Ideal Hoy',
      ctaPrimary: 'Conectemos',
      ctaOutline: 'Ver Propiedades',

      /* CONTACT PAGE */
      contactHeroEyebrow: 'Palisade Realty, Inc.',
      contactHeroTitle: '<em>Conectemos</em>',
      contactHeroSub: 'Ya sea que esté comprando, vendiendo o simplemente explorando — nuestro equipo está listo para guiarle en cada paso del camino.',
      contactHeroBtn: 'Envíenos un Mensaje',
      contactInfoEyebrow: 'Cómo Contactarnos',
      contactInfoHeading: 'Estamos Aquí para Ayudarle',
      contactFormEyebrow: 'Enviar un Mensaje',
      contactFormHeading: 'Hable con Nuestro <em style="font-style:italic;color:var(--brand)">Equipo</em>',
      contactFormIntro: 'Complete el formulario a continuación y un miembro del equipo de Palisade Realty se pondrá en contacto en un día hábil.',
      formFirstName: 'Nombre',
      formLastName: 'Apellido',
      formEmail: 'Correo Electrónico',
      formPhone: 'Número de Teléfono',
      formSubject: 'Asunto',
      formMessage: 'Mensaje',
      formSubjectPlaceholder: 'Seleccione un tema…',
      formSubjectBuying: 'Me interesa comprar una casa',
      formSubjectSelling: 'Me gustaría vender mi casa',
      formSubjectValuation: 'Quiero una valoración de mi propiedad',
      formSubjectCommunities: 'Información sobre comunidades',
      formSubjectFinancing: 'Preguntas sobre financiamiento',
      formSubjectOther: 'Otro',
      formSendBtn: 'Enviar Mensaje',
      formSuccessTitle: '¡Mensaje Recibido!',
      formSuccessMsg: 'Gracias por contactarnos. Nos pondremos en contacto en un día hábil.',

      /* COMMUNITIES PAGE */
      commHeroEyebrow: 'Palisade Realty',
      commHeroTitle: 'Comunidades de San Diego',
      commIntroEyebrow: 'Nuestra Cobertura',
      commIntroTitle: 'Encuentre su Lugar Perfecto en San Diego',
      commIntroCta: 'Hablar con un Experto Local',
      commGridEyebrow: 'Explore Cada Área',
      commGridTitle: 'Nuestras Comunidades',
      commCtaEyebrow: 'Trabaje con Nosotros',
      commCtaTitle: '¿Listo para Encontrar su Comunidad Ideal?',
      commCtaPrimary: 'Conectemos',
      commCtaOutline: 'Ver Propiedades',
      commStatPremier: 'Comunidades Destacadas',
      commStatYears: 'Años de Experiencia',
      commStatAgents: 'Agentes Expertos',

      /* TEAM PAGE */
      teamHeroEyebrow: 'Bienes Raíces en San Diego',
      teamHeroTitle: 'Conozca a Nuestro Equipo',
      teamHeroSub: 'Palisade Realty es un equipo de profesionales inmobiliarios con licencia y experiencia que atiende al metro de San Diego y comunidades circundantes.',
      teamHeroPrimary: 'Contáctenos',
      teamHeroOutline: 'Buscar Casas',
      teamWhyLocal: 'Experiencia Local',
      teamWhyClient: 'Servicio Centrado en el Cliente',
      teamWhyProven: 'Resultados Comprobados',
      teamWhyReachable: 'Siempre Disponibles',
      teamCtaEyebrow: '¿Listo para Comenzar?',
      teamCtaTitle: 'Encontremos su Hogar Ideal',
      teamCtaSub: 'Nuestro equipo está listo para guiarle en cada paso del proceso inmobiliario.',
      teamCtaPrimary: 'Contactar a un Agente',
      teamCtaOutline: 'Buscar Propiedades',

      /* TESTIMONIALS PAGE */
      testiHeroEyebrow: 'La Confianza de Cientos de Familias',
      testiHeroTitle: 'Testimonios de Clientes',
      testiHeroSub: 'Escuche lo que nuestros clientes dicen sobre trabajar con Palisade Realty.',
      testiStatFamilies: '500+ Familias Atendidas',
      testiStatRating: '4.9★ Calificación Promedio',
      testiStatYears: '15+ Años de Experiencia',
      testiStatAgents: '60+ Agentes Dedicados',
      testiGalleryEyebrow: 'Fotos de Clientes',
      testiGalleryTitle: 'Lo Que Comparten Nuestros Clientes',
      testiGallerySub: 'Momentos reales de clientes reales en todo San Diego.',
      testiCtaEyebrow: 'Comience su Camino',
      testiCtaTitle: '¿Listo para Vivir la Diferencia Palisade?',
      testiCtaSub: 'Úntese a las cientos de familias que confiaron en Palisade Realty para guiarles a casa.',
      testiCtaBtn: 'Contáctenos',

      /* BLOG PAGE */
      blogHeroEyebrow: 'Recursos y Perspectivas',
      blogHeroTitle: 'Blog de Bienes Raíces en San Diego',
      blogHeroSub: 'Consejos de expertos, perspectivas del mercado local y asesoría práctica para compradores, vendedores y propietarios en todo el Condado de San Diego.',
      blogFilterAll: 'Todo',
      blogFilterBuyer: 'Compradores',
      blogFilterSeller: 'Vendedores',
      blogFilterHomeowner: 'Propietarios',
      blogFilterGeneral: 'General',
      blogCtaEyebrow: '¿Listo para Dar el Siguiente Paso?',
      blogCtaTitle: 'Asesoría Experta en Cada Etapa',
      blogCtaSub: 'Ya sea que esté comprando su primera casa o vendiendo una propiedad en San Diego, nuestro equipo está aquí para ayudarle.',
      blogCtaPrimary: 'Hablar con un Agente',
      blogCtaOutline: 'Conocer al Equipo',
    }
  };

  /* ── Helpers ─────────────────────────────────────────────── */

  /* Move SVG out, set text, put SVG back at end */
  function svgEnd(el, text) {
    if (!el) return;
    var svg = el.querySelector('svg');
    el.textContent = text;
    if (svg) el.appendChild(svg);
  }

  /* Move SVG out, set text, put SVG back at start */
  function svgStart(el, text) {
    if (!el) return;
    var svg = el.querySelector('svg');
    el.textContent = text;
    if (svg) el.insertBefore(svg, el.firstChild);
  }

  /* Update label text while preserving child <span> (required asterisk) */
  function setLabel(forId, text) {
    var label = document.querySelector('label[for="' + forId + '"]');
    if (!label) return;
    var nodes = label.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 3) { /* TEXT_NODE */
        nodes[i].textContent = text + ' ';
        return;
      }
    }
    label.textContent = text;
  }

  /* ── Core translate function ─────────────────────────────── */
  function applyLang(lang) {
    var d = DICT[lang];
    document.documentElement.lang = lang;
    localStorage.setItem('pr-lang', lang);

    /* ── NAV (desktop) ─────────────────────────────────────── */
    document.querySelectorAll('.nav-links a[href*="palisaderealty.com/"]:not([href*="seller"])').forEach(function (el) {
      el.textContent = d.buy;
    });
    document.querySelectorAll('.nav-links a[href*="/seller"]').forEach(function (el) {
      el.textContent = d.sell;
    });
    document.querySelectorAll('.nav-dropdown-trigger').forEach(function (el) {
      svgEnd(el, d.communities);
    });
    document.querySelectorAll('.nav-dropdown-label').forEach(function (el) {
      el.textContent = d.commLabel;
    });
    document.querySelectorAll('.nav-dropdown-all a').forEach(function (el) {
      svgEnd(el, d.commViewAll);
    });
    document.querySelectorAll('.nav-links a[href*="testimonials"]').forEach(function (el) {
      el.textContent = d.testimonials;
    });
    document.querySelectorAll('.nav-links a[href*="fl-section"], .nav-links a[href="/#listings"]').forEach(function (el) {
      el.textContent = d.properties;
    });
    document.querySelectorAll('.nav-links a[href*="team.html"], .nav-links a[href*="#team-carousel"]').forEach(function (el) {
      el.textContent = d.team;
    });
    document.querySelectorAll('.nav-links a[href*="blog.html"], .nav-links a[href="/#blog"]').forEach(function (el) {
      el.textContent = d.blog;
    });
    document.querySelectorAll('.nav-links a[href*="contact.html"]').forEach(function (el) {
      el.textContent = d.contact;
    });

    /* ── NAV (mobile drawer) ────────────────────────────────── */
    document.querySelectorAll('.nav-mobile-drawer a[href*="palisaderealty.com/"]:not([href*="seller"])').forEach(function (el) {
      el.textContent = d.buy;
    });
    document.querySelectorAll('.nav-mobile-drawer a[href*="/seller"]').forEach(function (el) {
      el.textContent = d.sell;
    });
    document.querySelectorAll('.mobile-communities-toggle').forEach(function (el) {
      el.textContent = d.mobileComm;
    });
    document.querySelectorAll('.nav-mobile-drawer a[href*="testimonials"]').forEach(function (el) {
      el.textContent = d.testimonials;
    });
    document.querySelectorAll('.nav-mobile-drawer a[href*="fl-section"], .nav-mobile-drawer a[href="/#listings"]').forEach(function (el) {
      el.textContent = d.properties;
    });
    document.querySelectorAll('.nav-mobile-drawer a[href*="team.html"], .nav-mobile-drawer a[href*="#team-carousel"]').forEach(function (el) {
      el.textContent = d.team;
    });
    document.querySelectorAll('.nav-mobile-drawer a[href*="blog.html"], .nav-mobile-drawer a[href="/#blog"]').forEach(function (el) {
      el.textContent = d.blog;
    });
    document.querySelectorAll('.nav-mobile-drawer a[href*="contact.html"]').forEach(function (el) {
      el.textContent = d.contact;
    });

    /* ── FOOTER ─────────────────────────────────────────────── */
    document.querySelectorAll('.footer-col-title').forEach(function (el) {
      var t = el.textContent.trim();
      if (t === 'Quick Links' || t === 'Enlaces Rápidos') el.textContent = d.footerLinksTitle;
      else if (t === 'Contact' || t === 'Contacto') el.textContent = d.footerContactTitle;
    });
    document.querySelectorAll('.footer-links a[href*="palisaderealty.com/"]:not([href*="seller"])').forEach(function (el) {
      el.textContent = d.footerBuy;
    });
    document.querySelectorAll('.footer-links a[href*="/seller"]').forEach(function (el) {
      el.textContent = d.footerSell;
    });
    document.querySelectorAll('.footer-links a[href$="communities.html"]:not([href*="/communities/"])').forEach(function (el) {
      el.textContent = d.footerCommunities;
    });
    document.querySelectorAll('.footer-links a[href$="testimonials.html"]').forEach(function (el) {
      el.textContent = d.footerTestimonials;
    });
    document.querySelectorAll('.footer-links a[href$="blog.html"]').forEach(function (el) {
      el.textContent = d.footerBlog;
    });
    document.querySelectorAll('.footer-links a[href$="team.html"]').forEach(function (el) {
      el.textContent = d.footerTeam;
    });
    document.querySelectorAll('.footer-links a[href$="contact.html"]').forEach(function (el) {
      el.textContent = d.footerContactUs;
    });
    document.querySelectorAll('.footer-contact-line').forEach(function (el) {
      var t = el.textContent.trim();
      if (t.indexOf('Mon') === 0 || t.indexOf('Lun') === 0) el.textContent = d.footerHours;
    });

    /* ── HOMEPAGE ────────────────────────────────────────────── */
    var heroSub = document.querySelector('.hero-subtitle');
    if (heroSub) heroSub.innerHTML = d.heroSubtitle;

    var heroCta1 = document.querySelector('.hero-ctas .btn-brand-lg');
    if (heroCta1) heroCta1.textContent = d.heroCta1;

    var heroCta2 = document.querySelector('.hero-ctas .btn-outline-white');
    if (heroCta2) heroCta2.textContent = d.heroCta2;

    var heroQLbl = document.querySelector('label[for="hero-q"]');
    if (heroQLbl) heroQLbl.textContent = d.heroSearchLabel;

    var heroQIn = document.getElementById('hero-q');
    if (heroQIn) heroQIn.placeholder = d.heroSearchPlaceholder;

    var heroTypeLbl = document.querySelector('label[for="hero-type"]');
    if (heroTypeLbl) heroTypeLbl.textContent = d.heroTypeLabel;

    var heroPriceLbl = document.querySelector('label[for="hero-price"]');
    if (heroPriceLbl) heroPriceLbl.textContent = d.heroPriceLabel;

    var heroBtn = document.querySelector('.hero-search-btn');
    if (heroBtn) svgStart(heroBtn, d.heroSearchBtn);

    var typeSelect = document.getElementById('hero-type');
    if (typeSelect) {
      var typeKeys = ['propResidential', 'propCondo', 'propTownhouse', 'propMultiFamily', 'propLand'];
      typeSelect.querySelectorAll('option').forEach(function (opt, i) {
        if (typeKeys[i]) opt.textContent = d[typeKeys[i]];
      });
    }

    var priceSelect = document.getElementById('hero-price');
    if (priceSelect) {
      var priceKeys = ['priceAny', 'price500k', 'price1m', 'price2m', 'price5m', 'price10m'];
      priceSelect.querySelectorAll('option').forEach(function (opt, i) {
        if (priceKeys[i]) opt.textContent = d[priceKeys[i]];
      });
    }

    var commEyebrow = document.querySelector('.communities-eyebrow');
    if (commEyebrow) commEyebrow.textContent = d.commEyebrow;

    var commHeading = document.querySelector('.communities-heading');
    if (commHeading) commHeading.textContent = d.commHeading;

    document.querySelectorAll('.community-explore-btn').forEach(function (el) {
      svgEnd(el, d.commExplore);
    });

    var fypEy = document.querySelector('.find-your-place .eyebrow');
    if (fypEy) fypEy.textContent = d.fypEyebrow;

    var fypTitle = document.querySelector('.fyp-title');
    if (fypTitle) fypTitle.textContent = d.fypTitle;

    var fypSub = document.querySelector('.fyp-subtitle');
    if (fypSub) fypSub.textContent = d.fypSubtitle;

    var fypCta = document.querySelector('.find-your-place .btn-brand');
    if (fypCta) fypCta.textContent = d.fypCta;

    var aboutTitle = document.querySelector('.about-title');
    if (aboutTitle) aboutTitle.textContent = d.aboutTitle;

    var aboutBio = document.querySelector('.about-bio');
    if (aboutBio) aboutBio.textContent = d.aboutBio;

    var aboutCta = document.querySelector('.about-cta .btn-brand');
    if (aboutCta) aboutCta.textContent = d.aboutCta;

    var tcEy = document.querySelector('.tc-eyebrow');
    if (tcEy) tcEy.textContent = d.teamEyebrow;

    var tcTitle = document.querySelector('.tc-title');
    if (tcTitle) tcTitle.textContent = d.teamHeading;

    var teamCta = document.querySelector('.team-cta-row .btn-brand');
    if (teamCta) teamCta.textContent = d.teamCta;

    var listEy = document.querySelector('.listings-eyebrow');
    if (listEy) listEy.textContent = d.listingsEyebrow;

    var listHd = document.querySelector('.listings-heading');
    if (listHd) listHd.textContent = d.listingsHeading;

    var listCta = document.querySelector('.listings .btn-brand');
    if (listCta) listCta.textContent = d.listingsCta;

    var testEy = document.querySelector('.testimonial-eyebrow');
    if (testEy) testEy.textContent = d.testEyebrow;

    var testHd = document.querySelector('.testimonial-heading');
    if (testHd) testHd.textContent = d.testHeading;

    document.querySelectorAll('.tp-review-for').forEach(function (el) {
      el.textContent = d.testReviewFor;
    });

    var testCta = document.querySelector('.tp-see-more-btn');
    if (testCta) svgEnd(testCta, d.testCta);

    var blogEy = document.querySelector('.blog-eyebrow');
    if (blogEy) blogEy.innerHTML = d.blogEyebrow;

    var blogHd = document.querySelector('.blog-heading');
    if (blogHd) blogHd.innerHTML = d.blogHeading;

    document.querySelectorAll('.blog-card-link').forEach(function (el) {
      el.innerHTML = d.blogReadMore;
    });

    var blogCta = document.querySelector('.blog .btn-brand');
    if (blogCta) blogCta.textContent = d.blogCta;

    var ctaEy = document.querySelector('.cta-banner-eyebrow');
    if (ctaEy) ctaEy.textContent = d.ctaEyebrow;

    var ctaHd = document.querySelector('.cta-banner-title');
    if (ctaHd) ctaHd.textContent = d.ctaHeading;

    var ctaP = document.querySelector('.cta-banner-btn-primary');
    if (ctaP) ctaP.textContent = d.ctaPrimary;

    var ctaO = document.querySelector('.cta-banner-btn-outline');
    if (ctaO) ctaO.textContent = d.ctaOutline;

    /* ── CONTACT PAGE ──────────────────────────────────────── */
    var cHeroEy = document.querySelector('.contact-hero-eyebrow');
    if (cHeroEy) cHeroEy.textContent = d.contactHeroEyebrow;

    var cHeroT = document.querySelector('.contact-hero-title');
    if (cHeroT) cHeroT.innerHTML = d.contactHeroTitle;

    var cHeroS = document.querySelector('.contact-hero-sub');
    if (cHeroS) cHeroS.textContent = d.contactHeroSub;

    var cHeroB = document.querySelector('.contact-hero-content .btn-brand');
    if (cHeroB) cHeroB.textContent = d.contactHeroBtn;

    var cInfoEy = document.querySelector('.contact-info-head .eyebrow');
    if (cInfoEy) cInfoEy.textContent = d.contactInfoEyebrow;

    var cInfoHd = document.querySelector('.contact-info-head .section-title');
    if (cInfoHd) cInfoHd.textContent = d.contactInfoHeading;

    var cFormEy = document.querySelector('.contact-form-col .eyebrow');
    if (cFormEy) cFormEy.textContent = d.contactFormEyebrow;

    var cFormHd = document.querySelector('.contact-form-col .section-title');
    if (cFormHd) cFormHd.innerHTML = d.contactFormHeading;

    var cFormIn = document.querySelector('.contact-form-intro');
    if (cFormIn) cFormIn.textContent = d.contactFormIntro;

    setLabel('first-name', d.formFirstName);
    setLabel('last-name', d.formLastName);
    setLabel('email', d.formEmail);
    setLabel('phone', d.formPhone);
    setLabel('subject', d.formSubject);
    setLabel('message', d.formMessage);

    var subSel = document.getElementById('subject');
    if (subSel) {
      var subKeys = ['formSubjectPlaceholder', 'formSubjectBuying', 'formSubjectSelling',
        'formSubjectValuation', 'formSubjectCommunities', 'formSubjectFinancing', 'formSubjectOther'];
      subSel.querySelectorAll('option').forEach(function (opt, i) {
        if (subKeys[i]) opt.textContent = d[subKeys[i]];
      });
    }

    var formBtn = document.getElementById('form-submit-btn');
    if (formBtn) svgEnd(formBtn, d.formSendBtn);

    var succT = document.querySelector('#form-success h3');
    if (succT) succT.textContent = d.formSuccessTitle;

    var succM = document.querySelector('#form-success p');
    if (succM) succM.textContent = d.formSuccessMsg;

    /* ── COMMUNITIES PAGE ───────────────────────────────────── */
    var cmHeroEy = document.querySelector('.comm-hero-eyebrow');
    if (cmHeroEy) cmHeroEy.textContent = d.commHeroEyebrow;

    var cmHeroT = document.querySelector('.comm-hero-title');
    if (cmHeroT) cmHeroT.textContent = d.commHeroTitle;

    var cmIntroEy = document.querySelector('.comm-intro-eyebrow');
    if (cmIntroEy) cmIntroEy.textContent = d.commIntroEyebrow;

    var cmIntroT = document.querySelector('.comm-intro-title');
    if (cmIntroT) cmIntroT.textContent = d.commIntroTitle;

    var cmIntroCta = document.querySelector('.comm-intro-cta');
    if (cmIntroCta) cmIntroCta.textContent = d.commIntroCta;

    var cmGridEy = document.querySelector('.comm-grid-eyebrow');
    if (cmGridEy) cmGridEy.textContent = d.commGridEyebrow;

    var cmGridT = document.querySelector('.comm-grid-title');
    if (cmGridT) cmGridT.textContent = d.commGridTitle;

    var cmCtaEy = document.querySelector('.comm-cta-eyebrow');
    if (cmCtaEy) cmCtaEy.textContent = d.commCtaEyebrow;

    var cmCtaT = document.querySelector('.comm-cta-title');
    if (cmCtaT) cmCtaT.textContent = d.commCtaTitle;

    var cmCtaP = document.querySelector('.comm-cta-btn-primary');
    if (cmCtaP) cmCtaP.textContent = d.commCtaPrimary;

    var cmCtaO = document.querySelector('.comm-cta-btn-outline');
    if (cmCtaO) cmCtaO.textContent = d.commCtaOutline;

    var cmTiles = document.querySelectorAll('.comm-intro-tile-label');
    var tileKeys = ['commStatPremier', 'commStatYears', 'commStatAgents'];
    cmTiles.forEach(function (el, i) { if (tileKeys[i]) el.textContent = d[tileKeys[i]]; });

    /* ── TEAM PAGE ──────────────────────────────────────────── */
    var tpHeroEy = document.querySelector('.tp-hero .tp-eyebrow');
    if (tpHeroEy) tpHeroEy.textContent = d.teamHeroEyebrow;

    var tpHeroT = document.querySelector('.tp-hero-h1');
    if (tpHeroT) tpHeroT.textContent = d.teamHeroTitle;

    var tpHeroS = document.querySelector('.tp-hero-sub');
    if (tpHeroS) tpHeroS.textContent = d.teamHeroSub;

    var tpHeroP = document.querySelector('.tp-hero .btn-brand');
    if (tpHeroP) tpHeroP.textContent = d.teamHeroPrimary;

    var tpHeroO = document.querySelector('.tp-hero .btn-outline-brand');
    if (tpHeroO) tpHeroO.textContent = d.teamHeroOutline;

    var whyTitles = document.querySelectorAll('.tp-why-title');
    var whyKeys = ['teamWhyLocal', 'teamWhyClient', 'teamWhyProven', 'teamWhyReachable'];
    whyTitles.forEach(function (el, i) { if (whyKeys[i]) el.textContent = d[whyKeys[i]]; });

    var tpCtaEy = document.querySelector('.tp-cta .tp-eyebrow');
    if (tpCtaEy) tpCtaEy.textContent = d.teamCtaEyebrow;

    var tpCtaT = document.querySelector('.tp-cta-h2');
    if (tpCtaT) tpCtaT.textContent = d.teamCtaTitle;

    var tpCtaS = document.querySelector('.tp-cta-sub');
    if (tpCtaS) tpCtaS.textContent = d.teamCtaSub;

    var tpCtaP = document.querySelector('.tp-cta .btn-brand');
    if (tpCtaP) tpCtaP.textContent = d.teamCtaPrimary;

    var tpCtaO = document.querySelector('.tp-cta .btn-outline-white');
    if (tpCtaO) tpCtaO.textContent = d.teamCtaOutline;

    /* ── TESTIMONIALS PAGE ──────────────────────────────────── */
    var tHeroEy = document.querySelector('.test-hero-eyebrow');
    if (tHeroEy) tHeroEy.textContent = d.testiHeroEyebrow;

    var tHeroT = document.querySelector('.test-hero-heading');
    if (tHeroT) tHeroT.textContent = d.testiHeroTitle;

    var tHeroS = document.querySelector('.test-hero-sub');
    if (tHeroS) tHeroS.textContent = d.testiHeroSub;

    var statLabels = document.querySelectorAll('.stats-bar .stat-label');
    var statKeys = ['testiStatFamilies', 'testiStatRating', 'testiStatYears', 'testiStatAgents'];
    statLabels.forEach(function (el, i) { if (statKeys[i]) el.textContent = d[statKeys[i]]; });

    var galEy = document.querySelector('.review-gallery .section-eyebrow');
    if (galEy) galEy.textContent = d.testiGalleryEyebrow;

    var galT = document.querySelector('.review-gallery .section-heading');
    if (galT) galT.textContent = d.testiGalleryTitle;

    var galS = document.querySelector('.review-gallery .section-sub');
    if (galS) galS.textContent = d.testiGallerySub;

    var tCtaEy = document.querySelector('.test-cta-eyebrow');
    if (tCtaEy) tCtaEy.textContent = d.testiCtaEyebrow;

    var tCtaT = document.querySelector('.test-cta-heading');
    if (tCtaT) tCtaT.textContent = d.testiCtaTitle;

    var tCtaS = document.querySelector('.test-cta-sub');
    if (tCtaS) tCtaS.textContent = d.testiCtaSub;

    var tCtaB = document.querySelector('.test-cta-btn');
    if (tCtaB) tCtaB.textContent = d.testiCtaBtn;

    /* ── BLOG PAGE ──────────────────────────────────────────── */
    var bHeroEy = document.querySelector('.blog-hero-eyebrow');
    if (bHeroEy) bHeroEy.innerHTML = d.blogHeroEyebrow;

    var bHeroT = document.querySelector('.blog-hero-title');
    if (bHeroT) bHeroT.textContent = d.blogHeroTitle;

    var bHeroS = document.querySelector('.blog-hero-sub');
    if (bHeroS) bHeroS.textContent = d.blogHeroSub;

    var bFilters = document.querySelectorAll('.bf-tab');
    var filterKeys = ['blogFilterAll', 'blogFilterBuyer', 'blogFilterSeller', 'blogFilterHomeowner', 'blogFilterGeneral'];
    bFilters.forEach(function (el, i) { if (filterKeys[i]) el.textContent = d[filterKeys[i]]; });

    var bCtaEy = document.querySelector('.blog-cta-eyebrow');
    if (bCtaEy) bCtaEy.textContent = d.blogCtaEyebrow;

    var bCtaT = document.querySelector('.blog-cta-title');
    if (bCtaT) bCtaT.textContent = d.blogCtaTitle;

    var bCtaS = document.querySelector('.blog-cta-sub');
    if (bCtaS) bCtaS.textContent = d.blogCtaSub;

    var bCtaP = document.querySelector('.blog-cta .btn-brand');
    if (bCtaP) bCtaP.textContent = d.blogCtaPrimary;

    var bCtaO = document.querySelector('.blog-cta .btn-outline-white');
    if (bCtaO) bCtaO.textContent = d.blogCtaOutline;

    /* ── TOGGLE BUTTON STATE ────────────────────────────────── */
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      var enSpan = btn.querySelector('.lang-en');
      var esSpan = btn.querySelector('.lang-es');
      if (enSpan) enSpan.classList.toggle('lang-active', lang === 'en');
      if (esSpan) esSpan.classList.toggle('lang-active', lang === 'es');
    }
  }

  /* ── Init ────────────────────────────────────────────────── */
  function getLang() {
    return localStorage.getItem('pr-lang') || 'en';
  }

  function initToggle() {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      applyLang(getLang() === 'en' ? 'es' : 'en');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(getLang());
    initToggle();
  });

})();

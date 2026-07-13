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

      /* HOMEPAGE — featured listings carousel */
      flHeading: 'Featured Properties',
      flStatusActive: 'For Sale',
      flStatusPending: 'Pending',
      flStatusSold: 'Sold',
      flBeds: 'Beds',
      flBaths: 'Baths',
      flSqft: 'Sq Ft',
      flViewProp: 'View Property',

      /* HOMEPAGE — testimonials */
      testEyebrow: 'Client Reviews',
      testHeading: 'What Our Clients Say',
      testReviewFor: 'Review for',
      testimonialQuotes: [
        ‘“Working with Anh was honestly one of the best decisions we made. She made the entire process as stress free as possible, going above and beyond to make sure we had everything on our list. Her knowledge of the market and outstanding communication gave us confidence every step of the way — we truly felt like she had our best interests at heart the entire time.”’,
        ‘“We worked with Wally on both the sale of our condo and the purchase of our home, and had a fantastic experience from start to finish. What we appreciated most was his communication — consistent real-time updates, total honesty at every stage, and a network of trusted professionals that made the entire process much smoother. Highly recommend!”’,
        ‘“Five stars truly isn’t enough to describe working with Jennifer. She brings a rare combination of deep market knowledge, flawless professionalism, and a brilliant get-it-done attitude. Real estate transactions can be stressful, but she completely shielded me from all of it — the process was entirely seamless. She is exceptional; I’d recommend her to anyone!”’,
        ‘“We had a great experience working with Taylor. She was consistently responsive, friendly, and took the time to clearly explain each step of the process — which made everything feel much less overwhelming. She was also a strong negotiator and helped us feel confident we were getting the best possible outcome from start to finish!”’,
        ‘“Jeremy managed to help us sell our house completely off-market, which saved us an incredible amount of time and stress. He flawlessly handled all the paperwork and took care of every interaction with contractors and vendors — we never had to worry about coordinating a thing. We cannot recommend Jeremy highly enough!”’,
        ‘“Corinne went above and beyond. She was always available every weekend to tour whatever listing we sent her way, did her homework on each house beforehand, and listened carefully to our needs. She was always quick to respond and was consistently a dream to work with. We will be sending her name around to anyone we know who is house hunting!”’,
        ‘“We can’t recommend Jodi Kirkwood highly enough! She helped us both purchase our upstairs condo and sell our existing condo. Her knowledge of the local market is outstanding, and thanks to her expertise we received top dollar for our sale. She was always responsive, professional, and a strong advocate for us every step of the way. We would absolutely work with her again.”’
      ],
      rgTestimonialQuotes: [
        ‘“My partner and I have been working with Anh for years — first in buying our home and then selling. Working with Anh was honestly one of the best decisions we made. From guiding us through the purchase of our new home and then helping us sell our home, she made the entire process as stress-free as possible. She helped us search for a home for almost an entire year and would go above and beyond making sure we had everything on our must-have list. Her knowledge of the market and outstanding communication gave us confidence every step of the way. She was always available to answer our questions, offered honest advice, and went out of her way to make sure everything stayed on track. Thanks to her expertise, our home sold as quickly as possible in this unsure market. We truly felt like she had our best interests at heart the entire time. If you’re looking for a dedicated, professional, and genuinely caring realtor, we can’t recommend Anh Lam highly enough.”’,
        ‘“We worked with Wally on both the sale of our condo and the purchase of our home, and had a fantastic experience from start to finish. His attention to detail stood out throughout the process — he helped us with staging, created a professional video to boost exposure, and ensured our listing was on Zillow Showcase. What we appreciated most was his communication. He consistently provided real-time updates so we were always in the loop. Wally was also honest and transparent at every stage, which helped us feel confident in our decisions. He was not pushy — he would present the facts and respected our decisions. On top of that, his network of trusted professionals made the entire process much smoother. We would highly recommend him to anyone buying or selling a home.”’,
        ‘“Five stars truly isn’t enough to describe the experience of working with her. She brings a rare combination of deep market knowledge, flawless professionalism, and a brilliant, get-it-done attitude. Real estate transactions can be a minefield of stress, but she completely shielded me from all of it. The process was entirely seamless. She was proactively communicative, keeping me updated every step of the way and explaining everything clearly so I always felt confident in our choices. Her expertise is undeniable, but it’s her drive and dedication to her clients that make her an absolute rockstar in her field. She handles every detail so you can just focus on the excitement of your next chapter.”’,
        ‘“We had a great experience working with our realtor, Taylor. She was consistently responsive, friendly, and took the time to clearly explain each step of the process, which made everything feel much less overwhelming. She was also a strong negotiator and helped us feel confident we were getting the best possible outcome. We really appreciated how quickly she answered questions and kept things moving smoothly from start to finish!”’,
        ‘“We recently worked with Jeremy McHone to sell our home in Ramona, and the experience was absolutely exceptional from start to finish. Jeremy managed to help us sell our house completely off-market, which saved us an incredible amount of time and stress. What truly set him apart was his comprehensive management of the entire transaction. He flawlessly handled all the paperwork for both the sellers and the buyers, navigating the complexities of the process with total professionalism and transparency. Beyond the contracts and escrow, Jeremy went above and beyond by taking care of all interactions with the various contractors and vendors. We never had to worry about coordinating schedules or following up on progress — he handled it all. If you want a realtor who is proactive, organized, and truly takes the burden off your shoulders, we cannot recommend Jeremy highly enough!”’,
        ‘“Corinne went above and beyond. We had been house hunting for months and she was always available every weekend to tour whatever listing we sent her way. She did her homework before each showing to provide us with the information we needed. She listened to our needs and would send listings our way that she found. She was always quick to respond and was consistently a dream to work with. We will be sending her name around to anyone we know who is house hunting!”’,
        ‘“We can’t recommend Jodi Kirkwood highly enough! She helped us both purchase our upstairs condo and sell our existing condo, and the entire experience was exceptional from start to finish. Her knowledge of the local market is outstanding, and her advice throughout the process was invaluable. She knew exactly how to position our condo, and thanks to her expertise, we received top dollar for our sale. What impressed us most was her attention to detail, market knowledge, and ability to navigate every challenge with confidence and ease. Buying and selling at the same time can be stressful, but she made the process smooth and manageable. We are incredibly grateful for all of her help and would absolutely work with her again.”’,
        ‘“Working with Katie was an amazing experience from start to finish. She is kind, patient, understanding, and truly listens to her clients. Throughout our home search, she took the time to understand exactly what we were looking for and never made us feel rushed or pressured. Katie was always professional, responsive, and available whenever we had questions or concerns. Her knowledge of the home-buying process gave us confidence every step of the way. What really stood out was how different she was from other realtors we had met — she genuinely cared about helping us find the right home and making sure we felt informed and supported. We would highly recommend her to anyone looking to buy or sell a home.”’,
        ‘“Chip was amazing from start to finish. He met with us ahead of listing the property and completed a very comprehensive interview about us and the property. He helped us set what turned out to be the perfect price point. He connected us with two staging resources that gave us a great ability to stage the property to reflect how much we loved it. He did a series of open houses that leveraged a great selling strategy, which was very successful and resulted in a sale in less than 3 weeks. He was a skilled negotiator with the buyer. We highly recommend Chip if you are looking for a realtor who is top shelf!”’
      ],
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

      /* COMMUNITY DETAIL PAGES */
      cdStatActiveListings: 'Active Listings',
      cdStatMedianPrice: 'Median Price',
      cdStatPropertyTypes: 'Property Types',
      cdStatUpdated: 'Updated',
      cdEyebrowLocation: 'Location',
      cdEyebrowDemographics: 'Community Demographics',
      cdEyebrowHighlights: 'What Makes It Special',
      cdEyebrowListings: 'Live MLS Data',
      cdEyebrowHOA: 'What to Expect',
      cdEyebrowParks: 'Outdoor Living',
      cdEyebrowSchools: 'Education',
      cdEyebrowComparisons: 'Comparisons',
      cdEyebrowFAQ: 'Common Questions',
      cdBtnConnect: 'Connect With Hedda',
      cdBtnViewListings: 'View Listings ↓',
      cdViewAllListings: 'View All Listings →',
      cdSendMessage: 'Send a Message',
      cdQuickFactsHeading: 'At a Glance',
      cdFactCityType: 'City Type',
      cdFactCounty: 'County',
      cdFactPopulation: 'Population',
      cdFactMedianPrice: 'Median Home Price',
      cdFactArchitecture: 'Architecture',
      cdFactWalkScore: 'Walk Score',
      cdFactAirport: 'Airport',
      cdDemoPopulation: 'Population',
      cdDemoMedianAge: 'Median Age',
      cdDemoAvgIncome: 'Avg Household Income',
      cdDemoTotalHouseholds: 'Total Households',
      cdDemoOwnershipRate: 'Ownership Rate',
      cdDemoSource: 'Source: U.S. Census Bureau, ACS 5-Year Estimates',
      cdHOAHaveQuestions: 'Have Questions?',
      cdHOACoversTitle: 'What HOAs Typically Cover',
      cdHOATableType: 'Community Type',
      cdHOATableMonthly: 'Monthly HOA',
      cdStatWalkScore: 'Walk Score',
      cdStatSunnyDays: 'Sunny Days / Year',
      cdNavFinancing: 'Financing',
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

      /* HOMEPAGE — featured listings carousel */
      flHeading: 'Propiedades Destacadas',
      flStatusActive: 'En Venta',
      flStatusPending: 'Pendiente',
      flStatusSold: 'Vendido',
      flBeds: 'Rec.',
      flBaths: 'Baños',
      flSqft: 'Pie²',
      flViewProp: 'Ver Propiedad',

      /* HOMEPAGE — testimonials */
      testEyebrow: 'Reseñas de Clientes',
      testHeading: 'Lo Que Dicen Nuestros Clientes',
      testReviewFor: 'Reseña para',
      testimonialQuotes: [
        '"Trabajar con Anh fue, sin duda, una de las mejores decisiones que tomamos. Hizo que todo el proceso fuera lo más libre de estrés posible, yendo más allá para asegurarse de que tuviéramos todo en nuestra lista. Su conocimiento del mercado y su excelente comunicación nos dieron confianza en cada paso del camino — verdaderamente sentimos que tenía nuestros mejores intereses en mente en todo momento."',
        '"Trabajamos con Wally tanto en la venta de nuestro condominio como en la compra de nuestra casa, y tuvimos una experiencia fantástica de principio a fin. Lo que más apreciamos fue su comunicación — actualizaciones constantes en tiempo real, total honestidad en cada etapa, y una red de profesionales de confianza que hicieron que todo el proceso fuera mucho más fluido. ¡Altamente recomendado!"',
        '"Cinco estrellas verdaderamente no son suficientes para describir trabajar con Jennifer. Aporta una combinación única de profundo conocimiento del mercado, profesionalismo impecable y una brillante actitud de hacer las cosas. Las transacciones inmobiliarias pueden ser estresantes, pero ella me protegió completamente de todo eso — el proceso fue totalmente fluido. ¡Es excepcional; la recomendaría a cualquier persona!"',
        '"Tuvimos una excelente experiencia trabajando con Taylor. Siempre fue muy atenta, amable y se tomó el tiempo de explicar claramente cada paso del proceso — lo que hizo que todo se sintiera mucho menos abrumador. También fue una negociadora muy capaz y nos ayudó a sentirnos seguros de que estábamos obteniendo el mejor resultado posible de principio a fin."',
        '"Jeremy logró ayudarnos a vender nuestra casa completamente fuera del mercado, lo que nos ahorró una cantidad increíble de tiempo y estrés. Manejó todo el papeleo sin contratiempos y se encargó de cada interacción con contratistas y proveedores — nunca tuvimos que preocuparnos por coordinar nada. ¡No podemos recomendar a Jeremy lo suficiente!"',
        '"Corinne hizo más de lo esperado. Siempre estuvo disponible cada fin de semana para visitar cualquier propiedad que le enviáramos, se preparó para cada casa de antemano y escuchó con atención nuestras necesidades. Siempre respondió rápidamente y fue un placer trabajar con ella. ¡Recomendaremos su nombre a todos los que conozcamos que estén buscando casa!"',
        '"¡No podemos recomendar a Jodi Kirkwood lo suficiente! Nos ayudó tanto a comprar nuestro condominio del piso de arriba como a vender nuestro condominio existente. Su conocimiento del mercado local es sobresaliente, y gracias a su experiencia recibimos el mejor precio por nuestra venta. Siempre fue receptiva, profesional y una firme defensora de nuestros intereses en cada paso del camino. Definitivamente volveríamos a trabajar con ella."'
      ],
      rgTestimonialQuotes: [
        '"Mi pareja y yo hemos trabajado con Anh durante años — primero comprando nuestra casa y luego vendiéndola. Trabajar con Anh fue, sin duda, una de las mejores decisiones que tomamos. Desde guiarnos en la compra de nuestra nueva casa hasta ayudarnos a venderla, hizo que todo el proceso fuera lo más libre de estrés posible. Nos ayudó a buscar casa durante casi un año entero y siempre fue más allá para asegurarse de que tuviéramos todo en nuestra lista. Su conocimiento del mercado y su excelente comunicación nos dieron confianza en cada paso del camino. Siempre estuvo disponible para responder nuestras preguntas, nos dio consejos honestos y se esforzó para que todo siguiera en orden. Gracias a su experiencia, nuestra casa se vendió lo más rápido posible en este incierto mercado. Verdaderamente sentimos que tenía nuestros mejores intereses en mente en todo momento. Si está buscando una agente dedicada, profesional y genuinamente comprometida, no podemos recomendar a Anh Lam lo suficiente."',
        '"Trabajamos con Wally tanto en la venta de nuestro condominio como en la compra de nuestra casa, y tuvimos una experiencia fantástica de principio a fin. Su atención al detalle destacó durante todo el proceso — nos ayudó con la presentación de la casa, creó un video profesional para aumentar la exposición y se aseguró de que nuestra propiedad estuviera en Zillow Showcase. Lo que más apreciamos fue su comunicación. Nos proporcionó actualizaciones en tiempo real de manera constante para que siempre estuviéramos al tanto. Wally también fue honesto y transparente en cada etapa, lo que nos ayudó a sentirnos seguros en nuestras decisiones. No fue insistente — presentaba los hechos y respetaba nuestras decisiones. Además, su red de profesionales de confianza hizo que todo el proceso fuera mucho más fluido. Lo recomendaríamos ampliamente a cualquiera que compre o venda una casa."',
        '"Cinco estrellas verdaderamente no son suficientes para describir la experiencia de trabajar con ella. Aporta una combinación única de profundo conocimiento del mercado, profesionalismo impecable y una brillante actitud de hacer las cosas. Las transacciones inmobiliarias pueden ser un campo minado de estrés, pero ella me protegió completamente de todo eso. El proceso fue totalmente fluido. Fue comunicativa de manera proactiva, manteniéndome informado en cada paso del camino y explicando todo claramente para que siempre me sintiera seguro en nuestras decisiones. Su experiencia es innegable, pero es su determinación y dedicación a sus clientes lo que la convierte en una verdadera estrella en su campo. Ella se encarga de cada detalle para que usted pueda concentrarse en la emoción de su próximo capítulo."',
        '"Tuvimos una excelente experiencia trabajando con nuestra agente, Taylor. Siempre fue muy atenta, amable y se tomó el tiempo de explicar claramente cada paso del proceso, lo que hizo que todo se sintiera mucho menos abrumador. También fue una negociadora muy capaz y nos ayudó a sentirnos seguros de que estábamos obteniendo el mejor resultado posible. Realmente apreciamos la rapidez con la que respondía las preguntas y mantenía todo avanzando de manera fluida de principio a fin."',
        '"Recientemente trabajamos con Jeremy McHone para vender nuestra casa en Ramona, y la experiencia fue absolutamente excepcional de principio a fin. Jeremy logró ayudarnos a vender nuestra casa completamente fuera del mercado, lo que nos ahorró una cantidad increíble de tiempo y estrés. Lo que verdaderamente lo distinguió fue su gestión integral de toda la transacción. Manejó sin contratiempos todos los trámites tanto de los vendedores como de los compradores, navegando por las complejidades del proceso con total profesionalismo y transparencia. Más allá de los contratos y el depósito en garantía, Jeremy fue más allá al encargarse de todas las interacciones con los distintos contratistas y proveedores. Nunca tuvimos que preocuparnos por coordinar horarios ni hacer seguimiento del progreso — él lo manejó todo. ¡Si desea un agente que sea proactivo, organizado y que verdaderamente le quite la carga de encima, no podemos recomendar a Jeremy lo suficiente!"',
        '"Corinne hizo más de lo esperado. Llevábamos meses buscando casa y siempre estuvo disponible cada fin de semana para visitar cualquier propiedad que le enviáramos. Se preparó antes de cada visita para darnos la información que necesitábamos. Escuchó nuestras necesidades y nos enviaba las propiedades que encontraba. Siempre respondió rápidamente y fue un placer trabajar con ella. ¡Recomendaré su nombre a todos los que conozcamos que estén buscando casa!"',
        '"¡No podemos recomendar a Jodi Kirkwood lo suficiente! Nos ayudó tanto a comprar nuestro condominio del piso de arriba como a vender nuestro condominio existente, y toda la experiencia fue excepcional de principio a fin. Su conocimiento del mercado local es sobresaliente, y sus consejos durante todo el proceso fueron invaluables. Supo exactamente cómo posicionar nuestro condominio, y gracias a su experiencia, recibimos el mejor precio por nuestra venta. Lo que más nos impresionó fue su atención al detalle, su conocimiento del mercado y su capacidad para superar cada obstáculo con confianza y facilidad. Comprar y vender al mismo tiempo puede ser estresante, pero ella hizo que el proceso fuera fluido y manejable. Estamos increíblemente agradecidos por toda su ayuda y definitivamente volveríamos a trabajar con ella."',
        '"Trabajar con Katie fue una experiencia increíble de principio a fin. Es amable, paciente, comprensiva y realmente escucha a sus clientes. Durante toda nuestra búsqueda de casa, se tomó el tiempo de entender exactamente lo que buscábamos y nunca nos hizo sentir apurados ni presionados. Katie siempre fue profesional, atenta y disponible cuando tuvimos preguntas o inquietudes. Su conocimiento del proceso de compra de vivienda nos dio confianza en cada paso del camino. Lo que realmente destacó fue lo diferente que era de otros agentes que habíamos conocido — genuinamente se preocupó por ayudarnos a encontrar la casa adecuada y por asegurarse de que nos sintiéramos informados y respaldados. La recomendaríamos ampliamente a cualquiera que quiera comprar o vender una casa."',
        '"Chip fue increíble de principio a fin. Se reunió con nosotros antes de listar la propiedad y realizó una entrevista muy completa sobre nosotros y la propiedad. Nos ayudó a establecer lo que resultó ser el precio perfecto. Nos conectó con dos recursos de presentación que nos dieron una gran capacidad para presentar la propiedad de una manera que reflejara cuánto la amábamos. Realizó una serie de jornadas de puertas abiertas que aprovecharon una excelente estrategia de venta, la cual fue muy exitosa y resultó en una venta en menos de 3 semanas. Fue un hábil negociador con el comprador. ¡Recomendamos ampliamente a Chip si está buscando un agente inmobiliario de primer nivel!"'
      ],
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

      /* COMMUNITY DETAIL PAGES */
      cdStatActiveListings: 'Propiedades Activas',
      cdStatMedianPrice: 'Precio Medio',
      cdStatPropertyTypes: 'Tipos de Propiedad',
      cdStatUpdated: 'Actualizado',
      cdEyebrowLocation: 'Ubicación',
      cdEyebrowDemographics: 'Demografía de la Comunidad',
      cdEyebrowHighlights: 'Lo Que La Hace Especial',
      cdEyebrowListings: 'Datos MLS en Tiempo Real',
      cdEyebrowHOA: 'Qué Esperar',
      cdEyebrowParks: 'Vida al Aire Libre',
      cdEyebrowSchools: 'Educación',
      cdEyebrowComparisons: 'Comparaciones',
      cdEyebrowFAQ: 'Preguntas Frecuentes',
      cdBtnConnect: 'Conectar con Hedda',
      cdBtnViewListings: 'Ver Propiedades ↓',
      cdViewAllListings: 'Ver Todas las Propiedades →',
      cdSendMessage: 'Enviar un Mensaje',
      cdQuickFactsHeading: 'En Resumen',
      cdFactCityType: 'Tipo de Ciudad',
      cdFactCounty: 'Condado',
      cdFactPopulation: 'Población',
      cdFactMedianPrice: 'Precio Medio de Viviendas',
      cdFactArchitecture: 'Arquitectura',
      cdFactWalkScore: 'Puntuación de Caminata',
      cdFactAirport: 'Aeropuerto',
      cdDemoPopulation: 'Población',
      cdDemoMedianAge: 'Edad Media',
      cdDemoAvgIncome: 'Ingreso Familiar Promedio',
      cdDemoTotalHouseholds: 'Total de Hogares',
      cdDemoOwnershipRate: 'Tasa de Propiedad',
      cdDemoSource: 'Fuente: Oficina del Censo de EE.UU., Estimaciones ACS de 5 Años',
      cdHOAHaveQuestions: '¿Tiene Preguntas?',
      cdHOACoversTitle: 'Qué Cubren los HOA Generalmente',
      cdHOATableType: 'Tipo de Comunidad',
      cdHOATableMonthly: 'HOA Mensual',
      cdStatWalkScore: 'Puntuación de Caminata',
      cdStatSunnyDays: 'Días Soleados / Año',
      cdNavFinancing: 'Financiamiento',
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

    if (d.testimonialQuotes) {
      document.querySelectorAll('.testimonial-quote[data-quote-index]').forEach(function (el) {
        var idx = parseInt(el.getAttribute('data-quote-index'), 10);
        if (d.testimonialQuotes[idx] !== undefined) {
          el.textContent = d.testimonialQuotes[idx];
        }
      });
    }

    if (d.rgTestimonialQuotes) {
      document.querySelectorAll('.rg-quote[data-quote-index]').forEach(function (el) {
        var idx = parseInt(el.getAttribute('data-quote-index'), 10);
        if (d.rgTestimonialQuotes[idx] !== undefined) {
          el.textContent = d.rgTestimonialQuotes[idx];
        }
      });
    }

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

    /* ── COMMUNITY DETAIL PAGES ─────────────────────────────── */
    if (document.body && document.body.classList.contains('comm-detail')) {

      /* Community pages use relative hrefs — translate Buy/Sell/Testimonials/Financing by text */
      document.querySelectorAll('a[href="/"]').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'Buy' || t === 'Comprar') el.textContent = d.buy;
      });
      document.querySelectorAll('a[href="/#about"]').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'Sell' || t === 'Vender') el.textContent = d.sell;
        else if (t === 'Financing' || t === 'Financiamiento') el.textContent = d.cdNavFinancing;
      });
      document.querySelectorAll('a[href="/#testimonials"]').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'Testimonials' || t === 'Testimonios') el.textContent = d.testimonials;
      });

      /* Hero stat labels */
      var heroStatMap = {
        'Active Listings': d.cdStatActiveListings, 'Propiedades Activas': d.cdStatActiveListings,
        'Median Price': d.cdStatMedianPrice, 'Precio Medio': d.cdStatMedianPrice,
        'Property Types': d.cdStatPropertyTypes, 'Tipos de Propiedad': d.cdStatPropertyTypes,
        'Updated': d.cdStatUpdated, 'Actualizado': d.cdStatUpdated
      };
      document.querySelectorAll('.hero-stat-label').forEach(function (el) {
        var t = el.textContent.trim(); if (heroStatMap[t]) el.textContent = heroStatMap[t];
      });

      /* Section eyebrows — generic ones only, community-specific text is left untouched */
      var eyebrowMap = {
        'Location': d.cdEyebrowLocation, 'Ubicación': d.cdEyebrowLocation,
        'Community Demographics': d.cdEyebrowDemographics, 'Demografía de la Comunidad': d.cdEyebrowDemographics,
        'What Makes It Special': d.cdEyebrowHighlights, 'Lo Que La Hace Especial': d.cdEyebrowHighlights,
        'Live MLS Data': d.cdEyebrowListings, 'Datos MLS en Tiempo Real': d.cdEyebrowListings,
        'What to Expect': d.cdEyebrowHOA, 'Qué Esperar': d.cdEyebrowHOA,
        'Outdoor Living': d.cdEyebrowParks, 'Vida al Aire Libre': d.cdEyebrowParks,
        'Education': d.cdEyebrowSchools, 'Educación': d.cdEyebrowSchools,
        'Comparisons': d.cdEyebrowComparisons, 'Comparaciones': d.cdEyebrowComparisons,
        'Common Questions': d.cdEyebrowFAQ, 'Preguntas Frecuentes': d.cdEyebrowFAQ
      };
      document.querySelectorAll('.section-eyebrow').forEach(function (el) {
        var t = el.textContent.trim(); if (eyebrowMap[t]) el.textContent = eyebrowMap[t];
      });

      /* Overview CTA buttons */
      document.querySelectorAll('.overview-cta .btn-primary').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'Connect With Hedda' || t === 'Conectar con Hedda') el.textContent = d.cdBtnConnect;
      });
      document.querySelectorAll('.btn-text').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'View Listings ↓' || t === 'Ver Propiedades ↓') el.textContent = d.cdBtnViewListings;
      });
      document.querySelectorAll('.view-all-link').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'View All Listings →' || t === 'Ver Todas las Propiedades →') el.textContent = d.cdViewAllListings;
      });
      document.querySelectorAll('.cta-btns .btn-outline').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'Send a Message' || t === 'Enviar un Mensaje') el.textContent = d.cdSendMessage;
      });

      /* Quick facts heading */
      document.querySelectorAll('.quick-facts-heading').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'At a Glance' || t === 'En Resumen') el.textContent = d.cdQuickFactsHeading;
      });

      /* Fact labels */
      var factMap = {
        'City Type': d.cdFactCityType, 'Tipo de Ciudad': d.cdFactCityType,
        'County': d.cdFactCounty, 'Condado': d.cdFactCounty,
        'Population': d.cdFactPopulation, 'Población': d.cdFactPopulation,
        'Median Home Price': d.cdFactMedianPrice, 'Precio Medio de Viviendas': d.cdFactMedianPrice,
        'Architecture': d.cdFactArchitecture, 'Arquitectura': d.cdFactArchitecture,
        'Walk Score': d.cdFactWalkScore, 'Puntuación de Caminata': d.cdFactWalkScore,
        'Airport': d.cdFactAirport, 'Aeropuerto': d.cdFactAirport
      };
      document.querySelectorAll('.fact-label').forEach(function (el) {
        var t = el.textContent.trim(); if (factMap[t]) el.textContent = factMap[t];
      });

      /* Demographics labels */
      var demoMap = {
        'Population': d.cdDemoPopulation, 'Población': d.cdDemoPopulation,
        'Median Age': d.cdDemoMedianAge, 'Edad Media': d.cdDemoMedianAge,
        'Avg Household Income': d.cdDemoAvgIncome, 'Ingreso Familiar Promedio': d.cdDemoAvgIncome,
        'Total Households': d.cdDemoTotalHouseholds, 'Total de Hogares': d.cdDemoTotalHouseholds,
        'Ownership Rate': d.cdDemoOwnershipRate, 'Tasa de Propiedad': d.cdDemoOwnershipRate
      };
      document.querySelectorAll('.demo-label').forEach(function (el) {
        var t = el.textContent.trim(); if (demoMap[t]) el.textContent = demoMap[t];
      });
      document.querySelectorAll('.demo-source').forEach(function (el) {
        var t = el.textContent.trim();
        if (t.indexOf('Source:') === 0 || t.indexOf('Fuente:') === 0) el.textContent = d.cdDemoSource;
      });

      /* City stat labels — only translate generic ones, leave community-specific ones */
      var cityStatMap = {
        'Walk Score': d.cdStatWalkScore, 'Puntuación de Caminata': d.cdStatWalkScore,
        'Sunny Days / Year': d.cdStatSunnyDays, 'Días Soleados / Año': d.cdStatSunnyDays
      };
      document.querySelectorAll('.city-stat-label').forEach(function (el) {
        var t = el.textContent.trim(); if (cityStatMap[t]) el.textContent = cityStatMap[t];
      });

      /* HOA section */
      document.querySelectorAll('.hoa-aside-heading').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'Have Questions?' || t === '¿Tiene Preguntas?') el.textContent = d.cdHOAHaveQuestions;
        else if (t === 'What HOAs Typically Cover' || t === 'Qué Cubren los HOA Generalmente') el.textContent = d.cdHOACoversTitle;
      });
      document.querySelectorAll('.hoa-table th').forEach(function (el) {
        var t = el.textContent.trim();
        if (t === 'Community Type' || t === 'Tipo de Comunidad') el.textContent = d.cdHOATableType;
        else if (t === 'Monthly HOA' || t === 'HOA Mensual') el.textContent = d.cdHOATableMonthly;
      });
    }

    /* ── FEATURED LISTINGS CAROUSEL ────────────────────────── */
    var flTitle = document.querySelector('.fl-header-title');
    if (flTitle) flTitle.textContent = d.flHeading;

    document.querySelectorAll('.fl-status').forEach(function (el) {
      var st = el.getAttribute('data-fl-status');
      if (st === 'active')  el.textContent = d.flStatusActive;
      else if (st === 'pending') el.textContent = d.flStatusPending;
      else if (st === 'sold')    el.textContent = d.flStatusSold;
    });

    document.querySelectorAll('.fl-stat-label').forEach(function (el) {
      var key = el.getAttribute('data-fl-key');
      if (key === 'beds')  el.textContent = d.flBeds;
      else if (key === 'baths') el.textContent = d.flBaths;
      else if (key === 'sqft')  el.textContent = d.flSqft;
    });

    document.querySelectorAll('.fl-btn-label').forEach(function (el) {
      el.textContent = d.flViewProp;
    });

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

  // Re-apply language once the featured listings carousel finishes rendering
  window.addEventListener('fl-loaded', function () {
    applyLang(getLang());
  });

})();

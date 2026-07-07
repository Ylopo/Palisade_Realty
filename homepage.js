/* ============================================================
   PALISADE REALTY — HOMEPAGE INTERACTIONS
   homepage.js
   ============================================================ */

'use strict';

/* ── TEAM DATA ─────────────────────────────────────────────── */
const TEAM = [
  {
    name:    'Hedda Parashos',
    role:    'Principal Broker / CEO',
    bio:     'Founder and CEO of Palisade Realty since 2010. San Diego luxury specialist with 15+ years experience and a team of 60+ agents delivering exceptional results.',
    profile: 'https://palisaderealty.com/team-page/hedda-parashos',
    photo:   'assets/images/agents/Hedda_Parashos.jpg',
  },
  {
    name:    'Tom Parashos',
    role:    'Broker',
    bio:     'Expert negotiator with deep San Diego North County market knowledge. Known for finding off-market opportunities and closing complex transactions.',
    profile: 'https://palisaderealty.com/team-page/tom-parashos',
    photo:   'assets/images/agent-tom-parashos.jpg',
  },
  {
    name:    'Erick Salgado',
    role:    'REALTOR® DRE# 01999413',
    bio:     'Dedicated buyer\'s agent with expertise in first-time and move-up purchases across San Diego communities. Clear communicator from offer to close.',
    profile: '/team-page/erick-salgado.html',
    photo:   'assets/images/agent-erick-salgado.jpg',
  },
  {
    name:    'Melissa Maxwell',
    role:    'REALTOR® DRE# 01952672',
    bio:     'Strategic listing specialist known for precision pricing, professional staging coordination, and record-setting results in La Jolla and Coronado.',
    profile: 'https://palisaderealty.com/team-page/melissa-maxwell',
    photo:   'assets/images/agent-melissa-maxwell.jpg',
  },
  {
    name:    'Britney Bartlett',
    role:    'Office Manager DRE# 02025963',
    bio:     'Streamlines out-of-state and corporate relocations to San Diego. Expert in short timelines, virtual tours, and seamless transition planning.',
    profile: 'https://palisaderealty.com/team-page/britney-bartlett',
    photo:   'assets/images/agent-britney-bartlett.jpg',
  },
  {
    name:    'Michael DiVita',
    role:    'Sales & Database Manager DRE# 02192354',
    bio:     'Data-driven investment advisor specializing in San Diego rental properties and 1031 exchanges. Analytical approach to maximizing long-term portfolio returns.',
    profile: 'https://palisaderealty.com/team-page/michael-divita',
    photo:   'assets/images/agent-michael-divita.jpg',
  },
  {
    name:    'Patty Aguilar',
    role:    'REALTOR®',
    bio:     'Client-first agent with deep roots in San Diego\'s diverse communities. Known for her warm communication style and dedication to achieving outstanding results.',
    profile: 'https://palisaderealty.com/team-page/patty-aguilar',
    photo:   'assets/images/agent-patty-aguilar.jpg',
  },
  {
    name:    'Deborah Trevino',
    role:    'REALTOR®',
    bio:     'Seasoned San Diego real estate professional with a talent for guiding buyers and sellers through every step of the transaction with confidence and clarity.',
    profile: 'https://palisaderealty.com/team-page/deborah-trevino',
    photo:   'assets/images/agent-deborah-trevino.jpg',
  },
  {
    name:    'Sarah Bautista',
    role:    'REALTOR®',
    bio:     'Results-driven agent committed to making every real estate transaction seamless. Specializes in first-time buyers and residential sales across San Diego County.',
    profile: 'https://palisaderealty.com/team-page/sarah-bautista',
    photo:   'assets/images/agent-sarah-bautista.jpg',
  },
  {
    name:    'Piper Stein',
    role:    'REALTOR®',
    bio:     'Passionate real estate professional with a personalized approach to every client relationship. Expert in San Diego\'s coastal communities and luxury residential markets.',
    profile: 'https://palisaderealty.com/team-page/piper-stein',
    photo:   'assets/images/agent-piper-stein.jpg',
  },
  {
    name:    'Jason Wallace',
    role:    'REALTOR®',
    bio:     'Dynamic agent with sharp negotiation skills and comprehensive knowledge of San Diego neighborhoods. Dedicated to helping clients find their perfect home at the right price.',
    profile: 'https://palisaderealty.com/team-page/jason-wallace',
    photo:   'assets/images/agent-jason-wallace.jpg',
  },
  {
    name:    'Mariko Tortolero',
    role:    'REALTOR®',
    bio:     'Bilingual real estate expert serving San Diego\'s diverse communities. Committed to bridging cultural and language barriers to deliver exceptional client outcomes.',
    profile: 'https://palisaderealty.com/team-page/mariko-tortolero',
    photo:   'assets/images/agent-mariko-tortolero.jpg',
  },
  {
    name:    'Eric Hayman',
    role:    'REALTOR®',
    bio:     'Experienced real estate professional with a track record of successful transactions across San Diego\'s most sought-after communities. Trusted for his market expertise.',
    profile: 'https://palisaderealty.com/team-page/eric-hayman',
    photo:   'assets/images/agent-eric-hayman.jpg',
  },
  {
    name:    'Keith Agnello',
    role:    'REALTOR®',
    bio:     'Strategic agent specializing in residential and investment properties throughout San Diego County. Recognized for his analytical approach and consistent client satisfaction.',
    profile: 'https://palisaderealty.com/team-page/keith-agnello',
    photo:   'assets/images/agent-keith-agnello.jpg',
  },
  {
    name:    'Vanda Fernandes',
    role:    'REALTOR®',
    bio:     'Multilingual real estate agent bringing an international perspective to San Diego\'s luxury market. Expert in global buyer representation and coastal property sales.',
    profile: 'https://palisaderealty.com/team-page/vanda-fernandes',
    photo:   'assets/images/agent-vanda-fernandes.jpg',
  },
  {
    name:    'Patty Samii',
    role:    'REALTOR®',
    bio:     'Highly personalized real estate advisor with a deep commitment to client success. Specializes in San Diego\'s premier neighborhoods including La Jolla and Del Mar.',
    profile: 'https://palisaderealty.com/team-page/patty-samii',
    photo:   'assets/images/agent-patty-samii.jpg',
  },
];

/* ── TESTIMONIAL DATA ──────────────────────────────────────── */
const TESTIMONIALS = [
  {
    initials: 'C',
    name:     'ckvonk',
    detail:   'Bought a home in San Diego, CA',
    quote:    'Hedda and her team were incredible from start to finish. They guided us through every step of the process with professionalism and genuine care. We couldn\'t have asked for a better experience buying our first San Diego home.',
  },
  {
    initials: 'S',
    name:     'sdtinystar',
    detail:   'Sold a home in La Jolla, CA',
    quote:    'Hedda is the best realtor I have ever had! She sold our La Jolla property above asking price in just 6 days. Her market knowledge, communication, and negotiating skills are unmatched.',
  },
  {
    initials: 'A',
    name:     'amyjcrees',
    detail:   'Purchased a home in Coronado, CA',
    quote:    'Her negotiating skills were TOP NOTCH. We were competing against multiple offers and Hedda\'s strategy won the day — below asking price in a hot market. Absolutely phenomenal agent.',
  },
  {
    initials: 'M',
    name:     'Michelle R',
    detail:   'Purchased a home in 2025 in La Jolla, CA',
    quote:    'Our agent was truly exceptional — knowledgeable, patient, and always available to answer our questions. We couldn\'t be happier with our new home in La Jolla. The whole process was smooth and the team was incredibly professional.',
  },
  {
    initials: 'J',
    name:     'Jen C',
    detail:   'Sold a home in 2025 in Coronado, CA',
    quote:    'Palisade Realty made selling our home an absolute breeze. The marketing was top-notch and we received multiple offers above asking price within the first week. Couldn\'t have asked for a better experience!',
  },
];

/* ── MAPBOX DATA (from mapsample.html) ─────────────────────── */
var MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9tLW1hcGJveCIsImEiOiJjbXFxaGJva3AwNDVqMnBxcnlvaW54aWRoIn0.f4TeZyya7vaALl39DaWK5Q';

var SD_COUNTY = {"type":"Polygon","coordinates":[[[-117.61054,33.33367],[-117.57153,33.3123],[-117.5496,33.29442],[-117.521,33.26887],[-117.50087,33.24215],[-117.46787,33.21249],[-117.43556,33.17751],[-117.37587,33.07522],[-117.33997,33],[-117.32328,32.90306],[-117.33966,32.85917],[-117.34213,32.82622],[-117.33447,32.79908],[-117.32094,32.68985],[-117.30924,32.6564],[-117.27694,32.62348],[-117.25201,32.61487],[-117.23353,32.61669],[-117.22332,32.62125],[-117.21411,32.59478],[-117.20505,32.52952],[-116.10619,32.61848],[-116.10567,32.7265],[-116.10316,32.72651],[-116.10325,33.07467],[-116.08115,33.07486],[-116.08509,33.42607],[-116.19774,33.42893],[-117.03089,33.42689],[-117.03085,33.42996],[-117.24136,33.43189],[-117.24151,33.44874],[-117.37081,33.49056],[-117.36418,33.50482],[-117.50975,33.50515],[-117.50909,33.47031],[-117.53879,33.45518],[-117.55961,33.45102],[-117.5785,33.4537],[-117.61054,33.33367]]]};

var CITIES = {"type":"FeatureCollection","features":[{"type":"Feature","id":"downtown-san-diego","properties":{"name":"Downtown San Diego","slug":"downtown-san-diego","center":[-117.0823738,33.1220344]},"geometry":{"type":"Polygon","coordinates":[[[-117.09966,33.11772],[-117.09829,33.1161],[-117.0951,33.11763],[-117.08759,33.1173],[-117.08407,33.11495],[-117.0755,33.11958],[-117.07654,33.12325],[-117.07276,33.12485],[-117.07371,33.12697],[-117.07666,33.12611],[-117.07832,33.12878],[-117.08194,33.12766],[-117.08262,33.12928],[-117.09051,33.12683],[-117.08786,33.12154],[-117.08933,33.12054],[-117.09966,33.11772]]]}},{"type":"Feature","id":"mission-hills","properties":{"name":"Mission Hills","slug":"mission-hills","center":[-117.184,32.754]},"geometry":{"type":"Polygon","coordinates":[[[-117.2015,32.7445],[-117.163,32.7445],[-117.163,32.7635],[-117.2015,32.7635],[-117.2015,32.7445]]]}},{"type":"Feature","id":"point-loma","properties":{"name":"Point Loma","slug":"point-loma","center":[-117.242,32.705]},"geometry":{"type":"Polygon","coordinates":[[[-117.266,32.6628],[-117.218,32.6628],[-117.218,32.7445],[-117.266,32.7445],[-117.266,32.6628]]]}},{"type":"Feature","id":"coronado","properties":{"name":"Coronado","slug":"coronado","center":[-117.1766947,32.6915199]},"geometry":{"type":"Polygon","coordinates":[[[-117.22655,32.69039],[-117.22261,32.6867],[-117.20724,32.69031],[-117.19293,32.68791],[-117.19985,32.67543],[-117.17425,32.67554],[-117.21035,32.63871],[-117.20014,32.61879],[-117.19293,32.61856],[-117.19309,32.58597],[-117.13184,32.58562],[-117.11448,32.59326],[-117.11684,32.60529],[-117.11978,32.60526],[-117.13328,32.67596],[-117.16395,32.69327],[-117.16667,32.69835],[-117.18854,32.70591],[-117.19095,32.70539],[-117.1893,32.71302],[-117.19308,32.71608],[-117.21391,32.70913],[-117.22605,32.69591],[-117.22655,32.69039]],[[-117.14469,32.63711],[-117.14271,32.63719],[-117.13975,32.63077],[-117.13248,32.60927],[-117.13505,32.6091],[-117.14,32.62712],[-117.14469,32.63711]]]}},{"type":"Feature","id":"pacific-mission-beach","properties":{"name":"Pacific & Mission Beach","slug":"pacific-mission-beach","center":[-117.244,32.796]},"geometry":{"type":"Polygon","coordinates":[[[-117.258,32.7645],[-117.228,32.7645],[-117.228,32.8288],[-117.258,32.8288],[-117.258,32.7645]]]}},{"type":"Feature","id":"mission-valley","properties":{"name":"Mission Valley","slug":"mission-valley","center":[-117.12,32.763]},"geometry":{"type":"Polygon","coordinates":[[[-117.195,32.7478],[-117.052,32.7478],[-117.052,32.7785],[-117.195,32.7785],[-117.195,32.7478]]]}},{"type":"Feature","id":"la-jolla","properties":{"name":"La Jolla","slug":"la-jolla","center":[-117.2575702,32.8458529]},"geometry":{"type":"Polygon","coordinates":[[[-117.28226,32.83262],[-117.27989,32.82621],[-117.28103,32.82194],[-117.27387,32.81798],[-117.27346,32.8141],[-117.26834,32.80831],[-117.263,32.80574],[-117.26002,32.80664],[-117.26551,32.81012],[-117.22648,32.81946],[-117.23268,32.8272],[-117.23307,32.83391],[-117.23644,32.84242],[-117.23515,32.84955],[-117.23718,32.85465],[-117.23624,32.86419],[-117.23787,32.87175],[-117.24165,32.87009],[-117.24354,32.87146],[-117.24386,32.88611],[-117.25309,32.88612],[-117.25165,32.87597],[-117.25641,32.86003],[-117.26474,32.84888],[-117.26755,32.84859],[-117.2737,32.85137],[-117.27879,32.84776],[-117.28223,32.83999],[-117.28226,32.83262]]]}},{"type":"Feature","id":"del-mar","properties":{"name":"Del Mar","slug":"del-mar","center":[-117.2653146,32.9594891]},"geometry":{"type":"Polygon","coordinates":[[[-117.27251,32.98014],[-117.26761,32.95335],[-117.26247,32.93989],[-117.25947,32.93742],[-117.25817,32.94202],[-117.256,32.94203],[-117.25594,32.94565],[-117.26015,32.94562],[-117.26097,32.94811],[-117.25974,32.94847],[-117.2602,32.95286],[-117.25592,32.95299],[-117.25617,32.97943],[-117.27251,32.98014]]]}},{"type":"Feature","id":"carmel-valley","properties":{"name":"Carmel Valley","slug":"carmel-valley","center":[-117.2234007,32.9434117]},"geometry":{"type":"Polygon","coordinates":[[[-117.24567,32.95995],[-117.24104,32.93105],[-117.2344,32.93098],[-117.2346,32.9245],[-117.21279,32.92374],[-117.21285,32.92006],[-117.20422,32.91998],[-117.18912,32.92831],[-117.1954,32.93441],[-117.20075,32.93481],[-117.2043,32.9368],[-117.20958,32.93643],[-117.21135,32.93825],[-117.21193,32.94066],[-117.20942,32.94267],[-117.20494,32.94278],[-117.20236,32.94503],[-117.19776,32.94598],[-117.19781,32.9486],[-117.20318,32.94874],[-117.19945,32.95787],[-117.20429,32.95782],[-117.20431,32.96438],[-117.20621,32.96643],[-117.22104,32.96801],[-117.22119,32.96421],[-117.22286,32.96712],[-117.22477,32.9646],[-117.22486,32.96753],[-117.22886,32.96545],[-117.2305,32.96544],[-117.23071,32.96743],[-117.23658,32.96734],[-117.2347,32.96514],[-117.23745,32.96517],[-117.24307,32.96173],[-117.24303,32.96017],[-117.24567,32.95995]]]}},{"type":"Feature","id":"rancho-santa-fe","properties":{"name":"Rancho Santa Fe","slug":"rancho-santa-fe","center":[-117.1979781,33.0242314]},"geometry":{"type":"Polygon","coordinates":[[[-117.23012,33.01409],[-117.22562,33.00813],[-117.22177,33.00853],[-117.21922,33.00666],[-117.21069,33.005],[-117.19902,33.00511],[-117.1992,33.00387],[-117.19282,33.00768],[-117.18973,33.01267],[-117.18492,33.0132],[-117.17427,33.01046],[-117.17304,33.01237],[-117.17719,33.01535],[-117.17815,33.01918],[-117.17529,33.02325],[-117.16963,33.02436],[-117.16382,33.02842],[-117.16193,33.03412],[-117.16568,33.03663],[-117.17377,33.03452],[-117.18389,33.03561],[-117.18664,33.04356],[-117.1967,33.04164],[-117.20881,33.04457],[-117.20908,33.04122],[-117.21201,33.03777],[-117.21882,33.03384],[-117.22476,33.02463],[-117.22763,33.02297],[-117.23012,33.01409]]]}},{"type":"Feature","id":"solana-beach","properties":{"name":"Solana Beach","slug":"solana-beach","center":[-117.2678124,32.9919141]},"geometry":{"type":"Polygon","coordinates":[[[-117.27947,32.99928],[-117.27679,32.99525],[-117.27389,32.98055],[-117.25619,32.97942],[-117.25608,32.98213],[-117.24954,32.98206],[-117.2496,32.98563],[-117.23871,32.98575],[-117.2387,32.98758],[-117.24086,32.98759],[-117.24085,32.98988],[-117.23866,32.99259],[-117.23878,33.00046],[-117.23717,33.00191],[-117.2386,33.00319],[-117.23775,33.00468],[-117.2401,33.0051],[-117.241,33.00748],[-117.24443,33.00746],[-117.24552,33.00567],[-117.24552,33.00746],[-117.26148,33.00746],[-117.25928,33.00384],[-117.27364,33.0045],[-117.27494,33.00306],[-117.27538,33.00414],[-117.27626,33.00146],[-117.27947,32.99928]]]}},{"type":"Feature","id":"encinitas","properties":{"name":"Encinitas","slug":"encinitas","center":[-117.2919818,33.0369867]},"geometry":{"type":"Polygon","coordinates":[[[-117.36829,33.06011],[-117.33997,33],[-117.33928,32.99599],[-117.27947,32.99928],[-117.27626,33.00146],[-117.24552,33.00746],[-117.24447,33.00568],[-117.24282,33.00938],[-117.23931,33.00943],[-117.2428,33.01104],[-117.24284,33.01281],[-117.24691,33.01279],[-117.24694,33.0168],[-117.24433,33.01799],[-117.24431,33.02172],[-117.24699,33.02044],[-117.247,33.02182],[-117.24182,33.02178],[-117.24211,33.02683],[-117.23612,33.03227],[-117.23737,33.03374],[-117.23629,33.03697],[-117.23377,33.03632],[-117.23203,33.03819],[-117.22737,33.04851],[-117.22011,33.04648],[-117.21518,33.05092],[-117.20833,33.0483],[-117.20475,33.05038],[-117.19993,33.06924],[-117.20396,33.07685],[-117.21402,33.07766],[-117.22426,33.07571],[-117.22337,33.06126],[-117.22918,33.06101],[-117.22964,33.06269],[-117.23195,33.06278],[-117.2319,33.06089],[-117.23942,33.06053],[-117.24351,33.06399],[-117.24935,33.06374],[-117.24898,33.06749],[-117.26051,33.06721],[-117.26223,33.06789],[-117.26234,33.07016],[-117.27233,33.06867],[-117.27315,33.08046],[-117.27978,33.08774],[-117.29106,33.0869],[-117.29904,33.08409],[-117.30159,33.08897],[-117.30944,33.08206],[-117.36829,33.06011]]]}},{"type":"Feature","id":"carlsbad","properties":{"name":"Carlsbad","slug":"carlsbad","center":[-117.3505966,33.1580933]},"geometry":{"type":"Polygon","coordinates":[[[-117.40957,33.13257],[-117.36829,33.06011],[-117.30944,33.08206],[-117.30159,33.08897],[-117.29904,33.08409],[-117.29106,33.0869],[-117.27978,33.08774],[-117.27005,33.08497],[-117.27004,33.08047],[-117.27315,33.08046],[-117.27233,33.06867],[-117.26234,33.07016],[-117.26223,33.06789],[-117.26051,33.06721],[-117.24898,33.06749],[-117.24935,33.06374],[-117.24351,33.06399],[-117.23942,33.06053],[-117.2319,33.06089],[-117.23195,33.06278],[-117.22964,33.06269],[-117.22918,33.06101],[-117.22337,33.06126],[-117.22426,33.07571],[-117.21671,33.09512],[-117.22103,33.09515],[-117.22458,33.10416],[-117.22795,33.11091],[-117.22979,33.11359],[-117.22992,33.13504],[-117.24601,33.13496],[-117.24674,33.14581],[-117.25323,33.15247],[-117.25688,33.15714],[-117.26187,33.1531],[-117.27066,33.1531],[-117.27098,33.17716],[-117.28304,33.17299],[-117.28393,33.17582],[-117.29889,33.17557],[-117.29943,33.18258],[-117.30971,33.17953],[-117.32319,33.18203],[-117.33136,33.17974],[-117.34412,33.17983],[-117.34431,33.17615],[-117.35284,33.1748],[-117.35973,33.16885],[-117.35803,33.16505],[-117.40957,33.13257]]]}},{"type":"Feature","id":"oceanside","properties":{"name":"Oceanside","slug":"oceanside","center":[-117.379483,33.1958696]},"geometry":{"type":"Polygon","coordinates":[[[-117.4398,33.1821],[-117.43556,33.17751],[-117.40957,33.13257],[-117.35803,33.16505],[-117.35973,33.16885],[-117.3528,33.16886],[-117.35284,33.1748],[-117.34431,33.17615],[-117.34412,33.17983],[-117.33136,33.17974],[-117.32319,33.18203],[-117.30971,33.17953],[-117.29943,33.18258],[-117.29889,33.17557],[-117.28393,33.17582],[-117.28304,33.17299],[-117.27958,33.17578],[-117.27098,33.17716],[-117.27066,33.1531],[-117.26187,33.1531],[-117.26188,33.15492],[-117.24888,33.17179],[-117.2738,33.18322],[-117.27953,33.19387],[-117.2795,33.2048],[-117.26222,33.21044],[-117.26224,33.21916],[-117.25603,33.2196],[-117.26281,33.23744],[-117.25574,33.24657],[-117.24503,33.2548],[-117.2493,33.26356],[-117.24501,33.27802],[-117.25362,33.27816],[-117.26232,33.29794],[-117.26971,33.30003],[-117.39048,33.20704],[-117.39855,33.21066],[-117.40392,33.20627],[-117.4398,33.1821]]]}},{"type":"Feature","id":"spring-valley","properties":{"name":"Spring Valley","slug":"spring-valley","center":[-116.9668895,32.7295705]},"geometry":{"type":"Polygon","coordinates":[[[-117.01861,32.74451],[-117.01442,32.74037],[-117.01451,32.73463],[-117.01436,32.72875],[-117.00702,32.73051],[-117.00016,32.73617],[-116.99936,32.7338],[-116.99571,32.73137],[-116.98933,32.73124],[-116.97959,32.72017],[-116.98187,32.71567],[-116.97658,32.71454],[-116.96135,32.70429],[-116.95878,32.70551],[-116.94794,32.72121],[-116.94478,32.72985],[-116.9427,32.73948],[-116.95179,32.74013],[-116.95814,32.74572],[-116.98464,32.74491],[-117.00576,32.75259],[-117.01019,32.75263],[-117.01522,32.75045],[-117.01453,32.74799],[-117.01861,32.74451]]]}},{"type":"Feature","id":"chula-vista","properties":{"name":"Chula Vista","slug":"chula-vista","center":[-117.084195,32.6400541]},"geometry":{"type":"Polygon","coordinates":[[[-117.12401,32.64637],[-117.1177,32.60754],[-117.09802,32.6131],[-117.09258,32.60461],[-117.09035,32.5961],[-117.08411,32.59482],[-117.0841,32.5912],[-117.05814,32.59104],[-117.05372,32.59106],[-117.04928,32.58738],[-117.04494,32.58742],[-117.04498,32.5912],[-117.03557,32.59116],[-117.03234,32.59123],[-117.0145,32.59109],[-117.01449,32.58364],[-116.99965,32.57797],[-116.92891,32.59855],[-116.93165,32.60517],[-116.93447,32.61193],[-116.93365,32.61765],[-116.9327,32.6229],[-116.93002,32.62674],[-116.93101,32.63154],[-116.93414,32.63353],[-116.93369,32.63881],[-116.93475,32.64318],[-116.93086,32.64729],[-116.93665,32.66517],[-116.92783,32.68429],[-116.95814,32.68562],[-116.96241,32.67633],[-116.9626,32.67203],[-116.97567,32.67256],[-116.9886,32.67787],[-116.99523,32.66734],[-116.98956,32.66388],[-116.98443,32.66528],[-116.98006,32.66727],[-116.99258,32.66026],[-116.99314,32.66171],[-117.00111,32.65945],[-117.00375,32.66644],[-117.01196,32.66418],[-117.02276,32.66205],[-117.02808,32.6627],[-117.02372,32.6658],[-117.04386,32.66003],[-117.04306,32.65642],[-117.03679,32.65356],[-117.03943,32.65375],[-117.03751,32.64933],[-117.05,32.64591],[-117.05202,32.64531],[-117.05673,32.64016],[-117.0587,32.6396],[-117.06137,32.64022],[-117.06511,32.63812],[-117.06523,32.64036],[-117.06406,32.64218],[-117.06286,32.64588],[-117.06129,32.64783],[-117.06512,32.6503],[-117.07093,32.65681],[-117.07873,32.6571],[-117.08322,32.65891],[-117.08884,32.6527],[-117.09279,32.65161],[-117.09849,32.65414],[-117.09621,32.64826],[-117.1028,32.64639],[-117.10506,32.65058],[-117.12401,32.64637]],[[-117.02315,32.59852],[-117.0231,32.60599],[-117.01074,32.60586],[-116.99965,32.61063],[-116.99917,32.60255],[-117.00782,32.59831],[-117.02315,32.59852]]]}},{"type":"Feature","id":"la-mesa","properties":{"name":"La Mesa","slug":"la-mesa","center":[-117.0230839,32.7678288]},"geometry":{"type":"Polygon","coordinates":[[[-117.0536,32.76067],[-117.0535,32.75578],[-117.04915,32.75567],[-117.0493,32.74316],[-117.04617,32.74489],[-117.0201,32.74721],[-117.01019,32.75263],[-117.00066,32.75591],[-117.00241,32.76073],[-116.99457,32.76241],[-116.98539,32.77103],[-116.98506,32.77389],[-116.98677,32.77264],[-116.99266,32.76982],[-116.99467,32.76767],[-117.00132,32.76824],[-116.99606,32.77036],[-116.99716,32.77442],[-116.9982,32.77482],[-116.99928,32.77222],[-117.00039,32.77816],[-116.99118,32.77709],[-116.99034,32.77864],[-116.99041,32.78088],[-116.98722,32.78301],[-116.98444,32.78523],[-116.98487,32.78844],[-116.98801,32.78931],[-116.98681,32.79417],[-116.98828,32.7957],[-116.99923,32.79498],[-117.0059,32.79474],[-117.03742,32.79149],[-117.03985,32.78212],[-117.0437,32.77723],[-117.04431,32.78007],[-117.04825,32.78044],[-117.0514,32.77795],[-117.04867,32.77734],[-117.04862,32.77427],[-117.0465,32.7735],[-117.04704,32.77085],[-117.03993,32.77139],[-117.03897,32.76886],[-117.04562,32.76766],[-117.04562,32.76601],[-117.05115,32.76602],[-117.05118,32.76326],[-117.05337,32.76328],[-117.0536,32.76067]],[[-116.99233,32.77844],[-116.99233,32.77844]]]}},{"type":"Feature","id":"el-cajon","properties":{"name":"El Cajon","slug":"el-cajon","center":[-116.962526,32.7947731]},"geometry":{"type":"Polygon","coordinates":[[[-117.01122,32.82029],[-117.00999,32.81563],[-117.00597,32.81295],[-117.00604,32.79474],[-116.98828,32.7957],[-116.98821,32.79066],[-116.98444,32.78523],[-116.98767,32.78429],[-116.98722,32.78301],[-116.99041,32.78088],[-116.98169,32.77943],[-116.97762,32.77784],[-116.97411,32.77552],[-116.96659,32.77472],[-116.964,32.77317],[-116.95905,32.77569],[-116.95585,32.77793],[-116.94659,32.77969],[-116.94631,32.77823],[-116.94265,32.78056],[-116.94721,32.78512],[-116.94059,32.78547],[-116.93785,32.78475],[-116.93457,32.78472],[-116.93217,32.78109],[-116.92806,32.77824],[-116.92739,32.77606],[-116.92062,32.77872],[-116.91668,32.78184],[-116.91879,32.78552],[-116.91636,32.78863],[-116.92152,32.79275],[-116.91799,32.7964],[-116.91668,32.79451],[-116.91583,32.79641],[-116.91171,32.79764],[-116.90919,32.79606],[-116.90546,32.79484],[-116.89593,32.80168],[-116.90035,32.80324],[-116.90133,32.80325],[-116.90308,32.80476],[-116.90974,32.80223],[-116.91037,32.80022],[-116.91953,32.80021],[-116.9183,32.80927],[-116.91289,32.80785],[-116.91281,32.81071],[-116.91309,32.81597],[-116.91821,32.82256],[-116.91985,32.81994],[-116.92236,32.81863],[-116.92814,32.81696],[-116.92978,32.81314],[-116.93351,32.81707],[-116.94003,32.81686],[-116.94058,32.81393],[-116.93651,32.80922],[-116.94408,32.80835],[-116.94928,32.80852],[-116.94927,32.81513],[-116.94752,32.81687],[-116.94613,32.82175],[-116.94924,32.82295],[-116.95602,32.81525],[-116.95271,32.81051],[-116.9591,32.81153],[-116.9594,32.81035],[-116.96157,32.81234],[-116.96601,32.81108],[-116.96373,32.81687],[-116.96509,32.82442],[-116.96235,32.8245],[-116.96405,32.82957],[-116.98716,32.83098],[-116.98827,32.8284],[-116.99008,32.82629],[-116.99353,32.8263],[-116.99415,32.82901],[-116.99932,32.82901],[-117.00072,32.82778],[-117.00021,32.82547],[-117.0021,32.81965],[-117.01122,32.82029]]]}}]};

/* ── MAIN INIT ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initNavScroll();
  initMobileMenu();
  initHeroSearch();
  initScrollAnimations();
  initMapbox();
  initTeamCarousel();
  initTestimonialsCarousel();
  initBlogCarousel();
});

/* ── NAV SCROLL ────────────────────────────────────────────── */
function initNavScroll() {
  var header = document.getElementById('site-header');
  if (!header) return;
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 50); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── MOBILE MENU ───────────────────────────────────────────── */
function initMobileMenu() {
  var btn    = document.getElementById('nav-hamburger');
  var drawer = document.getElementById('nav-mobile-drawer');
  if (!btn || !drawer) return;

  var toggle = function (open) {
    document.body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      drawer.style.display = 'flex';
      requestAnimationFrame(function () { drawer.style.opacity = '1'; });
    } else {
      drawer.style.opacity = '0';
      setTimeout(function () { drawer.style.display = 'none'; }, 300);
    }
  };

  btn.addEventListener('click', function () {
    toggle(!document.body.classList.contains('nav-open'));
  });
  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { toggle(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) toggle(false);
  });
}

/* ── HERO SEARCH (redirects to Ylopo search site) ──────────── */
function initHeroSearch() {
  var form = document.getElementById('hero-search-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    var q = form.querySelector('[name="q"]');
    if (q && q.value.trim() === '') {
      e.preventDefault();
      window.location.href = 'https://search.palisaderealty.com/';
    }
  });
}

/* ── SCROLL ANIMATIONS ─────────────────────────────────────── */
function initScrollAnimations() {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length || typeof IntersectionObserver === 'undefined') return;

  var vh = window.innerHeight;
  var belowFold = Array.from(targets).filter(function (el) {
    return el.getBoundingClientRect().top > vh * 0.85;
  });

  /* Elements start VISIBLE. will-animate is added only when the element
     enters the viewport (in the observer callback), so screenshots always
     see content. The double RAF ensures the opacity:0 state paints for
     one frame before the visible class triggers the transition. */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        observer.unobserve(el);
        el.classList.add('will-animate');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.classList.add('visible');
          });
        });
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  belowFold.forEach(function (el) { observer.observe(el); });
}

/* ── MAPBOX ────────────────────────────────────────────────── */
function initMapbox() {
  if (typeof mapboxgl === 'undefined') return;
  if (!mapboxgl.supported()) {
    var err = document.getElementById('lfyp-map-error');
    if (err) err.classList.add('visible');
    return;
  }

  mapboxgl.accessToken = MAPBOX_TOKEN;

  var map = new mapboxgl.Map({
    container: 'lfyp-map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-117.35, 33.10],
    zoom: 9.0,
    minZoom: 7,
    maxZoom: 15,
    attributionControl: false,
    logoPosition: 'bottom-right',
  });

  map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

  map.on('error', function (e) {
    if (e.error && (e.error.status === 401 || e.error.status === 403 ||
        (e.error.message && e.error.message.indexOf('token') !== -1))) {
      var err = document.getElementById('lfyp-map-error');
      if (err) err.classList.add('visible');
    }
  });

  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'lfyp-popup',
    offset: 10,
  });

  var hoveredId   = null;
  var activeId    = null;
  var strokeAnim  = null;
  var strokePhase = 0;

  function animateStroke() {
    strokePhase += 0.055;
    var w = 2.5 + Math.sin(strokePhase) * 1.8;
    var o = 0.72 + Math.sin(strokePhase + Math.PI * 0.5) * 0.28;
    if (map.getLayer('city-hover-stroke')) {
      map.setPaintProperty('city-hover-stroke', 'line-width',   w);
      map.setPaintProperty('city-hover-stroke', 'line-opacity', o);
    }
    strokeAnim = requestAnimationFrame(animateStroke);
  }

  map.on('load', function () {
    [
      ['land',         'fill-color',  '#0C0C0E'],
      ['landuse',      'fill-color',  '#101012'],
      ['water',        'fill-color',  '#0A1828'],
      ['water-shadow', 'fill-color',  '#0A1828'],
    ].forEach(function (p) {
      try { map.setPaintProperty(p[0], p[1], p[2]); } catch (e) {}
    });

    map.addSource('sd-county', {
      type: 'geojson',
      data: { type: 'Feature', geometry: SD_COUNTY },
    });
    map.addLayer({
      id: 'sd-county-fill',
      type: 'fill',
      source: 'sd-county',
      paint: { 'fill-color': '#2A0C14', 'fill-opacity': 0.45 },
    });
    map.addLayer({
      id: 'sd-county-border',
      type: 'line',
      source: 'sd-county',
      paint: { 'line-color': '#6B1E30', 'line-width': 1.5, 'line-opacity': 0.70 },
    });

    map.addSource('cities', { type: 'geojson', data: CITIES });

    map.addLayer({
      id: 'city-fill',
      type: 'fill',
      source: 'cities',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'active'], false], '#A03050',
          ['boolean', ['feature-state', 'hover'],  false], '#FF4878',
          '#581829',
        ],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'active'], false], 0.95,
          ['boolean', ['feature-state', 'hover'],  false], 0.82,
          0.72,
        ],
        'fill-color-transition':   { duration: 220, delay: 0 },
        'fill-opacity-transition': { duration: 220, delay: 0 },
      },
    });

    map.addLayer({
      id: 'city-border',
      type: 'line',
      source: 'cities',
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'active'], false], '#FFB0C8',
          ['boolean', ['feature-state', 'hover'],  false], '#B03050',
          '#D4607A',
        ],
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'active'], false], 2.8,
          ['boolean', ['feature-state', 'hover'],  false], 2.2,
          1.4,
        ],
        'line-opacity': [
          'case',
          ['boolean', ['feature-state', 'active'], false], 1.0,
          ['boolean', ['feature-state', 'hover'],  false], 0.95,
          0.80,
        ],
        'line-color-transition':   { duration: 220, delay: 0 },
        'line-width-transition':   { duration: 220, delay: 0 },
        'line-opacity-transition': { duration: 220, delay: 0 },
      },
    });

    // Isolated source for the currently-hovered feature — lets us animate its stroke independently
    map.addSource('hover-city', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
    map.addLayer({
      id: 'city-hover-stroke',
      type: 'line',
      source: 'hover-city',
      paint: {
        'line-color': '#FF6090',
        'line-width': 3,
        'line-opacity': 1,
      },
    });

    map.addLayer({
      id: 'city-label',
      type: 'symbol',
      source: 'cities',
      layout: {
        'text-field': ['upcase', ['get', 'name']],
        'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 8, 9, 10, 11, 13, 13],
        'text-anchor': 'center',
        'text-max-width': 7,
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false], '#2A0810',
          '#FFECF0',
        ],
        'text-halo-color': '#2A0810',
        'text-halo-width': 1.5,
      },
    });

    (function () {
      var minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
      function scan(c) {
        if (typeof c[0] === 'number') {
          if (c[0] < minLng) minLng = c[0];
          if (c[0] > maxLng) maxLng = c[0];
          if (c[1] < minLat) minLat = c[1];
          if (c[1] > maxLat) maxLat = c[1];
        } else { c.forEach(scan); }
      }
      CITIES.features.forEach(function (f) { scan(f.geometry.coordinates); });
      if (isFinite(minLng)) {
        map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40, duration: 0, maxZoom: 12 });
      }
    })();

    map.on('mousemove', 'city-fill', function (e) {
      if (!e.features || !e.features.length) return;
      var feat = e.features[0];
      var id   = feat.id;
      map.getCanvas().style.cursor = 'pointer';
      if (hoveredId !== id) {
        if (hoveredId !== null) {
          map.setFeatureState({ source: 'cities', id: hoveredId }, { hover: false });
          unhoverList();
        }
        hoveredId = id;
        map.setFeatureState({ source: 'cities', id: id }, { hover: true });
        hoverList(feat.properties.slug);
        map.getSource('hover-city').setData({ type: 'FeatureCollection', features: [feat] });
        strokePhase = 0;
        if (!strokeAnim) animateStroke();
      }
      popup.setLngLat(e.lngLat).setHTML('<span>' + feat.properties.name + '</span>').addTo(map);
    });

    map.on('mouseleave', 'city-fill', function () {
      if (hoveredId !== null) {
        map.setFeatureState({ source: 'cities', id: hoveredId }, { hover: false });
        unhoverList();
        hoveredId = null;
      }
      map.getCanvas().style.cursor = '';
      map.getSource('hover-city').setData({ type: 'FeatureCollection', features: [] });
      if (strokeAnim) { cancelAnimationFrame(strokeAnim); strokeAnim = null; }
      popup.remove();
    });

    map.on('click', 'city-fill', function (e) {
      if (!e.features || !e.features.length) return;
      var feat = e.features[0];
      activateCity(feat.id, feat.properties.slug, feat.properties.name, feat.properties.center);
    });
  });

  document.querySelectorAll('.lfyp-cities a').forEach(function (link) {
    var slug = link.dataset.slug;
    var name = link.dataset.city;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var feat = CITIES.features.find(function (f) { return f.id === slug; });
      activateCity(slug, slug, name, feat ? feat.properties.center : null);
    });
    link.addEventListener('mouseenter', function () {
      link.classList.add('is-hovered');
      if (!map.isStyleLoaded()) return;
      var feat = CITIES.features.find(function (f) { return f.id === slug; });
      if (hoveredId !== null && hoveredId !== slug) {
        map.setFeatureState({ source: 'cities', id: hoveredId }, { hover: false });
      }
      hoveredId = slug;
      map.setFeatureState({ source: 'cities', id: slug }, { hover: true });
      if (feat && map.getSource('hover-city')) {
        map.getSource('hover-city').setData({ type: 'FeatureCollection', features: [feat] });
        strokePhase = 0;
        if (!strokeAnim) animateStroke();
        var center = feat.properties.center;
        var c = typeof center === 'string' ? JSON.parse(center) : center;
        popup.setLngLat(c).setHTML('<span>' + feat.properties.name + '</span>').addTo(map);
      }
    });
    link.addEventListener('mouseleave', function () {
      link.classList.remove('is-hovered');
      if (!map.isStyleLoaded()) return;
      map.setFeatureState({ source: 'cities', id: slug }, { hover: false });
      if (hoveredId === slug) {
        hoveredId = null;
        if (map.getSource('hover-city')) {
          map.getSource('hover-city').setData({ type: 'FeatureCollection', features: [] });
        }
        if (strokeAnim) { cancelAnimationFrame(strokeAnim); strokeAnim = null; }
        popup.remove();
      }
    });
    link.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var feat2 = CITIES.features.find(function (f) { return f.id === slug; });
        activateCity(slug, slug, name, feat2 ? feat2.properties.center : null);
      }
    });
  });

  function activateCity(featureId, slug, name, center) {
    if (activeId !== null && activeId !== featureId && map.isStyleLoaded()) {
      map.setFeatureState({ source: 'cities', id: activeId }, { active: false });
    }
    activeId = featureId;
    if (map.isStyleLoaded()) {
      map.setFeatureState({ source: 'cities', id: featureId }, { active: true });
    }
    document.querySelectorAll('.lfyp-cities a').forEach(function (a) { a.classList.remove('is-active'); });
    var listLink = document.querySelector('.lfyp-cities a[data-slug="' + slug + '"]');
    if (listLink) listLink.classList.add('is-active');
    if (map.isStyleLoaded()) {
      var flyCenter = center;
      if (!flyCenter) {
        var feat = CITIES.features.find(function (f) { return f.id === featureId; });
        if (feat) flyCenter = feat.properties.center;
      }
      if (flyCenter) {
        var c = typeof flyCenter === 'string' ? JSON.parse(flyCenter) : flyCenter;
        map.flyTo({ center: c, zoom: 11.8, duration: 1000, essential: true });
      }
    }
    if (history.pushState) history.pushState(null, '', '#' + slug);
  }

  function hoverList(slug) {
    var el = document.querySelector('.lfyp-cities a[data-slug="' + slug + '"]');
    if (el) el.classList.add('is-hovered');
  }
  function unhoverList() {
    document.querySelectorAll('.lfyp-cities a.is-hovered').forEach(function (el) {
      el.classList.remove('is-hovered');
    });
  }
}

/* ── TEAM CAROUSEL ─────────────────────────────────────────── */
function initTeamCarousel() {
  var stage   = document.getElementById('tcStage');
  var btnPrev = document.getElementById('tcPrev');
  var btnNext = document.getElementById('tcNext');
  var elCur   = document.getElementById('tcCur');
  var elTot   = document.getElementById('tcTot');
  var elFill  = document.getElementById('tcFill');
  if (!stage || !btnPrev || !btnNext) return;

  var SLOT_STYLES = [
    [0,        1.00, 1.00, '0 24px 64px rgba(0,0,0,.10), 0 4px 16px rgba(0,0,0,.06)'],
    [1,        0.88, 1.00, '0 4px 20px rgba(0,0,0,.07)'],
    [2,        0.76, 0.55, '0 2px 8px rgba(0,0,0,.04)'],
    [Infinity, 0.65, 0.00, 'none'],
  ];

  function slotStyle(dist) {
    for (var i = 0; i < SLOT_STYLES.length; i++) {
      if (dist <= SLOT_STYLES[i][0]) {
        return { scale: SLOT_STYLES[i][1], opacity: SLOT_STYLES[i][2], shadow: SLOT_STYLES[i][3] };
      }
    }
    return { scale: 0.65, opacity: 0, shadow: 'none' };
  }

  function applyConfig() {
    var w    = window.innerWidth;
    var root = document.documentElement;
    if (w <= 480) {
      root.style.setProperty('--card-w',       '232px');
      root.style.setProperty('--card-h',       '400px');
      root.style.setProperty('--photo-h-act',  '222px');
      root.style.setProperty('--stage-h',      '454px');
      root.style.setProperty('--step-px',      '258');
    } else if (w <= 768) {
      root.style.setProperty('--card-w',       '262px');
      root.style.setProperty('--card-h',       '434px');
      root.style.setProperty('--photo-h-act',  '244px');
      root.style.setProperty('--stage-h',      '492px');
      root.style.setProperty('--step-px',      '294');
    } else {
      root.style.setProperty('--card-w',       '300px');
      root.style.setProperty('--card-h',       '460px');
      root.style.setProperty('--photo-h-act',  '262px');
      root.style.setProperty('--stage-h',      '540px');
      root.style.setProperty('--step-px',      '332');
    }
  }

  function getStep() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--step-px')) || 332;
  }

  var N   = TEAM.length;
  var cur = 0;

  function buildCard(member) {
    var el = document.createElement('div');
    el.className = 'tc-card';
    el.setAttribute('role', 'article');
    el.setAttribute('aria-label', member.name + ', ' + member.role);
    el.innerHTML =
      '<div class="card-inner">' +
        '<div class="card-photo">' +
          '<img src="' + member.photo + '" alt="Headshot of ' + member.name + '" loading="lazy" draggable="false">' +
        '</div>' +
        '<div class="card-body">' +
          '<h3 class="card-name">' + member.name + '</h3>' +
          '<p class="card-bio">' + member.bio + '</p>' +
          '<div class="card-bottom">' +
            '<span class="card-tag">' + member.role + '</span>' +
            '<a class="card-cta" href="' + member.profile + '" target="_blank" rel="noopener noreferrer" aria-label="View Profile for ' + member.name + '">' +
              'View Profile' +
              '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1 5h8M5.5 1.5 9 5l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    return el;
  }

  applyConfig();
  var cards = TEAM.map(function (m) {
    var el = buildCard(m);
    stage.appendChild(el);
    return el;
  });
  if (elTot) elTot.textContent = String(N).padStart(2, '0');

  function render() {
    var step = getStep();
    cards.forEach(function (card, i) {
      var slot = i - cur;
      if (slot >  N / 2) slot -= N;
      if (slot < -N / 2) slot += N;
      var dist = Math.abs(slot);
      var st   = slotStyle(dist);
      card.style.transform     = 'translateX(calc(-50% + ' + (slot * step) + 'px)) translateY(-50%) scale(' + st.scale + ')';
      card.style.opacity       = st.opacity;
      card.style.zIndex        = 10 - dist;
      card.style.boxShadow     = st.shadow;
      card.style.pointerEvents = dist <= 1 ? 'auto' : 'none';
      card.classList.toggle('is-active', dist === 0);
    });
    if (elCur) elCur.textContent = String(cur + 1).padStart(2, '0');
    if (elFill) elFill.style.width = ((cur + 1) / N * 100) + '%';
  }

  function go(dir) { cur = (cur + dir + N) % N; render(); }

  btnPrev.addEventListener('click', function () { go(-1); });
  btnNext.addEventListener('click', function () { go(+1); });

  cards.forEach(function (card, i) {
    card.addEventListener('click', function (e) {
      var slot = i - cur;
      if (slot >  N / 2) slot -= N;
      if (slot < -N / 2) slot += N;
      if (Math.abs(slot) !== 0) { e.preventDefault(); cur = i; render(); }
    });
  });

  document.addEventListener('keydown', function (e) {
    var r = stage.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(+1); }
  });

  var DRAG_MIN = 55, dragStartX = 0, dragLastX = 0, isDragging = false;
  function startDrag(x) { dragStartX = dragLastX = x; isDragging = true; stage.classList.add('dragging'); }
  function moveDrag(x) { if (isDragging) dragLastX = x; }
  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('dragging');
    if (Math.abs(dragLastX - dragStartX) >= DRAG_MIN) go(dragLastX < dragStartX ? 1 : -1);
  }
  stage.addEventListener('mousedown',  function (e) { startDrag(e.clientX); });
  window.addEventListener('mousemove', function (e) { moveDrag(e.clientX); });
  window.addEventListener('mouseup',   endDrag);
  stage.addEventListener('touchstart', function (e) { startDrag(e.touches[0].clientX); }, { passive: true });
  stage.addEventListener('touchmove',  function (e) { moveDrag(e.touches[0].clientX); },  { passive: true });
  stage.addEventListener('touchend',   endDrag, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { applyConfig(); render(); }, 100);
  });

  render();
}

/* ── TESTIMONIALS CAROUSEL ─────────────────────────────────── */
function initTestimonialsCarousel() {
  var avatars  = document.querySelectorAll('.testimonial-avatar');
  var slides   = document.querySelectorAll('.tp-slide');
  var caret    = document.querySelector('.tp-caret');
  var caretWrap = document.querySelector('.tp-caret-wrap');
  if (!avatars.length || !slides.length) return;

  var current = 0;

  function moveCaret(btn) {
    if (!caret || !caretWrap) return;
    var br = btn.getBoundingClientRect();
    var wr = caretWrap.getBoundingClientRect();
    var centerX = br.left + br.width / 2 - wr.left - 11;
    caret.style.left = Math.max(0, centerX) + 'px';
  }

  function goTo(idx) {
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
    avatars.forEach(function (a, i) {
      a.classList.toggle('active', i === idx);
      a.setAttribute('aria-selected', String(i === idx));
      a.setAttribute('tabindex', i === idx ? '0' : '-1');
    });
    current = idx;
    moveCaret(avatars[idx]);
  }

  avatars.forEach(function (av, i) {
    av.addEventListener('click', function () {
      clearInterval(timer);
      goTo(i);
      timer = setInterval(function () { goTo((current + 1) % TESTIMONIALS.length); }, 5500);
    });
    av.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); av.click(); }
    });
  });

  var timer = setInterval(function () { goTo((current + 1) % TESTIMONIALS.length); }, 5500);

  goTo(0);

  window.addEventListener('resize', function () {
    if (avatars[current]) moveCaret(avatars[current]);
  });
}

/* ── BLOG CAROUSEL ─────────────────────────────────────────── */
function initBlogCarousel() {
  var prevBtn = document.getElementById('blog-prev');
  var nextBtn = document.getElementById('blog-next');
  var track   = document.getElementById('blog-track');
  if (!prevBtn || !nextBtn || !track) return;

  var cards   = track.querySelectorAll('.blog-card');
  var total   = cards.length;
  var current = 0;

  function getCardWidth() {
    if (!cards[0]) return 0;
    var gap  = 20;
    var rect = cards[0].parentElement.getBoundingClientRect();
    return (rect.width - gap * (Math.min(total, 3) - 1)) / Math.min(total, 3);
  }

  function update() {
    var w      = getCardWidth();
    var gap    = 20;
    var offset = current * (w + gap);
    track.style.transform = 'translateX(-' + offset + 'px)';
    prevBtn.disabled       = current === 0;
    nextBtn.disabled       = current >= total - 3;
    prevBtn.style.opacity  = current === 0 ? '0.4' : '1';
    nextBtn.style.opacity  = current >= total - 3 ? '0.4' : '1';
  }

  prevBtn.addEventListener('click', function () { if (current > 0)         { current--; update(); } });
  nextBtn.addEventListener('click', function () { if (current < total - 3) { current++; update(); } });

  track.style.transition = 'transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1)';
  update();
  window.addEventListener('resize', update, { passive: true });
}

/* ── COMMUNITIES NAV DROPDOWN ───────────────────────────────── */
(function () {
  var dd = document.querySelector('.nav-dropdown');
  if (!dd) return;
  var trigger = dd.querySelector('.nav-dropdown-trigger');
  var closeTimer;
  function openDD()  { clearTimeout(closeTimer); dd.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); }
  function closeDD() { closeTimer = setTimeout(function () { dd.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); }, 120); }
  dd.addEventListener('mouseenter', openDD);
  dd.addEventListener('mouseleave', closeDD);
  trigger.addEventListener('focus', openDD);
  trigger.addEventListener('blur', function (e) { if (!dd.contains(e.relatedTarget)) closeDD(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { dd.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); } });

  var mToggle = document.getElementById('mobile-communities-toggle');
  var mList   = document.getElementById('mobile-communities-list');
  if (mToggle && mList) {
    mToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = mList.classList.toggle('open');
      mToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
}());

/* ============================================================
   PALISADE REALTY — Shared Agent-Page Areas Map
   team-page/areas-map.js

   Loaded by every team-page/*.html
   - Generates the 20-city chip list into #ap-areas-chips
   - Initialises the Mapbox map in #ap-areas-map
   - Wires hover & click sync between list and map
   - Map polygon clicks navigate to community pages
   - Chip clicks only highlight the map (no navigation)
   ============================================================ */

(function () {
  'use strict';

  var MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9tLW1hcGJveCIsImEiOiJjbXFxaGJva3AwNDVqMnBxcnlvaW54aWRoIn0.f4TeZyya7vaALl39DaWK5Q';

  /* ── Community order matches homepage Find Your Place ──────── */
  var CITY_ORDER = [
    'downtown-san-diego', 'mission-hills',    'mission-valley',   'north-park',
    'point-loma',         'coronado',          'pacific-beach',    'mission-beach',
    'la-jolla',           'del-mar',           'carmel-valley',    'rancho-santa-fe',
    'rancho-penasquitos', 'scripps-ranch',     'encinitas',        'carlsbad',
    'oceanside',          'chula-vista',       'la-mesa',          'el-cajon',
  ];

  /* ── Community page URLs (relative from team-page/) ─────────── */
  var COMMUNITY_URLS = {
    'downtown-san-diego':  '../communities/downtown-san-diego-real-estate.html',
    'mission-hills':       '../communities/mission-hills-real-estate.html',
    'mission-valley':      '../communities/mission-valley-real-estate.html',
    'north-park':          '../communities/north-park-real-estate.html',
    'point-loma':          '../communities/point-loma-real-estate.html',
    'coronado':            '../communities/coronado-real-estate.html',
    'pacific-beach':       '../communities/pacific-beach-real-estate.html',
    'mission-beach':       '../communities/mission-beach-real-estate.html',
    'la-jolla':            '../communities/la-jolla-real-estate.html',
    'del-mar':             '../communities/del-mar-real-estate.html',
    'carmel-valley':       '../communities/carmel-valley-real-estate.html',
    'rancho-santa-fe':     '../communities/rancho-santa-fe-real-estate.html',
    'rancho-penasquitos':  '../communities/rancho-penasquitos-real-estate.html',
    'scripps-ranch':       '../communities/scripps-ranch-real-estate.html',
    'encinitas':           '../communities/encinitas-real-estate.html',
    'carlsbad':            '../communities/carlsbad-real-estate.html',
    'oceanside':           '../communities/oceanside-real-estate.html',
    'chula-vista':         '../communities/chula-vista-real-estate.html',
    'la-mesa':             '../communities/la-mesa-real-estate.html',
    'el-cajon':            '../communities/el-cajon-real-estate.html',
  };

  /* ── San Diego County boundary ──────────────────────────────── */
  var SD_COUNTY = {"type":"Polygon","coordinates":[[[-117.61054,33.33367],[-117.57153,33.3123],[-117.5496,33.29442],[-117.521,33.26887],[-117.50087,33.24215],[-117.46787,33.21249],[-117.43556,33.17751],[-117.37587,33.07522],[-117.33997,33],[-117.32328,32.90306],[-117.33966,32.85917],[-117.34213,32.82622],[-117.33447,32.79908],[-117.32094,32.68985],[-117.30924,32.6564],[-117.27694,32.62348],[-117.25201,32.61487],[-117.23353,32.61669],[-117.22332,32.62125],[-117.21411,32.59478],[-117.20505,32.52952],[-116.10619,32.61848],[-116.10567,32.7265],[-116.10316,32.72651],[-116.10325,33.07467],[-116.08115,33.07486],[-116.08509,33.42607],[-116.19774,33.42893],[-117.03089,33.42689],[-117.03085,33.42996],[-117.24136,33.43189],[-117.24151,33.44874],[-117.37081,33.49056],[-117.36418,33.50482],[-117.50975,33.50515],[-117.50909,33.47031],[-117.53879,33.45518],[-117.55961,33.45102],[-117.5785,33.4537],[-117.61054,33.33367]]]};

  /* ── 20-city GeoJSON (matches homepage Find Your Place) ──────── */
  var CITIES = {"type":"FeatureCollection","features":[{"type":"Feature","id":"downtown-san-diego","properties":{"name":"Downtown San Diego","slug":"downtown-san-diego","center":[-117.16,32.715]},"geometry":{"type":"Polygon","coordinates":[[[-117.173,32.73],[-117.155,32.73],[-117.148,32.723],[-117.145,32.71],[-117.15,32.701],[-117.162,32.7],[-117.173,32.706],[-117.178,32.718],[-117.173,32.73]]]}},{"type":"Feature","id":"mission-hills","properties":{"name":"Mission Hills","slug":"mission-hills","center":[-117.184,32.754]},"geometry":{"type":"Polygon","coordinates":[[[-117.208,32.748],[-117.2,32.752],[-117.186,32.753],[-117.174,32.751],[-117.165,32.747],[-117.161,32.74],[-117.16,32.732],[-117.165,32.727],[-117.174,32.723],[-117.185,32.722],[-117.196,32.724],[-117.204,32.728],[-117.209,32.736],[-117.208,32.748]]]}},{"type":"Feature","id":"mission-valley","properties":{"name":"Mission Valley","slug":"mission-valley","center":[-117.12,32.763]},"geometry":{"type":"Polygon","coordinates":[[[-117.19,32.768],[-117.181,32.776],[-117.167,32.781],[-117.153,32.783],[-117.137,32.781],[-117.122,32.777],[-117.107,32.771],[-117.092,32.764],[-117.079,32.756],[-117.074,32.752],[-117.079,32.748],[-117.092,32.748],[-117.107,32.749],[-117.122,32.75],[-117.137,32.751],[-117.153,32.753],[-117.167,32.756],[-117.181,32.759],[-117.19,32.764],[-117.19,32.768]]]}},{"type":"Feature","id":"north-park","properties":{"name":"North Park","slug":"north-park","center":[-117.115,32.745]},"geometry":{"type":"Polygon","coordinates":[[[-117.132,32.756],[-117.118,32.758],[-117.102,32.756],[-117.097,32.748],[-117.098,32.737],[-117.108,32.733],[-117.12,32.732],[-117.13,32.734],[-117.136,32.741],[-117.133,32.749],[-117.132,32.756]]]}},{"type":"Feature","id":"point-loma","properties":{"name":"Point Loma","slug":"point-loma","center":[-117.242,32.705]},"geometry":{"type":"Polygon","coordinates":[[[-117.249,32.75],[-117.232,32.752],[-117.22,32.75],[-117.213,32.74],[-117.214,32.729],[-117.218,32.718],[-117.224,32.706],[-117.229,32.695],[-117.236,32.682],[-117.242,32.672],[-117.25,32.664],[-117.257,32.669],[-117.261,32.68],[-117.26,32.695],[-117.258,32.712],[-117.255,32.728],[-117.251,32.74],[-117.249,32.75]]]}},{"type":"Feature","id":"coronado","properties":{"name":"Coronado","slug":"coronado","center":[-117.1766947,32.6915199]},"geometry":{"type":"Polygon","coordinates":[[[-117.22655,32.69039],[-117.22261,32.6867],[-117.20724,32.69031],[-117.19293,32.68791],[-117.19985,32.67543],[-117.17425,32.67554],[-117.21035,32.63871],[-117.20014,32.61879],[-117.19293,32.61856],[-117.19309,32.58597],[-117.13184,32.58562],[-117.11448,32.59326],[-117.11684,32.60529],[-117.11978,32.60526],[-117.13328,32.67596],[-117.16395,32.69327],[-117.16667,32.69835],[-117.18854,32.70591],[-117.19095,32.70539],[-117.1893,32.71302],[-117.19308,32.71608],[-117.21391,32.70913],[-117.22605,32.69591],[-117.22655,32.69039]],[[-117.14469,32.63711],[-117.14271,32.63719],[-117.13975,32.63077],[-117.13248,32.60927],[-117.13505,32.6091],[-117.14,32.62712],[-117.14469,32.63711]]]}},{"type":"Feature","id":"pacific-beach","properties":{"name":"Pacific Beach","slug":"pacific-beach","center":[-117.234,32.816]},"geometry":{"type":"Polygon","coordinates":[[[-117.258,32.832],[-117.213,32.832],[-117.208,32.82],[-117.211,32.808],[-117.215,32.801],[-117.222,32.8],[-117.235,32.799],[-117.248,32.8],[-117.256,32.802],[-117.259,32.815],[-117.258,32.832]]]}},{"type":"Feature","id":"mission-beach","properties":{"name":"Mission Beach","slug":"mission-beach","center":[-117.252,32.784]},"geometry":{"type":"Polygon","coordinates":[[[-117.258,32.802],[-117.248,32.8],[-117.243,32.792],[-117.245,32.781],[-117.248,32.773],[-117.251,32.765],[-117.256,32.763],[-117.261,32.766],[-117.261,32.78],[-117.259,32.793],[-117.258,32.802]]]}},{"type":"Feature","id":"la-jolla","properties":{"name":"La Jolla","slug":"la-jolla","center":[-117.2575702,32.8458529]},"geometry":{"type":"Polygon","coordinates":[[[-117.28226,32.83262],[-117.27989,32.82621],[-117.28103,32.82194],[-117.27387,32.81798],[-117.27346,32.8141],[-117.26834,32.80831],[-117.263,32.80574],[-117.26002,32.80664],[-117.26551,32.81012],[-117.22648,32.81946],[-117.23268,32.8272],[-117.23307,32.83391],[-117.23644,32.84242],[-117.23515,32.84955],[-117.23718,32.85465],[-117.23624,32.86419],[-117.23787,32.87175],[-117.24165,32.87009],[-117.24354,32.87146],[-117.24386,32.88611],[-117.25309,32.88612],[-117.25165,32.87597],[-117.25641,32.86003],[-117.26474,32.84888],[-117.26755,32.84859],[-117.2737,32.85137],[-117.27879,32.84776],[-117.28223,32.83999],[-117.28226,32.83262]]]}},{"type":"Feature","id":"del-mar","properties":{"name":"Del Mar","slug":"del-mar","center":[-117.2653146,32.9594891]},"geometry":{"type":"Polygon","coordinates":[[[-117.27251,32.98014],[-117.26761,32.95335],[-117.26247,32.93989],[-117.25947,32.93742],[-117.25817,32.94202],[-117.256,32.94203],[-117.25594,32.94565],[-117.26015,32.94562],[-117.26097,32.94811],[-117.25974,32.94847],[-117.2602,32.95286],[-117.25592,32.95299],[-117.25617,32.97943],[-117.27251,32.98014]]]}},{"type":"Feature","id":"carmel-valley","properties":{"name":"Carmel Valley","slug":"carmel-valley","center":[-117.2234007,32.9434117]},"geometry":{"type":"Polygon","coordinates":[[[-117.24567,32.95995],[-117.24104,32.93105],[-117.2344,32.93098],[-117.2346,32.9245],[-117.21279,32.92374],[-117.21285,32.92006],[-117.20422,32.91998],[-117.18912,32.92831],[-117.1954,32.93441],[-117.20075,32.93481],[-117.2043,32.9368],[-117.20958,32.93643],[-117.21135,32.93825],[-117.21193,32.94066],[-117.20942,32.94267],[-117.20494,32.94278],[-117.20236,32.94503],[-117.19776,32.94598],[-117.19781,32.9486],[-117.20318,32.94874],[-117.19945,32.95787],[-117.20429,32.95782],[-117.20431,32.96438],[-117.20621,32.96643],[-117.22104,32.96801],[-117.22119,32.96421],[-117.22286,32.96712],[-117.22477,32.9646],[-117.22486,32.96753],[-117.22886,32.96545],[-117.2305,32.96544],[-117.23071,32.96743],[-117.23658,32.96734],[-117.2347,32.96514],[-117.23745,32.96517],[-117.24307,32.96173],[-117.24303,32.96017],[-117.24567,32.95995]]]}},{"type":"Feature","id":"rancho-santa-fe","properties":{"name":"Rancho Santa Fe","slug":"rancho-santa-fe","center":[-117.1979781,33.0242314]},"geometry":{"type":"Polygon","coordinates":[[[-117.23012,33.01409],[-117.22562,33.00813],[-117.22177,33.00853],[-117.21922,33.00666],[-117.21069,33.005],[-117.19902,33.00511],[-117.1992,33.00387],[-117.19282,33.00768],[-117.18973,33.01267],[-117.18492,33.0132],[-117.17427,33.01046],[-117.17304,33.01237],[-117.17719,33.01535],[-117.17815,33.01918],[-117.17529,33.02325],[-117.16963,33.02436],[-117.16382,33.02842],[-117.16193,33.03412],[-117.16568,33.03663],[-117.17377,33.03452],[-117.18389,33.03561],[-117.18664,33.04356],[-117.1967,33.04164],[-117.20881,33.04457],[-117.20908,33.04122],[-117.21201,33.03777],[-117.21882,33.03384],[-117.22476,33.02463],[-117.22763,33.02297],[-117.23012,33.01409]]]}},{"type":"Feature","id":"rancho-penasquitos","properties":{"name":"Rancho Peñasquitos","slug":"rancho-penasquitos","center":[-117.087,32.968]},"geometry":{"type":"Polygon","coordinates":[[[-117.107,32.986],[-117.075,32.982],[-117.062,32.974],[-117.06,32.96],[-117.065,32.954],[-117.08,32.95],[-117.095,32.952],[-117.108,32.958],[-117.112,32.97],[-117.107,32.986]]]}},{"type":"Feature","id":"scripps-ranch","properties":{"name":"Scripps Ranch","slug":"scripps-ranch","center":[-117.09,32.882]},"geometry":{"type":"Polygon","coordinates":[[[-117.105,32.908],[-117.078,32.908],[-117.068,32.895],[-117.07,32.876],[-117.072,32.86],[-117.082,32.855],[-117.095,32.856],[-117.108,32.862],[-117.112,32.878],[-117.11,32.895],[-117.105,32.908]]]}},{"type":"Feature","id":"encinitas","properties":{"name":"Encinitas","slug":"encinitas","center":[-117.2919818,33.0369867]},"geometry":{"type":"Polygon","coordinates":[[[-117.36829,33.06011],[-117.33997,33],[-117.33928,32.99599],[-117.27947,32.99928],[-117.27626,33.00146],[-117.24552,33.00746],[-117.24447,33.00568],[-117.24282,33.00938],[-117.23931,33.00943],[-117.2428,33.01104],[-117.24284,33.01281],[-117.24691,33.01279],[-117.24694,33.0168],[-117.24433,33.01799],[-117.24431,33.02172],[-117.24699,33.02044],[-117.247,33.02182],[-117.24182,33.02178],[-117.24211,33.02683],[-117.23612,33.03227],[-117.23737,33.03374],[-117.23629,33.03697],[-117.23377,33.03632],[-117.23203,33.03819],[-117.22737,33.04851],[-117.22011,33.04648],[-117.21518,33.05092],[-117.20833,33.0483],[-117.20475,33.05038],[-117.19993,33.06924],[-117.20396,33.07685],[-117.21402,33.07766],[-117.22426,33.07571],[-117.22337,33.06126],[-117.22918,33.06101],[-117.22964,33.06269],[-117.23195,33.06278],[-117.2319,33.06089],[-117.23942,33.06053],[-117.24351,33.06399],[-117.24935,33.06374],[-117.24898,33.06749],[-117.26051,33.06721],[-117.26223,33.06789],[-117.26234,33.07016],[-117.27233,33.06867],[-117.27315,33.08046],[-117.27978,33.08774],[-117.29106,33.0869],[-117.29904,33.08409],[-117.30159,33.08897],[-117.30944,33.08206],[-117.36829,33.06011]]]}},{"type":"Feature","id":"carlsbad","properties":{"name":"Carlsbad","slug":"carlsbad","center":[-117.3505966,33.1580933]},"geometry":{"type":"Polygon","coordinates":[[[-117.40957,33.13257],[-117.36829,33.06011],[-117.30944,33.08206],[-117.30159,33.08897],[-117.29904,33.08409],[-117.29106,33.0869],[-117.27978,33.08774],[-117.27005,33.08497],[-117.27004,33.08047],[-117.27315,33.08046],[-117.27233,33.06867],[-117.26234,33.07016],[-117.26223,33.06789],[-117.26051,33.06721],[-117.24898,33.06749],[-117.24935,33.06374],[-117.24351,33.06399],[-117.23942,33.06053],[-117.2319,33.06089],[-117.23195,33.06278],[-117.22964,33.06269],[-117.22918,33.06101],[-117.22337,33.06126],[-117.22426,33.07571],[-117.21671,33.09512],[-117.22103,33.09515],[-117.22458,33.10416],[-117.22795,33.11091],[-117.22979,33.11359],[-117.22992,33.13504],[-117.24601,33.13496],[-117.24674,33.14581],[-117.25323,33.15247],[-117.25688,33.15714],[-117.26187,33.1531],[-117.27066,33.1531],[-117.27098,33.17716],[-117.28304,33.17299],[-117.28393,33.17582],[-117.29889,33.17557],[-117.29943,33.18258],[-117.30971,33.17953],[-117.32319,33.18203],[-117.33136,33.17974],[-117.34412,33.17983],[-117.34431,33.17615],[-117.35284,33.1748],[-117.35973,33.16885],[-117.35803,33.16505],[-117.40957,33.13257]]]}},{"type":"Feature","id":"oceanside","properties":{"name":"Oceanside","slug":"oceanside","center":[-117.379483,33.1958696]},"geometry":{"type":"Polygon","coordinates":[[[-117.4398,33.1821],[-117.43556,33.17751],[-117.40957,33.13257],[-117.35803,33.16505],[-117.35973,33.16885],[-117.3528,33.16886],[-117.35284,33.1748],[-117.34431,33.17615],[-117.34412,33.17983],[-117.33136,33.17974],[-117.32319,33.18203],[-117.30971,33.17953],[-117.29943,33.18258],[-117.29889,33.17557],[-117.28393,33.17582],[-117.28304,33.17299],[-117.27958,33.17578],[-117.27098,33.17716],[-117.27066,33.1531],[-117.26187,33.1531],[-117.26188,33.15492],[-117.24888,33.17179],[-117.2738,33.18322],[-117.27953,33.19387],[-117.2795,33.2048],[-117.26222,33.21044],[-117.26224,33.21916],[-117.25603,33.2196],[-117.26281,33.23744],[-117.25574,33.24657],[-117.24503,33.2548],[-117.2493,33.26356],[-117.24501,33.27802],[-117.25362,33.27816],[-117.26232,33.29794],[-117.26971,33.30003],[-117.39048,33.20704],[-117.39855,33.21066],[-117.40392,33.20627],[-117.4398,33.1821]]]}},{"type":"Feature","id":"chula-vista","properties":{"name":"Chula Vista","slug":"chula-vista","center":[-117.084195,32.6400541]},"geometry":{"type":"Polygon","coordinates":[[[-117.115,32.647],[-117.095,32.658],[-117.072,32.666],[-117.048,32.671],[-117.022,32.673],[-116.997,32.677],[-116.965,32.681],[-116.933,32.672],[-116.929,32.648],[-116.927,32.62],[-116.926,32.594],[-116.929,32.576],[-116.948,32.564],[-116.968,32.558],[-116.99,32.555],[-117.012,32.558],[-117.038,32.567],[-117.055,32.575],[-117.075,32.585],[-117.09,32.598],[-117.102,32.612],[-117.11,32.628],[-117.115,32.647]]]}},{"type":"Feature","id":"la-mesa","properties":{"name":"La Mesa","slug":"la-mesa","center":[-117.0230839,32.7678288]},"geometry":{"type":"Polygon","coordinates":[[[-117.0536,32.76067],[-117.0535,32.75578],[-117.04915,32.75567],[-117.0493,32.74316],[-117.04617,32.74489],[-117.0201,32.74721],[-117.01019,32.75263],[-117.00066,32.75591],[-117.00241,32.76073],[-116.99457,32.76241],[-116.98539,32.77103],[-116.98506,32.77389],[-116.98677,32.77264],[-116.99266,32.76982],[-116.99467,32.76767],[-117.00132,32.76824],[-116.99606,32.77036],[-116.99716,32.77442],[-116.9982,32.77482],[-116.99928,32.77222],[-117.00039,32.77816],[-116.99118,32.77709],[-116.99034,32.77864],[-116.99041,32.78088],[-116.98722,32.78301],[-116.98444,32.78523],[-116.98487,32.78844],[-116.98801,32.78931],[-116.98681,32.79417],[-116.98828,32.7957],[-116.99923,32.79498],[-117.0059,32.79474],[-117.03742,32.79149],[-117.03985,32.78212],[-117.0437,32.77723],[-117.04431,32.78007],[-117.04825,32.78044],[-117.0514,32.77795],[-117.04867,32.77734],[-117.04862,32.77427],[-117.0465,32.7735],[-117.04704,32.77085],[-117.03993,32.77139],[-117.03897,32.76886],[-117.04562,32.76766],[-117.04562,32.76601],[-117.05115,32.76602],[-117.05118,32.76326],[-117.05337,32.76328],[-117.0536,32.76067]]]}},{"type":"Feature","id":"el-cajon","properties":{"name":"El Cajon","slug":"el-cajon","center":[-116.962526,32.7947731]},"geometry":{"type":"Polygon","coordinates":[[[-117.01122,32.82029],[-117.00999,32.81563],[-117.00597,32.81295],[-117.00604,32.79474],[-116.98828,32.7957],[-116.98821,32.79066],[-116.98444,32.78523],[-116.98767,32.78429],[-116.98722,32.78301],[-116.99041,32.78088],[-116.98169,32.77943],[-116.97762,32.77784],[-116.97411,32.77552],[-116.96659,32.77472],[-116.964,32.77317],[-116.95905,32.77569],[-116.95585,32.77793],[-116.94659,32.77969],[-116.94631,32.77823],[-116.94265,32.78056],[-116.94721,32.78512],[-116.94059,32.78547],[-116.93785,32.78475],[-116.93457,32.78472],[-116.93217,32.78109],[-116.92806,32.77824],[-116.92739,32.77606],[-116.92062,32.77872],[-116.91668,32.78184],[-116.91879,32.78552],[-116.91636,32.78863],[-116.92152,32.79275],[-116.91799,32.7964],[-116.91668,32.79451],[-116.91583,32.79641],[-116.91171,32.79764],[-116.90919,32.79606],[-116.90546,32.79484],[-116.89593,32.80168],[-116.90035,32.80324],[-116.90133,32.80325],[-116.90308,32.80476],[-116.90974,32.80223],[-116.91037,32.80022],[-116.91953,32.80021],[-116.9183,32.80927],[-116.91289,32.80785],[-116.91281,32.81071],[-116.91309,32.81597],[-116.91821,32.82256],[-116.91985,32.81994],[-116.92236,32.81863],[-116.92814,32.81696],[-116.92978,32.81314],[-116.93351,32.81707],[-116.94003,32.81686],[-116.94058,32.81393],[-116.93651,32.80922],[-116.94408,32.80835],[-116.94928,32.80852],[-116.94927,32.81513],[-116.94752,32.81687],[-116.94613,32.82175],[-116.94924,32.82295],[-116.95602,32.81525],[-116.95271,32.81051],[-116.9591,32.81153],[-116.9594,32.81035],[-116.96157,32.81234],[-116.96601,32.81108],[-116.96373,32.81687],[-116.96509,32.82442],[-116.96235,32.8245],[-116.96405,32.82957],[-116.98716,32.83098],[-116.98827,32.8284],[-116.99008,32.82629],[-116.99353,32.8263],[-116.99415,32.82901],[-116.99932,32.82901],[-117.00072,32.82778],[-117.00021,32.82547],[-117.0021,32.81965],[-117.01122,32.82029]]]}}]};

  /* ── State ───────────────────────────────────────────────────── */
  var map, popup;
  var hoveredId = null;
  var activeId  = null;

  /* ── Build chip list dynamically ─────────────────────────────── */
  function buildChips() {
    var container = document.getElementById('ap-areas-chips');
    if (!container) return;
    var stagger = ['', ' reveal-d1', ' reveal-d2'];
    var html = '';
    CITY_ORDER.forEach(function (slug, i) {
      var feat = CITIES.features.find(function (f) { return f.id === slug; });
      if (!feat) return;
      var name = feat.properties.name;
      html +=
        '<a href="#" class="ap-area-chip reveal' + stagger[i % 3] + '"' +
        ' data-slug="' + slug + '"' +
        ' data-city="' + name + '"' +
        ' aria-label="Highlight ' + name + ' on map">' +
        '<span class="ap-area-chip-dot"></span>' +
        '<span class="ap-area-chip-name">' + name + '</span>' +
        '</a>';
    });
    container.innerHTML = html;
  }

  /* ── Chip hover / click events ───────────────────────────────── */
  function wireChips() {
    document.querySelectorAll('.ap-area-chip[data-slug]').forEach(function (chip) {
      var slug = chip.dataset.slug;

      chip.addEventListener('click', function (e) {
        e.preventDefault();
        var feat = CITIES.features.find(function (f) { return f.id === slug; });
        activateCity(slug, slug, feat ? feat.properties.center : null, false);
      });

      chip.addEventListener('mouseenter', function () {
        chip.classList.add('is-hovered');
        if (map && map.isStyleLoaded()) {
          map.setFeatureState({ source: 'ap-cities', id: slug }, { hover: true });
        }
      });

      chip.addEventListener('mouseleave', function () {
        chip.classList.remove('is-hovered');
        if (map && map.isStyleLoaded()) {
          map.setFeatureState({ source: 'ap-cities', id: slug }, { hover: false });
        }
      });
    });
  }

  /* ── activateCity ────────────────────────────────────────────── */
  function activateCity(featureId, slug, center, navigate) {
    if (map && map.isStyleLoaded()) {
      if (activeId !== null && activeId !== featureId) {
        map.setFeatureState({ source: 'ap-cities', id: activeId }, { active: false });
      }
    }
    activeId = featureId;
    if (map && map.isStyleLoaded()) {
      map.setFeatureState({ source: 'ap-cities', id: featureId }, { active: true });
    }
    document.querySelectorAll('.ap-area-chip').forEach(function (c) { c.classList.remove('is-active'); });
    var chip = document.querySelector('.ap-area-chip[data-slug="' + slug + '"]');
    if (chip) chip.classList.add('is-active');
    if (map && map.isStyleLoaded()) {
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
    if (navigate !== false) {
      var url = COMMUNITY_URLS[slug];
      if (url) {
        setTimeout(function () { window.location.href = url; }, 380);
      }
    }
  }

  function hoverChip(slug) {
    var el = document.querySelector('.ap-area-chip[data-slug="' + slug + '"]');
    if (el) el.classList.add('is-hovered');
  }

  function unhoverChips() {
    document.querySelectorAll('.ap-area-chip.is-hovered').forEach(function (el) {
      el.classList.remove('is-hovered');
    });
  }

  /* ── Mapbox map init ─────────────────────────────────────────── */
  function initMap() {
    if (typeof mapboxgl === 'undefined') return;
    if (!mapboxgl.supported()) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map = new mapboxgl.Map({
      container: 'ap-areas-map',
      style:     'mapbox://styles/mapbox/dark-v11',
      center:    [-117.35, 33.10],
      zoom:       9.0,
      minZoom:    7,
      maxZoom:   15,
      attributionControl: false,
      logoPosition: 'bottom-right',
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    popup = new mapboxgl.Popup({
      closeButton:  false,
      closeOnClick: false,
      className:    'ap-areas-popup',
      offset:       10,
    });

    map.on('load', function () {
      [
        ['land',         'fill-color', '#0C0C0E'],
        ['landuse',      'fill-color', '#101012'],
        ['water',        'fill-color', '#0A1828'],
        ['water-shadow', 'fill-color', '#0A1828'],
      ].forEach(function (p) {
        try { map.setPaintProperty(p[0], p[1], p[2]); } catch (e) {}
      });

      map.addSource('ap-sd-county', {
        type: 'geojson',
        data: { type: 'Feature', geometry: SD_COUNTY },
      });
      map.addLayer({ id: 'ap-sd-county-fill', type: 'fill', source: 'ap-sd-county',
        paint: { 'fill-color': '#2A0C14', 'fill-opacity': 0.45 } });
      map.addLayer({ id: 'ap-sd-county-border', type: 'line', source: 'ap-sd-county',
        paint: { 'line-color': '#6B1E30', 'line-width': 1.5, 'line-opacity': 0.70 } });

      map.addSource('ap-cities', { type: 'geojson', data: CITIES });

      map.addLayer({
        id: 'ap-city-fill', type: 'fill', source: 'ap-cities',
        paint: {
          'fill-color': ['case',
            ['boolean', ['feature-state', 'active'], false], '#A03050',
            ['boolean', ['feature-state', 'hover'],  false], '#ffffff',
            '#581829'],
          'fill-opacity': ['case',
            ['boolean', ['feature-state', 'active'], false], 0.95,
            ['boolean', ['feature-state', 'hover'],  false], 0.92,
            0.72],
          'fill-color-transition':   { duration: 220, delay: 0 },
          'fill-opacity-transition': { duration: 220, delay: 0 },
        },
      });

      map.addLayer({
        id: 'ap-city-border', type: 'line', source: 'ap-cities',
        paint: {
          'line-color': ['case',
            ['boolean', ['feature-state', 'active'], false], '#FFB0C8',
            ['boolean', ['feature-state', 'hover'],  false], '#B03050',
            '#D4607A'],
          'line-width': ['case',
            ['boolean', ['feature-state', 'active'], false], 2.8,
            ['boolean', ['feature-state', 'hover'],  false], 2.2,
            1.4],
          'line-opacity': ['case',
            ['boolean', ['feature-state', 'active'], false], 1.0,
            ['boolean', ['feature-state', 'hover'],  false], 0.95,
            0.80],
          'line-color-transition':   { duration: 220, delay: 0 },
          'line-width-transition':   { duration: 220, delay: 0 },
          'line-opacity-transition': { duration: 220, delay: 0 },
        },
      });

      map.addLayer({
        id: 'ap-city-label', type: 'symbol', source: 'ap-cities',
        layout: {
          'text-field':          ['upcase', ['get', 'name']],
          'text-font':           ['DIN Pro Bold', 'Arial Unicode MS Bold'],
          'text-size':           ['interpolate', ['linear'], ['zoom'], 8, 9, 10, 11, 13, 13],
          'text-anchor':         'center',
          'text-max-width':      7,
          'text-allow-overlap':  false,
        },
        paint: {
          'text-color':      ['case', ['boolean', ['feature-state', 'hover'], false], '#2A0810', '#FFECF0'],
          'text-halo-color': '#2A0810',
          'text-halo-width': 1.5,
        },
      });

      /* Auto-fit to all polygons */
      (function () {
        var minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
        function scan(c) {
          if (typeof c[0] === 'number') {
            if (c[0] < minLng) minLng = c[0]; if (c[0] > maxLng) maxLng = c[0];
            if (c[1] < minLat) minLat = c[1]; if (c[1] > maxLat) maxLat = c[1];
          } else { c.forEach(scan); }
        }
        CITIES.features.forEach(function (f) { scan(f.geometry.coordinates); });
        if (isFinite(minLng)) {
          map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40, duration: 0, maxZoom: 12 });
        }
      })();

      map.on('mousemove', 'ap-city-fill', function (e) {
        if (!e.features || !e.features.length) return;
        var feat = e.features[0];
        var id   = feat.id;
        if (hoveredId !== null && hoveredId !== id) {
          map.setFeatureState({ source: 'ap-cities', id: hoveredId }, { hover: false });
          unhoverChips();
        }
        if (hoveredId !== id) {
          hoveredId = id;
          map.setFeatureState({ source: 'ap-cities', id: id }, { hover: true });
          hoverChip(feat.properties.slug);
        }
        map.getCanvas().style.cursor = 'pointer';
        popup.setLngLat(e.lngLat).setHTML('<span>' + feat.properties.name + '</span>').addTo(map);
      });

      map.on('mouseleave', 'ap-city-fill', function () {
        if (hoveredId !== null) {
          map.setFeatureState({ source: 'ap-cities', id: hoveredId }, { hover: false });
          unhoverChips();
          hoveredId = null;
        }
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      map.on('click', 'ap-city-fill', function (e) {
        if (!e.features || !e.features.length) return;
        var feat = e.features[0];
        activateCity(feat.id, feat.properties.slug, feat.properties.center);
      });
    });
  }

  /* ── Boot ─────────────────────────────────────────────────────── */
  buildChips();
  wireChips();
  initMap();

})();

export interface AgentEntry {
  name: string
  slug: string
  imgSrc: string
  title: string
  isLeader?: boolean
  bio?: string[]
  phone?: string   // display format e.g. "(619) 913-9650"
  email?: string   // actual email address
}

/** Convert a display phone "(619) 913-9650" to a tel: URL "+16199139650" */
export function toTelUrl(phone: string): string {
  return 'tel:+1' + phone.replace(/\D/g, '')
}

/** Site-wide fallback contact (used for leadership team without individual data) */
export const SITE_PHONE = '(619) 794-0218'
export const SITE_EMAIL_FALLBACK = (slug: string) => `${slug.split('-')[0]}@palisaderealty.com`

export const LEADERSHIP: AgentEntry[] = [
  { name: 'Hedda Parashos',     slug: 'hedda-parashos',     title: 'CEO',                             imgSrc: '/assets/images/agents/hedda-parashos.jpg',     isLeader: true, bio: [
    'Hedda Parashos is the Owner and President of Palisade Realty, a full-service real estate brokerage established in 2006. She acquired the company in 2012 and has since transformed it into one of Southern California\'s respected independent brokerages through innovation, strong leadership, and an unwavering commitment to both clients and agents.',
    'Today, Palisade Realty is home to more than 100 real estate agent partners, with continued growth across San Diego County, Orange County, and parts of Riverside County. Under Hedda\'s leadership, the brokerage has been involved in the successful sale of thousands of homes, earning a reputation for professionalism, integrity, and exceptional client service.',
    'Hedda\'s passion for real estate extends beyond buying and selling homes. She is dedicated to creating an environment where agents can thrive through mentorship, innovative marketing, cutting-edge technology, and a culture built on collaboration and genuine care. Her vision has positioned Palisade Realty as a brokerage that continually evolves to meet the changing needs of today\'s real estate market.',
    'Whether working with first-time homebuyers, luxury sellers, investors, or experienced clients, Hedda and the Palisade Realty team are committed to delivering knowledgeable guidance, strategic representation, and an exceptional real estate experience from start to finish.',
  ] },
  { name: 'Tom Parashos',       slug: 'tom-parashos',       title: 'Broker',                          imgSrc: '/assets/images/agents/tom-parashos.jpg',       isLeader: true },
  { name: 'Britney Bartlett',   slug: 'britney-bartlett',   title: 'Director of Operations',          imgSrc: '/assets/images/agents/britney-bartlett.jpg',   isLeader: true },
  { name: 'Michael DiVita',     slug: 'michael-divita',     title: 'Database and Onboarding Manager', imgSrc: '/assets/images/agents/michael-divita.jpg',     isLeader: true },
  { name: 'Michael Guzman',     slug: 'michael-guzman',     title: 'REALTOR®',                        imgSrc: '/assets/images/agents/michael-guzman.jpg',     isLeader: true },
  { name: 'Nicole Ward',        slug: 'nicole-ward',        title: 'Risk Manager',                    imgSrc: '/assets/images/agents/nicole-ward.png',        isLeader: true },
  { name: 'Danielle Patterson', slug: 'danielle-patterson', title: 'Transaction Coordinator',         imgSrc: '/assets/images/agents/danielle-patterson.jpg', isLeader: true },
  { name: 'Lisa Florendo',      slug: 'lisa-florendo',      title: 'Transaction Coordinator',         imgSrc: '/assets/images/agents/lisa-florendo.png',      isLeader: true },
  { name: 'Kelly Chan',         slug: 'kelly-chan',          title: 'Database Assistant',              imgSrc: '/assets/images/agents/kelly-chan.jpg',         isLeader: true },
  { name: 'Fermin Perez',       slug: 'fermin-perez',       title: 'Transaction Coordinator',         imgSrc: '/assets/images/agents/fermin-perez.jpg',       isLeader: true },
]

export const AGENTS: AgentEntry[] = [
  { name: 'Erick Salgado',               slug: 'erick-salgado',               title: 'REALTOR®', imgSrc: '/assets/images/agents/erick-salgado.jpg',               phone: '(619) 800-4839', email: 'erick@realtorerick.com' },
  { name: 'Melissa Maxwell',             slug: 'melissa-maxwell',             title: 'REALTOR®', imgSrc: '/assets/images/agents/melissa-maxwell.jpg',             phone: '(619) 251-1136', email: 'Melissamaxwell22@yahoo.com' },
  { name: 'Patty Aguilar',               slug: 'patty-aguilar',               title: 'REALTOR®', imgSrc: '/assets/images/agents/patty-aguilar.jpg',               phone: '(619) 301-4141', email: 'patty@palisaderealty.com' },
  { name: 'Deborah Trevino',             slug: 'deborah-trevino',             title: 'REALTOR®', imgSrc: '/assets/images/agents/deborah-trevino.jpg',             phone: '(619) 933-7333', email: 'sold@DeborahTrevino.com' },
  { name: 'Sarah Bautista',              slug: 'sarah-bautista',              title: 'REALTOR®', imgSrc: '/assets/images/agents/sarah-bautista.jpg',              phone: '(619) 313-7063', email: 'sarahbsocal@gmail.com' },
  { name: 'Piper Stein',                 slug: 'piper-stein',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/piper-stein.jpg',                 phone: '(858) 357-5292', email: 'Piper@piperstein.com' },
  { name: 'Jason Wallace',               slug: 'jason-wallace',               title: 'REALTOR®', imgSrc: '/assets/images/agents/jason-wallace.jpg',               phone: '(858) 244-9692', email: 'Jason@jlwre.com' },
  { name: 'Mariko Tortolero',            slug: 'mariko-tortolero',            title: 'REALTOR®', imgSrc: '/assets/images/agents/mariko-tortolero.png',            phone: '(619) 520-4134', email: 'MarikoRealtor@gmail.com' },
  { name: 'Eric Hayman',                 slug: 'eric-hayman',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/eric-hayman.jpg',                 phone: '(714) 788-3540', email: 'eric.palisade@gmail.com' },
  { name: 'Keith Agnello',               slug: 'keith-agnello',               title: 'REALTOR®', imgSrc: '/assets/images/agents/keith-agnello.jpg',               phone: '(714) 561-2695', email: 'keith.palisade@gmail.com' },
  { name: 'Vanda Fernandes',             slug: 'vanda-fernandes',             title: 'REALTOR®', imgSrc: '/assets/images/agents/vanda-fernandes.jpg',             phone: '(619) 639-5139', email: 'vandafernandes.realtor@gmail.com' },
  { name: 'Patty Samii',                 slug: 'patty-samii',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/patty-samii.png',                 phone: '(760) 717-1988', email: 'pattysamii@yahoo.com' },
  { name: 'Robby Gmur',                  slug: 'robby-gmur',                  title: 'REALTOR®', imgSrc: '/assets/images/agents/robby-gmur.jpg',                  phone: '(949) 310-5195', email: 'Robby@RG4RE.com' },
  { name: 'Brandy Bell',                 slug: 'brandy-bell',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/brandy-bell.jpg',                 phone: '(619) 847-6210', email: 'brandybellhomes@gmail.com' },
  { name: 'Hervin Ugalde',               slug: 'hervin-ugalde',               title: 'REALTOR®', imgSrc: '/assets/images/agents/hervin-ugalde.jpg',               phone: '(858) 335-7796', email: 'ugalderealestate@gmail.com' },
  { name: 'Ivan Butrus',                 slug: 'ivan-butrus',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/ivan-butrus.jpg',                 phone: '(619) 277-8382', email: 'ivanrealtor7@gmail.com' },
  { name: 'Anh Lam',                     slug: 'anh-lam',                     title: 'REALTOR®', imgSrc: '/assets/images/agents/anh-lam.jpg',                     phone: '(714) 902-4273', email: 'AnhLamrealtor@gmail.com' },
  { name: 'Katya Schumaker',             slug: 'katya-schumaker',             title: 'REALTOR®', imgSrc: '/assets/images/agents/katya-schumaker.jpg',             phone: '(619) 602-0106', email: 'sandiegoproperties22@gmail.com' },
  { name: 'Meghan McNutt',               slug: 'meghan-mcnutt',               title: 'REALTOR®', imgSrc: '/assets/images/agents/meghan-mcnutt.jpg',               phone: '(619) 866-1236', email: 'meghanmcnutt1@gmail.com' },
  { name: 'Debbie Lawes',                slug: 'debbie-lawes',                title: 'REALTOR®', imgSrc: '/assets/images/agents/debbie-lawes.jpg',                phone: '(760) 214-4947', email: 'debbielawes@me.com' },
  { name: 'Martina Toma',                slug: 'martina-toma',                title: 'REALTOR®', imgSrc: '/assets/images/agents/martina-toma.jpg',                phone: '(619) 967-9033', email: 'martinatoma.realtor@gmail.com' },
  { name: 'Alexandra Polles',            slug: 'alexandra-polles',            title: 'REALTOR®', imgSrc: '/assets/images/agents/alexandra-polles.jpg',            phone: '(619) 921-5812', email: 'alexandrapolles@gmail.com' },
  { name: 'Fia Ierino',                  slug: 'fia-ierino',                  title: 'REALTOR®', imgSrc: '/assets/images/agents/fia-ierino.jpg',                  phone: '(858) 432-9168', email: 'fiarealtorpro@gmail.com' },
  { name: 'Diana Beezley',               slug: 'diana-beezley',               title: 'REALTOR®', imgSrc: '/assets/images/agents/diana-beezley.jpg',               phone: '(619) 419-6186', email: 'beezleydiana@gmail.com' },
  { name: 'Lyna Rawlings',               slug: 'lyna-rawlings',               title: 'REALTOR®', imgSrc: '/assets/images/agents/lyna-rawlings.jpg',               phone: '(619) 718-1102', email: 'rawlingslyna@yahoo.com' },
  { name: 'Yvonne Mulgrew',              slug: 'yvonne-mulgrew',              title: 'REALTOR®', imgSrc: '/assets/images/agents/yvonne-mulgrew.jpg',              phone: '(619) 368-6802', email: 'yvonne.sandiegohomes@gmail.com' },
  { name: 'Allison Asher',               slug: 'allison-asher',               title: 'REALTOR®', imgSrc: '/assets/images/agents/allison-asher.png',               phone: '(858) 335-8124', email: 'allisonm1031@gmail.com' },
  { name: 'Alan Luken',                  slug: 'alan-luken',                  title: 'REALTOR®', imgSrc: '/assets/images/agents/alan-luken.jpg',                  phone: '(619) 913-9650', email: 'alanlukenb@gmail.com' },
  { name: 'Delilah Bejarano Armendariz', slug: 'delilah-bejarano-armendariz', title: 'REALTOR®', imgSrc: '/assets/images/agents/delilah-bejarano-armendariz.jpg', phone: '(619) 210-5777', email: 'ydbejarano@gmail.com' },
  { name: 'Jaymie Santiago',             slug: 'jaymie-santiago',             title: 'REALTOR®', imgSrc: '/assets/images/agents/jaymie-santiago.png',             phone: '(619) 818-0089', email: 'jaymiesdhomes@gmail.com' },
  { name: 'Jodi Kirkwood',               slug: 'jodi-kirkwood',               title: 'REALTOR®', imgSrc: '/assets/images/agents/jodi-kirkwood.jpg',               phone: '(949) 683-2862', email: 'jodi@kirkwoodhometeam.com' },
  { name: 'Marla Drexler',               slug: 'marla-drexler',               title: 'REALTOR®', imgSrc: '/assets/images/agents/marla-drexler.jpg',               phone: '(858) 449-4113', email: 'marladrexler.2010@gmail.com' },
  { name: 'Lacy McFarland',              slug: 'lacy-mcfarland',              title: 'REALTOR®', imgSrc: '/assets/images/agents/lacy-mcfarland.jpg',              phone: '(619) 300-5175', email: 'lacyalexis.sd@gmail.com' },
  { name: 'Renata Rios',                 slug: 'renata-rios',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/renata-rios.jpg',                 phone: '(619) 734-6660', email: 'renatariosrealtor@gmail.com' },
  { name: 'Juanito So Jr.',              slug: 'juanito-so-jr',               title: 'REALTOR®', imgSrc: '/assets/images/agents/juanito-so-jr.jpg',               phone: '(619) 964-3583', email: 'jrsellssd@gmail.com' },
  { name: 'Kalen Esguerra',              slug: 'kalen-esguerra',              title: 'REALTOR®', imgSrc: '/assets/images/agents/kalen-esguerra.jpg',              phone: '(619) 343-4589', email: 'kalenesg.sales@gmail.com' },
  { name: 'Debbie No',                   slug: 'debbie-no',                   title: 'REALTOR®', imgSrc: '/assets/images/agents/debbie-no.jpg',                   phone: '(661) 310-8831', email: 'debbie.no.cal@gmail.com' },
  { name: 'Chip Morgan',                 slug: 'chip-morgan',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/chip-morgan.jpg',                 phone: '(757) 839-1389', email: 'chip.realtorsd@gmail.com' },
  { name: 'Daniel Kappler',              slug: 'daniel-kappler',              title: 'REALTOR®', imgSrc: '/assets/images/agents/daniel-kappler.jpg',              phone: '(843) 276-7350', email: 'kappler.palisade@gmail.com' },
  { name: 'Diane Van Korlaar',           slug: 'diane-van-korlaar',           title: 'REALTOR®', imgSrc: '/assets/images/agents/diane-van-korlaar.jpg',           phone: '(949) 942-3886', email: 'homesbydianevank@gmail.com' },
  { name: 'Ryan Stein',                  slug: 'ryan-stein',                  title: 'REALTOR®', imgSrc: '/assets/images/agents/ryan-stein.jpg',                  phone: '(619) 917-1679', email: 'ryan@callstein.com' },
  { name: 'Brandon Le',                  slug: 'brandon-le',                  title: 'REALTOR®', imgSrc: '/assets/images/agents/brandon-le.jpg',                  phone: '(858) 254-1504', email: 'brandonsdrealtor@gmail.com' },
  { name: 'Zach Campbell',               slug: 'zach-campbell',               title: 'REALTOR®', imgSrc: '/assets/images/agents/zach-campbell.jpg',               phone: '(760) 458-0732', email: 'zachsellssocal@gmail.com' },
  { name: 'Aubrey Foulk',                slug: 'aubrey-foulk',                title: 'REALTOR®', imgSrc: '/assets/images/agents/aubrey-foulk.jpg',                phone: '(619) 201-2086', email: 'aubreyfoulk5@gmail.com' },
  { name: 'Jeremy McHone',               slug: 'jeremy-mchone',               title: 'REALTOR®', imgSrc: '/assets/images/agents/jeremy-mchone.png',               phone: '(619) 971-0791', email: 'jeremymchonerealtor@gmail.com' },
  { name: 'Laura Pachlin',               slug: 'laura-pachlin',               title: 'REALTOR®', imgSrc: '/assets/images/agents/laura-pachlin.jpg',               phone: '(619) 504-9996', email: 'laura@finehomesofsd.com' },
  { name: 'Samuel Minero',               slug: 'samuel-minero',               title: 'REALTOR®', imgSrc: '/assets/images/agents/samuel-minero.jpg',               phone: '(858) 323-7940', email: 'Sam.minero@outlook.com' },
  { name: 'Jim Stengel',                 slug: 'jim-stengel',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/jim-stengel.jpg',                 phone: '(619) 407-9105', email: 'jimstengel@gmail.com' },
  { name: 'Brandon Khieu',               slug: 'brandon-khieu',               title: 'REALTOR®', imgSrc: '/assets/images/agents/brandon-khieu.jpg',               phone: '(858) 776-1093', email: 'Pq4realty@gmail.com' },
  { name: 'Mona Hassan',                 slug: 'mona-hassan',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/mona-hassan.jpg',                 phone: '(619) 316-8717', email: 'mona.sdhomes@gmail.com' },
  { name: 'Kirsten Blessum',             slug: 'kirsten-blessum',             title: 'REALTOR®', imgSrc: '/assets/images/agents/kirsten-blessum.jpg',             phone: '(619) 884-1534', email: 'kirstensellssandiego@gmail.com' },
  { name: 'Wally Dally',                 slug: 'wally-dally',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/wally-dally.png',                 phone: '(760) 880-9980', email: 'info@wallydally.com' },
  { name: 'Devyn Iglehart',              slug: 'devyn-iglehart',              title: 'REALTOR®', imgSrc: '/assets/images/agents/devyn-iglehart.jpg',              phone: '(619) 764-3842', email: 'diglehart04@gmail.com' },
  { name: 'Chris Nguyen',                slug: 'chris-nguyen',                title: 'REALTOR®', imgSrc: '/assets/images/agents/chris-nguyen.jpg',                phone: '(619) 354-7920', email: 'Chrisnguyensold@outlook.com' },
  { name: 'Jared Lawrence',              slug: 'jared-lawrence',              title: 'REALTOR®', imgSrc: '/assets/images/agents/jared-lawrence.jpg',              phone: '(858) 449-4022', email: 'jared@jaredlawrencere.com' },
  { name: 'Jonathan Cohen-Kurzrock',     slug: 'jonathan-cohen-kurzrock',     title: 'REALTOR®', imgSrc: '/assets/images/agents/jonathan-cohen-kurzrock.png',     phone: '(858) 336-9653', email: 'Jcohenkurzrock@gmail.com' },
  { name: 'Chittra Cruz',                slug: 'chittra-cruz',                title: 'REALTOR®', imgSrc: '/assets/images/agents/chittra-cruz.jpg',                phone: '(619) 940-0370', email: 'ChittraCruz@gmail.com' },
  { name: 'Kelsey Barry Farnsworth',     slug: 'kelsey-barry-farnsworth',     title: 'REALTOR®', imgSrc: '/assets/images/agents/kelsey-barry-farnsworth.jpg',     phone: '(858) 833-2488', email: 'kelseybarryhomes@gmail.com' },
  { name: 'Edelia Eveland',              slug: 'edelia-eveland',              title: 'REALTOR®', imgSrc: '/assets/images/agents/edelia-eveland.png',              phone: '(951) 218-1070', email: 'edeliaeveland@gmail.com' },
  { name: 'Sabrina Alvarado',            slug: 'sabrina-alvarado',            title: 'REALTOR®', imgSrc: '/assets/images/agents/sabrina-alvarado.jpg',            phone: '(619) 346-2342', email: 'hellosdhomes@gmail.com' },
  { name: 'Andrew Lopez',                slug: 'andrew-lopez',                title: 'REALTOR®', imgSrc: '/assets/images/agents/andrew-lopez.jpg',                phone: '(619) 549-4995', email: 'andrew@listwithlopez.com' },
  { name: 'Taylor Schunk',               slug: 'taylor-schunk',               title: 'REALTOR®', imgSrc: '/assets/images/agents/taylor-schunk.jpg',               phone: '(619) 922-5046', email: 'taylorrealtysd@gmail.com' },
  { name: 'Louis Goletto',               slug: 'louis-goletto',               title: 'REALTOR®', imgSrc: '/assets/images/agents/louis-goletto.png',               phone: '(619) 850-8292', email: 'louisgoletto@gmail.com' },
  { name: 'Atzay Estrada',               slug: 'atzay-estrada',               title: 'REALTOR®', imgSrc: '/assets/images/agents/atzay-estrada.jpg',               phone: '(858) 344-9367', email: 'atzay.estradap@gmail.com' },
  { name: 'Cynthia Mayorga',             slug: 'cynthia-mayorga',             title: 'REALTOR®', imgSrc: '/assets/images/agents/cynthia-mayorga.png',             phone: '(619) 396-3539', email: 'c.mayorgasdrltr@gmail.com' },
  { name: "Casie O'Donnell",             slug: 'casie-o-donnell',             title: 'REALTOR®', imgSrc: '/assets/images/agents/casie-o-donnell.jpg',             phone: '(619) 417-1943', email: 'CasieSellsSanDiego@gmail.com' },
  { name: 'Sergio Yturralde',            slug: 'sergio-yturralde',            title: 'REALTOR®', imgSrc: '/assets/images/agents/sergio-yturralde.jpg',            phone: '(760) 710-1965', email: 'sergioyrealtor@gmail.com' },
  { name: 'Melissa Campos',              slug: 'melissa-campos',              title: 'REALTOR®', imgSrc: '/assets/images/agents/melissa-campos.jpg',              phone: '(619) 651-3332', email: 'Melissa@lovewhereyoulivesd.com' },
  { name: 'Emma Dearing',                slug: 'emma-dearing',                title: 'REALTOR®', imgSrc: '/assets/images/agents/emma-dearing.jpg',                phone: '(619) 432-3019', email: 'dearingrealty@gmail.com' },
  { name: 'Tristen Campanella',          slug: 'tristen-campanella',          title: 'REALTOR®', imgSrc: '/assets/images/agents/tristen-campanella.png',          phone: '(951) 259-0755', email: 'tristen@homebytristen.com' },
  { name: 'Rachel Ohara',                slug: 'rachel-ohara',                title: 'REALTOR®', imgSrc: '/assets/images/agents/rachel-ohara.png',                phone: '(714) 553-0732', email: 'rachelosdre@gmail.com' },
  { name: 'Jennifer Crosby',             slug: 'jennifer-crosby',             title: 'REALTOR®', imgSrc: '/assets/images/agents/jennifer-crosby.jpg',             phone: '(619) 917-7647', email: 'jencrosbyrealtor@gmail.com' },
  { name: 'Glennis Dawson',              slug: 'glennis-dawson',              title: 'REALTOR®', imgSrc: '/assets/images/agents/glennis-dawson.jpg',              phone: '(760) 208-5347', email: 'glennis28@gmail.com' },
  { name: 'Gina Romeo',                  slug: 'gina-romeo',                  title: 'REALTOR®', imgSrc: '/assets/images/agents/gina-romeo.jpg',                  phone: '(619) 862-8051', email: 'ginagrealty@gmail.com' },
  { name: 'Corinne Mauro',               slug: 'corinne-mauro',               title: 'REALTOR®', imgSrc: '/assets/images/agents/corinne-mauro.jpg',               phone: '(619) 952-6958', email: 'corinnemauro.realestate@gmail.com' },
  { name: 'Jules Marchisio',             slug: 'jules-marchisio',             title: 'REALTOR®', imgSrc: '/assets/images/agents/jules-marchisio.jpg',             phone: '(619) 391-2399', email: 'julesmarchisio@gmail.com' },
  { name: 'Greg Lathem',                 slug: 'greg-lathem',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/greg-lathem.jpg',                 phone: '(619) 304-3033', email: 'lathemhomes@gmail.com' },
  { name: 'James McNab',                 slug: 'james-mcnab',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/james-mcnab.jpg',                 phone: '(619) 375-2139', email: 'james.mcnabhomes@gmail.com' },
  { name: 'Jarrod Norris',               slug: 'jarrod-norris',               title: 'REALTOR®', imgSrc: '/assets/images/agents/jarrod-norris.jpg',               phone: '(619) 206-8156', email: 'Norris.jarrod@gmail.com' },
  { name: 'Hannah Ohman',                slug: 'hannah-ohman',                title: 'REALTOR®', imgSrc: '/assets/images/agents/hannah-ohman.png',                phone: '(303) 956-8060', email: 'hannah@hannahohmansd.com' },
  { name: 'Katie Lussier',               slug: 'katie-lussier',               title: 'REALTOR®', imgSrc: '/assets/images/agents/katie-lussier.jpg',               phone: '(760) 792-7180', email: 'Klussiersellingsd@gmail.com' },
  { name: 'John Verdin',                 slug: 'john-verdin',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/john-verdin.jpg',                 phone: '(714) 353-7466', email: 'jverdinrealty@gmail.com' },
]

export const ALL_AGENTS: AgentEntry[] = [...LEADERSHIP, ...AGENTS]

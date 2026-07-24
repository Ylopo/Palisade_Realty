import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import AgentContactForm from './AgentContactForm'

interface AgentEntry {
  name: string
  slug: string
  imgSrc: string
  title: string
  isLeader?: boolean
}

const ALL_AGENTS: AgentEntry[] = [
  { name: 'Hedda Parashos',         slug: 'hedda-parashos',              title: 'CEO',                           imgSrc: '/assets/images/agents/hedda-parashos.jpg',              isLeader: true },
  { name: 'Tom Parashos',           slug: 'tom-parashos',                title: 'Broker',                        imgSrc: '/assets/images/agents/tom-parashos.jpg',                isLeader: true },
  { name: 'Britney Bartlett',       slug: 'britney-bartlett',            title: 'Director of Operations',        imgSrc: '/assets/images/agents/britney-bartlett.jpg',            isLeader: true },
  { name: 'Michael DiVita',         slug: 'michael-divita',              title: 'Database and Onboarding Manager', imgSrc: '/assets/images/agents/michael-divita.jpg',            isLeader: true },
  { name: 'Michael Guzman',         slug: 'michael-guzman',              title: 'REALTOR®',                      imgSrc: '/assets/images/agents/michael-guzman.jpg',              isLeader: true },
  { name: 'Nicole Ward',            slug: 'nicole-ward',                 title: 'Risk Manager',                  imgSrc: '/assets/images/agents/nicole-ward.png',                 isLeader: true },
  { name: 'Danielle Patterson',     slug: 'danielle-patterson',          title: 'Transaction Coordinator',       imgSrc: '/assets/images/agents/danielle-patterson.jpg',          isLeader: true },
  { name: 'Lisa Florendo',          slug: 'lisa-florendo',               title: 'Transaction Coordinator',       imgSrc: '/assets/images/agents/lisa-florendo.png',               isLeader: true },
  { name: 'Kelly Chan',             slug: 'kelly-chan',                   title: 'Database Assistant',            imgSrc: '/assets/images/agents/kelly-chan.jpg',                  isLeader: true },
  { name: 'Fermin Perez',           slug: 'fermin-perez',                title: 'Transaction Coordinator',       imgSrc: '/assets/images/agents/fermin-perez.jpg',                isLeader: true },
  { name: 'Erick Salgado',              slug: 'erick-salgado',              title: 'REALTOR®', imgSrc: '/assets/images/agents/erick-salgado.jpg' },
  { name: 'Melissa Maxwell',            slug: 'melissa-maxwell',            title: 'REALTOR®', imgSrc: '/assets/images/agents/melissa-maxwell.jpg' },
  { name: 'Patty Aguilar',              slug: 'patty-aguilar',              title: 'REALTOR®', imgSrc: '/assets/images/agents/patty-aguilar.jpg' },
  { name: 'Deborah Trevino',            slug: 'deborah-trevino',            title: 'REALTOR®', imgSrc: '/assets/images/agents/deborah-trevino.jpg' },
  { name: 'Sarah Bautista',             slug: 'sarah-bautista',             title: 'REALTOR®', imgSrc: '/assets/images/agents/sarah-bautista.jpg' },
  { name: 'Piper Stein',                slug: 'piper-stein',                title: 'REALTOR®', imgSrc: '/assets/images/agents/piper-stein.jpg' },
  { name: 'Jason Wallace',              slug: 'jason-wallace',              title: 'REALTOR®', imgSrc: '/assets/images/agents/jason-wallace.jpg' },
  { name: 'Mariko Tortolero',           slug: 'mariko-tortolero',           title: 'REALTOR®', imgSrc: '/assets/images/agents/mariko-tortolero.png' },
  { name: 'Eric Hayman',                slug: 'eric-hayman',                title: 'REALTOR®', imgSrc: '/assets/images/agents/eric-hayman.jpg' },
  { name: 'Keith Agnello',              slug: 'keith-agnello',              title: 'REALTOR®', imgSrc: '/assets/images/agents/keith-agnello.jpg' },
  { name: 'Vanda Fernandes',            slug: 'vanda-fernandes',            title: 'REALTOR®', imgSrc: '/assets/images/agents/vanda-fernandes.jpg' },
  { name: 'Patty Samii',                slug: 'patty-samii',                title: 'REALTOR®', imgSrc: '/assets/images/agents/patty-samii.png' },
  { name: 'Robby Gmur',                 slug: 'robby-gmur',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/robby-gmur.jpg' },
  { name: 'Brandy Bell',                slug: 'brandy-bell',                title: 'REALTOR®', imgSrc: '/assets/images/agents/brandy-bell.jpg' },
  { name: 'Hervin Ugalde',              slug: 'hervin-ugalde',              title: 'REALTOR®', imgSrc: '/assets/images/agents/hervin-ugalde.jpg' },
  { name: 'Ivan Butrus',                slug: 'ivan-butrus',                title: 'REALTOR®', imgSrc: '/assets/images/agents/ivan-butrus.jpg' },
  { name: 'Anh Lam',                    slug: 'anh-lam',                    title: 'REALTOR®', imgSrc: '/assets/images/agents/anh-lam.jpg' },
  { name: 'Katya Schumaker',            slug: 'katya-schumaker',            title: 'REALTOR®', imgSrc: '/assets/images/agents/katya-schumaker.jpg' },
  { name: 'Meghan McNutt',              slug: 'meghan-mcnutt',              title: 'REALTOR®', imgSrc: '/assets/images/agents/meghan-mcnutt.jpg' },
  { name: 'Debbie Lawes',               slug: 'debbie-lawes',               title: 'REALTOR®', imgSrc: '/assets/images/agents/debbie-lawes.jpg' },
  { name: 'Martina Toma',               slug: 'martina-toma',               title: 'REALTOR®', imgSrc: '/assets/images/agents/martina-toma.jpg' },
  { name: 'Alexandra Polles',           slug: 'alexandra-polles',           title: 'REALTOR®', imgSrc: '/assets/images/agents/alexandra-polles.jpg' },
  { name: 'Fia Ierino',                 slug: 'fia-ierino',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/fia-ierino.jpg' },
  { name: 'Diana Beezley',              slug: 'diana-beezley',              title: 'REALTOR®', imgSrc: '/assets/images/agents/diana-beezley.jpg' },
  { name: 'Lyna Rawlings',              slug: 'lyna-rawlings',              title: 'REALTOR®', imgSrc: '/assets/images/agents/lyna-rawlings.jpg' },
  { name: 'Yvonne Mulgrew',             slug: 'yvonne-mulgrew',             title: 'REALTOR®', imgSrc: '/assets/images/agents/yvonne-mulgrew.jpg' },
  { name: 'Allison Asher',              slug: 'allison-asher',              title: 'REALTOR®', imgSrc: '/assets/images/agents/allison-asher.png' },
  { name: 'Alan Luken',                 slug: 'alan-luken',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/alan-luken.jpg' },
  { name: 'Delilah Bejarano Armendariz',slug: 'delilah-bejarano-armendariz',title: 'REALTOR®', imgSrc: '/assets/images/agents/delilah-bejarano-armendariz.jpg' },
  { name: 'Jaymie Santiago',            slug: 'jaymie-santiago',            title: 'REALTOR®', imgSrc: '/assets/images/agents/jaymie-santiago.png' },
  { name: 'Jodi Kirkwood',              slug: 'jodi-kirkwood',              title: 'REALTOR®', imgSrc: '/assets/images/agents/jodi-kirkwood.jpg' },
  { name: 'Marla Drexler',              slug: 'marla-drexler',              title: 'REALTOR®', imgSrc: '/assets/images/agents/marla-drexler.jpg' },
  { name: 'Lacy McFarland',             slug: 'lacy-mcfarland',             title: 'REALTOR®', imgSrc: '/assets/images/agents/lacy-mcfarland.jpeg' },
  { name: 'Renata Rios',                slug: 'renata-rios',                title: 'REALTOR®', imgSrc: '/assets/images/agents/renata-rios.jpg' },
  { name: 'Juanito So Jr.',             slug: 'juanito-so-jr',              title: 'REALTOR®', imgSrc: '/assets/images/agents/juanito-so-jr.jpeg' },
  { name: 'Kalen Esguerra',             slug: 'kalen-esguerra',             title: 'REALTOR®', imgSrc: '/assets/images/agents/kalen-esguerra.jpg' },
  { name: 'Debbie No',                  slug: 'debbie-no',                  title: 'REALTOR®', imgSrc: '/assets/images/agents/debbie-no.jpg' },
  { name: 'Chip Morgan',                slug: 'chip-morgan',                title: 'REALTOR®', imgSrc: '/assets/images/agents/chip-morgan.jpg' },
  { name: 'Daniel Kappler',             slug: 'daniel-kappler',             title: 'REALTOR®', imgSrc: '/assets/images/agents/daniel-kappler.jpg' },
  { name: 'Diane Van Korlaar',          slug: 'diane-van-korlaar',          title: 'REALTOR®', imgSrc: '/assets/images/agents/diane-van-korlaar.jpg' },
  { name: 'Ryan Stein',                 slug: 'ryan-stein',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/ryan-stein.jpg' },
  { name: 'Brandon Le',                 slug: 'brandon-le',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/brandon-le.jpg' },
  { name: 'Zach Campbell',              slug: 'zach-campbell',              title: 'REALTOR®', imgSrc: '/assets/images/agents/zach-campbell.jpg' },
  { name: 'Aubrey Foulk',               slug: 'aubrey-foulk',               title: 'REALTOR®', imgSrc: '/assets/images/agents/aubrey-foulk.jpeg' },
  { name: 'Jeremy McHone',              slug: 'jeremy-mchone',              title: 'REALTOR®', imgSrc: '/assets/images/agents/jeremy-mchone.png' },
  { name: 'Laura Pachlin',              slug: 'laura-pachlin',              title: 'REALTOR®', imgSrc: '/assets/images/agents/laura-pachlin.jpg' },
  { name: 'Samuel Minero',              slug: 'samuel-minero',              title: 'REALTOR®', imgSrc: '/assets/images/agents/samuel-minero.jpeg' },
  { name: 'Jim Stengel',                slug: 'jim-stengel',                title: 'REALTOR®', imgSrc: '/assets/images/agents/jim-stengel.jpg' },
  { name: 'Brandon Khieu',              slug: 'brandon-khieu',              title: 'REALTOR®', imgSrc: '/assets/images/agents/brandon-khieu.jpg' },
  { name: 'Mona Hassan',                slug: 'mona-hassan',                title: 'REALTOR®', imgSrc: '/assets/images/agents/mona-hassan.jpg' },
  { name: 'Kirsten Blessum',            slug: 'kirsten-blessum',            title: 'REALTOR®', imgSrc: '/assets/images/agents/kirsten-blessum.jpg' },
  { name: 'Wally Dally',                slug: 'wally-dally',                title: 'REALTOR®', imgSrc: '/assets/images/agents/wally-dally.png' },
  { name: 'Devyn Iglehart',             slug: 'devyn-iglehart',             title: 'REALTOR®', imgSrc: '/assets/images/agents/devyn-iglehart.jpg' },
  { name: 'Chris Nguyen',               slug: 'chris-nguyen',               title: 'REALTOR®', imgSrc: '/assets/images/agents/chris-nguyen.jpg' },
  { name: 'Jared Lawrence',             slug: 'jared-lawrence',             title: 'REALTOR®', imgSrc: '/assets/images/agents/jared-lawrence.jpg' },
  { name: 'Jonathan Cohen-Kurzrock',    slug: 'jonathan-cohen-kurzrock',    title: 'REALTOR®', imgSrc: '/assets/images/agents/jonathan-cohen-kurzrock.png' },
  { name: 'Chittra Cruz',               slug: 'chittra-cruz',               title: 'REALTOR®', imgSrc: '/assets/images/agents/chittra-cruz.jpeg' },
  { name: 'Kelsey Barry Farnsworth',    slug: 'kelsey-barry-farnsworth',    title: 'REALTOR®', imgSrc: '/assets/images/agents/kelsey-barry-farnsworth.jpg' },
  { name: 'Edelia Eveland',             slug: 'edelia-eveland',             title: 'REALTOR®', imgSrc: '/assets/images/agents/edelia-eveland.png' },
  { name: 'Sabrina Alvarado',           slug: 'sabrina-alvarado',           title: 'REALTOR®', imgSrc: '/assets/images/agents/sabrina-alvarado.jpg' },
  { name: 'Andrew Lopez',               slug: 'andrew-lopez',               title: 'REALTOR®', imgSrc: '/assets/images/agents/andrew-lopez.jpg' },
  { name: 'Taylor Schunk',              slug: 'taylor-schunk',              title: 'REALTOR®', imgSrc: '/assets/images/agents/taylor-schunk.jpg' },
  { name: 'Louis Goletto',              slug: 'louis-goletto',              title: 'REALTOR®', imgSrc: '/assets/images/agents/louis-goletto.png' },
  { name: 'Atzay Estrada',              slug: 'atzay-estrada',              title: 'REALTOR®', imgSrc: '/assets/images/agents/atzay-estrada.jpg' },
  { name: 'Cynthia Mayorga',            slug: 'cynthia-mayorga',            title: 'REALTOR®', imgSrc: '/assets/images/agents/cynthia-mayorga.png' },
  { name: "Casie O'Donnell",            slug: 'casie-o-donnell',            title: 'REALTOR®', imgSrc: "/assets/images/agents/casie-o-donnell.jpg" },
  { name: 'Sergio Yturralde',           slug: 'sergio-yturralde',           title: 'REALTOR®', imgSrc: '/assets/images/agents/sergio-yturralde.jpg' },
  { name: 'Melissa Campos',             slug: 'melissa-campos',             title: 'REALTOR®', imgSrc: '/assets/images/agents/melissa-campos.jpg' },
  { name: 'Emma Dearing',               slug: 'emma-dearing',               title: 'REALTOR®', imgSrc: '/assets/images/agents/emma-dearing.jpg' },
  { name: 'Tristen Campanella',         slug: 'tristen-campanella',         title: 'REALTOR®', imgSrc: '/assets/images/agents/tristen-campanella.png' },
  { name: 'Rachel Ohara',               slug: 'rachel-ohara',               title: 'REALTOR®', imgSrc: '/assets/images/agents/rachel-ohara.png' },
  { name: 'Jennifer Crosby',            slug: 'jennifer-crosby',            title: 'REALTOR®', imgSrc: '/assets/images/agents/jennifer-crosby.jpg' },
  { name: 'Glennis Dawson',             slug: 'glennis-dawson',             title: 'REALTOR®', imgSrc: '/assets/images/agents/glennis-dawson.jpg' },
  { name: 'Gina Romeo',                 slug: 'gina-romeo',                 title: 'REALTOR®', imgSrc: '/assets/images/agents/gina-romeo.jpg' },
  { name: 'Corinne Mauro',              slug: 'corinne-mauro',              title: 'REALTOR®', imgSrc: '/assets/images/agents/corinne-mauro.jpg' },
  { name: 'Jules Marchisio',            slug: 'jules-marchisio',            title: 'REALTOR®', imgSrc: '/assets/images/agents/jules-marchisio.jpg' },
  { name: 'Greg Lathem',                slug: 'greg-lathem',                title: 'REALTOR®', imgSrc: '/assets/images/agents/greg-lathem.jpeg' },
  { name: 'James McNab',                slug: 'james-mcnab',                title: 'REALTOR®', imgSrc: '/assets/images/agents/james-mcnab.jpeg' },
  { name: 'Jarrod Norris',              slug: 'jarrod-norris',              title: 'REALTOR®', imgSrc: '/assets/images/agents/jarrod-norris.jpg' },
  { name: 'Hannah Ohman',               slug: 'hannah-ohman',               title: 'REALTOR®', imgSrc: '/assets/images/agents/hannah-ohman.png' },
  { name: 'Katie Lussier',              slug: 'katie-lussier',              title: 'REALTOR®', imgSrc: '/assets/images/agents/katie-lussier.jpg' },
  { name: 'John Verdin',                slug: 'john-verdin',                title: 'REALTOR®', imgSrc: '/assets/images/agents/john-verdin.jpg' },
]

function agentEmail(slug: string): string {
  const first = slug.split('-')[0]
  return `${first}@palisaderealty.com`
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ALL_AGENTS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const agent = ALL_AGENTS.find((a) => a.slug === slug)
  if (!agent) return { title: 'Agent Not Found' }
  return {
    title: `${agent.name} — ${agent.title}`,
    description: `${agent.name} is a ${agent.title} with Palisade Realty serving San Diego County. Call (619) 794-0218.`,
  }
}

const RELATED_SLUGS = ['hedda-parashos', 'tom-parashos', 'britney-bartlett', 'melissa-maxwell']

export const revalidate = 3600

type FeaturedListing = {
  _id: string
  title: string | null
  price: number | null
  street: string | null
  city: string | null
  state: string | null
  bedrooms: number | null
  bathrooms: number | null
  squareFootage: number | null
  mainImageUrl: string | null
  listingUrl: string | null
  status: string | null
  active: boolean | null
  displayOrder: number | null
}

async function fetchAgentListings(slug: string): Promise<FeaturedListing[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_TOKEN
  if (!projectId || !token) return []
  try {
    const groq = `*[_type == "teamMember" && slug.current == "${slug}" && active != false][0]{
      "featuredListings": featuredListings[]->{
        _id, title, price,
        "street": address.street, "city": address.city, "state": address.state,
        bedrooms, bathrooms, squareFootage,
        "mainImageUrl": mainImage.asset->url,
        listingUrl, status, active, displayOrder
      }
    }`
    const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(groq)}`
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    })
    if (!r.ok) return []
    const d = await r.json()
    const listings: FeaturedListing[] = Array.isArray(d.result?.featuredListings) ? d.result.featuredListings : []
    return listings
      .filter((l) => l.active !== false)
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
  } catch {
    return []
  }
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params
  const agent = ALL_AGENTS.find((a) => a.slug === slug)
  if (!agent) notFound()

  const email = agentEmail(slug)
  const firstName = agent.name.split(' ')[0]
  const FB_AGENT = 'https://placehold.co/300x400/58172a/ffffff?text=Palisade+Agent'

  const relatedAgents = ALL_AGENTS.filter(
    (a) => RELATED_SLUGS.includes(a.slug) && a.slug !== slug
  ).slice(0, 4)

  const featuredListings = await fetchAgentListings(slug)

  return (
    <>
      <Script src="https://search.palisaderealty.com/build/js/widgets-1.0.0.js" strategy="afterInteractive" />
      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        className="ap-hero"
        style={{
          background: 'var(--brand-darker,#28000c)',
          padding: '80px var(--pad-x,60px) 72px',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label={`${agent.name}, ${agent.title}`}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 0% 100%, rgba(88,23,42,.55) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(238,202,0,.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1320px', margin: '0 auto' }}>
          <nav style={{ marginBottom: '48px' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.45)', textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}>Palisade Realty</Link>
            <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 8px' }}>/</span>
            <Link href="/team" style={{ color: 'rgba(255,255,255,.45)', textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}>Our Team</Link>
            <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 8px' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,.7)', fontSize: '12px', fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}>{agent.name}</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px,9.5vw,110px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, margin: '0 0 16px' }}>
            <em style={{ fontStyle: 'italic', color: 'var(--accent,#eeca00)' }}>{firstName}</em> {agent.name.slice(firstName.length + 1)}
          </h1>
          <div style={{ width: '52px', height: '3px', background: 'var(--gold,#b89a5e)', marginBottom: '18px' }} />
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '36px' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '13px', color: 'rgba(255,255,255,.75)', letterSpacing: '0.06em' }}>{agent.title}</span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,.35)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '13px', color: 'rgba(255,255,255,.75)', letterSpacing: '0.06em' }}>Palisade Realty</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="tel:+16197940218" className="ap-hero-btn ap-hero-btn--ghost">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.83 5.83l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call (619) 794-0218
            </a>
            <a href={`mailto:${email}`} className="ap-hero-btn ap-hero-btn--ghost">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7 10-7" />
              </svg>
              Send an Email
            </a>
            <a href="https://search.palisaderealty.com/" target="_blank" rel="noopener noreferrer" className="ap-hero-btn ap-hero-btn--gold">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              View Listings
            </a>
          </div>
        </div>
      </section>

      {/* ── BIO ─────────────────────────────────────────────── */}
      <section id="about" className="ap-bio" style={{ background: '#fff', padding: '96px var(--pad-x,60px)' }} aria-labelledby="bio-heading">
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr 296px', gap: '64px', alignItems: 'start' }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={agent.imgSrc}
              alt={`${agent.name}, ${agent.title} at Palisade Realty`}
              style={{ width: '240px', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'center top', borderRadius: '4px', boxShadow: '0 20px 60px rgba(88,23,42,.2), 0 4px 16px rgba(0,0,0,.08)', display: 'block' }}
              loading="eager"
              onError={undefined}
            />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', marginBottom: '10px' }}>Agent</p>
            <h2 id="bio-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', lineHeight: 1.18, margin: '0 0 24px' }}>
              Meet <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{firstName}</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#555', lineHeight: 1.8, marginBottom: '16px' }}>
              As a {agent.title} with Palisade Realty, I am dedicated to delivering exceptional results for clients throughout San Diego County. With the support of one of the region&apos;s most trusted brokerages and access to deep local market knowledge, I guide buyers and sellers through every step of the real estate process.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#555', lineHeight: 1.8 }}>
              From your first consultation to closing day, my priority is clear communication, honest advice, and results you can count on. Whether you are purchasing your first home, making an investment, or selling a treasured property, I am here to make the process as smooth and successful as possible.
            </p>
          </div>
          <div style={{ position: 'sticky', top: '96px', background: 'var(--off-white,#faf7f2)', borderRadius: '4px', padding: '28px 24px' }}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '20px' }}>Get in Touch</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--brand,#58172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.83 5.83l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <div>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Phone</p>
                <a href="tel:+16197940218" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--near-black,#1a0a0a)', textDecoration: 'none' }}>(619) 794-0218</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--brand,#58172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
              </span>
              <div>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Email</p>
                <a href={`mailto:${email}`} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--brand,#58172a)', textDecoration: 'none', wordBreak: 'break-all' }}>{email}</a>
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e0da', margin: '0 0 20px' }} />
            <a href="#contact" className="btn btn-brand" style={{ display: 'block', textAlign: 'center', marginBottom: '10px' }}>Send a Message</a>
            <a href={`https://${slug.split('-')[0]}.palisaderealty.com/seller`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-brand" style={{ display: 'block', textAlign: 'center' }}>
              Get a Home Valuation
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ──────────────────────────────── */}
      <section style={{ background: '#fff', padding: '88px var(--pad-x,60px)' }} aria-labelledby="fl-heading">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--brand,#58172a)' }}>Featured Listings</p>
          <h2 id="fl-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: '8px 0 40px' }}>
            {firstName}&apos;s <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Properties</em>
          </h2>
          {featuredListings.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {featuredListings.map((listing) => (
                <article key={listing._id} style={{ background: '#fff', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(88,23,42,.1), 0 1px 6px rgba(0,0,0,.06)', display: 'flex', flexDirection: 'column', border: '1px solid #f0ebe4' }}>
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#1a0a0a', flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={listing.mainImageUrl || 'https://placehold.co/600x400/58172a/ffffff?text=Palisade+Realty'}
                      alt={listing.title || 'Property listing'}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {listing.status && (
                      <span style={{ position: 'absolute', top: '12px', left: '12px', background: listing.status === 'sold' ? '#555' : listing.status === 'pending' ? '#c17c2c' : 'var(--brand,#58172a)', color: '#fff', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '3px' }}>
                        {listing.status}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', marginBottom: '6px' }}>
                      {listing.price ? `$${listing.price.toLocaleString()}` : 'Price on Request'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#777', marginBottom: '14px', lineHeight: 1.4 }}>
                      {[listing.street, listing.city, listing.state].filter(Boolean).join(', ')}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-label)', fontSize: '12px', color: '#888', letterSpacing: '0.04em', marginBottom: '20px', flexWrap: 'wrap' }}>
                      {listing.bedrooms != null && <span>{listing.bedrooms} bd</span>}
                      {listing.bathrooms != null && <span>{listing.bathrooms} ba</span>}
                      {listing.squareFootage != null && <span>{listing.squareFootage.toLocaleString()} sqft</span>}
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <a
                        href={listing.listingUrl || 'https://search.palisaderealty.com/'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-brand"
                        style={{ display: 'block', textAlign: 'center' }}
                      >
                        View Property
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--off-white,#faf7f2)', borderRadius: '8px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#888', marginBottom: '24px' }}>
                No active listings are currently available for this agent.
              </p>
              <a href="/properties" className="btn btn-brand">View Featured Properties</a>
            </div>
          )}
        </div>
      </section>

      {/* ── ALL LISTINGS (YLOPO) ─────────────────────────────── */}
      <section style={{ background: 'var(--off-white,#faf7f2)', padding: '88px var(--pad-x,60px)' }} aria-labelledby="listings-heading">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--brand,#58172a)' }}>Palisade Realty</p>
          <h2 id="listings-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: '8px 0 12px' }}>
            All <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Listings</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#777', marginBottom: '40px' }}>
            Browse current properties available across San Diego County.
          </p>
          <div
            className="YLOPO_resultsWidget"
            data-search={JSON.stringify({
              locations: [
                { city: 'San Diego', state: 'CA' },
                { city: 'La Jolla', state: 'CA' },
                { city: 'Coronado', state: 'CA' },
                { city: 'Encinitas', state: 'CA' },
                { city: 'Carlsbad', state: 'CA' },
              ],
            })}
          />
        </div>
      </section>

      {/* ── CONTACT FORM ────────────────────────────────────── */}
      <section id="contact" style={{ background: '#fff', padding: '88px var(--pad-x,60px)' }} aria-labelledby="contact-heading">
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--brand,#58172a)' }}>Direct Contact</p>
            <h2 id="contact-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: '10px 0 18px' }}>
              <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Contact</em> {firstName}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              Ready to buy, sell, or just explore your options? I&apos;m here to guide you with honest advice, deep market knowledge, and a commitment to results at every step of the process.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: 'phone', text: '(619) 794-0218', href: 'tel:+16197940218' },
                { icon: 'email', text: email, href: `mailto:${email}` },
                { icon: 'location', text: '3434 Grove Street, Lemon Grove, CA 91945', href: undefined },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--off-white,#faf7f2)', border: '1.5px solid #e5e0da', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon === 'phone' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand,#58172a)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.83 5.83l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>}
                    {item.icon === 'email' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand,#58172a)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" /></svg>}
                    {item.icon === 'location' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand,#58172a)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0 1 14 0c0 5-7 12.5-7 12.5z" /><circle cx="12" cy="8.5" r="2.5" /></svg>}
                  </span>
                  {item.href
                    ? <a href={item.href} style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500, color: 'var(--near-black,#1a0a0a)', textDecoration: 'none' }}>{item.text}</a>
                    : <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#666' }}>{item.text}</span>
                  }
                </div>
              ))}
            </div>
          </div>
          <AgentContactForm agentName={agent.name} agentEmail={email} />
        </div>
      </section>

      {/* ── RELATED AGENTS ──────────────────────────────────── */}
      <section style={{ background: 'var(--off-white,#faf7f2)', padding: '88px var(--pad-x,60px)' }} aria-labelledby="related-heading">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--brand,#58172a)' }}>The Team</p>
          <h2 id="related-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.02em', margin: '8px 0 40px' }}>
            Meet More of Our <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>Agents</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '40px' }}>
            {relatedAgents.map((a) => (
              <article key={a.slug} className={`agent-card${a.isLeader ? ' agent-card--leader' : ''}`}>
                <div className="agent-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="agent-card-img" src={a.imgSrc} alt={a.name} loading="lazy" width={300} height={400} />
                </div>
                <div className="agent-card-body">
                  <div className="agent-card-name">{a.name}</div>
                  <div className="agent-card-role">{a.title}</div>
                  <Link href={`/team/${a.slug}`} className="agent-card-link">View Profile →</Link>
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/team" className="btn btn-outline-brand">View All Agents</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="tp-cta" aria-labelledby="agent-cta-heading">
        <div className="tp-wrap">
          <h2 className="tp-cta-heading" id="agent-cta-heading">
            <em>Let&rsquo;s Find</em> Your Dream Home
          </h2>
          <p className="tp-cta-sub">
            {firstName} is ready to guide you — whether you are buying, selling, or exploring your
            options. Reach out today for a no-pressure conversation.
          </p>
          <div className="tp-cta-btns">
            <a href="#contact" className="btn btn-brand">Contact {firstName}</a>
            <a href="https://search.palisaderealty.com/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-white">
              Search Properties
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

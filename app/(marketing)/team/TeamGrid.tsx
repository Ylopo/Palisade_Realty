'use client'

import { useState } from 'react'

interface AgentEntry {
  name: string
  slug: string
  imgSrc: string
  title: string
}

const SQ = 'https://images.squarespace-cdn.com/content/v1/5b6d00a59d5abbcae48fad24/'

function imgSrc(squarespaceId: string, slug: string): string {
  const ext = squarespaceId.split('.').pop()?.toLowerCase() ?? 'jpg'
  const normalExt = ext === 'jpeg' ? 'jpeg' : ext === 'png' ? 'png' : 'jpg'
  return `/assets/images/agents/${slug}.${normalExt}`
}

const LEADERSHIP: AgentEntry[] = [
  { name: 'Hedda Parashos',        slug: 'hedda-parashos',              title: 'CEO',                           imgSrc: '/assets/images/agents/hedda-parashos.jpg' },
  { name: 'Tom Parashos',          slug: 'tom-parashos',                title: 'Broker',                        imgSrc: '/assets/images/agents/tom-parashos.jpg' },
  { name: 'Britney Bartlett',      slug: 'britney-bartlett',            title: 'Director of Operations',        imgSrc: '/assets/images/agents/britney-bartlett.jpg' },
  { name: 'Michael DiVita',        slug: 'michael-divita',              title: 'Database and Onboarding Manager', imgSrc: '/assets/images/agents/michael-divita.jpg' },
  { name: 'Michael Guzman',        slug: 'michael-guzman',              title: 'REALTOR®',                      imgSrc: '/assets/images/agents/michael-guzman.jpg' },
  { name: 'Nicole Ward',           slug: 'nicole-ward',                 title: 'Risk Manager',                  imgSrc: '/assets/images/agents/nicole-ward.png' },
  { name: 'Danielle Patterson',    slug: 'danielle-patterson',          title: 'Transaction Coordinator',       imgSrc: '/assets/images/agents/danielle-patterson.jpg' },
  { name: 'Lisa Florendo',         slug: 'lisa-florendo',               title: 'Transaction Coordinator',       imgSrc: '/assets/images/agents/lisa-florendo.png' },
  { name: 'Kelly Chan',            slug: 'kelly-chan',                   title: 'Database Assistant',            imgSrc: '/assets/images/agents/kelly-chan.jpg' },
  { name: 'Fermin Perez',          slug: 'fermin-perez',                title: 'Transaction Coordinator',       imgSrc: '/assets/images/agents/fermin-perez.jpg' },
]

const AGENTS: AgentEntry[] = [
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

const FB_AGENT = 'https://placehold.co/300x400/58172a/ffffff?text=Palisade+Agent'

function AgentCard({ agent, isLeader = false }: { agent: AgentEntry; isLeader?: boolean }) {
  return (
    <article className={`agent-card${isLeader ? ' agent-card--leader' : ''}`} data-name={agent.name.toLowerCase()}>
      <div className="agent-card-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="agent-card-img"
          src={agent.imgSrc}
          alt={`${agent.name}, ${agent.title} at Palisade Realty`}
          loading="lazy"
          width={300}
          height={400}
          onError={(e) => { (e.target as HTMLImageElement).src = FB_AGENT }}
        />
      </div>
      <div className="agent-card-body">
        <div className="agent-card-name">{agent.name}</div>
        <div className="agent-card-role">{agent.title}</div>
        <a href={`/team/${agent.slug}`} className="agent-card-link" aria-label={`View ${agent.name}'s profile`}>
          View Profile
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6h7m-3.5-3.5L9 6 6 9.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </article>
  )
}

export default function TeamGrid() {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = q
    ? AGENTS.filter((a) => a.name.toLowerCase().includes(q))
    : AGENTS

  return (
    <>
      {/* ── LEADERSHIP GRID ─────────────────────────────────── */}
      <section className="tp-section tp-section--off" aria-labelledby="leadership-heading">
        <div className="tp-wrap">
          <div className="tp-sec-header">
            <p className="tp-sec-tag">Management &amp; Staff</p>
            <h2 className="tp-sec-h2" id="leadership-heading">The <em>Leadership</em> Behind Palisade</h2>
          </div>
          <div className="tp-leadership-grid" role="list">
            {LEADERSHIP.map((a) => (
              <div key={a.slug} role="listitem">
                <AgentCard agent={a} isLeader />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL AGENTS ──────────────────────────────────────── */}
      <section className="tp-section" aria-labelledby="agents-heading">
        <div className="tp-wrap">
          <div className="tp-sec-header">
            <p className="tp-sec-tag">Licensed Real Estate Professionals</p>
            <h2 className="tp-sec-h2" id="agents-heading">Meet Our <em>Real Estate</em> Advisors</h2>
          </div>
          <div className="tp-search-wrap" role="search">
            <input
              id="agents-search"
              className="tp-search"
              type="search"
              placeholder="Search agents by name…"
              aria-label="Search agents by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg className="tp-search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth={1.4} />
              <path d="m12.5 12.5 3 3" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
            </svg>
          </div>
          {filtered.length === 0 ? (
            <p className="tp-no-result visible" role="status">No agents found matching &ldquo;{query}&rdquo;.</p>
          ) : (
            <div className="tp-agents-grid" id="agents-grid" role="list" aria-live="polite">
              {filtered.map((a) => (
                <div key={a.slug} role="listitem">
                  <AgentCard agent={a} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

'use client'

import { useState } from 'react'
import { LEADERSHIP, AGENTS, type AgentEntry } from '@/lib/agents'

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

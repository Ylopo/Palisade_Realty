'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'

const COMMUNITIES = [
  { name: 'Downtown San Diego', slug: 'downtown-san-diego-real-estate' },
  { name: 'Mission Hills', slug: 'mission-hills-real-estate' },
  { name: 'Point Loma', slug: 'point-loma-real-estate' },
  { name: 'Coronado', slug: 'coronado-real-estate' },
  { name: 'Pacific & Mission Beach', slug: 'pacific-mission-beach-real-estate' },
  { name: 'Mission Valley', slug: 'mission-valley-real-estate' },
  { name: 'La Jolla', slug: 'la-jolla-real-estate' },
  { name: 'Del Mar', slug: 'del-mar-real-estate' },
  { name: 'Carmel Valley', slug: 'carmel-valley-real-estate' },
  { name: 'Rancho Santa Fe', slug: 'rancho-santa-fe-real-estate' },
  { name: 'Solana Beach', slug: 'solana-beach-real-estate' },
  { name: 'Encinitas', slug: 'encinitas-real-estate' },
  { name: 'Carlsbad', slug: 'carlsbad-real-estate' },
  { name: 'Oceanside', slug: 'oceanside-real-estate' },
  { name: 'Spring Valley', slug: 'spring-valley-real-estate' },
  { name: 'Chula Vista', slug: 'chula-vista-real-estate' },
  { name: 'La Mesa', slug: 'la-mesa-real-estate' },
  { name: 'El Cajon', slug: 'el-cajon-real-estate' },
]

export default function SiteHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileCommOpen, setMobileCommOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openDropdown = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setDropdownOpen(true)
  }, [])

  const closeDropdown = useCallback(() => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120)
  }, [])

  // Sync React state → body.nav-open so homepage.css selectors work
  useEffect(() => {
    document.body.classList.toggle('nav-open', mobileOpen)
    return () => { document.body.classList.remove('nav-open') }
  }, [mobileOpen])

  // Add/remove .scrolled on the header element (matches homepage.js initNavScroll)
  useEffect(() => {
    const header = document.getElementById('site-header')
    if (!header) return
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMobile = () => {
    setMobileOpen((v) => {
      if (v) setMobileCommOpen(false)
      return !v
    })
  }

  return (
    <>
      <header className="site-header" id="site-header">
        {/* Left Nav */}
        <nav className="nav-links" aria-label="Primary navigation left">
          <a href="https://search.palisaderealty.com/" target="_blank" rel="noopener noreferrer">Buy</a>
          <a href="https://search.palisaderealty.com/seller" target="_blank" rel="noopener noreferrer">Sell</a>

          <div
            className={`nav-dropdown${dropdownOpen ? ' is-open' : ''}`}
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <Link
              href="/communities"
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onFocus={openDropdown}
              onBlur={(e) => {
                const dd = e.currentTarget.closest('.nav-dropdown')
                if (!dd?.contains(e.relatedTarget as Node)) closeDropdown()
              }}
            >
              Communities
              <svg className="nav-dropdown-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3.5 5 6.5 8 3.5" />
              </svg>
            </Link>
            <div className="nav-dropdown-panel" role="region" aria-label="Communities menu">
              <span className="nav-dropdown-label">San Diego Communities</span>
              <div className="nav-dropdown-grid">
                {COMMUNITIES.map((c) => (
                  <Link key={c.slug} className="nav-dropdown-item" href={`/communities/${c.slug}`}>
                    <span className="nav-dropdown-dot" />
                    {c.name}
                  </Link>
                ))}
              </div>
              <div className="nav-dropdown-divider" />
              <div className="nav-dropdown-all">
                <Link href="/communities">
                  View All Communities{' '}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 6h8" /><path d="M6 2.5 9.5 6 6 9.5" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <Link href="/testimonials">Testimonials</Link>
        </nav>

        {/* Center Logo */}
        <Link href="/" className="nav-logo" aria-label="Palisade Realty home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Palisade Realty" />
        </Link>

        {/* Right Nav */}
        <nav className="nav-links nav-links--right" aria-label="Primary navigation right">
          <Link href="/properties">Properties</Link>
          <Link href="/team">Team</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
          <button className="lang-toggle" id="lang-toggle" aria-label="Switch language / Cambiar idioma">
            <span className="lang-en lang-active">EN</span>
            <span className="lang-sep">|</span>
            <span className="lang-es">ES</span>
          </button>
        </nav>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          id="nav-hamburger"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          onClick={toggleMobile}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile nav drawer */}
      <div
        className="nav-mobile-drawer"
        id="nav-mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <a href="https://search.palisaderealty.com/" target="_blank" rel="noopener noreferrer">Buy</a>
        <a href="https://search.palisaderealty.com/seller" target="_blank" rel="noopener noreferrer">Sell</a>
        <button
          className="mobile-communities-toggle"
          id="mobile-communities-toggle"
          aria-expanded={mobileCommOpen}
          onClick={() => setMobileCommOpen((v) => !v)}
        >
          Communities ▾
        </button>
        <div className={`mobile-communities-list${mobileCommOpen ? ' open' : ''}`} id="mobile-communities-list">
          {COMMUNITIES.map((c) => (
            <Link key={c.slug} href={`/communities/${c.slug}`} onClick={toggleMobile}>
              {c.name}
            </Link>
          ))}
        </div>
        <Link href="/testimonials" onClick={toggleMobile}>Testimonials</Link>
        <Link href="/properties" onClick={toggleMobile}>Properties</Link>
        <Link href="/team" onClick={toggleMobile}>Team</Link>
        <Link href="/blog" onClick={toggleMobile}>Blog</Link>
        <Link href="/contact" onClick={toggleMobile}>Contact</Link>
      </div>
    </>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

// ~9 lines at 16px / 1.7 line-height
const COLLAPSED_PX = 240

export default function AboutBio({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [needsToggle, setNeedsToggle] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    // scrollHeight returns the full content height regardless of max-height
    setNeedsToggle(el.scrollHeight > COLLAPSED_PX + 20)
  }, [])

  function handleToggle() {
    const el = wrapRef.current
    if (!el) return
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!expanded) {
      // Expand: animate from COLLAPSED_PX to full height, then set to 'none'
      if (instant) {
        el.style.maxHeight = 'none'
      } else {
        el.style.maxHeight = `${el.scrollHeight}px`
        el.addEventListener(
          'transitionend',
          () => { el.style.maxHeight = 'none' },
          { once: true }
        )
      }
      setExpanded(true)
    } else {
      // Collapse: pin current height, force reflow, then animate down
      if (instant) {
        el.style.maxHeight = ''  // CSS class takes over at COLLAPSED_PX
      } else {
        const full = el.scrollHeight
        el.style.maxHeight = `${full}px`
        void el.getBoundingClientRect()
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.maxHeight = `${COLLAPSED_PX}px`
            el.addEventListener(
              'transitionend',
              () => { el.style.maxHeight = '' }, // hand back to CSS
              { once: true }
            )
          })
        })
      }
      setExpanded(false)
    }
  }

  return (
    <div className="about-bio reveal stagger-2">
      <div
        ref={wrapRef}
        id="about-bio-content"
        className="about-bio-content"
        aria-live="polite"
      >
        {/* lang.js targets .about-bio-inner to swap EN/ES paragraphs */}
        <div className="about-bio-inner">
          {children}
        </div>

        {/* Bottom fade — hidden once expanded */}
        {needsToggle && (
          <div
            className="about-bio-fade"
            aria-hidden="true"
            style={{ opacity: expanded ? 0 : 1 }}
          />
        )}
      </div>

      {needsToggle && (
        <button
          className="about-bio-toggle"
          onClick={handleToggle}
          aria-expanded={expanded}
          aria-controls="about-bio-content"
        >
          <span>{expanded ? 'See Less' : 'See More'}</span>
          <span
            className="about-bio-toggle-arrow"
            aria-hidden="true"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ↓
          </span>
        </button>
      )}
    </div>
  )
}

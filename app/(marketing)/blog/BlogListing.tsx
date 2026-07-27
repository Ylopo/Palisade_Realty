'use client'

import { useState } from 'react'
import { STATIC_POSTS } from '@/lib/blog/static-posts'

export interface Post {
  s: string   // slug
  t: string   // title
  c: string   // category
  d: string   // display date
  iso: string
  x: string   // excerpt
  img?: string // cover image URL (optional — Sanity posts may have one)
}

interface Props {
  posts?: Post[]
}

const POSTS: Post[] = STATIC_POSTS

const BADGE_MAP: Record<string, string> = {
  Buyer: 'Buyer', Seller: 'Seller', Homeowner: 'Homeowner',
  General: 'General', 'New Homeowner': 'NewHomeowner', Parents: 'Parents',
}
const FB_IMG = 'https://placehold.co/800x533/58172a/eeca00?text=Palisade+Realty'
const PER_PAGE = 15
const CATEGORIES = ['All Posts', 'Buyer', 'Seller', 'Homeowner', 'General']

export default function BlogListing({ posts: externalPosts }: Props) {
  const [cat, setCat] = useState('all')
  const [page, setPage] = useState(1)

  const allPosts = externalPosts && externalPosts.length > 0 ? externalPosts : POSTS
  const filtered = cat === 'all' ? allPosts : allPosts.filter((p) => p.c === cat)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const pagePosts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)



  function handleCat(newCat: string) {
    setCat(newCat)
    setPage(1)
  }

  function handlePage(n: number) {
    setPage(n)
    document.querySelector('.blog-listing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="blog-listing" aria-label="Blog articles">
      <div className="blog-filter" role="group" aria-label="Filter posts by category">
        {CATEGORIES.map((label) => {
          const key = label === 'All Posts' ? 'all' : label
          return (
            <button
              key={key}
              className={`bf-tab${cat === key ? ' active' : ''}`}
              data-cat={key}
              onClick={() => handleCat(key)}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="blog-grid" id="blog-grid" role="list" aria-live="polite" aria-label="Blog posts">
        {pagePosts.length === 0 ? (
          <p className="blog-no-results">No posts found in this category.</p>
        ) : (
          pagePosts.map((p) => {
            const badgeKey = BADGE_MAP[p.c] || 'default'
            return (
              <article key={p.s} className="bc reveal" role="listitem" data-cat={p.c}>
                <a href={`/blog/${p.s}`} className="bc-link" aria-label={p.t}>
                  <div className="bc-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img ?? `/images/blog/${p.s}.jpg`}
                      alt={p.t}
                      loading="lazy"
                      width={800}
                      height={533}
                      onError={(e) => { (e.target as HTMLImageElement).src = FB_IMG }}
                    />
                  </div>
                  <div className="bc-body">
                    <div className="bc-meta">
                      {p.c && <span className={`bc-badge bc-badge--${badgeKey}`}>{p.c}</span>}
                      <time className="bc-date" dateTime={p.iso}>{p.d}</time>
                    </div>
                    <h2 className="bc-title">{p.t}</h2>
                    <p className="bc-excerpt">{p.x}</p>
                    <span className="bc-read-more" aria-hidden="true">Read More →</span>
                  </div>
                </a>
              </article>
            )
          })
        )}
      </div>

      {totalPages > 1 && (
        <nav className="blog-pagination" id="blog-pagination" aria-label="Blog pagination">
          <button
            className="bp-btn bp-arrow"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => handlePage(page - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`bp-btn${n === page ? ' active' : ''}`}
              aria-label={`Page ${n}`}
              aria-current={n === page ? 'page' : undefined}
              onClick={() => handlePage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="bp-btn bp-arrow"
            aria-label="Next page"
            disabled={page === totalPages}
            onClick={() => handlePage(page + 1)}
          >
            ›
          </button>
          <span className="bp-info">Page {page} of {totalPages}</span>
        </nav>
      )}
    </section>
  )
}

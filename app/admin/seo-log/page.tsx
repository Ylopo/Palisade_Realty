import { Fragment } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AdminNav } from '@/components/AdminNav'
import { client } from '@/lib/sanity/client'
import { ALL_POSTS_QUERY } from '@/lib/sanity/queries'
import { AEO_PAGES, COMMUNITY_PAGES, type SeoPageType } from '@/lib/seo-pages-manifest'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ secret?: string; page?: string }> }

const PAGE_SIZE = 100

const BASE = 'https://www.palisaderealty.com'
const BRAND = '#58172a'

interface SanityPostRow {
  title: string
  slug: string
  category?: string
  publishedAt?: string
}

type Row = {
  type: SeoPageType
  title: string
  url: string       // site-relative
  detail: string
  date?: string     // ISO, blogs only
}

const TAGS: Record<SeoPageType, { label: string; bg: string; text: string; border: string }> = {
  aeo:       { label: 'AEO',       bg: '#f3e8ff', text: '#7c3aed', border: '#d8b4fe' },
  blog:      { label: 'BLOG',      bg: '#eff6ff', text: '#1d4ed8', border: '#93c5fd' },
  community: { label: 'COMMUNITY', bg: '#f0fdf4', text: '#166534', border: '#86efac' },
}

function fmtDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function SeoLogPage({ searchParams }: Props) {
  const { secret, page: pageParam } = await searchParams

  if (secret !== process.env.ADMIN_SECRET) {
    return (
      <div style={s.page}>
        <div style={{ maxWidth: 480, margin: '80px auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
          <h1 style={{ margin: 0, fontSize: 18 }}>Unauthorized</h1>
          <p style={{ margin: '12px 0 0', fontSize: 14, color: '#64748b' }}>
            Add <code>?secret=YOUR_ADMIN_SECRET</code> to the URL.
          </p>
        </div>
      </div>
    )
  }

  const posts = await client.fetch<SanityPostRow[]>(ALL_POSTS_QUERY).catch(() => [] as SanityPostRow[])

  // Cron-generated expansion pages (communities, condo buildings, hubs) live
  // in Sanity — include them so the log tracks the daily rollout.
  const expansionPages = await client.fetch<Array<{ title: string; slug: string; pageType?: string; publishedAt?: string }>>(
    `*[_type == "communityPage"] | order(publishedAt desc){ title, "slug": slug.current, pageType, publishedAt }`
  ).catch(() => [])

  const blogRows: Row[] = posts.slice(0, 500).map((p) => ({
    type: 'blog',
    title: p.title,
    url: `/blog/${p.slug}`,
    detail: (p.category ?? 'blog').replace(/-/g, ' '),
    date: p.publishedAt,
  }))
  blogRows.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())

  const aeoRows: Row[]  = AEO_PAGES.map((p) => ({ type: 'aeo', title: p.title, url: p.url, detail: p.city }))
  const expansionRows: Row[] = expansionPages.map((p) => ({
    type: 'community',
    title: p.title,
    url: `/communities/${p.slug}`,
    detail: (p.pageType ?? 'community').replace(/-/g, ' '),
    date: p.publishedAt,
  }))
  const staticCommRows: Row[] = COMMUNITY_PAGES.map((p) => ({ type: 'community' as const, title: p.title, url: p.url, detail: p.city }))
  const commRows: Row[] = [...expansionRows, ...staticCommRows]

  // Daily ledger: everything with a publish date — blog posts, expansion
  // community/condo/hub pages alike — sorts newest-first and gets grouped
  // under per-day headers at render time. Undated foundation pages (the
  // original static community pages + manifest AEO pages) sit at the end.
  const dated = [...blogRows, ...expansionRows]
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
  const undated = [...aeoRows, ...staticCommRows]
  const rows: Row[] = [...dated, ...undated]

  // Per-day counts for the date group headers.
  const dayKey = (r: Row) => (r.date ? new Date(r.date).toISOString().slice(0, 10) : 'foundation')
  const dayCounts = new Map<string, number>()
  for (const r of rows) dayCounts.set(dayKey(r), (dayCounts.get(dayKey(r)) ?? 0) + 1)
  const dayLabel = (r: Row) => r.date
    ? new Date(r.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Site foundation — existing pages'

  const latest = dated[0]?.date
  const stats = [
    { label: 'Total SEO/AEO pages', value: rows.length },
    { label: 'AEO landing pages',   value: aeoRows.length,  tag: 'aeo' as const },
    { label: 'Blog posts',          value: blogRows.length, tag: 'blog' as const },
    { label: 'Community pages',     value: commRows.length, tag: 'community' as const },
  ]

  // Pagination — 100 rows per page.
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const page = Math.min(totalPages, Math.max(1, parseInt(pageParam ?? '1', 10) || 1))
  const startIdx = (page - 1) * PAGE_SIZE
  const pageRows = rows.slice(startIdx, startIdx + PAGE_SIZE)
  const pageHref = (n: number) => `/admin/seo-log?secret=${encodeURIComponent(secret ?? '')}&page=${n}`

  return (
    <>
      <AdminNav />
      <div style={s.page}>
        <div style={s.container}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={s.eyebrow}>SEO · AEO</div>
            <h1 style={s.title}>Content <em style={s.titleEm}>Log</em></h1>
            <p style={s.sub}>
              Every page working for search &amp; answer-engine visibility — blog posts, AEO landing pages, and community pages.
              {latest && <> Latest post shipped {fmtDate(latest)}.</>}
            </p>
          </div>

          {/* Stat cards */}
          <div style={s.statGrid}>
            {stats.map((st) => (
              <div key={st.label} style={s.statCard}>
                <div style={s.statValue}>{st.value}</div>
                <div style={s.statLabel}>
                  {st.tag && <span style={{ ...tagPill(st.tag), marginRight: 6 }}>{TAGS[st.tag].label}</span>}
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* Unified tagged table */}
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={{ ...s.th, width: 118 }}>Tag</th>
                  <th style={s.th}>Page</th>
                  <th style={{ ...s.th, width: 170 }}>Detail</th>
                  <th style={{ ...s.th, width: 130 }}>Published</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, i) => {
                  const showDayHeader = i === 0 || dayKey(pageRows[i - 1]) !== dayKey(r)
                  return (
                    <Fragment key={`${r.type}-${r.url}`}>
                      {showDayHeader && (
                        <tr>
                          <td colSpan={4} style={s.dayHeader}>
                            {dayLabel(r)}
                            <span style={s.dayCount}>{dayCounts.get(dayKey(r))} page{(dayCounts.get(dayKey(r)) ?? 0) === 1 ? '' : 's'}</span>
                          </td>
                        </tr>
                      )}
                      <tr style={s.tr}>
                        <td style={s.td}><span style={tagPill(r.type)}>{TAGS[r.type].label}</span></td>
                        <td style={s.td}>
                          <a href={`${BASE}${r.url}`} target="_blank" rel="noopener noreferrer" style={s.pageLink}>
                            {r.title}
                          </a>
                          <div style={s.urlHint}>{r.url}</div>
                        </td>
                        <td style={{ ...s.td, color: '#64748b', textTransform: 'capitalize' }}>{r.detail}</td>
                        <td style={{ ...s.td, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>{fmtDate(r.date)}</td>
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 12, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
              Showing {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, rows.length)} of {rows.length}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <PagerBtn href={pageHref(page - 1)} disabled={page <= 1}>← Prev</PagerBtn>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <PagerBtn key={n} href={pageHref(n)} active={n === page}>{n}</PagerBtn>
                ))}
                <PagerBtn href={pageHref(page + 1)} disabled={page >= totalPages}>Next →</PagerBtn>
              </div>
            )}
          </div>

          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
            Blog posts are pulled live from Sanity. Community pages derive from the site&apos;s community data modules.
            AEO landing pages come from the manifest (<code>lib/seo-pages-manifest.ts</code>) — list them there when the
            first best-* pages ship.
          </p>
        </div>
      </div>
    </>
  )
}

function PagerBtn({ href, children, active, disabled }: { href: string; children: ReactNode; active?: boolean; disabled?: boolean }) {
  const style: CSSProperties = {
    display: 'inline-block', minWidth: 34, textAlign: 'center', padding: '6px 11px',
    fontSize: 13, fontWeight: active ? 700 : 500, borderRadius: 7,
    border: `1px solid ${active ? BRAND : '#e2e8f0'}`,
    background: active ? BRAND : '#fff',
    color: active ? '#fff' : disabled ? '#cbd5e1' : '#334155',
    textDecoration: 'none', whiteSpace: 'nowrap',
  }
  if (disabled) return <span style={style}>{children}</span>
  return <a href={href} style={style}>{children}</a>
}

function tagPill(type: SeoPageType): CSSProperties {
  const t = TAGS[type]
  return {
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.06em',
    background: t.bg,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: 99,
    padding: '2px 9px',
    whiteSpace: 'nowrap',
  }
}

const s: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Inter, sans-serif' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 },
  title: { fontSize: 30, fontWeight: 800, color: '#1a1a1a', margin: 0, letterSpacing: '-0.01em' },
  titleEm: { fontStyle: 'italic', fontWeight: 700, color: BRAND },
  sub: { fontSize: 14, color: '#555550', margin: '10px 0 0', maxWidth: 640, lineHeight: 1.5 },

  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, margin: '24px 0 28px' },
  statCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px' },
  statValue: { fontSize: 30, fontWeight: 800, color: BRAND, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 8, display: 'flex', alignItems: 'center', flexWrap: 'wrap' },

  dayHeader: { padding: '14px 16px 8px', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: BRAND, background: '#faf8f5', borderBottom: '1px solid #e2e8f0', borderTop: '2px solid #e8dfd8' },
  dayCount: { marginLeft: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.04em' },
  tableWrap: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', verticalAlign: 'top' },
  pageLink: { color: '#1a1a1a', fontWeight: 600, textDecoration: 'none', lineHeight: 1.35 },
  urlHint: { fontSize: 11, color: '#94a3b8', marginTop: 3, fontFamily: 'ui-monospace, monospace' },
}

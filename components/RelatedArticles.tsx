import Link from 'next/link'
import { getPostsByCategory } from '@/lib/blog/all-posts'
import { getPillarForCategory } from '@/lib/blog/pillars'
import type { DisplayBucket } from '@/lib/blog/category-map'

interface Props {
  slug: string
  category: DisplayBucket
}

// Gives every blog post at least a few contextual internal links (previously
// zero — all 45 posts were structurally orphaned, see findings/cluster.md).
// Computed from the post's own category rather than hand-edited per post, so
// it stays correct as new posts are added.
export default async function RelatedArticles({ slug, category }: Props) {
  const pillar = getPillarForCategory(category)
  const siblings = (await getPostsByCategory(pillar.categories))
    .filter((p) => p.slug !== slug)
    .slice(0, 3)

  if (siblings.length === 0) return null

  return (
    <section style={{ background: 'var(--off-white,#faf7f2)', padding: '64px var(--pad-x,60px)' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400, color: 'var(--near-black,#1a0a0a)', letterSpacing: '-0.01em', margin: 0 }}>
            More in <em style={{ fontStyle: 'italic', color: 'var(--brand,#58172a)' }}>{pillar.shortTitle}</em>
          </h2>
          <Link
            href={`/guides/${pillar.slug}`}
            style={{ fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', textDecoration: 'none' }}
          >
            View Full Guide →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={`/blog/${s.slug}`}
              style={{
                display: 'block',
                padding: '18px 20px',
                background: '#fff',
                borderRadius: '6px',
                border: '1px solid #f0ebe4',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--near-black,#1a0a0a)',
                lineHeight: 1.5,
              }}
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

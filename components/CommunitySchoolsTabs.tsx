'use client'
import { useState } from 'react'
import type { School } from '@/lib/community-data'

interface Props {
  publicSchools: School[]
  privateSchools: School[]
  schoolDistrict: string
  communityName: string
}

export default function CommunitySchoolsTabs({ publicSchools, privateSchools, schoolDistrict, communityName }: Props) {
  const [tab, setTab] = useState<'public' | 'private'>('public')

  return (
    <>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        <button
          onClick={() => setTab('public')}
          style={{
            fontFamily: 'var(--font-label)', fontSize: '13px', fontWeight: 600,
            padding: '9px 20px', borderRadius: '8px',
            border: `1px solid ${tab === 'public' ? 'var(--brand,#58172a)' : 'rgba(0,0,0,0.12)'}`,
            background: tab === 'public' ? 'var(--brand,#58172a)' : 'transparent',
            color: tab === 'public' ? '#fff' : 'rgba(33,33,33,0.55)',
            cursor: 'pointer',
          }}
        >
          Public
        </button>
        {privateSchools.length > 0 && (
          <button
            onClick={() => setTab('private')}
            style={{
              fontFamily: 'var(--font-label)', fontSize: '13px', fontWeight: 600,
              padding: '9px 20px', borderRadius: '8px',
              border: `1px solid ${tab === 'private' ? 'var(--brand,#58172a)' : 'rgba(0,0,0,0.12)'}`,
              background: tab === 'private' ? 'var(--brand,#58172a)' : 'transparent',
              color: tab === 'private' ? '#fff' : 'rgba(33,33,33,0.55)',
              cursor: 'pointer',
            }}
          >
            Private &amp; Charter
          </button>
        )}
      </div>

      {tab === 'public' && publicSchools.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-label)', fontSize: '13px' }}>
          <thead>
            <tr>
              <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 12px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>School Name</th>
              <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 12px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Grades</th>
              <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 0 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>District</th>
            </tr>
          </thead>
          <tbody>
            {publicSchools.map((s, i) => (
              <tr key={i}>
                <td style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'rgba(33,33,33,0.55)' }}>{s.name}</td>
                <td style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'rgba(33,33,33,0.55)' }}>{s.grades}</td>
                <td style={{ padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'rgba(33,33,33,0.55)' }}>{s.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'private' && privateSchools.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-label)', fontSize: '13px' }}>
          <thead>
            <tr>
              <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 12px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>School Name</th>
              <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 12px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Grades</th>
              <th style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand,#58172a)', padding: '0 0 14px 0', borderBottom: '1px solid rgba(0,0,0,0.12)', textAlign: 'left' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {privateSchools.map((s, i) => (
              <tr key={i}>
                <td style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'rgba(33,33,33,0.55)' }}>{s.name}</td>
                <td style={{ padding: '14px 12px 14px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'rgba(33,33,33,0.55)' }}>{s.grades}</td>
                <td style={{ padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'rgba(33,33,33,0.55)' }}>{s.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(33,33,33,0.55)', lineHeight: 1.6, marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        School assignments are address-specific and subject to change. Verify enrollment zoning directly with {schoolDistrict} before purchasing. This data is for informational purposes only.
      </p>
    </>
  )
}

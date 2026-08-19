/**
 * One-time migration: create communityPage documents in Sanity for all 23
 * live-site communities from lib/community-data.ts.
 * Run with: node scripts/migrate-communities-to-sanity.mjs
 * Requires SANITY_API_TOKEN in .env.local (NEXT_PUBLIC_SANITY_PROJECT_ID is
 * intentionally hardcoded here to avoid stale env-var issues).
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'

// ── Load env from .env.local ──────────────────────────────────────────────────
const envPath = resolve(process.cwd(), '.env.local')
const envRaw = readFileSync(envPath, 'utf-8').replace(/^﻿/, '') // strip BOM
const env = {}
for (const line of envRaw.split('\n')) {
  const m = line.match(/^([^#][^=]*)=(.*)$/)
  if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}

const TOKEN = env['SANITY_API_TOKEN']
if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN in .env.local')
  process.exit(1)
}

// Hardcoded to avoid stale NEXT_PUBLIC_SANITY_PROJECT_ID on Vercel/local env
const MUTATE_URL = 'https://qjhzi2t2.api.sanity.io/v2024-01-01/data/mutate/production'

// ── All 23 live-site communities (from lib/community-data.ts) ─────────────────
const COMMUNITIES = [
  { name: 'La Jolla',              slug: 'la-jolla-real-estate' },
  { name: 'Coronado',              slug: 'coronado-real-estate' },
  { name: 'Del Mar',               slug: 'del-mar-real-estate' },
  { name: 'Carmel Valley',         slug: 'carmel-valley-real-estate' },
  { name: 'Rancho Santa Fe',       slug: 'rancho-santa-fe-real-estate' },
  { name: 'Point Loma',            slug: 'point-loma-real-estate' },
  { name: 'Downtown San Diego',    slug: 'downtown-san-diego-real-estate' },
  { name: 'Mission Hills',         slug: 'mission-hills-real-estate' },
  { name: 'North Park',            slug: 'north-park-real-estate' },
  { name: 'Encinitas',             slug: 'encinitas-real-estate' },
  { name: 'Carlsbad',              slug: 'carlsbad-real-estate' },
  { name: 'Oceanside',             slug: 'oceanside-real-estate' },
  { name: 'Solana Beach',          slug: 'solana-beach-real-estate' },
  { name: 'Pacific Beach',         slug: 'pacific-beach-real-estate' },
  { name: 'Mission Beach',         slug: 'mission-beach-real-estate' },
  { name: 'Pacific & Mission Beach', slug: 'pacific-mission-beach-real-estate' },
  { name: 'Mission Valley',        slug: 'mission-valley-real-estate' },
  { name: 'Chula Vista',           slug: 'chula-vista-real-estate' },
  { name: 'La Mesa',               slug: 'la-mesa-real-estate' },
  { name: 'Spring Valley',         slug: 'spring-valley-real-estate' },
  { name: 'El Cajon',              slug: 'el-cajon-real-estate' },
  { name: 'Rancho Peñasquitos',    slug: 'rancho-penasquitos-real-estate' },
  { name: 'Scripps Ranch',         slug: 'scripps-ranch-real-estate' },
]

function toCommunityDoc(community) {
  // Deterministic _id so this script is safe to re-run without creating duplicates
  const _id = `community-${community.slug}`
  return {
    _id,
    _type: 'communityPage',
    name: community.name,
    title: `${community.name} Real Estate`,
    slug: { _type: 'slug', current: community.slug },
    pageType: 'community',
    targetKeyword: `${community.name.toLowerCase()} real estate`,
  }
}

async function migrate() {
  const BATCH = 10
  let created = 0, skipped = 0, failed = 0

  console.log(`Migrating ${COMMUNITIES.length} communities to Sanity…\n`)

  for (let i = 0; i < COMMUNITIES.length; i += BATCH) {
    const batch = COMMUNITIES.slice(i, i + BATCH)
    // createIfNotExists: no-op if the _id already exists, safe to re-run
    const mutations = batch.map((c) => ({ createIfNotExists: toCommunityDoc(c) }))

    const res = await fetch(MUTATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error(`Batch ${i + 1}–${i + batch.length} FAILED:`, JSON.stringify(data, null, 2))
      failed += batch.length
    } else {
      const results = data.results ?? []
      const newDocs = results.filter((r) => r.operation === 'create')
      const existing = results.filter((r) => r.operation === 'none')
      console.log(
        `✓ Batch ${i + 1}–${i + batch.length}: ${newDocs.length} created, ${existing.length} already existed`
      )
      created += newDocs.length
      skipped += existing.length
    }
  }

  console.log(`\nDone. Created: ${created}  Already existed: ${skipped}  Failed: ${failed}`)
}

migrate().catch((err) => { console.error(err); process.exit(1) })

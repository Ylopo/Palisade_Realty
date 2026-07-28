import type { FeaturedProperty } from './property-data'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO  = process.env.GITHUB_REPO || 'jomylopo/Palisade_Realty'
const FILE_PATH    = 'data/featured-properties.json'

export async function fetchFeaturedProperties(): Promise<FeaturedProperty[]> {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        'User-Agent': 'palisade-realty-site',
        ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
      },
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

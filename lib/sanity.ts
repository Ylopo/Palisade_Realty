import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'qjhzi2t2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {})
}

export { metadata, viewport } from 'next-sanity/studio'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  const StudioClient = require('./StudioPageClient').default
  return <StudioClient />
}

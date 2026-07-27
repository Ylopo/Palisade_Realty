'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function LangApplier() {
  const pathname = usePathname()
  useEffect(() => {
    if (typeof window === 'undefined') return

    const communityMatch = pathname.match(/^\/communities\/([^/]+)$/)
    if (communityMatch) {
      const slug = communityMatch[1]
      // Remove any stale community translation script and load the current community's.
      // dangerouslySetInnerHTML scripts don't re-execute on React tree updates, so we
      // manage the script element manually on client-side navigation.
      document.querySelectorAll('script[data-cd-trans]').forEach(s => s.remove())
      const script = document.createElement('script')
      script.src = `/community-translations/${slug}.js`
      script.setAttribute('data-cd-trans', slug)
      script.onload = () => {
        if ((window as any).__prApplyLang) (window as any).__prApplyLang()
      }
      document.head.appendChild(script)
    } else {
      if ((window as any).__prApplyLang) (window as any).__prApplyLang()
    }
  }, [pathname])
  return null
}

'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function LangApplier() {
  const pathname = usePathname()
  useEffect(() => {
    // Re-apply stored language after every Next.js client-side navigation
    // so translated elements on the new page render in the correct language.
    if (typeof window !== 'undefined' && (window as any).__prApplyLang) {
      (window as any).__prApplyLang()
    }
  }, [pathname])
  return null
}

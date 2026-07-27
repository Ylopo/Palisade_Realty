'use client'
import { useEffect } from 'react'

export default function PropertyPageBodyClass() {
  useEffect(() => {
    document.body.classList.add('property-page')
    // LangApplier fires before this (earlier sibling in layout), so re-apply
    // translations now that property-page is on the body.
    if ((window as any).__prApplyLang) (window as any).__prApplyLang()
    return () => { document.body.classList.remove('property-page') }
  }, [])
  return null
}

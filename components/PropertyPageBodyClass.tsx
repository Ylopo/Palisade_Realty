'use client'
import { useEffect } from 'react'

export default function PropertyPageBodyClass() {
  useEffect(() => {
    document.body.classList.add('property-page')
    return () => { document.body.classList.remove('property-page') }
  }, [])
  return null
}

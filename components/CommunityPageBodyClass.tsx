'use client'
import { useEffect } from 'react'

export default function CommunityPageBodyClass() {
  useEffect(() => {
    document.body.classList.add('comm-detail')
    return () => { document.body.classList.remove('comm-detail') }
  }, [])
  return null
}

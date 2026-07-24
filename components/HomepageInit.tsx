'use client'

import { useEffect } from 'react'

type W = { __palisadeReinit?: () => void; __fpReinit?: () => void }

// Called on every homepage mount. On first load the scripts run their own init;
// on back-navigation the scripts are cached but the DOM is freshly recreated,
// so we call the exposed reinit functions to re-populate the map and carousels.
export default function HomepageInit() {
  useEffect(() => {
    const w = window as unknown as W
    if (typeof w.__palisadeReinit === 'function') w.__palisadeReinit()
    if (typeof w.__fpReinit       === 'function') w.__fpReinit()
  }, [])
  return null
}

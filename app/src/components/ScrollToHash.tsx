import { useEffect } from 'react'
import { useLocation } from 'react-router'

// After navigation: scroll to #hash if present, otherwise to the top.
export function ScrollToHash() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    if (hash) {
      // wait a tick so lazy pages have rendered
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 50)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, key])
  return null
}

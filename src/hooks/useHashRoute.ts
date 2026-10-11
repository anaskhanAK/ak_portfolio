import { useCallback, useEffect, useRef, useState } from 'react'

const read = () => {
  const m = window.location.hash.match(/^#\/work\/([a-z0-9-]+)/)
  return m ? m[1] : null
}

/**
 * Minimal hash router for case studies (#/work/<slug>), so every case study has a
 * shareable URL on any static host. Switching between case studies replaces the entry,
 * so closing always returns the visitor to exactly where they were on the page.
 */
export function useCaseStudyRoute() {
  const [slug, setSlug] = useState<string | null>(read)
  const pushed = useRef(false)

  useEffect(() => {
    const onHash = () => {
      const next = read()
      if (!next) pushed.current = false
      setSlug(next)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const open = useCallback((next: string, opts?: { replace?: boolean }) => {
    const url = `${window.location.pathname}${window.location.search}#/work/${next}`
    if (opts?.replace || read()) {
      window.location.replace(url)
    } else {
      pushed.current = true
      window.location.hash = `/work/${next}`
    }
  }, [])

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false
      history.back()
      return
    }
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    setSlug(null)
  }, [])

  return { slug, open, close }
}

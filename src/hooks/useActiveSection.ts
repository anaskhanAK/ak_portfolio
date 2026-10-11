import { useEffect, useState } from 'react'

/** Tracks which section id is currently most visible, for nav highlighting. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!elements.length) return

    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best = ''
        let bestRatio = 0
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id
            bestRatio = ratio
          }
        }
        setActive(bestRatio > 0 ? best : '')
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.01, 0.1, 0.25, 0.5, 0.75, 1] },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

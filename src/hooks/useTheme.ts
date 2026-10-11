import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const THEME_COLOR: Record<Theme, string> = { light: '#f6f5f1', dark: '#111315' }

const current = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
}

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

/**
 * Light/dark theme. The initial value is applied before first paint by the inline script in
 * index.html (saved choice, else the system setting). Until the visitor picks a theme, the page
 * keeps following the system setting.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(current)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (stored()) return
      const next: Theme = mq.matches ? 'dark' : 'light'
      apply(next)
      setTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark'
    apply(next)
    setTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable (private mode): the choice lasts for this page view only.
    }
  }, [])

  return { theme, toggle }
}

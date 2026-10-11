import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../lib/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  const label = dark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-line-2',
        className,
      )}
    >
      {dark ? <Sun className="size-[18px]" aria-hidden /> : <Moon className="size-[18px]" aria-hidden />}
    </button>
  )
}

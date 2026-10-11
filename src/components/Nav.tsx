import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useActiveSection } from '../hooks/useActiveSection'
import { useScrolled } from '../hooks/useScrolled'
import { profile } from '../data/profile'
import { cn } from '../lib/cn'
import { Mark } from './Mark'
import { ThemeToggle } from './ThemeToggle'
import { navItems } from '../data/nav'

const sectionIds = [...navItems.map((n) => n.id), 'contact']

export function Nav() {
  const scrolled = useScrolled(40)
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'pointer-events-auto mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled
            ? 'mt-3 h-14 w-[calc(100%-24px)] max-w-[980px] rounded-full border border-line bg-surface/80 pr-2 pl-3 shadow-[var(--shadow-card)] backdrop-blur-xl'
            : 'mt-0 h-20 w-full max-w-[1240px] border-transparent px-5 md:px-8',
        )}
      >
        <a href="#top" className="group flex items-center gap-2.5 rounded-full" aria-label="Anas Khan, back to top">
          <Mark />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink">{profile.name}</span>
            <span
              className={cn(
                'mt-1 font-mono text-[10.5px] tracking-wide text-ink-3 transition-all duration-300',
                scrolled && 'hidden sm:block',
              )}
            >
              {profile.role}
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative block rounded-full px-3.5 py-2 text-[14px] transition-colors',
                      isActive ? 'text-ink' : 'text-ink-3 hover:text-ink',
                    )}
                  >
                    {isActive && (
                      <m.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-paper-2"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[14px] font-medium text-on-ink transition-colors hover:bg-ink-hover sm:inline-flex"
          >
            Contact
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="pointer-events-auto fixed inset-0 z-50 flex flex-col bg-paper/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-20 items-center justify-between px-5">
              <span className="flex items-center gap-2.5">
                <Mark />
                <span className="font-display text-[15px] font-semibold">{profile.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface"
                aria-label="Close menu"
                autoFocus
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pt-6">
              <ul className="space-y-1">
                {[...navItems, { id: 'contact', label: 'Contact' }].map((item, i) => (
                  <m.li
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between border-b border-line py-4 font-display text-[2rem] font-semibold tracking-tight text-ink"
                    >
                      {item.label}
                      <span className="font-mono text-xs text-ink-3">0{i + 1}</span>
                    </a>
                  </m.li>
                ))}
              </ul>
              <p className="mt-8 font-mono text-xs text-ink-3">{profile.email}</p>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}

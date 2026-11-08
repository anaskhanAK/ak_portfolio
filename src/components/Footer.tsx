import { ArrowUp } from 'lucide-react'
import { Mark } from './Mark'
import { navItems } from '../data/nav'
import { profile } from '../data/profile'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Mark />
          <div>
            <p className="font-display text-[15px] font-semibold text-ink">{profile.name}</p>
            <p className="text-[13px] text-ink-3">{profile.headline}</p>
          </div>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-ink-3">
            {navItems.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="link-underline hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#top" className="inline-flex items-center gap-2 self-start rounded-full border border-line px-4 py-2 text-[13px] text-ink-2 hover:border-line-2 hover:text-ink md:self-auto">
          <ArrowUp className="size-3.5" aria-hidden /> Back to top
        </a>
      </div>
      <div className="container-x flex flex-col gap-1 border-t border-line py-5 font-mono text-[11.5px] text-ink-3 sm:flex-row sm:justify-between">
        <span>© {YEAR} {profile.name}</span>
        <span>Case studies come from source code and project write-ups</span>
      </div>
    </footer>
  )
}

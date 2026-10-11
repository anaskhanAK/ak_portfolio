import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { profile } from '../data/profile'
import { domains, projects, stageMeta, type Project } from '../data/projects'
import { techById, techGroups, techs } from '../data/tech'
import { cn } from '../lib/cn'

type Usage = { project: Project; role: string }

/** Where a technology is used and what it does there, derived from the project data. */
function usageFor(techId: string): Usage[] {
  return projects
    .map((p) => {
      const explicit = p.stack.find((s) => s.tech === techId)
      if (explicit) return { project: p, role: explicit.role }
      if (techId === 'python' && p.slug !== 'people-search-portal') return { project: p, role: 'Primary language' }
      const stage = p.pipeline.find((s) => s.tech.includes(techId))
      if (stage) return { project: p, role: `${stageMeta[stage.key].label}: ${stage.title}` }
      return null
    })
    .filter((x): x is Usage => Boolean(x))
    .sort((a, b) => Number(b.project.featured) - Number(a.project.featured) || b.project.date.localeCompare(a.project.date))
}

export function Stack({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [selected, setSelected] = useState('fastapi')
  const detailRef = useRef<HTMLDivElement>(null)
  const select = (id: string) => {
    setSelected(id)
    // On narrow screens the detail sits below the list; bring it into view.
    if (window.matchMedia('(max-width: 1023px)').matches) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' }))
    }
  }
  const usageMap = useMemo(() => Object.fromEntries(techs.map((t) => [t.id, usageFor(t.id)])), [])
  const usage = usageMap[selected]
  const tech = techById[selected]

  return (
    <section id="stack" className="scroll-mt-24 border-y border-line bg-surface py-20 md:py-28" aria-labelledby="stack-title">
      <div className="container-x">
        <SectionHeader
          index="04"
          label="Stack"
          title={<span id="stack-title">Technologies, and where they actually do the work</span>}
          intro="No skill bars or percentages. Pick a technology to see where it is used and what it does there. The number counts the systems and roles that use it."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <div className="space-y-7">
            {techGroups.map((g) => (
              <div key={g.id}>
                <h3 className="eyebrow mb-3 flex items-baseline gap-2">
                  <span className="text-ink-2">{g.label}</span>
                  <span className="normal-case tracking-normal text-ink-4">{g.blurb}</span>
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {techs
                    .filter((t) => t.group === g.id)
                    .map((t) => {
                      const count = usageMap[t.id].length + (t.work ? 1 : 0)
                      const isSel = t.id === selected
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => select(t.id)}
                            aria-pressed={isSel}
                            className={cn(
                              'flex h-9 items-center gap-2 rounded-full border pr-1.5 pl-3.5 text-[13.5px] transition-all',
                              isSel
                                ? 'border-ink bg-ink text-on-ink shadow-[var(--shadow-card)]'
                                : 'border-line bg-paper/70 text-ink-2 hover:border-line-2 hover:bg-surface hover:text-ink',
                            )}
                          >
                            {t.name}
                            <span
                              className={cn(
                                'grid h-6 min-w-6 place-items-center rounded-full px-1.5 font-mono text-[11px]',
                                isSel ? 'bg-on-ink/15 text-on-ink' : 'bg-surface text-ink-3',
                              )}
                              aria-label={`Used in ${count} ${count === 1 ? 'place' : 'places'}`}
                            >
                              {count}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                </ul>
              </div>
            ))}
          </div>

          <div ref={detailRef} className="scroll-mt-24 lg:sticky lg:top-28 lg:self-start">
            <div className="card overflow-hidden" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={selected}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="border-b border-line px-5 py-5 md:px-6">
                    <p className="eyebrow">{techGroups.find((g) => g.id === tech.group)?.label}</p>
                    <p className="mt-2 font-display text-[2rem] leading-none font-semibold tracking-tight text-ink">{tech.name}</p>
                    <p className="mt-2 text-[14px] text-ink-3">
                      Used{' '}
                      {tech.work && (
                        <>
                          at <span className="font-medium text-ink">{profile.company}</span>
                          {usage.length > 0 && ' and '}
                        </>
                      )}
                      {usage.length > 0 && (
                        <>
                          in <span className="font-medium text-ink">{usage.length}</span> {usage.length === 1 ? 'system' : 'systems'}
                        </>
                      )}
                    </p>
                    {usage.length > 0 && (
                      <div className="mt-4 flex h-1.5 gap-[2px] overflow-hidden rounded-full" aria-hidden>
                        {usage.map((u) => (
                          <span key={u.project.slug} className="flex-1" style={{ background: domains[u.project.domain].color }} />
                        ))}
                        {Array.from({ length: projects.length - usage.length }).map((_, i) => (
                          <span key={i} className="flex-1 bg-line" />
                        ))}
                      </div>
                    )}
                  </div>
                  <ul className="max-h-[440px] divide-y divide-line overflow-y-auto">
                    {tech.work && (
                      <li>
                        <a
                          href="#experience"
                          className="group flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-paper/70 md:px-6"
                        >
                          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-ink" aria-hidden />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14.5px] font-medium text-ink">{profile.company}</span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{tech.work}</span>
                          </span>
                          <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-4 transition-colors group-hover:text-ink" aria-hidden />
                        </a>
                      </li>
                    )}
                    {usage.map((u) => (
                      <li key={u.project.slug}>
                        <button
                          type="button"
                          onClick={() => onOpenProject(u.project.slug)}
                          className="group flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-paper/70 md:px-6"
                        >
                          <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: domains[u.project.domain].color }} aria-hidden />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14.5px] font-medium text-ink">{u.project.short}</span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{u.role}</span>
                          </span>
                          <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-4 transition-colors group-hover:text-ink" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

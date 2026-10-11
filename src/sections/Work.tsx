import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, m } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { ProjectVisual } from '../components/ProjectVisual'
import { domains, formatMonth, projects, type DomainId, type Project } from '../data/projects'
import { techById } from '../data/tech'
import { cn } from '../lib/cn'

type Filter = 'all' | DomainId

const inDomain = (p: Project, f: Filter) => f === 'all' || p.domain === f || p.alsoIn?.includes(f)

export function Work({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [filter, setFilter] = useState<Filter>('all')

  const featured = useMemo(() => projects.filter((p) => p.featured && inDomain(p, filter)), [filter])
  const more = useMemo(
    () => projects.filter((p) => !p.featured && inDomain(p, filter)).sort((a, b) => b.date.localeCompare(a.date)),
    [filter],
  )

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: projects.length },
    ...(Object.keys(domains) as DomainId[]).map((d) => ({
      id: d,
      label: domains[d].short,
      count: projects.filter((p) => inDomain(p, d)).length,
    })),
  ]

  return (
    <section id="work" className="scroll-mt-24 py-20 md:py-28" aria-labelledby="work-title">
      <div className="container-x">
        <SectionHeader
          index="01"
          label="Selected work"
          title={<span id="work-title">Problems first. Then the system.</span>}
          intro="Each project starts with something that didn’t work: a booking that stalls between phone calls, a watchlist someone updates by hand, listings nobody can compare. Each one ends with software that handles it. Every detail here comes from the code itself."
        />

        <LayoutGroup>
          <div role="tablist" aria-label="Filter projects by domain" className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
            {filters.map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'relative flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors',
                    active ? 'border-ink text-on-ink' : 'border-line bg-surface text-ink-2 hover:border-line-2 hover:text-ink',
                  )}
                >
                  {active && (
                    <m.span layoutId="work-filter" className="absolute inset-0 -z-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />
                  )}
                  {f.id !== 'all' && (
                    <span className="relative size-2 rounded-full" style={{ background: domains[f.id].color }} aria-hidden />
                  )}
                  <span className="relative">{f.label}</span>
                  <span className={cn('relative font-mono text-[11px]', active ? 'text-on-ink/70' : 'text-ink-3')}>{f.count}</span>
                </button>
              )
            })}
          </div>

          <m.ul layout className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {featured.map((p, i) => {
                const wide = i === 0 || (featured.length % 2 === 0 && i === featured.length - 1)
                return (
                  <m.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(wide && 'md:col-span-2')}
                  >
                    <FeaturedCard project={p} wide={wide} onOpen={() => onOpenProject(p.slug)} />
                  </m.li>
                )
              })}
            </AnimatePresence>
          </m.ul>
        </LayoutGroup>

        {more.length > 0 && (
          <div className="mt-16">
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-line pb-4">
              <h3 className="text-[1.35rem] font-semibold text-ink">More systems</h3>
              <p className="font-mono text-[12px] text-ink-3">{more.length} · newest first</p>
            </div>
            <ul>
              {more.map((p) => (
                <IndexRow key={p.slug} project={p} onOpen={() => onOpenProject(p.slug)} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

function Meta({ project }: { project: Project }) {
  const d = domains[project.domain]
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11.5px] text-ink-3">
      <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-ink-2" style={{ background: d.soft }}>
        <span className="size-1.5 rounded-full" style={{ background: d.color }} aria-hidden />
        {d.label}
      </span>
      <span>{formatMonth(project.date)}</span>
      <span className="hidden sm:inline">· {project.kind}</span>
    </p>
  )
}

function FeaturedCard({ project, wide, onOpen }: { project: Project; wide: boolean; onOpen: () => void }) {
  const d = domains[project.domain]
  const chips = project.stack.slice(0, wide ? 7 : 5)
  return (
    <article
      className="group card relative flex h-full flex-col overflow-hidden transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
      style={{ ['--d' as string]: d.color }}
    >
      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: d.color }} aria-hidden />
      <div className={cn('grid flex-1 gap-6 p-5 md:p-7', wide && 'lg:grid-cols-[1.05fr_1fr] lg:gap-10')}>
        <div className="flex flex-col">
          <Meta project={project} />
          <h3 className="mt-4 text-[clamp(1.45rem,2.4vw,2rem)] leading-[1.08] font-semibold text-ink">
            <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {project.name}
            </button>
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{project.tagline}</p>

          {!wide && (
            <div className="relative z-10 mt-5">
              <ProjectVisual project={project} compact />
            </div>
          )}

          <dl className="mt-6 space-y-3 text-[14px] leading-relaxed">
            <div>
              <dt className="eyebrow mb-1">Problem</dt>
              <dd className="text-ink-2">{project.problem}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Built</dt>
              <dd className="text-ink-2">{project.solution}</dd>
            </div>
          </dl>

          <div className="mt-auto pt-6">
            <dl className="grid grid-cols-2 gap-3 border-t border-line pt-4">
              {project.stats.slice(0, 2).map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-[1.5rem] leading-none font-semibold tracking-tight text-ink">{s.value}</dd>
                  <dd className="mt-1 text-[12px] leading-snug text-ink-3">{s.label}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Key technologies">
              {chips.map((c) => (
                <li key={c.tech} className="tag">
                  {techById[c.tech]?.name}
                </li>
              ))}
            </ul>
            <p className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink" aria-hidden>
              Read the case study
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </p>
          </div>
        </div>

        {wide && (
          <div className="relative z-10 flex flex-col justify-center gap-4 lg:pointer-events-auto">
            <ProjectVisual project={project} compact />
            <div className="hidden grid-cols-2 gap-3 lg:grid">
              {project.stats.slice(2, 4).map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-surface px-4 py-3">
                  <p className="font-display text-[1.25rem] leading-none font-semibold text-ink">{s.value}</p>
                  <p className="mt-1 text-[12px] leading-snug text-ink-3">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function IndexRow({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const d = domains[project.domain]
  return (
    <li className="border-b border-line">
      <button
        type="button"
        onClick={onOpen}
        className="group grid w-full grid-cols-[1fr_auto] items-start gap-x-6 gap-y-2 py-5 text-left transition-colors hover:bg-surface/60 md:grid-cols-[96px_1.3fr_1fr_auto] md:items-center md:px-3"
      >
        <span className="order-2 col-span-2 font-mono text-[12px] text-ink-3 md:order-none md:col-span-1">{formatMonth(project.date)}</span>
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full" style={{ background: d.color }} aria-hidden />
            <span className="font-display text-[1.12rem] font-semibold text-ink">{project.name}</span>
          </span>
          <span className="mt-1 block text-[14px] leading-snug text-ink-2">{project.tagline}</span>
        </span>
        <span className="order-3 col-span-2 flex flex-wrap gap-1.5 md:order-none md:col-span-1">
          {project.stack.slice(0, 3).map((s) => (
            <span key={s.tech} className="tag">
              {techById[s.tech]?.name}
            </span>
          ))}
        </span>
        <span className="row-start-1 inline-grid size-9 place-items-center rounded-full border border-line bg-surface text-ink transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-on-ink md:row-start-auto">
          <ArrowUpRight className="size-4" aria-hidden />
          <span className="sr-only">Open case study</span>
        </span>
      </button>
    </li>
  )
}

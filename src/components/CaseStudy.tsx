import { useEffect, useRef, useState, type ReactNode } from 'react'
import { m, useScroll, useSpring } from 'motion/react'
import { ArrowLeft, ArrowRight, FileCode2, Info, X } from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { ProjectVisual } from './ProjectVisual'
import { hasVisual } from '../lib/visuals'
import { domains, formatMonth, projects, stageMeta, type Project } from '../data/projects'
import { techById } from '../data/tech'
import { cn } from '../lib/cn'

type Props = { project: Project; onClose: () => void; onNavigate: (slug: string) => void }

const order = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)]

export default function CaseStudy({ project, onClose, onNavigate }: Props) {
  const d = domains[project.domain]
  const scrollRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 })

  const idx = order.findIndex((p) => p.slug === project.slug)
  const prev = order[(idx - 1 + order.length) % order.length]
  const next = order[(idx + 1) % order.length]

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'how', label: 'How it works' },
    { id: 'decisions', label: 'Decisions' },
    ...(project.snippet ? [{ id: 'code', label: 'From the code' }] : []),
    { id: 'stack', label: 'Stack' },
    { id: 'outcome', label: 'Outcome' },
  ]
  const [activeSection, setActiveSection] = useState('overview')

  // Lock page scroll, focus the dialog, restore focus on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      html.style.overflow = prevOverflow
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [])

  // Reset scroll when switching between case studies.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [project.slug])

  // Escape closes; Tab stays inside the dialog; ←/→ move between case studies.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), select, input, textarea',
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
      const tag = (e.target as HTMLElement)?.tagName
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && tag !== 'PRE' && tag !== 'INPUT') {
        if (e.altKey || e.metaKey || e.ctrlKey) return
        onNavigate(e.key === 'ArrowRight' ? next.slug : prev.slug)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNavigate, next.slug, prev.slug])

  // Scroll-spy for the table of contents.
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveSection(visible[0].target.id.replace('cs-', ''))
      },
      { root, rootMargin: '-15% 0px -70% 0px' },
    )
    root.querySelectorAll('[data-cs-section]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [project.slug])

  const jump = (id: string) => {
    const el = scrollRef.current?.querySelector(`#cs-${id}`)
    el?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <m.div className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <button type="button" className="absolute inset-0 bg-scrim backdrop-blur-[3px]" onClick={onClose} aria-label="Close case study" tabIndex={-1} />
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cs-title"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 top-2 bottom-0 mx-auto flex max-w-[1180px] flex-col overflow-hidden rounded-t-[24px] border border-line bg-paper shadow-[0_-20px_60px_-20px_rgb(14_18_23/0.35)] md:top-4 md:inset-x-4"
      >
        {/* Sticky header */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur md:px-6">
          <m.span className="absolute inset-x-0 bottom-0 h-[2px] origin-left" style={{ scaleX: progress, background: d.color }} aria-hidden />
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="size-2 shrink-0 rounded-full" style={{ background: d.color }} aria-hidden />
            <span className="truncate text-[14px] font-medium text-ink">{project.short}</span>
            <span className="hidden font-mono text-[11.5px] text-ink-3 sm:inline">· case study {idx + 1} of {order.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => onNavigate(prev.slug)} className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[13px] text-ink-2 hover:border-line-2 hover:text-ink sm:inline-flex" aria-label={`Previous: ${prev.short}`}>
              <ArrowLeft className="size-3.5" aria-hidden /> Prev
            </button>
            <button type="button" onClick={() => onNavigate(next.slug)} className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[13px] text-ink-2 hover:border-line-2 hover:text-ink sm:inline-flex" aria-label={`Next: ${next.short}`}>
              Next <ArrowRight className="size-3.5" aria-hidden />
            </button>
            <button ref={closeRef} type="button" onClick={onClose} className="inline-flex size-9 items-center justify-center rounded-full bg-ink text-on-ink hover:bg-ink-hover" aria-label="Close case study">
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="relative flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto grid max-w-[1120px] gap-10 px-5 pt-10 pb-16 md:px-8 xl:grid-cols-[180px_minmax(0,1fr)]">
            {/* ToC */}
            <nav aria-label="Case study sections" className="hidden xl:block">
              <ul className="sticky top-8 space-y-1 border-l border-line">
                {sections.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => jump(s.id)}
                      className={cn(
                        '-ml-px border-l-2 py-1.5 pl-4 text-left text-[13px] transition-colors',
                        activeSection === s.id ? 'font-medium text-ink' : 'border-transparent text-ink-3 hover:text-ink',
                      )}
                      style={activeSection === s.id ? { borderColor: d.color } : undefined}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0">
              {/* Overview */}
              <Section id="overview">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] text-ink-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-ink-2" style={{ background: d.soft }}>
                    <span className="size-1.5 rounded-full" style={{ background: d.color }} aria-hidden />
                    {d.label}
                  </span>
                  <span>{project.kind}</span>
                  <span>· last commit {formatMonth(project.date)}</span>
                  <span className="hidden md:inline">· repo: {project.repo}</span>
                </p>
                <h2 id="cs-title" className="mt-5 max-w-[22ch] text-[clamp(2rem,5vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-ink">
                  {project.name}
                </h2>
                <p className="mt-5 max-w-[50ch] font-display text-[clamp(1.15rem,2.2vw,1.5rem)] leading-snug text-ink-2">{project.tagline}</p>
                <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
                  {project.stats.map((s) => (
                    <div key={s.label} className="bg-surface px-4 py-4">
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="font-display text-[1.6rem] leading-none font-semibold tracking-tight text-ink">{s.value}</dd>
                      <dd className="mt-1.5 text-[12.5px] leading-snug text-ink-3">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              </Section>

              {/* Problem */}
              <Section id="problem" title="The problem, and what was built">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { k: 'What existed', v: project.problem },
                    { k: 'Why it mattered', v: project.why },
                    { k: 'What was built', v: project.solution },
                  ].map((c, i) => (
                    <div key={c.k} className={cn('rounded-2xl border p-5', i === 2 ? 'border-transparent bg-ink text-on-ink' : 'border-line bg-surface')}>
                      <p className={cn('font-mono text-[11px] tracking-wider uppercase', i === 2 ? 'text-on-ink/60' : 'text-ink-3')}>{c.k}</p>
                      <p className={cn('mt-3 text-[15px] leading-relaxed', i === 2 ? 'text-on-ink/90' : 'text-ink-2')}>{c.v}</p>
                    </div>
                  ))}
                </div>
                {hasVisual(project.slug) && (
                  <div className="mt-6">
                    <ProjectVisual project={project} />
                  </div>
                )}
              </Section>

              {/* Architecture */}
              <Section id="architecture" title="Architecture: following one request through" intro="Each stage below is a real part of the codebase, in the order data moves through it.">
                <PipelineDiagram project={project} scrollRef={scrollRef} />
              </Section>

              {/* How */}
              <Section id="how" title="How it works">
                <ol className="space-y-0">
                  {project.how.map((step, i) => (
                    <li key={i} className="grid grid-cols-[40px_1fr] gap-3 border-t border-line py-4 first:border-t-0">
                      <span className="font-mono text-[13px] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[15px] leading-relaxed text-ink-2">{step}</span>
                    </li>
                  ))}
                </ol>
              </Section>

              {/* Decisions */}
              <Section id="decisions" title="Engineering decisions">
                <ul className="grid gap-4 md:grid-cols-2">
                  {project.decisions.map((dec, i) => (
                    <li key={dec.title} className="card p-5">
                      <p className="font-mono text-[11px] text-ink-3">Decision {String(i + 1).padStart(2, '0')}</p>
                      <p className="mt-2 text-[16px] leading-snug font-semibold text-ink">{dec.title}</p>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{dec.body}</p>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Code */}
              {project.snippet && (
                <Section id="code" title="From the code">
                  <CodeBlock code={project.snippet.code} file={project.snippet.file} caption={project.snippet.caption} />
                </Section>
              )}

              {/* Stack */}
              <Section id="stack" title="Stack, and what each piece does here">
                <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                  {project.stack.map((s) => (
                    <li key={s.tech} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[220px_1fr] sm:gap-6">
                      <span className="text-[14.5px] font-medium text-ink">{techById[s.tech]?.name}</span>
                      <span className="text-[14px] leading-relaxed text-ink-2">{s.role}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="eyebrow mr-1 flex items-center gap-1.5">
                    <FileCode2 className="size-3.5" aria-hidden /> Evidence
                  </span>
                  {project.evidence.map((f) => (
                    <code key={f} className="rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[11.5px] text-ink-2">
                      {f}
                    </code>
                  ))}
                </div>
              </Section>

              {/* Outcome */}
              <Section id="outcome" title="Outcome">
                <p className="max-w-[62ch] font-display text-[clamp(1.2rem,2.2vw,1.55rem)] leading-snug text-ink">{project.outcome}</p>
                {project.note && (
                  <p className="mt-5 flex max-w-[62ch] items-start gap-2 rounded-xl border border-dashed border-line-2 px-4 py-3 text-[13.5px] leading-relaxed text-ink-3">
                    <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {project.note}
                  </p>
                )}
              </Section>

              {/* Next / prev */}
              <div className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
                {[
                  { p: prev, label: 'Previous', icon: <ArrowLeft className="size-4" aria-hidden /> },
                  { p: next, label: 'Next', icon: <ArrowRight className="size-4" aria-hidden /> },
                ].map(({ p, label, icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onNavigate(p.slug)}
                    className={cn('group card flex flex-col p-5 text-left transition-shadow hover:shadow-[var(--shadow-lift)]', label === 'Next' && 'sm:items-end sm:text-right')}
                  >
                    <span className="flex items-center gap-1.5 font-mono text-[11.5px] text-ink-3">
                      {label === 'Previous' && icon}
                      {label}
                      {label === 'Next' && icon}
                    </span>
                    <span className="mt-2 text-[17px] font-semibold text-ink">{p.name}</span>
                    <span className="mt-1 line-clamp-2 text-[13.5px] text-ink-3">{p.tagline}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </m.div>
    </m.div>
  )
}

function Section({ id, title, intro, children }: { id: string; title?: string; intro?: string; children: ReactNode }) {
  return (
    <section id={`cs-${id}`} data-cs-section className="scroll-mt-6 pt-14 first:pt-0">
      {title && (
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h3 className="text-[clamp(1.4rem,2.6vw,1.9rem)] leading-tight font-semibold text-ink">{title}</h3>
          {intro && <p className="mt-2 max-w-[60ch] text-[14.5px] text-ink-3">{intro}</p>}
        </m.div>
      )}
      {children}
    </section>
  )
}

/** Vertical pipeline whose spine fills as the reader scrolls through it. */
function PipelineDiagram({ project, scrollRef }: { project: Project; scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLOListElement>(null)
  const d = domains[project.domain]
  const { scrollYProgress } = useScroll({ container: scrollRef, target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 160, damping: 30 })

  return (
    <ol ref={ref} className="relative">
      <span className="absolute top-2 bottom-2 left-[15px] w-[2px] rounded-full bg-line" aria-hidden />
      <m.span className="absolute top-2 bottom-2 left-[15px] w-[2px] origin-top rounded-full" style={{ scaleY: fill, background: d.color }} aria-hidden />
      {project.pipeline.map((s, i) => (
        <m.li
          key={s.key}
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, root: scrollRef, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="relative grid grid-cols-[32px_1fr] gap-4 pb-6 last:pb-0"
        >
          <span className="relative z-10 grid size-8 place-items-center rounded-full border-2 bg-surface font-mono text-[11px] font-medium text-ink" style={{ borderColor: d.color }}>
            {i + 1}
          </span>
          <div className="card p-5">
            <p className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">
              {stageMeta[s.key].label} <span className="normal-case tracking-normal text-ink-4">· {stageMeta[s.key].verb}</span>
            </p>
            <p className="mt-1.5 text-[17px] font-semibold text-ink">{s.title}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{s.detail}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {s.tech.map((t) => (
                <li key={t} className="tag">
                  {techById[t]?.name}
                </li>
              ))}
            </ul>
          </div>
        </m.li>
      ))}
    </ol>
  )
}

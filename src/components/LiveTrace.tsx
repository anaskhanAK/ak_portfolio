import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { domains, projects, stageMeta } from '../data/projects'
import { techById } from '../data/tech'
import { cn } from '../lib/cn'

const featured = projects.filter((p) => p.featured)
const STAGE_MS = 1100

/**
 * Hero visual: steps a "request" through each featured system's real pipeline stages,
 * then moves to the next system. Pauses on hover/focus; static under reduced motion.
 */
export function LiveTrace({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const reduce = useReducedMotion()
  const [pi, setPi] = useState(0)
  const [si, setSi] = useState(0)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  const project = featured[pi]
  const stages = project.pipeline
  const domain = domains[project.domain]

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduce || paused || !visible) return
    const t = window.setTimeout(() => {
      if (si < stages.length - 1) setSi(si + 1)
      else {
        setSi(0)
        setPi((pi + 1) % featured.length)
      }
    }, si === stages.length - 1 ? STAGE_MS * 2.2 : STAGE_MS)
    return () => window.clearTimeout(t)
  }, [si, pi, paused, reduce, visible, stages.length])

  const select = (i: number) => {
    setPi(i)
    setSi(0)
  }

  const techIds = Array.from(new Set(stages.flatMap((s) => s.tech))).slice(0, 5)

  return (
    <div
      ref={rootRef}
      className="card relative overflow-hidden p-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-ink-3 uppercase">
          <span className="relative flex size-2">
            <span className={cn('absolute inset-0 rounded-full bg-signal', !reduce && !paused && 'animate-ping opacity-60')} />
            <span className="relative size-2 rounded-full bg-signal" />
          </span>
          System trace
        </span>
        <span className="font-mono text-[11px] text-ink-3" aria-hidden>
          {String(pi + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
        </span>
      </div>

      <div role="tablist" aria-label="Choose a system to trace" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pt-3">
        {featured.map((p, i) => (
          <button
            key={p.slug}
            role="tab"
            type="button"
            aria-selected={i === pi}
            onClick={() => select(i)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] transition-colors',
              i === pi ? 'border-ink bg-ink text-on-ink' : 'border-line bg-surface text-ink-2 hover:border-line-2',
            )}
          >
            <span className="size-1.5 rounded-full" style={{ background: domains[p.domain].color }} aria-hidden />
            {p.short}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-2" role="tabpanel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={project.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-[13.5px] leading-snug text-ink-2"
          >
            <span className="font-medium text-ink">{project.short}:</span> {project.tagline}
          </m.p>
        </AnimatePresence>

        <ol className="relative mt-4 space-y-0">
          <span className="absolute top-3 bottom-3 left-[7px] w-px bg-line" aria-hidden />
          {stages.map((s, i) => {
            const state = reduce ? 'done' : i < si ? 'done' : i === si ? 'active' : 'idle'
            return (
              <li key={`${project.slug}-${s.key}`} className="relative grid grid-cols-[16px_88px_1fr] items-start gap-x-3 py-[7px]">
                <span className="relative mt-[3px] flex size-[15px] items-center justify-center" aria-hidden>
                  <span
                    className={cn(
                      'size-[9px] rounded-full border transition-all duration-300',
                      state === 'idle' && 'border-line-2 bg-surface',
                      state === 'done' && 'border-transparent',
                      state === 'active' && 'scale-125 border-transparent',
                    )}
                    style={state !== 'idle' ? { background: domain.color } : undefined}
                  />
                  {state === 'active' && (
                    <m.span
                      layoutId="trace-ring"
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: domain.color }}
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    'pt-px font-mono text-[10.5px] tracking-wider uppercase transition-colors',
                    state === 'idle' ? 'text-ink-4' : 'text-ink-3',
                  )}
                >
                  {stageMeta[s.key].label}
                </span>
                <span
                  className={cn(
                    'text-[13.5px] leading-snug transition-colors duration-300',
                    state === 'idle' ? 'text-ink-4' : 'text-ink',
                    state === 'active' && 'font-medium',
                  )}
                >
                  {s.title}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper/60 px-4 py-3">
        <span className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-ink-3">
          {techIds.map((t, i) => (
            <span key={t}>
              {techById[t]?.name}
              {i < techIds.length - 1 && <span className="ml-2 text-line-2">/</span>}
            </span>
          ))}
        </span>
        <button
          type="button"
          onClick={() => onOpenProject(project.slug)}
          className="group inline-flex items-center gap-1 text-[13px] font-medium text-ink"
        >
          Case study
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>
      </div>
    </div>
  )
}

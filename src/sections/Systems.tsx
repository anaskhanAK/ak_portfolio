import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { domains, projects, stageMeta, type Project } from '../data/projects'
import { techById } from '../data/tech'
import { cn } from '../lib/cn'

const featured = projects.filter((p) => p.featured)
const others = projects.filter((p) => !p.featured)
const STEP_MS = 2600

export function Systems({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [slug, setSlug] = useState(featured[0].slug)
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-25% 0px' })

  const project = projects.find((p) => p.slug === slug) as Project
  const d = domains[project.domain]
  const stages = project.pipeline
  const current = stages[Math.min(stage, stages.length - 1)]
  const autoplay = playing && !reduce && inView

  useEffect(() => {
    if (!autoplay) return
    const t = window.setTimeout(() => setStage((s) => (s + 1) % stages.length), STEP_MS)
    return () => window.clearTimeout(t)
  }, [autoplay, stage, stages.length])

  const pickProject = (s: string) => {
    setSlug(s)
    setStage(0)
  }
  const pickStage = (i: number) => {
    setStage(i)
    setPlaying(false)
  }

  return (
    <section id="systems" className="relative scroll-mt-24 border-y border-line bg-surface py-20 md:py-28" aria-labelledby="systems-title">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" aria-hidden />
      <div className="container-x relative" ref={ref}>
        <SectionHeader
          index="02"
          label="Systems"
          title={<span id="systems-title">Different tools. The same spine.</span>}
          intro="Almost everything I build has the same five stages: ingest, understand, decide, act and observe. Pick a system and step through it. Each stage shows what really happens in the code."
        />

        <div className="mb-8 flex min-w-0 flex-wrap items-center gap-2">
          <div role="tablist" aria-label="Choose a system" className="no-scrollbar -mx-5 flex w-[calc(100%+40px)] gap-2 overflow-x-auto px-5 md:mx-0 md:w-auto md:flex-wrap md:px-0">
            {featured.map((p) => (
              <button
                key={p.slug}
                role="tab"
                type="button"
                aria-selected={p.slug === slug}
                onClick={() => pickProject(p.slug)}
                className={cn(
                  'flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors',
                  p.slug === slug ? 'border-ink bg-ink text-on-ink' : 'border-line bg-surface text-ink-2 hover:border-line-2',
                )}
              >
                <span className="size-2 rounded-full" style={{ background: domains[p.domain].color }} aria-hidden />
                {p.short}
              </button>
            ))}
          </div>
          <label className="relative flex h-10 items-center rounded-full border border-line bg-surface pr-3 pl-4 text-[14px] text-ink-2">
            <span className="sr-only">More systems</span>
            <select
              value={others.some((o) => o.slug === slug) ? slug : ''}
              onChange={(e) => e.target.value && pickProject(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent pr-5 outline-none"
            >
              <option value="">More systems…</option>
              {others.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.short}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-ink-3" aria-hidden>
              ▾
            </span>
          </label>
        </div>

        <div className="card overflow-hidden">
          {/* header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 md:px-7">
            <div className="min-w-0">
              <p className="eyebrow flex items-center gap-2">
                <span className="size-1.5 rounded-full" style={{ background: d.color }} aria-hidden />
                {d.label}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <m.h3
                  key={project.slug}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="mt-1 text-[1.25rem] leading-snug font-semibold text-ink"
                >
                  {project.name}
                </m.h3>
              </AnimatePresence>
            </div>
            {!reduce && (
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-3 text-[13px] text-ink-2 hover:border-line-2"
                aria-pressed={playing}
              >
                {playing ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
                {playing ? 'Pause walkthrough' : 'Play walkthrough'}
              </button>
            )}
          </div>

          {/* schematic */}
          <div className="px-5 pt-6 pb-2 md:px-7 md:pt-8">
            <ol className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0" aria-label="Pipeline stages">
              {stages.map((s, i) => {
                const isActive = i === stage
                const passed = i < stage
                return (
                  <li key={`${project.slug}-${s.key}`} className="flex flex-col md:flex-1 md:flex-row md:items-center">
                    <button
                      type="button"
                      onClick={() => pickStage(i)}
                      aria-current={isActive ? 'step' : undefined}
                      className={cn(
                        'relative w-full rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 md:min-h-[112px] md:min-w-0',
                        isActive ? 'border-transparent bg-ink text-on-ink shadow-[var(--shadow-lift)]' : 'border-line bg-paper/60 text-ink hover:border-line-2 hover:bg-surface',
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className={cn('font-mono text-[10.5px] tracking-wider uppercase', isActive ? 'text-on-ink/70' : 'text-ink-3')}>
                          {String(i + 1).padStart(2, '0')} · {stageMeta[s.key].label}
                        </span>
                        <span
                          className={cn('size-2 rounded-full transition-all', isActive && 'scale-125')}
                          style={{ background: isActive || passed ? d.color : 'var(--color-line-2)' }}
                          aria-hidden
                        />
                      </span>
                      <span className="mt-2 block text-[14.5px] leading-snug font-medium">{s.title}</span>
                      {isActive && autoplay && (
                        <m.span
                          key={`${project.slug}-${stage}`}
                          className="absolute bottom-0 left-4 h-[2px] rounded-full"
                          style={{ background: d.color }}
                          initial={{ width: 0 }}
                          animate={{ width: 'calc(100% - 32px)' }}
                          transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                        />
                      )}
                    </button>
                    {i < stages.length - 1 && <Connector active={passed || isActive} color={d.color} animate={!reduce} />}
                  </li>
                )
              })}
            </ol>
          </div>

          {/* detail */}
          <div className="grid gap-6 px-5 pt-4 pb-6 md:grid-cols-[1.4fr_1fr] md:gap-10 md:px-7 md:pb-8">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={`${project.slug}-${stage}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                aria-live="polite"
              >
                <p className="eyebrow">{stageMeta[current.key].verb}</p>
                <p className="mt-3 text-[1.05rem] leading-relaxed text-ink">{current.detail}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies in this stage">
                  {current.tech.map((t) => (
                    <li key={t} className="tag">
                      {techById[t]?.name}
                    </li>
                  ))}
                </ul>
              </m.div>
            </AnimatePresence>
            <div className="rounded-2xl border border-line bg-paper/60 p-5">
              <p className="eyebrow">The problem it answers</p>
              <p className="mt-2 line-clamp-5 text-[14px] leading-relaxed text-ink-2">{project.problem}</p>
              <button
                type="button"
                onClick={() => onOpenProject(project.slug)}
                className="group mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink"
              >
                Open the case study
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Connector({ active, color, animate }: { active: boolean; color: string; animate: boolean }) {
  return (
    <span className="flex h-5 items-center justify-center md:h-auto md:w-6 md:shrink-0" aria-hidden>
      <svg className="h-2 w-5 rotate-90 md:w-6 md:rotate-0" viewBox="0 0 24 8" preserveAspectRatio="none">
        <line
          x1="0"
          y1="4"
          x2="24"
          y2="4"
          strokeWidth="2"
          stroke={active ? color : 'var(--color-line-2)'}
          className={cn(active && animate && 'flow-line')}
          strokeDasharray={active ? undefined : '2 4'}
        />
      </svg>
    </span>
  )
}

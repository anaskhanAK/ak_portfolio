import { useEffect, useRef, useState } from 'react'
import { m, useInView, useReducedMotion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { domains } from '../data/projects'
import { cn } from '../lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
const STEP_MS = 2400

/** The six ResearchCrew agents, in the order the resume lists them. */
const agents = [
  { name: 'Planner', job: 'Focused search queries', detail: 'Turns the topic into focused search queries.' },
  { name: 'Searcher', job: 'Collects and ranks sources', detail: 'Collects sources and ranks them by credibility and relevance.' },
  {
    name: 'Analyzer',
    job: 'Extracts findings',
    detail: 'Extracts the findings and decides whether another search round is needed.',
    loop: 'Another search round if needed',
  },
  { name: 'Writer', job: 'Cited draft', detail: 'Writes the report with a citation on every factual sentence.' },
  {
    name: 'Fact-Checker',
    job: 'Verifies each claim',
    detail: 'Checks each claim against its source and revises the report.',
    loop: 'Revises the report',
  },
  { name: 'Data Extractor', job: 'Numbers from sources', detail: 'Keeps only the numbers that appear in the source text.' },
]

const outputs = ['Cited report as a PDF with charts', 'Evidence Score, 0 to 100', 'Claims to double-check']

/**
 * ResearchCrew as a walkthrough: the six agents in order, with the two places where the work loops.
 * Steps advance on their own while the visual is on screen; any click pauses it. Static under
 * reduced motion.
 */
export function AgentGraph({ compact = false }: { compact?: boolean }) {
  const color = domains.ai.color
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const autoplay = playing && !reduce && inView && !compact

  useEffect(() => {
    if (!autoplay) return
    const t = window.setTimeout(() => setActive((a) => (a + 1) % agents.length), STEP_MS)
    return () => window.clearTimeout(t)
  }, [autoplay, active])

  if (compact) {
    return (
      <div ref={ref}>
        <ol className="flex flex-wrap gap-1.5" aria-label="The six agents, in order">
          {agents.map((a, i) => (
            <li key={a.name} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-[12px] text-ink-2">
              <span className="font-mono text-[10.5px] text-ink-3">{i + 1}</span>
              {a.name}
            </li>
          ))}
        </ol>
      </div>
    )
  }

  const pick = (i: number) => {
    setActive(i)
    setPlaying(false)
  }

  return (
    <div ref={ref} className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 md:px-6">
        <p className="text-[13.5px] font-medium text-ink-2">How the six agents hand work to each other</p>
        {!reduce && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-[12.5px] text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
            aria-label={playing ? 'Pause the walkthrough' : 'Play the walkthrough'}
          >
            {playing ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
            {playing ? 'Pause' : 'Play'}
          </button>
        )}
      </div>

      <div className="px-5 py-6 md:px-6">
        <div className="relative hidden h-1 rounded-full bg-line md:block" aria-hidden>
          <m.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: color }}
            initial={false}
            animate={{ width: `${((active + 1) / agents.length) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.6, ease }}
          />
        </div>

        <ol className="mt-4 grid gap-2 md:grid-cols-6" aria-label="Agents, in order">
          {agents.map((a, i) => {
            const isActive = i === active
            return (
              <li key={a.name}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={isActive}
                  className={cn(
                    'flex h-full w-full flex-col rounded-xl border p-3 text-left transition-colors',
                    isActive ? 'border-ink bg-ink text-on-ink' : i < active ? 'border-line-2 bg-paper text-ink' : 'border-line bg-surface text-ink-2 hover:border-line-2',
                  )}
                >
                  <span className={cn('font-mono text-[11px]', isActive ? 'text-on-ink/70' : 'text-ink-3')}>{i + 1}</span>
                  <span className="mt-1 text-[14.5px] leading-tight font-medium">{a.name}</span>
                  <span className={cn('mt-1 text-[12.5px] leading-snug', isActive ? 'text-on-ink/80' : 'text-ink-3')}>{a.job}</span>
                  {a.loop && (
                    <span className={cn('mt-2 text-[11.5px] leading-snug', isActive ? 'text-on-ink/90' : 'text-signal-ink')}>
                      <span aria-hidden>↺ </span>
                      {a.loop}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>

        <m.p
          key={active}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="mt-5 min-h-[3.2rem] max-w-[62ch] font-display text-[1.15rem] leading-snug text-ink"
          aria-live="polite"
        >
          <span className="text-ink-3">{agents[active].name}: </span>
          {agents[active].detail}
        </m.p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-line pt-4 text-[13px] text-ink-2">
          <span className="font-medium text-ink">What comes out</span>
          {outputs.map((o) => (
            <span key={o} className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: color }} aria-hidden />
              {o}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

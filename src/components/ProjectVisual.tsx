import { useEffect, useRef, useState } from 'react'
import { m, useInView, useReducedMotion } from 'motion/react'
import { Check, Eye, FileText, ScanText, X } from 'lucide-react'
import { domains, type Project } from '../data/projects'
import { cn } from '../lib/cn'
import { AgentGraph } from './AgentGraph'

/* Small, evidence-based visuals that stand in for screenshots. Every number is from the repo. */


export function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  switch (project.slug) {
    case 'researchcrew':
      return <AgentGraph compact={compact} />
    case 'nichetrx':
      return <Lifecycle color={domains.platform.color} compact={compact} />
    case 'support-gpt':
      return (
        <Funnel
          color={domains.ai.color}
          caption="789 ticket threads → fine-tuning set"
          rows={[
            { label: 'Ticket threads extracted', value: 789, note: '5,135 messages, Nov 2022 to Jul 2023' },
            { label: 'Passed quality rules', value: 430, note: '54.5% of threads kept' },
            { label: 'Training conversations', value: 380, note: '90% of kept threads, split by thread' },
            { label: 'Validation conversations', value: 50, note: '10% held out' },
          ]}
        />
      )
    case 'card-grading-arbitrage':
      return (
        <Funnel
          color={domains.ai.color}
          caption="Where the NER model earns its place"
          rows={[
            { label: 'Listings stored', value: 26006, note: 'Aug to Nov 2024 · 130 sport labels' },
            { label: 'No player field from eBay', value: 1372, note: '5.3% of listings' },
            { label: 'Player recovered by NER', value: 884, note: '64.4% of those, via BERT → Flair' },
          ]}
        />
      )
    case 'solana-bot-suite':
      return <Gates color={domains.markets.color} />
    case 'tradingview-mail-watcher':
      return <RuleTable color={domains.automation.color} />
    case 'geo-qa-vision':
      return <Cascade color={domains.automation.color} />
    default:
      return null
  }
}

/* ── NicheTRX: job lifecycle ─────────────────────────────────────────── */

const lifecycle = [
  { id: 'pending', label: 'pending', who: 'Client posts job' },
  { id: 'bidding', label: 'bidding', who: 'Admin approves · vendors bid' },
  { id: 'assigned', label: 'assigned', who: 'Admin accepts bid, sets price' },
  { id: 'in_progress', label: 'in_progress', who: 'Client + driver both confirm' },
  { id: 'completed', label: 'completed', who: 'Driver posts “delivered”' },
  { id: 'paid', label: 'paid', who: 'Stripe webhook verified' },
]

function Lifecycle({ color, compact }: { color: string; compact: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const reduce = useReducedMotion()
  const [step, setStep] = useState(reduce ? lifecycle.length - 1 : 0)

  useEffect(() => {
    if (reduce || !inView) return
    const t = window.setInterval(() => setStep((s) => (s + 1) % (lifecycle.length + 1)), 1100)
    return () => window.clearInterval(t)
  }, [inView, reduce])

  const current = Math.min(step, lifecycle.length - 1)

  return (
    <div ref={ref} className="rounded-2xl border border-line bg-paper/70 p-4 md:p-5">
      <p className="eyebrow mb-4 flex items-center justify-between">
        <span>Job.status: one booking, end to end</span>
        <span className="hidden normal-case sm:inline">JobStatusEnum</span>
      </p>
      <ol className={cn('grid gap-2', compact ? 'grid-cols-3' : 'grid-cols-3 md:grid-cols-6')}>
        {lifecycle.map((s, i) => {
          const done = i <= current
          return (
            <li key={s.id} className="min-w-0">
              <div
                className={cn(
                  'flex h-9 items-center justify-center rounded-lg border font-mono text-[11px] transition-all duration-500',
                  done ? 'border-transparent text-on-ink' : 'border-line bg-surface text-ink-3',
                )}
                style={done ? { background: color } : undefined}
              >
                {s.label}
              </div>
              <p className={cn('mt-1.5 text-[11.5px] leading-tight transition-colors', i === current ? 'text-ink' : 'text-ink-3')}>
                {s.who}
              </p>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-[12px] leading-snug text-ink-3">
        A rejection by client or driver sends the job back to <span className="font-mono text-ink-2">bidding</span>.
      </p>
    </div>
  )
}

/* ── Funnel: single-series magnitude bars, values in ink ──────────────── */

type Row = { label: string; value: number; note: string }

function Funnel({ rows, color, caption }: { rows: Row[]; color: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [hover, setHover] = useState<number | null>(null)
  const max = rows[0].value
  const scale = (v: number) => v / max

  return (
    <figure ref={ref} className="rounded-2xl border border-line bg-paper/70 p-4 md:p-5">
      <figcaption className="eyebrow mb-4 flex items-center justify-between gap-3">
        <span>{caption}</span>
      </figcaption>
      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li
            key={r.label}
            className="group relative"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
              <span className={cn('transition-colors', hover === null || hover === i ? 'text-ink-2' : 'text-ink-4')}>{r.label}</span>
              <span className="font-mono font-medium text-ink tabular-nums">{r.value.toLocaleString('en-US')}</span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-line/60">
              <m.div
                className="h-2 rounded-full"
                style={{ background: color, opacity: hover === null || hover === i ? 1 : 0.35 }}
                initial={{ width: 0 }}
                animate={{ width: inView ? `${Math.max(scale(r.value) * 100, 1)}%` : 0 }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className={cn('mt-1 text-[11.5px] transition-colors', hover === i ? 'text-ink-2' : 'text-ink-3')}>
              {r.note}
            </p>
          </li>
        ))}
      </ul>
    </figure>
  )
}

/* ── Solana: the seven gates a new token must pass ────────────────────── */

const gates = [
  'Standard SPL token program',
  '≥ 10 holders',
  'Mint & freeze authority disabled',
  'Dev wallet ≤ 20% of supply',
  'No dev mints after launch',
  'Organic score not “low”',
  '≥ 5 traders in 24 h',
]

function Gates({ color }: { color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  return (
    <div ref={ref} className="rounded-2xl border border-line bg-paper/70 p-4 md:p-5">
      <p className="eyebrow mb-3">Token safety screen · all 7 must pass</p>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {gates.map((g, i) => (
          <m.li
            key={g}
            initial={{ opacity: 0, x: -6 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.06 * i, duration: 0.4 }}
            className="flex items-center gap-2 text-[12.5px] text-ink-2"
          >
            <span className="grid size-4 shrink-0 place-items-center rounded-full text-on-ink" style={{ background: color }}>
              <Check className="size-2.5" strokeWidth={3} aria-hidden />
            </span>
            {g}
          </m.li>
        ))}
      </ul>
      <p className="mt-3 border-t border-line pt-3 font-mono text-[11.5px] text-ink-3">
        then: quote ≤ 10 s old · re-quote ≥ 98% of expected · price-impact cap
      </p>
    </div>
  )
}

/* ── TradingView: the position rules ──────────────────────────────────── */

function RuleTable({ color }: { color: string }) {
  const rows = [
    { when: 'BUY', main: '+ add', open: '+ add', line: 'BUY line' },
    { when: 'SELL (full)', main: 'no change', open: '− remove', line: 'SELL line' },
    { when: 'SELL (partial)', main: 'no change', open: 'keep', line: 'SELL line' },
    { when: 'Side unknown', main: '+ add', open: 'no change', line: 'none' },
  ]
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper/70">
      <p className="eyebrow px-4 pt-4 md:px-5">Parsed trade → watchlist actions</p>
      <table className="mt-3 w-full text-left text-[12.5px]">
        <thead>
          <tr className="border-y border-line font-mono text-[10.5px] tracking-wider text-ink-3 uppercase">
            <th scope="col" className="px-4 py-2 font-normal md:px-5">Email says</th>
            <th scope="col" className="px-2 py-2 font-normal">Main</th>
            <th scope="col" className="px-2 py-2 font-normal">Open Positions</th>
            <th scope="col" className="px-2 py-2 pr-4 font-normal">Chart</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.when} className="border-b border-line/70 last:border-0">
              <th scope="row" className="px-4 py-2 font-mono font-medium text-ink md:px-5">
                <span className="mr-2 inline-block size-1.5 rounded-full align-middle" style={{ background: color }} aria-hidden />
                {r.when}
              </th>
              <td className="px-2 py-2 text-ink-2">{r.main}</td>
              <td className="px-2 py-2 text-ink-2">{r.open}</td>
              <td className="px-2 py-2 pr-4 text-ink-2">{r.line}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Geo QA: detection cascade ────────────────────────────────────────── */

function Cascade({ color }: { color: string }) {
  const layers = [
    { icon: FileText, title: 'DOM alert text', body: 'Cheap and exact when the site shows a warning.' },
    { icon: ScanText, title: 'Tesseract OCR', body: 'Reads the screenshot; matches 9 known error phrases.' },
    { icon: Eye, title: 'OpenCV SIFT match', body: 'Finds the broken-page icon inside the game frame.' },
  ]
  const verdicts = ['game_loads', 'provider_geo_not_allowed', 'internal_fail_message', 'internal_vpn_message']
  return (
    <div className="rounded-2xl border border-line bg-paper/70 p-4 md:p-5">
      <p className="eyebrow mb-3">Fall through until something is certain</p>
      <ol className="space-y-2">
        {layers.map((l, i) => (
          <li key={l.title} className="flex items-start gap-3" style={{ marginLeft: `${i * 14}px` }}>
            <span className="grid size-7 shrink-0 place-items-center rounded-lg text-on-ink" style={{ background: color }}>
              <l.icon className="size-3.5" aria-hidden />
            </span>
            <span className="text-[12.5px] leading-snug">
              <span className="font-medium text-ink">{l.title}</span>
              <span className="text-ink-3">: {l.body}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3">
        {verdicts.map((v, i) => (
          <span key={v} className="tag text-[10.5px]">
            {i === 0 ? <Check className="size-3 text-markets" aria-hidden /> : <X className="size-3 text-signal-ink" aria-hidden />}
            {v}
          </span>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { domains, projectBySlug } from '../data/projects'
import { cn } from '../lib/cn'

const principles = [
  {
    from: 'Requirement',
    to: 'State machine',
    before: 'Clients, truck owners, drivers and an operator all touching the same shipment, with no shared record of where it stands.',
    after:
      'One job record with an explicit status lifecycle and role-scoped routers. Transitions can only happen in order, and a rejection on either side rolls back cleanly.',
    example: 'pending → bidding → assigned → in_progress → completed → paid',
    slug: 'nichetrx',
  },
  {
    from: 'Manual chore',
    to: 'Unattended worker',
    before: 'Every ticker from the broker’s confirmation emails copied into TradingView by hand, and the list tidied after each sale.',
    after:
      'A poller that reads the inbox, parses the trade, applies the rules, drives the browser and remembers what it has already processed, so a restart never repeats work.',
    example: 'IMAP / 30 s → regex + PDF parse → buy/sell rules → Selenium → SHA-256 ledger',
    slug: 'tradingview-mail-watcher',
  },
  {
    from: 'Messy text',
    to: 'Structured signal',
    before: 'Tens of thousands of free-text listing titles like “2024 Topps Chrome … Rookie Refractor”, many with no player field at all.',
    after:
      'Entities you can join on: player, set, league, year and grade. A model fills only the gaps the data leaves, then deterministic rules do the matching.',
    example: 'BERT NER → Flair fallback → set › player › league › year → raw vs grade 9 / 10',
    slug: 'card-grading-arbitrage',
  },
  {
    from: 'Model',
    to: 'One stage of a pipeline',
    before: 'A support team answering the same vehicle-specific questions every day, with the answers buried in old tickets.',
    after:
      'Extraction, quality gates, a train/validation split with no leakage, automated fine-tuning and a feedback endpoint. The model is one box in the diagram, not the whole diagram.',
    example: 'osTicket MySQL → JSONL (380 / 50) → fine-tune → rated replies → next run',
    slug: 'support-gpt',
  },
  {
    from: 'Fast',
    to: 'Fast and guarded',
    before: 'Price gaps that close in seconds, and newly launched tokens that are mostly traps.',
    after:
      'Act only on quotes under ten seconds old. Re-quote the whole route before acting, cap price impact, and screen every new token against seven rules first.',
    example: 'quote TTL 10 s → re-quote ≥ 98% → impact cap → 7-rule token screen',
    slug: 'solana-bot-suite',
  },
  {
    from: 'Prototype',
    to: 'Something you can run',
    before: 'A service that only runs on the machine it was written on.',
    after:
      'Containers that wait for their database and migrate on start, systemd units, health checks that return exit codes, and logs you can filter when something goes wrong.',
    example: 'Docker entrypoint → Alembic → Uvicorn · systemd + health check · /logs dashboard',
    slug: 'nichetrx',
  },
]

export function Approach({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [active, setActive] = useState(0)

  return (
    <section id="approach" className="scroll-mt-24 py-20 md:py-28" aria-labelledby="approach-title">
      <div className="container-x">
        <SectionHeader
          label="Approach"
          title={<span id="approach-title">How I turn a problem into a system</span>}
          intro="Six moves I keep making. Each one is shown with a real example from the code."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          <ol className="divide-y divide-line border-y border-line">
            {principles.map((p, i) => {
              const isActive = i === active
              return (
                <li key={p.from + p.to}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    className="group flex w-full items-center gap-4 py-4 text-left md:py-5"
                  >
                    <span className={cn('font-mono text-[12px] transition-colors', isActive ? 'text-signal-ink' : 'text-ink-4')}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex flex-1 flex-wrap items-baseline gap-x-2.5 font-display text-[clamp(1.15rem,2vw,1.45rem)] font-semibold tracking-tight">
                      <span className={cn('transition-colors', isActive ? 'text-ink-3 line-through decoration-line-2 decoration-1' : 'text-ink-3')}>
                        {p.from}
                      </span>
                      <ArrowRight className={cn('size-4 self-center transition-colors', isActive ? 'text-signal' : 'text-ink-4')} aria-hidden />
                      <span className={cn('transition-colors', isActive ? 'text-ink' : 'text-ink-2 group-hover:text-ink')}>{p.to}</span>
                    </span>
                  </button>
                  {/* inline detail on small screens */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="pb-6">
                          <Detail p={p} onOpenProject={onOpenProject} />
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Detail p={principles[active]} onOpenProject={onOpenProject} />
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Detail({ p, onOpenProject }: { p: (typeof principles)[number]; onOpenProject: (slug: string) => void }) {
  const project = projectBySlug[p.slug]
  const d = domains[project.domain]
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-dashed border-line-2 bg-paper/70 px-5 py-5 md:px-7 md:py-6">
        <p className="eyebrow">Before · {p.from}</p>
        <p className="mt-2 font-display text-[1.15rem] leading-snug text-ink-2 italic md:text-[1.3rem]">{p.before}</p>
      </div>
      <div className="flex justify-center" aria-hidden>
        <span className="-my-3.5 grid size-7 place-items-center rounded-full border border-line bg-surface text-signal-ink shadow-sm">
          <ArrowDown className="size-3.5" />
        </span>
      </div>
      <div className="px-5 pt-5 pb-6 md:px-7 md:pb-7">
        <p className="eyebrow">After · {p.to}</p>
        <p className="mt-2 text-[1.02rem] leading-relaxed text-ink">{p.after}</p>
        <p className="mt-5 overflow-x-auto rounded-xl border border-line bg-paper px-4 py-3 font-mono text-[12px] leading-relaxed whitespace-nowrap text-ink-2">
          {p.example}
        </p>
        <button
          type="button"
          onClick={() => onOpenProject(project.slug)}
          className="group mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-ink"
        >
          <span className="size-2 rounded-full" style={{ background: d.color }} aria-hidden />
          Seen in {project.short}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </button>
      </div>
    </div>
  )
}

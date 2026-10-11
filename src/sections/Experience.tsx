import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight, Award, GraduationCap } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { profile, roles, type Role } from '../data/profile'
import { domains, projectBySlug } from '../data/projects'
import { cn } from '../lib/cn'

export function Experience({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [roleId, setRoleId] = useState(roles[0].id)
  const role = roles.find((r) => r.id === roleId) as Role

  return (
    <section id="experience" className="scroll-mt-24 py-20 md:py-28" aria-labelledby="experience-title">
      <div className="container-x">
        <SectionHeader
          index="05"
          label="Experience"
          title={<span id="experience-title">Three roles, one company, and the code along the way</span>}
          intro={`Since 2019 at ${profile.company}: promoted from Full Stack Developer to Senior, then to leading the Python & AI team. Pick a role to see what it covered and the projects that use the same skills.`}
        />

        {/* Role selector: vertical list on mobile, a row of three from md up */}
        <ol
          className="relative space-y-2 border-l border-line pl-5 md:grid md:grid-cols-3 md:gap-3 md:space-y-0 md:border-l-0 md:pl-0"
          aria-label="Roles"
        >
          {roles.map((r) => {
            const sel = r.id === roleId
            return (
              <li key={r.id} className="relative">
                <span
                  className={cn('absolute top-4 -left-[25px] size-2.5 rounded-full border-2 border-paper md:hidden', sel ? 'bg-signal' : 'bg-line-2')}
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => setRoleId(r.id)}
                  aria-pressed={sel}
                  className={cn(
                    'h-full w-full rounded-xl border px-4 py-3 text-left transition-colors',
                    sel ? 'border-ink bg-ink text-on-ink' : 'border-line bg-surface text-ink hover:border-line-2',
                  )}
                >
                  <span className={cn('block font-mono text-[11px]', sel ? 'text-on-ink/70' : 'text-ink-3')}>
                    {r.start} - {r.end === 'present' ? 'Present' : r.end}
                  </span>
                  <span className="mt-0.5 block text-[15px] font-medium">{r.title}</span>
                </button>
              </li>
            )
          })}
        </ol>

        {/* Role detail */}
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={role.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
            aria-live="polite"
          >
            <div className="card p-5 md:p-7">
              <p className="font-mono text-[12px] text-ink-3">
                {role.start} - {role.end === 'present' ? 'Present' : role.end} · {role.org}
              </p>
              <h3 className="mt-2 text-[1.6rem] leading-tight font-semibold text-ink">{role.title}</h3>
              <ul className="mt-5 space-y-2">
                {role.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2">
                    <span className="mt-[9px] h-px w-3 shrink-0 bg-ink-4" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Focus areas">
                {role.focus.map((f) => (
                  <li key={f} className="tag">
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="card p-5 md:p-6">
                <p className="eyebrow">Projects that use these skills</p>
                <ul className="mt-3 divide-y divide-line">
                  {role.related.map(({ slug, via }) => {
                    const p = projectBySlug[slug]
                    return (
                      <li key={slug}>
                        <button type="button" onClick={() => onOpenProject(slug)} className="group flex w-full items-start gap-3 py-2.5 text-left">
                          <span className="mt-[7px] size-2 shrink-0 rounded-full" style={{ background: domains[p.domain].color }} aria-hidden />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-medium text-ink">{p.short}</span>
                            <span className="block text-[13px] leading-snug text-ink-3">{via}</span>
                          </span>
                          <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-ink-4 group-hover:text-ink" aria-hidden />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="card flex gap-3 p-5">
                  <GraduationCap className="mt-0.5 size-5 shrink-0 text-ink-3" aria-hidden />
                  <div>
                    <p className="eyebrow">Education</p>
                    <p className="mt-1 text-[14.5px] font-medium text-ink">{profile.education.title}</p>
                    <p className="text-[13.5px] text-ink-3">{profile.education.body}</p>
                  </div>
                </div>
                <div className="card flex gap-3 p-5">
                  <Award className="mt-0.5 size-5 shrink-0 text-ink-3" aria-hidden />
                  <div>
                    <p className="eyebrow">Certification</p>
                    <p className="mt-1 text-[14.5px] font-medium text-ink">{profile.certification.title}</p>
                    <p className="text-[13.5px] leading-snug text-ink-3">{profile.certification.body}</p>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

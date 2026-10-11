import { m } from 'motion/react'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { ButtonLink } from '../components/Button'
import { SectionHeader } from '../components/SectionHeader'
import { profile, roles, skills, summary } from '../data/profile'

export function ResumeSection() {
  return (
    <section id="resume" className="scroll-mt-24 border-y border-line bg-surface py-20 md:py-28" aria-labelledby="resume-title">
      <div className="container-x">
        <SectionHeader
          index="06"
          label="Resume"
          title={<span id="resume-title">The two-page version</span>}
          intro="The same story as this site, in a format that suits recruiters and applicant-tracking systems: one column, plain text and standard headings."
        />

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div>
            <p className="text-[1.05rem] leading-relaxed text-ink-2">{summary}</p>

            <dl className="mt-8 divide-y divide-line border-y border-line">
              {skills.map((s) => (
                <div key={s.label} className="grid gap-1 py-3.5 sm:grid-cols-[150px_1fr] sm:gap-6">
                  <dt className="eyebrow pt-0.5">{s.label}</dt>
                  <dd className="text-[14.5px] leading-relaxed text-ink">{s.list}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {roles.map((r) => (
                <div key={r.id} className="rounded-xl border border-line bg-paper/60 px-4 py-3">
                  <p className="font-mono text-[11px] text-ink-3">
                    {r.start} - {r.end === 'present' ? 'Present' : r.end}
                  </p>
                  <p className="mt-1 text-[14px] leading-snug font-medium text-ink">{r.title}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={profile.resumePdf} download icon={<Download className="size-4" aria-hidden />}>
                Download PDF
              </ButtonLink>
              <ButtonLink href={profile.resumePdf} target="_blank" rel="noopener" variant="secondary" icon={<ExternalLink className="size-4" aria-hidden />}>
                View in browser
              </ButtonLink>
              <ButtonLink href={profile.resumeDocx} download variant="ghost" icon={<FileText className="size-4" aria-hidden />}>
                Word (.docx)
              </ButtonLink>
            </div>
            <p className="mt-4 font-mono text-[12px] text-ink-3">Updated October 2026 · 2 pages · A4</p>
          </div>

          <m.a
            href={profile.resumePdf}
            target="_blank"
            rel="noopener"
            className="group relative mx-auto block w-full max-w-[420px]"
            whileHover={{ y: -6, rotate: 0 }}
            initial={{ rotate: 1.5 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            aria-label="Open the resume PDF in a new tab"
          >
            <span className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-lg border border-line bg-paper-2" aria-hidden />
            <img
              src="/img/resume-preview.webp"
              alt="Preview of the first page of Anas Khan’s resume"
              width={820}
              height={1160}
              loading="lazy"
              decoding="async"
              className="relative w-full rounded-lg border border-line bg-white shadow-[var(--shadow-lift)]"
            />
            <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12.5px] font-medium text-on-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Open PDF <ExternalLink className="size-3.5" aria-hidden />
            </span>
          </m.a>
        </div>
      </div>
    </section>
  )
}

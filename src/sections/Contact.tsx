import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Download, Phone } from 'lucide-react'
import { ButtonLink } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { profile } from '../data/profile'
import { domains } from '../data/projects'

const fits = [
  { d: domains.platform, t: 'A product with several kinds of users', b: 'Roles, approvals, payments, uploads and live updates, in one backend that keeps them consistent.' },
  { d: domains.automation, t: 'A workflow that should run without anyone watching', b: 'Inboxes, sites, spreadsheets and screens turned into a worker with rules, retries and a record of what it did.' },
  { d: domains.ai, t: 'An AI feature that has to work on your own data', b: 'Extraction, cleaning, prompts or fine-tuning, and the plumbing that makes the model one dependable stage.' },
  { d: domains.markets, t: 'A market bot you can actually trust', b: 'Exchange, DEX or broker APIs with fee-aware logic, risk gates, alerts and an audit trail.' },
]

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-20 md:py-32" aria-labelledby="contact-title">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent_75%)]" aria-hidden />
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="text-signal-ink">07</span>
            <span className="h-px w-8 bg-line-2" aria-hidden />
            <span>Contact</span>
          </p>
          <h2 id="contact-title" className="max-w-[18ch] text-[clamp(2.4rem,6.4vw,5rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-ink">
            Turn a manual process into a system that runs.
          </h2>
          <p className="mt-6 max-w-[60ch] text-[1.08rem] leading-relaxed text-ink-2">
            If one of these sounds like the problem you have, get in touch by email or phone.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fits.map((f) => (
              <li key={f.t} className="card p-5">
                <span className="block h-1 w-8 rounded-full" style={{ background: f.d.color }} aria-hidden />
                <p className="mt-4 text-[15px] leading-snug font-semibold text-ink">{f.t}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{f.b}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col gap-6 border-t border-line pt-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="eyebrow">Email</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex min-w-0 items-center gap-2 font-display text-[clamp(1.35rem,4.2vw,2.6rem)] leading-tight font-semibold tracking-tight break-all text-ink"
                >
                  <span className="link-underline">{profile.email}</span>
                  <ArrowUpRight className="size-[0.8em] shrink-0 text-signal-ink transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-[13.5px] text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
                >
                  {copied ? <Check className="size-4 text-markets" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-ink-2">
                <a href={profile.phoneHref} className="link-underline inline-flex items-center gap-1.5">
                  <Phone className="size-4 text-ink-3" aria-hidden />
                  {profile.phoneDisplay}
                </a>
                <span className="text-ink-3">{profile.location}</span>
                {profile.links.linkedin && (
                  <a href={profile.links.linkedin} className="link-underline" target="_blank" rel="noopener">LinkedIn</a>
                )}
                {profile.links.github && (
                  <a href={profile.links.github} className="link-underline" target="_blank" rel="noopener">GitHub</a>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`mailto:${profile.email}?subject=${encodeURIComponent('Hello Anas')}`} magnetic icon={<ArrowUpRight className="size-4" aria-hidden />}>
                Write to Anas
              </ButtonLink>
              <ButtonLink href={profile.resumePdf} download variant="secondary" icon={<Download className="size-4" aria-hidden />}>
                Resume (PDF)
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

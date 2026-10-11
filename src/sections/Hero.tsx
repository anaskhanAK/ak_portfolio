import { useState } from 'react'
import { m } from 'motion/react'
import { ArrowDown, Check, Copy, Download, Mail, MapPin, Phone } from 'lucide-react'
import { ButtonLink } from '../components/Button'
import { LiveTrace } from '../components/LiveTrace'
import { profile } from '../data/profile'
import { projects } from '../data/projects'

const ease = [0.16, 1, 0.3, 1] as const

const proof = [
  { value: '6+ yrs', label: 'at Tassaract, promoted twice to Team Lead' },
  { value: String(projects.length), label: 'systems in this portfolio, across 4 domains' },
  { value: '96', label: 'API endpoints in the NicheTRX backend' },
  { value: '26,006', label: 'eBay listings run through an NER pipeline' },
]

export function Hero({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24" aria-labelledby="hero-title">
      {/* engineering-paper backdrop */}
      <div
        className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_60%_30%,black,transparent_75%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[620px] rounded-full bg-[radial-gradient(circle,rgb(232_84_28/0.10),transparent_65%)]"
        aria-hidden
      />

      <div className="container-x grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-7 lg:pt-6">
          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pr-3 pl-1.5 text-[13px] text-ink-2 shadow-[var(--shadow-card)] backdrop-blur"
          >
            <span className="rounded-full bg-signal-soft px-2 py-0.5 font-mono text-[11px] font-medium text-signal-ink">Now</span>
            {profile.role} · {profile.company}
          </m.p>

          <m.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease }}
            className="mt-6 text-[clamp(3.4rem,10vw,7.4rem)] leading-[0.9] font-semibold tracking-[-0.045em] text-ink"
          >
            Anas Khan
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="mt-6 max-w-[34ch] font-display text-[clamp(1.45rem,2.7vw,2.15rem)] leading-[1.18] font-medium tracking-[-0.02em] text-ink"
          >
            I build the systems behind real operations:{' '}
            <span className="text-platform">marketplaces</span>, <span className="text-markets">market bots</span> and{' '}
            <span className="text-ai">AI pipelines</span> that turn messy input into decisions and then act on them.
          </m.p>

          <m.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="mt-5 max-w-[58ch] text-[1.03rem] leading-relaxed text-ink-2"
          >
            Six years at {profile.company}, from Full Stack Developer to leading the Python &amp; AI team. Independently, I
            designed and built NicheTRX, a freight marketplace backend with five roles, live tracking and Stripe payments.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <ButtonLink href="#work" magnetic icon={<ArrowDown className="size-4" aria-hidden />}>
              Explore the work
            </ButtonLink>
            <ButtonLink
              href={profile.resumePdf}
              variant="secondary"
              download
              icon={<Download className="size-4" aria-hidden />}
            >
              Download resume
            </ButtonLink>
          </m.div>

          <m.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-ink-2"
            aria-label="Contact details"
          >
            <li className="flex items-center gap-1.5">
              <Mail className="size-4 text-ink-3" aria-hidden />
              <a href={`mailto:${profile.email}`} className="link-underline">
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="ml-0.5 inline-flex size-7 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
                aria-label={copied ? 'Email copied' : 'Copy email address'}
              >
                {copied ? <Check className="size-3.5 text-markets" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              </button>
            </li>
            <li className="flex items-center gap-1.5">
              <Phone className="size-4 text-ink-3" aria-hidden />
              <a href={profile.phoneHref} className="link-underline">
                {profile.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="size-4 text-ink-3" aria-hidden />
              {profile.location}
            </li>
          </m.ul>
        </div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="relative mx-auto flex w-full max-w-[460px] flex-col gap-4 lg:col-span-5 lg:max-w-none"
        >
          <figure className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-line bg-portrait shadow-[var(--shadow-lift)]">
            {/* soft studio light behind the cut-out portrait */}
            <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_50%_34%,var(--color-portrait-glow),transparent_75%)]" aria-hidden />
            <picture>
              <source type="image/avif" srcSet="/img/anas-cutout-400.avif 400w, /img/anas-cutout-640.avif 640w" sizes="400px" />
              <source type="image/webp" srcSet="/img/anas-cutout-400.webp 400w, /img/anas-cutout-640.webp 640w" sizes="400px" />
              {/* head-and-shoulders framing: scaled up and cropped at the chest */}
              <img
                src="/img/anas-cutout-640.png"
                alt="Portrait of Anas Khan"
                width={640}
                height={640}
                fetchPriority="high"
                className="absolute -bottom-[21%] left-1/2 h-[115%] w-auto max-w-none -translate-x-1/2 -scale-x-100"
              />
            </picture>
            <figcaption className="absolute top-3 left-3 rounded-full bg-surface/85 px-2.5 py-1 font-mono text-[10.5px] tracking-wide text-ink-2 backdrop-blur">
              {profile.role}
            </figcaption>
          </figure>
          <LiveTrace onOpenProject={onOpenProject} />
        </m.div>
      </div>

      <div className="container-x mt-16 md:mt-20">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {proof.map((p) => (
            <div key={p.label} className="bg-surface/90 px-5 py-5 md:px-6">
              <dt className="sr-only">{p.label}</dt>
              <dd className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-semibold tracking-tight text-ink">
                {p.value}
              </dd>
              <dd className="mt-2 text-[13px] leading-snug text-ink-3">{p.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

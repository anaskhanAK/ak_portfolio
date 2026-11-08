import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = {
  label: string
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
}

export function SectionHeader({ label, title, intro, aside }: Props) {
  return (
    <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-12 md:items-end">
      <Reveal className="md:col-span-8">
        <p className="mb-4 flex items-center gap-2.5 text-[13.5px] font-medium text-ink-2">
          <span className="h-4 w-1 rounded-full bg-signal" aria-hidden />
          {label}
        </p>
        <h2 className="text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-semibold text-ink">{title}</h2>
        {intro && <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-ink-2">{intro}</p>}
      </Reveal>
      {aside && (
        <Reveal delay={0.1} className="md:col-span-4 md:justify-self-end">
          {aside}
        </Reveal>
      )}
    </div>
  )
}

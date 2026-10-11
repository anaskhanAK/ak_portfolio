import { m, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}

/** Fade/rise on first scroll into view. Fully static when reduced motion is requested. */
export function Reveal({ children, delay = 0, y = 18, className, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const Comp = m[as]
  if (reduce) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  )
}

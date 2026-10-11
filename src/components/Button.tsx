import { useRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

const styles: Record<Variant, string> = {
  primary:
    'bg-ink text-on-ink hover:bg-ink-hover shadow-[0_1px_0_rgb(255_255_255/0.08)_inset,0_8px_20px_-10px_rgb(14_18_23/0.6)]',
  secondary: 'bg-surface text-ink border border-line-2 hover:border-ink/40',
  ghost: 'text-ink hover:bg-paper-2',
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
  icon?: ReactNode
  magnetic?: boolean
}

/** Link-styled button with an optional subtle magnetic pull on fine pointers. */
export function ButtonLink({ variant = 'primary', icon, magnetic = false, className, children, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!magnetic || !ref.current) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18
    const y = (e.clientY - (r.top + r.height / 2)) * 0.28
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <a
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'group inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-medium transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none',
        styles[variant],
        className,
      )}
      {...rest}
    >
      {children}
      {icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
    </a>
  )
}

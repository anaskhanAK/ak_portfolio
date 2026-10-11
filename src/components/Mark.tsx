import { cn } from '../lib/cn'

export function Mark({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-grid size-8 place-items-center rounded-[10px] bg-ink text-on-ink', className)} aria-hidden>
      <span className="font-display text-[13px] font-semibold tracking-tight">AK</span>
      <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-paper bg-signal" />
    </span>
  )
}

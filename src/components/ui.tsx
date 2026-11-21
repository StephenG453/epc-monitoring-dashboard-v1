import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { navigate } from '@/lib/router'
import { t } from '@/lib/i18n'
import type { PlantStatus } from '@/types/domain'

// The prototype's building blocks, one component each.

/** In-app link: real <a href> (open in new tab works), navigates without reloading. */
export function A({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={to}
      className={className}
      onClick={e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

export function DemoBadge({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 rounded-lg bg-orange-soft px-3 py-[9px] text-[11px] font-bold text-[#bc6c2b]">
      ✦&nbsp;&nbsp; {children}
    </div>
  )
}

export function PageHeading({ kicker, title, subtitle, right }: { kicker?: string; title?: string; subtitle?: ReactNode; right?: ReactNode }) {
  return (
    <div className="mt-[34px] mb-[25px] flex items-end justify-between gap-5">
      <div>
        {kicker && <div className="smallcaps text-[#ed8545]">{kicker}</div>}
        {title && <h1 className="my-2 text-[31px] font-bold tracking-[-0.04em]">{title}</h1>}
        {subtitle && <p className="text-[13px] text-[#8796a7]">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <A to={to} className="text-xs font-bold text-[#6e879c] hover:text-ink">
      ←&nbsp;&nbsp; {children}
    </A>
  )
}

export function StatCard({ icon, label, value, note, className }: { icon?: string; label: string; value: ReactNode; note: string; className?: string }) {
  return (
    <div className={cn('rounded-[13px] border border-line bg-white p-[19px] shadow-card', className)}>
      {icon && <span className="float-right rounded-[9px] bg-[#f5f7fa] p-2 leading-none text-blue">{icon}</span>}
      <div className="min-h-[30px] text-xs font-semibold text-[#8392a1]">{label}</div>
      <div className="mt-[13px] mb-[7px] text-[28px] font-[750] tracking-[-0.04em]">{value}</div>
      <small className="text-[11px] text-faint">{note}</small>
    </div>
  )
}

export function Panel({ title, sub, children, className }: { title?: ReactNode; sub?: string; children?: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-[13px] border border-line bg-white p-[22px] shadow-card', className)}>
      {title && <h2 className="mb-[5px] text-base font-bold">{title}</h2>}
      {sub && <span className="text-xs text-faint">{sub}</span>}
      {children}
    </section>
  )
}

export function Notice({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('mt-4 text-[11px] text-faint', className)}>{children}</p>
}

/** The pale orange explanation strip ("A Kromos cadastra e administra..."). */
export function Banner({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mt-4 rounded-[10px] border border-[#fae7d8] bg-[#fff5eb] px-[15px] py-[13px] text-xs leading-normal text-[#9d643c]', className)}>
      {children}
    </div>
  )
}

/** The blue-grey note strip used inside construction folders. */
export function WorkNote({ children }: { children: ReactNode }) {
  return <div className="mt-2.5 rounded-[9px] bg-[#f4f8fb] p-3 text-xs leading-normal text-[#657b90]">{children}</div>
}

/** Dark gradient banner at the top of plant pages. */
export function Hero({ kicker, title, subtitle, label }: { kicker: string; title: string; subtitle: string; label: string }) {
  return (
    <div className="mb-[18px] flex items-center justify-between gap-5 rounded-2xl bg-[linear-gradient(120deg,#172d47,#285779)] px-7 py-[26px] text-white">
      <div>
        <div className="smallcaps text-[#ffb47b]">{kicker}</div>
        <h1 className="my-[9px] text-[30px] font-bold tracking-[-0.04em]">{title}</h1>
        <p className="text-[13px] whitespace-pre-wrap text-[#c1d5e3]">{subtitle}</p>
      </div>
      <div className="rounded-[22px] border border-white/15 bg-white/10 px-3 py-[9px] text-[11px] whitespace-nowrap">{label}</div>
    </div>
  )
}

const statusStyle: Record<PlantStatus, string> = {
  in_progress: 'bg-[#e8f5fb] text-[#1688b4]',
  awaiting: 'bg-[#fff2e6] text-[#d17b34]',
  delivered: 'bg-[#e7f8f0] text-[#258e67]',
}
export const statusLabel = (s: PlantStatus) =>
  t(s === 'in_progress' ? 'Em execução' : s === 'delivered' ? 'Entregue' : 'Aguardando início')

export function StatusPill({ status }: { status: PlantStatus }) {
  return <span className={cn('rounded-[20px] px-[9px] py-1.5 text-[10px] font-bold whitespace-nowrap', statusStyle[status])}>{statusLabel(status)}</span>
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <span className="mr-2 inline-block h-[5px] w-[90px] rounded-[9px] bg-[#e9eef3] align-middle">
      <i className="block h-full rounded-[9px] bg-[#1691bd]" style={{ width: `${value}%` }} />
    </span>
  )
}

/** Ring chart: segments as [colour, value]; the centre shows `label`. */
export function Donut({ segments, label, size = 150, hole = 110 }: { segments: [string, number][]; label: ReactNode; size?: number; hole?: number }) {
  const total = segments.reduce((n, [, v]) => n + v, 0) || 1
  let at = 0
  const stops = segments.map(([c, v]) => {
    const from = (at / total) * 100
    at += v
    return `${c} ${from}% ${(at / total) * 100}%`
  })
  return (
    <div className="grid shrink-0 place-items-center rounded-full" style={{ width: size, height: size, background: `conic-gradient(${stops.join(',')})` }}>
      <div className="grid place-items-center rounded-full bg-white text-[27px] font-extrabold" style={{ width: hole, height: hole }}>
        {label}
      </div>
    </div>
  )
}

export function AlertRow({ icon, title, desc, count }: { icon: string; title: string; desc: string; count: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-[10px] border border-[#edf1f5] p-3.5">
      <i className="rounded-lg bg-[#fff3e9] p-2.5 not-italic leading-none">{icon}</i>
      <div>
        <strong className="mb-1 block text-xs">{title}</strong>
        <span className="text-[11px] text-faint">{desc}</span>
      </div>
      <b className="ml-auto text-[19px]">{count}</b>
    </div>
  )
}

export function Button({ variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        variant === 'primary'
          ? 'rounded-[9px] bg-orange px-6 py-[15px] font-bold text-white hover:bg-orange-hover'
          : 'rounded-[7px] border border-[#f58235] bg-white px-3.5 py-2.5 text-xs text-[#d76c29] hover:bg-[#fff9f5]',
        className,
      )}
    />
  )
}

/** "Próxima tela" dialog, for areas the prototype hasn't designed yet. */
export function ComingSoon({ title, onClose }: { title: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!title) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [title, onClose])
  if (!title) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#10243d88] p-5" onClick={e => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="coming-title" className="w-full max-w-[420px] rounded-[15px] bg-white p-7 shadow-[0_20px_60px_#0003]">
        <span className="smallcaps text-[#f99d5f]">{t('Próxima tela')}</span>
        <h2 id="coming-title" className="mt-3 text-xl font-bold">{title}</h2>
        <p className="my-3 text-sm leading-relaxed text-muted">{t('Esta área será detalhada nas próximas etapas da construção da prévia.')}</p>
        <Button onClick={onClose} autoFocus>{t('Entendi')}</Button>
      </div>
    </div>
  )
}

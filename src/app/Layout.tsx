import { useSyncExternalStore, type ReactNode } from 'react'
import { Logo } from '@/components/Logo'
import { A, ComingSoon } from '@/components/ui'
import { navigate, paths, type Route } from '@/lib/router'
import { setLang, t, useLang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// The app frame: fixed navy sidebar on the left, top bar with breadcrumbs and the user, page below.

// "Próxima tela" dialog, opened from anywhere (sidebar, shortcuts, example plants).
let comingTitle: string | null = null
const comingListeners = new Set<() => void>()
export function openComingSoon(title: string | null) {
  comingTitle = title
  comingListeners.forEach(f => f())
}
const useComingSoon = () => useSyncExternalStore(f => { comingListeners.add(f); return () => comingListeners.delete(f) }, () => comingTitle)

/** The one real plant; the sidebar's Documents and Construction open its folders. */
const DEFAULT_PLANT = 'lighthouse-1'

type NavKey = 'overview' | 'plants' | 'documents' | 'works' | 'indicators' | 'equipment'

function activeKey(r: Route): NavKey {
  switch (r.page) {
    case 'plants': case 'plant': return 'plants'
    case 'documents': case 'docFolder': case 'docItem': return 'documents'
    case 'works': case 'workFolder': case 'workForm': return 'works'
    default: return 'overview'
  }
}

function Sidebar({ route }: { route: Route }) {
  const active = activeKey(route)
  const items: { key: NavKey; icon: string; label: string; to?: string }[] = [
    { key: 'overview', icon: '◫', label: t('Visão geral'), to: paths.overview() },
    { key: 'plants', icon: '☀', label: t('Minhas usinas'), to: paths.plants() },
    { key: 'documents', icon: '▤', label: t('Documentos'), to: paths.documents(DEFAULT_PLANT) },
    { key: 'works', icon: '⌁', label: t('Obras'), to: paths.works(DEFAULT_PLANT) },
    { key: 'indicators', icon: '◷', label: t('Indicadores') },
    { key: 'equipment', icon: '⚙', label: t('Equipamentos') },
  ]
  const cls = (on: boolean) => cn(
    'block w-full rounded-[9px] p-[13px] text-left text-[13px]',
    on ? 'border-l-[3px] border-orange bg-white/8 font-bold text-white' : 'text-[#a9bdce] hover:bg-white/5 hover:text-white',
  )
  return (
    <aside className="fixed inset-y-0 left-0 flex w-[232px] flex-col bg-navy px-[17px] py-[25px] text-white">
      <A to={paths.overview()} className="mb-9 block rounded-xl bg-white px-4 py-4 text-ink">
        <Logo className="mx-auto block w-[150px]" gradientId="kromos-k-side" />
      </A>
      <div className="mx-3 mb-3 text-[10px] font-bold tracking-[0.16em] text-[#8094a9]">{t('MENU PRINCIPAL')}</div>
      <nav className="grid gap-0.5">
        {items.map(i =>
          i.to ? (
            <A key={i.key} to={i.to} className={cls(active === i.key)}>{i.icon}&nbsp;&nbsp; {i.label}</A>
          ) : (
            <button key={i.key} type="button" className={cls(false)} onClick={() => openComingSoon(i.label)}>{i.icon}&nbsp;&nbsp; {i.label}</button>
          ),
        )}
      </nav>
      <div className="mt-auto p-3 text-xs leading-[1.7] text-[#9db0c0]">
        {t('GESTÃO DE USINAS')}<br />
        <strong className="text-white">{t('Uma visão para ir mais longe.')}</strong><br />
        {t('Prévia visual · Kromos Energy')}
      </div>
    </aside>
  )
}

export function LangSwitch({ className }: { className?: string }) {
  const lang = useLang()
  return (
    <div className={cn('flex overflow-hidden rounded-lg border border-field text-[11px] font-bold', className)} role="group" aria-label="Idioma / Language">
      {(['pt', 'en'] as const).map(l => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}
          className={cn('px-2.5 py-1.5 uppercase', lang === l ? 'bg-ink text-white' : 'bg-white text-muted hover:text-ink')}>
          {l}
        </button>
      ))}
    </div>
  )
}

export type Crumb = { label: string; to?: string }

function TopBar({ crumbs, bell }: { crumbs: Crumb[]; bell?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[#e2e9f0] pb-[19px]">
      <div className="text-xs text-[#99a7b4]">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <span key={i}>
              {i > 0 && <>&nbsp;&nbsp;/&nbsp;&nbsp;</>}
              {last ? <strong className="text-[#53677b]">{c.label}</strong>
                : c.to ? <A to={c.to} className="hover:text-ink">{c.label}</A> : c.label}
            </span>
          )
        })}
      </div>
      <div className="flex items-center gap-3 text-xs">
        <LangSwitch />
        {bell && <span aria-hidden>🔔</span>}
        <span className="rounded-full bg-[#e8edf2] p-2.5 font-bold">KR</span>
        <span><b>{t('Equipe Kromos')}</b><br /><span className="text-[#99a7b4]">{t('Visão demonstrativa')}</span></span>
        <button type="button" className="text-[#7a8b9a] hover:text-ink" onClick={() => navigate(paths.login())}>{t('Sair')}</button>
      </div>
    </div>
  )
}

export function AppShell({ route, crumbs, bell, children }: { route: Route; crumbs: Crumb[]; bell?: boolean; children: ReactNode }) {
  const coming = useComingSoon()
  return (
    <div className="min-h-screen">
      <Sidebar route={route} />
      <main className="ml-[232px] max-w-[1800px] px-[38px] pt-[27px] pb-[55px]">
        <TopBar crumbs={crumbs} bell={bell} />
        {children}
      </main>
      <ComingSoon title={coming} onClose={() => openComingSoon(null)} />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Panel, ProgressBar, StatusPill, statusLabel } from '@/components/ui'
import { openComingSoon } from '@/app/Layout'
import { navigate, paths } from '@/lib/router'
import { getLang, t } from '@/lib/i18n'
import { plants } from '@/data/plants'
import type { PlantStatus } from '@/types/domain'

// "Suas usinas": searchable, filterable plant list. Used on the overview and on "Minhas usinas".

export function PlantTable() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<PlantStatus | ''>('')

  const rows = useMemo(() => {
    const locale = getLang() === 'pt' ? 'pt-BR' : 'en'
    const q = query.trim().toLocaleLowerCase(locale)
    return plants.filter(p => {
      const text = `${p.name} ${p.location || t('Localização ilustrativa')}`.toLocaleLowerCase(locale)
      return text.includes(q) && (!status || p.status === status)
    })
  }, [query, status])

  const open = (id: string, name: string) => {
    const p = plants.find(x => x.id === id)
    if (p && !p.isExample) navigate(paths.plant(id))
    else openComingSoon(name)
  }

  return (
    <Panel className="mt-[17px]">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h2 className="mb-[5px] text-base font-bold">{t('Suas usinas')}</h2>
          <span className="text-xs text-faint">{t('Busque e acompanhe cada projeto · lista ilustrativa')}</span>
        </div>
        <div className="flex gap-[9px]">
          <input
            type="search"
            className="field w-[220px]"
            placeholder={`⌕  ${t('Buscar usina ou cidade')}`}
            aria-label={t('Buscar usina')}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select className="field w-[170px]" aria-label={t('Filtrar situação')} value={status} onChange={e => setStatus(e.target.value as PlantStatus | '')}>
            <option value="">{t('Todas as situações')}</option>
            {(['in_progress', 'awaiting', 'delivered'] as const).map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
        </div>
      </div>

      <table className="mt-5 w-full border-collapse text-left">
        <thead>
          <tr className="text-[10px] tracking-[0.08em] text-[#9ba8b4] uppercase">
            {[t('Usina'), t('Localização'), t('Situação'), t('Avanço'), ''].map((h, i) => (
              <th key={i} className="border-b border-[#edf1f4] p-3 font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.id} className="text-xs">
              <td className="border-b border-[#f0f3f6] px-3 py-[15px] font-bold">☀&nbsp;&nbsp; {p.name}</td>
              <td className="border-b border-[#f0f3f6] px-3 py-[15px]">{p.location || t('Localização ilustrativa')}</td>
              <td className="border-b border-[#f0f3f6] px-3 py-[15px]"><StatusPill status={p.status} /></td>
              <td className="border-b border-[#f0f3f6] px-3 py-[15px]"><ProgressBar value={p.progress} />{p.progress}%</td>
              <td className="border-b border-[#f0f3f6] px-3 py-[15px] text-right">
                <button type="button" className="font-bold text-[#1789b3] hover:underline" onClick={() => open(p.id, p.name)}>{t('Abrir')} →</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <div className="p-[25px] text-center text-[13px] text-faint">{t('Nenhuma usina encontrada.')}</div>}
      <p className="mt-4 text-[11px] text-faint">{t('Lista reduzida para demonstração. Nomes e percentuais apresentados como exemplos; situação real da Lighthouse 1 não informada.')}</p>
    </Panel>
  )
}

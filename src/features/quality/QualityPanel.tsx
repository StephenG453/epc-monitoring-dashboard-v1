import { Button } from '@/components/ui'
import { FormFields } from '@/features/forms/FormFields'
import { labelOf, str, YES, type Field, type Values } from '@/features/forms/schema'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { ALL_QUALITY_FIELDS, REQUIRED_FULL, REQUIRED_SIMPLE, afterIndicators, fullBlocks, indicators, simplified } from './definition'

// One quality record for one stage of one record (a drainage section, a lot, a run...). Collapsed until a
// discrepancy is recorded. "Gestão total" opens inside it, keeping the same occurrence.
//
// Flow (manual 3.7): simplified + resolved → save and send closes it. Not resolved → stays pending.
// Full: verified as resolved → close; not resolved → stays open, revise cause and action, verify again.
// Nothing restarts after closing.

export type QualityRecord = Values & {
  _open?: boolean
  _full?: boolean
  /** Set when sent: 'completed' (resolved) or 'pending'. */
  _state?: 'completed' | 'pending'
  _fullDone?: boolean
  _msg?: string
}

/** An occurrence that is recorded and not resolved: listed as an outstanding issue of its record. */
export const isOpenIssue = (q: QualityRecord | undefined) =>
  !!q && !!str(q, 'occurrence') && str(q, 'resolved') !== YES && !q._fullDone

export function QualityPanel({ stageTitle, title, context, value: q, onChange, checkRecord, simpleOnly, before = [] }: {
  stageTitle: string
  /** Header text; defaults to "Gestão simplificada — {stage}". */
  title?: string
  /** "DR-01 / Materiais": the record and stage this occurrence is linked to. */
  context: string
  value: QualityRecord
  onChange: (patch: Partial<QualityRecord>) => void
  /** Record-level check before sending (e.g. the section code); returns an error message or null. */
  checkRecord: () => string | null
  /** Simplified management only, no "Gestão total": the approved exception for 2.4 setting out (manual 3.7). */
  simpleOnly?: boolean
  /** Required fields shown before the occurrence, e.g. which marking item it belongs to. */
  before?: Field[]
}) {
  const set = (k: string, v: unknown) => onChange({ [k]: v })

  const missing = (keys: string[]) => {
    const k = keys.find(k => !str(q, k))
    return k ? t('Preencha: {field}', { field: t(labelOf([...before, ...ALL_QUALITY_FIELDS], k) ?? k) }) : null
  }

  const send = (full: boolean) => {
    const recordError = checkRecord()
    if (recordError) return onChange({ _msg: recordError })
    const keys = [...before.flatMap(f => ('key' in f ? [f.key] : [])), ...(full ? REQUIRED_FULL : REQUIRED_SIMPLE)]
    if (!full && str(q, 'resolved') === YES) keys.push('solution')
    if (str(q, 'extraCost') === YES) keys.push('cost')
    const error = missing(keys)
    if (error) return onChange({ _msg: error })
    if (full && str(q, 'fullResolved') !== YES) {
      return onChange({ _msg: t('Ainda não resolvido. Revise a causa e a ação; depois verifique novamente.') })
    }
    const patch: Partial<QualityRecord> = full ? { _fullDone: true, solution: str(q, 'fullDone'), resolved: YES } : {}
    const done = full || str(q, 'resolved') === YES
    onChange({
      ...patch,
      _state: done ? 'completed' : 'pending',
      _msg: t('{status} · {context} · indicadores registrados · envio simulado.', {
        status: done ? t('Ocorrência finalizada') : t('Ocorrência pendente'),
        context,
      }),
    })
  }

  const status = q._state === 'completed' ? t('Finalizada') : q._state === 'pending' || isOpenIssue(q) ? t('Pendente') : null

  return (
    <section className="mt-6 rounded-[9px] border border-[#cbdff0] bg-[#f6faff]">
      <button type="button" aria-expanded={!!q._open} onClick={() => set('_open', !q._open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[#cf5c13]">
        <span>{q._open ? '▾' : '▸'}&nbsp; {title ?? `${t('Gestão simplificada')} — ${t(stageTitle)}`}</span>
        {status && (
          <span className={cn('rounded-[20px] px-2.5 py-1 text-[10px] font-bold',
            q._state === 'completed' ? 'bg-[#e7f8f0] text-[#258e67]' : 'bg-[#fff2e6] text-[#d17b34]')}>
            {status}
          </span>
        )}
      </button>

      {q._open && (
        <div className="px-4 pb-4">
          <small className="block text-[11px] text-[#6a8099]">{context}</small>
          <FormFields fields={before} values={q} onChange={set} />
          <FormFields fields={simplified} values={q} onChange={set} />
          <div className="flex flex-wrap gap-x-8"><FormFields fields={indicators} values={q} onChange={set} /></div>
          <FormFields fields={afterIndicators} values={q} onChange={set} />

          <div className="mt-[18px] flex flex-wrap justify-end gap-3">
            {!simpleOnly && <Button variant="outline" onClick={() => set('_full', !q._full)} aria-expanded={!!q._full}>{t('Gestão total')}</Button>}
            <Button className="px-[17px] py-3 text-sm" onClick={() => send(false)}>{t('Salvar e enviar')}</Button>
          </div>
          {q._msg && !q._full && <p role="status" className="mt-3 rounded-[7px] bg-[#fff1e4] p-3 text-xs text-[#805419]">{q._msg}</p>}

          {q._full && !simpleOnly && (
            <div className="mt-5 border-t border-[#cfdeed] pt-5">
              <h4 className="text-[15px] font-bold">{t('Gestão total')}</h4>
              <FullBlock n={1} title="Identificação da ocorrência">
                <p className="mt-2 text-xs text-[#6a8099]">{context} · {str(q, 'occurrence') || t('Usa a ocorrência acima.')}</p>
              </FullBlock>
              {fullBlocks.map((b, i) => (
                <FullBlock key={b.title} n={i + 2} title={b.title}>
                  <FormFields fields={b.fields} values={q} onChange={set} />
                </FullBlock>
              ))}
              <div className="mt-4 flex justify-end">
                <Button className="px-[17px] py-3 text-sm" onClick={() => send(true)}>{t('Registrar indicadores e finalizar')}</Button>
              </div>
              {q._msg && <p role="status" className="mt-3 rounded-[7px] bg-[#fff1e4] p-3 text-xs text-[#805419]">{q._msg}</p>}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function FullBlock({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <details open className="border-t border-[#dce6f0] py-[15px]">
      <summary className="cursor-pointer text-[13px] font-semibold">{n}. {t(title)}</summary>
      {children}
    </details>
  )
}

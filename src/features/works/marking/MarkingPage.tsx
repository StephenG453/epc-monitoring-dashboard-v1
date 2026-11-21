import { useState } from 'react'
import { BackLink, Banner, Button, DemoBadge, Notice } from '@/components/ui'
import { FormEnvProvider, FormFields } from '@/features/forms/FormFields'
import { rows, str, sub, type Values } from '@/features/forms/schema'
import { QualityPanel, type QualityRecord } from '@/features/quality/QualityPanel'
import { getDraft, setField, useDrafts } from '@/features/works/forms/draft'
import { paths } from '@/lib/router'
import { t } from '@/lib/i18n'
import { cn, pad2 } from '@/lib/utils'
import type { Plant, WorkFolder } from '@/types/domain'
import { ITEMS, QUALITY_ITEM, occurrenceItem } from './definition'

// 2.4 Locação e marcação em campo: the thirteen items to mark in a left column, the selected item's form on
// the right, and item 14, the setting-out occurrences (simplified management only, manual 3.7).

const DRAFT = 'marcacao'

export function MarkingPage({ plant, folder, startAtQuality }: { plant: Plant; folder: WorkFolder; startAtQuality?: boolean }) {
  useDrafts()
  const draft = getDraft(DRAFT)
  const [active, setActive] = useState(startAtQuality ? ITEMS.length : 0)
  const [msg, setMsg] = useState('')
  const names = [...ITEMS.map(i => i.name), QUALITY_ITEM]
  const isQuality = active === ITEMS.length

  const values = sub(draft, `item${active}`)
  const set = (k: string, v: unknown) => setField(DRAFT, `item${active}`, { ...sub(getDraft(DRAFT), `item${active}`), [k]: v })

  return (
    <FormEnvProvider value={{ vars: { epc: plant.epcName } }}>
      <div className="mt-[34px] mb-[25px] flex items-end justify-between gap-5">
        <div>
          <BackLink to={paths.workFolder(plant.id, folder.id)}>{t('Voltar às etapas')}</BackLink>
          <h1 className="mt-3 mb-2 text-[31px] font-bold tracking-[-0.04em]">{t('Locação e marcação em campo')}</h1>
          <p className="mb-1 text-[13px] text-ink-soft">{t(folder.name)}</p>
          <p className="text-[13px] text-[#8796a7]">{t('Preenchimento:')} <b>{plant.epcName}</b> · {t('Acompanhamento:')} <b>Kromos</b></p>
        </div>
        <DemoBadge>{t('PRÉVIA VISUAL')}</DemoBadge>
      </div>
      <Banner>{t('Prévia visual: dados e anexos não são salvos nem enviados.')}</Banner>

      <div className="mt-5 grid grid-cols-[250px_minmax(0,1fr)] items-start gap-5">
        <nav aria-label={t('Itens a marcar')} className="sticky top-4 rounded-[13px] border border-line bg-white p-3">
          <h3 className="px-2 pt-1 pb-2 text-xs font-bold tracking-[0.08em] text-[#8094a9] uppercase">{t('Itens a marcar')}</h3>
          {names.map((n, i) => (
            <button key={n} type="button" onClick={() => { setActive(i); setMsg(''); window.scrollTo(0, 0) }}
              aria-current={i === active ? 'true' : undefined}
              className={cn('block w-full rounded-lg px-2.5 py-2 text-left text-xs',
                i === active ? 'bg-[#fff1e5] font-bold text-[#c25e1c]' : 'text-ink-soft hover:bg-[#f5f7fa]',
                i === ITEMS.length && 'mt-2 border-t border-line pt-3')}>
              {i + 1}. {t(n)}
            </button>
          ))}
        </nav>

        <section className="rounded-[13px] border border-[#e1e8ef] bg-white p-[22px]">
          <h2 className="text-xl font-bold">{active + 1}. {t(names[active])}</h2>
          {isQuality ? (
            <Occurrences epc={plant.epcName} />
          ) : (
            <>
              <FormFields key={active} fields={ITEMS[active].fields} values={values} onChange={set} />
              {msg && <div role="status" className="mt-4 rounded-lg bg-[#edf5fb] p-3 text-xs">{msg}</div>}
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setMsg(t('Demonstração: nenhum dado ou anexo foi salvo ou enviado.'))}>{t('Salvar rascunho')}</Button>
                <Button onClick={() => setMsg(t('Demonstração: nenhum dado ou anexo foi salvo ou enviado.'))}>{t('Enviar à Kromos')}</Button>
              </div>
              <Notice>{t('Ocorrências e soluções ficam no item 14 Gestão simplificada.')}</Notice>
            </>
          )}
        </section>
      </div>
    </FormEnvProvider>
  )
}

/** Item 14: independent, numbered occurrences ("Adicionar ocorrência"), simplified management only. */
function Occurrences({ epc }: { epc: string }) {
  const list = rows(getDraft(DRAFT), 'occurrences') as QualityRecord[]
  const save = (next: QualityRecord[]) => setField(DRAFT, 'occurrences', next)
  const update = (i: number, patch: Partial<QualityRecord>) => save(list.map((q, j) => (j === i ? { ...q, ...patch } : q)))
  const label = (q: QualityRecord) => (q._state === 'completed' ? t('Finalizada') : q._state === 'pending' ? t('Pendente') : t('Rascunho'))

  return (
    <>
      <p className="mt-2 text-xs text-[#6a8099]">{t('Registre aqui as ocorrências da marcação, uma por registro. A {epc} preenche; a Kromos acompanha.', { epc })}</p>
      {list.map((q, i) => (
        <QualityPanel
          key={i}
          stageTitle={QUALITY_ITEM}
          title={`${t('Ocorrência')} ${pad2(i + 1)} · ${label(q)}`}
          context={`2.4 / ${str(q as Values, 'item') ? t(str(q as Values, 'item')) : t('Item não selecionado')}`}
          value={{ _open: true, ...q }}
          onChange={p => update(i, p)}
          checkRecord={() => null}
          simpleOnly
          before={occurrenceItem}
        />
      ))}
      <div className="mt-4">
        <Button variant="outline" onClick={() => save([...list.map(q => ({ ...q, _open: false })), { _open: true }])}>+ {t('Adicionar ocorrência')}</Button>
      </div>
    </>
  )
}

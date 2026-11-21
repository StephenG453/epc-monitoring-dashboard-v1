import { useState } from 'react'
import { BackLink, Banner, Button, Panel } from '@/components/ui'
import { FormEnvProvider, FormFields } from '@/features/forms/FormFields'
import { CUSTOM_POINT, labelOf, str, YES, type Values } from '@/features/forms/schema'
import { QualityPanel, isOpenIssue, type QualityRecord } from '@/features/quality/QualityPanel'
import { getDraft, getField, setField, useDrafts } from '@/features/works/forms/draft'
import { WorksFrame } from '@/features/works/WorksPage'
import { paths } from '@/lib/router'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { Plant, WorkFolder } from '@/types/domain'
import type { CatalogItem, RecordsConfig } from './config'

// Records with stages (2.5 drainage, 2.6 foundations...): records identified by their design code, the same
// stages in each, quality management per stage, outstanding issues gathered at completion. Records live in
// the in-memory draft until there is a database.

type Rec = {
  id: string
  /** Index in the type column, when the folder has one. */
  type: number
  values: Values
  materials: Values[]
  quality: QualityRecord[]
  msg?: string
  /** The catalog item (lot) this record is for, when the folder picks records from a catalog. */
  item?: string
}

let seq = 0
const newRecord = (c: RecordsConfig, type: number, item?: CatalogItem): Rec => ({
  id: `r${Date.now()}-${seq++}`, type, item: item?.code, values: item ? { code: item.code } : {},
  materials: [{}], quality: c.stages.map(() => ({})),
})

export function RecordsPage({ plant, folder, config: c }: { plant: Plant; folder: WorkFolder; config: RecordsConfig }) {
  useDrafts()
  const [type, setType] = useState(0)
  const [catalogMsg, setCatalogMsg] = useState('')
  const [navStage, setNavStage] = useState(0)
  // Catalog items available under the selected type (all of them when items have no type).
  const typeItems = c.catalog?.items.filter(i => i.type === undefined || i.type === type) ?? []
  // Each type opens with one record (a catalog folder with its first item), as in the prototype, except
  // `noSeedTypes`. Seeded quietly (no re-render during render).
  const all = getField<Rec[]>(c.draft, 'records', [])
  const undetailed = !!c.undetailed?.types.includes(type)
  if (!all.some(r => r.type === type) && !undetailed && !c.noSeedTypes?.includes(type) && (!c.catalog || typeItems.length)) {
    getDraft(c.draft).records = [...all, newRecord(c, type, typeItems[0])]
  }
  const records = getField<Rec[]>(c.draft, 'records', [])
  const save = (next: Rec[]) => setField(c.draft, 'records', next)
  const update = (id: string, f: (r: Rec) => Rec) => save(records.map(r => (r.id === id ? f(r) : r)))
  const labels = { ...c.labels, ...c.typeLabels?.(type) }

  // Codes for point fields (2.7: pull boxes already entered, plus codes typed into origins and destinations).
  const sources: Record<string, string[]> = { ...c.sources }
  if (c.points) {
    const codes = new Set<string>()
    for (const r of records) {
      if (r.type === c.points.fromType && str(r.values, 'code')) codes.add(str(r.values, 'code'))
      for (const k of c.points.keys) if (str(r.values, `${k}Code`)) codes.add(str(r.values, `${k}Code`))
    }
    sources[c.points.source] = [...codes]
  }

  const designKey = c.designPerType || c.typeDesigns ? `design${type}` : 'design'
  const design = getField<Values>(c.draft, designKey, {})
  const typeDesign = c.typeDesigns?.[type]

  // Catalog folders: 1. pick the design, 2. pick the item (lot), then add it, or reopen it if already added.
  const cat = c.catalog
  const pickKey = c.types ? `catalog${type}` : 'catalog'
  const pick = getField<Values>(c.draft, pickKey, { design: cat?.designOptions[0] ?? '', item: typeItems[0]?.code ?? '' })
  const setPick = (k: string, v: string) => { setField(c.draft, pickKey, { ...pick, [k]: v }); setCatalogMsg('') }
  const addFromCatalog = () => {
    const item = typeItems.find(i => i.code === pick.item)
    if (!cat || (cat.designLabel && !pick.design) || !item) return setCatalogMsg(t(c.labels.codeMissing))
    if (records.some(r => r.item === item.code)) {
      setCatalogMsg(t('{code} já foi adicionado. O registro está abaixo.', { code: item.code }))
      document.getElementById(`rec-${item.code}`)?.scrollIntoView({ block: 'start' })
      return
    }
    save([...records, newRecord(c, type, item)])
    setCatalogMsg('')
  }

  const list = undetailed ? (
    // Not detailed yet (manual): no forms to fill until Bruno approves them.
    <Banner className="mt-7">{t(c.undetailed!.note)}</Banner>
  ) : (
    <>
      {cat ? (
        <div className={cn('mt-7 grid items-end gap-[18px] rounded-xl border border-[#d9e5f0] p-5', cat.designLabel ? 'grid-cols-[1fr_1fr_auto]' : 'grid-cols-[1fr_auto]')}>
          {cat.designLabel && (
            <label className="block text-xs font-bold">{t(cat.designLabel)}
              <select className="field mt-2" value={str(pick, 'design')} onChange={e => setPick('design', e.target.value)}>
                <option value="">{t('Selecionar')}</option>
                {cat.designOptions.map(o => <option key={o} value={o}>{t(o)}</option>)}
              </select>
            </label>
          )}
          <label className="block text-xs font-bold">{t(cat.itemLabel)}
            <select className="field mt-2" value={str(pick, 'item')} onChange={e => setPick('item', e.target.value)}>
              <option value="">{t('Selecionar')}</option>
              {typeItems.map(i => <option key={i.code} value={i.code}>{i.code}</option>)}
            </select>
          </label>
          <Button className="px-[17px] py-3 text-sm" onClick={addFromCatalog}>+ {t(c.typeLabels ? labels.add : cat.addLabel)}</Button>
          {catalogMsg && <p role="status" className="col-span-full rounded-[7px] bg-[#fff1e4] p-3 text-xs text-[#805419]">{catalogMsg}</p>}
        </div>
      ) : (c.types || !c.single) && (
        <div className="mt-7 flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-bold">{c.types ? t(c.types.names[type]) : t(labels.list)}</h3>
          {!c.single?.types.includes(type) && (
            <Button className="px-[17px] py-3 text-sm" onClick={() => save([...records, newRecord(c, type)])}>+ {t(labels.add)}</Button>
          )}
        </div>
      )}
      {c.designPerType && !typeDesign && (
        <FormFields values={design} onChange={(k, v) => setField(c.draft, designKey, { ...getField<Values>(c.draft, designKey, {}), [k]: v })}
          fields={[{ kind: 'design', key: 'design', help: 'Projeto válido para todos os registros deste grupo.' }]} />
      )}
      {typeDesign && (
        // The front's drawing (2.11): pick it, then "Abrir PDF" opens the sample PDF of the stage's layers.
        <div className="mt-4 flex items-end gap-3 rounded-[9px] bg-tint p-3">
          <label className="block flex-1 text-xs font-bold">{t('Projeto de referência')}
            <small className="mt-[5px] mb-2 block text-[11px] font-normal text-[#7a8ba0]">{t('Use o código que aparece no CAD ou no PDF das layers da etapa.')}</small>
            <select className="field" value={str(design, 'design')} onChange={e => setField(c.draft, designKey, { design: e.target.value })}>
              <option value="">{t('Selecionar')}</option>
              <option value={typeDesign.label}>{t(typeDesign.label)} ({t('exemplo')})</option>
            </select>
          </label>
          {str(design, 'design') && (
            <a href={typeDesign.pdf} target="_blank" rel="noopener" className="shrink-0 rounded-[7px] border border-[#f58235] bg-white px-3.5 py-2.5 text-xs text-[#d76c29] hover:bg-[#fff9f5]">{t('Abrir PDF')}</a>
          )}
        </div>
      )}
      {records.filter(r => r.type === type).map(r => {
        const item = cat?.items.find(i => i.code === r.item)
        return (
          // A lot's own rows are the options of its `source: 'rows'` checkboxes.
          <FormEnvProvider key={r.id} value={{ vars: { epc: plant.epcName }, sources: { ...sources, rows: item?.rows ?? [] } }}>
            <RecordView config={c} record={r} item={item} design={str(pick, 'design')} designMissing={!!typeDesign && !str(design, 'design')}
              all={records} epc={plant.epcName} onChange={f => update(r.id, f)} />
          </FormEnvProvider>
        )
      })}
    </>
  )

  return (
    <WorksFrame plant={plant}>
      <Panel className="mt-[17px]">
        <BackLink to={paths.works(plant.id)}>{t('Todas as pastas da obra')}</BackLink>
        <h2 className="mt-5 mb-[5px] text-base font-bold">{t(folder.name)}</h2>
        <span className="text-xs text-faint">{t('A {epc} preenche · a Kromos acompanha', { epc: plant.epcName })}</span>
        <Banner>{t('Prévia interativa: dados somente nesta página. Salvar e enviar são simulados. Anexos não são enviados.')}</Banner>

        {!c.noReferences && <div className={cn('mt-5 grid gap-[18px] rounded-xl border border-[#d9e5f0] p-5', !c.designPerType && !c.catalog && !c.typeDesigns && 'grid-cols-2')}>
          {!c.designPerType && !c.catalog && !c.typeDesigns && (
            <div>
              <label className="block text-xs font-bold">{t('Projeto de referência')}
                <select className="field mt-2"><option>{t('Selecionar projeto cadastrado')}</option></select>
              </label>
              <div className="mt-2 flex items-center gap-3">
                <Button variant="outline" disabled className="opacity-60">{t('Abrir PDF')}</Button>
                <small className="text-[11px] text-[#6a8099]">{t(c.labels.designNote)}</small>
              </div>
            </div>
          )}
          <label className="block text-xs font-bold">{t('Cronograma físico e financeiro')}
            <select className="field mt-2"><option>{t('Selecionar cronograma cadastrado')}</option></select>
            <small className="mt-2 block text-[11px] font-normal text-[#6a8099]">{t('Documentos reais serão vinculados após o cadastro.')}</small>
          </label>
        </div>}

        {c.types ? (
          <div className="mt-5 grid grid-cols-[230px_minmax(0,1fr)] items-start gap-5">
            <nav aria-label={t(c.types.title)} className="sticky top-4 mt-7 rounded-[13px] border border-line bg-white p-3">
              <h3 className="px-2 pt-1 pb-2 text-xs font-bold tracking-[0.08em] text-[#8094a9] uppercase">{t(c.types.title)}</h3>
              {c.types.names.map((n, i) => (
                <button key={n} type="button" aria-pressed={i === type} onClick={() => setType(i)}
                  className={cn('block w-full rounded-lg px-2.5 py-2 text-left text-xs',
                    i === type ? 'bg-[#fff1e5] font-bold text-[#c25e1c]' : 'text-ink-soft hover:bg-[#f5f7fa]')}>
                  {i + 1}. {t(n)}
                </button>
              ))}
            </nav>
            <div>{list}</div>
          </div>
        ) : c.stageNav ? (
          // One plant-level record (2.16): the left column jumps to its stages.
          <div className="mt-5 grid grid-cols-[230px_minmax(0,1fr)] items-start gap-5">
            <nav aria-label={t(c.stageNav)} className="sticky top-4 mt-5 rounded-[13px] border border-line bg-white p-3">
              <h3 className="px-2 pt-1 pb-2 text-xs font-bold tracking-[0.08em] text-[#8094a9] uppercase">{t(c.stageNav)}</h3>
              {c.stages.map((n, i) => (
                <button key={n} type="button" aria-pressed={i === navStage}
                  onClick={() => { setNavStage(i); document.getElementById(`stage-${i}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }) }}
                  className={cn('block w-full rounded-lg px-2.5 py-2 text-left text-xs',
                    i === navStage ? 'bg-[#fff1e5] font-bold text-[#c25e1c]' : 'text-ink-soft hover:bg-[#f5f7fa]')}>
                  {i + 1}. {t(n)}
                </button>
              ))}
            </nav>
            <div>{list}</div>
          </div>
        ) : list}
      </Panel>
    </WorksFrame>
  )
}

function RecordView({ config: c, record: r, item, design, designMissing, all, epc, onChange }: {
  config: RecordsConfig; record: Rec; item?: CatalogItem; design?: string; designMissing?: boolean; all: Rec[]; epc: string
  onChange: (f: (r: Rec) => Rec) => void
}) {
  const code = str(r.values, 'code')
  const name = str(r.values, 'name')
  const fields = c.stageFields(r.type)
  const stages = c.stagesFor?.(r.type) ?? c.stages
  const last = stages.length - 1
  // A single record (2.15's overall handover) has a fixed title and needs no code.
  const single = c.single?.types.includes(r.type) ? t(c.single.title) : null
  const prefix = c.titlePrefixKey ? str(r.values, c.titlePrefixKey) : ''
  const typeName = c.types ? t(c.types.names[r.type]) : null

  const setValue = (k: string, v: unknown) => onChange(x => ({ ...x, values: { ...x.values, [k]: v } }))
  const setQuality = (i: number, patch: Partial<QualityRecord>) =>
    onChange(x => ({ ...x, quality: x.quality.map((q, j) => (j === i ? { ...q, ...patch } : q)) }))
  const setMaterial = (i: number, k: string, v: unknown) => onChange(x => {
    const materials = x.materials.map((m, j) => (j === i ? { ...m, [k]: v } : m))
    // A damaged or differing material starts the materials stage's occurrence, if none is written yet.
    let quality = x.quality
    const ms = c.materialsStage
    if (k === 'condition' && v !== c.materialOk && !str(x.quality[ms], 'occurrence')) {
      const what = str(materials[i], 'material')
      quality = x.quality.map((q, j) => (j === ms ? { ...q, _open: true, occurrence: t('Material com avaria ou divergência: {material}', { material: what ? t(what) : '' }) } : q))
    }
    return { ...x, materials, quality }
  })

  const labels = { ...c.labels, ...c.typeLabels?.(r.type) }

  /** Before any send: the code is required and must not repeat (manual 3.4), within the folder or the type. */
  const checkCode = () => {
    if (designMissing) return t('Selecione o projeto de referência.')
    if (single) return null
    if (!code) return t(c.labels.codeMissing)
    if (all.some(x => x.id !== r.id && (!c.uniqueWithinType || x.type === r.type)
      && str(x.values, 'code').toLowerCase() === code.toLowerCase())) return t(c.labels.codeDuplicate)
    return null
  }

  /** Sending the record also needs the config's required fields; a "type a code" point needs its code. */
  const checkSend = () => {
    const error = checkCode()
    if (error) return error
    const defs = [...fields.flat(), ...(c.headerFields?.(r.type) ?? [])]
    for (const k of c.sendRequires?.(r.type) ?? []) {
      const v = str(r.values, k)
      const missing = !v ? k : v === CUSTOM_POINT && !str(r.values, `${k}Code`) ? `${k}Code` : null
      if (missing) return t('Preencha: {field}', { field: t(labelOf(defs, missing) ?? labelOf(defs, k) ?? missing) })
    }
    const invalid = c.sendValidate?.(r.values, item)
    return invalid ? t(invalid) : null
  }

  const context = (i: number) => [single ?? (code || t(c.labels.noCode)), typeName, t(stages[i])].filter(Boolean).join(' / ')

  const pending: string[] = []
  for (const k of c.issueKeys) {
    if (str(r.values, k) === YES) {
      pending.push([
        str(r.values, `${k}Description`) || t('Descrição pendente'),
        str(r.values, `${k}Owner`) || t('Responsável pendente'),
        str(r.values, `${k}Due`) || t('Prazo pendente'),
      ].join(' · '))
    }
  }
  r.materials.forEach(m => {
    const cond = str(m, 'condition')
    if (cond && cond !== c.materialOk) pending.push(`${t('Material')}: ${t(str(m, 'material') || '—')} · ${t(cond)}`)
  })
  for (const p of c.extraPending?.(r.values) ?? []) pending.push(t(p))
  r.quality.forEach((q, i) => { if (isOpenIssue(q)) pending.push(`${t(stages[i])}: ${str(q, 'occurrence')}`) })

  const quality = (i: number) => (
    <QualityPanel stageTitle={stages[i]} context={context(i)} value={r.quality[i]} onChange={p => setQuality(i, p)} checkRecord={checkCode} />
  )

  return (
    <details open id={item ? `rec-${item.code}` : undefined} className="mt-5 rounded-xl border border-[#d9e5f0] bg-white p-5">
      <summary className="cursor-pointer p-1 text-[21px] font-bold">
        {item && c.catalog ? t(c.catalog.title, { code: item.code, ...item.vars })
          : single ?? (code ? `${prefix ? `${t(prefix)} · ` : ''}${labels.recordTitle ? `${t(labels.recordTitle)} ` : ''}${code}${name ? ` — ${name}` : ''}` : t(labels.newRecord))}
      </summary>
      {item && c.catalog && (
        <>
          {c.catalog.detail && <p className="mt-1 px-1 text-xs text-ink-soft">{t(c.catalog.detail, { code: item.code, ...item.vars })}</p>}
          {design && <p className="mt-1 px-1 text-[11px] text-[#6a8099]">{t(design)}</p>}
        </>
      )}

      {c.headerFields && <FormFields fields={c.headerFields(r.type)} values={r.values} onChange={setValue} />}

      {stages.map((title, i) => (
        <Stage key={i} id={c.stageNav ? `stage-${i}` : undefined} n={i + 1 + (c.stageOffset ?? 0)} title={title}>
          {i === c.materialsStage ? (
            <>
              {r.materials.map((m, j) => (
                <div key={j} className={j > 0 ? 'relative mt-5 border-t border-[#cbd9e7] pt-4' : 'relative'}>
                  {r.materials.length > 1 && (
                    <button type="button" className="absolute top-1 right-0 text-xs text-faint hover:text-[#c2410c]"
                      onClick={() => onChange(x => ({ ...x, materials: x.materials.filter((_, k) => k !== j) }))}>✕ {t('Remover')}</button>
                  )}
                  <FormFields fields={c.materialFields} values={m} onChange={(k, v) => setMaterial(j, k, v)} />
                </div>
              ))}
              <Button variant="outline" className="mt-4" onClick={() => onChange(x => ({ ...x, materials: [...x.materials, {}] }))}>+ {t('Adicionar material')}</Button>
            </>
          ) : (
            <FormFields fields={fields[i]} values={r.values} onChange={setValue} />
          )}

          {i === last && (
            <>
              <h4 className="mt-5 text-[13px] font-bold">{t('Pendências existentes')}</h4>
              <div className="mt-2 rounded-[7px] bg-[#f6f9fc] p-3 text-xs">
                {pending.length
                  ? <ul className="list-disc space-y-1 pl-5">{pending.map((p, k) => <li key={k}>{p}</li>)}</ul>
                  : <p className="text-faint">{t(c.labels.noPending)}</p>}
              </div>
              <FormFields fields={c.completionAfter} values={r.values} onChange={setValue} />
            </>
          )}

          {quality(i)}

          {i === last && (
            <>
              <p className="mt-4 text-xs text-[#6a8099]">{t(c.completionNote ?? 'Conclusão informada pela {epc} não substitui vistoria e aceite da Kromos.', { epc })}</p>
              <div className="mt-[18px] flex justify-end gap-3">
                <Button variant="outline" onClick={() => onChange(x => ({ ...x, msg: t('Rascunho disponível enquanto esta página estiver aberta.') }))}>{t('Salvar rascunho')}</Button>
                <Button className="px-[17px] py-3 text-sm" onClick={() => {
                  const error = checkSend()
                  onChange(x => ({ ...x, msg: error ?? t('{code} · envio simulado. Nenhum dado foi transmitido.', { code: single ?? code }) }))
                }}>{t('Enviar à Kromos')}</Button>
              </div>
              {r.msg && <p role="status" className="mt-3 rounded-[7px] bg-[#fff1e4] p-3 text-xs text-[#805419]">{r.msg}</p>}
            </>
          )}
        </Stage>
      ))}
    </details>
  )
}

function Stage({ id, n, title, children }: { id?: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-[18px] scroll-mt-4 overflow-hidden rounded-[10px] border border-[#d7e4f1]">
      <h3 className="bg-[#e9f3fd] px-[18px] py-3.5 text-[17px] font-bold">{n}. {t(title)}</h3>
      <div className="px-[18px] pb-[18px]">{children}</div>
    </section>
  )
}

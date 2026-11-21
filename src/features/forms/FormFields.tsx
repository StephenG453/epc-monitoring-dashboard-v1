import { createContext, useContext, useId } from 'react'
import { Button } from '@/components/ui'
import { t } from '@/lib/i18n'
import { cn, pad2 } from '@/lib/utils'
import { CUSTOM_POINT, NO, YES, list, rows, str, sub, type Field, type Values } from './schema'

// Draws a list of field definitions against a values object. Controlled: every change goes through
// onChange(key, value), so the caller owns the record (in-memory now, a database row later).

export type FieldsProps = { fields: Field[]; values: Values; onChange: (key: string, value: unknown) => void }

/** Form-wide inputs: placeholder values for labels ({epc}) and option lists other forms provide. */
export type FormEnv = { vars?: Record<string, string>; sources?: Record<string, string[]> }
const EnvCtx = createContext<FormEnv>({})
export const FormEnvProvider = EnvCtx.Provider

const labelCls = 'mt-3.5 block text-xs font-bold'
const helpCls = 'mt-[5px] mb-2 block text-[11px] leading-normal font-normal text-[#7a8ba0]'

export function FormFields({ fields, values, onChange }: FieldsProps) {
  // A "when" block shares its key with the question it depends on, and several may depend on the same
  // question (2.12's CCTV checks), so the React key includes the kind and the position.
  return <>{fields.map((f, i) => <FieldView key={`${f.kind}-${'key' in f ? f.key : ''}-${i}`} field={f} values={values} onChange={onChange} />)}</>
}

function FieldView({ field: f, values, onChange }: { field: Field } & Omit<FieldsProps, 'fields'>) {
  const name = useId()
  const env = useContext(EnvCtx)
  const tr = (s: string) => t(s, env.vars)
  const help = (h?: string) => h && <small className={helpCls}>{tr(h)}</small>

  switch (f.kind) {
    case 'text':
    case 'number':
    case 'date':
    case 'datetime':
      return (
        <label className={labelCls}>
          {tr(f.label)}
          {help(f.help)}
          <input
            type={f.kind === 'datetime' ? 'datetime-local' : f.kind}
            className="field mt-2"
            aria-label={tr(f.label)}
            min={f.kind === 'number' ? 0 : undefined}
            step={f.kind === 'number' ? 'any' : undefined}
            value={str(values, f.key)}
            onChange={e => onChange(f.key, e.target.value)}
          />
        </label>
      )
    case 'textarea':
      return (
        <label className={labelCls}>
          {tr(f.label)}
          {help(f.help)}
          <textarea className="field mt-2 min-h-[70px]" aria-label={tr(f.label)} value={str(values, f.key)} onChange={e => onChange(f.key, e.target.value)} />
        </label>
      )
    case 'select':
      return (
        <label className={labelCls}>
          {tr(f.label)}
          {help(f.help)}
          <select className="field mt-2" aria-label={tr(f.label)} value={str(values, f.key)} onChange={e => onChange(f.key, e.target.value)}>
            <option value="">{tr(f.placeholder ?? 'Selecionar')}</option>
            {f.options.map(o => <option key={o} value={o}>{tr(o)}</option>)}
          </select>
        </label>
      )
    case 'radio':
    case 'yesno': {
      const options = f.kind === 'yesno' ? [YES, NO] : f.options
      return (
        <fieldset className="mt-4">
          <legend className="text-xs font-bold">{tr(f.label)}</legend>
          {help(f.help)}
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {options.map(o => (
              <label key={o} className="mt-1.5 inline-flex items-center gap-1.5 text-[13px]">
                <input type="radio" name={name} className="h-4 w-4 accent-[#f47a27]" checked={str(values, f.key) === o} onChange={() => onChange(f.key, o)} />
                {tr(o)}
              </label>
            ))}
          </div>
        </fieldset>
      )
    }
    case 'checks': {
      const on = list(values, f.key)
      const options = f.source ? env.sources?.[f.source] ?? [] : f.options ?? []
      return (
        <fieldset className="mt-4">
          {f.label && <legend className="text-xs font-bold">{tr(f.label)}</legend>}
          {help(f.help)}
          {options.length === 0 && f.empty ? (
            <div className="mt-1 rounded-lg border border-dashed border-field p-3 text-xs text-faint">{tr(f.empty)}</div>
          ) : (
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {options.map(o => (
                <label key={o} className="mt-1.5 inline-flex items-center gap-1.5 text-[13px]">
                  <input type="checkbox" className="h-4 w-4 accent-[#f47a27]" checked={on.includes(o)}
                    onChange={() => onChange(f.key, on.includes(o) ? on.filter(x => x !== o) : [...on, o])} />
                  {/* Sourced options are user-entered names: shown as typed. */}
                  {f.source ? o : tr(o)}
                </label>
              ))}
            </div>
          )}
        </fieldset>
      )
    }
    case 'attach': {
      const files = list(values, f.key)
      return (
        <div className="mt-3.5">
          <label className="block cursor-pointer rounded-lg border border-[#d5dfe8] p-[9px] text-xs font-bold hover:border-[#f58235]">
            📎 {tr(f.label)}
            <input type="file" multiple accept={f.images ? 'image/*' : undefined} className="block w-full py-[5px] text-[10px] font-normal"
              onChange={e => onChange(f.key, [...(e.target.files ?? [])].map(x => x.name))} />
          </label>
          {files.length > 0 && <small className={helpCls}>{files.join(', ')}</small>}
          {help(f.help)}
        </div>
      )
    }
    case 'photos':
      return (
        <FormFields values={values} onChange={onChange} fields={[
          { kind: 'attach', key: `${f.key}Files`, label: f.label ?? 'Fotos e observações' },
          { kind: 'textarea', key: f.key, label: 'Observações' },
        ]} />
      )
    case 'issue':
      return (
        <FormFields values={values} onChange={onChange} fields={[
          { kind: 'yesno', key: f.key, label: f.label },
          { kind: 'when', key: f.key, equals: YES, fields: [
            { kind: 'textarea', key: `${f.key}Description`, label: 'Descrição' },
            { kind: 'grid', fields: [
              { kind: 'text', key: `${f.key}Owner`, label: 'Responsável' },
              { kind: 'date', key: `${f.key}Due`, label: 'Prazo' },
            ] },
          ] },
        ]} />
      )
    case 'grid':
      return (
        <div className={cn('grid gap-x-[18px]', f.cols === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
          <FormFields fields={f.fields} values={values} onChange={onChange} />
        </div>
      )
    case 'design':
      return (
        <div className="mt-3.5 rounded-[9px] bg-tint p-3">
          <FormFields values={values} onChange={onChange} fields={[
            { kind: 'doc', key: f.key, label: 'Projeto de referência', help: f.help ?? 'Selecione o projeto cadastrado utilizado nesta marcação.', placeholder: 'Selecione qual projeto' },
          ]} />
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1">
              <FormFields values={values} onChange={onChange} fields={[{ kind: 'text', key: `${f.key}Name`, label: 'Nome e revisão do projeto' }]} />
            </div>
            {/* Opens the registered file once documents exist (manual 2.6: "Open document"). */}
            <Button variant="outline" disabled className="shrink-0 opacity-60">{tr('Abrir documento')}</Button>
          </div>
        </div>
      )
    case 'group': {
      const inner = sub(values, f.key)
      return (
        <section className="mt-5 rounded-[11px] border border-[#d8e7f5] p-4">
          {f.title && <h3 className="text-base font-bold">{tr(f.title)}</h3>}
          <FormFields fields={f.fields} values={inner} onChange={(k, v) => onChange(f.key, { ...sub(values, f.key), [k]: v })} />
        </section>
      )
    }
    case 'when': {
      const v = str(values, f.key)
      const show = f.in ? f.in.includes(v) : f.equals !== undefined ? v === f.equals : v !== f.notEquals
      return show ? <FormFields fields={f.fields} values={values} onChange={onChange} /> : null
    }
    case 'repeat':
      return <Repeat field={f} values={values} onChange={onChange} />
    case 'table':
      return (
        <table className="mt-3 w-full border-collapse text-left">
          <thead>
            <tr className="text-[10px] tracking-[0.08em] text-[#9ba8b4] uppercase">
              {[f.rowHeader, ...f.columns.map(c => c.label)].map(h => <th key={h} className="border-b border-[#edf1f4] px-[5px] py-[9px]">{tr(h)}</th>)}
            </tr>
          </thead>
          <tbody>
            {f.rows.map(row => (
              <tr key={row} className="text-xs">
                <td className="border-b border-[#f0f3f6] px-[5px] py-[9px] font-bold">{tr(row)}</td>
                {f.columns.map(c => {
                  const key = `${c.key}-${row}`
                  const aria = `${tr(c.label)}: ${tr(row)}`
                  return (
                    <td key={c.key} className="border-b border-[#f0f3f6] px-[5px] py-[9px]">
                      {c.kind === 'select' ? (
                        <select className="field max-w-44" aria-label={aria} value={str(values, key)} onChange={e => onChange(key, e.target.value)}>
                          <option value="">{tr('Selecione')}</option>
                          {(c.options ?? []).map(o => <option key={o} value={o}>{tr(o)}</option>)}
                        </select>
                      ) : (
                        <input type="number" min={0} className="field max-w-[110px]" aria-label={aria} value={str(values, key)} onChange={e => onChange(key, e.target.value)} />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )
    case 'doc':
      return (
        <label className={labelCls}>
          {tr(f.label)}
          {help(f.help)}
          <select className="field mt-2" aria-label={tr(f.label)} value={str(values, f.key)} onChange={e => onChange(f.key, e.target.value)}>
            <option value="">{tr(f.placeholder ?? 'Selecione o documento cadastrado')}</option>
            <option disabled>{tr('Nenhum arquivo real cadastrado nesta prévia')}</option>
          </select>
        </label>
      )
    case 'point': {
      const v = str(values, f.key)
      const codes = env.sources?.[f.source] ?? []
      const options = v && v !== CUSTOM_POINT && !codes.includes(v) ? [...codes, v] : codes
      return (
        <div>
          <label className={labelCls}>
            {tr(f.label)}
            <select className="field mt-2" aria-label={tr(f.label)} value={v} onChange={e => onChange(f.key, e.target.value)}>
              <option value="">{tr('Selecionar')}</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
              <option value={CUSTOM_POINT}>{tr('Informar código do projeto')}</option>
            </select>
          </label>
          {v === CUSTOM_POINT && (
            // Drawn here, not as a text field: its label is built from two translated parts.
            <label className={labelCls}>
              {tr('Código no projeto')} — {tr(f.label)}
              <input type="text" className="field mt-2" aria-label={`${tr('Código no projeto')} — ${tr(f.label)}`}
                value={str(values, `${f.key}Code`)} onChange={e => onChange(`${f.key}Code`, e.target.value)} />
            </label>
          )}
        </div>
      )
    }
    case 'heading':
      return <h4 className="mt-6 text-sm font-bold text-ink-soft">{tr(f.text)}</h4>
    case 'note':
      return <small className={helpCls}>{tr(f.text)}</small>
    case 'details':
      return (
        <details className="mt-4 rounded-[9px] border border-[#d7e4f1] p-3">
          <summary className="cursor-pointer text-[13px] font-semibold text-ink-soft">{tr(f.title)}</summary>
          <FormFields fields={f.fields} values={values} onChange={onChange} />
        </details>
      )
  }
}

function Repeat({ field: f, values, onChange }: { field: Extract<Field, { kind: 'repeat' }> } & Omit<FieldsProps, 'fields'>) {
  const env = useContext(EnvCtx)
  const items = rows(values, f.key, f.initial)
  const save = (next: Values[]) => onChange(f.key, next)
  const add = <Button variant="outline" className="shrink-0" onClick={() => save([...items, {}])}>+ {t(f.addLabel, env.vars)}</Button>
  const [first, ...rest] = f.fields

  return (
    <>
      {items.map((item, i) => {
        const set = (k: string, v: unknown) => save(items.map((x, j) => (j === i ? { ...x, [k]: v } : x)))
        return (
          <div key={i} className={cn('relative mt-3 rounded-[9px] border border-line p-3', f.title && 'p-4')}>
            {f.title && <h3 className="text-[15px] font-bold">{t(f.title, env.vars)} {pad2(i + 1)}</h3>}
            {items.length > 1 && (
              <button type="button" aria-label={t('Remover')} className="absolute top-2 right-3 text-xs text-faint hover:text-[#c2410c]"
                onClick={() => save(items.filter((_, j) => j !== i))}>✕ {t('Remover')}</button>
            )}
            {f.addBesideFirst ? (
              <>
                <div className="flex items-end gap-3.5"><div className="min-w-0 flex-1"><FormFields fields={[first]} values={item} onChange={set} /></div>{add}</div>
                <FormFields fields={rest} values={item} onChange={set} />
              </>
            ) : (
              <FormFields fields={f.fields} values={item} onChange={set} />
            )}
          </div>
        )
      })}
      {!f.addBesideFirst && <div className="mt-3">{add}</div>}
    </>
  )
}

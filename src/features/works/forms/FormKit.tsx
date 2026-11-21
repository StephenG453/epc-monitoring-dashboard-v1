import { useState } from 'react'
import { BackLink, Banner, Button, DemoBadge, Notice } from '@/components/ui'
import { FormEnvProvider, FormFields } from '@/features/forms/FormFields'
import { rows, str } from '@/features/forms/schema'
import { paths } from '@/lib/router'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { getDraft, setField, useDrafts } from './draft'
import { CREWS_SOURCE, type FormDef, type FormSection } from './definition'
import type { Plant, WorkFolder } from '@/types/domain'

// Draws a form definition: page frame, cards (numbered, optionally with the attachments-and-notes column)
// and the Save draft / Send to Kromos buttons, once at the end or, for `stages` forms, on every stage.
// Values live in the in-memory draft for the form.

/** Crews entered in planning, by name; Accommodation offers them as "Equipes atendidas". */
export const plannedCrewNames = () =>
  rows(getDraft('planejamento'), 'teams').map(c => str(c, 'name')).filter(Boolean)

const DRAFT_MSG = 'Demonstração: o rascunho não foi salvo. Você pode continuar preenchendo enquanto a página estiver aberta.'
const SEND_MSG = 'Demonstração: nenhuma informação ou arquivo foi enviado à Kromos.'

function Actions({ onMsg }: { onMsg: (m: string) => void }) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="outline" onClick={() => onMsg(t(DRAFT_MSG))}>{t('Salvar rascunho')}</Button>
      <Button onClick={() => onMsg(t(SEND_MSG))}>{t('Enviar à Kromos')}</Button>
    </div>
  )
}

const Status = ({ msg }: { msg: string }) => (msg ? <div role="status" className="mt-4 rounded-lg bg-[#edf5fb] p-3 text-xs">{msg}</div> : null)

export function FormPage({ plant, folder, form }: { plant: Plant; folder: WorkFolder; form: FormDef }) {
  useDrafts()
  const [msg, setMsg] = useState('')
  const values = getDraft(form.id)
  const set = (k: string, v: unknown) => setField(form.id, k, v)
  const vars = { epc: plant.epcName }
  const back = form.back
    ? { to: paths.workFolder(plant.id, form.back.folderId), label: t(form.back.label) }
    : { to: paths.workFolder(plant.id, folder.id), label: t('Voltar à pasta {code}', { code: folder.name.split(' ')[0] }) }

  return (
    <FormEnvProvider value={{ vars, sources: { [CREWS_SOURCE]: plannedCrewNames() } }}>
      <div className="mt-[34px] mb-[25px] flex items-end justify-between gap-5">
        <div>
          <BackLink to={back.to}>{back.label}</BackLink>
          <h1 className="mt-3 mb-2 text-[31px] font-bold tracking-[-0.04em]">{t(form.title)}</h1>
          {form.subtitle && <p className="mb-1 text-[13px] text-ink-soft">{t(form.subtitle)}</p>}
          <p className="text-[13px] text-[#8796a7]">{t('Preenchimento:')} <b>{plant.epcName}</b> · {t('Acompanhamento:')} <b>Kromos</b></p>
        </div>
        <DemoBadge>{t('PRÉVIA VISUAL')}</DemoBadge>
      </div>
      <Banner>{t('Demonstração do formulário aprovado. Nada é enviado ou salvo. Os campos ficam disponíveis enquanto esta página estiver aberta.')}</Banner>

      {form.sections.map((s, i) => form.stages
        ? <StageCard key={i} section={s} values={values} onChange={set} vars={vars} />
        : <SectionCard key={i} section={s} values={values} onChange={set} vars={vars} />)}

      <Notice>{t('Na plataforma funcional, a Kromos consultará a versão enviada no mesmo layout e registrará seus apontamentos em campos próprios. Alterações preservarão o histórico e as datas originais.')}</Notice>
      {!form.stages && (
        <>
          <Status msg={msg} />
          <div className="mb-6"><Actions onMsg={setMsg} /></div>
        </>
      )}
    </FormEnvProvider>
  )
}

type CardProps = { section: FormSection; values: Record<string, unknown>; onChange: (k: string, v: unknown) => void; vars: Record<string, string> }

function Heading({ section: s, vars }: Pick<CardProps, 'section' | 'vars'>) {
  if (!s.title) return null
  return (
    <h2 className="mb-3 text-lg font-bold">
      {s.n !== undefined && <b className="mr-2 inline-grid h-7 w-7 place-items-center rounded-full bg-[#f58235] text-sm text-white">{s.n}</b>}
      {t(s.title, vars)}
    </h2>
  )
}

function SectionCard({ section: s, values, onChange, vars }: CardProps) {
  const aside = s.aside !== false
  return (
    <section className={cn('my-4 rounded-[13px] border border-[#e1e8ef] bg-white p-[22px]', aside && 'grid grid-cols-[minmax(0,1fr)_250px] gap-6')}>
      <div>
        <Heading section={s} vars={vars} />
        {s.help && <small className="mt-[5px] mb-2 block text-[11px] leading-normal text-[#7a8ba0]">{t(s.help, vars)}</small>}
        <FormFields fields={s.fields} values={values} onChange={onChange} />
      </div>
      {aside && (
        <aside className="border-l border-[#edf1f4] pl-5">
          <FormFields values={values} onChange={onChange} fields={[
            { kind: 'attach', key: `s${s.n}Files`, label: 'Anexar', help: 'Inclua fotos ou documentos que complementem este item.' },
            { kind: 'textarea', key: `s${s.n}Notes`, label: 'Observações (opcional)', help: 'Registre detalhes ou pendências para entender a resposta.' },
          ]} />
        </aside>
      )}
    </section>
  )
}

/** A collapsible stage with its own Save draft / Send to Kromos (fencing's four tabs). */
function StageCard({ section: s, values, onChange, vars }: CardProps) {
  const [msg, setMsg] = useState('')
  return (
    <details open={s.open} className="my-4 rounded-[13px] border border-[#e1e8ef] bg-white">
      <summary className="cursor-pointer px-[22px] py-4 text-lg font-bold">{s.n}. {t(s.title ?? '', vars)}</summary>
      <div className="border-t border-[#edf1f4] px-[22px] pb-[22px]">
        {s.help && <small className="mt-3 block text-[11px] text-[#7a8ba0]">{t(s.help, vars)}</small>}
        <FormFields fields={s.fields} values={values} onChange={onChange} />
        <Status msg={msg} />
        <Actions onMsg={setMsg} />
      </div>
    </details>
  )
}

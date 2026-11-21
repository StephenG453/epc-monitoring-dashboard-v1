import { A, BackLink, Banner, Button, DemoBadge, Hero, Notice, Panel, WorkNote } from '@/components/ui'
import { navigate, paths } from '@/lib/router'
import { t } from '@/lib/i18n'
import { workFolders } from '@/data/workFolders'
import { RECORDS } from '@/features/works/records/registry'
import type { Plant, WorkFolder } from '@/types/domain'

// Construction: the 16 folders the EPC fills in and Kromos follows. Folders with `formsReady` have their
// detailed forms; the others show their stages from the manual.

export function WorksFrame({ plant, children }: { plant: Plant; children: React.ReactNode }) {
  return (
    <>
      <div className="mt-[34px] mb-[25px] flex items-center justify-between gap-5">
        <BackLink to={paths.plant(plant.id)}>{t('Voltar ao painel da usina')}</BackLink>
        <DemoBadge>{t('PRÉVIA · SEM DADOS REAIS')}</DemoBadge>
      </div>
      <Hero
        kicker={`UFV ${plant.name}`.toUpperCase()}
        title={t('Execução da obra')}
        subtitle={t('Da mobilização à desmobilização, cada frente com seus registros e acompanhamentos.')}
        label={`⌁  ${t('{n} pastas', { n: workFolders.length })}`}
      />
      <Banner>{t('A {epc} preenche as informações da obra. A Kromos acompanha e registra suas vistorias e decisões. As pastas organizam os serviços e podem acontecer em paralelo.', { epc: plant.epcName })}</Banner>
      {children}
    </>
  )
}

/** Stages on the card: a folder drawn by the records page counts its form's stages (2.7 has five, the manual's table six). */
const stepCount = (f: WorkFolder) =>
  (f.page === 'records' && f.formPage ? RECORDS[f.formPage]?.stages.length : undefined) ?? f.groups[0]?.steps.length ?? 0

export function WorksPage({ plant }: { plant: Plant }) {
  return (
    <WorksFrame plant={plant}>
      <div className="mt-[34px] mb-[25px]">
        <h1 className="my-2 text-[23px] font-bold tracking-[-0.04em]">{t('Pastas da obra')}</h1>
        <p className="text-[13px] text-[#8796a7]">{t('Selecione uma pasta para visualizar as etapas previstas no manual.')}</p>
      </div>
      <div className="grid grid-cols-3 gap-3.5">
        {/* Folders reached from inside another (2.3 fencing, in 2.2) have no card of their own. */}
        {workFolders.filter(f => !f.inside).map(f => (
          <A key={f.id} to={paths.workFolder(plant.id, f.id)}
            className="relative min-h-[130px] rounded-xl border border-line bg-white p-[19px] text-left shadow-card hover:border-[#edaa7b]">
            {f.formsReady && (
              <span className="absolute top-4 right-4 rounded-[20px] bg-[#e7f8f0] px-2 py-1 text-[10px] font-bold text-[#258e67]">{t('Formulários')}</span>
            )}
            <span className="mb-[13px] block text-[22px]">🏗️</span>
            <strong className="block text-[13px] leading-[1.4]">{t(f.name)}</strong>
            <small className="mt-2 block text-[11px] text-[#91a0ae]">
              {t('{n} etapas', { n: stepCount(f) })}{f.per && ` ${t(f.per)}`}&nbsp; · &nbsp;{t('Abrir pasta')} →
            </small>
          </A>
        ))}
      </div>
    </WorksFrame>
  )
}

export function WorkFolderPage({ plant, folder }: { plant: Plant; folder: WorkFolder }) {
  return (
    <WorksFrame plant={plant}>
      <Panel className="mt-[17px]">
        <BackLink to={paths.works(plant.id)}>{t('Todas as pastas da obra')}</BackLink>
        <h2 className="mt-5 mb-[5px] text-base font-bold">{t(folder.name)}</h2>
        <span className="text-xs text-faint">{t('Abra uma etapa para conferir o que a {epc} registra e o que a Kromos acompanha.', { epc: plant.epcName })}</span>

        {/* Dates live inside each folder's first and last stage forms (manual 3.4), not in a folder header. */}
        {!folder.formsReady && (
          <Banner>{t('Os formulários detalhados desta pasta serão construídos nas próximas etapas. Abaixo, as etapas previstas no manual.')}</Banner>
        )}

        {folder.groups.map(g => (
          <div key={g.title}>
            <h3 className="mt-[25px] text-sm font-bold">{t(g.title)}</h3>
            {g.plain && g.steps.map(s => (
              <div key={s.title} className="mt-2.5 rounded-[10px] border border-[#e9eff4] p-4 text-xs">
                <b className="text-[13px] text-ink-soft">{t(s.title)}</b>
                <p className="mt-1.5 leading-relaxed text-[#6b7f90]">{t(s.epc)}</p>
              </div>
            ))}
            {!g.plain && g.steps.map(s => (
              <details key={s.title} className="mt-2.5 rounded-[10px] border border-[#e9eff4] p-4" open={!!s.formId}>
                <summary className="cursor-pointer text-[13px] font-bold text-ink-soft">{t(s.title)}</summary>
                <p className="my-2.5 text-xs leading-relaxed text-[#6b7f90]"><b className="text-ink-soft">{t('{epc} · registro e preenchimento:', { epc: plant.epcName })}</b> {t(s.epc)}</p>
                <p className="my-2.5 text-xs leading-relaxed text-[#6b7f90]"><b className="text-ink-soft">{t('Kromos · acompanhamento:')}</b> {t(s.kromos)}</p>
                {s.formId && (
                  <Button variant="outline" onClick={() => navigate(paths.workForm(plant.id, folder.id, s.formId!))}>
                    {t('Abrir formulário')} →
                  </Button>
                )}
              </details>
            ))}
          </div>
        ))}

        {/* Folders that live inside this one, below its last stage (2.3 fencing, under 2.2's Execution). */}
        {workFolders.filter(c => c.inside === folder.id).map(c => (
          <details key={c.id} open className="mt-2.5 rounded-[10px] border border-[#e9eff4] p-4">
            <summary className="cursor-pointer text-[13px] font-bold text-ink-soft">{t(c.name.replace(' ', ' — '))}</summary>
            <p className="my-2.5 text-xs leading-relaxed text-[#6b7f90]">{t('Conferência antes do início, recebimento e armazenamento, execução e conferência final.')}</p>
            <Button variant="outline" onClick={() => navigate(paths.workFolder(plant.id, c.id))}>{t('Abrir formulário')} →</Button>
          </details>
        ))}

        {folder.notes.map(n => <WorkNote key={n}>{t(n)}</WorkNote>)}

        <StatusExample key={folder.id} epc={plant.epcName} />
        <WorkNote>{t('A liberação operacional da {epc} e a vistoria da Kromos são registros distintos. A obra pode avançar sem esperar a vistoria, salvo pontos de espera definidos previamente.', { epc: plant.epcName })}</WorkNote>
      </Panel>
    </WorksFrame>
  )
}

/** "Exemplo de preenchimento": a taste of the EPC's status entry. Nothing is kept. */
function StatusExample({ epc }: { epc: string }) {
  const options = ['Não iniciada', 'Em andamento', 'Concluída', 'Com pendência']
  return (
    <div className="mt-4 rounded-[10px] bg-tint p-4">
      <h2 className="text-base font-bold">{t('Exemplo de preenchimento da {epc}', { epc })}</h2>
      <span className="text-xs text-faint">{t('Selecione uma situação e experimente os campos abaixo.')}</span>
      <div className="my-3 flex flex-wrap gap-3 text-xs text-[#5e7080]">
        {options.map(o => (
          <label key={o} className="flex items-center gap-[5px]"><input type="radio" name="work-status" /> {t(o)}</label>
        ))}
      </div>
      <label className="mt-[18px] mb-2 block text-xs font-bold">{t('Observações')}
        <textarea className="field mt-2 min-h-[70px] resize-y font-normal" placeholder={t('Descreva o andamento, uma pendência ou observação...')} />
      </label>
      <label className="mt-[18px] mb-2 block text-xs font-bold">{t('Fotos ou documentos')}
        <input type="file" multiple className="mt-2 block text-[11px] font-normal" />
      </label>
      <Notice>{t('Demonstração local: nenhuma informação ou arquivo é enviado ou salvo. O registro definitivo será desenvolvido na plataforma funcional.')}</Notice>
    </div>
  )
}

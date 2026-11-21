import { AlertRow, BackLink, DemoBadge, Donut, Hero, Notice, Panel, StatCard } from '@/components/ui'
import { openComingSoon } from '@/app/Layout'
import { navigate, paths } from '@/lib/router'
import { t } from '@/lib/i18n'
import { pad2 } from '@/lib/utils'
import { plantAlerts } from '@/data/plants'
import { docFolders } from '@/data/docFolders'
import { workFolders } from '@/data/workFolders'
import type { Plant } from '@/types/domain'

export function PlantPage({ plant }: { plant: Plant }) {
  // Journey phases. Lighthouse 1 hasn't started construction (see data/plants.ts), so construction
  // reads "not started" here; the prototype said "andamento" while showing 0% in the list.
  const started = plant.progress > 0
  const phases: [string, string, string][] = [
    ['▤', t('Documentos'), t('Exemplo: em análise')],
    ['✓', t('Liberação'), t('Exemplo: pendente')],
    ['⌁', t('Execução'), started ? t('Exemplo: andamento') : t('Exemplo: não iniciada')],
    ['⚡', t('Comissionamento'), t('Exemplo: não iniciado')],
    ['☀', t('Operação'), t('Exemplo: não iniciada')],
    ['⚙', t('Manutenção'), t('Histórico por QR Code')],
  ]
  const shortcuts: { icon: string; label: string; sub: string; go: () => void }[] = [
    { icon: '▤', label: t('Documentos'), sub: t('{n} pastas da pré-obra', { n: docFolders.length }), go: () => navigate(paths.documents(plant.id)) },
    { icon: '⌁', label: t('Obra'), sub: t('{n} pastas de execução', { n: workFolders.length }), go: () => navigate(paths.works(plant.id)) },
    { icon: '◷', label: t('Indicadores'), sub: t('Prazos, produtividade e qualidade'), go: () => openComingSoon(t('Indicadores')) },
    { icon: '⚙', label: t('Equipamentos'), sub: t('Garantias, histórico e QR Code'), go: () => openComingSoon(t('Equipamentos e manutenção')) },
  ]

  return (
    <>
      <div className="mt-[34px] mb-[25px] flex items-end justify-between gap-5">
        <BackLink to={paths.overview()}>{t('Voltar à visão geral')}</BackLink>
        <DemoBadge>{t('PRÉVIA · DADOS ILUSTRATIVOS')}</DemoBadge>
      </div>

      <Hero
        kicker={t('PAINEL INDIVIDUAL DA USINA')}
        title={`UFV ${plant.name}`}
        subtitle={`☀  ${plant.location}   |   ${t('Gestão do projeto e da obra')}`}
        label={`●  ${t('Situação real a informar')}`}
      />

      <div className="grid grid-cols-4 gap-[15px]">
        <StatCard className="min-h-[130px]" icon="◴" label={t('Avanço da obra')} value={`${plant.progress}%`} note={t('Exemplo ilustrativo')} />
        <StatCard className="min-h-[130px]" icon="▤" label={t('Documentação')} value={`${plant.docFoldersChecked} / ${docFolders.length}`} note={t('Pastas conferidas · exemplo')} />
        <StatCard className="min-h-[130px]" icon="◷" label={t('Cronograma')} value={pad2(plant.scheduleAlerts)} note={t('Etapas em atenção · exemplo')} />
        <StatCard className="min-h-[130px]" icon="↗" label={t('CAPEX da usina')} value="—" note={t('Valores ainda não informados')} />
      </div>

      <div className="my-[18px] grid grid-cols-[1.3fr_1fr] gap-4">
        <Panel title={t('Avanço do projeto')} sub={t('Uma visão da jornada, do documento à operação')}>
          <div className="flex items-center gap-9 pt-7 pb-1">
            <Donut size={132} hole={98} segments={[['#168bb9', plant.progress], ['#edf3f6', 100 - plant.progress]]} label={`${plant.progress}%`} />
            <div>
              <strong className="text-sm">{t('Acompanhamento geral')}</strong>
              <p className="mt-2 text-xs leading-[1.7] text-[#91a0ad]">{t('Percentual ilustrativo. O cálculo e o peso de cada etapa serão definidos quando os dados reais forem cadastrados.')}</p>
            </div>
          </div>
          <div className="mt-[18px] grid grid-cols-3 gap-2.5">
            {phases.map(([icon, label, sub]) => (
              <div key={label} className="rounded-[9px] bg-[#f6f9fb] p-3 text-xs leading-[1.45]">
                {icon}&nbsp;&nbsp; {label}
                <small className="mt-[5px] block text-[#90a0ae]">{sub}</small>
              </div>
            ))}
          </div>
          <Notice>{t('As frentes de trabalho podem acontecer em paralelo, conforme o planejamento.')}</Notice>
        </Panel>

        <Panel title={t('Alertas e próximas ações')} sub={t('Informações ilustrativas para visualizar o fluxo')}>
          <div className="mt-[22px] grid gap-2.5">
            <AlertRow icon="◷" title={t('Etapa com prazo em atenção')} desc={t('Motivo e nova previsão serão registrados')} count={pad2(plantAlerts.deadline)} />
            <AlertRow icon="⌕" title={t('Vistoria a programar')} desc={t('Previsão no relatório de bordo')} count={pad2(plantAlerts.inspection)} />
            <AlertRow icon="▤" title={t('Documento com validade')} desc={t('Alerta 7 dias antes do vencimento')} count={pad2(plantAlerts.expiringDoc)} />
          </div>
        </Panel>
      </div>

      <div className="my-[18px] grid grid-cols-[1.3fr_1fr] gap-4">
        <Panel title={t('CAPEXtrômetro')} sub={t('Investimento previsto e realizado')}>
          <div className="mt-4 mb-[9px] h-2 overflow-hidden rounded-[20px] bg-[#ecf2f6]">
            <i className="block h-full w-[42%] bg-[#f08a44]" />
          </div>
          <div className="flex justify-between text-xs text-[#90a0ae]">
            <span>{t('Previsto: a informar')}</span>
            <span>{t('Realizado: a informar')}</span>
          </div>
          <Notice>{t('Barra apenas ilustrativa. Valores, critérios e etapas financeiras serão definidos posteriormente.')}</Notice>
        </Panel>
        <Panel title={t('Qualidade e vistorias')} sub={t('Prevenção, inspeções e acompanhamento')}>
          <div className="mt-[13px] flex flex-wrap gap-[7px]">
            {[t('✓ Conferência preventiva'), t('⌕ Vistoria Kromos'), t('↻ Correções e histórico')].map(l => (
              <span key={l} className="rounded-[20px] bg-[#f2f6f9] px-2.5 py-[7px] text-[10px] text-[#718397]">{l}</span>
            ))}
          </div>
          <Notice>{t('A {epc} registra a execução e suas liberações. A Kromos acompanha e registra sua vistoria e decisão.', { epc: plant.epcName })}</Notice>
        </Panel>
      </div>

      <Panel title={t('Explore esta usina')} sub={t('Acesse as próximas áreas da plataforma')}>
        <div className="mt-[15px] grid grid-cols-4 gap-3">
          {shortcuts.map(s => (
            <button key={s.label} type="button" onClick={s.go}
              className="rounded-[10px] border border-[#e8eef3] bg-[#f9fbfd] p-4 text-left text-xs font-bold text-ink-soft hover:border-[#e89259] hover:bg-[#fff9f5]">
              {s.icon}&nbsp;&nbsp; {s.label}
              <span className="mt-[7px] block leading-normal font-normal text-[#91a0ae]">{s.sub}</span>
            </button>
          ))}
        </div>
        <Notice>{t('Indicadores e equipamentos serão detalhados nas próximas etapas.')}</Notice>
      </Panel>
    </>
  )
}

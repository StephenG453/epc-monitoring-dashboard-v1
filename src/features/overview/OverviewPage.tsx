import { AlertRow, DemoBadge, Donut, PageHeading, Panel, StatCard } from '@/components/ui'
import { pad2 } from '@/lib/utils'
import { t } from '@/lib/i18n'
import { summary } from '@/data/plants'
import { PlantTable } from './PlantTable'

const BLUE = '#168bb9', ORANGE = '#f28a45', GREEN = '#2aa987'

export function OverviewPage() {
  const s = summary
  return (
    <>
      <PageHeading
        kicker={t('PAINEL DE GESTÃO')}
        title={t('Visão geral das usinas')}
        subtitle={t('Todas as suas usinas, em um só lugar.')}
        right={<DemoBadge>{t('PRÉVIA · DADOS ILUSTRATIVOS')}</DemoBadge>}
      />

      <div className="grid grid-cols-5 gap-[15px]">
        <StatCard icon="☀" label={t('Total de usinas')} value={s.total} note={t('Quantidade prevista')} />
        <StatCard icon="◷" label={t('Aguardando início')} value={s.awaiting} note={t('Exemplo ilustrativo')} />
        <StatCard icon="⌁" label={t('Em execução')} value={s.inProgress} note={t('Exemplo ilustrativo')} />
        <StatCard icon="✓" label={t('Entregues')} value={s.delivered} note={t('Exemplo ilustrativo')} />
        <StatCard icon="↗" label={t('CAPEX geral')} value="—" note={t('Previsto e realizado a cadastrar')} />
      </div>

      <div className="mt-[17px] grid grid-cols-[1fr_1.5fr] gap-4">
        <Panel title={t('Panorama das usinas')} sub={t('Distribuição por situação · exemplo')}>
          <div className="flex items-center gap-9 pt-7 pb-1">
            <Donut segments={[[BLUE, s.inProgress], [ORANGE, s.awaiting], [GREEN, s.delivered]]} label={s.total} />
            <div className="grid w-full gap-3.5 text-xs">
              {([[BLUE, t('Em execução'), s.inProgress], [ORANGE, t('Aguardando início'), s.awaiting], [GREEN, t('Entregues'), s.delivered]] as const).map(([c, l, v]) => (
                <div key={l} className="flex justify-between gap-2.5">
                  <span><i className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: c }} />{l}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title={t('Atenção necessária')} sub={t('Um resumo do que precisa do seu olhar · exemplo')}>
          <div className="mt-[22px] grid gap-2.5">
            <AlertRow icon="◷" title={t('Etapas em atraso')} desc={t('Obras com prazo a acompanhar')} count={pad2(s.lateStages)} />
            <AlertRow icon="▤" title={t('Documentos próximos do vencimento')} desc={t('Verifique os próximos 7 dias')} count={pad2(s.docsExpiring)} />
            <AlertRow icon="⌕" title={t('Vistorias pendentes')} desc={t('Etapas aguardando avaliação')} count={pad2(s.pendingInspections)} />
          </div>
        </Panel>
      </div>

      <PlantTable />
    </>
  )
}

export function PlantsPage() {
  return (
    <>
      <PageHeading
        kicker={t('PAINEL DE GESTÃO')}
        title={t('Minhas usinas')}
        subtitle={t('Busque e acompanhe cada projeto.')}
        right={<DemoBadge>{t('PRÉVIA · DADOS ILUSTRATIVOS')}</DemoBadge>}
      />
      <PlantTable />
    </>
  )
}

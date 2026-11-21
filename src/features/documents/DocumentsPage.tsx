import { A, BackLink, Banner, DemoBadge, Hero, Notice, Panel, StatCard } from '@/components/ui'
import { paths } from '@/lib/router'
import { t } from '@/lib/i18n'
import { docFolders } from '@/data/docFolders'
import type { DocFolder, Plant } from '@/types/domain'

// Pre-construction documents: Kromos files and manages them. Three levels, each with its own URL:
// the 11 folders, one folder's items, one item's record.

function DocsFrame({ plant, children }: { plant: Plant; children: React.ReactNode }) {
  return (
    <>
      <div className="mt-[34px] mb-[25px] flex items-center justify-between gap-5">
        <BackLink to={paths.plant(plant.id)}>{t('Voltar ao painel da usina')}</BackLink>
        <DemoBadge>{t('PRÉVIA · SEM DOCUMENTOS REAIS')}</DemoBadge>
      </div>
      <Hero
        kicker={`UFV ${plant.name}`.toUpperCase()}
        title={t('Documentos da usina')}
        subtitle={t('Encontre, confira e acompanhe os documentos da pré-obra em um só lugar.')}
        label={`▤  ${t('{n} pastas', { n: docFolders.length })}`}
      />
      <Banner>{t('A Kromos cadastra e administra os documentos da pré-obra. As datas e situações nesta prévia ainda não estão cadastradas.')}</Banner>
      <div className="mt-[17px] grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-[15px]">
        <StatCard label={t('Pastas de documentos')} value={docFolders.length} note={t('Conforme o manual')} />
        <StatCard label={t('Aprovados')} value="—" note={t('Não informado')} />
        <StatCard label={t('Pendentes ou em análise')} value="—" note={t('Não informado')} />
        <StatCard label={t('Próximos do vencimento')} value="—" note={t('Alerta 7 dias antes')} />
      </div>
      {children}
    </>
  )
}

export function DocumentsPage({ plant }: { plant: Plant }) {
  return (
    <DocsFrame plant={plant}>
      <div className="mt-[34px] mb-[25px]">
        <h1 className="my-2 text-[23px] font-bold tracking-[-0.04em]">{t('Pastas da pré-obra')}</h1>
        <p className="text-[13px] text-[#8796a7]">{t('Selecione uma pasta para consultar seus documentos previstos.')}</p>
      </div>
      <div className="grid grid-cols-3 gap-3.5">
        {docFolders.map(f => (
          <A key={f.id} to={paths.docFolder(plant.id, f.id)}
            className="min-h-[144px] rounded-xl border border-line bg-white p-[19px] text-left shadow-card transition hover:-translate-y-px hover:border-[#edaa7b]">
            <span className="mb-[13px] block text-[22px]">📁</span>
            <strong className="block text-[13px] leading-[1.4]">{t(f.name)}</strong>
            <small className="mt-2 block text-[11px] text-[#91a0ae]">{t('{n} itens previstos', { n: f.items.length })}&nbsp; · &nbsp;{t('Abrir pasta')} →</small>
          </A>
        ))}
      </div>
    </DocsFrame>
  )
}

export function DocFolderPage({ plant, folder }: { plant: Plant; folder: DocFolder }) {
  return (
    <DocsFrame plant={plant}>
      <Panel className="mt-[17px]">
        <BackLink to={paths.documents(plant.id)}>{t('Todas as pastas')}</BackLink>
        <h2 className="mt-5 mb-[5px] text-base font-bold">{t(folder.name)}</h2>
        <span className="text-xs text-faint">{t('Itens previstos no manual · selecione um item para ver os campos')}</span>
        <div className="mt-2">
          {folder.items.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_170px_130px] items-center gap-3 border-b border-[#edf1f4] px-2 py-[15px] text-xs">
              <strong className="leading-normal">{t(item)}</strong>
              <span className="justify-self-start rounded-[20px] bg-[#f0f4f7] px-2.5 py-[7px] text-[10px] text-[#77899b]">{t('Não informado')}</span>
              <A to={paths.docItem(plant.id, folder.id, i)} className="rounded-lg bg-[#f3f7fa] px-2.5 py-[9px] text-center text-[11px] font-bold text-[#39718b] hover:bg-[#e8f0f5]">
                {t('Ver ficha')} →
              </A>
            </div>
          ))}
        </div>
        <Notice>{t('As situações, arquivos e datas reais serão preenchidos pela Kromos na plataforma funcional.')}</Notice>
      </Panel>
    </DocsFrame>
  )
}

export function DocItemPage({ plant, folder, index }: { plant: Plant; folder: DocFolder; index: number }) {
  const fields: [string, string][] = [
    [t('Situação'), t('A solicitar / recebido / em análise / devolvido / aprovado')],
    [t('Arquivo ou link direto'), t('A cadastrar pela Kromos · o link deverá abrir o documento específico')],
    [t('Emissor, versão e data de emissão'), t('Não informados')],
    [t('Data de vencimento, quando aplicável'), t('Não informada · alerta previsto 7 dias antes')],
    [t('Responsável, aprovação e observações'), t('Não informados')],
  ]
  return (
    <DocsFrame plant={plant}>
      <Panel className="mt-[17px]">
        <BackLink to={paths.docFolder(plant.id, folder.id)}>{t('Voltar aos documentos da pasta')}</BackLink>
        <h2 className="mt-5 mb-[5px] text-base font-bold">{t(folder.items[index])}</h2>
        <span className="text-xs text-faint">{t(folder.name)} · {t('Exemplo de ficha para visualização · campos ainda não editáveis')}</span>
        {fields.map(([label, value]) => (
          <div key={label} className="mt-2.5 rounded-[10px] bg-tint p-3 text-xs text-[#6b7f90]">
            <b className="mb-[5px] block text-[#253d56]">{label}</b>{value}
          </div>
        ))}
        <Banner>{t('Esta ficha é uma demonstração. Envio de arquivo, registro, avisos automáticos e aprovações serão desenvolvidos na plataforma funcional.')}</Banner>
      </Panel>
    </DocsFrame>
  )
}

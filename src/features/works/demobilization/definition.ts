import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'
import { inverterLots } from '@/data/lots'

// 2.16 Desmobilização e limpeza final, as approved in Bruno's prototype (demobilization-forms.js) and the
// manual (chapter 3, folder 2.16): one form for the whole plant, the five stages in the left column, quality
// management in every stage, one send at the end. Completing demobilization does not close open issues: they
// stay listed with their owner and deadline.

const STAGES = ['Planejamento da desmobilização', 'Retiradas e permanências', 'Limpeza de módulos', 'Limpeza de obra', 'Conferência e conclusão']
const INVERTERS = 'inverters'

/** One of stage 2's numbered lists: one line per item, "+ Adicionar…" for another. */
const itemList = (key: string, title: string, label: string, addLabel: string): Field[] => [
  { kind: 'heading', text: title },
  { kind: 'repeat', key, addLabel, fields: [{ kind: 'text', key: 'item', label }] },
]

const stageFields: Field[][] = [
  [
    { kind: 'grid', fields: [
      { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
      { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
      { kind: 'text', key: 'team', label: 'Equipe responsável' },
      { kind: 'text', key: 'owner', label: 'Responsável pela desmobilização' },
    ] },
    { kind: 'textarea', key: 'plannedRemoval', label: 'Recursos previstos para retirada', help: 'Relacione equipes, máquinas, materiais e equipamentos.' },
    { kind: 'textarea', key: 'plannedRemaining', label: 'Recursos que permanecerão na usina', help: 'Identifique o que permanecerá para a operação.' },
  ],
  [
    ...itemList('resources', 'Máquinas e materiais a retirar', 'Máquina ou material a retirar', 'Adicionar máquina ou material'),
    ...itemList('facilities', 'Instalações provisórias a retirar', 'Instalação provisória a retirar', 'Adicionar instalação provisória'),
    ...itemList('remaining', 'Permanecerá na usina', 'Item que permanecerá na usina', 'Adicionar item'),
    { kind: 'text', key: 'removalOwner', label: 'Responsável' },
    { kind: 'attach', key: 'removalPhotos', label: 'Fotos', images: true },
    { kind: 'textarea', key: 'removalNotes', label: 'Observações' },
  ],
  [
    { kind: 'repeat', key: 'sectors', title: 'Setor', addLabel: 'Adicionar setor', fields: [
      { kind: 'grid', fields: [
        { kind: 'text', key: 'sector', label: 'Setor', help: 'Informe o setor conforme o projeto.' },
        { kind: 'point', key: 'inverter', label: 'Inversor', source: INVERTERS },
      ] },
      { kind: 'attach', key: 'photos', label: 'Fotos', images: true },
    ] },
  ],
  [
    { kind: 'textarea', key: 'cleaningMachines', label: 'Máquinas usadas para limpeza' },
    { kind: 'yesno', key: 'outsourcedDisposal', label: 'Descarte terceirizado?' },
    { kind: 'text', key: 'disposalLocation', label: 'Local específico para descarte — qual?' },
    { kind: 'yesno', key: 'siteReady', label: 'Local limpo e pronto para entrega?' },
    { kind: 'attach', key: 'cleaningPhotos', label: 'Fotos', images: true },
  ],
  [
    { kind: 'grid', cols: 3, fields: [
      { kind: 'date', key: 'actualStart', label: 'Início real' },
      { kind: 'date', key: 'actualEnd', label: 'Término real' },
      { kind: 'text', key: 'completionOwner', label: 'Responsável pela conferência final' },
    ] },
    { kind: 'radio', key: 'completionStatus', label: 'Conclusão informada pela {epc}', options: ['Concluída', 'Concluída com pendências', 'Não concluída'] },
    { kind: 'yesno', key: 'pending', label: 'Há pendências remanescentes?' },
    { kind: 'when', key: 'pending', equals: 'Sim', fields: [
      { kind: 'text', key: 'pendingRefs', label: 'Códigos das ocorrências ou registros de origem' },
      { kind: 'textarea', key: 'pendingDescription', label: 'Pendências remanescentes' },
      { kind: 'grid', fields: [
        { kind: 'text', key: 'pendingOwner', label: 'Responsável pela pendência' },
        { kind: 'date', key: 'pendingDue', label: 'Prazo' },
      ] },
    ] },
    { kind: 'attach', key: 'finalReport', label: 'Relatório final de desmobilização' },
    { kind: 'photos', key: 'finalNotes' },
    // Kromos's own review, separate from CESBE's completion (manual, folder 2.16).
    { kind: 'heading', text: 'Kromos — análise e conclusão' },
    { kind: 'note', text: 'Aguardando análise · campo próprio da Kromos' },
  ],
]

export const demobilization: RecordsConfig = {
  draft: 'desmobilizacao',
  stages: STAGES,
  stageFields: () => stageFields,
  materialsStage: -1,
  materialFields: [],
  materialOk: '',
  completionAfter: [],
  // "Sim" lists pendingDescription · pendingOwner · pendingDue among the outstanding issues.
  issueKeys: ['pending'],
  extraPending: values => [
    ...(values.siteReady === 'Não' ? ['Local ainda não está limpo e pronto para entrega.'] : []),
  ],
  single: { types: [0], title: 'Desmobilização da usina' },
  stageNav: 'Etapas',
  noReferences: true,
  sources: { [INVERTERS]: [...new Set(inverterLots.map(l => l.inverter))] },
  completionNote: 'Concluir a desmobilização não encerra automaticamente as ocorrências pendentes. Elas continuam identificadas, com responsável e prazo.',
  labels: {
    list: '',
    add: '',
    recordTitle: '',
    newRecord: '',
    noCode: '',
    codeMissing: '',
    codeDuplicate: '',
    noPending: 'Nenhuma pendência registrada.',
    designNote: '',
  },
}

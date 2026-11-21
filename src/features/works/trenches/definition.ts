import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'

// 2.7 Valas e caixas de passagem para cabos, as approved in Bruno's prototype (trench-forms.js): four groups
// (DC, AC and communications trenches; cable access chambers), each with its own reference design; one
// independent record per trench or chamber, identified by its design code; five stages with quality
// management in each. A trench's origin and destination can be chambers already entered.
//
// The manual's 2.7 table lists six stages (with "Inspeção antes do fechamento" and "Liberação por trecho");
// the prototype's approved form has five, with the review before covering inside Execution. This follows
// the prototype; Bruno to confirm.

const TYPES = ['Valas CC', 'Valas CA', 'Valas de comunicação', 'Caixas de passagem']
const CHAMBERS = 3
const STAGES = ['Conferência antes do início', 'Recebimento e armazenamento dos materiais', 'Execução', 'Fechamento e recomposição', 'Conclusão']
const ADJUST = 'Necessita ajuste'
const STATUS = ['Não iniciada', 'Em execução', 'Concluída']

function stageFields(type: number): Field[][] {
  const box = type === CHAMBERS
  const prestart: Field[] = [
    { kind: 'grid', fields: [
      { kind: 'text', key: 'code', label: box ? 'Código da caixa' : 'Código do trecho', help: 'Informe exatamente o código usado no CAD e no PDF.' },
      { kind: 'text', key: 'name', label: 'Identificação ou localização' },
      ...(box ? [] : [
        { kind: 'point', key: 'origin', label: 'Origem', source: 'chambers' },
        { kind: 'point', key: 'destination', label: 'Destino', source: 'chambers' },
      ] as Field[]),
      { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
      { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
      { kind: 'date', key: 'actualStart', label: 'Início real' },
      { kind: 'date', key: 'actualEnd', label: 'Término real' },
    ] },
    { kind: 'checks', key: 'preCheck', label: 'Conferências realizadas', options: box
      ? ['Marcação da posição', 'Dimensões', 'Profundidade', 'Entradas e saídas dos eletrodutos']
      : ['Marcação do trajeto', 'Largura', 'Profundidade', 'Interferências', 'Posição das caixas previstas'] },
    { kind: 'issue', key: 'blocked', label: 'Há impedimentos para iniciar?' },
    { kind: 'photos', key: 'preNotes' },
  ]

  const execution: Field[] = [
    { kind: 'checks', key: 'service', label: 'Serviços realizados', options: box
      ? ['Escavação', 'Preparação da base', 'Instalação da caixa', 'Entradas e saídas dos eletrodutos', 'Instalação da tampa']
      : ['Escavação', 'Preparação do fundo', 'Instalação dos eletrodutos', 'Montagem das conexões', 'Instalação da sinalização'] },
    { kind: 'grid', fields: [
      { kind: 'number', key: 'executedQty', label: 'Quantidade executada' },
      { kind: 'select', key: 'executionUnit', label: 'Unidade', options: box ? ['un'] : ['m', 'un', 'm³'] },
      { kind: 'select', key: 'executionStatus', label: 'Situação da execução', options: STATUS },
    ] },
    { kind: 'issue', key: 'executionIssue', label: 'Há impedimentos ou divergências?' },
    // Review before covering: what will be buried is checked and recorded first (manual 3.4, folder 2.7).
    { kind: 'heading', text: 'Conferência antes do fechamento' },
    { kind: 'checks', key: 'reviewCheck', label: 'Itens conferidos conforme o projeto', options: box
      ? ['Posição', 'Dimensões', 'Base', 'Entradas e saídas dos eletrodutos', 'Tampa']
      : ['Trajeto', 'Largura', 'Profundidade', 'Eletrodutos', 'Conexões', 'Caixas', 'Sinalização'] },
    { kind: 'select', key: 'reviewResult', label: 'Resultado', options: ['Ainda não conferido', 'Conforme', ADJUST] },
    { kind: 'photos', key: 'execNotes', label: 'Fotos antes de cobrir' },
  ]

  const closing: Field[] = [
    { kind: 'checks', key: 'finishCheck', label: 'Serviços realizados', options: ['Reaterro', 'Compactação', 'Recomposição', 'Limpeza'] },
    { kind: 'select', key: 'finishStatus', label: 'Situação', options: STATUS },
    { kind: 'issue', key: 'finishIssue', label: 'Há pendências ou correções?' },
    { kind: 'photos', key: 'finishNotes' },
  ]

  const completion: Field[] = [
    { kind: 'radio', key: 'completionStatus', label: 'Situação final', options: ['Concluído', 'Concluído com pendências', 'Não concluído'] },
    { kind: 'date', key: 'actualEnd', label: 'Data real de término', help: 'Mesma data cadastrada no início.' },
  ]

  return [prestart, [], execution, closing, completion]
}

export const trenches: RecordsConfig = {
  draft: 'valas',
  stages: STAGES,
  stageFields,
  materialsStage: 1,
  materialFields: [
    { kind: 'select', key: 'material', label: 'Material', options: ['Eletroduto', 'Conexão', 'Caixa', 'Tampa', 'Areia', 'Fita de sinalização', 'Outro'] },
    { kind: 'text', key: 'specification', label: 'Especificação', help: 'Tipo e dimensões conforme o projeto.' },
    { kind: 'grid', fields: [
      { kind: 'number', key: 'plannedQty', label: 'Quantidade prevista' },
      { kind: 'number', key: 'receivedQty', label: 'Quantidade recebida' },
      { kind: 'select', key: 'unit', label: 'Unidade', options: ['m', 'un', 'm³', 'kg'] },
      { kind: 'date', key: 'receiptDate', label: 'Data do recebimento' },
    ] },
    { kind: 'radio', key: 'condition', label: 'Condição do material', options: ['Conforme', 'Com avaria', 'Divergente'] },
    { kind: 'text', key: 'storage', label: 'Local de armazenamento' },
    { kind: 'photos', key: 'materialNotes' },
  ],
  materialOk: 'Conforme',
  completionAfter: [{ kind: 'photos', key: 'finalNotes', label: 'Fotos finais e observações' }],
  issueKeys: ['blocked', 'executionIssue', 'finishIssue'],
  types: { title: 'Grupos', names: TYPES },
  typeLabels: type => type === CHAMBERS
    ? { add: 'Adicionar caixa', recordTitle: 'CAIXA', newRecord: 'Caixa — informar código do projeto' }
    : { add: 'Adicionar vala', recordTitle: 'VALA', newRecord: 'Vala — informar código do projeto' },
  designPerType: true,
  uniqueWithinType: true,
  points: { source: 'chambers', fromType: CHAMBERS, keys: ['origin', 'destination'] },
  sendRequires: type => (type === CHAMBERS ? [] : ['origin', 'destination']),
  extraPending: values => (values.reviewResult === ADJUST ? ['Conferência antes do fechamento: necessita ajuste.'] : []),
  labels: {
    list: 'Valas e caixas de passagem',
    add: 'Adicionar vala',
    recordTitle: 'VALA',
    newRecord: 'Vala — informar código do projeto',
    noCode: 'Registro sem código',
    codeMissing: 'Informe o código conforme o projeto.',
    codeDuplicate: 'Código já cadastrado. Use o registro existente.',
    noPending: 'Nenhuma pendência registrada neste item.',
    designNote: 'Mesmo código no CAD, no PDF e na plataforma.',
  },
}

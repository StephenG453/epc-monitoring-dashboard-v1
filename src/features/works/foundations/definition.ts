import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'

// 2.6 Fundações e bases, as approved in Bruno's prototype (foundation-forms.js) and the manual (chapter 3,
// folder 2.6): a type column on the left; one record per foundation or base, identified by its design code,
// with five stages and quality management in each. Types 2 to 7 have the approved type-specific checklists;
// types 1 and 8 keep the earlier generic lists (manual: "Items 1 and 8 retain existing preview details").

const TYPES = ['Estruturas dos módulos ou trackers', 'Inversores', 'Quadros elétricos', 'Transformadores', 'Cabine ou subestação',
  'BESS, quando houver', 'Periféricos', 'Outras previstas no projeto']
const STAGES = ['Conferência antes do início', 'Materiais', 'Execução', 'Conferência e acabamento', 'Conclusão da fundação ou base']

const isElectrical = (type: number) => type >= 2 && type <= 5   // switchboards, transformers, substation, BESS

function prestartChecks(type: number) {
  if (type >= 1 && type <= 5) return ['Projeto vigente', 'Marcação dos pontos', 'Alinhamento', 'Altura da base', 'Acessos com eletrodutos']
  return ['Projeto vigente', 'Marcação dos pontos', 'Alinhamento', 'Altura ou nível de referência', 'Acessos', 'Interferências']
}

function services(type: number) {
  if (type === 1) return ['Montagem da estrutura', 'Concretagem do radier']
  if (isElectrical(type)) return ['Marcação dos pontos', 'Alinhamento', 'Montagem das formas', 'Armação ou ferragem', 'Montagem da infraestrutura de eletrodutos', 'Concretagem']
  if (type === 6) return ['Marcação dos pontos', 'Perfuração', 'Concretagem', 'Montagem da estrutura de suporte']
  return ['Marcação dos pontos', 'Perfuração', 'Cravação', 'Escavação', 'Montagem de formas', 'Armação', 'Posicionamento dos chumbadores', 'Concretagem', 'Montagem da estrutura ou suporte', 'Cura do concreto']
}

/** Inspection and completion checklists match the type's execution services (manual 3.4, folder 2.6). */
function checked(type: number, stage: 'review' | 'final') {
  if (type === 1) return ['Estrutura montada e conferida', 'Radier concretado e conferido']
  if (isElectrical(type)) return ['Marcação dos pontos conferida', 'Alinhamento conferido', 'Formas conferidas antes da concretagem',
    'Armação ou ferragem conferida antes da concretagem', 'Infraestrutura de eletrodutos conferida', 'Concretagem concluída e conferida']
  if (type === 6) return ['Marcação dos pontos conferida', 'Perfuração concluída e conferida', 'Concretagem concluída e conferida', 'Estrutura de suporte montada e conferida']
  return stage === 'review'
    ? ['Orientação', 'Alinhamento', 'Altura ou nível da base', 'Posição das estacas ou fundações', 'Dimensões', 'Chumbadores ou suportes', 'Condição do concreto, quando aplicável', 'Acabamento']
    : ['Execução conforme projeto', 'Orientação alinhamento e altura conferidos', 'Acabamento concluído', 'Limpeza concluída']
}

const DRILLED = 'Estaca ou pilote perfurado e concretado'

function stageFields(type: number): Field[][] {
  const typeSpecific: Field[] =
    type === 0 ? [
      { kind: 'text', key: 'tableLine', label: 'Mesa ou linha' },
      { kind: 'number', key: 'moduleCount', label: 'Módulos por mesa ou linha', help: 'Quantidade prevista no projeto. Não registra instalação dos módulos.' },
    ]
    : type === 6 ? [{ kind: 'select', key: 'peripheralType', label: 'Tipo de periférico', options: ['Iluminação', 'CFTV', 'Estação meteorológica'] }]
    : type === 7 ? [{ kind: 'text', key: 'otherType', label: 'Tipo previsto no projeto' }]
    : []

  const prestart: Field[] = [
    { kind: 'grid', fields: [
      { kind: 'text', key: 'code', label: 'Código conforme o projeto', help: 'Informe exatamente o código usado no CAD e no PDF.' },
      { kind: 'text', key: 'name', label: 'Identificação da fundação ou base' },
      { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
      { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
      { kind: 'date', key: 'actualStart', label: 'Início real' },
      { kind: 'date', key: 'actualEnd', label: 'Término real' },
    ] },
    ...typeSpecific,
    { kind: 'checks', key: 'preCheck', label: 'Conferências realizadas', options: prestartChecks(type) },
    { kind: 'issue', key: 'blocked', label: 'Há impedimentos para iniciar?' },
    { kind: 'photos', key: 'preNotes' },
  ]

  const execution: Field[] = [
    { kind: 'select', key: 'method', label: 'Método previsto no projeto', options: ['Estaca cravada', DRILLED, 'Fundação ou base superficial', 'Outro'] },
    // Depth and diameter apply to drilled piles: module structures, auxiliary systems and other foundations.
    ...([0, 6, 7].includes(type) ? [{ kind: 'when', key: 'method', equals: DRILLED, fields: [
      { kind: 'grid', fields: [
        { kind: 'number', key: 'pileDepth', label: 'Profundidade executada (m)' },
        { kind: 'number', key: 'pileDiameter', label: 'Diâmetro executado (mm)' },
      ] },
    ] } as Field] : []),
    { kind: 'checks', key: 'service', label: 'Serviços previstos ou realizados', options: services(type) },
    { kind: 'grid', fields: [
      { kind: 'select', key: 'executionStatus', label: 'Situação da execução', options: ['Não iniciada', 'Em execução', 'Concluída'] },
      { kind: 'number', key: 'executedQty', label: 'Quantidade executada' },
      { kind: 'select', key: 'executionUnit', label: 'Unidade', options: ['un', 'm', 'm³'] },
    ] },
    { kind: 'textarea', key: 'executionRecord', label: 'Registro da execução conforme o projeto',
      help: 'Informe medidas e registros aplicáveis ao método: profundidade, dimensões e concretagem, quando previstos.' },
    { kind: 'issue', key: 'executionIssue', label: 'Há impedimentos ou divergências?' },
    { kind: 'photos', key: 'execNotes', label: 'Fotos da execução e observações' },
  ]

  const review: Field[] = [
    { kind: 'checks', key: 'reviewCheck', label: 'Conferências realizadas conforme o projeto', options: checked(type, 'review') },
    { kind: 'radio', key: 'reviewResult', label: 'Resultado da conferência', options: ['Conforme', 'Necessita ajuste', 'Ainda não conferido'] },
    { kind: 'issue', key: 'finishIssue', label: 'Há pendências ou correções?' },
    { kind: 'photos', key: 'finishNotes' },
  ]

  const completion: Field[] = [
    { kind: 'radio', key: 'completionStatus', label: 'Situação da fundação ou base', options: ['Concluído', 'Concluído com pendências', 'Não concluído'] },
    { kind: 'date', key: 'actualEnd', label: 'Data real de término', help: 'Mesma data cadastrada no início.' },
    { kind: 'checks', key: 'finalCheck', label: 'Conferência final', options: checked(type, 'final') },
  ]

  return [prestart, [], execution, review, completion]
}

export const foundations: RecordsConfig = {
  draft: 'fundacoes',
  stages: STAGES,
  stageFields,
  materialsStage: 1,
  materialFields: [
    { kind: 'select', key: 'material', label: 'Material', options: ['Estaca ou pilote', 'Aço ou armadura', 'Concreto', 'Forma', 'Chumbador', 'Estrutura ou suporte', 'Brita', 'Outro'] },
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
  types: { title: 'Fundações e bases', names: TYPES },
  labels: {
    list: 'Fundações e bases',
    add: 'Adicionar fundação ou base',
    recordTitle: 'FUNDAÇÃO OU BASE',
    newRecord: 'Nova fundação ou base — informar código do projeto',
    noCode: 'Fundação ou base sem código',
    codeMissing: 'Informe o código da fundação ou base conforme o projeto.',
    codeDuplicate: 'Código já cadastrado. Use o registro existente.',
    noPending: 'Nenhuma pendência registrada nesta fundação ou base.',
    designNote: 'Mesmo código no projeto, no PDF e na plataforma.',
  },
}

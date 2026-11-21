import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'

// 2.11 Instalação elétrica e aterramento, as approved in Bruno's prototype (electrical-forms.js) and the
// manual (chapter 3, folder 2.11): connection fronts and grounding in the left column; each front's reference
// design opens its PDF (no revision field); one record per run, coded exactly as in the CAD or the stage PDF
// (two runs of the same circuit are separate records; grounding uses sections); four stages with quality
// management in each. Pre-energization tests link to the same circuit in 2.13.

const FRONTS = ['Instalação CC', 'Inversor → QDG/QGBT', 'QDG/QGBT → Transformador', 'Transformador → Cabine', 'Aterramento']
const DC = 0
const INV_QGBT = 1
const GROUNDING = 4
const STAGES = ['Antes de iniciar', 'Materiais', 'Execução e conferência', 'Conclusão']
const STATES = ['A iniciar', 'Em execução', 'Concluído', 'Com pendência']
const CHECK = ['Pendente', 'Conforme', 'Com divergência']
const EXAMPLES = ['L-CC-031', 'L-CA-031', 'L-CA-041', 'L-MT-051', 'AT-01']

const done: (string[] | null)[] = [
  ['String montada', 'Cabos lançados e identificados', 'Ligação na string box (quando prevista)', 'Ligação no inversor', 'Conferido'],
  null, null, null,
  ['Trecho executado', 'Conexões aos equipamentos registradas', 'Conferido'],
]
const DEFAULT_DONE = ['Cabo lançado', 'Conectado na origem', 'Conectado no destino', 'Conferido']

function stageFields(type: number): Field[][] {
  const ground = type === GROUNDING
  const execution: Field[] = [
    { kind: 'text', key: 'code', label: ground ? 'Código do trecho' : 'Código do lançamento',
      help: `Digite o código exatamente como consta no CAD ou no PDF da etapa. Ex.: ${EXAMPLES[type]}` },
    { kind: 'grid', fields: [
      { kind: 'text', key: 'origin', label: 'Origem' },
      { kind: 'text', key: 'destination', label: 'Destino' },
      { kind: 'number', key: 'lengthPlan', label: 'Extensão prevista (m)' },
      { kind: 'number', key: 'lengthDone', label: 'Extensão executada (m)' },
      { kind: 'select', key: 'progress', label: 'Avanço', options: STATES },
    ] },
    // DC: the protection used, and if it is external, which device and its check (manual, folder 2.11).
    ...(type === DC ? [
      { kind: 'grid', fields: [
        { kind: 'text', key: 'string', label: 'Código da string' },
        { kind: 'text', key: 'entry', label: 'Entrada prevista no inversor' },
        { kind: 'select', key: 'protection', label: 'Proteção CC', options: ['Integrada', 'Externa'] },
      ] },
      { kind: 'when', key: 'protection', equals: 'Externa', fields: [
        { kind: 'grid', fields: [
          { kind: 'text', key: 'box', label: 'Código da string box ou proteção externa' },
          { kind: 'select', key: 'protectionCheck', label: 'Conferência da proteção', options: CHECK },
        ] },
      ] },
    ] as Field[] : []),
    { kind: 'checks', key: 'execution', label: 'Serviços executados e conferidos', options: done[type] ?? DEFAULT_DONE },
    ...(type === INV_QGBT ? [{ kind: 'select', key: 'breakerCheck', label: 'Conferência do DJ CA', options: CHECK } as Field] : []),
    // Termination torque at both ends, for the AC and MV fronts.
    ...(type > DC && type < GROUNDING ? [{ kind: 'details', title: 'Registrar torque nas terminações, quando aplicável', fields: [
      { kind: 'grid', fields: [
        { kind: 'number', key: 'torquePlanOrigin', label: 'Origem · Torque especificado (N·m)' },
        { kind: 'number', key: 'torqueDoneOrigin', label: 'Origem · Torque aplicado (N·m)' },
        { kind: 'number', key: 'torquePlanDest', label: 'Destino · Torque especificado (N·m)' },
        { kind: 'number', key: 'torqueDoneDest', label: 'Destino · Torque aplicado (N·m)' },
        { kind: 'text', key: 'tool', label: 'Ferramenta calibrada' },
      ] },
    ] } as Field] : []),
    { kind: 'photos', key: 'executionNotes' },
  ]

  return [
    [
      { kind: 'grid', fields: [
        { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
        { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
        { kind: 'text', key: 'infrastructure', label: 'Referência da infraestrutura' },
      ] },
      { kind: 'issue', key: 'blocked', label: 'Há impedimentos?' },
    ],
    [
      { kind: 'grid', fields: [
        { kind: 'text', key: 'material', label: 'Cabo / condutor conforme o projeto' },
        { kind: 'number', key: 'section', label: 'Seção prevista (mm²)' },
        { kind: 'number', key: 'materialQty', label: 'Quantidade recebida (m)' },
        { kind: 'text', key: 'accessories', label: 'Terminais e acessórios' },
      ] },
      { kind: 'photos', key: 'materialsNotes' },
    ],
    execution,
    [
      { kind: 'grid', fields: [
        { kind: 'date', key: 'actualStart', label: 'Início real' },
        { kind: 'date', key: 'actualEnd', label: 'Término real' },
      ] },
      { kind: 'select', key: 'status', label: 'Situação final', options: STATES },
      { kind: 'textarea', key: 'pendingNotes', label: 'Pendências' },
    ],
  ]
}

export const electrical: RecordsConfig = {
  draft: 'eletrica',
  stages: STAGES,
  stageFields,
  materialsStage: -1,
  materialFields: [],
  materialOk: '',
  completionAfter: [{ kind: 'photos', key: 'finalNotes', label: 'Fotos finais' }],
  issueKeys: ['blocked'],
  extraPending: values => [
    ...(values.protection === 'Externa' && values.protectionCheck === 'Com divergência' ? ['Proteção CC com divergência.'] : []),
    ...(values.breakerCheck === 'Com divergência' ? ['DJ CA com divergência.'] : []),
  ],
  types: { title: 'Frentes de ligação', names: FRONTS },
  typeLabels: type => type === GROUNDING
    ? { add: 'Adicionar trecho', recordTitle: 'TRECHO', newRecord: 'Novo trecho' }
    : { add: 'Adicionar lançamento', recordTitle: 'LANÇAMENTO', newRecord: 'Novo lançamento' },
  typeDesigns: [
    { label: 'Projeto elétrico CC', pdf: '/reference/electrical/cc.pdf' },
    { label: 'Projeto elétrico CA', pdf: '/reference/electrical/ca-inv.pdf' },
    { label: 'Projeto elétrico CA', pdf: '/reference/electrical/ca-trafo.pdf' },
    { label: 'Projeto de média tensão', pdf: '/reference/electrical/mt.pdf' },
    { label: 'Projeto de aterramento', pdf: '/reference/electrical/terra.pdf' },
  ],
  // Circuit and AC breaker codes are fields of their own, separate from the run code (manual, folder 2.11).
  headerFields: type => type === GROUNDING ? [] : [
    { kind: 'grid', fields: [
      { kind: 'text', key: 'circuit', label: 'Código do circuito conforme o projeto' },
      ...(type === INV_QGBT ? [{ kind: 'text', key: 'breaker', label: 'DJ CA', help: 'Informe o código do disjuntor no quadro.' } as Field] : []),
    ] },
  ],
  uniqueWithinType: true,
  sendRequires: type => ['origin', 'destination', ...(type === INV_QGBT ? ['circuit', 'breaker'] : [])],
  completionNote: 'Aceite em campo próprio da Kromos. Testes antes da energização: 2.13. Energização: 2.14. Comissionamento: 2.15.',
  labels: {
    list: 'Lançamentos',
    add: 'Adicionar lançamento',
    recordTitle: 'LANÇAMENTO',
    newRecord: 'Novo lançamento',
    noCode: 'Sem código',
    codeMissing: 'Digite o código conforme o projeto.',
    codeDuplicate: 'Este código já está em uso nesta frente.',
    noPending: 'Nenhuma pendência registrada neste lançamento.',
    designNote: '',
  },
}

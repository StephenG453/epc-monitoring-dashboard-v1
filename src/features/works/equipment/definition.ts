import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'
import { inverterLots } from '@/data/lots'

// 2.10 Montagem física dos equipamentos, as approved in Bruno's prototype (equipment-forms.js) and the manual
// (chapter 3, folder 2.10): one record per design code (inverter, QGBT main LV switchboard, transformer,
// substation, BESS where in scope), four stages with quality management in each. It ends at physical
// installation and identification: electrical connections are 2.11, tests 2.13, energization 2.14.
// System maintenance and QR are deferred (manual 3.9), so the prototype's equipment view and QR label are
// not part of this.

const TYPES = ['Inversores', 'QGBT', 'Transformadores', 'Cabines', 'BESS (quando houver)']
const QGBT = 1
const BESS = 4
const STAGES = ['Antes de iniciar', 'Recebimento e conferência', 'Montagem física', 'Conclusão']

/** Sample design codes per type (the prototype's examples; inverters follow the sample lots). */
const CODES: string[][] = [inverterLots.map(l => l.inverter), ['QGBT-01'], ['TR-01'], ['CAB-01'], ['BESS-01']]

const RESULT = ['Aguardando conferência', 'Conforme', 'Com divergência']
const STATUS = ['Não iniciada', 'Em execução', 'Montada com pendências', 'Montada e liberada para ligação elétrica']
/** QGBT: the reserved point for a future BESS connection is mandatory (manual 3.4, folder 2.10). */
const BESS_POINT = 'Ponto reservado para BESS (obrigatório)'

const before = [
  ['Suporte liberado', 'Local conforme o projeto'],
  ['Base liberada', 'Local conforme o projeto'],
  ['Base liberada', 'Local conforme o projeto', 'Acesso para descarga'],
  ['Base liberada', 'Local conforme o projeto', 'Aberturas para cabos conferidas'],
  ['Base liberada', 'Local conforme o projeto'],
]
const received = [
  ['Placa e acessórios', 'Integridade física'],
  ['Identificação', 'Dimensões', 'Componentes e disposição interna', 'Barramentos', BESS_POINT],
  ['Placa e acessórios', 'Integridade física', 'Ausência de vazamento, se a óleo'],
  ['Dimensões', 'Compartimentos', 'Portas', 'Componentes fornecidos'],
  ['Identificação', 'Integridade do conjunto', 'Acessórios fornecidos'],
]
const mounting = [
  ['Posição', 'Fixação', 'Afastamentos', 'Acesso para manutenção'],
  ['Posicionamento', 'Nivelamento', 'Fixação', 'Acessos'],
  ['Posicionamento', 'Nivelamento', 'Fixação', 'Afastamentos'],
  ['Posicionamento', 'Nivelamento', 'Fixação', 'Abertura das portas e acesso para manutenção'],
  ['Posicionamento', 'Nivelamento', 'Fixação', 'Acesso para manutenção'],
]

function stageFields(type: number): Field[][] {
  const note = type === QGBT
    ? 'O QGBT chega pronto da fábrica. Confira o quadro inteiro contra o projeto, incluindo o ponto obrigatório para futura conexão do BESS.'
    : type === BESS ? 'Abra a ficha apenas se a instalação do BESS estiver no escopo da obra.' : ''

  return [
    [
      { kind: 'checks', key: 'before', label: 'Conferências antes de iniciar', options: before[type] },
      { kind: 'grid', fields: [
        { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
        { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
      ] },
      { kind: 'issue', key: 'blocked', label: 'Há impedimentos?' },
    ],
    [
      { kind: 'heading', text: 'Documentos e identificação' },
      { kind: 'doc', key: 'project', label: type === QGBT ? 'Projeto aprovado de fabricação' : 'Projeto aprovado de referência', placeholder: 'Selecione o projeto cadastrado' },
      { kind: 'attach', key: 'projectFile', label: 'Anexar projeto para conferência' },
      { kind: 'doc', key: 'invoice', label: 'Vincular nota fiscal' },
      { kind: 'attach', key: 'invoiceFile', label: 'Anexar nota fiscal' },
      { kind: 'grid', fields: [
        { kind: 'text', key: 'serial', label: 'Número de série' },
        { kind: 'attach', key: 'plate', label: 'Foto da placa', images: true },
      ] },
      { kind: 'doc', key: 'warranty', label: 'Vincular certificado de garantia' },
      { kind: 'attach', key: 'warrantyFile', label: 'Anexar certificado de garantia' },
      // Warranty dates come from the warranty document, not the invoice date (manual 2.7).
      { kind: 'grid', fields: [
        { kind: 'date', key: 'warrantyFrom', label: 'Início da garantia' },
        { kind: 'date', key: 'warrantyUntil', label: 'Vencimento da garantia' },
        { kind: 'text', key: 'manufacturer', label: 'Fabricante' },
        { kind: 'text', key: 'model', label: 'Modelo' },
      ] },
      { kind: 'attach', key: 'manual', label: 'Manual e ficha técnica' },
      { kind: 'attach', key: 'factory', label: 'Relatórios de ensaio de fábrica, quando aplicável' },
      { kind: 'attach', key: 'other', label: 'Outro documento aplicável' },
      { kind: 'heading', text: 'Conferência do equipamento recebido' },
      ...(note ? [{ kind: 'note', text: note } as Field] : []),
      { kind: 'checks', key: 'received', label: 'Itens conferidos', options: received[type] },
      { kind: 'select', key: 'condition', label: 'Resultado da conferência', options: RESULT },
      { kind: 'when', key: 'condition', equals: 'Com divergência', fields: [
        { kind: 'issue', key: 'supply', label: 'Registrar divergência de fornecimento?' },
        { kind: 'photos', key: 'receiptNotes', label: 'Fotos da divergência' },
      ] },
      { kind: 'text', key: 'storage', label: 'Local de armazenamento, se utilizado' },
    ],
    [
      { kind: 'checks', key: 'mount', label: 'Conferências da montagem física', options: mounting[type] },
      { kind: 'details', title: 'Registrar torque, quando aplicável', fields: [
        { kind: 'repeat', key: 'torques', addLabel: 'Adicionar ponto', fields: [
          { kind: 'grid', fields: [
            { kind: 'text', key: 'point', label: 'Ponto de fixação' },
            { kind: 'number', key: 'specified', label: 'Torque especificado (N·m)' },
            { kind: 'number', key: 'applied', label: 'Torque aplicado (N·m)' },
            { kind: 'text', key: 'tool', label: 'Ferramenta calibrada' },
          ] },
        ] },
      ] },
    ],
    [
      { kind: 'grid', fields: [
        { kind: 'date', key: 'actualStart', label: 'Início real' },
        { kind: 'date', key: 'actualEnd', label: 'Término real' },
      ] },
      { kind: 'select', key: 'status', label: 'Situação da montagem', options: STATUS },
      { kind: 'textarea', key: 'pendingNotes', label: 'Pendências' },
    ],
  ]
}

export const equipment: RecordsConfig = {
  draft: 'equipamentos',
  stages: STAGES,
  stageFields,
  materialsStage: -1,
  materialFields: [],
  materialOk: '',
  completionAfter: [{ kind: 'photos', key: 'finalNotes', label: 'Fotos finais' }],
  issueKeys: ['blocked', 'supply'],
  extraPending: values => (values.condition === 'Com divergência' ? ['Recebimento: equipamento com divergência.'] : []),
  types: { title: 'Equipamentos', names: TYPES },
  typeLabels: type => ({ add: ['Adicionar inversor', 'Adicionar QGBT', 'Adicionar transformador', 'Adicionar cabine', 'Adicionar BESS'][type] }),
  noSeedTypes: [BESS],
  catalog: {
    designOptions: [],
    itemLabel: 'Código do equipamento no projeto',
    addLabel: 'Abrir ficha',
    title: '{code}',
    detail: '',
    items: CODES.flatMap((codes, type) => codes.map(code => ({ code, type, rows: [], vars: {} }))),
  },
  // A QGBT can't be sent as compliant or released without its reserved BESS point checked.
  sendValidate: values => {
    const received = Array.isArray(values.received) ? values.received as string[] : []
    const qgbt = typeof values.code === 'string' && values.code.startsWith('QGBT-')
    if (qgbt && (values.condition === 'Conforme' || values.status === STATUS[3]) && !received.includes(BESS_POINT)) {
      return 'Confira o ponto reservado para BESS antes de marcar o quadro como conforme.'
    }
    return null
  },
  completionNote: 'Aceite em campo próprio da Kromos. Ligações elétricas, proteção CC e aterramento: 2.11. Inspeções e testes: 2.13. Energização: 2.14.',
  labels: {
    list: 'Equipamentos',
    add: 'Abrir ficha',
    recordTitle: '',
    newRecord: '',
    noCode: 'Registro sem código',
    codeMissing: 'Selecione um equipamento.',
    codeDuplicate: 'Equipamento já aberto.',
    noPending: 'Nenhuma pendência registrada neste equipamento.',
    designNote: '',
  },
}

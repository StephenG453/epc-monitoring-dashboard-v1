import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'
import { inverterLots } from '@/data/lots'

// 2.8 Montagem das estruturas dos módulos and 2.9 Instalação dos módulos fotovoltaicos, as approved in
// Bruno's prototype (structure-forms.js, module-forms.js) and the manual (chapter 3, folders 2.8 and 2.9):
// select the reference design, then add lots by inverter as identified in it (not thousands of records per
// table). Each lot has four stages, numbered 3 to 6 after the two selections, with quality management in each.
// The two folders differ only in what is counted and checked, so one definition serves both.

const STAGES = ['Materiais', 'Checklist para início', 'Execução', 'Conclusão']

type Variant = {
  draft: string
  design: string
  addLabel: string
  detail: string
  /** Planned count per lot: tables (2.8) or modules (2.9). */
  planned: 'tables' | 'modules'
  materials: string[]
  specification: [string, string]
  released: string
  done: [string, string]
  checks: string[]
  joint: string
  quantityError: string
}

const integer = (v: unknown) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : undefined)

function lotsConfig(v: Variant): RecordsConfig {
  const execution: Field[] = [
    { kind: 'grid', fields: [
      { kind: 'number', key: 'assembled', label: v.done[0] },
      { kind: 'number', key: 'checked', label: v.done[1] },
    ] },
    { kind: 'checks', key: 'review', label: 'Conferências realizadas', options: v.checks },
    // Torque against the design, the manufacturer manual and the inspection plan (manual, folders 2.8/2.9).
    { kind: 'details', title: 'Registrar torque, quando aplicável', fields: [
      { kind: 'repeat', key: 'torques', addLabel: 'Adicionar junção', fields: [
        { kind: 'grid', fields: [
          { kind: 'text', key: 'joint', label: v.joint },
          { kind: 'number', key: 'targetTorque', label: 'Torque especificado (N·m)' },
          { kind: 'number', key: 'actualTorque', label: 'Torque aplicado (N·m)' },
          { kind: 'text', key: 'tool', label: 'Identificação da ferramenta calibrada' },
        ] },
      ] },
    ] },
    { kind: 'issue', key: 'executionIssue', label: 'Há ajustes ou pendências?' },
    { kind: 'photos', key: 'execNotes' },
  ]

  return {
    draft: v.draft,
    stages: STAGES,
    stageFields: () => [
      [],
      [
        { kind: 'select', key: 'released', label: v.released, options: ['Sim', 'Parcialmente', 'Não'] },
        { kind: 'checks', key: 'available', label: 'Linhas disponíveis', source: 'rows' },
        { kind: 'grid', fields: [
          { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
          { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
        ] },
        { kind: 'issue', key: 'blocked', label: 'Há impedimentos para iniciar?' },
        { kind: 'photos', key: 'preNotes' },
      ],
      execution,
      [
        { kind: 'select', key: 'completionStatus', label: 'Situação final', options: ['Concluído', 'Concluído com pendências', 'Não concluído'] },
        { kind: 'grid', fields: [
          { kind: 'date', key: 'actualStart', label: 'Início real' },
          { kind: 'date', key: 'actualEnd', label: 'Término real' },
        ] },
      ],
    ],
    materialsStage: 0,
    materialFields: [
      { kind: 'select', key: 'material', label: 'Material', options: v.materials },
      { kind: 'text', key: 'specification', label: v.specification[0], help: v.specification[1] },
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
    issueKeys: ['blocked', 'executionIssue'],
    stageOffset: 2,
    catalog: {
      designLabel: '1. Selecionar o projeto',
      designOptions: [v.design],
      itemLabel: '2. Selecionar o lote',
      addLabel: v.addLabel,
      title: '{code} · Inversor {inverter}',
      detail: v.detail,
      items: inverterLots.map(l => ({
        code: l.code,
        rows: l.rows,
        vars: { inverter: l.inverter, sector: l.sector, rows: l.rows.join(', '), planned: l[v.planned] },
      })),
    },
    // Checked ≤ done ≤ planned, whole numbers (as in the prototype).
    sendValidate: (values, item) => {
      const done = integer(values.assembled), checked = integer(values.checked), planned = Number(item?.vars.planned)
      const bad = (n: number | undefined) => n !== undefined && (!Number.isInteger(n) || n < 0)
      if (bad(done) || bad(checked) || (done !== undefined && done > planned)
        || (checked !== undefined && (done === undefined || checked > done))) return v.quantityError
      return null
    },
    completionNote: 'Aceite da Kromos registrado separadamente.',
    labels: {
      list: 'Lotes',
      add: v.addLabel,
      recordTitle: '',
      newRecord: '',
      noCode: 'Registro sem código',
      codeMissing: 'Selecione o projeto e o lote.',
      codeDuplicate: 'Lote já adicionado.',
      noPending: 'Nenhuma pendência registrada neste item.',
      designNote: '',
    },
  }
}

export const structures = lotsConfig({
  draft: 'estruturas',
  design: 'Projeto de montagem · Rev. 02 (exemplo)',
  addLabel: 'Adicionar lote de estruturas',
  detail: 'Setor {sector} · Linhas {rows} · {planned} mesas previstas',
  planned: 'tables',
  materials: ['Perfil', 'Suporte', 'Travessa', 'Fixador', 'Componente de tracker', 'Outro'],
  specification: ['Especificação', 'Tipo e dimensões conforme o projeto.'],
  released: 'Fundações liberadas?',
  done: ['Mesas montadas', 'Mesas conferidas'],
  checks: ['Alinhamento', 'Altura', 'Inclinação', 'Fixações', 'Orientação'],
  joint: 'Linha / junção',
  quantityError: 'Confira as quantidades: conferidas ≤ montadas ≤ previstas.',
})

export const modules = lotsConfig({
  draft: 'modulos',
  design: 'Projeto de instalação dos módulos · Rev. 02 (exemplo)',
  addLabel: 'Adicionar lote de instalação',
  detail: 'Setor {sector} · Linhas {rows} · {planned} módulos previstos',
  planned: 'modules',
  materials: ['Módulo fotovoltaico', 'Grampo de fixação', 'Outro'],
  specification: ['Modelo / especificação', 'Informe o modelo ou a referência do material.'],
  released: 'Estruturas liberadas?',
  done: ['Módulos instalados', 'Módulos conferidos'],
  checks: ['Posição', 'Alinhamento', 'Fixação'],
  joint: 'Linha / ponto de fixação',
  quantityError: 'Confira as quantidades: conferidos ≤ instalados ≤ previstos.',
})

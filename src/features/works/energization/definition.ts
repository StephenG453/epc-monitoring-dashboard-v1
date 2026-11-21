import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'

// 2.14 Conexão e energização, as approved in Bruno's prototype (energization-forms.js) and the manual
// (chapter 3, folder 2.14): three fronts in the left column (inverters; switchboard, transformer and
// substation; auxiliary systems), each with its reference design (no revision field). Each inverter, assembly
// or auxiliary system has its own record and design code, with five stages and quality management in each.
// Approving one record does not approve the others. Results from 2.13 are linked, not repeated.

const FRONTS = ['Inversores', 'Quadro, transformador e cabine', 'Sistemas auxiliares']
const ASSEMBLY = 1
const AUXILIARY = 2
const STAGES = ['Referências e planejamento', 'Conferência antes da energização', 'Registro da energização', 'Testes após energização', 'Aprovações e conclusão']
const CODE = [
  { label: 'Código do inversor', help: 'Informe o código conforme o projeto. Exemplo: INV-01' },
  { label: 'Código do conjunto', help: 'Informe o código conforme o projeto. Exemplo: CJ-01' },
  { label: 'Código do sistema', help: 'Informe o código conforme o projeto. Exemplo: AUX-01' },
]

function stageFields(type: number): Field[][] {
  const identification: Field[] =
    type === ASSEMBLY ? [{ kind: 'grid', fields: [
      { kind: 'text', key: 'switchboard', label: 'Código do quadro' },
      { kind: 'text', key: 'transformer', label: 'Código do transformador' },
      { kind: 'text', key: 'cabin', label: 'Código da cabine' },
    ] }]
    : type === AUXILIARY ? [{ kind: 'select', key: 'systemType', label: 'Sistema auxiliar',
      options: ['Comunicação e monitoramento', 'CFTV e segurança', 'Iluminação', 'Estação meteorológica', 'Outro previsto no projeto'] }]
    : []

  return [
    [
      { kind: 'text', key: 'code', label: CODE[type].label, help: CODE[type].help },
      ...identification,
      { kind: 'grid', fields: [
        { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
        { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
        { kind: 'text', key: 'team', label: 'Equipe executora' },
        { kind: 'text', key: 'owner', label: 'Responsável' },
      ] },
    ],
    [
      { kind: 'doc', key: 'priorResults', label: 'Resultados da pasta 2.13', placeholder: 'Vincular registros' },
      { kind: 'text', key: 'priorCodes', label: 'Identificação dos registros vinculados', help: 'Informe os códigos dos resultados correspondentes a esta ficha.' },
      { kind: 'radio', key: 'release', label: 'Situação da liberação', options: ['Liberado', 'Com pendências', 'Não liberado'] },
      { kind: 'attach', key: 'authorizations', label: 'Autorizações aplicáveis' },
      { kind: 'textarea', key: 'releaseNotes', label: 'Pendências ou observações da liberação' },
      { kind: 'grid', fields: [
        { kind: 'text', key: 'releaseOwner', label: 'Responsável pela pendência, se houver' },
        { kind: 'date', key: 'releaseDue', label: 'Prazo da pendência, se houver' },
      ] },
    ],
    [
      { kind: 'radio', key: 'energizationStatus', label: 'Situação', options: ['Não iniciada', 'Realizada', 'Interrompida'] },
      { kind: 'grid', fields: [
        { kind: 'datetime', key: 'energizedAt', label: 'Data e hora' },
        { kind: 'text', key: 'executor', label: 'Responsável pela execução' },
      ] },
      { kind: 'text', key: 'procedure', label: 'Procedimento de referência', help: 'Informe o código ou nome do procedimento utilizado.' },
      { kind: 'attach', key: 'procedureFiles', label: 'Procedimento e evidências' },
      { kind: 'photos', key: 'energizationNotes' },
    ],
    [
      { kind: 'note', text: 'Registre os testes específicos desta ficha conforme o procedimento aplicável.' },
      { kind: 'repeat', key: 'tests', title: 'Verificação', addLabel: 'Adicionar verificação', fields: [
        { kind: 'grid', fields: [
          { kind: 'text', key: 'testName', label: 'Verificação conforme o procedimento', help: 'Identifique o teste aplicável a este inversor, conjunto ou sistema.' },
          { kind: 'select', key: 'testResult', label: 'Resultado', options: ['Conforme', 'Com divergência', 'Não realizado'] },
        ] },
        { kind: 'textarea', key: 'testDetails', label: 'Resultado registrado', help: 'Informe medições e observações quando previstas no procedimento.' },
      ] },
      { kind: 'yesno', key: 'alarms', label: 'Houve alarmes ou falhas?' },
      { kind: 'when', key: 'alarms', equals: 'Sim', fields: [
        { kind: 'textarea', key: 'alarmDetails', label: 'Alarmes ou falhas e ações realizadas' },
      ] },
      { kind: 'attach', key: 'testReport', label: 'Relatório e evidências dos testes' },
    ],
    [
      { kind: 'radio', key: 'finalStatus', label: 'Situação final', options: ['Concluído', 'Com pendências', 'Não concluído'] },
      { kind: 'grid', fields: [
        { kind: 'date', key: 'actualEnd', label: 'Data real de término' },
        { kind: 'text', key: 'verifier', label: 'Responsável pela verificação' },
      ] },
      { kind: 'attach', key: 'finalReport', label: 'Relatório final' },
      // Kromos's own review and approval field, separate from CESBE entry (manual, folder 2.14).
      { kind: 'heading', text: 'Kromos — análise e aprovação' },
      { kind: 'note', text: 'Aguardando análise. Campo próprio da Kromos: nenhuma aprovação é concedida nesta prévia.' },
      { kind: 'textarea', key: 'completionNotes', label: 'Pendências e observações' },
    ],
  ]
}

export const energization: RecordsConfig = {
  draft: 'energizacao',
  stages: STAGES,
  stageFields,
  materialsStage: -1,
  materialFields: [],
  materialOk: '',
  completionAfter: [],
  issueKeys: [],
  extraPending: values => {
    const tests = Array.isArray(values.tests) ? values.tests as Record<string, unknown>[] : []
    return [
      ...(values.release === 'Com pendências' || values.release === 'Não liberado' ? ['Liberação para energização com pendências.'] : []),
      ...(values.energizationStatus === 'Interrompida' ? ['Energização interrompida.'] : []),
      ...(tests.some(t => t.testResult === 'Com divergência') ? ['Teste após energização com divergência.'] : []),
      ...(values.alarms === 'Sim' ? ['Alarmes ou falhas registrados após a energização.'] : []),
    ]
  },
  types: { title: 'Frentes de energização', names: FRONTS },
  typeLabels: type => ({ add: ['Adicionar inversor', 'Adicionar conjunto', 'Adicionar sistema auxiliar'][type] }),
  typeDesigns: [
    { label: 'Projeto de energização dos inversores', pdf: '/reference/electrical/ca-inv.pdf' },
    { label: 'Projeto do quadro, transformador e cabine', pdf: '/reference/electrical/mt.pdf' },
    { label: 'Projeto dos sistemas auxiliares', pdf: '/reference/communication-reference.pdf' },
  ],
  uniqueWithinType: true,
  sendRequires: type => type === ASSEMBLY ? ['switchboard', 'transformer', 'cabin'] : type === AUXILIARY ? ['systemType'] : [],
  completionNote: 'A aprovação de uma ficha não aprova as demais. Comissionamento: 2.15.',
  labels: {
    list: 'Fichas',
    add: 'Adicionar inversor',
    recordTitle: '',
    newRecord: 'Nova ficha — informar código do projeto',
    noCode: 'Sem código',
    codeMissing: 'Informe o código conforme o projeto.',
    codeDuplicate: 'Já existe uma ficha com esse código nesta frente.',
    noPending: 'Nenhuma pendência registrada nesta ficha.',
    designNote: '',
  },
}

import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'

// 2.15 Comissionamento e entrega, as approved in Bruno's prototype (commissioning-forms.js) and the manual
// (chapter 3, folder 2.15): three fronts in the left column. Cold and hot commissioning have one record per
// system, identified by the code in the design, with five stages; cold links its prior results from 2.13,
// hot from 2.14, without repeating those tests. Handover and acceptance is a single record for the whole
// plant with its own five stages. Kromos's acceptance is its own field, separate from CESBE's completion and
// from the document handover.

const FRONTS = ['Comissionamento a frio', 'Comissionamento a quente', 'Entrega e aceite']
const HOT = 1
const HANDOVER = 2
const SYSTEM_STAGES = ['Planejamento', 'Conferência inicial', 'Testes por sistema', 'Correções e novas verificações', 'Conclusão']
const HANDOVER_STAGES = ['Consolidação dos resultados', 'Documentação final', 'Treinamentos e orientações', 'Pendências de entrega', 'Conclusão e aceite']
const SYSTEMS = ['Inversores', 'Quadros elétricos / QGBT', 'Transformadores', 'Cabine ou subestação', 'Aterramento', 'Comunicação e monitoramento',
  'CFTV e segurança', 'Iluminação', 'Estação meteorológica', 'BESS, quando houver', 'Outro previsto no plano']

function systemFields(type: number): Field[][] {
  return [
    [
      { kind: 'select', key: 'plan', label: 'Plano de comissionamento', options: ['Plano de comissionamento — exemplo'] },
      { kind: 'attach', key: 'planFiles', label: 'Plano ou referência documental complementar' },
      { kind: 'grid', fields: [
        { kind: 'select', key: 'systemType', label: 'Sistema', options: SYSTEMS },
        { kind: 'text', key: 'code', label: 'Código do sistema ou conjunto', help: 'Informe a identificação conforme o projeto.' },
      ] },
      { kind: 'grid', fields: [
        { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
        { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
        { kind: 'text', key: 'team', label: 'Equipe executora' },
        { kind: 'text', key: 'owner', label: 'Responsável' },
      ] },
      { kind: 'textarea', key: 'criteria', label: 'Critérios de aceitação', help: 'Informe os critérios ou a referência correspondente no plano.' },
    ],
    [
      { kind: 'text', key: 'priorCodes', label: type === HOT ? 'Registros vinculados da 2.14' : 'Registros vinculados da 2.13',
        help: 'Informe os códigos dos resultados e liberações já registrados; não repita os testes existentes.' },
      { kind: 'attach', key: 'priorFiles', label: 'Liberações e resultados de referência' },
      { kind: 'radio', key: 'readiness', label: 'Situação para os testes', options: ['Liberado', 'Com pendências', 'Não liberado'] },
      { kind: 'yesno', key: 'blocking', label: 'Há pendências que impedem os testes?' },
      { kind: 'when', key: 'blocking', equals: 'Sim', fields: [
        { kind: 'textarea', key: 'blockingDetails', label: 'Pendência impeditiva' },
        { kind: 'grid', fields: [
          { kind: 'text', key: 'blockingOwner', label: 'Responsável' },
          { kind: 'date', key: 'blockingDue', label: 'Prazo' },
        ] },
      ] },
    ],
    [
      { kind: 'repeat', key: 'tests', title: 'Teste', addLabel: 'Adicionar teste', fields: [
        { kind: 'text', key: 'testName', label: 'Identificação do teste', help: 'Informe o nome ou código previsto no plano.' },
        ...(type === HOT ? [{ kind: 'select', key: 'testScope', label: 'Abrangência do teste',
          options: ['Sistema individual', 'Funcionamento integrado', 'Desempenho'] } satisfies Field] : []),
        { kind: 'grid', fields: [
          { kind: 'date', key: 'testDate', label: 'Data do teste' },
          { kind: 'text', key: 'testOwner', label: 'Responsável pelo teste' },
        ] },
        { kind: 'text', key: 'testProcedure', label: 'Procedimento e critério de aceitação', help: 'Use a referência do plano aplicável.' },
        { kind: 'grid', fields: [
          { kind: 'textarea', key: 'expected', label: 'Resultado esperado' },
          { kind: 'textarea', key: 'obtained', label: 'Resultado obtido' },
        ] },
        { kind: 'select', key: 'testResult', label: 'Resultado', options: ['Conforme', 'Com divergência', 'Não realizado'] },
        { kind: 'attach', key: 'testFiles', label: 'Relatório e evidências do teste' },
      ] },
    ],
    [
      { kind: 'yesno', key: 'hasCorrections', label: 'Há falhas ou pendências a corrigir?' },
      { kind: 'when', key: 'hasCorrections', equals: 'Sim', fields: [
        { kind: 'repeat', key: 'corrections', title: 'Correção', addLabel: 'Adicionar correção', fields: [
          { kind: 'text', key: 'issueRef', label: 'Código da ocorrência ou teste', help: 'Vincule pelo código o registro existente, preservando seu histórico.' },
          { kind: 'textarea', key: 'correction', label: 'Correção realizada' },
          { kind: 'grid', fields: [
            { kind: 'text', key: 'correctionOwner', label: 'Responsável' },
            { kind: 'date', key: 'correctionDue', label: 'Prazo' },
            { kind: 'date', key: 'retestDate', label: 'Data da nova verificação' },
            { kind: 'text', key: 'retestOwner', label: 'Responsável pela nova verificação' },
          ] },
          { kind: 'textarea', key: 'retestResult', label: 'Resultado da nova verificação' },
          { kind: 'select', key: 'correctionStatus', label: 'Situação', options: ['Resolvida', 'Pendente', 'Necessita nova ação'] },
          { kind: 'attach', key: 'correctionFiles', label: 'Evidências da correção e nova verificação' },
        ] },
      ] },
    ],
    [
      { kind: 'radio', key: 'finalStatus', label: 'Situação do comissionamento deste sistema', options: ['Concluído', 'Concluído com pendências', 'Não concluído'] },
      { kind: 'grid', cols: 3, fields: [
        { kind: 'date', key: 'actualStart', label: 'Início real' },
        { kind: 'date', key: 'actualEnd', label: 'Término real' },
        { kind: 'text', key: 'verifier', label: 'Responsável pela verificação' },
      ] },
      { kind: 'textarea', key: 'completionNotes', label: 'Pendências e observações finais' },
      { kind: 'attach', key: 'completionReport', label: 'Relatório de conclusão do sistema' },
      // Kromos's own review of the system, separate from CESBE entry (manual, folder 2.15).
      { kind: 'heading', text: 'Kromos — análise do sistema' },
      { kind: 'note', text: 'Aguardando análise · campo próprio da Kromos' },
    ],
  ]
}

const handoverFields: Field[][] = [
  [
    { kind: 'text', key: 'coldRefs', label: 'Registros de comissionamento a frio', help: 'Relacione os códigos dos sistemas e relatórios concluídos.' },
    { kind: 'text', key: 'hotRefs', label: 'Registros de comissionamento a quente', help: 'Relacione os códigos dos sistemas e relatórios concluídos.' },
    { kind: 'radio', key: 'overallResults', label: 'Situação consolidada dos resultados', options: ['Conformes', 'Com pendências', 'Incompletos'] },
    { kind: 'textarea', key: 'overallNotes', label: 'Resumo dos resultados' },
  ],
  [
    { kind: 'note', text: 'Referencie documentos já cadastrados. Anexe apenas documentos novos ou complementares.' },
    { kind: 'text', key: 'reports', label: 'Relatórios finais', help: 'Informe códigos ou referências dos documentos.' },
    { kind: 'text', key: 'asBuilt', label: 'Projetos conforme executado', help: 'Informe códigos ou referências dos documentos.' },
    { kind: 'text', key: 'manuals', label: 'Manuais e documentos dos sistemas', help: 'Informe códigos ou referências dos documentos.' },
    { kind: 'attach', key: 'handoverDocs', label: 'Documentação complementar de entrega' },
    { kind: 'select', key: 'docStatus', label: 'Situação da documentação', options: ['Completa', 'Com pendências', 'Em preparação'] },
  ],
  [
    { kind: 'grid', fields: [
      { kind: 'date', key: 'trainingDate', label: 'Data do treinamento' },
      { kind: 'text', key: 'trainingOwner', label: 'Responsável pelo treinamento' },
    ] },
    { kind: 'textarea', key: 'trainingSystems', label: 'Sistemas e assuntos abordados' },
    { kind: 'textarea', key: 'participants', label: 'Participantes' },
    { kind: 'attach', key: 'trainingFiles', label: 'Registro do treinamento e orientações' },
  ],
  [
    { kind: 'yesno', key: 'handoverPending', label: 'Há pendências para entrega?' },
    { kind: 'when', key: 'handoverPending', equals: 'Sim', fields: [
      { kind: 'textarea', key: 'handoverDetails', label: 'Pendências e registros de origem' },
      { kind: 'grid', fields: [
        { kind: 'text', key: 'handoverPendingOwner', label: 'Responsável pela pendência' },
        { kind: 'date', key: 'handoverDue', label: 'Prazo' },
      ] },
    ] },
  ],
  [
    { kind: 'radio', key: 'cesbeCompletion', label: 'Conclusão informada pela {epc}', options: ['Concluída', 'Concluída com pendências', 'Não concluída'] },
    { kind: 'grid', fields: [
      { kind: 'date', key: 'handoverDate', label: 'Data da entrega' },
      { kind: 'text', key: 'handoverOwner', label: 'Responsável pela entrega' },
    ] },
    { kind: 'attach', key: 'handoverTerm', label: 'Termo ou relatório de entrega' },
    // Kromos's acceptance, distinct from CESBE's completion and from the document handover (manual, 2.15).
    { kind: 'heading', text: 'Kromos — aceite da entrega' },
    { kind: 'note', text: 'Aguardando análise. Aceite técnico e entrega documental são situações distintas. Nenhum aceite é concedido nesta prévia.' },
    { kind: 'textarea', key: 'handoverNotes', label: 'Observações finais' },
  ],
]

const list = (v: unknown) => (Array.isArray(v) ? v as Record<string, unknown>[] : [])

export const commissioning: RecordsConfig = {
  draft: 'comissionamento',
  stages: SYSTEM_STAGES,
  stagesFor: type => (type === HANDOVER ? HANDOVER_STAGES : SYSTEM_STAGES),
  stageFields: type => (type === HANDOVER ? handoverFields : systemFields(type)),
  materialsStage: -1,
  materialFields: [],
  materialOk: '',
  completionAfter: [],
  issueKeys: [],
  extraPending: values => [
    ...(values.blocking === 'Sim' ? ['Pendência impeditiva para os testes.'] : []),
    ...(list(values.tests).some(x => x.testResult === 'Com divergência') ? ['Teste com divergência.'] : []),
    ...(list(values.tests).some(x => x.testResult === 'Não realizado') ? ['Teste não realizado.'] : []),
    ...(values.hasCorrections === 'Sim' && list(values.corrections).some(x => x.correctionStatus && x.correctionStatus !== 'Resolvida')
      ? ['Correção pendente ou que necessita nova ação.'] : []),
    ...(values.docStatus === 'Com pendências' || values.docStatus === 'Em preparação' ? ['Documentação de entrega incompleta.'] : []),
    ...(values.handoverPending === 'Sim' ? ['Pendências para entrega registradas.'] : []),
  ],
  types: { title: 'Frentes', names: FRONTS },
  typeLabels: type => ({ add: type === HANDOVER ? '' : 'Adicionar sistema' }),
  typeDesigns: [
    { label: 'Projeto dos sistemas a comissionar', pdf: '/reference/electrical/ca-inv.pdf' },
    { label: 'Projeto dos sistemas a comissionar', pdf: '/reference/electrical/ca-inv.pdf' },
    undefined,
  ],
  single: { types: [HANDOVER], title: 'Entrega geral da usina' },
  titlePrefixKey: 'systemType',
  uniqueWithinType: true,
  sendRequires: type => (type === HANDOVER ? [] : ['plan', 'systemType']),
  completionNote: 'Conclusão informada pela {epc} não substitui a análise e o aceite da Kromos.',
  labels: {
    list: 'Sistemas',
    add: 'Adicionar sistema',
    recordTitle: '',
    newRecord: 'Novo sistema — informar código do projeto',
    noCode: 'Sem código',
    codeMissing: 'Informe o código do sistema conforme o projeto.',
    codeDuplicate: 'Já existe um sistema com esse código nesta frente.',
    noPending: 'Nenhuma pendência registrada.',
    designNote: '',
  },
}

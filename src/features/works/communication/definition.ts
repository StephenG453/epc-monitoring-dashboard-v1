import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'

// 2.12 Comunicação, monitoramento e periféricos, as approved in Bruno's prototype (communication-forms.js) and
// the manual (chapter 3, folder 2.12): systems in the left column, each with its reference design and PDF
// (no revision field); one record per point or section with the code typed as in the CAD or PDF; four stages
// with quality management in each. Communications and CCTV are detailed; lighting and the weather station
// are not yet (manual: "Lighting and Weather station still require detailing").
// Power supply is 2.11; integration tests are 2.15.

const SYSTEMS = ['Comunicação e monitoramento', 'CFTV e segurança', 'Iluminação', 'Estação meteorológica']
const CCTV = 1
const STAGES = ['Antes de iniciar', 'Materiais', 'Execução e conferência', 'Conclusão']
const STATUS = ['Não iniciado', 'Em execução', 'Concluído', 'Com pendências']

const SEGMENT = 'Trecho de cabo ou fibra'
const commTypes = ['Internet', 'Switch', 'Datalogger', 'Comunicação com equipamento', SEGMENT, 'Outro']
const cctvTypes = ['Câmera', 'Gravador', 'Central de alarme', 'Sensor', 'Sirene', SEGMENT, 'Outro']

function headerFields(type: number): Field[] {
  return [
    { kind: 'grid', fields: [
      { kind: 'text', key: 'code', label: 'Código conforme o projeto', help: 'Digite o código indicado no CAD ou no PDF da etapa.' },
      { kind: 'select', key: 'type', label: 'Tipo', options: type === CCTV ? cctvTypes : commTypes },
    ] },
    // Links between two points (a cable or fiber section; a communication link to equipment).
    { kind: 'when', key: 'type', in: type === CCTV ? [SEGMENT] : ['Comunicação com equipamento', SEGMENT], fields: [
      { kind: 'grid', fields: [
        { kind: 'text', key: 'origin', label: 'Origem' },
        { kind: 'text', key: 'destination', label: 'Destino' },
      ] },
    ] },
  ]
}

function stageFields(type: number): Field[][] {
  return [
    [
      { kind: 'grid', fields: [
        { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
        { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
      ] },
      { kind: 'checks', key: 'pre', label: 'Condições para início', options: ['Local disponível', 'Infraestrutura disponível'] },
      { kind: 'issue', key: 'blocked', label: 'Há impedimentos?' },
    ],
    [],
    [
      { kind: 'checks', key: 'work', label: 'Assinale os serviços realizados',
        options: ['Montagem', 'Passagem dos cabos', 'Conexões', 'Identificação', 'Comunicação verificada'] },
      // CCTV: image, framing and recording for cameras and recorders; activation for alarm devices (manual).
      ...(type === CCTV ? [
        { kind: 'when', key: 'type', in: ['Câmera', 'Gravador'], fields: [
          { kind: 'checks', key: 'image', label: 'Imagem e gravação', options: ['Imagem verificada', 'Enquadramento conferido', 'Gravação verificada'] },
        ] },
        { kind: 'when', key: 'type', in: ['Central de alarme', 'Sensor', 'Sirene'], fields: [
          { kind: 'checks', key: 'alarm', label: 'Alarme', options: ['Acionamento verificado', 'Sinal recebido na central'] },
        ] },
      ] as Field[] : []),
      { kind: 'photos', key: 'executionNotes' },
    ],
    [
      { kind: 'grid', fields: [
        { kind: 'date', key: 'actualStart', label: 'Início real' },
        { kind: 'date', key: 'actualEnd', label: 'Término real' },
      ] },
      { kind: 'select', key: 'status', label: 'Situação', options: STATUS },
      { kind: 'textarea', key: 'pendingNotes', label: 'Pendências' },
    ],
  ]
}

export const communication: RecordsConfig = {
  draft: 'comunicacao',
  stages: STAGES,
  stageFields,
  headerFields,
  materialsStage: 1,
  // One block per component; equipment brings its documents, serial number and warranty (manual, 2.12).
  materialFields: [
    { kind: 'grid', fields: [
      { kind: 'select', key: 'material', label: 'Material ou equipamento', options: ['Equipamento', 'Cabo', 'Fibra', 'Conector', 'Suporte', 'Outro'] },
      { kind: 'text', key: 'spec', label: 'Modelo / especificação' },
      { kind: 'number', key: 'plannedQty', label: 'Quantidade prevista' },
      { kind: 'number', key: 'qty', label: 'Quantidade recebida' },
      { kind: 'select', key: 'unit', label: 'Unidade', options: ['un', 'm'] },
      { kind: 'select', key: 'condition', label: 'Condição de recebimento', options: ['Conforme', 'Com avaria', 'Divergente'] },
    ] },
    { kind: 'yesno', key: 'isEquipment', label: 'Este registro inclui equipamento?' },
    { kind: 'when', key: 'isEquipment', equals: 'Sim', fields: [
      { kind: 'heading', text: 'Documentos e identificação do equipamento' },
      { kind: 'text', key: 'serial', label: 'Número de série' },
      { kind: 'attach', key: 'plate', label: 'Foto da placa', images: true },
      { kind: 'attach', key: 'invoice', label: 'Nota fiscal' },
      { kind: 'attach', key: 'warranty', label: 'Certificado de garantia' },
      { kind: 'grid', fields: [
        { kind: 'date', key: 'warrantyFrom', label: 'Início da garantia' },
        { kind: 'date', key: 'warrantyUntil', label: 'Vencimento da garantia' },
      ] },
      { kind: 'attach', key: 'manual', label: 'Manual e ficha técnica' },
      { kind: 'attach', key: 'otherDocs', label: 'Demais documentos do equipamento' },
      { kind: 'note', text: 'Equipamento já cadastrado na 2.10? Use o mesmo código e consulte a documentação existente.' },
      { kind: 'text', key: 'equipmentCode', label: 'Código do equipamento' },
    ] },
  ],
  materialOk: 'Conforme',
  completionAfter: [{ kind: 'photos', key: 'finalNotes', label: 'Fotos finais e observações' }],
  issueKeys: ['blocked'],
  types: { title: 'Sistemas', names: SYSTEMS },
  typeDesigns: [
    { label: 'Projeto de comunicação', pdf: '/reference/communication-reference.pdf' },
    { label: 'Projeto de CFTV e segurança', pdf: '/reference/cctv-reference.pdf' },
  ],
  undetailed: { types: [2, 3], note: 'Os formulários de Iluminação e Estação meteorológica ainda serão detalhados e aprovados. As etapas previstas estão no manual.' },
  sendRequires: () => ['type'],
  completionNote: 'Aceite em campo próprio da Kromos. Alimentação elétrica: 2.11. Testes de integração: 2.15.',
  labels: {
    list: 'Pontos e trechos',
    add: 'Adicionar ponto ou trecho',
    recordTitle: '',
    newRecord: 'Novo ponto ou trecho',
    noCode: 'Sem código',
    codeMissing: 'Digite o código conforme o projeto.',
    codeDuplicate: 'Já existe uma ficha com esse código.',
    noPending: 'Nenhuma pendência registrada neste ponto ou trecho.',
    designNote: '',
  },
}

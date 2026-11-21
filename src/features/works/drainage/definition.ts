import type { Field } from '@/features/forms/schema'
import type { RecordsConfig } from '@/features/works/records/config'

// 2.5 Drenagem e infraestrutura civil, as approved in Bruno's prototype (drainage-forms.js) and the manual
// (chapter 3, folder 2.5): each section, identified by its code in the design, has five stages in one record,
// and each stage has its own quality management.

export const STAGES = ['Conferência antes do início', 'Materiais', 'Execução', 'Funcionamento e acabamento', 'Conclusão do trecho']

/** Stage 1. The four dates live here; "Término real" is shared with stage 5 (same key, so they stay in step). */
export const prestart: Field[] = [
  { kind: 'grid', fields: [
    { kind: 'text', key: 'code', label: 'Código do trecho no projeto', help: 'Informe exatamente o código usado no CAD e no PDF.' },
    { kind: 'text', key: 'name', label: 'Identificação do trecho', help: 'Nome conforme o projeto.' },
    { kind: 'date', key: 'plannedStart', label: 'Início previsto' },
    { kind: 'date', key: 'plannedEnd', label: 'Término previsto' },
    { kind: 'date', key: 'actualStart', label: 'Início real' },
    { kind: 'date', key: 'actualEnd', label: 'Término real' },
  ] },
  { kind: 'checks', key: 'preCheck', label: 'Conferências realizadas', options: ['Marcação', 'Trajeto', 'Níveis', 'Saída da água', 'Acessos', 'Interferências'] },
  { kind: 'issue', key: 'blocked', label: 'Há impedimentos para iniciar?' },
  { kind: 'photos', key: 'preNotes' },
]

/** Stage 2, one per material (Adicionar material repeats only this block). */
export const MATERIAL_OK = 'Conforme'
export const material: Field[] = [
  { kind: 'select', key: 'material', label: 'Material', options: ['Tubo', 'Canaleta', 'Caixa de drenagem', 'Brita', 'Concreto', 'Outro'] },
  { kind: 'text', key: 'specification', label: 'Especificação', help: 'Tipo e dimensões conforme o projeto.' },
  { kind: 'grid', fields: [
    { kind: 'number', key: 'plannedQty', label: 'Quantidade prevista' },
    { kind: 'number', key: 'receivedQty', label: 'Quantidade recebida' },
    { kind: 'select', key: 'unit', label: 'Unidade', options: ['m', 'un', 'm³', 'kg'] },
    { kind: 'date', key: 'receiptDate', label: 'Data do recebimento' },
  ] },
  { kind: 'radio', key: 'condition', label: 'Condição do material', options: [MATERIAL_OK, 'Com avaria', 'Divergente'] },
  { kind: 'text', key: 'storage', label: 'Local de armazenamento' },
  { kind: 'photos', key: 'materialNotes' },
]

export const execution: Field[] = [
  { kind: 'checks', key: 'service', label: 'Serviços realizados', options: ['Escavação', 'Preparação do fundo', 'Instalação de tubos', 'Canaletas', 'Caixas', 'Proteção da saída', 'Outro'] },
  { kind: 'grid', fields: [
    { kind: 'select', key: 'executionStatus', label: 'Situação da execução', options: ['Não iniciada', 'Em execução', 'Concluída'] },
    { kind: 'number', key: 'executedQty', label: 'Quantidade executada' },
    { kind: 'select', key: 'executionUnit', label: 'Unidade', options: ['m', 'un', 'm³'] },
  ] },
  { kind: 'checks', key: 'execCheck', label: 'Conferências realizadas', options: ['Trajeto', 'Largura', 'Profundidade', 'Níveis', 'Sentido do escoamento', 'Conexões'] },
  { kind: 'issue', key: 'executionIssue', label: 'Há impedimentos ou divergências?' },
  { kind: 'photos', key: 'execNotes', label: 'Fotos antes do fechamento e observações' },
]

export const finishing: Field[] = [
  { kind: 'checks', key: 'functionCheck', label: 'Verificações realizadas', options: ['Caminho livre', 'Conexões', 'Entrada e saída da água', 'Sentido do escoamento', 'Acabamento'] },
  { kind: 'yesno', key: 'flowChecked', label: 'Escoamento verificado?' },
  { kind: 'when', key: 'flowChecked', equals: 'Sim', fields: [
    { kind: 'radio', key: 'flowResult', label: 'Resultado', options: ['Satisfatório', 'Necessita ajuste'] },
  ] },
  { kind: 'checks', key: 'finishService', label: 'Serviços de acabamento realizados', options: ['Reaterro', 'Compactação', 'Recomposição do terreno', 'Limpeza', 'Outro'] },
  { kind: 'issue', key: 'finishIssue', label: 'Há pendências ou correções?' },
  { kind: 'photos', key: 'finishNotes' },
]

/** Stage 5. The outstanding-issues summary and the buttons are drawn by the page, between these blocks. */
export const completion: Field[] = [
  { kind: 'radio', key: 'completionStatus', label: 'Situação do trecho', options: ['Concluído', 'Concluído com pendências', 'Não concluído'] },
  { kind: 'date', key: 'actualEnd', label: 'Data real de término', help: 'Mesma data cadastrada no início.' },
  { kind: 'checks', key: 'finalCheck', label: 'Conferência final', options: ['Execução conforme projeto', 'Funcionamento verificado', 'Acabamento concluído', 'Limpeza concluída'] },
]
export const completionPhotos: Field[] = [{ kind: 'photos', key: 'finalNotes', label: 'Fotos finais e observações' }]

/** The issue questions whose "Sim" lists an outstanding issue at section completion. */
export const ISSUE_KEYS = ['blocked', 'executionIssue', 'finishIssue']

export const drainage: RecordsConfig = {
  draft: 'drenagem',
  stages: STAGES,
  stageFields: () => [prestart, [], execution, finishing, completion],
  materialsStage: 1,
  materialFields: material,
  materialOk: MATERIAL_OK,
  completionAfter: completionPhotos,
  issueKeys: ISSUE_KEYS,
  labels: {
    list: 'Trechos da drenagem',
    add: 'Adicionar trecho',
    recordTitle: 'TRECHO',
    newRecord: 'Novo trecho — informar código do projeto',
    noCode: 'Trecho sem código',
    codeMissing: 'Informe o código do trecho conforme o projeto.',
    codeDuplicate: 'Código já cadastrado. Use o registro do mesmo trecho.',
    noPending: 'Nenhuma pendência registrada neste trecho.',
    designNote: 'Mesmo código no CAD, no PDF e na plataforma.',
  },
}

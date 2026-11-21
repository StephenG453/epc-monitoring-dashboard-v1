import type { Field } from '@/features/forms/schema'

// Quality management, as approved in Bruno's prototype (drainage-forms.js) and the manual (3.7).
// Simplified management: occurrence, solution, "Foi resolvido?", category, indicators, save and send.
// Full management opens inside it, for the same stage and record, in six blocks.

export const simplified: Field[] = [
  { kind: 'grid', fields: [
    { kind: 'textarea', key: 'occurrence', label: 'Ocorrência' },
    { kind: 'textarea', key: 'solution', label: 'Solução aplicada' },
  ] },
  { kind: 'yesno', key: 'resolved', label: 'Foi resolvido?' },
  { kind: 'select', key: 'category', label: 'Categoria', options: ['Método', 'Equipe', 'Equipamento', 'Material', 'Medição', 'Ambiente', 'Outra'] },
]

/** Indicators: shown side by side. */
export const indicators: Field[] = [
  { kind: 'yesno', key: 'repeated', label: 'Já aconteceu antes?' },
  { kind: 'yesno', key: 'rework', label: 'Houve retrabalho?' },
  { kind: 'yesno', key: 'extraCost', label: 'Houve custo adicional?' },
]

export const afterIndicators: Field[] = [
  { kind: 'when', key: 'extraCost', equals: 'Sim', fields: [
    { kind: 'number', key: 'cost', label: 'Custo adicional (R$)' },
    { kind: 'note', text: 'Registrar custo não autoriza pagamento.' },
  ] },
  { kind: 'textarea', key: 'lesson', label: 'Aprendizado ou melhoria (opcional)' },
]

/** Full management: blocks 2 to 6 (block 1 shows the occurrence it belongs to). */
export const fullBlocks: { title: string; fields: Field[] }[] = [
  { title: 'Análise da causa — Ishikawa', fields: [
    { kind: 'grid', fields: ['Método', 'Equipe', 'Máquinas e equipamentos', 'Materiais', 'Medição', 'Ambiente'].map((label, i) => (
      { kind: 'textarea', key: `fish${i}`, label } as Field)) },
    { kind: 'textarea', key: 'fullCause', label: 'Causa identificada' },
  ] },
  { title: 'Plano de ação — 5W2H', fields: [
    { kind: 'textarea', key: 'fullWhat', label: 'O que será feito?' },
    { kind: 'textarea', key: 'fullWhy', label: 'Por quê?' },
    { kind: 'grid', fields: [
      { kind: 'text', key: 'fullWhere', label: 'Onde?' },
      { kind: 'text', key: 'fullWho', label: 'Quem fará?' },
      { kind: 'date', key: 'fullWhen', label: 'Até quando?' },
      { kind: 'number', key: 'fullBudget', label: 'Quanto custará (R$)?' },
    ] },
    { kind: 'textarea', key: 'fullHow', label: 'Como?' },
  ] },
  { title: 'Execução das ações', fields: [
    { kind: 'textarea', key: 'fullDone', label: 'O que foi realizado?' },
    { kind: 'grid', fields: [
      { kind: 'text', key: 'fullExecutor', label: 'Quem executou?' },
      { kind: 'date', key: 'fullDate', label: 'Data de conclusão' },
    ] },
  ] },
  { title: 'Verificação do resultado', fields: [
    { kind: 'yesno', key: 'fullResolved', label: 'O problema foi resolvido?' },
    { kind: 'text', key: 'fullVerifier', label: 'Quem verificou?' },
    { kind: 'textarea', key: 'fullVerification', label: 'Resultado da verificação' },
    { kind: 'note', text: 'Não resolveu? Revise a causa e a ação. Resolveu? Registre a melhoria e finalize.' },
  ] },
  { title: 'Melhoria contínua', fields: [
    { kind: 'textarea', key: 'fullLesson', label: 'Aprendizado e melhoria do método' },
    { kind: 'yesno', key: 'fullStandard', label: 'A solução deve virar padrão?' },
  ] },
]

/** Required to send, as in the prototype. */
export const REQUIRED_SIMPLE = ['occurrence', 'category', 'repeated', 'rework', 'extraCost', 'resolved']
export const REQUIRED_FULL = ['occurrence', 'category', 'repeated', 'rework', 'extraCost',
  'fullCause', 'fullWhat', 'fullWho', 'fullWhen', 'fullDone', 'fullExecutor', 'fullDate',
  'fullResolved', 'fullVerifier', 'fullVerification', 'fullLesson', 'fullStandard']

export const ALL_QUALITY_FIELDS: Field[] = [...simplified, ...indicators, ...afterIndicators, ...fullBlocks.flatMap(b => b.fields)]

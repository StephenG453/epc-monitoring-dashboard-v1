import type { Field } from '@/features/forms/schema'
import type { FormDef } from './definition'

// Folder 2.2 (site preparation and earthworks) and 2.3 (fencing), as approved in Bruno's prototype
// (terrain-forms.js, fencing-forms.js) and the manual (chapter 3, folders 2.2 and 2.3). Fencing has no card
// of its own in the folder grid: it opens from inside 2.2, below Execution.

/** Yes / No question that opens description, owner and deadline on "Sim". */
function issue(key: string, label: string, help: string | undefined, description: [string, string], due: string, extra: Field[] = []): Field[] {
  const yesno: Field = help ? { kind: 'yesno', key, label, help } : { kind: 'yesno', key, label }
  return [
    yesno,
    { kind: 'when', key, equals: 'Sim', fields: [
      { kind: 'textarea', key: `${key}Description`, label: description[0], help: description[1] },
      ...extra,
      { kind: 'grid', fields: [
        { kind: 'text', key: `${key}Owner`, label: 'Responsável', help: 'Informe quem resolverá.' },
        { kind: 'date', key: `${key}Due`, label: 'Prazo', help: due },
      ] },
    ] },
  ]
}

const dates = (help?: boolean): Field => ({ kind: 'grid', fields: [
  { kind: 'date', key: 'estimatedStart', label: 'Início estimado', ...(help && { help: 'Previsão de início.' }) },
  { kind: 'date', key: 'estimatedEnd', label: 'Término estimado', ...(help && { help: 'Previsão de término.' }) },
  { kind: 'date', key: 'actualStart', label: 'Início real', ...(help && { help: 'Data efetiva do início.' }) },
  { kind: 'date', key: 'actualEnd', label: 'Término real', ...(help && { help: 'Data efetiva do término.' }) },
] })

// ── 2.2 · Conferência antes do início ─────────────────────────────────────────────────────────────
// The four dates live here only (manual: not repeated in the folder header or in Execution).

export const earthworksPrestart: FormDef = {
  id: 'terreno-conferencia',
  title: 'Conferência antes do início',
  subtitle: 'Preparação do terreno e terraplenagem',
  sections: [
    { aside: false, title: 'Datas previstas e reais', help: 'Informe as previsões e atualize as datas reais conforme a obra acontecer.', fields: [dates(true)] },
    { aside: false, title: 'Documentos de referência', fields: [
      { kind: 'doc', key: 'topoDesign', label: 'Projeto topográfico', help: 'Selecione o projeto cadastrado que será utilizado.' },
      { kind: 'doc', key: 'resistivity', label: 'Ensaio de resistividade', help: 'Vincule o relatório cadastrado.' },
      { kind: 'doc', key: 'pileReport', label: 'Memorial da profundidade das estacas', help: 'Vincule o memorial cadastrado.' },
    ] },
    { aside: false, title: 'Áreas conferidas', help: 'Assinale conforme o projeto.', fields: [
      { kind: 'checks', key: 'areas', options: ['Limpeza', 'Corte', 'Aterro', 'Preservação', 'Acessos'] },
    ] },
    { aside: false, fields: issue('blocked', 'Há impedimentos para iniciar?', undefined, ['Descrição', 'Descreva o impedimento ou problema.'], 'Informe a data para resolver.') },
    { aside: false, title: 'Fotos e observações', fields: [
      { kind: 'attach', key: 'photos', label: 'Anexar fotos', help: 'Anexe fotos da condição inicial.' },
      { kind: 'textarea', key: 'notes', label: 'Observações', help: 'Registre os detalhes necessários.' },
    ] },
  ],
}

// ── 2.2 · Execução: numbered, independent records (Adicionar execução) ─────────────────────────────

export const earthworksExecution: FormDef = {
  id: 'terreno-execucao',
  title: 'Execução',
  subtitle: 'Preparação do terreno e terraplenagem',
  sections: [
    { aside: false, fields: [
      { kind: 'repeat', key: 'executions', title: 'Execução', addLabel: 'Adicionar execução', fields: [
        { kind: 'heading', text: '1. Serviços previstos ou realizados' },
        { kind: 'checks', key: 'services', help: 'Assinale um ou mais serviços que serão realizados ou já foram realizados.',
          options: ['Limpeza', 'Corte', 'Escavação', 'Aterro', 'Compactação', 'Nivelamento', 'Acabamento'] },
        { kind: 'heading', text: 'Arruamento' },
        { kind: 'checks', key: 'roads', help: 'Assinale a atividade prevista ou realizada nas vias internas da usina.',
          options: ['Marcação do arruamento', 'Execução do arruamento'] },
        { kind: 'heading', text: '2. Local da execução' },
        { kind: 'textarea', key: 'location', label: 'Local', help: 'Identifique no layout ou descreva o local da execução.' },
        { kind: 'heading', text: '3. Quantidade executada' },
        { kind: 'grid', fields: [
          { kind: 'number', key: 'qty', label: 'Quantidade executada', help: 'Informe a quantidade realizada.' },
          { kind: 'select', key: 'unit', label: 'Unidade', help: 'Selecione a unidade aplicável.', options: ['m²', 'm³', 'm', 'Outra'], placeholder: 'Selecione' },
        ] },
        { kind: 'when', key: 'unit', equals: 'Outra', fields: [
          { kind: 'text', key: 'otherUnit', label: 'Outra unidade', help: 'Informe a unidade utilizada.' },
        ] },
        { kind: 'heading', text: '4. Origem e destino dos materiais' },
        { kind: 'textarea', key: 'originDestination', label: 'Origem e destino', help: 'Quando houver movimentação de terra, informe de onde veio e para onde foi o material.' },
        { kind: 'heading', text: '5. Conferências realizadas' },
        { kind: 'textarea', key: 'checksDone', label: 'Conferências', help: 'Registre as verificações realizadas conforme o projeto.' },
        { kind: 'attach', key: 'surveys', label: 'Levantamentos e ensaios', help: 'Anexe as evidências aplicáveis à conferência.' },
        { kind: 'heading', text: '6. Desvios ou problemas' },
        ...issue('deviation', 'Houve desvios ou problemas?', undefined, ['Descrição', 'Descreva o impedimento ou problema.'], 'Informe a data para resolver.', [
          { kind: 'textarea', key: 'deviationCorrection', label: 'Correção necessária', help: 'Informe o que precisa ser corrigido.' },
        ]),
        { kind: 'heading', text: '7. Fotos e observações' },
        { kind: 'attach', key: 'photos', label: 'Anexar fotos', help: 'Mostre os serviços previstos ou realizados.' },
        { kind: 'textarea', key: 'notes', label: 'Observações', help: 'Registre os detalhes necessários.' },
      ] },
    ] },
  ],
}

// ── 2.3 · Cercamento: four collapsible stages, each with its own buttons ──────────────────────────

export const fencing: FormDef = {
  id: 'cercamento',
  title: '2.3 — Cercamento',
  subtitle: 'Preparação do terreno e terraplenagem',
  stages: true,
  back: { folderId: '2-2', label: 'Voltar às etapas' },
  sections: [
    { n: 1, title: 'Conferência antes do início', open: true, aside: false, fields: [
      { kind: 'heading', text: 'Datas do cercamento' },
      { kind: 'note', text: 'Informe as previsões e atualize as datas reais conforme o serviço acontecer.' },
      dates(),
      { kind: 'doc', key: 'design', label: 'Projeto de cercamento', help: 'Vincule o projeto que será utilizado na obra.', placeholder: 'Selecione o projeto cadastrado' },
      { kind: 'yesno', key: 'boundaries', label: 'Limites conferidos?', help: 'Confirme os limites do terreno conforme o projeto.' },
      { kind: 'textarea', key: 'discrepancies', label: 'Divergências, se houver', help: 'Descreva somente se houver divergência.' },
      { kind: 'grid', fields: [
        { kind: 'number', key: 'plannedLength', label: 'Extensão prevista (m)', help: 'Informe o total de cercamento em metros.' },
        { kind: 'number', key: 'gateCount', label: 'Quantidade de portões', help: 'Informe quantos portões estão previstos.' },
      ] },
      { kind: 'text', key: 'gatePositions', label: 'Posição dos portões', help: 'Indique as posições no projeto ou layout.' },
      ...issue('blocked', 'Há impedimentos para iniciar?', 'Se sim, informe descrição, responsável e prazo.', ['Descrição', 'Descreva o impedimento.'], 'Informe a data prevista para resolver.'),
      { kind: 'attach', key: 'initialPhotos', label: 'Anexar fotos', help: 'Anexe fotos da condição inicial.' },
      { kind: 'textarea', key: 'initialNotes', label: 'Fotos e observações', help: 'Registre os detalhes necessários.' },
    ] },
    { n: 2, title: 'Recebimento e armazenamento', aside: false, fields: [
      { kind: 'repeat', key: 'materials', title: 'Material', addLabel: 'Adicionar material', fields: [
        { kind: 'select', key: 'material', label: 'Material recebido', help: 'Postes, telas, arames, portões ou outro item do cercamento.',
          options: ['Postes', 'Telas', 'Arames', 'Portões', 'Outro'], placeholder: 'Selecione' },
        { kind: 'when', key: 'material', equals: 'Outro', fields: [{ kind: 'text', key: 'otherMaterial', label: 'Outro material' }] },
        { kind: 'grid', fields: [
          { kind: 'number', key: 'qty', label: 'Quantidade recebida', help: 'Informe a quantidade deste material.' },
          { kind: 'select', key: 'unit', label: 'Unidade', help: 'Selecione a unidade do material.', options: ['Unidade', 'm', 'Rolo', 'Outra'], placeholder: 'Selecione' },
        ] },
        { kind: 'when', key: 'unit', equals: 'Outra', fields: [{ kind: 'text', key: 'otherUnit', label: 'Outra unidade' }] },
        { kind: 'radio', key: 'condition', label: 'Condição do material', help: 'Confira o recebido antes de armazenar.', options: ['Conforme', 'Com avarias', 'Com divergência'] },
        ...issue('problem', 'Há faltas, avarias ou divergências?', 'Se sim, informe o problema, responsável e prazo.', ['Descrição', 'Descreva o problema identificado.'], 'Informe a data prevista para resolver.'),
        { kind: 'text', key: 'storage', label: 'Local de armazenamento', help: 'Informe onde os materiais ficarão guardados.' },
        { kind: 'attach', key: 'photos', label: 'Anexar fotos ou documentos', help: 'Mostre o recebimento e as condições de armazenamento.' },
        { kind: 'textarea', key: 'notes', label: 'Observações', help: 'Registre os detalhes necessários.' },
      ] },
    ] },
    { n: 3, title: 'Execução', aside: false, fields: [
      { kind: 'repeat', key: 'executions', title: 'Registro de execução', addLabel: 'Adicionar execução', fields: [
        { kind: 'text', key: 'section', label: 'Trecho do cercamento', help: 'Identifique o trecho no projeto ou descreva o local.' },
        { kind: 'heading', text: 'Serviços previstos ou realizados' },
        { kind: 'checks', key: 'services', help: 'Assinale um ou mais serviços que serão realizados ou já foram realizados.',
          options: ['Marcação do cercamento', 'Instalação dos postes', 'Instalação de telas ou arames', 'Instalação dos portões'] },
        { kind: 'grid', fields: [
          { kind: 'number', key: 'length', label: 'Extensão executada (m)', help: 'Informe quantos metros foram executados neste trecho.' },
          { kind: 'number', key: 'gates', label: 'Portões instalados', help: 'Informe a quantidade instalada neste registro, quando aplicável.' },
        ] },
        ...issue('deviation', 'Houve desvios ou problemas?', 'Se sim, descreva a correção necessária, responsável e prazo.',
          ['Descrição e correção necessária', 'Informe o problema e como será corrigido.'], 'Informe a data prevista para resolver.'),
        { kind: 'attach', key: 'photos', label: 'Anexar fotos', help: 'Mostre os serviços realizados.' },
        { kind: 'textarea', key: 'notes', label: 'Fotos e observações', help: 'Registre os detalhes necessários.' },
      ] },
    ] },
    { n: 4, title: 'Conferência e conclusão', aside: false, fields: [
      { kind: 'text', key: 'checkedSection', label: 'Trecho conferido', help: 'Identifique o trecho que está sendo conferido.' },
      { kind: 'heading', text: 'Itens verificados' },
      { kind: 'checks', key: 'checkedItems', help: 'Assinale os itens conferidos conforme o projeto.',
        options: ['Alinhamento do cercamento', 'Fixação dos postes', 'Fixação e integridade de telas ou arames', 'Funcionamento dos portões'] },
      ...issue('open', 'Há pendências ou correções?', 'Se sim, informe o que falta resolver, responsável e prazo.',
        ['Pendência ou correção', 'Descreva o que falta resolver.'], 'Informe a data prevista para resolver.'),
      { kind: 'select', key: 'status', label: 'Situação do trecho', help: 'Concluído ou com pendências.', options: ['Concluído', 'Com pendências'], placeholder: 'Selecione' },
      { kind: 'attach', key: 'finalPhotos', label: 'Anexar fotos', help: 'Mostre a condição final do trecho.' },
      { kind: 'textarea', key: 'finalNotes', label: 'Fotos finais e observações', help: 'Registre os detalhes necessários.' },
      { kind: 'note', text: 'Este registro da {epc} não substitui a vistoria e a decisão da Kromos.' },
    ] },
  ],
}

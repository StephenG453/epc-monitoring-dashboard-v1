import type { Field } from '@/features/forms/schema'

// 2.4 Locação e marcação em campo, as approved in Bruno's prototype (marking-forms.js) and the manual
// (chapter 3, folder 2.4): thirteen marking items, then item 14, Simplified quality management.
// CESBE enters; Kromos monitors in the same layout. Each item's answers live under its own key.

const MARKING = ['Não marcada', 'Em marcação', 'Marcada', 'Necessita ajuste']
const COMPLIANT = ['Conforme', 'Necessita ajuste']

/** Obstacles or discrepancies: description, owner and deadline show until "Não" (as in the prototype). */
const obstacles = (help = 'Se sim, informe descrição, responsável e prazo.', description = 'Descrição'): Field[] => [
  { kind: 'yesno', key: 'issue', label: 'Há impedimentos ou divergências?', help },
  { kind: 'when', key: 'issue', notEquals: 'Não', fields: [
    { kind: 'textarea', key: 'issueDescription', label: description },
    { kind: 'grid', fields: [
      { kind: 'text', key: 'issueOwner', label: 'Responsável' },
      { kind: 'date', key: 'issueDue', label: 'Prazo' },
    ] },
  ] },
]

const photos = (help = 'Mostre a marcação e registre os detalhes necessários.'): Field[] => [
  { kind: 'attach', key: 'photos', label: 'Anexar fotos', images: true },
  { kind: 'textarea', key: 'notes', label: 'Fotos e observações', help },
]

/** The shared block at the end of items 7 to 13 ("Registros gerais"), one per page or block. */
const general = (help: string, notesHelp: string, description = 'Descrição'): Field =>
  ({ kind: 'group', key: 'general', title: 'Registros gerais', fields: [...obstacles(help, description), ...photos(notesHelp)] })

const designs: Field = { kind: 'repeat', key: 'designs', addLabel: 'Adicionar projeto', fields: [{ kind: 'design', key: 'design' }] }

const manufacturerManual: Field[] = [
  { kind: 'heading', text: 'Manual do fabricante' },
  { kind: 'doc', key: 'manual', label: 'Manual cadastrado', placeholder: 'Selecione o manual cadastrado' },
  { kind: 'attach', key: 'manualFile', label: 'Anexar manual' },
]

const identification = (label: string, help = 'Informe a identificação prevista no projeto.'): Field => ({ kind: 'text', key: 'id', label, help })

/** Base dimensions and level (transformers, substation, BESS). */
const base = (area: boolean, heightCm: boolean): Field[] => [
  { kind: 'heading', text: area ? 'Dimensões da área ou base' : 'Dimensões da base' },
  { kind: 'note', text: 'Informe as dimensões marcadas conforme o projeto.' },
  { kind: 'grid', fields: [
    { kind: 'number', key: 'length', label: 'Comprimento (m)' },
    { kind: 'number', key: 'width', label: 'Largura (m)' },
  ] },
  heightCm
    ? { kind: 'number', key: 'baseHeight', label: 'Altura prevista da base em relação ao terreno acabado (cm)',
      help: 'Informe quantos centímetros o topo da base ficará acima do terreno acabado, conforme o projeto. Exemplo: 30 cm.' }
    : { kind: 'text', key: 'baseLevel', label: 'Cota da base', help: 'Informe a cota prevista na marcação, conforme a referência do projeto.' },
]

/** Items 1 to 6: repeatable marking records ("Marcação 01"), each with its own designs. */
const records = (addLabel: string, fields: Field[]): Field[] => [
  { kind: 'repeat', key: 'records', title: 'Marcação', addLabel, fields: [designs, ...fields] },
]

const route = (label = 'Marcação do trajeto'): Field => ({ kind: 'radio', key: 'marking', label, options: MARKING })
const length = (help: string): Field => ({ kind: 'number', key: 'markedLength', label: 'Extensão marcada (m)', help })
const partial = (help: string): Field[] => [
  { kind: 'radio', key: 'completeness', label: 'Marcação completa ou parcial?', options: ['Completa', 'Parcial'] },
  { kind: 'when', key: 'completeness', notEquals: 'Completa', fields: [{ kind: 'text', key: 'missing', label: 'O que falta marcar?', help }] },
]

const trenchBlock = (key: string, title: string): Field => ({ kind: 'group', key, title, fields: [
  { kind: 'design', key: 'design', help: 'Projeto válido para todos os lançamentos deste bloco.' },
  { kind: 'repeat', key: 'runs', title: 'Lançamento', addLabel: 'Adicionar lançamento', initial: 2, fields: [
    { kind: 'text', key: 'id', label: 'Identificação do trecho', help: 'Informe o nome ou código do trecho conforme o projeto.' },
    { kind: 'note', text: 'Informe onde o trecho começa e termina.' },
    { kind: 'grid', fields: [{ kind: 'text', key: 'origin', label: 'Origem' }, { kind: 'text', key: 'destination', label: 'Destino' }] },
    route(),
    length('Informe quantos metros foram marcados neste trecho.'),
  ] },
  general('Se sim, identifique os trechos envolvidos e informe descrição, responsável e prazo.', 'Indique a quais trechos os registros se referem.'),
] })

const pointBlock = (key: string, title: string): Field => ({ kind: 'group', key, title, fields: [
  { kind: 'design', key: 'design' },
  { kind: 'repeat', key: 'points', title: 'Ponto', addLabel: 'Inserir ponto', fields: [
    { kind: 'grid', fields: [
      { kind: 'text', key: 'id', label: 'Identificação do ponto', help: 'Informe o código conforme o projeto.' },
      { kind: 'radio', key: 'marking', label: 'Marcação da posição da base ou suporte', options: MARKING },
    ] },
  ] },
  general('Se sim, identifique os pontos envolvidos e informe descrição, responsável e prazo.', 'Mostre as marcações e identifique os pontos registrados.', 'Descrição e pontos envolvidos'),
] })

export type MarkingItem = { name: string; fields: Field[] }

export const ITEMS: MarkingItem[] = [
  { name: 'Estruturas dos módulos', fields: records('Adicionar marcação', [
    identification('Identificação da mesa ou tracker'),
    ...manufacturerManual,
    { kind: 'radio', key: 'status', label: 'Situação da marcação', options: ['Não iniciada', 'Em andamento', 'Marcada', 'Necessita ajuste'] },
    { kind: 'number', key: 'piles', label: 'Quantidade de estacas marcadas' },
    { kind: 'radio', key: 'alignment', label: 'Conferência de alinhamento', options: ['Sim', 'Não'] },
    { kind: 'radio', key: 'orientation', label: 'Conferência de orientação', options: ['Sim', 'Não'] },
    { kind: 'number', key: 'rowSpacing', label: 'Espaço entre linhas (m)' },
    { kind: 'attach', key: 'survey', label: 'Anexar levantamento' },
    ...obstacles(), ...photos(),
  ]) },
  { name: 'Inversores', fields: records('Adicionar marcação de inversor', [
    identification('Identificação do inversor'),
    ...manufacturerManual,
    { kind: 'radio', key: 'status', label: 'Posição da base ou suporte', options: MARKING },
    { kind: 'radio', key: 'orientation', label: 'Conferência de orientação', options: COMPLIANT },
    { kind: 'radio', key: 'clearance', label: 'Conferência dos afastamentos', options: COMPLIANT },
    { kind: 'note', text: 'Considere o projeto e o manual do fabricante.' },
    ...obstacles(), ...photos(),
  ]) },
  // From switchboards on, no orientation or manufacturer manual (manual 3.4, folder 2.4).
  { name: 'Quadros elétricos', fields: records('Adicionar marcação de quadro', [
    identification('Identificação do quadro'),
    { kind: 'radio', key: 'status', label: 'Marcação da posição do quadro', options: MARKING },
    { kind: 'radio', key: 'clearance', label: 'Espaço de acesso e manutenção', options: COMPLIANT },
    { kind: 'note', text: 'Confira o espaço previsto no projeto.' },
    ...obstacles(), ...photos(),
  ]) },
  { name: 'Transformadores', fields: records('Adicionar marcação de transformador', [
    identification('Identificação do transformador'),
    { kind: 'radio', key: 'status', label: 'Marcação do local e da base', options: MARKING },
    ...base(false, false),
    { kind: 'radio', key: 'clearance', label: 'Afastamentos e espaço de acesso', options: COMPLIANT },
    { kind: 'note', text: 'Confira o espaço previsto no projeto.' },
    ...obstacles(), ...photos(),
  ]) },
  { name: 'Cabine ou subestação', fields: records('Adicionar marcação de cabine ou subestação', [
    identification('Identificação da cabine ou subestação'),
    { kind: 'radio', key: 'status', label: 'Marcação dos vértices e limites', options: MARKING },
    ...base(true, true),
    { kind: 'radio', key: 'clearance', label: 'Acessos e afastamentos', options: COMPLIANT },
    { kind: 'note', text: 'Confira o espaço previsto no projeto.' },
    ...obstacles(), ...photos(),
  ]) },
  { name: 'BESS, quando houver', fields: [
    { kind: 'yesno', key: 'hasBess', label: 'A usina terá BESS?', help: 'Se não, os demais campos ficam dispensados.' },
    { kind: 'when', key: 'hasBess', notEquals: 'Não', fields: records('Adicionar marcação de conjunto BESS', [
      identification('Identificação do conjunto', 'Identifique o gabinete, contêiner ou conjunto conforme o projeto.'),
      { kind: 'radio', key: 'status', label: 'Marcação do local e das bases', options: MARKING },
      ...base(true, true),
      { kind: 'radio', key: 'clearance', label: 'Afastamentos e acessos', options: COMPLIANT },
      { kind: 'note', text: 'Confira o espaço previsto no projeto.' },
      ...obstacles(), ...photos(),
    ]) },
  ] },
  { name: 'Valas de cabos', fields: [
    trenchBlock('dc', 'Marcação das valas CC'),
    trenchBlock('ac', 'Marcação das valas CA'),
    trenchBlock('comms', 'Marcação das valas de comunicação'),
  ] },
  { name: 'Caixas de passagem', fields: [
    { kind: 'design', key: 'design', help: 'Selecione o projeto cadastrado com a identificação de todas as caixas.' },
    { kind: 'repeat', key: 'boxes', title: 'Caixa', addLabel: 'Adicionar caixa', fields: [
      { kind: 'text', key: 'id', label: 'Identificação da caixa', help: 'Informe o código da caixa conforme o projeto. Exemplo: CP-01.' },
      { kind: 'radio', key: 'marking', label: 'Marcação da posição', options: MARKING },
      { kind: 'heading', text: 'Dimensões previstas (m)' },
      { kind: 'note', text: 'Informe as dimensões conforme o projeto.' },
      { kind: 'grid', cols: 3, fields: [
        { kind: 'number', key: 'length', label: 'Comprimento' },
        { kind: 'number', key: 'width', label: 'Largura' },
        { kind: 'number', key: 'depth', label: 'Profundidade' },
      ] },
      { kind: 'radio', key: 'cover', label: 'Nível previsto da tampa', options: ['No nível do terreno acabado', 'Acima', 'Abaixo'] },
      { kind: 'when', key: 'cover', notEquals: 'No nível do terreno acabado', fields: [
        { kind: 'number', key: 'coverDiff', label: 'Diferença em centímetros', help: 'Preencha se a tampa ficar acima ou abaixo do terreno acabado.' },
      ] },
    ] },
    general('Se sim, descreva e identifique as caixas envolvidas.', 'Anexe fotos e indique a qual caixa se referem.', 'Descrição e caixas envolvidas'),
  ] },
  { name: 'Aterramento', fields: [
    { kind: 'design', key: 'design', help: 'Selecione o projeto de aterramento cadastrado.' },
    { kind: 'repeat', key: 'sections', title: 'Trecho', addLabel: 'Adicionar trecho', initial: 2, fields: [
      { kind: 'text', key: 'id', label: 'Identificação do trecho', help: 'Informe o código ou a identificação conforme o projeto.' },
      ...partial('Preencha quando a marcação for parcial.'),
      { kind: 'radio', key: 'marking', label: 'Situação da marcação', options: MARKING },
      length('Informe quantos metros foram marcados no trecho.'),
    ] },
    general('Se sim, identifique os trechos envolvidos e informe descrição, responsável e prazo.', 'Indique a quais trechos os registros se referem.'),
    { kind: 'note', text: 'Registre qualquer diferença da marcação em relação ao projeto.' },
  ] },
  { name: 'Drenagem', fields: [
    { kind: 'note', text: 'Registre a marcação conforme o projeto.' },
    { kind: 'design', key: 'design', help: 'Selecione o projeto de drenagem cadastrado.' },
    { kind: 'repeat', key: 'records', title: 'Trecho ou dispositivo', addLabel: 'Adicionar trecho ou dispositivo', fields: [
      { kind: 'text', key: 'id', label: 'Identificação', help: 'Código conforme o projeto.' },
      { kind: 'radio', key: 'type', label: 'Tipo', options: ['Vala', 'Canaleta', 'Tubulação', 'Caixa de drenagem', 'Saída de água', 'Outro'] },
      ...partial('Preencha se a marcação for parcial.'),
      { kind: 'radio', key: 'marking', label: 'Situação da marcação', options: MARKING },
      length('Preencha quando for um trecho.'),
      { kind: 'radio', key: 'levels', label: 'Níveis e sentido do escoamento', options: ['Conforme o projeto', 'Necessita ajuste', 'Não se aplica'] },
      { kind: 'note', text: 'Confira as alturas e o sentido de saída da água previstos no projeto.' },
    ] },
    general('Se sim, identifique os trechos ou dispositivos envolvidos e informe descrição, responsável e prazo.',
      'Indique a quais trechos ou dispositivos os registros se referem.', 'Descrição e registros envolvidos'),
  ] },
  { name: 'Arruamento e acessos internos', fields: [
    { kind: 'note', text: 'Registre a marcação conforme o projeto.' },
    { kind: 'design', key: 'design', help: 'Selecione o projeto cadastrado utilizado na marcação.' },
    { kind: 'repeat', key: 'roads', title: 'Via ou trecho', addLabel: 'Adicionar via ou trecho', fields: [
      { kind: 'text', key: 'id', label: 'Identificação', help: 'Informe o código ou nome da via conforme o projeto.' },
      ...partial('Preencha se a marcação for parcial.'),
      { kind: 'radio', key: 'marking', label: 'Situação da marcação', options: MARKING },
      { kind: 'grid', fields: [
        length('Informe quantos metros foram marcados.'),
        { kind: 'number', key: 'width', label: 'Largura prevista (m)', help: 'Informe a largura indicada no projeto.' },
      ] },
      { kind: 'radio', key: 'layout', label: 'Traçado, limites e níveis', options: ['Conforme o projeto', 'Necessita ajuste'] },
      { kind: 'note', text: 'Confira o caminho, as bordas e as alturas previstas para a via.' },
    ] },
    general('Se sim, identifique as vias ou os trechos envolvidos e informe descrição, responsável e prazo.',
      'Indique a quais vias ou trechos os registros se referem.', 'Descrição e vias ou trechos envolvidos'),
  ] },
  { name: 'Periféricos', fields: [
    pointBlock('lighting', 'Iluminação'),
    pointBlock('cctv', 'CFTV'),
    pointBlock('weather', 'Estação meteorológica'),
  ] },
  { name: 'Rede de conexão', fields: [
    { kind: 'note', text: 'Registre apenas os itens que fazem parte do escopo da obra.' },
    { kind: 'design', key: 'design' },
    { kind: 'heading', text: 'Trechos' },
    { kind: 'repeat', key: 'sections', title: 'Trecho', addLabel: 'Inserir trecho', fields: [
      { kind: 'text', key: 'id', label: 'Identificação do trecho', help: 'Informe o código ou nome conforme o projeto.' },
      { kind: 'grid', fields: [{ kind: 'text', key: 'origin', label: 'Origem' }, { kind: 'text', key: 'destination', label: 'Destino' }] },
      { kind: 'note', text: 'Informe onde o trecho começa e termina.' },
      route(),
      length('Informe quantos metros foram marcados.'),
    ] },
    { kind: 'heading', text: 'Pontos' },
    { kind: 'repeat', key: 'points', title: 'Ponto', addLabel: 'Inserir ponto', fields: [
      { kind: 'text', key: 'id', label: 'Identificação do ponto', help: 'Informe o código conforme o projeto.' },
      { kind: 'radio', key: 'type', label: 'Tipo de ponto', options: ['Poste', 'Ponto de conexão', 'Outro'] },
      { kind: 'radio', key: 'marking', label: 'Marcação da posição', options: MARKING },
    ] },
    general('Se sim, identifique os trechos ou pontos envolvidos e informe descrição, responsável e prazo.',
      'Mostre as marcações e identifique os registros.', 'Descrição e trechos ou pontos envolvidos'),
  ] },
]

/** Item 14: occurrences from setting out, each linked to one of the thirteen items. */
export const QUALITY_ITEM = 'Gestão simplificada'
export const occurrenceItem: Field[] = [
  { kind: 'select', key: 'item', label: 'Item', options: ITEMS.map(i => i.name), help: 'Selecione o item da marcação em que a ocorrência aconteceu.' },
]

import type { Field } from '@/features/forms/schema'
import { earthworksExecution, earthworksPrestart, fencing } from './earthworks'

// Folder 2.1's three approved forms (Bruno's approved-forms.js and the manual, chapter 3, folder 2.1),
// as definitions for the form engine. {epc} is filled with the plant's EPC contractor.

/**
 * A card. `n` numbers it; with `aside` (default), the right column holds attachments and optional notes.
 * In a `stages` form each section is a collapsible stage ("1. Conferência antes do início") with its own buttons.
 */
export type FormSection = { n?: number; title?: string; help?: string; aside?: boolean; open?: boolean; fields: Field[] }

export type FormDef = {
  id: string
  title: string
  /** Line under the title, e.g. the parent folder's name. */
  subtitle?: string
  /** Collapsible stages, each with Save draft / Send to Kromos (as in fencing), instead of one pair at the end. */
  stages?: boolean
  /** Where "back" goes, when not the form's own folder: fencing returns to 2.2. */
  back?: { folderId: string; label: string }
  sections: FormSection[]
}

const FACILITIES = ['Escritório', 'Sanitários', 'Vestiário', 'Refeitório', 'Depósito', 'Alojamento', 'Outras']
export const OUTSOURCED = 'Terceirizada'

export const planning: FormDef = {
  id: 'planejamento',
  title: 'Planejamento geral da usina',
  sections: [
    { n: 1, title: 'Datas da obra', help: 'Informe as datas previstas e reais de toda a obra da usina.', fields: [
      { kind: 'grid', fields: [
        { kind: 'date', key: 'startPlanned', label: 'Início previsto', help: 'Data planejada para iniciar a obra da usina.' },
        { kind: 'date', key: 'endPlanned', label: 'Término previsto', help: 'Data planejada para concluir a obra da usina.' },
        { kind: 'date', key: 'startActual', label: 'Início real', help: 'Preencha quando a obra começar.' },
        { kind: 'date', key: 'endActual', label: 'Término real', help: 'Preencha quando a obra for concluída.' },
      ] },
    ] },
    { n: 2, title: 'Equipes e pessoal', help: 'Cadastre as equipes da obra. A organização e distribuição ficam com a {epc}.', fields: [
      { kind: 'repeat', key: 'teams', addLabel: 'Adicionar equipe', fields: [
        { kind: 'select', key: 'type', label: 'Tipo de equipe', help: 'Informe se a equipe pertence à {epc} ou a uma empresa contratada.',
          options: ['Interna da {epc}', OUTSOURCED], placeholder: 'Selecione' },
        { kind: 'when', key: 'type', equals: OUTSOURCED, fields: [
          { kind: 'text', key: 'company', label: 'Nome da empresa contratada', help: 'Preencha quando a equipe for terceirizada.' },
        ] },
        { kind: 'grid', fields: [
          { kind: 'text', key: 'name', label: 'Identificação da equipe', help: 'Informe o nome da equipe.' },
          { kind: 'text', key: 'service', label: 'Serviço', help: 'Informe a atividade prevista.' },
          { kind: 'number', key: 'people', label: 'Quantidade de pessoas', help: 'Informe o número de pessoas da equipe.' },
        ] },
      ] },
    ] },
    { n: 3, title: 'Máquinas mobilizadas', help: 'Informe máquinas de grande porte transportadas para a obra. Não inclua ferramentas de mão.', fields: [
      { kind: 'repeat', key: 'machines', addLabel: 'Adicionar máquina', fields: [
        { kind: 'grid', fields: [
          { kind: 'text', key: 'type', label: 'Tipo de máquina', help: 'Informe o tipo da máquina mobilizada.' },
          { kind: 'number', key: 'qty', label: 'Quantidade', help: 'Informe a quantidade de máquinas deste tipo.' },
        ] },
      ] },
    ] },
    { n: 4, title: 'Instalações provisórias', help: 'Marque as instalações previstas e informe a capacidade em pessoas, quando aplicável.', fields: [
      { kind: 'table', rowHeader: 'Instalação', rows: FACILITIES, columns: [
        { key: 'fac', label: 'Será disponibilizada?', kind: 'select', options: ['Sim', 'Não', 'Não se aplica'] },
        { key: 'cap', label: 'Capacidade (pessoas)', kind: 'number' },
      ] },
      { kind: 'text', key: 'otherFacilities', label: 'Outras instalações', help: 'Se necessário, descreva as outras instalações previstas.' },
    ] },
    { n: 5, title: 'Início dos prazos - D0', help: 'Confirme o marco que inicia a contagem dos prazos.', fields: [
      { kind: 'grid', fields: [
        { kind: 'date', key: 'd0', label: 'Data do D0', help: 'Data que inicia a contagem dos prazos do cronograma.' },
        { kind: 'select', key: 'schedule', label: 'Cronograma físico-financeiro', help: 'Selecione o cronograma de referência cadastrado.',
          placeholder: 'Selecionar cronograma cadastrado', options: ['Cronograma de exemplo · demonstrativo'] },
      ] },
      { kind: 'attach', key: 'd0Doc', label: 'Documento de confirmação do D0',
        help: 'Anexe o documento que confirma esse marco. Na versão funcional também será possível vincular um documento já cadastrado.' },
    ] },
  ],
}

export const support: FormDef = {
  id: 'areas-de-apoio',
  title: 'Áreas de apoio',
  sections: [
    { n: 1, aside: false, title: 'Layout das áreas de apoio',
      help: 'Anexe planta ou imagem indicando canteiro, acessos, circulação, descarga, armazenamento, instalações provisórias e estacionamento.', fields: [
        { kind: 'attach', key: 'layout', label: 'Anexar planta ou imagem',
          help: 'Selecione fotos ou documentos que complementem este registro. Os arquivos não serão enviados nesta demonstração.' },
      ] },
    { n: 2, aside: false, title: 'Portaria', fields: [
      { kind: 'yesno', key: 'gate', label: 'Haverá portaria?', help: 'Informe se haverá portaria no acesso à obra.' },
    ] },
    { n: 3, aside: false, title: 'Controle de acesso', fields: [
      { kind: 'yesno', key: 'accessControlled', label: 'O acesso será controlado?', help: 'Informe se haverá controle de entrada e saída de pessoas e veículos.' },
      { kind: 'when', key: 'accessControlled', equals: 'Sim', fields: [
        { kind: 'textarea', key: 'accessHow', label: 'Como será feito o controle?', help: 'Descreva como será controlada a entrada e saída de pessoas e veículos.' },
      ] },
    ] },
    { n: 4, aside: false, title: 'Observações e registros do canteiro', fields: [
      { kind: 'textarea', key: 'notes', label: 'Observações',
        help: 'Informe restrições de acesso, detalhes que não estejam no layout ou pendências de montagem. Para pendências, informe responsável e prazo.' },
      { kind: 'attach', key: 'extra', label: 'Anexar complemento (opcional)' },
      { kind: 'note', text: 'Inclua também fotos das instalações efetivamente montadas. Este registro concentra o acompanhamento da montagem do canteiro.' },
    ] },
  ],
}

/** The crews entered in planning; Accommodation offers them as "Equipes atendidas". */
export const CREWS_SOURCE = 'crews'

export const lodging: FormDef = {
  id: 'acomodacao',
  title: 'Acomodação do pessoal',
  sections: [
    { aside: false, title: 'Hospedagem', fields: [
      { kind: 'yesno', key: 'needed', label: 'Será necessária hospedagem?', help: 'Se não, os demais campos ficam dispensados.' },
      // "Não" exempts the rest (manual 3.4); until then every accommodation record shows.
      { kind: 'when', key: 'needed', notEquals: 'Não', fields: [
        { kind: 'repeat', key: 'lodgings', title: 'Acomodação', addLabel: 'Adicionar acomodação', addBesideFirst: true, fields: [
          { kind: 'select', key: 'type', label: 'Tipo de acomodação', help: 'Selecione alojamento na obra, casa alugada, hotel/pousada ou outro.',
            options: ['Alojamento na obra', 'Casa alugada', 'Hotel/pousada', 'Outro'], placeholder: 'Selecione' },
          { kind: 'when', key: 'type', equals: 'Outro', fields: [
            { kind: 'text', key: 'otherType', label: 'Outro tipo de acomodação', help: 'Descreva o tipo de acomodação.' },
          ] },
          { kind: 'text', key: 'place', label: 'Local da acomodação', help: 'Informe o nome do estabelecimento ou endereço.' },
          { kind: 'checks', key: 'teams', label: 'Equipes atendidas', help: 'Selecione as equipes cadastradas no planejamento que utilizarão esse local.',
            source: CREWS_SOURCE, empty: 'Nenhuma equipe preenchida no planejamento' },
          { kind: 'grid', fields: [
            { kind: 'number', key: 'capacity', label: 'Capacidade disponível', help: 'Informe quantas pessoas o local pode acomodar.' },
            { kind: 'number', key: 'occupied', label: 'Pessoas acomodadas', help: 'Informe quantas pessoas da obra estão hospedadas neste local.' },
          ] },
          { kind: 'select', key: 'status', label: 'Situação', help: 'Em preparação, disponível, em uso ou desativada.',
            options: ['Em preparação', 'Disponível', 'Em uso', 'Desativada'], placeholder: 'Selecione' },
          { kind: 'yesno', key: 'pending', label: 'Há pendências?', help: 'Se sim, informe descrição, responsável e prazo.' },
          // Shown by default; "Não" exempts description, owner and deadline (manual 3.4).
          { kind: 'when', key: 'pending', notEquals: 'Não', fields: [
            { kind: 'textarea', key: 'pendingWhat', label: 'Descrição', help: 'Descreva o que precisa ser resolvido.' },
            { kind: 'grid', fields: [
              { kind: 'text', key: 'pendingWho', label: 'Responsável', help: 'Informe quem resolverá a pendência.' },
              { kind: 'date', key: 'pendingWhen', label: 'Prazo', help: 'Informe a data prevista para resolver.' },
            ] },
          ] },
          { kind: 'attach', key: 'photos', label: 'Anexar fotos', images: true },
          { kind: 'textarea', key: 'notes', label: 'Observações', help: 'Mostre as instalações e registre os detalhes necessários.' },
        ] },
      ] },
    ] },
  ],
}

export const FORMS: Record<string, FormDef> = Object.fromEntries(
  [planning, support, lodging, earthworksPrestart, earthworksExecution, fencing].map(f => [f.id, f]),
)

import type { WorkFolder } from '@/types/domain'

// The 16 construction folders, their stages and notes, taken from the stage tables in chapter 3 of the Kromos
// manual (Manual_Kromos_Completo_Capitulos_1_a_3, consolidated 2026-11-21). The prototype's built-in folder list
// is older than its own form modules; the manual matches the modules, so it is the source here.
// `per` says what each set of stages repeats for (a section, a lot, a record...).

export const workFolders: WorkFolder[] = [
  {
    id: '2-1',
    name: '2.1 Mobilização, canteiro e acomodação do pessoal',
    formsReady: true,
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Planejamento', epc: 'Planejamento geral da usina: datas previstas e reais da obra; equipes internas ou terceirizadas e pessoal; máquinas de grande porte; instalações provisórias; cronograma físico-financeiro e D0.', kromos: 'Disponibilidade, prazos, alterações e apontamentos próprios.', formId: 'planejamento' },
        { title: 'Áreas de apoio', epc: 'Layout com canteiro, acessos, circulação, descarga, armazenamento, instalações provisórias e estacionamento; portaria e controle de acesso; fotos, observações e pendências da montagem.', kromos: 'Organização, interferências e disponibilidade das instalações necessárias.', formId: 'areas-de-apoio' },
        { title: 'Acomodação', epc: 'Necessidade de hospedagem; tipo, local, equipes atendidas, capacidade, ocupação, situação, pendências, fotos e observações. Permitir mais de uma acomodação.', kromos: 'Capacidade, ocupação, condições e apontamentos próprios.', formId: 'acomodacao' },
      ] },
    ],
    notes: [],
  },
  {
    id: '2-2',
    name: '2.2 Preparação do terreno e terraplenagem',
    formsReady: true,
    per: '+ cercamento (2.3)',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Conferência antes do início', epc: 'Datas estimadas e reais; projeto topográfico, ensaio de resistividade e memorial da profundidade das estacas vinculados; áreas conferidas, impedimentos, fotos e observações.', kromos: 'Documentos, limites, restrições e condições para começar.', formId: 'terreno-conferencia' },
        { title: 'Execução', epc: 'Serviços previstos ou realizados e arruamento para assinalar; local, quantidade e unidade, materiais, conferências, desvios, fotos e observações. Registros separados por execução.', kromos: 'Avanço, conformidade, desvios e correções.', formId: 'terreno-execucao' },
      ] },
    ],
    notes: ['Na página 2.2 Preparação do terreno e terraplenagem, o item 2.3 Cercamento aparece abaixo de Execução. Ao abrir, são apresentadas quatro abas recolhíveis, com a conferência inicial aberta. A CESBE preenche; a Kromos acompanha no mesmo layout. O controle da entrada de pessoas e veículos permanece em Áreas de apoio, na pasta 2.1.', 'Limpeza, corte, aterro e compactação continuam identificados separadamente para os indicadores. Resistividade e memorial das estacas são vinculados aos documentos existentes e às pastas de aterramento e fundações.'],
  },
  {
    id: '2-3',
    name: '2.3 Cercamento',
    formsReady: true,
    page: 'form',
    formPage: 'cercamento',
    inside: '2-2',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Conferência antes do início', epc: 'Datas estimadas e reais; projeto, limites, extensão e portões previstos; impedimentos, fotos e observações.', kromos: 'Projeto, condições de início, previsões e impedimentos.' },
        { title: 'Recebimento e armazenamento', epc: 'Materiais, quantidades, unidades, condições, faltas, avarias ou divergências; armazenamento, fotos e observações.', kromos: 'Previsto, recebido, condições e pendências.' },
        { title: 'Execução', epc: 'Trecho, serviços para assinalar, metros executados, portões instalados, desvios, correções, fotos e observações.', kromos: 'Avanço, conformidade, desvios e correções.' },
        { title: 'Conferência e conclusão', epc: 'Trecho conferido, itens verificados, pendências, correções, situação do trecho e fotos finais.', kromos: 'Condição final, pendências, vistoria e decisão própria.' },
      ] },
    ],
    notes: ['Na página 2.2 Preparação do terreno e terraplenagem, o item 2.3 Cercamento aparece abaixo de Execução. Ao abrir, são apresentadas quatro abas recolhíveis, com a conferência inicial aberta. A CESBE preenche; a Kromos acompanha no mesmo layout. O controle da entrada de pessoas e veículos permanece em Áreas de apoio, na pasta 2.1.'],
  },
  {
    id: '2-4',
    name: '2.4 Locação e marcação da obra',
    formsReady: true,
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Conferência inicial', epc: 'Projetos atualizados, topografia, coordenadas, níveis, áreas liberadas e interferências.', kromos: 'Compatibilidade e condições de início.' },
        { title: 'Locação em campo', epc: 'Marcação das estruturas, fundações, equipamentos, vias, drenagem e trajetos; coordenadas, cotas, datas e fotos.', kromos: 'Avanço e correspondência aos projetos.', formId: 'marcacao' },
        { title: 'Gestão simplificada', epc: 'Item 14 ao final da lista. Ocorrência, solução, resposta Foi resolvido?, indicadores e envio. Adicionar ocorrência é específico deste caso.', kromos: 'Acompanhar soluções, pendências e indicadores. Sem gestão completa nesta ação.', formId: 'marcacao-ocorrencias' },
        { title: 'Liberação por setor', epc: 'Setores conferidos e liberados, pendências e reposição das marcações.', kromos: 'Frentes disponíveis e novas conferências.' },
      ] },
    ],
    notes: [],
  },
  {
    id: '2-5',
    name: '2.5 Drenagem e infraestrutura civil',
    formsReady: true,
    page: 'records',
    formPage: 'drenagem',
    per: 'por trecho',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Conferência antes do início', epc: 'Código e identificação do trecho; datas previstas e reais; marcação, trajeto, níveis, saída da água, acessos, interferências, impedimentos e evidências.', kromos: 'Condições de início, datas e correspondência ao projeto.' },
        { title: 'Materiais', epc: 'Materiais, especificações, quantidades previstas e recebidas, unidade, recebimento, condição e armazenamento. Adicionar material mantém os registros separados.', kromos: 'Disponibilidade, condições e divergências.' },
        { title: 'Execução', epc: 'Serviços assinalados, situação, quantidade executada e unidade; conferências de trajeto, largura, profundidade, níveis, escoamento e conexões; fotos antes do fechamento.', kromos: 'Avanço, atendimento ao projeto e desvios.' },
        { title: 'Funcionamento e acabamento', epc: 'Caminho livre, conexões, entrada e saída da água, sentido do escoamento, resultado da verificação e serviços de acabamento; pendências e evidências.', kromos: 'Funcionamento, acabamento e correções.' },
        { title: 'Conclusão do trecho', epc: 'Situação, data real de término, conferência final, pendências e fotos. Conclusão da CESBE não substitui vistoria e aceite da Kromos.', kromos: 'Condição final, pendências e decisão própria.' },
      ] },
    ],
    notes: ['Caixas de drenagem ficam nesta pasta. As valas e caixas de passagem de cabos ficam na pasta 2.7.'],
  },
  {
    id: '2-6',
    name: '2.6 Fundações e bases',
    formsReady: true,
    page: 'records',
    formPage: 'fundacoes',
    per: 'por fundação ou base',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Conferência antes do início', epc: 'Projeto de referência e cronograma; identificação pelo código do projeto; datas previstas e reais; conferências conforme o tipo.', kromos: 'Condições de início e correspondência ao projeto.' },
        { title: 'Materiais', epc: 'Identificação, especificação, quantidades previstas e recebidas, unidade, recebimento, condição, armazenamento e evidências.', kromos: 'Disponibilidade, condições e divergências.' },
        { title: 'Execução', epc: 'Serviços para assinalar conforme o tipo de fundação ou base; situação, quantidade executada, registros, impedimentos e evidências.', kromos: 'Avanço e atendimento ao projeto.' },
        { title: 'Conferência e acabamento', epc: 'Verificações correspondentes à execução de cada tipo; resultado, pendências, fotos e observações.', kromos: 'Conformidade e correções.' },
        { title: 'Conclusão', epc: 'Checklist correspondente aos serviços de cada tipo; situação, data real de término, pendências, fotos e observações.', kromos: 'Condição final, vistoria e decisão própria.' },
      ] },
    ],
    notes: ['Aplicar os controles ao tipo de fundação previsto no projeto. Condições de solo diferentes das previstas e desvios devem ser avaliados antes da continuidade afetada.'],
  },
  {
    id: '2-7',
    name: '2.7 Valas e caixas de passagem para cabos',
    formsReady: true,
    page: 'records',
    formPage: 'valas',
    per: 'por vala ou caixa',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Conferência inicial', epc: 'Projeto, trajetos, dimensões, caixas, interferências e áreas liberadas.', kromos: 'Compatibilidade e condições de início.' },
        { title: 'Materiais', epc: 'Eletrodutos, caixas, tampas e demais itens; identificação, quantidades e condições.', kromos: 'Disponibilidade e pendências.' },
        { title: 'Execução', epc: 'Trechos, extensão, profundidade, largura, fundo, eletrodutos e caixas, com fotos.', kromos: 'Avanço e atendimento ao projeto.' },
        { title: 'Inspeção antes do fechamento', epc: 'Dimensões, trajetos, conexões, entradas, proteção, sinalização e desobstrução aplicável; fotos.', kromos: 'Condições e correções.' },
        { title: 'Fechamento e recomposição', epc: 'Liberação, reaterro, compactação, acabamento e localização final.', kromos: 'Preservação e rastreabilidade.' },
        { title: 'Liberação por trecho', epc: 'Checklist, caixas, tampas e pendências.', kromos: 'Trechos disponíveis e inspeções.' },
      ] },
    ],
    notes: ['Conferir e registrar o que ficará enterrado antes de fechar; a sequência depende da solução prevista e do momento do lançamento dos cabos.'],
  },
  {
    id: '2-8',
    name: '2.8 Montagem das estruturas dos módulos',
    formsReady: true,
    page: 'records',
    formPage: 'estruturas',
    per: 'por lote de inversor',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Materiais', epc: 'Registre os materiais, as quantidades e as condições.', kromos: 'Acompanhe a disponibilidade e as condições.' },
        { title: 'Checklist para início', epc: 'Indique se as fundações estão liberadas, assinale as linhas disponíveis e informe início e término previstos. Se houver impedimento, registre descrição, responsável e prazo.', kromos: 'Acompanhe as condições de início e o prazo.' },
        { title: 'Execução', epc: 'Informe quantas mesas foram montadas e conferidas. Assinale as conferências: alinhamento, altura, inclinação, fixações e orientação. Quando aplicável, registre o ponto, o torque especificado e aplicado em N·m e a identificação da ferramenta calibrada.', kromos: 'Acompanhe o avanço e os desvios.' },
        { title: 'Conclusão', epc: 'Informe situação final, início e término reais, pendências, fotos e observações.', kromos: 'Registre o aceite em campo próprio.' },
      ] },
    ],
    notes: ['Selecione o projeto de referência e adicione os lotes por inversor conforme o projeto. Cada lote identifica o setor, as linhas e a quantidade prevista.', 'Verificar o torque e os pontos de inspeção conforme projeto, manual do fabricante e plano de inspeção aplicável. Cada etapa de cada lote tem Gestão simplificada para registrar divergências. Acione a Gestão total dentro dela somente quando precisar aprofundar. A numeração organiza o formulário; o preenchimento acompanha o avanço da obra.'],
  },
  {
    id: '2-9',
    name: '2.9 Instalação dos módulos fotovoltaicos',
    formsReady: true,
    page: 'records',
    formPage: 'modulos',
    per: 'por lote de inversor',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Materiais', epc: 'Registre os materiais, as quantidades e as condições. Na instalação dos módulos, informe também o modelo.', kromos: 'Acompanhe a disponibilidade e as condições.' },
        { title: 'Checklist para início', epc: 'Indique se as estruturas estão liberadas, assinale as linhas disponíveis e informe início e término previstos. Se houver impedimento, registre descrição, responsável e prazo.', kromos: 'Acompanhe as condições de início e o prazo.' },
        { title: 'Execução', epc: 'Informe quantos módulos foram instalados e conferidos. Assinale as conferências: posição, alinhamento e fixação. Quando aplicável, registre o ponto, o torque especificado e aplicado em N·m e a identificação da ferramenta calibrada.', kromos: 'Acompanhe o avanço e os desvios.' },
        { title: 'Conclusão', epc: 'Informe situação final, início e término reais, pendências, fotos e observações.', kromos: 'Registre o aceite em campo próprio.' },
      ] },
    ],
    notes: ['Selecione o projeto de referência e adicione os lotes por inversor já identificados na pasta 2.8. Cada lote identifica o setor, as linhas e a quantidade prevista de módulos.'],
  },
  {
    id: '2-10',
    name: '2.10 Instalação de inversores, quadros, transformadores, cabine e BESS',
    formsReady: true,
    page: 'records',
    formPage: 'equipamentos',
    per: 'por equipamento',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Antes de iniciar', epc: 'Conferir local, liberação da base ou do suporte, acessos e condições previstas no projeto. Informar datas previstas e registrar impedimentos.', kromos: 'Acompanhar condições de início, prazos e impedimentos.' },
        { title: 'Recebimento e conferência', epc: 'Vincular projeto aprovado com código e revisão; vincular ou anexar NF e certificado de garantia. Registrar datas da garantia, fabricante, modelo e número de série com foto da placa. Anexar manuais, fichas técnicas e relatórios de ensaio de fábrica, quando aplicáveis.', kromos: 'Validar a documentação e acompanhar divergências de fornecimento.' },
        { title: 'Montagem física', epc: 'Conferir posicionamento, fixação e os itens do equipamento. Registrar torque quando aplicável. O acesso geral de manutenção e QR permanece fora das fichas individuais, reservado para desenvolvimento posterior.', kromos: 'Acompanhar montagem e identificação por equipamento.' },
        { title: 'Conclusão', epc: 'Registrar datas reais, situação da montagem, pendências e fotos finais. Indicar se a montagem está liberada para ligação elétrica.', kromos: 'Registrar aceite em campo próprio.' },
      ] },
    ],
    notes: ['Abra uma ficha por código do projeto: inversor, QGBT, transformador, cabine ou BESS, quando a instalação estiver no escopo. Use o mesmo código nas etapas seguintes. A CESBE registra a obra e as evidências; a Kromos valida os documentos e registra o aceite.', 'QGBT: o quadro chega pronto da fábrica. No recebimento, conferir o conjunto inteiro com o projeto aprovado de fabricação: identificação, dimensões, componentes, disposição interna e barramentos. Todo QGBT deve ter o ponto reservado para futura conexão do BESS. Se faltar ou divergir do projeto, registrar a divergência na ficha do QGBT, com descrição e evidência, mesmo que o BESS ainda não esteja no escopo.', 'A pasta 2.10 termina na montagem física e na identificação. Registre ligações elétricas, proteção CC e aterramento na 2.11, inspeções e testes antes da energização na 2.13, energização na 2.14 e comissionamento na 2.15.'],
  },
  {
    id: '2-11',
    name: '2.11 Instalação elétrica e aterramento',
    formsReady: true,
    page: 'records',
    formPage: 'eletrica',
    per: 'por lançamento ou trecho',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Antes de iniciar', epc: 'Informe início e término previstos, infraestrutura de referência e impedimentos.', kromos: 'Acompanhe os prazos e as condições de início.' },
        { title: 'Materiais', epc: 'Registre cabo ou condutor, seção prevista, quantidade recebida, terminais e acessórios. Anexe evidências quando aplicável.', kromos: 'Confira a disponibilidade dos materiais.' },
        { title: 'Execução e conferência', epc: 'Digite o código do lançamento como consta no CAD ou no PDF da etapa. Registre origem, destino, extensão prevista e executada, avanço, checklist e fotos. Quando aplicável, registre os torques previstos e aplicados nas terminações e a ferramenta calibrada.', kromos: 'Acompanhe avanço, conferência e desvios por lançamento.' },
        { title: 'Conclusão', epc: 'Informe datas reais, situação final, pendências e fotos.', kromos: 'Registre o aceite em campo próprio.' },
      ] },
      { title: 'Frentes de ligação e aterramento', steps: [
        { title: '1. Instalação CC', epc: 'Registre montagem da string, cabos, ligação na string box quando prevista, ligação no inversor e conferência. Identifique a proteção CC e, se externa, o dispositivo e o resultado da conferência.', kromos: 'Acompanhe o avanço por lançamento e as pendências de proteção.' },
        { title: '2. Inversor → QDG/QGBT', epc: 'Registre o circuito e o código do DJ CA em campos separados do código do lançamento. Identifique a ligação e a conferência em cada ponta e registre a situação do disjuntor.', kromos: 'Acompanhe as duas pontas e a conferência do DJ CA.' },
        { title: '3. QDG/QGBT → Transformador', epc: 'Registre o lançamento, as ligações no quadro e no lado de baixa tensão do transformador e a conferência.', kromos: 'Acompanhe o avanço por ligação.' },
        { title: '4. Transformador → Cabine', epc: 'Registre o lançamento e as terminações do circuito de média tensão no transformador e na cabine.', kromos: 'Acompanhe o avanço por ligação.' },
        { title: 'Aterramento', epc: 'Registre separadamente o código do trecho da malha, sua execução e as conexões aos equipamentos.', kromos: 'Acompanhe os trechos e as conexões.' },
      ] },
    ],
    notes: ['Selecione a frente de ligação ou o aterramento na coluna da esquerda. No formulário à direita, selecione o projeto de referência e use Abrir PDF para consultar o desenho da etapa. A ficha não tem campo de revisão.', 'Use Adicionar lançamento para abrir uma ficha por código. Dois lançamentos do mesmo circuito têm registros próprios. Em Aterramento, use Adicionar trecho. Cada etapa tem Gestão simplificada para ocorrências e acesso à Gestão total quando necessário.'],
  },
  {
    id: '2-12',
    name: '2.12 Comunicação, monitoramento e periféricos',
    formsReady: true,
    page: 'records',
    formPage: 'comunicacao',
    per: 'por ponto ou trecho',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Antes de iniciar', epc: 'Por ponto ou trecho, informar datas previstas, local e infraestrutura disponíveis e impedimentos.', kromos: 'Acompanhar condições e prazos.' },
        { title: 'Materiais', epc: 'Usar Adicionar material para todos os componentes: tipo, modelo ou especificação, quantidades prevista e recebida, unidade e condição. Para equipamentos, registrar documentos, série e garantia, dentro do sistema.', kromos: 'Conferir disponibilidade e documentação.' },
        { title: 'Execução e conferência', epc: 'Registrar montagem, cabos, conexões e identificação. Em Comunicação, verificar comunicação. No CFTV, conferir imagem, enquadramento e gravação ou acionamento do alarme, conforme o tipo.', kromos: 'Acompanhar avanço e divergências.' },
        { title: 'Conclusão', epc: 'Informar datas reais, situação, pendências, fotos e observações.', kromos: 'Registrar o aceite em campo próprio.' },
      ] },
      { title: 'Subpastas por sistema', plain: true, steps: [
        { title: '2.12.1 Comunicação e monitoramento', epc: 'Rede, internet, switches, dataloggers e comunicação.', kromos: '' },
        { title: '2.12.2 CFTV e segurança', epc: 'Câmeras, gravador, central de alarme, sensores e sirenes.', kromos: '' },
        { title: '2.12.3 Iluminação', epc: 'Luminárias, postes, cabos, comandos e serviços do conjunto.', kromos: '' },
        { title: '2.12.4 Estação meteorológica', epc: 'Sensores, montagem e comunicação.', kromos: '' },
      ] },
    ],
    notes: ['Os sistemas ficam na coluna da esquerda. Selecione o projeto de referência, sem campo de revisão, e use Abrir PDF. Adicionar ponto ou trecho abre uma ficha com código digitado conforme o CAD ou PDF. Cada ficha tem quatro etapas, cada uma com Gestão simplificada e acesso à Gestão total. Todos os pontos, componentes e serviços do mesmo sistema compartilham o mesmo QR de manutenção. Alimentação elétrica: 2.11; integração: 2.15.'],
  },
  {
    id: '2-13',
    name: '2.13 Inspeções e testes antes da energização',
    formsReady: false,
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Planejamento', epc: 'Plano de inspeções e ensaios, circuitos, equipamentos e responsáveis.', kromos: 'Testes previstos e frentes.' },
        { title: 'Conferência antes dos testes', epc: 'Trecho, procedimento e instrumento com calibração quando aplicável.', kromos: 'Condições e pendências.' },
        { title: 'Inspeções e ensaios', epc: 'Tipo, local, data, responsável, critério, resultado e relatório por circuito ou equipamento.', kromos: 'Previsto versus realizado e desvios.' },
        { title: 'Correções e novas verificações', epc: 'Ocorrência, responsável, prazo, correção e resultado do novo teste.', kromos: 'Pendências e retrabalho.' },
        { title: 'Liberação e conclusão', epc: 'Relatórios, checklist, pendências e liberações.', kromos: 'Inspeção e condições para energização.' },
      ] },
    ],
    notes: ['Registros separados por circuito CC, CA, aterramento ou equipamento, com critérios dos projetos, manuais e plano aplicável. Liberação para energização segue as competências definidas.'],
  },
  {
    id: '2-14',
    name: '2.14 Conexão e energização',
    formsReady: true,
    page: 'records',
    formPage: 'energizacao',
    per: 'por ficha',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Referências e planejamento', epc: 'Selecionar projeto de referência, sem campo de revisão, e abrir o documento. Informar código do projeto, datas previstas, equipe e responsável. No conjunto, identificar quadro, transformador e cabine. No auxiliar, informar o sistema.', kromos: 'Acompanhar referências, programação e responsáveis.' },
        { title: 'Conferência antes da energização', epc: 'Vincular resultados da 2.13, informar situação da liberação e anexar autorizações aplicáveis. Registrar pendências, responsável e prazo.', kromos: 'Conferir condições e pendências por ficha.' },
        { title: 'Registro da energização', epc: 'Assinalar Não iniciada, Realizada ou Interrompida. Registrar data e hora, responsável, procedimento e evidências.', kromos: 'Acompanhar execução e ocorrências.' },
        { title: 'Testes após energização', epc: 'Adicionar as verificações específicas da ficha. Registrar resultado, medições e observações conforme o procedimento. Informar alarmes ou falhas e ações realizadas; anexar relatório e evidências.', kromos: 'Analisar resultados por inversor, conjunto ou sistema.' },
        { title: 'Aprovações e conclusão', epc: 'Informar situação final, data real de término, responsável pela verificação, relatório e pendências.', kromos: 'Registrar análise e aprovação em campo próprio; não confundir com o preenchimento da CESBE.' },
      ] },
    ],
    notes: ['A coluna esquerda apresenta três frentes: Energização dos inversores; Energização do quadro, transformador e cabine; Energização dos sistemas auxiliares. Cada inversor, conjunto elétrico ou sistema auxiliar tem ficha própria e código conforme o projeto. Usar Adicionar inversor, Adicionar conjunto ou Adicionar sistema auxiliar. A aprovação de uma ficha não aprova as demais.'],
  },
  {
    id: '2-15',
    name: '2.15 Comissionamento e entrega',
    formsReady: true,
    page: 'records',
    formPage: 'comissionamento',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Planejamento por sistema', epc: 'Selecionar plano de comissionamento, projeto e sistema. Informar código, datas previstas, equipe, responsável e critérios de aceitação.', kromos: 'Acompanhar programação e critérios.' },
        { title: 'Conferência inicial', epc: 'Identificar resultados e liberações da 2.13, a frio, ou da 2.14, a quente. Registrar situação e pendências impeditivas com responsável e prazo.', kromos: 'Analisar condições de teste.' },
        { title: 'Testes por sistema', epc: 'Usar Adicionar teste. Registrar identificação, data, responsável, procedimento, critério, resultado esperado, resultado obtido e evidências. A quente, identificar Sistema individual, Funcionamento integrado ou Desempenho.', kromos: 'Acompanhar resultados, divergências e testes pendentes.' },
        { title: 'Correções e novas verificações', epc: 'Quando houver falha, usar Adicionar correção. Referenciar a ocorrência ou teste existente; registrar ação, responsável, prazo, nova verificação, resultado e evidências.', kromos: 'Acompanhar resolução e retrabalho.' },
        { title: 'Conclusão por sistema', epc: 'Informar situação, início e término reais, responsável pela verificação, relatório e pendências.', kromos: 'Registrar análise do sistema separadamente.' },
        { title: 'Entrega e aceite', epc: 'Consolidar resultados a frio e a quente. Referenciar relatórios, projetos conforme executado e manuais. Registrar treinamentos, participantes, evidências e pendências. Informar conclusão da CESBE, data e responsável pela entrega.', kromos: 'Registrar o aceite da Kromos em campo próprio, distinto da conclusão da CESBE e da entrega documental.' },
      ] },
    ],
    notes: ['A coluna esquerda apresenta Comissionamento a frio, Comissionamento a quente e Entrega e aceite. As duas frentes de comissionamento mantêm fichas independentes por sistema, com Adicionar sistema. A frio registra testes com o sistema desenergizado e referencia a 2.13; a quente registra testes com o sistema energizado e referencia a 2.14. Não repetir resultados já existentes: vincular suas referências e complementar o necessário conforme o plano.', 'Resultado do comissionamento, entrega documental e aceite da Kromos são situações distintas e seguem o contrato aplicável.'],
  },
  {
    id: '2-16',
    name: '2.16 Desmobilização e limpeza final',
    formsReady: true,
    page: 'records',
    formPage: 'desmobilizacao',
    groups: [
      { title: 'Etapas', steps: [
        { title: 'Planejamento da desmobilização', epc: 'Informar início e término previstos, equipe e responsável. Relacionar recursos a retirar e os que permanecerão na usina.', kromos: 'Acompanhar programação e recursos ainda necessários.' },
        { title: 'Retiradas e permanências', epc: 'Três listas: Máquinas e materiais a retirar, com Adicionar máquina ou material; Instalações provisórias a retirar, com Adicionar instalação provisória; Permanecerá na usina, com Adicionar item. Ao final: responsável, fotos e observações.', kromos: 'Conferir retiradas e permanências.' },
        { title: 'Limpeza de módulos', epc: 'Por registro: setor, inversor e fotos. Usar Adicionar setor para registrar outro setor ou vínculo com inversor.', kromos: 'Conferir os setores e as evidências.' },
        { title: 'Limpeza de obra', epc: 'Informar máquinas usadas para limpeza. Assinalar Descarte terceirizado? Sim ou Não. Informar o local específico de descarte. Assinalar Local limpo e pronto para entrega? Sim ou Não. Anexar fotos.', kromos: 'Conferir a condição final e a limpeza.' },
        { title: 'Conferência e conclusão', epc: 'Registrar início e término reais, responsável pela conferência, situação da conclusão da CESBE, relatório final e evidências. Pendências remanescentes continuam com identificação, responsável e prazo.', kromos: 'Registrar análise em campo próprio. A desmobilização não encerra automaticamente as ocorrências abertas.' },
      ] },
    ],
    notes: ['A coluna esquerda apresenta cinco itens: Planejamento da desmobilização; Retiradas e permanências; Limpeza de módulos; Limpeza de obra; Conferência e conclusão. Manter preenchimento objetivo e os campos aprovados abaixo.', 'Registrar análise em campo próprio. A desmobilização não encerra automaticamente as ocorrências abertas.'],
  },
]

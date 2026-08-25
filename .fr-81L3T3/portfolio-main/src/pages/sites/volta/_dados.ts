/*
  Dados da demo VOLTA, compartilhados entre a home e o catálogo.

  Prefixo `_` no nome do arquivo: o Astro não transforma em rota o que começa
  com underline, então o módulo mora junto das páginas que o usam sem virar
  uma URL pública.
*/

export const LOJA = {
  nome: 'VOLTA',
  lema: 'Um passo à frente do óbvio.',
  fone: '+55 11 4020-1180',
  foneLink: '+551140201180',
  zap: '5511940201180',
  zapFmt: '(11) 94020-1180',
  email: 'ola@volta.com.br',
  rua: 'Rua Augusta, 2740 — loja 12',
  bairro: 'Jardins',
  cidade: 'São Paulo',
  uf: 'SP',
  cep: '01412-100',
  cnpj: '48.912.377/0001-06',
  site: 'https://volta.com.br',
  insta: 'voltasneakers',
  desde: 2019,
  freteGratis: 399,
};

export const mapaQuery = encodeURIComponent(`${LOJA.rua}, ${LOJA.bairro}, ${LOJA.cidade} - ${LOJA.uf}`);

/*
  Grade de numeração por gênero. Fica fora do produto porque é da loja, não do
  modelo: o que muda de um tênis para o outro é quais numerações sobraram.
*/
export const NUMERACAO: Record<'masculino' | 'feminino', number[]> = {
  masculino: [38, 39, 40, 41, 42, 43, 44],
  feminino: [33, 34, 35, 36, 37, 38, 39, 40],
};

export const TABELA_TAMANHO = [
  { br: 33, us: '3', eu: 34, cm: 21.5 },
  { br: 34, us: '4', eu: 35, cm: 22.0 },
  { br: 35, us: '5', eu: 36, cm: 22.8 },
  { br: 36, us: '6', eu: 37, cm: 23.5 },
  { br: 37, us: '6.5', eu: 38, cm: 24.1 },
  { br: 38, us: '7', eu: 39, cm: 24.8 },
  { br: 39, us: '8', eu: 40, cm: 25.4 },
  { br: 40, us: '8.5', eu: 41, cm: 26.0 },
  { br: 41, us: '9.5', eu: 42, cm: 26.7 },
  { br: 42, us: '10', eu: 43, cm: 27.3 },
  { br: 43, us: '11', eu: 44, cm: 28.0 },
  { br: 44, us: '12', eu: 45, cm: 28.6 },
];

export type Produto = {
  id: string;
  nome: string;
  linha: string;
  genero: 'masculino' | 'feminino';
  preco: number;
  de: number | null;
  cor: string;
  corHex: string;
  esgotados: number[];
  novo: boolean;
  /* como o modelo calça: entra como aviso ao lado da numeração */
  calce: 'no tamanho' | 'um número acima' | 'um número abaixo';
  resumo: string;
  descricao: string;
  destaques: string[];
  ficha: Record<string, string>;
};

export const PRODUTOS: Produto[] = [
  {
    id: 'meridiano',
    nome: 'Meridiano 3',
    linha: 'Corrida',
    genero: 'masculino',
    preco: 749,
    de: 899,
    cor: 'Azul cobalto',
    corHex: '#1668c4',
    esgotados: [44],
    novo: false,
    calce: 'no tamanho',
    resumo: 'Amortecimento para rodagem longa, com cabedal em malha de um fio só.',
    descricao:
      'Feito para o quilômetro 15 em diante. A entressola de espuma de alta restituição devolve energia sem virar cama mole, e o cabedal é tecido em peça única — não tem costura para marcar o pé em treino longo. É o tênis que eu levaria para uma meia maratona sem pensar duas vezes.',
    destaques: [
      'Entressola de espuma nitrogenada, 34 mm no calcanhar',
      'Cabedal em malha de um fio só, sem costura interna',
      'Drop de 8 mm, pisada neutra',
      'Solado de borracha de carbono nas zonas de desgaste',
    ],
    ficha: { Peso: '268 g (nº 41)', Drop: '8 mm', Entressola: 'Espuma nitrogenada', Pisada: 'Neutra', Terreno: 'Asfalto e esteira' },
  },
  {
    id: 'grafite',
    nome: 'Grafite Speed',
    linha: 'Corrida',
    genero: 'masculino',
    preco: 649,
    de: null,
    cor: 'Preto total',
    corHex: '#151515',
    esgotados: [38, 44],
    novo: false,
    calce: 'um número acima',
    resumo: 'Leve e seco, para treino de ritmo e prova curta.',
    descricao:
      'O oposto do tênis macio: aqui a entressola é firme de propósito, porque em treino de ritmo você quer sentir o chão respondendo. Cabedal transparente que seca rápido e um calcanhar estruturado que segura o pé na curva. Não é para rodagem lenta — é para o dia em que o treino tem número.',
    destaques: [
      'Entressola firme, resposta imediata no apoio',
      'Cabedal transparente de secagem rápida',
      'Contraforte estruturado no calcanhar',
      'Drop de 6 mm, para pisada média e de antepé',
    ],
    ficha: { Peso: '212 g (nº 41)', Drop: '6 mm', Entressola: 'EVA de alta densidade', Pisada: 'Neutra', Terreno: 'Asfalto e pista' },
  },
  {
    id: 'trilha',
    nome: 'Trilha GTX',
    linha: 'Trail',
    genero: 'masculino',
    preco: 829,
    de: null,
    cor: 'Oliva',
    corHex: '#6b6236',
    esgotados: [39],
    novo: false,
    calce: 'no tamanho',
    resumo: 'Cravos de 5 mm e membrana impermeável para terreno solto.',
    descricao:
      'Trilha molhada, pedra solta e raiz atravessada. Os cravos de 5 mm mordem barro sem empastar, a membrana segura água de fora sem cozinhar o pé por dentro, e a placa de proteção na entressola evita aquela pedra que acerta bem no meio do pé. Pesa mais que um tênis de asfalto porque precisa pesar.',
    destaques: [
      'Cravos de 5 mm com desenho autolimpante',
      'Membrana impermeável e respirável',
      'Placa de proteção contra pedra na entressola',
      'Biqueira e calcanhar reforçados em borracha',
    ],
    ficha: { Peso: '342 g (nº 41)', Drop: '10 mm', Entressola: 'EVA com placa de proteção', Pisada: 'Neutra', Terreno: 'Trilha e terreno solto' },
  },
  {
    id: 'cais',
    nome: 'Cais Canvas',
    linha: 'Casual',
    genero: 'masculino',
    preco: 399,
    de: null,
    cor: 'Azul-marinho',
    corHex: '#1f3557',
    esgotados: [],
    novo: false,
    calce: 'um número abaixo',
    resumo: 'Lona de algodão encerado sobre solado vulcanizado.',
    descricao:
      'O par que você calça sem pensar. Lona de algodão com tratamento encerado, que repele respingo e amacia com o uso em vez de descascar. Solado vulcanizado colado à quente, do jeito antigo — dura mais e amassa junto com o pé. Combina com jeans e com short, e é isso mesmo que se espera dele.',
    destaques: [
      'Lona de algodão encerado, resistente a respingo',
      'Solado vulcanizado, colagem a quente',
      'Palmilha removível, lavável',
      'Ilhoses metálicos que não enferrujam',
    ],
    ficha: { Peso: '340 g (nº 41)', Drop: '10 mm', Entressola: 'Borracha vulcanizada', Pisada: 'Sem indicação', Terreno: 'Uso urbano' },
  },
  {
    id: 'noturno',
    nome: 'Noturno Reflex',
    linha: 'Lifestyle',
    genero: 'masculino',
    preco: 699,
    de: 799,
    cor: 'Preto iridescente',
    corHex: '#101014',
    esgotados: [38, 39],
    novo: true,
    calce: 'no tamanho',
    resumo: 'Entressola vazada e detalhes que acendem no farol.',
    descricao:
      'Silhueta pesada, construção leve. A entressola vazada tira peso sem tirar altura, e os painéis iridescentes do cabedal mudam de cor conforme a luz bate — de dia é preto, à noite acende no farol do carro. É o modelo mais chamativo da linha e assume isso.',
    destaques: [
      'Entressola vazada, volume sem peso',
      'Painéis iridescentes com retorno refletivo',
      'Forro acolchoado no colarinho',
      'Cadarço plano com ponteira metálica',
    ],
    ficha: { Peso: '395 g (nº 41)', Drop: '12 mm', Entressola: 'EVA injetada vazada', Pisada: 'Sem indicação', Terreno: 'Uso urbano' },
  },
  {
    id: 'aurora',
    nome: 'Aurora Air',
    linha: 'Corrida',
    genero: 'feminino',
    preco: 699,
    de: null,
    cor: 'Branco gelo',
    corHex: '#e9ecef',
    esgotados: [40],
    novo: true,
    calce: 'no tamanho',
    resumo: 'Forma feminina de verdade, não a masculina reduzida.',
    descricao:
      'Fôrma desenhada do zero para o pé feminino: calcanhar mais estreito, peito do pé mais alto e antepé com espaço onde o pé realmente ocupa. Não é a numeração masculina encolhida, que é o que a maioria faz. Amortecimento equilibrado para rodagem de 5 a 15 km.',
    destaques: [
      'Fôrma feminina específica, calcanhar mais estreito',
      'Entressola de dupla densidade, apoio na pronação leve',
      'Cabedal em malha aberta, ventilação alta',
      'Drop de 8 mm, pisada neutra a levemente pronada',
    ],
    ficha: { Peso: '232 g (nº 37)', Drop: '8 mm', Entressola: 'Espuma de dupla densidade', Pisada: 'Neutra a pronada leve', Terreno: 'Asfalto e esteira' },
  },
  {
    id: 'pulso',
    nome: 'Pulso Lite',
    linha: 'Corrida',
    genero: 'feminino',
    preco: 599,
    de: 699,
    cor: 'Ciano',
    corHex: '#1fb6d8',
    esgotados: [33, 40],
    novo: false,
    calce: 'um número acima',
    resumo: 'O mais leve da linha, para treino curto e dia de academia.',
    descricao:
      'Duzentos e quatro gramas: você esquece que está calçando. Cabedal quase todo em malha, entressola baixa e uma sola flexível que dobra junto com o pé no agachamento. Serve tanto para os 5 km do fim da tarde quanto para o treino de força — e é o que a maioria das pessoas realmente faz.',
    destaques: [
      'Peso de 204 g na numeração 37',
      'Sola flexível, dobra com o pé em agachamento',
      'Entressola baixa, sensação de solo',
      'Malha de secagem rápida',
    ],
    ficha: { Peso: '204 g (nº 37)', Drop: '6 mm', Entressola: 'EVA leve', Pisada: 'Neutra', Terreno: 'Academia e asfalto' },
  },
  {
    id: 'linha',
    nome: 'Linha Branca',
    linha: 'Casual',
    genero: 'feminino',
    preco: 379,
    de: null,
    cor: 'Branco',
    corHex: '#f4f4f4',
    esgotados: [],
    novo: false,
    calce: 'no tamanho',
    resumo: 'O branco que continua branco: couro tratado, lavável.',
    descricao:
      'Todo mundo tem um tênis branco e todo mundo reclama que ele sujou. Este tem tratamento hidrofóbico no couro: café derramado sai com pano úmido, e a entressola pode ir na água e sabão sem soltar. Corte baixo, sem logo grande, para durar mais de uma estação.',
    destaques: [
      'Couro com tratamento hidrofóbico, limpa com pano úmido',
      'Entressola lavável, não amarela',
      'Sem logo aplicado — só o relevo lateral',
      'Palmilha em espuma de memória',
    ],
    ficha: { Peso: '295 g (nº 37)', Drop: '10 mm', Entressola: 'Borracha injetada', Pisada: 'Sem indicação', Terreno: 'Uso urbano' },
  },
  {
    id: 'plataforma',
    nome: 'Plataforma 60',
    linha: 'Lifestyle',
    genero: 'feminino',
    preco: 559,
    de: null,
    cor: 'Preto e branco',
    corHex: '#1a1a1a',
    esgotados: [39, 40],
    novo: true,
    calce: 'no tamanho',
    resumo: 'Seis centímetros de entressola que não pesam como parecem.',
    descricao:
      'A entressola tem 60 mm no calcanhar e mesmo assim o par fica em 310 g, porque o miolo é vazado. Cabedal em camurça sintética com painéis em lona, e um degrau na entressola que faz o pé rolar naturalmente em vez de andar em cima de um tijolo. Altura sem o desconforto que costuma vir com ela.',
    destaques: [
      'Entressola de 60 mm com miolo vazado',
      'Degrau de rolagem, caminhada natural',
      'Camurça sintética com painéis em lona',
      'Palmilha alta em espuma de memória',
    ],
    ficha: { Peso: '310 g (nº 37)', Drop: '18 mm', Entressola: 'EVA vazada de 60 mm', Pisada: 'Sem indicação', Terreno: 'Uso urbano' },
  },
  {
    id: 'nevoa',
    nome: 'Névoa Slip',
    linha: 'Casual',
    genero: 'feminino',
    preco: 429,
    de: null,
    cor: 'Lilás acinzentado',
    corHex: '#7b7594',
    esgotados: [33],
    novo: false,
    calce: 'um número abaixo',
    resumo: 'Calça sem cadarço e continua firme no pé.',
    descricao:
      'Elástico duplo escondido no cabedal matelassê: entra sem desamarrar nada e não sai no meio do passo, que é onde todo slip-on falha. O acolchoado do colarinho é alto o bastante para usar sem meia sem machucar o tendão. É o par de sair correndo de casa.',
    destaques: [
      'Elástico duplo interno, veste sem cadarço',
      'Cabedal matelassê acolchoado',
      'Colarinho alto, confortável sem meia',
      'Solado de borracha antiderrapante',
    ],
    ficha: { Peso: '265 g (nº 37)', Drop: '8 mm', Entressola: 'EVA leve', Pisada: 'Sem indicação', Terreno: 'Uso urbano' },
  },
];

export const LINHAS = [...new Set(PRODUTOS.map((p) => p.linha))];

export const VANTAGENS = [
  { i: 'fa-solid fa-truck-fast', t: 'Frete grátis', d: `Acima de R$ ${LOJA.freteGratis} para todo o Brasil` },
  { i: 'fa-solid fa-rotate-left', t: '30 dias para trocar', d: 'Pode testar em casa; a devolução é por nossa conta' },
  { i: 'fa-solid fa-credit-card', t: 'Até 10× sem juros', d: 'Ou 10% de desconto à vista no Pix' },
  { i: 'fa-solid fa-shield-halved', t: '1 ano de garantia', d: 'Contra defeito de fabricação, sem letra miúda' },
];

export const TECNOLOGIA = [
  {
    t: 'Entressola nitrogenada',
    d: 'Espuma expandida com nitrogênio em vez de ar: célula menor, parede mais fina e 22% mais restituição de energia que o EVA comum. É o que faz o pé subir de volta em vez de afundar.',
    n: '+22%',
    l: 'de retorno de energia',
  },
  {
    t: 'Malha de um fio só',
    d: 'O cabedal sai da máquina inteiro, tecido em uma única passada. Sem costura interna quer dizer sem ponto para marcar o pé no quilômetro 12 — e menos retalho sobrando na produção.',
    n: '0',
    l: 'costuras internas',
  },
  {
    t: 'Borracha reciclada',
    d: 'O solado usa 30% de borracha recuperada de refugo da própria fábrica. Mesma resistência à abrasão nos testes, com menos material novo entrando na linha.',
    n: '30%',
    l: 'do solado é reciclado',
  },
];

export const DUVIDAS = [
  {
    p: 'Como eu sei qual numeração pedir?',
    r: 'Meça o pé em casa: fique de pé sobre uma folha, marque o calcanhar e o dedo mais longo e meça em centímetros à noite, quando o pé está no maior. Compare com a coluna CM da tabela de tamanhos, que abre dentro de cada produto. Se cair entre dois números, suba um — em tênis de corrida a folga de meio número na frente é recomendada, não defeito.',
  },
  {
    p: 'Posso trocar se não servir?',
    r: 'Pode, em até 30 dias, e a primeira troca é por nossa conta: a gente manda a etiqueta de postagem por e-mail. O tênis precisa voltar sem marca de uso externo — pode calçar em casa e andar pelo tapete à vontade, só não vale ir para a rua e depois pedir troca.',
  },
  {
    p: 'Em quanto tempo chega?',
    r: 'Capitais do Sudeste, de 2 a 4 dias úteis. Demais capitais, de 4 a 7. Interior, de 5 a 10. O prazo exato aparece no carrinho depois que você digita o CEP, e ele já conta o dia de separação no estoque.',
  },
  {
    p: 'O frete é grátis mesmo?',
    r: `Acima de R$ ${LOJA.freteGratis} sim, para todo o Brasil, sem asterisco. Abaixo disso o valor sai do CEP e aparece no carrinho antes de você preencher qualquer coisa.`,
  },
  {
    p: 'Dá para comprar e retirar na loja?',
    r: `Dá. Escolha "retirar na loja" no fechamento e o pedido fica separado em até 4 horas úteis na ${LOJA.rua}, ${LOJA.bairro}. Você recebe um aviso quando estiver pronto e tem 7 dias para buscar.`,
  },
  {
    p: 'A garantia cobre desgaste do solado?',
    r: 'Não — solado gasta, e isso é uso, não defeito. A garantia de 1 ano cobre descolamento, ruptura de costura, defeito de entressola e problema de fabricação em geral. Na prática: se soltou sozinho, é conosco.',
  },
];

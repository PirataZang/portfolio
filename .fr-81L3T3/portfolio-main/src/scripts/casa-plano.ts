/*
  Planta baixa — fonte única.

  O mesmo arquivo alimenta o SVG 2D (renderizado no servidor, dentro do
  index.astro) e a cena 3D (casa-3d.ts, no cliente). Desenhar a planta duas
  vezes é como cotar a obra duas vezes: uma hora as duas divergem.

  Eixos: x cresce para a direita, z cresce para a FRENTE da casa (sul).
  No SVG, z vira o eixo Y — norte para cima, como em prancha de verdade.
  Unidade: metro.
*/

export const H = 2.8;      // pé-direito
export const ESP = 0.15;   // espessura de parede


/* cobertura — usada pela cena 3D e pelo desenho de fachada da capa */
export const BEIRAL = 0.6;
export const INCL = (20 * Math.PI) / 180;   // 20° ≈ 36% de inclinação
export const Y_LAJE = H + 0.2;              // topo da viga de respaldo
export const Y_TELHA = Y_LAJE + 0.12;       // apoio do telhado

export type Vao = {
  at: number;              // distância do início da parede até o início do vão
  larg: number;
  y0: number;              // altura do peitoril
  y1: number;              // altura da verga
  tipo: 'porta' | 'janela' | 'passagem';
};

export type Parede = { x1: number; z1: number; x2: number; z2: number; vaos?: Vao[] };

const porta = (at: number, larg = 0.8): Vao => ({ at, larg, y0: 0, y1: 2.1, tipo: 'porta' });
const passagem = (at: number, larg: number): Vao => ({ at, larg, y0: 0, y1: 2.2, tipo: 'passagem' });
const janela = (at: number, larg: number, y0 = 1.0, y1 = 2.1): Vao => ({ at, larg, y0, y1, tipo: 'janela' });

/* limites do perímetro */
export const LIM = { x1: -5.2, x2: 5.2, z1: -4.0, z2: 4.0 };
export const LARG = LIM.x2 - LIM.x1;   // 10,40 m
export const PROF = LIM.z2 - LIM.z1;   //  8,00 m
export const RUN = PROF / 2 + BEIRAL;
export const SUBIDA = RUN * Math.tan(INCL);

export const PAREDES: Parede[] = [
  // ---- perímetro (a varanda fica sem fechamento na frente e na lateral) ----
  { x1: -5.2, z1: -4.0, x2: 5.2, z2: -4.0, vaos: [
    janela(0.9, 1.5), janela(4.0, 1.5), janela(6.3, 0.6, 1.5), janela(7.9, 1.5),
  ] },
  { x1: 5.2, z1: -4.0, x2: 5.2, z2: 1.0, vaos: [janela(1.0, 1.5)] },
  { x1: -5.2, z1: 4.0, x2: 3.4, z2: 4.0, vaos: [
    porta(1.0, 1.0), janela(2.2, 1.0), janela(4.2, 1.6), janela(6.9, 1.2, 1.2),
  ] },
  { x1: -5.2, z1: 4.0, x2: -5.2, z2: -4.0, vaos: [janela(1.2, 1.2), janela(5.0, 1.2)] },

  // ---- divisórias ----
  { x1: -5.2, z1: -0.2, x2: 5.2, z2: -0.2, vaos: [
    porta(2.0), porta(4.3), porta(6.2, 0.7), porta(8.6),
  ] },
  { x1: -1.8, z1: -4.0, x2: -1.8, z2: -0.2 },
  { x1: 0.8, z1: -4.0, x2: 0.8, z2: -0.2 },
  { x1: 2.4, z1: -4.0, x2: 2.4, z2: -0.2 },
  { x1: -1.8, z1: -0.2, x2: -1.8, z2: 4.0, vaos: [passagem(0.1, 0.9), passagem(1.8, 2.0)] },
  { x1: -1.8, z1: 1.0, x2: 5.2, z2: 1.0, vaos: [passagem(0.6, 1.0), porta(4.0), passagem(5.6, 1.2)] },
  { x1: 1.6, z1: 1.0, x2: 1.6, z2: 4.0, vaos: [porta(1.6)] },
  { x1: 3.4, z1: 1.0, x2: 3.4, z2: 4.0, vaos: [passagem(1.8, 0.9)] },
];

export const COMODOS = [
  { nome: 'Quarto 01', obs: 'casal', x1: -5.2, z1: -4.0, x2: -1.8, z2: -0.2 },
  { nome: 'Quarto 02', obs: 'solteiro', x1: -1.8, z1: -4.0, x2: 0.8, z2: -0.2 },
  { nome: 'Banho', obs: 'social', x1: 0.8, z1: -4.0, x2: 2.4, z2: -0.2 },
  { nome: 'Quarto 03', obs: 'home office', x1: 2.4, z1: -4.0, x2: 5.2, z2: -0.2 },
  { nome: 'Circulação', obs: '', x1: -1.8, z1: -0.2, x2: 5.2, z2: 1.0 },
  { nome: 'Estar / Jantar', obs: 'integrado', x1: -5.2, z1: -0.2, x2: -1.8, z2: 4.0 },
  { nome: 'Cozinha', obs: '', x1: -1.8, z1: 1.0, x2: 1.6, z2: 4.0 },
  { nome: 'Serviço', obs: '', x1: 1.6, z1: 1.0, x2: 3.4, z2: 4.0 },
  { nome: 'Varanda', obs: 'coberta', x1: 3.4, z1: 1.0, x2: 5.2, z2: 4.0 },
];

/** área útil do cômodo, já descontando meia parede de cada lado */
export const area = (c: { x1: number; z1: number; x2: number; z2: number }) =>
  (Math.abs(c.x2 - c.x1) - ESP) * (Math.abs(c.z2 - c.z1) - ESP);

export const AREA_UTIL = COMODOS.reduce((s, c) => s + area(c), 0);
export const AREA_CONSTRUIDA = LARG * PROF;

export const m2 = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/* ---------------------------------------------------------------- */

export type Bloco = {
  cx: number; cy: number; cz: number;      // centro do bloco
  ax: number; az: number; bx: number; bz: number; // extremos em planta
  comp: number; esp: number; alt: number;  // dimensões
  ang: number;                             // rotação em torno de Y
  y0: number; y1: number;                  // base e topo
};

/**
 * Quebra a parede nos pedaços de alvenaria que sobram entre os vãos:
 * trecho cheio, peitoril (embaixo da janela) e verga (em cima do vão).
 * Em planta só interessam os pedaços de altura cheia; no 3D, todos.
 */
export function blocos(p: Parede, h = H, esp = ESP): Bloco[] {
  const dx = p.x2 - p.x1;
  const dz = p.z2 - p.z1;
  const L = Math.hypot(dx, dz);
  const ux = dx / L;
  const uz = dz / L;
  // rotação em Y: o +X local do box precisa apontar para (ux, uz)
  const ang = Math.atan2(-uz, ux);
  const em = (t: number) => [p.x1 + ux * t, p.z1 + uz * t] as const;

  const out: Bloco[] = [];
  const add = (t0: number, t1: number, y0: number, y1: number) => {
    if (t1 - t0 < 1e-4 || y1 - y0 < 1e-4) return;
    const [ax, az] = em(t0);
    const [bx, bz] = em(t1);
    out.push({
      cx: (ax + bx) / 2, cy: (y0 + y1) / 2, cz: (az + bz) / 2,
      ax, az, bx, bz,
      comp: t1 - t0, esp, alt: y1 - y0, ang, y0, y1,
    });
  };

  let t = 0;
  for (const v of [...(p.vaos ?? [])].sort((a, b) => a.at - b.at)) {
    add(t, v.at, 0, h);                  // alvenaria cheia
    add(v.at, v.at + v.larg, 0, v.y0);   // peitoril
    add(v.at, v.at + v.larg, v.y1, h);   // verga
    t = v.at + v.larg;
  }
  add(t, L, 0, h);
  return out;
}

export type VaoMundo = Vao & {
  ax: number; az: number; bx: number; bz: number;   // extremos do vão
  ux: number; uz: number; nx: number; nz: number;   // direção e normal
  ang: number;
};

/** vãos da parede em coordenadas de mundo — usado no arco de porta e nas esquadrias */
export function vaos(p: Parede): VaoMundo[] {
  const dx = p.x2 - p.x1;
  const dz = p.z2 - p.z1;
  const L = Math.hypot(dx, dz);
  const ux = dx / L;
  const uz = dz / L;
  const ang = Math.atan2(-uz, ux);
  return (p.vaos ?? []).map((v) => ({
    ...v,
    ax: p.x1 + ux * v.at, az: p.z1 + uz * v.at,
    bx: p.x1 + ux * (v.at + v.larg), bz: p.z1 + uz * (v.at + v.larg),
    ux, uz, nx: -uz, nz: ux, ang,
  }));
}

export const TODOS_BLOCOS = () => PAREDES.flatMap((p) => blocos(p));
export const TODOS_VAOS = () => PAREDES.flatMap((p) => vaos(p));

/* pontos de pilar: cantos e meio das faces do perímetro */
export const PILARES: [number, number][] = [
  [-5.2, -4.0], [-1.8, -4.0], [0.8, -4.0], [2.4, -4.0], [5.2, -4.0],
  [-5.2, -0.2], [-1.8, -0.2], [5.2, -0.2],
  [-5.2, 1.0], [-1.8, 1.0], [1.6, 1.0], [3.4, 1.0], [5.2, 1.0],
  [-5.2, 4.0], [-1.8, 4.0], [1.6, 4.0], [3.4, 4.0], [5.2, 4.0],
];

/*
  Etapas da obra — lidas pela cena 3D (para saber o que mostrar) e pela página
  (para saber o que escrever). `em` é o progresso de scroll em que a etapa entra.
*/
export const ETAPAS = [
  { em: 0.00, t: 'Locação da obra', d: 'O gabarito transfere a planta para o terreno. Cada eixo de parede vira uma linha de piquete e uma tábua corrida: é o momento em que o desenho vira medida real, com esquadro conferido nas diagonais.', det: 'Tolerância de locação: 1 cm em 10 m' },
  { em: 0.10, t: 'Fundação', d: 'Sapatas, baldrame e impermeabilização. A escolha do tipo de fundação sai da sondagem SPT do terreno, não do palpite do pedreiro — é o que a ABNT NBR 6122 exige e o que evita trinca em parede dois anos depois.', det: 'Sondagem SPT · ABNT NBR 6122' },
  { em: 0.24, t: 'Estrutura', d: 'Pilares e vigas em concreto armado, dimensionados por cálculo e não por semelhança. Fôrma, armação e concretagem seguem a prancha estrutural, com controle de fck por corpo de prova.', det: 'Concreto armado · ABNT NBR 6118' },
  { em: 0.38, t: 'Alvenaria', d: 'Vedação subindo fiada por fiada, com verga sobre todo vão e contraverga sob toda janela. Os dois elementos custam pouco e resolvem a trinca a 45° que aparece no canto das aberturas.', det: 'Verga e contraverga em 100% dos vãos' },
  { em: 0.56, t: 'Laje e vigas', d: 'Cinta de respaldo amarrando toda a alvenaria e laje pronta para receber a cobertura. É aqui que a casa deixa de ser um conjunto de paredes e passa a trabalhar como uma estrutura só.', det: 'Cinta de amarração em todo o perímetro' },
  { em: 0.66, t: 'Cobertura', d: 'Telhado de duas águas com 20° de inclinação e beiral de 60 cm. Inclinação e beiral não são estética: são o que joga a água para longe da fachada e mantém a alvenaria seca.', det: 'Inclinação 36% · beiral de 60 cm' },
  { em: 0.78, t: 'Esquadrias e instalações', d: 'Janelas, portas e todo o embutido: elétrica, hidráulica, esgoto e pontos de dados. Passa antes do reboco porque quebrar parede depois custa três vezes mais.', det: 'NBR 5410 · NBR 5626 · NBR 8160' },
  { em: 0.88, t: 'Acabamento e entrega', d: 'Reboco, pintura, piso, louças e metais. Fecha com vistoria assistida, manual do proprietário e o habite-se emitido pela prefeitura — a obra só termina no papel.', det: 'Vistoria assistida · habite-se · as built' },
] as const;

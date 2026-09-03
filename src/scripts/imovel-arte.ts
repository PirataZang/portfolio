/*
  As "fotos" dos imóveis — MERIDIANO IMÓVEIS.

  Não existe foto aqui: cada imóvel recebe quatro ilustrações geradas em SVG —
  fachada, sala, planta e vista. É a saída honesta para uma demo sem banco de
  imagens, e ela combina com a direção pedida (flat, arredondado, azul): um
  site de ilustração é uma escolha de design, uma foto de banco quebrada não é.

  Tudo sai de uma semente por imóvel, então o desenho é sempre o mesmo entre
  carregamentos e entre o servidor e o cliente — as funções rodam no build, no
  frontmatter da página, e o SVG vai no HTML. Custo zero no navegador.

  As cores entram por parâmetro porque o SVG é injetado com `set:html` e não
  herda as variáveis CSS do escopo da página.
*/

export type Paleta = {
  ceu: string;      // azul claro do fundo
  ceu2: string;     // azul um pouco mais fundo
  marinho: string;  // traço e vulto
  azul: string;     // azul de marca
  claro: string;    // superfície clara
  branco: string;
  verde: string;    // vegetação
};

export const PALETA: Paleta = {
  ceu: '#dcebfb',
  ceu2: '#bcd9f6',
  marinho: '#0b2a4a',
  azul: '#2b7fd4',
  claro: '#eff6fe',
  branco: '#ffffff',
  verde: '#8fc7a8',
};

/* gerador determinístico: o mesmo imóvel desenha igual sempre */
function semente(s: number) {
  let x = s | 0;
  return () => {
    x = (x + 0x6d2b79f5) | 0;
    let t = Math.imul(x ^ (x >>> 15), 1 | x);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function sementeDe(txt: string) {
  let h = 2166136261;
  for (const c of txt) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/*
  `slice` no lugar do `meet` padrão: o desenho preenche a caixa e é cortado nas
  sobras, em vez de encolher e deixar tarja. Todas as cenas foram desenhadas
  com margem folgada justamente para aguentar esse corte — a planta, que é a
  mais sensível, tem 13% de respiro em volta.
*/
const abrir = (id: string, p: Paleta) =>
  `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${id}">` +
  `<defs><linearGradient id="c-${id}" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0" stop-color="${p.ceu2}"/><stop offset="1" stop-color="${p.claro}"/></linearGradient></defs>`;

/* ────────────────────── 1. fachada ────────────────────── */
export function fachada(chave: string, tipo: string, p: Paleta = PALETA) {
  const r = semente(sementeDe(chave));
  const id = `f${sementeDe(chave) % 9999}`;
  const casa = tipo === 'Casa' || tipo === 'Sobrado';
  const andares = casa ? (tipo === 'Sobrado' ? 2 : 1) : 5 + Math.floor(r() * 6);

  let s = abrir(id, p);
  s += `<rect width="800" height="600" fill="url(#c-${id})"/>`;

  // sol e nuvens: as formas soltas que o brief pediu, aqui como céu
  s += `<circle cx="${640 + r() * 60}" cy="${90 + r() * 40}" r="46" fill="${p.branco}" opacity=".8"/>`;
  for (let i = 0; i < 3; i++) {
    const cx = 80 + r() * 620;
    const cy = 70 + r() * 90;
    s += `<g opacity=".7" fill="${p.branco}"><circle cx="${cx}" cy="${cy}" r="24"/>` +
      `<circle cx="${cx + 26}" cy="${cy + 6}" r="18"/><circle cx="${cx - 24}" cy="${cy + 8}" r="15"/></g>`;
  }

  // chão
  s += `<rect y="470" width="800" height="130" fill="${p.verde}" opacity=".5"/>`;
  s += `<rect y="470" width="800" height="8" fill="${p.verde}"/>`;

  if (casa) {
    const larg = 420;
    const x = (800 - larg) / 2;
    const alt = andares === 2 ? 250 : 165;
    const y = 470 - alt;
    // telhado
    s += `<path d="M ${x - 34} ${y} L 400 ${y - 96} L ${x + larg + 34} ${y} Z" fill="${p.marinho}"/>`;
    s += `<rect x="${x}" y="${y}" width="${larg}" height="${alt}" rx="18" fill="${p.branco}"/>`;
    s += `<rect x="${x}" y="${y}" width="${larg}" height="${alt}" rx="18" fill="none" stroke="${p.marinho}" stroke-width="4" opacity=".18"/>`;
    // porta e janelas
    s += `<rect x="370" y="${470 - 92}" width="62" height="92" rx="12" fill="${p.marinho}" opacity=".85"/>`;
    for (let a = 0; a < andares; a++) {
      const jy = y + 34 + a * (alt / andares);
      for (const jx of [x + 42, x + 300]) {
        s += `<rect x="${jx}" y="${jy}" width="78" height="62" rx="12" fill="${p.azul}" opacity=".8"/>`;
        s += `<rect x="${jx}" y="${jy}" width="78" height="62" rx="12" fill="none" stroke="${p.branco}" stroke-width="4"/>`;
      }
    }
  } else {
    const larg = 300;
    const x = (800 - larg) / 2;
    const altAndar = 62;
    const alt = andares * altAndar;
    const y = 470 - alt;
    // torre, com o topo arredondado — o "modelo arredondado" do brief
    s += `<rect x="${x}" y="${y}" width="${larg}" height="${alt}" rx="26" fill="${p.branco}"/>`;
    s += `<rect x="${x}" y="${y}" width="${larg}" height="${alt}" rx="26" fill="none" stroke="${p.marinho}" stroke-width="4" opacity=".18"/>`;
    // torre vizinha, para dar profundidade
    s += `<rect x="${x - 118}" y="${y + 78}" width="104" height="${alt - 78}" rx="20" fill="${p.claro}"/>`;
    s += `<rect x="${x + larg + 14}" y="${y + 118}" width="92" height="${alt - 118}" rx="20" fill="${p.claro}"/>`;
    for (let a = 0; a < andares; a++) {
      const jy = y + 18 + a * altAndar;
      for (let c = 0; c < 3; c++) {
        const jx = x + 26 + c * 88;
        const aceso = r() > 0.45;
        s += `<rect x="${jx}" y="${jy}" width="62" height="38" rx="10" fill="${aceso ? p.azul : p.ceu2}" opacity="${aceso ? 0.85 : 0.6}"/>`;
      }
    }
    // entrada
    s += `<rect x="368" y="${470 - 56}" width="64" height="56" rx="14" fill="${p.marinho}" opacity=".85"/>`;
  }

  // árvores
  for (const tx of [90, 720, 170]) {
    const th = 60 + r() * 40;
    s += `<rect x="${tx - 5}" y="${470 - th * 0.35}" width="10" height="${th * 0.35}" rx="5" fill="${p.marinho}" opacity=".5"/>`;
    s += `<circle cx="${tx}" cy="${470 - th * 0.35 - 26}" r="34" fill="${p.verde}"/>`;
  }
  return s + '</svg>';
}

/* ────────────────────── 2. sala ────────────────────── */
export function sala(chave: string, p: Paleta = PALETA) {
  const r = semente(sementeDe(chave) ^ 0x5a5a);
  const id = `s${sementeDe(chave) % 9999}`;

  let s = abrir(id, p);
  s += `<rect width="800" height="600" fill="${p.claro}"/>`;
  // piso
  s += `<rect y="420" width="800" height="180" fill="${p.ceu}"/>`;
  s += `<rect y="420" width="800" height="5" fill="${p.marinho}" opacity=".14"/>`;

  // janela grande com vista
  s += `<rect x="440" y="88" width="290" height="250" rx="24" fill="${p.ceu2}"/>`;
  s += `<rect x="440" y="88" width="290" height="250" rx="24" fill="none" stroke="${p.branco}" stroke-width="12"/>`;
  s += `<circle cx="${560 + r() * 90}" cy="160" r="26" fill="${p.branco}" opacity=".9"/>`;
  s += `<path d="M 452 300 q 60 -70 120 -22 q 50 -50 146 4 v 44 h -266 Z" fill="${p.verde}" opacity=".75"/>`;

  // sofá
  s += `<rect x="86" y="322" width="290" height="88" rx="26" fill="${p.azul}" opacity=".9"/>`;
  s += `<rect x="70" y="286" width="40" height="124" rx="20" fill="${p.azul}"/>`;
  s += `<rect x="352" y="286" width="40" height="124" rx="20" fill="${p.azul}"/>`;
  s += `<rect x="104" y="292" width="250" height="46" rx="20" fill="${p.azul}" opacity=".65"/>`;
  for (const ax of [140, 300]) {
    s += `<rect x="${ax}" y="300" width="52" height="42" rx="14" fill="${p.branco}" opacity=".8"/>`;
  }

  // tapete
  s += `<ellipse cx="300" cy="470" rx="210" ry="46" fill="${p.branco}" opacity=".85"/>`;
  // mesa de centro
  s += `<rect x="228" y="430" width="150" height="20" rx="10" fill="${p.marinho}" opacity=".8"/>`;
  s += `<rect x="248" y="450" width="12" height="30" rx="6" fill="${p.marinho}" opacity=".6"/>`;
  s += `<rect x="346" y="450" width="12" height="30" rx="6" fill="${p.marinho}" opacity=".6"/>`;

  // planta
  s += `<path d="M 700 420 l -18 -56 h 52 l -18 56 Z" fill="${p.marinho}" opacity=".75"/>`;
  s += `<circle cx="708" cy="334" r="30" fill="${p.verde}"/>`;
  s += `<circle cx="678" cy="356" r="22" fill="${p.verde}" opacity=".85"/>`;
  s += `<circle cx="738" cy="356" r="20" fill="${p.verde}" opacity=".85"/>`;

  // quadros na parede
  for (let i = 0; i < 2; i++) {
    s += `<rect x="${110 + i * 92}" y="${140 + i * 26}" width="72" height="${92 - i * 18}" rx="12" fill="${p.branco}"/>`;
    s += `<rect x="${110 + i * 92}" y="${140 + i * 26}" width="72" height="${92 - i * 18}" rx="12" fill="none" stroke="${p.marinho}" stroke-width="4" opacity=".3"/>`;
  }
  // luminária
  s += `<line x1="300" y1="60" x2="300" y2="128" stroke="${p.marinho}" stroke-width="4" opacity=".5"/>`;
  s += `<path d="M 264 128 h 72 l -18 34 h -36 Z" fill="${p.marinho}" opacity=".8"/>`;

  return s + '</svg>';
}

/* ────────────────────── 3. planta ────────────────────── */
export function planta(chave: string, quartos: number, p: Paleta = PALETA) {
  const id = `p${sementeDe(chave) % 9999}`;
  let s = abrir(id, p);
  s += `<rect width="800" height="600" fill="${p.branco}"/>`;

  // malha de fundo, como papel de projeto
  s += `<g stroke="${p.ceu2}" stroke-width="1" opacity=".7">`;
  for (let x = 0; x <= 800; x += 40) s += `<line x1="${x}" y1="0" x2="${x}" y2="600"/>`;
  for (let y = 0; y <= 600; y += 40) s += `<line x1="0" y1="${y}" x2="800" y2="${y}"/>`;
  s += '</g>';

  const X = 90, Y = 80, L = 620, A = 440;
  const parede = `fill="none" stroke="${p.marinho}" stroke-width="10" stroke-linejoin="round"`;
  s += `<rect x="${X}" y="${Y}" width="${L}" height="${A}" rx="18" fill="${p.claro}"/>`;
  s += `<rect x="${X}" y="${Y}" width="${L}" height="${A}" rx="18" ${parede}/>`;

  /*
    A divisão acompanha o número de quartos: a faixa de cima vira dormitórios
    em partes iguais, e a de baixo fica com social, cozinha e serviço. Assim a
    planta de um studio e a de um 3 dormitórios não são o mesmo desenho.
  */
  const meio = Y + A * 0.48;
  s += `<line x1="${X}" y1="${meio}" x2="${X + L}" y2="${meio}" stroke="${p.marinho}" stroke-width="8"/>`;

  const n = Math.max(1, quartos);
  const larg = L / n;
  const rotulo = (cx: number, cy: number, t: string, a: string) =>
    `<text x="${cx}" y="${cy}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="21" font-weight="600" fill="${p.marinho}">${t}</text>` +
    `<text x="${cx}" y="${cy + 24}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="17" fill="${p.azul}">${a}</text>`;

  for (let i = 0; i < n; i++) {
    const x0 = X + i * larg;
    if (i > 0) s += `<line x1="${x0}" y1="${Y}" x2="${x0}" y2="${meio}" stroke="${p.marinho}" stroke-width="8"/>`;
    const nome = n === 1 ? 'AMBIENTE ÚNICO' : i === 0 ? 'SUÍTE' : `DORM. ${i + 1}`;
    s += rotulo(x0 + larg / 2, Y + A * 0.24, nome, `${(9 + i * 1.6).toFixed(1)} m²`);
    // vão da porta na parede do meio
    s += `<line x1="${x0 + larg / 2 - 30}" y1="${meio}" x2="${x0 + larg / 2 + 30}" y2="${meio}" stroke="${p.claro}" stroke-width="10"/>`;
    s += `<path d="M ${x0 + larg / 2 - 30} ${meio} a 60 60 0 0 1 60 0" fill="none" stroke="${p.azul}" stroke-width="3"/>`;
  }

  // faixa de baixo: estar, cozinha e serviço
  const c1 = X + L * 0.44;
  const c2 = X + L * 0.74;
  s += `<line x1="${c1}" y1="${meio}" x2="${c1}" y2="${Y + A}" stroke="${p.marinho}" stroke-width="8"/>`;
  s += `<line x1="${c2}" y1="${meio}" x2="${c2}" y2="${Y + A}" stroke="${p.marinho}" stroke-width="8"/>`;
  s += rotulo((X + c1) / 2, meio + A * 0.26, 'ESTAR / JANTAR', '24,0 m²');
  s += rotulo((c1 + c2) / 2, meio + A * 0.26, 'COZINHA', '9,5 m²');
  s += rotulo((c2 + X + L) / 2, meio + A * 0.26, 'SERVIÇO', '4,2 m²');

  // varanda, colada na fachada
  s += `<rect x="${X}" y="${Y + A}" width="${L * 0.44 - 0}" height="54" rx="14" fill="${p.ceu}"/>`;
  s += `<rect x="${X}" y="${Y + A}" width="${L * 0.44}" height="54" rx="14" fill="none" stroke="${p.marinho}" stroke-width="6"/>`;
  s += `<text x="${X + L * 0.22}" y="${Y + A + 34}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="600" fill="${p.marinho}">VARANDA</text>`;

  // norte
  s += `<g transform="translate(722 118)"><circle r="26" fill="none" stroke="${p.azul}" stroke-width="2"/>` +
    `<path d="M 0 -18 L 8 8 L 0 3 L -8 8 Z" fill="${p.azul}"/>` +
    `<text y="-30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="16" fill="${p.azul}">N</text></g>`;

  return s + '</svg>';
}

/* ────────────────────── 4. vista ────────────────────── */
export function vista(chave: string, p: Paleta = PALETA) {
  const r = semente(sementeDe(chave) ^ 0x1234);
  const id = `v${sementeDe(chave) % 9999}`;

  let s = abrir(id, p);
  s += `<rect width="800" height="600" fill="url(#c-${id})"/>`;
  // sol
  s += `<circle cx="600" cy="150" r="58" fill="${p.branco}" opacity=".85"/>`;

  // silhueta da cidade, em três planos para dar profundidade
  const planos = [
    { y: 330, op: 0.18, l: 54 },
    { y: 380, op: 0.32, l: 66 },
    { y: 424, op: 0.55, l: 78 },
  ];
  for (const pl of planos) {
    let d = `M 0 600 L 0 ${pl.y}`;
    for (let x = 0; x < 800; x += pl.l) {
      const h = pl.y - (30 + r() * 110);
      d += ` L ${x} ${h} L ${x + pl.l} ${h}`;
    }
    d += ` L 800 600 Z`;
    s += `<path d="${d}" fill="${p.marinho}" opacity="${pl.op}"/>`;
  }

  // água
  s += `<rect y="500" width="800" height="100" fill="${p.azul}" opacity=".55"/>`;
  for (let i = 0; i < 7; i++) {
    const wy = 516 + i * 12;
    s += `<line x1="${40 + r() * 200}" y1="${wy}" x2="${240 + r() * 300}" y2="${wy}" stroke="${p.branco}" stroke-width="3" opacity=".5" stroke-linecap="round"/>`;
  }

  // moldura da janela: a vista é de dentro do imóvel
  s += `<rect x="26" y="26" width="748" height="548" rx="28" fill="none" stroke="${p.branco}" stroke-width="52"/>`;
  s += `<rect x="26" y="26" width="748" height="548" rx="28" fill="none" stroke="${p.marinho}" stroke-width="4" opacity=".12"/>`;

  return s + '</svg>';
}

/** as quatro vistas de um imóvel, na ordem em que o carrossel mostra */
export function galeria(chave: string, tipo: string, quartos: number) {
  return [
    { t: 'Fachada', svg: fachada(chave, tipo) },
    { t: 'Sala de estar', svg: sala(chave) },
    { t: 'Planta baixa', svg: planta(chave, quartos) },
    { t: 'Vista', svg: vista(chave) },
  ];
}

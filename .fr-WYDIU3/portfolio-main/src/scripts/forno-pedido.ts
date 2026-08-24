/*
  A matemática da sacola.

  Mora fora do .astro porque é a única parte da página que mexe com dinheiro,
  e dinheiro pede teste. O módulo é puro de propósito — sem DOM, sem
  localStorage — então roda no node direto:

      node src/scripts/forno-pedido.test.ts
*/

export type ItemCarta = { slug: string; nome: string; preco: number };
/* slug -> quantidade. Objeto e não Map porque vai e volta do localStorage. */
export type Sacola = Record<string, number>;
export type Modo = 'entrega' | 'retirada';

export const TAXA_ENTREGA = 9;
export const MINIMO_ENTREGA = 60;

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const brl = (n: number) => fmt.format(n);

export type Linha = {
  slug: string;
  nome: string;
  qtd: number;
  preco: number;
  total: number;
};

export function resumir(sacola: Sacola, carta: ItemCarta[], modo: Modo) {
  const porSlug = new Map(carta.map((i) => [i.slug, i]));
  const linhas: Linha[] = [];

  for (const [slug, qtd] of Object.entries(sacola)) {
    const item = porSlug.get(slug);
    /*
      Sacola velha no localStorage pode citar um prato que saiu da carta.
      Ignorar é a única saída honesta: cobrar zero por um prato é pior que
      esquecer o prato.
    */
    if (!item || !Number.isFinite(qtd) || qtd < 1) continue;
    const q = Math.min(20, Math.floor(qtd));
    linhas.push({ slug, nome: item.nome, qtd: q, preco: item.preco, total: item.preco * q });
  }

  const subtotal = linhas.reduce((s, l) => s + l.total, 0);
  const entrega = modo === 'entrega' && subtotal > 0;
  const faltaMinimo = entrega ? Math.max(0, MINIMO_ENTREGA - subtotal) : 0;
  const taxa = entrega ? TAXA_ENTREGA : 0;

  return {
    linhas,
    itens: linhas.reduce((s, l) => s + l.qtd, 0),
    subtotal,
    taxa,
    total: subtotal + taxa,
    faltaMinimo,
    podeEnviar: linhas.length > 0 && faltaMinimo === 0,
  };
}

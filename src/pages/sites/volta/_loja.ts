import type { Produto } from './_dados';

/*
VOLTA — o comportamento do catálogo.

Fica em módulo próprio porque a página é grande e porque a home importa o
mesmo `_dados.ts`: preço, estoque e numeração saem de um lugar só. Aqui
moram filtro, ficha em modal, sacola, frete por CEP e checkout.
*/
/*
  A loja inteira roda no navegador: filtro, modal, sacola, frete e checkout.
  O único pedido de rede é o ViaCEP no passo de entrega — e ele é opcional,
  porque os campos de endereço continuam editáveis se a consulta falhar.
*/
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SAIDA = [0.22, 0.61, 0.36, 1] as const;
const raiz = document.documentElement;
const FRETE_GRATIS = 399;

const leJson = <T,>(sel: string, padrao: T): T => {
  const el = document.querySelector(sel);
  try { return el ? JSON.parse(el.textContent ?? '') as T : padrao; } catch { return padrao; }
};
const PRODUTOS = leJson<Produto[]>('[data-produtos]', []);
const TABELA = leJson<{ br: number; cm: number }[]>('[data-tabela]', []);
/* comprimento do pé por numeração: é o número que a pessoa mede em casa */
const CM_POR_BR: Record<number, string> = Object.fromEntries(
  TABELA.map((t) => [t.br, t.cm.toFixed(1).replace('.', ',')]),
);
const NUMERACAO = leJson<Record<string, number[]>>('[data-numeracao]', { masculino: [], feminino: [] });
const acha = (id: string) => PRODUTOS.find((p) => p.id === id);

const brl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: n % 1 ? 2 : 0 });

/* ═════════════ 1. filtros da vitrine ═════════════ */

const estado = {
  genero: '',
  linha: new Set<string>(),
  tam: new Set<number>(),
  cor: new Set<string>(),
  faixa: new Set<string>(),
  ordem: 'destaque',
};
const FAIXAS: Record<string, [number, number]> = {
  ate450: [0, 450], '450a650': [450, 650], '650a800': [650, 800], acima800: [800, Infinity],
};
const grade = document.querySelector<HTMLElement>('[data-grade]');
const conta = document.querySelector<HTMLElement>('[data-conta]');
const vazio = document.querySelector<HTMLElement>('[data-vazio]');
const cartoes = [...document.querySelectorAll<HTMLElement>('[data-prod]')];

/* numeração marcada esconde quem não tem: é OU entre os números escolhidos */
const temAlgumNumero = (p: Produto) =>
  [...estado.tam].some((n) => (NUMERACAO[p.genero] ?? []).includes(n) && !p.esgotados.includes(n));

const naFaixa = (p: Produto) =>
  [...estado.faixa].some((id) => {
    const [min, max] = FAIXAS[id] ?? [0, Infinity];
    return p.preco >= min && p.preco < max;
  });

const cabe = (el: HTMLElement) => {
  const p = acha(el.dataset.prod!)!;
  if (estado.genero && p.genero !== estado.genero) return false;
  if (estado.linha.size && !estado.linha.has(p.linha)) return false;
  if (estado.cor.size && !estado.cor.has(p.cor)) return false;
  if (estado.faixa.size && !naFaixa(p)) return false;
  if (estado.tam.size && !temAlgumNumero(p)) return false;
  return true;
};

function aplicar(anima = true) {
  const visiveis = cartoes.filter(cabe);
  for (const el of cartoes) el.hidden = !visiveis.includes(el);

  /* ordenação mexe na ordem do DOM: `order` bastaria, mas quebra o Tab */
  const ordenados = [...visiveis].sort((a, b) => {
    if (estado.ordem === 'menor') return Number(a.dataset.preco) - Number(b.dataset.preco);
    if (estado.ordem === 'maior') return Number(b.dataset.preco) - Number(a.dataset.preco);
    if (estado.ordem === 'nome') return a.dataset.nome!.localeCompare(b.dataset.nome!, 'pt-BR');
    return cartoes.indexOf(a) - cartoes.indexOf(b);
  });
  for (const el of ordenados) grade?.append(el);

  if (conta) {
    conta.textContent = visiveis.length
      ? `${visiveis.length} ${visiveis.length === 1 ? 'modelo' : 'modelos'}`
      : '';
  }
  if (vazio) vazio.hidden = visiveis.length > 0;

  const mostrando = document.querySelector<HTMLElement>('[data-mostrando]');
  if (mostrando) mostrando.textContent = String(visiveis.length);
  pintarFichas();

  if (anima && !reduz) {
    for (const [i, el] of ordenados.entries()) {
      el.animate(
        [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 380, delay: Math.min(i * 26, 220), easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'backwards' },
      );
    }
  }
}

const rotulos: Record<string, (v: string) => string> = {
  genero: (v) => (v === 'masculino' ? 'Masculino' : 'Feminino'),
  linha: (v) => v,
  tam: (v) => `Nº ${v}`,
  cor: (v) => v,
  faixa: (v) => (document.querySelector<HTMLInputElement>(`[data-f="faixa"][value="${v}"]`)?.nextElementSibling?.textContent ?? v),
};

/* fichas dos filtros ativos: dá para tirar um sem procurar na lateral */
function pintarFichas() {
  const caixa = document.querySelector<HTMLElement>('[data-fichas]');
  const contaN = document.querySelector<HTMLElement>('[data-n-filtros]');
  if (!caixa) return;
  const ativos: { campo: string; valor: string }[] = [];
  if (estado.genero) ativos.push({ campo: 'genero', valor: estado.genero });
  for (const v of estado.linha) ativos.push({ campo: 'linha', valor: v });
  for (const v of estado.tam) ativos.push({ campo: 'tam', valor: String(v) });
  for (const v of estado.cor) ativos.push({ campo: 'cor', valor: v });
  for (const v of estado.faixa) ativos.push({ campo: 'faixa', valor: v });

  caixa.innerHTML = ativos
    .map((a) => `<li><button type="button" data-tira-f="${a.campo}" data-tira-v="${a.valor}">
      ${rotulos[a.campo](a.valor)} <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      <span class="sr">remover filtro</span></button></li>`)
    .join('');
  caixa.hidden = ativos.length === 0;

  if (contaN) { contaN.textContent = String(ativos.length); contaN.hidden = !ativos.length; }
  document.querySelectorAll<HTMLElement>('[data-limpar]').forEach((b) => {
    if (b.closest('[data-vazio]')) return;
    b.hidden = ativos.length === 0;
  });

  caixa.querySelectorAll<HTMLButtonElement>('[data-tira-f]').forEach((b) => {
    b.addEventListener('click', () => {
      const campo = b.dataset.tiraF!;
      const valor = b.dataset.tiraV!;
      if (campo === 'genero') {
        estado.genero = '';
        document.querySelector<HTMLInputElement>('[data-f="genero"][value=""]')!.checked = true;
      } else {
        const alvo = campo === 'tam' ? Number(valor) : valor;
        (estado[campo as 'linha'] as Set<unknown>).delete(alvo);
        const inp = document.querySelector<HTMLInputElement>(`[data-f="${campo}"][value="${valor}"]`);
        if (inp) inp.checked = false;
      }
      aplicar();
    });
  });
}

document.querySelectorAll<HTMLInputElement>('[data-f]').forEach((inp) => {
  inp.addEventListener('change', () => {
    const campo = inp.dataset.f!;
    if (campo === 'genero') {
      estado.genero = inp.value;
    } else {
      const conj = estado[campo as 'linha'] as Set<unknown>;
      const valor = campo === 'tam' ? Number(inp.value) : inp.value;
      if (inp.checked) conj.add(valor);
      else conj.delete(valor);
    }
    aplicar();
  });
});

document.querySelector<HTMLSelectElement>('[data-ordem]')?.addEventListener('change', (ev) => {
  estado.ordem = (ev.target as HTMLSelectElement).value;
  aplicar();
});

const limpar = () => {
  estado.genero = '';
  estado.linha.clear(); estado.tam.clear(); estado.cor.clear(); estado.faixa.clear();
  document.querySelectorAll<HTMLInputElement>('[data-f]').forEach((i) => {
    i.checked = i.type === 'radio' && i.value === '';
  });
  aplicar();
};
document.querySelectorAll('[data-limpar]').forEach((b) => b.addEventListener('click', limpar));

/* a lateral é gaveta no celular e coluna presa no desktop */
const lado = document.querySelector<HTMLElement>('[data-lado]');
document.querySelector('[data-abrir-lado]')?.addEventListener('click', () => lado?.setAttribute('data-aberto', ''));
document.querySelector('[data-fechar-lado]')?.addEventListener('click', () => lado?.removeAttribute('data-aberto'));

/* atalhos do topo e do rodapé caem no filtro certo e rolam até a vitrine */
/* atalhos do topo: "campo:valor", que já é a linguagem dos inputs da lateral */
document.querySelectorAll<HTMLElement>('[data-atalho]').forEach((b) => {
  b.addEventListener('click', () => {
    const [campo, valor] = b.dataset.atalho!.split(':');
    limpar();
    if (campo === 'genero') {
      estado.genero = valor;
      const inp = document.querySelector<HTMLInputElement>(`[data-f="genero"][value="${valor}"]`);
      if (inp) inp.checked = true;
    } else {
      (estado[campo as 'linha'] as Set<string>).add(valor);
      const inp = document.querySelector<HTMLInputElement>(`[data-f="${campo}"][value="${valor}"]`);
      if (inp) inp.checked = true;
    }
    aplicar();
    document.querySelector('#grade')?.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' });
  });
});

/* a home manda ?ver=<id> e o catálogo abre a ficha direto */
const pedido = new URLSearchParams(location.search);
aplicar(false);

/* ═════════════ 2. modal do produto ═════════════ */

const modal = document.querySelector<HTMLDialogElement>('[data-modal]');
const guia = document.querySelector<HTMLDialogElement>('[data-guia]');
const trilho = document.querySelector<HTMLElement>('[data-carr-trilho]');
const miniaturas = document.querySelector<HTMLElement>('[data-carr-mini]');

let atual: Produto | null = null;
let tamanho: number | null = null;
let foto = 0;

const irFoto = (n: number) => {
  if (!atual || !trilho) return;
  foto = (n + 3) % 3;
  trilho.style.translate = `${-foto * 100}% 0`;
  miniaturas?.querySelectorAll('button').forEach((b, i) => b.classList.toggle('ativo', i === foto));
};

function abrirProduto(id: string) {
  const p = acha(id);
  if (!p || !modal) return;
  atual = p;
  tamanho = null;
  foto = 0;

  const põe = (sel: string, v: string) => {
    const el = modal.querySelector<HTMLElement>(sel);
    if (el) el.textContent = v;
  };
  põe('[data-m-linha]', `${p.linha} · ${p.genero === 'masculino' ? 'Masculino' : 'Feminino'}`);
  põe('[data-m-nome]', p.nome);
  põe('[data-m-resumo]', p.resumo);
  põe('[data-m-preco]', brl(p.preco));
  põe('[data-m-parcela]', `10× de ${brl(p.preco / 10)} sem juros, ou ${brl(p.preco * 0.9)} no Pix`);
  põe('[data-m-cor]', p.cor);
  põe('[data-m-descricao]', p.descricao);

  const de = modal.querySelector<HTMLElement>('[data-m-de]');
  if (de) { de.textContent = p.de ? brl(p.de) : ''; de.hidden = !p.de; }
  modal.querySelector<HTMLElement>('[data-m-bola]')?.style.setProperty('--cor', p.corHex);

  const dest = modal.querySelector<HTMLElement>('[data-m-destaques]');
  if (dest) dest.innerHTML = p.destaques.map((d) => `<li>${d}</li>`).join('');

  const ficha = modal.querySelector<HTMLElement>('[data-m-ficha]');
  if (ficha) {
    ficha.innerHTML = Object.entries(p.ficha)
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
      .join('');
  }

  /* carrossel: três fotos, a primeira é o produto e as outras são detalhe */
  if (trilho) {
    trilho.style.translate = '0% 0';
    trilho.innerHTML = [1, 2, 3]
      .map((n) => `<picture>
          <source srcset="/img/volta/${p.id}-${n}.webp" type="image/webp" />
          <img src="/img/volta/${p.id}-${n}.jpg" alt="${p.nome}: ${n === 1 ? 'vista lateral' : n === 2 ? 'detalhe do cabedal' : 'detalhe da entressola'}" width="900" height="900" />
        </picture>`)
      .join('');
  }
  if (miniaturas) {
    miniaturas.innerHTML = [1, 2, 3]
      .map((n) => `<button type="button" class="${n === 1 ? 'ativo' : ''}" data-mini="${n - 1}" aria-label="Foto ${n}">
          <img src="/img/volta/${p.id}-${n}.jpg" alt="" width="900" height="900" />
        </button>`)
      .join('');
    miniaturas.querySelectorAll<HTMLButtonElement>('[data-mini]').forEach((b) => {
      b.addEventListener('click', () => irFoto(Number(b.dataset.mini)));
    });
  }

  põe('[data-m-calce]', '');
  const calce = modal.querySelector<HTMLElement>('[data-m-calce]');
  if (calce) {
    calce.innerHTML =
      p.calce === 'no tamanho'
        ? 'Este modelo <b>calça no tamanho</b>. Entre dois números, suba um.'
        : `Este modelo <b>calça ${p.calce}</b> — considere isso ao escolher.`;
  }

  const caixa = modal.querySelector<HTMLElement>('[data-m-tamanhos]');
  const avise = modal.querySelector<HTMLElement>('[data-avise]');
  if (avise) avise.hidden = true;
  modal.querySelector<HTMLElement>('[data-avise-feito]')!.hidden = true;

  if (caixa) {
    caixa.innerHTML = (NUMERACAO[p.genero] ?? [])
      .map((n) => {
        const fora = p.esgotados.includes(n);
        const cm = CM_POR_BR[n];
        return `<button type="button" data-tam="${n}" class="${fora ? 'fora' : ''}"
          aria-label="Numeração ${n}${fora ? ', esgotada' : `, pé de ${cm} cm`}">
          <b>${n}</b><small>${fora ? 'esgotado' : cm + ' cm'}</small>
        </button>`;
      })
      .join('');

    caixa.querySelectorAll<HTMLButtonElement>('[data-tam]').forEach((b) => {
      b.addEventListener('click', () => {
        const n = Number(b.dataset.tam);
        /* esgotado não seleciona: abre o aviso de reposição, que é o passo seguinte */
        if (b.classList.contains('fora')) {
          tamanho = null;
          caixa.querySelectorAll('button').forEach((o) => o.classList.remove('ativo'));
          if (avise) {
            avise.hidden = false;
            modal.querySelector<HTMLElement>('[data-avise-num]')!.textContent = `Nº ${n}`;
            modal.querySelector<HTMLElement>('[data-avise-feito]')!.hidden = true;
          }
          return;
        }
        tamanho = n;
        caixa.querySelectorAll('button').forEach((o) => o.classList.toggle('ativo', o === b));
        modal.querySelector<HTMLElement>('[data-tam-aviso]')!.hidden = true;
        if (avise) avise.hidden = true;
      });
    });
  }
  modal.querySelector<HTMLElement>('[data-tam-aviso]')!.hidden = true;

  modal.querySelector('.modal-info')?.scrollTo(0, 0);
  modal.showModal();
}

document.querySelectorAll<HTMLElement>('[data-abrir]').forEach((b) => {
  b.addEventListener('click', () => abrirProduto(b.dataset.abrir!));
});
if (pedido.get('ver') && acha(pedido.get('ver')!)) abrirProduto(pedido.get('ver')!);
document.querySelector('[data-fechar-modal]')?.addEventListener('click', () => modal?.close());
document.querySelector('[data-carr-ant]')?.addEventListener('click', () => irFoto(foto - 1));
document.querySelector('[data-carr-prox]')?.addEventListener('click', () => irFoto(foto + 1));
document.querySelector('[data-abrir-guia]')?.addEventListener('click', () => guia?.showModal());
document.querySelector('[data-fechar-guia]')?.addEventListener('click', () => guia?.close());

/* setas do teclado andam no carrossel enquanto o modal está aberto */
modal?.addEventListener('keydown', (ev) => {
  if (ev.key === 'ArrowRight') irFoto(foto + 1);
  if (ev.key === 'ArrowLeft') irFoto(foto - 1);
});

document.querySelector('[data-avise-ok]')?.addEventListener('click', () => {
  const campo = document.querySelector<HTMLInputElement>('[data-avise-email]');
  if (!campo?.value.includes('@')) { campo?.focus(); return; }
  document.querySelector<HTMLElement>('[data-avise-feito]')!.hidden = false;
  campo.value = '';
});

/* ═════════════ 3. sacola ═════════════ */

type Item = { id: string; nome: string; tam: number; preco: number; qtd: number };
const CHAVE = 'volta:sacola';

let sacola: Item[] = (() => {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? '[]') as Item[];
    return Array.isArray(v) ? v.filter((i) => i && typeof i.preco === 'number' && i.qtd > 0) : [];
  } catch { return []; }
})();
const guardar = () => {
  try { localStorage.setItem(CHAVE, JSON.stringify(sacola)); } catch { /* modo privado */ }
};

const gaveta = document.querySelector<HTMLDialogElement>('[data-carrinho]');
const cesta = document.querySelector<HTMLElement>('[data-cesta]');
const contador = document.querySelector<HTMLElement>('[data-carrinho-n]');
const btnFechar = document.querySelector<HTMLButtonElement>('[data-ir-entrega]');

let frete: { valor: number; prazo: string; uf: string } | null = null;
let pagamento: 'pix' | 'cartao' = 'pix';
let entrega: Record<string, string> = {};

const subtotal = () => sacola.reduce((s, i) => s + i.preco * i.qtd, 0);
const valorFrete = () => (subtotal() >= FRETE_GRATIS ? 0 : frete?.valor ?? 0);
const desconto = () => (pagamento === 'pix' ? (subtotal() + valorFrete()) * 0.1 : 0);
const total = () => subtotal() + valorFrete() - desconto();

function escrever() {
  const põe = (sel: string, v: string) =>
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => (el.textContent = v));
  põe('[data-subtotal]', brl(subtotal()));
  põe('[data-frete]', frete ? (valorFrete() === 0 ? 'Grátis' : brl(valorFrete())) : '—');
  põe('[data-total]', brl(subtotal() + valorFrete()));
  põe('[data-total-pag]', brl(total()));
  põe('[data-desconto]', `− ${brl(desconto())}`);
  const linhaDesc = document.querySelector<HTMLElement>('[data-linha-desconto]');
  if (linhaDesc) linhaDesc.hidden = pagamento !== 'pix';
}

function pintarSacola() {
  if (!cesta) return;
  cesta.innerHTML = sacola
    .map((i, n) => `<li>
      <img src="/img/volta/${i.id}-1.jpg" alt="" width="900" height="900" loading="lazy" />
      <div>
        <p class="cesta-nome">${i.nome}</p>
        <p class="cesta-meta">Numeração ${i.tam} · ${brl(i.preco)}</p>
        <div class="cesta-baixo">
          <button type="button" data-menos="${n}" aria-label="Menos um">−</button>
          <span class="cesta-q">${i.qtd}</span>
          <button type="button" data-mais="${n}" aria-label="Mais um">+</button>
          <button type="button" class="cesta-tira" data-tira="${n}">remover</button>
          <span class="cesta-v">${brl(i.preco * i.qtd)}</span>
        </div>
      </div>
    </li>`)
    .join('');

  const tem = sacola.length > 0;
  const vaziaEl = document.querySelector<HTMLElement>('[data-vazia]');
  if (vaziaEl) vaziaEl.hidden = tem;
  document.querySelector<HTMLElement>('[data-soma]')!.hidden = !tem;
  document.querySelector<HTMLElement>('[data-bloco-frete]')!.hidden = !tem;
  if (btnFechar) btnFechar.disabled = !tem;
  if (contador) {
    const pecas = sacola.reduce((s, i) => s + i.qtd, 0);
    contador.textContent = String(pecas);
    contador.hidden = !tem;
  }
  const falta = document.querySelector<HTMLElement>('[data-falta]');
  if (falta) {
    const resta = FRETE_GRATIS - subtotal();
    falta.hidden = !tem || resta <= 0;
    if (resta > 0) falta.textContent = `Faltam ${brl(resta)} para o frete sair de graça.`;
  }
  escrever();
  guardar();
}

cesta?.addEventListener('click', (ev) => {
  const b = (ev.target as HTMLElement).closest<HTMLElement>('[data-menos],[data-mais],[data-tira]');
  if (!b) return;
  const { menos, mais, tira } = b.dataset;
  const n = Number(menos ?? mais ?? tira);
  if (tira !== undefined) sacola.splice(n, 1);
  else if (mais !== undefined) sacola[n].qtd = Math.min(5, sacola[n].qtd + 1);
  else if (sacola[n].qtd > 1) sacola[n].qtd -= 1;
  else sacola.splice(n, 1);
  pintarSacola();
});

const abrirSacola = () => { irPara('itens'); gaveta?.showModal(); };
document.querySelectorAll('[data-abrir-carrinho]').forEach((b) => b.addEventListener('click', abrirSacola));
document.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', () => gaveta?.close()));

document.querySelector('[data-add]')?.addEventListener('click', () => {
  if (!atual) return;
  if (tamanho === null) {
    const aviso = modal?.querySelector<HTMLElement>('[data-tam-aviso]');
    if (aviso) aviso.hidden = false;
    modal?.querySelector<HTMLElement>('[data-m-tamanhos] button:not(:disabled)')?.focus();
    return;
  }
  /* mesmo modelo na mesma numeração soma, em vez de virar duas linhas */
  const existente = sacola.find((i) => i.id === atual!.id && i.tam === tamanho);
  if (existente) existente.qtd = Math.min(5, existente.qtd + 1);
  else sacola.push({ id: atual.id, nome: atual.nome, tam: tamanho, preco: atual.preco, qtd: 1 });
  pintarSacola();
  modal?.close();
  abrirSacola();
});

/* ═════════════ 4. frete e CEP ═════════════ */

const soDigitos = (v: string) => v.replace(/\D/g, '').slice(0, 8);
const mascaraCep = (v: string) => {
  const d = soDigitos(v);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

/*
  Tabela de frete por região, deduzida do primeiro dígito do CEP. É uma
  simplificação assumida: transportadora de verdade cobra por peso, cubagem
  e faixa de CEP, não por região inteira.
*/
const REGIAO: Record<string, { uf: string; valor: number; prazo: string }> = {
  '0': { uf: 'SP capital', valor: 19.9, prazo: '2 a 3 dias úteis' },
  '1': { uf: 'SP interior', valor: 24.9, prazo: '3 a 5 dias úteis' },
  '2': { uf: 'RJ e ES', valor: 27.9, prazo: '3 a 5 dias úteis' },
  '3': { uf: 'MG', valor: 29.9, prazo: '4 a 6 dias úteis' },
  '4': { uf: 'BA e SE', valor: 36.9, prazo: '6 a 9 dias úteis' },
  '5': { uf: 'PE, AL, PB e RN', valor: 39.9, prazo: '7 a 10 dias úteis' },
  '6': { uf: 'CE, PI, MA, PA, AM, AC, AP e RR', valor: 44.9, prazo: '8 a 12 dias úteis' },
  '7': { uf: 'DF, GO, TO, MT, MS e RO', valor: 34.9, prazo: '5 a 8 dias úteis' },
  '8': { uf: 'PR e SC', valor: 26.9, prazo: '3 a 5 dias úteis' },
  '9': { uf: 'RS', valor: 29.9, prazo: '4 a 7 dias úteis' },
};

function calcularFrete(cep: string) {
  const d = soDigitos(cep);
  if (d.length !== 8) return null;
  const r = REGIAO[d[0]];
  return r ? { valor: r.valor, prazo: r.prazo, uf: r.uf } : null;
}

const campoFrete = document.querySelector<HTMLInputElement>('[data-cep-frete]');
campoFrete?.addEventListener('input', () => { campoFrete.value = mascaraCep(campoFrete.value); });

document.querySelector('[data-calc-frete]')?.addEventListener('click', () => {
  const saida = document.querySelector<HTMLElement>('[data-frete-saida]');
  const r = calcularFrete(campoFrete?.value ?? '');
  if (!saida) return;
  if (!r) {
    saida.textContent = 'Digite os 8 dígitos do CEP.';
    saida.hidden = false;
    return;
  }
  frete = r;
  saida.textContent =
    subtotal() >= FRETE_GRATIS
      ? `${r.uf}: frete grátis, chega em ${r.prazo}.`
      : `${r.uf}: ${brl(r.valor)}, chega em ${r.prazo}.`;
  saida.hidden = false;
  escrever();
});

/* ═════════════ 5. checkout ═════════════ */

const passos = ['itens', 'entrega', 'pagamento', 'pronto'] as const;
function irPara(p: (typeof passos)[number]) {
  for (const nome of passos) {
    const el = document.querySelector<HTMLElement>(`[data-passo="${nome}"]`);
    if (el) el.hidden = nome !== p;
  }
}

btnFechar?.addEventListener('click', () => irPara('entrega'));
document.querySelector('[data-voltar-itens]')?.addEventListener('click', () => irPara('itens'));
document.querySelector('[data-voltar-entrega]')?.addEventListener('click', () => irPara('entrega'));

/*
  ViaCEP: preenche rua, bairro, cidade e UF a partir do CEP. Falha em silêncio
  de propósito — se a API não responder ou o CEP não existir, os campos ficam
  editáveis e a pessoa digita. Ninguém trava por causa de uma consulta.
*/
const campoCep = document.querySelector<HTMLInputElement>('[data-cep]');
const cepEstado = document.querySelector<HTMLElement>('[data-cep-estado]');
const preencher = (sel: string, v: string) => {
  const el = document.querySelector<HTMLInputElement>(sel);
  if (el) el.value = v;
};

campoCep?.addEventListener('input', async () => {
  campoCep.value = mascaraCep(campoCep.value);
  const d = soDigitos(campoCep.value);
  if (cepEstado) { cepEstado.textContent = ''; delete cepEstado.dataset.erro; }
  if (d.length !== 8) return;

  if (cepEstado) cepEstado.textContent = 'buscando…';
  try {
    const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    const j = await r.json();
    if (j.erro) throw new Error('cep');
    preencher('[data-c-rua]', j.logradouro ?? '');
    preencher('[data-c-bairro]', j.bairro ?? '');
    preencher('[data-c-cidade]', j.localidade ?? '');
    preencher('[data-c-uf]', j.uf ?? '');
    if (cepEstado) cepEstado.textContent = j.uf ?? '';
    const r2 = calcularFrete(d);
    if (r2) { frete = r2; escrever(); }
  } catch {
    if (cepEstado) { cepEstado.textContent = 'preencha à mão'; cepEstado.dataset.erro = '1'; }
  }
});

document.querySelector<HTMLFormElement>('[data-form-entrega]')?.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const d = new FormData(ev.target as HTMLFormElement);
  entrega = Object.fromEntries([...d.entries()].map(([k, v]) => [k, String(v).trim()]));
  if (!frete) {
    const r = calcularFrete(entrega.cep ?? '');
    if (r) frete = r;
  }
  const resumo = document.querySelector<HTMLElement>('[data-entrega-resumo]');
  if (resumo) {
    resumo.textContent =
      `${entrega.rua}, ${entrega.numero}${entrega.compl ? ' · ' + entrega.compl : ''} — ` +
      `${entrega.bairro}, ${entrega.cidade}/${entrega.uf} · CEP ${entrega.cep}` +
      (frete ? ` · entrega em ${frete.prazo}` : '');
  }
  escrever();
  irPara('pagamento');
});

document.querySelectorAll<HTMLButtonElement>('[data-pag]').forEach((b) => {
  b.addEventListener('click', () => {
    pagamento = b.dataset.pag as 'pix' | 'cartao';
    document.querySelectorAll('[data-pag]').forEach((o) => o.classList.toggle('ativo', o === b));
    escrever();
  });
});

document.querySelector('[data-pagar]')?.addEventListener('click', () => {
  if (!sacola.length) return;
  const n = 'VLT' + String(Math.floor(100000 + Math.random() * 899999));
  const põe = (sel: string, v: string) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) el.textContent = v;
  };
  põe('[data-pedido-n]', n);
  põe('[data-pronto-endereco]', `${entrega.rua ?? ''}, ${entrega.numero ?? ''} — ${entrega.cidade ?? ''}/${entrega.uf ?? ''}`);
  põe('[data-pronto-prazo]', frete?.prazo ?? '—');
  põe('[data-pronto-pag]', pagamento === 'pix' ? 'Pix, com 10% de desconto' : 'Cartão, em até 10× sem juros');
  põe('[data-pronto-total]', brl(total()));
  const lista = document.querySelector<HTMLElement>('[data-pronto-itens]');
  if (lista) lista.innerHTML = sacola.map((i) => `<li>${i.qtd}× ${i.nome} · nº ${i.tam}</li>`).join('');

  sacola = [];
  frete = null;
  pintarSacola();
  irPara('pronto');
});

pintarSacola();

/* ═════════════ 6. movimento ═════════════ */

async function ligarMovimento() {
  if (reduz) return;
  const { animate, inView, scroll, stagger } = await import('motion');

  const umaVez = (el: Element, efeito: () => void, opcoes?: Parameters<typeof inView>[2]) => {
    let parar = () => {};
    parar = inView(el, () => { efeito(); parar(); }, opcoes);
  };

  const barra = document.querySelector<HTMLElement>('[data-progresso]');
  if (barra) scroll(animate(barra, { scaleX: [0, 1] }, { ease: 'linear' }));

  const topo = document.querySelector<HTMLElement>('[data-topo]');
  if (topo) {
    const marcar = () => { topo.dataset.topo = scrollY > 12 ? 'rolou' : ''; };
    marcar();
    addEventListener('scroll', marcar, { passive: true });
  }

  animate(
    document.querySelectorAll('.heroi [data-anima]'),
    { opacity: [0, 1], y: [16, 0] },
    { duration: 0.7, delay: stagger(0.08), ease: SAIDA },
  );

  const grupos = new Map<Element, HTMLElement[]>();
  for (const el of document.querySelectorAll<HTMLElement>('[data-anima]')) {
    if (el.closest('.heroi')) continue;
    const pai = el.parentElement!;
    grupos.set(pai, [...(grupos.get(pai) ?? []), el]);
  }
  for (const irmaos of grupos.values()) {
    umaVez(
      irmaos[0],
      () => animate(irmaos, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, delay: stagger(0.07), ease: SAIDA }),
      { amount: 0.14, margin: '0px 0px -8% 0px' },
    );
  }

  /* a foto do herói sobe um pouco mais devagar que a página */
  const foto = document.querySelector<HTMLElement>('.heroi-foto');
  if (foto) scroll(animate(foto, { y: [0, 70], scale: [1.04, 1.1] }, { ease: 'linear' }), { target: foto });
}

const revelarTudo = () => raiz.classList.remove('anima-on');
const socorro = setTimeout(revelarTudo, 3000);
ligarMovimento().catch(revelarTudo).finally(() => clearTimeout(socorro));
if (reduz) revelarTudo();

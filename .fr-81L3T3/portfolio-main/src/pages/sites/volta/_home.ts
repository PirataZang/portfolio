/*
  VOLTA — o comportamento da home.

  Leve de propósito: aqui não há filtro nem sacola, só a revelação por scroll
  e o contador da sacola, lido do mesmo localStorage que o catálogo grava.
  Quem clica em qualquer coisa vai parar em /sites/volta/loja.
*/
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SAIDA = [0.22, 0.61, 0.36, 1] as const;
const raiz = document.documentElement;

/* o número da sacola vem da loja: a home só lê */
type Item = { qtd: number };
const contador = document.querySelector<HTMLElement>('[data-carrinho-n]');
if (contador) {
  try {
    const sacola = JSON.parse(localStorage.getItem('volta:sacola') ?? '[]') as Item[];
    const pecas = Array.isArray(sacola) ? sacola.reduce((s, i) => s + (i?.qtd ?? 0), 0) : 0;
    contador.textContent = String(pecas);
    contador.hidden = pecas === 0;
  } catch {
    /* modo privado ou dado corrompido: o contador simplesmente não aparece */
  }
}

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

  /* o herói entra sozinho, sem esperar inView: já está na primeira tela */
  animate(
    document.querySelectorAll('.palco [data-anima]'),
    { opacity: [0, 1], y: [16, 0] },
    { duration: 0.7, delay: stagger(0.08), ease: SAIDA },
  );

  const grupos = new Map<Element, HTMLElement[]>();
  for (const el of document.querySelectorAll<HTMLElement>('[data-anima]')) {
    if (el.closest('.palco')) continue;
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

  /* o nome gigante do fundo corre ao contrário da página; a cena afunda */
  const palco = document.querySelector<HTMLElement>('[data-palco]');
  const fundo = document.querySelector<HTMLElement>('[data-fundo]');
  const cena = document.querySelector<HTMLElement>('[data-cena]');
  if (palco && fundo) {
    scroll(animate(fundo, { x: ['-6%', '6%'], opacity: [1, 0.25] }, { ease: 'linear' }), { target: palco });
  }
  if (palco && cena) {
    scroll(animate(cena, { y: [0, 70], opacity: [1, 0.5] }, { ease: 'linear' }), { target: palco });
  }
}

const revelarTudo = () => raiz.classList.remove('anima-on');
const socorro = setTimeout(revelarTudo, 3000);
ligarMovimento().catch(revelarTudo).finally(() => clearTimeout(socorro));
if (reduz) revelarTudo();

# Product

<!-- impeccable:product-schema 1 -->

> Registro escrito sem rodada de perguntas, a pedido do dono ("faça tudo sem
> questionar"). Tudo aqui foi inferido de `design_models.md`, de
> `src/pages/index.astro` e dos briefs dados em conversa. Itens marcados
> *(inferido)* devem ser confirmados; dúvidas abertas ficam em `duvida.md`.

## Platform

web

## Users

- **Quem compra site** (dono de pequeno negócio local: barbearia, marmoraria,
  clínica, estética automotiva) abre o portfólio de Igor Fronza para decidir se
  contrata. Abre duas ou três demos e compara. *(inferido)*
- **Os visitantes fictícios de cada demo** (o cliente da barbearia, quem quer
  lavar o carro) são o público que cada site-modelo precisa convencer, porque é
  assim que o comprador julga se o site vende.

## Product Purpose

Portfólio de sites-modelo em Astro. Cada demo em `src/pages/sites/<slug>/`
prova que o autor projeta sites específicos para negócios diferentes, não um
template com troca de cor. Sucesso: o comprador abre duas demos e conclui que
foram feitas por pessoas diferentes para empresas diferentes, e sente vontade
de contratar.

## Positioning

Direção criativa humana por negócio: cada demo tem mundo visual, estrutura e
uma mecânica interativa que só ela tem (planta 3D, comparador de pedra,
ingresso com QR, pedido no WhatsApp).

## Operating Context

- Negócios locais brasileiros; o fechamento acontece no WhatsApp (link
  `wa.me` com mensagem pronta), não em checkout.
- Visitante das demos chega pelo celular na maioria das vezes. *(inferido)*

## Capabilities and Constraints

- Astro 7, Tailwind 4 disponível, Motion One (`motion`), Three.js, Font Awesome.
- Cada página é autocontida: fontes próprias do Google Fonts, CSS no próprio
  arquivo. `Base.astro` só fornece o `<head>`.
- Roda só via Docker (`docker compose up`, porta 4322); `npm install` no host
  falha.
- Toda demo nova entra em `DEMOS` no `src/pages/index.astro`.
- Contatos das demos são fictícios (`(99) 9999-9999`, `5599999999999`).

## Brand Commitments

- `design_models.md` é regra vinculante de criação (nenhuma demo parece
  variação de outra; sem fórmula de landing page; copy humana; sem métrica
  inventada; SEO local e JSON-LD obrigatórios).
- Paletas e seções pedidas pelo dono num brief são obrigatórias para aquela
  demo.

## Evidence on Hand

- Não há clientes, depoimentos ou números reais. Nenhuma demo inventa
  estatística sem contexto.
- Fotos vêm de bancos livres (Wikimedia, Pixabay, GeoDIL) e são creditadas no
  rodapé; nunca com marca de terceiro visível.

## Product Principles

1. O negócio define o design; a estrutura muda, não só a paleta.
2. A primeira tela vende; a ferramenta vem logo depois, num gesto.
3. Premium é espaço e contenção, não efeito.
4. Toda seção tem peso próprio; a página não cai depois do herói.
5. Medir no navegador antes de dar por pronto.

## Accessibility & Inclusion

Contraste adequado, foco visível, alvos de 44px, HTML semântico e respeito a
`prefers-reduced-motion` em toda demo (`design_models.md` §31).

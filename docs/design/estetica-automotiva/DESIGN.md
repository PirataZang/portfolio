---
name: Lâmina Estética Automotiva
description: O método do detalhista impresso como rótulo técnico de frasco profissional: produto, medida e tempo em cada superfície.
colors:
  papel: "#F0F2F2"
  tinta: "#144669"
  tinta-2: "#406884"
  tinta-funda: "#0F3A58"
  ceu: "#6AC5E0"
  agua: "#69BEDA"
  nevoa: "#B1BEC6"
typography:
  display:
    fontFamily: "'Sofia Sans Condensed', 'Sofia Sans', system-ui, sans-serif"
    fontSize: "clamp(2.7rem, 4.9vw, 5.1rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Sofia Sans Condensed', 'Sofia Sans', system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.4vw, 4.6rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Sofia Sans Condensed', 'Sofia Sans', system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Sofia Sans', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Sofia Sans Condensed', 'Sofia Sans', system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.12em"
  measure:
    fontFamily: "'Martian Mono', ui-monospace, monospace"
    fontSize: "0.86em"
    fontWeight: 400
    letterSpacing: "-0.01em"
    fontFeature: "'tnum' 1"
rounded:
  chip: "10px"
  ctrl: "12px"
  janela: "18px"
  rotulo: "28px"
  slab: "clamp(22px, 3vw, 40px)"
spacing:
  margem: "clamp(16px, 4vw, 56px)"
  faixa: "clamp(16px, 2.2vw, 28px)"
  secao: "clamp(96px, 12vw, 176px)"
  largura: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.ctrl}"
    padding: "0 1.4rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.tinta-funda}"
    textColor: "{colors.papel}"
  input-field:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    typography: "{typography.body}"
    rounded: "{rounded.ctrl}"
    padding: "0.8rem 1rem"
    height: "52px"
  chip:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.chip}"
    height: "48px"
  chip-selected:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
  label-strip:
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    padding: "0.8rem clamp(16px, 2.2vw, 28px)"
  nav-ruler-link:
    textColor: "{colors.tinta-2}"
    padding: "0 clamp(12px, 1.6vw, 26px) 6px"
---

# Design System: Lâmina Estética Automotiva

> Sistema local desta demo (`src/pages/sites/estetica-automotiva/index.astro`). O
> portfólio proíbe sistema visual compartilhado (`design_models.md`): nada daqui
> vale para outra demo.

## Overview

**Creative North Star: "O Rótulo de Diluição"**

A página inteira é um rótulo técnico de frasco profissional. Em vez de prometer brilho, ela mostra o método: cada superfície com o seu produto, a sua medida e o seu tempo de contato. A primeira dobra é um rótulo inteiro (faixa, corpo, pé), as fotos são vistas por janelas graduadas como a faixa transparente de um frasco, o cabeçalho é uma régua cujo nível azul enche com a rolagem, e os números com unidade (20 ml/L, 15 mm, 5 min) são a tipografia que se repete.

O papel é claro e frio, a tinta é marinho. Existem só dois campos de cor cheios: o rótulo invertido dos produtos (placa marinho recuada) e o agendamento (faixa inteira em céu, encostando no rodapé marinho). Densidade de ficha técnica nos campos em linha, respiro generoso entre seções. Movimento só de opacidade.

A recusa é a do próprio padrão da categoria: nada de carro brilhando em fundo escuro, faísca, neon ou preto de interface. Carro escuro pode aparecer na foto, sempre em garagem clara.

**Key Characteristics:**
- Rótulo com faixa superior, campos em linha e pé em colunas divididas por fio.
- Fio marinho de 1.5px como estrutura; névoa em 1px como divisão interna.
- Graduação (traço maior + traço menor) como assinatura: régua do cabeçalho, janela de foto, base da prateleira, topo do rodapé.
- Título condensado e apertado; corpo em Sofia Sans; mono só para valor com unidade.
- Plano: nenhuma sombra de elevação.

## Colors

Paleta fria de cinco tintas do cliente mais dois tons derivados do marinho; sem preto, sem degradê.

### Primary
- **Marinho de Rótulo** (tinta): toda a tinta de texto e estrutura sobre papel, fios de 1.5px, botões, chip selecionado, fundo da placa de produtos e do rodapé.
- **Marinho Fundo** (tinta-funda): exclusivamente o hover de botões cheios (botão principal e WhatsApp do cabeçalho). Não é cor de superfície nem de texto.

### Secondary
- **Céu de Nível** (ceu): o nível que enche a régua, o campo inteiro do agendamento, a cor de seleção de texto, e texto de destaque apenas sobre marinho (categoria do produto, títulos do rodapé, links claros, símbolo da marca no rodapé).
- **Água de Hover** (agua): só o estado de hover sobre marinho: fundo e contorno do ícone social e cor do link claro. Nunca estado de repouso, nunca sobre papel.

### Neutral
- **Papel Frio** (papel): fundo da página, fundo de campos, chips e prévia dentro do céu; texto sobre marinho.
- **Marinho Secundário** (tinta-2): texto secundário sobre papel (lides de seção, `dt`, cabeçalho de tabela, links inativos da régua, placeholder). Marinho a ~80% sobre o papel, mantido acima de 5:1.
- **Névoa de Fio** (nevoa): fios internos de 1px, traço menor da graduação, fundo de janela antes da foto carregar, e texto secundário sobre marinho. Sobre marinho os fios usam névoa a 40% misturada ao marinho.

### Named Rules
**A Regra das Tintas do Cliente.** Só papel, marinho, céu, água e névoa, mais os dois derivados do marinho. Sem preto, sem cinza neutro, sem degradê de cor; `repeating-linear-gradient` aparece só com paradas duras, para desenhar traços de graduação.

**A Regra do Céu como Nível.** O céu é campo ou nível, nunca texto sobre papel. Como texto, só sobre marinho.

**A Regra dos Dois Campos.** A página tem dois campos de cor cheios: a placa marinho recuada dos produtos e a faixa céu de ponta a ponta do agendamento, que encosta direto no rodapé marinho. Nada mais ganha fundo cheio.

## Typography

**Display Font:** Sofia Sans Condensed (com Sofia Sans, system-ui)
**Body Font:** Sofia Sans (com system-ui)
**Label/Mono Font:** Martian Mono (com ui-monospace), só para medida

**Character:** Condensada apertada nos títulos e nos rótulos em caixa-alta, como a impressão de um frasco; Sofia Sans larga e calma no corpo; Martian Mono tabular como a coluna de valores de uma ficha técnica.

### Hierarchy
- **Display** (600, clamp(2.7rem, 4.9vw, 5.1rem), 0.94): o título da primeira dobra, com `text-wrap: balance`, seguido do assunto em Sofia Sans 500 1rem em marinho secundário.
- **Headline** (600, clamp(2.4rem, 5.4vw, 4.6rem), 0.94–0.95): títulos de seção; Sobre e Agendar sobem o teto para 5.2rem e 5rem.
- **Title** (600, 1.2–1.9rem, 1.05–1.2, -0.01em): serviço na etiqueta da foto, nome do produto (clamp(1.45rem, 2.2vw, 1.9rem)), etapa da receita (1.2rem).
- **Body** (400, 1.0625rem, 1.6): texto corrido; lides de seção a 1.08rem em no máximo 40–46ch; parágrafo de abertura do Sobre a 1.28rem/1.5.
- **Label** (600, 0.72rem, 0.12em, caixa-alta): nomes de campo do rótulo (`dt`, cabeçalho da tabela, categoria do produto, faixa da prévia, títulos do rodapé). A faixa do rótulo e o título da receita usam 0.8rem; rótulos de formulário 700 a 0.76rem.
- **Measure** (Martian Mono 400/500, 0.86em, -0.01em, tabular, sem quebra): valores com unidade; no valor do produto sobe para clamp(1.05rem, 1.5vw, 1.3rem) 500.

A marca é Sofia Sans Condensed 700 (1.55rem no cabeçalho; clamp(4.2rem, 13vw, 11rem)/0.8 no rodapé, com o símbolo em céu).

### Named Rules
**A Regra da Medida.** Mono só para número com unidade (ml/L, min, mm, h, anos, %, g/m², dias, horas do relógio). Valor sem unidade ("3800", "puro", "3 em 1", "camada fina") sai em condensada, nunca em mono.

**A Regra do Campo Nomeado.** Caixa-alta espaçada existe só como nome de campo de um rótulo (o `dt` antes do `dd`, o cabeçalho de coluna, a faixa). Nunca como sobretítulo acima de um título de seção.

## Layout

Conteúdo em até 1320px mais a margem lateral fluida; todas as faixas internas (rótulo, receita, pé) usam o mesmo recuo clamp(16px, 2.2vw, 28px). Seções separadas por clamp(96px, 12vw, 176px).

- **Primeira dobra:** um rótulo com borda de 1.5px e raio 28px. Corpo em grade 1.35fr / 1fr: janela de foto à esquerda (min(66vh, 660px)), título, lide e ações à direita, alinhados ao pé. Pé em quatro colunas divididas por fio névoa.
- **Cabeçalho de seção:** título à esquerda, parágrafo à direita, ambos alinhados pela base (grade 1fr 1fr, `align-items: end`).
- **Prateleira:** três janelas de alturas diferentes (3/4.1, 3/3.3, 3/3.75) em 1.1fr 1fr 1fr, apoiadas pela base num fio graduado.
- **Sobre:** foto 5fr, texto 7fr (máx. 60ch); depois a receita como rótulo-tabela.
- **Produtos:** placa marinho recuada (raio clamp(22px, 3vw, 40px)), lista em linhas de quatro colunas (categoria 9rem, nome, descrição, valor à direita 11rem).
- **Agendar:** faixa céu de ponta a ponta; campos à esquerda, prévia e botão à direita em coluna fixa (`sticky`, top 100px).
- **Rodapé:** marinho de ponta a ponta, abre com a graduação do cabeçalho.

Responsivo: abaixo de 900px tudo vira uma coluna, a régua some e entra o botão Menu, o pé do rótulo vai para 2×2, a receita vira ficha por etapa (sem rolagem lateral), os três frascos ficam em larguras alternadas (88%, 78% à direita, 84%). Abaixo de 1100px a linha do produto quebra em nome + valor. Cabeçalho fixo de 68px (60px no celular).

## Elevation & Depth

Sistema plano. Não há sombra de elevação em lugar nenhum. A profundidade vem do fio marinho de 1.5px que desenha rótulos e controles, dos campos de cor cheios (placa marinho, faixa céu) e do aninhamento de raios. A única translucidez é o cabeçalho fixo: papel a 94% com `backdrop-filter: saturate(1.2) blur(10px)`. `box-shadow` aparece só como anel de foco de 3px nos campos.

### Named Rules
**A Regra do Fio, não da Sombra.** Separação é fio (1.5px marinho para contorno, 1px névoa para divisão interna), nunca sombra.

## Shapes

Cantos arredondados em escala aninhada, do maior contêiner ao menor controle: rótulo 28px (22px no celular), janela de foto 18px, controle 12px, chip 10px. A placa de produtos tem raio fluido de 22 a 40px. A legenda sobre a foto do herói usa 8px. Nada é pílula, nada é canto vivo.

A graduação é a forma recorrente: traço maior de 1.5px a cada 60–80px e traço menor de 1px a cada 8–16px, desenhados com `repeating-linear-gradient` de paradas duras. O símbolo da marca é um arco de nível sobre uma linha de base, em traço de 2px com ponta arredondada.

### Named Rules
**A Regra do Raio Aninhado.** Quem está dentro tem raio menor que quem contém: 28 > 18 > 12 > 10.

## Components

### Buttons
Sólidos, diretos, sem enfeite.
- **Shape:** controle (12px), altura mínima 52px.
- **Primary:** marinho com texto papel, Sofia Sans 600 1.02rem, padding horizontal 1.4rem; o ícone do botão desce 2px no hover.
- **Hover / Focus:** fundo passa a Marinho Fundo em .25s; `:active` desce 1px; foco em contorno marinho de 2px com afastamento de 3px.
- **Enviar:** mesma forma, 56px de altura e 1.6rem de padding, com a marca do WhatsApp; ocupa a largura toda no celular.
- **Ghost (Menu):** contorno de 1.5px marinho, fundo transparente, 44px.
- **Link com fio:** texto 600 com fio de 1.5px a 10px da base que recolhe da esquerda para a direita no hover (.35s, ease-out forte), seguido de uma seta em SVG desenhada para o projeto (máscara CSS em currentColor, traço 1.6, pontas redondas) que avança 3px no hover; em céu sobre marinho, passando a água no hover. O link "Voltar ao portfólio" usa a mesma seta, antes do texto.
- **Ícones:** setas e alerta são SVG desenhados para o projeto, aplicados como máscara em currentColor; marcas de redes e a seta do botão vêm do Font Awesome. Nunca caractere de texto como ícone.

### Chips (horário)
Rádios temáticos para dia e hora de entrada.
- **Style:** fundo papel, contorno 1.5px marinho, raio 10px, 48px de altura (58px no chip de dia). O dia mostra o nome da semana em condensada 600 e a data em mono; a hora mostra só o relógio em mono.
- **State:** hover mistura 10% de marinho no papel; selecionado vira marinho com texto papel; indisponível fica tracejado, riscado e a 55%; grupo inválido tracejado. Foco como o dos botões.
- Dias em 6 colunas (3 no celular), horas em 5.

### Cards / Containers (o rótulo)
- **Corner Style:** rótulo (28px).
- **Background:** papel, sem preenchimento.
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Border:** 1.5px marinho; faixa superior e pé separados por fio de 1.5px; colunas do pé por fio névoa de 1px.
- **Internal Padding:** o recuo de faixa, clamp(16px, 2.2vw, 28px). A receita usa o mesmo contêiner com uma tabela no corpo.

### Inputs / Fields
- **Style:** fundo papel sobre o céu, contorno 1.5px marinho, raio 12px, 52px de altura, Sofia Sans 500 1rem; placeholder em marinho secundário.
- **Focus:** anel sólido de 3px em marinho (`box-shadow`), sem contorno do navegador.
- **Error:** anel de 3px e contorno tracejado; mensagem em 600 0.9rem com ícone de alerta em SVG, sem vermelho: o erro fica no marinho do sistema.

### Navigation (a régua)
- Links em Sofia Sans 500 0.98rem, marinho secundário; atual (`aria-current`) em marinho 600. Cada link tem um traço maior de 12px sob o centro, apoiado na escala.
- A escala tem 6px: fio de 1.5px marinho em cima, traço menor névoa a cada 8px, e o nível céu que cresce com `scaleX` até o traço da seção atual, com um menisco marinho de 2px na ponta.
- Celular: botão Menu com contorno; menu em lista de condensada 600 1.6rem com fio névoa, a seção atual marcada por um traço céu de 40×4px.

### Janela de foto (assinatura)
Foto recortada em raio 18px sobre fundo névoa, com uma graduação em papel a 75% junto à borda direita (traço maior a cada 60px, menor a cada 12px). Toda foto e o mapa do rodapé passam por ela.

### Linha de produto
Rótulo invertido: categoria em label céu, nome em title papel com a marca em névoa, descrição em névoa (máx. 52ch), valor à direita em mono papel (ou em condensada, se não tiver unidade) com a legenda do valor em névoa.

### Prévia da mensagem
Etiqueta de serviço em papel dentro do campo céu: contorno 1.5px marinho, faixa superior em label. Trecho vazio em marinho secundário com tracejado névoa; trecho preenchido em 600 sobre céu a 35%.

## Do's and Don'ts

### Do:
- **Do** desenhar qualquer contêiner novo como rótulo: contorno 1.5px marinho, faixa superior em label, recuo clamp(16px, 2.2vw, 28px).
- **Do** passar toda foto pela janela graduada de 18px.
- **Do** escrever valores com unidade em Martian Mono tabular e valores sem unidade em condensada.
- **Do** usar o céu como nível ou campo; como texto, só sobre marinho.
- **Do** manter o movimento em opacidade (1.1s, cubic-bezier(0.16, 1, 0.3, 1), passo por lista) e desligá-lo com `prefers-reduced-motion`.
- **Do** manter alvos de toque de 44px ou mais.

### Don't:
- **Don't** usar preto, cinza neutro ou degradê de cor na interface.
- **Don't** colocar carro em fundo escuro, faísca, neon ou brilho como efeito.
- **Don't** usar sombra de elevação; separação é fio.
- **Don't** pôr sobretítulo em caixa-alta acima de título de seção; caixa-alta espaçada é só nome de campo.
- **Don't** usar mono para número sem unidade, nem para texto corrido.
- **Don't** criar um terceiro campo de cor cheio além da placa de produtos e da faixa de agendamento.
- **Don't** usar Marinho Fundo fora do hover de botão.

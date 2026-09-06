# DESIGN_[MODELOS.md](http://MODELOS.md)

# Direção Criativa dos Modelos de Sites do Portfólio

> **Este documento é uma regra de criação, não um template.**
>
> Cada site deste portfólio deve possuir uma identidade própria, uma composição própria, uma personalidade própria e uma lógica visual própria.
>
> **NENHUM modelo deve parecer uma variação de outro.**

---

# 01 — PROPÓSITO

Este portfólio apresenta diferentes possibilidades de sites profissionais desenvolvidos para diferentes tipos de empresas.

Os modelos não devem parecer páginas derivadas de um mesmo template.

Eles devem demonstrar capacidade de:

- interpretar diferentes negócios;
- criar identidades digitais distintas;
- construir experiências específicas;
- trabalhar diferentes linguagens visuais;
- criar layouts personalizados;
- adaptar a interface ao contexto da empresa;
- criar personalidade através de design;
- tomar decisões de design intencionais.

O visitante deve conseguir entrar em dois modelos diferentes e pensar:

> "Esses dois sites foram projetados por pessoas diferentes para empresas completamente diferentes."

Mesmo que tenham sido desenvolvidos pelo mesmo profissional.

---

# 02 — REGRA ABSOLUTA

## TODOS OS MODELOS DEVEM SER DIFERENTES.

Não basta mudar:

- cores;
- fontes;
- imagens;
- textos;
- bordas;
- ícones.

Isso **não cria um novo design**.

Se a estrutura continuar sendo:

```text
Navbar
↓
Hero
↓
3 cards
↓
Números
↓
Seção em 2 colunas
↓
4 cards
↓
CTA
↓
Footer

```

então o modelo continua sendo essencialmente o mesmo.

### Isso é PROIBIDO.

Cada modelo deve partir de uma pergunta diferente:

> "Como esta empresa deveria se apresentar digitalmente?"

e não:

> "Como posso adaptar meu template para esta empresa?"

---

# 03 — NÃO EXISTE TEMPLATE VISUAL GLOBAL

Não criar:

- Hero padrão;
- Navbar padrão;
- Card padrão;
- seção padrão;
- CTA padrão;
- Footer padrão;
- grid padrão;
- animação padrão;
- espaçamento padrão;
- composição padrão.

Componentes reutilizáveis podem existir **tecnicamente no código**.

Mas a aparência deles não deve obrigatoriamente ser reutilizada.

---

# 04 — REUTILIZAÇÃO TÉCNICA ≠ REUTILIZAÇÃO VISUAL

É permitido compartilhar:

- componentes;
- utilitários;
- hooks;
- funções;
- tokens técnicos;
- bibliotecas;
- infraestrutura;
- animações auxiliares;
- componentes de acessibilidade.

Porém:

**não reutilizar automaticamente a mesma linguagem visual.**

Exemplo:

É permitido possuir um componente:

```tsx
<Button />

```

Mas não significa que todos os sites precisam possuir:

- o mesmo formato;
- o mesmo tamanho;
- o mesmo radius;
- o mesmo hover;
- o mesmo posicionamento;
- a mesma tipografia;
- a mesma animação.

O componente deve ser adaptado à identidade daquele modelo.

---

# 05 — CADA MODELO PRECISA DE UMA PERSONALIDADE

Antes de escrever código, definir mentalmente:

### Quem é essa empresa?

### Quem é o cliente dela?

### O que ela vende?

### Como ela quer ser percebida?

### Qual sensação o site deve transmitir?

Exemplos de direções possíveis:

- sofisticado;
- artesanal;
- técnico;
- urbano;
- jovem;
- tradicional;
- experimental;
- acolhedor;
- industrial;
- minimalista;
- editorial;
- ousado;
- institucional;
- artístico;
- tecnológico;
- elegante;
- descontraído.

Mas isso não significa simplesmente escolher uma palavra.

A personalidade deve aparecer na:

- tipografia;
- composição;
- fotografia;
- espaçamento;
- cores;
- interação;
- linguagem;
- ritmo;
- arquitetura da página.

---

# 06 — O NEGÓCIO DEFINE O DESIGN

Não começar pelo layout.

Começar pelo negócio.

Um escritório de arquitetura não deve possuir a mesma abordagem de:

- uma imobiliária;
- uma oficina;
- um restaurante;
- uma clínica;
- uma construtora;
- uma agência;
- uma loja;
- uma empresa de tecnologia.

Mesmo que todos tenham páginas bonitas.

O design deve nascer do contexto.

---

# 07 — PROIBIDO USAR A "FÓRMULA DE LANDING PAGE"

Evitar automaticamente:

```text
Navbar
Hero gigante
Headline emocional
CTA
Logos
3 benefícios
3 cards
Estatísticas
Depoimentos
Processo em 4 passos
CTA gigante
Footer

```

Essa estrutura é extremamente previsível.

Ela só deve existir quando fizer sentido para aquele negócio.

---

# 08 — NÃO PREENCHER A PÁGINA

Não criar seções simplesmente porque:

> "Uma landing page precisa ter bastante conteúdo."

Não.

Uma página pode possuir:

- 5 seções;
- 7 seções;
- 10 seções;
- 3 seções.

A quantidade deve ser determinada pela necessidade do negócio.

### Regra:

Se uma seção não possui uma função clara:

**não existe motivo para ela existir.**

---

# 09 — CADA PÁGINA DEVE TER UM RITMO PRÓPRIO

Não fazer todas as páginas seguirem:

```text
bloco grande
bloco grande
bloco grande
bloco grande

```

Criar ritmo.

Uma página pode possuir:

```text
imagem dominante
↓
texto curto
↓
galeria
↓
bloco extremamente compacto
↓
seção aberta
↓
informações
↓
CTA

```

Outra pode possuir:

```text
hero editorial
↓
produto
↓
comparação
↓
depoimentos
↓
história

```

Outra:

```text
hero assimétrico
↓
portfólio
↓
manifesto
↓
processo
↓
contato

```

Não existe uma ordem universal.

---

# 10 — DESIGN ORGÂNICO

"Orgânico" não significa colocar elementos aleatórios.

Significa permitir que o conteúdo determine a composição.

O layout não precisa parecer construído sobre uma grade rígida o tempo inteiro.

Utilizar:

- assimetria;
- sobreposição;
- diferentes proporções;
- imagens grandes;
- espaços vazios;
- elementos deslocados;
- blocos de tamanhos diferentes;
- textos com comprimentos variados;
- mudanças de ritmo.

Mas tudo deve parecer intencional.

---

# 11 — IMPERFEIÇÃO CONTROLADA

Design humano possui decisões.

Nem tudo precisa estar matematicamente distribuído.

É permitido utilizar:

- uma imagem maior que outra;
- uma seção assimétrica;
- um título quebrado de maneira interessante;
- um elemento parcialmente sobreposto;
- uma informação deslocada;
- uma composição que foge do grid;
- espaços negativos inesperados.

### Mas:

Não adicionar aleatoriedade apenas para parecer criativo.

A pergunta sempre deve ser:

> "Por que isso está aqui?"

Se não houver resposta:

**remover.**

---

# 12 — CADA MODELO DEVE POSSUIR UMA "ASSINATURA"

Cada site deve possuir pelo menos **1 ou 2 características visuais facilmente reconhecíveis**.

Exemplos:

- uma maneira específica de tratar fotografias;
- uma tipografia muito característica;
- navegação incomum;
- composição editorial;
- uso específico de linhas;
- sistema de etiquetas;
- interação diferenciada;
- forma particular de apresentar números;
- tratamento único das imagens;
- seção que foge completamente do padrão;
- sistema de navegação próprio;
- composição assimétrica.

O visitante deve conseguir reconhecer:

> "Esse é aquele modelo."

---

# 13 — NÃO COPIAR A MESMA SOLUÇÃO

Se um modelo utilizou:

### Imagens grandes + texto lateral

o próximo modelo não deve automaticamente fazer:

### Imagens grandes + texto lateral.

Se um modelo utiliza:

### 3 cards horizontais

o próximo deve considerar:

- lista;
- grid irregular;
- carrossel;
- composição vertical;
- tabela;
- imagem + texto;
- elementos sobrepostos.

Sempre procurar uma solução diferente.

---

# 14 — HEROES DEVEM SER DIFERENTES

O Hero é um dos elementos que mais denuncia templates.

Não usar sempre:

```text
Título
Descrição
Botão
Imagem ao lado

```

Alternar abordagens.

Possibilidades:

### Hero editorial

Título enorme ocupando a página.

### Hero visual

A imagem domina completamente a primeira tela.

### Hero tipográfico

A tipografia é o principal elemento visual.

### Hero assimétrico

Texto e imagem possuem pesos diferentes.

### Hero minimalista

Pouquíssimos elementos.

### Hero experimental

Interação ou composição diferenciada.

### Hero funcional

O usuário já encontra o produto/serviço imediatamente.

### Hero narrativo

O conteúdo conduz o usuário para a próxima seção.

Não utilizar a mesma fórmula em todos.

---

# 15 — NAVBAR NÃO PRECISA SER IGUAL

Não assumir:

```text
Logo | Menu | CTA

```

como padrão obrigatório.

Dependendo do modelo, utilizar:

- navegação central;
- menu lateral;
- navegação minimalista;
- menu flutuante;
- menu compacto;
- navegação sobre a imagem;
- navegação editorial;
- menu expansível;
- navegação vertical;
- menu escondido.

A navegação deve pertencer ao design.

---

# 16 — TIPOGRAFIA COMO IDENTIDADE

Não utilizar sempre a mesma combinação tipográfica.

A tipografia deve ajudar a definir a personalidade.

Um modelo pode possuir:

- serif elegante;
- sans geométrica;
- grotesca;
- monoespaçada;
- combinação editorial;
- tipografia condensada;
- display expressiva.

Porém:

Não escolher fontes apenas porque parecem bonitas.

Escolher porque combinam com a empresa.

---

# 17 — CORES NÃO DEVEM SER A ÚNICA DIFERENÇA

Este é um erro crítico.

Não fazer:

### Modelo A

Azul + branco.

### Modelo B

Verde + branco.

### Modelo C

Vermelho + branco.

Mas manter exatamente:

- mesmo layout;
- mesmos cards;
- mesmas proporções;
- mesma navbar;
- mesmo hero;
- mesmas animações.

Isso ainda é um template.

A diferença deve existir na **estrutura**, não apenas na paleta.

---

# 18 — COMPONENTES DEVEM NASCER DO CONTEÚDO

Não criar componentes porque:

> "Precisamos de um card aqui."

Criar componentes porque:

> "Precisamos apresentar essas informações de uma maneira específica."

Primeiro:

**conteúdo.**

Depois:

**hierarquia.**

Depois:

**composição.**

Depois:

**componente.**

---

# 19 — EVITAR CARDIZAÇÃO

Não transformar todas as informações em cartões.

Cards devem representar algo que naturalmente seja uma unidade.

Bons exemplos:

- imóvel;
- produto;
- serviço;
- projeto;
- profissional;
- artigo;
- plano.

Evitar cards para:

- frases;
- estatísticas isoladas;
- conceitos;
- qualquer pequeno texto.

Quando tudo é card, nada possui destaque.

---

# 20 — IMAGENS DEVEM TER PERSONALIDADE

Não utilizar imagens apenas para preencher espaços.

Definir uma direção fotográfica para cada modelo.

Exemplos:

### Imobiliária

Arquitetura, ambientes, detalhes, localização.

### Restaurante

Comida, pessoas, ambiente, processo.

### Arquitetura

Projetos, materiais, detalhes construtivos, perspectiva.

### Oficina

Processo, ferramentas, veículos, pessoas trabalhando.

### Tecnologia

Produto, interface, infraestrutura, equipe.

Cada modelo deve possuir uma lógica visual própria.

---

# 21 — NÃO USAR IMAGENS GENÉRICAS

Evitar imagens extremamente clichês.

Exemplos:

- empresário sorrindo para câmera;
- equipe fazendo joinha;
- reunião corporativa genérica;
- aperto de mãos;
- notebook sobre mesa;
- prédio corporativo aleatório.

Quando uma imagem parecer "foto de banco de imagens para site":

**procurar outra abordagem.**

---

# 22 — COPY HUMANA

A escrita também faz parte do design.

Evitar:

> Transformamos sonhos em realidade.

> Onde inovação encontra excelência.

> Uma nova experiência para você.

> Muito mais que um serviço.

> Feito para transformar sua jornada.

> O futuro começa aqui.

Essas frases podem aparecer em milhares de sites.

Preferir linguagem:

- concreta;
- específica;
- contextual;
- natural;
- curta;
- humana.

### Exemplo:

Em vez de:

> "Transformamos sua visão em experiências únicas."

Utilizar:

> "Você traz a ideia. A gente cuida do projeto."

---

# 23 — NÃO INVENTAR DADOS SEM CONTEXTO

Não adicionar automaticamente:

- 10 anos de experiência;
- 500 clientes;
- 98% de satisfação;
- 1.200 projetos;
- 24/7;
- 99,9%;
- 4.9/5.

Se o modelo é fictício e os dados são necessários para demonstrar a interface, eles precisam parecer plausíveis e possuir contexto.

Caso contrário:

**não usar.**

---

# 24 — EVITAR TEXTO "PERFEITO DEMAIS"

A linguagem não precisa ser excessivamente sofisticada.

Uma empresa real normalmente possui uma comunicação mais natural.

Não escrever tudo como manifesto.

Misturar:

- títulos;
- frases curtas;
- informações;
- dados;
- pequenas observações;
- microcopy.

Isso cria naturalidade.

---

# 25 — MICRODETALHES CRIAM REALISMO

Adicionar informações específicas quando fizer sentido.

Exemplos:

- código do produto;
- horário;
- localização;
- disponibilidade;
- preço;
- medidas;
- telefone;
- prazo;
- categoria;
- status;
- data;
- endereço;
- especificações;
- nome do profissional;
- contato.

Esses detalhes fazem o site parecer um produto real.

---

# 26 — ANIMAÇÕES

Animação não deve ser usada para provar que o site é moderno.

Evitar:

- tudo aparecendo com fade;
- tudo deslizando;
- parallax em tudo;
- texto pulando;
- hover exagerado;
- partículas;
- efeitos de brilho;
- animações constantes.

Preferir animações que tenham função:

- revelar;
- orientar;
- enfatizar;
- indicar interação;
- melhorar transição;
- criar ritmo.

Cada modelo pode possuir sua própria linguagem de movimento.

---

# 27 — CADA MODELO PODE TER UMA LINGUAGEM DE MOVIMENTO DIFERENTE

Exemplo:

### Modelo A

Movimentos suaves e lentos.

### Modelo B

Interações rápidas e precisas.

### Modelo C

Scroll editorial.

### Modelo D

Microinterações discretas.

### Modelo E

Movimentos mais expressivos.

Não usar a mesma configuração de animação global em todos.

---

# 28 — ESPAÇO VAZIO É UMA FERRAMENTA

Não preencher todos os espaços.

Espaço vazio pode:

- destacar uma informação;
- criar elegância;
- separar conceitos;
- criar ritmo;
- aumentar impacto visual.

Uma seção não precisa ter conteúdo em todos os cantos.

---

# 29 — GRID NÃO É PRISÃO

Grid deve ajudar o design.

Não obrigar todo elemento a:

```text
width: 25%
width: 25%
width: 25%
width: 25%

```

Explorar:

- colunas desiguais;
- elementos que ocupam múltiplas colunas;
- alinhamentos diferentes;
- sobreposições;
- elementos fora do fluxo quando fizer sentido.

---

# 30 — RESPONSIVIDADE

Ser diferente não significa quebrar no mobile.

Toda personalidade visual deve sobreviver à responsividade.

No mobile:

- simplificar;
- reorganizar;
- priorizar;
- reduzir elementos;
- manter a identidade.

Não simplesmente empilhar todos os blocos.

O mobile pode possuir uma composição própria.

---

# 31 — ACESSIBILIDADE NÃO É OPCIONAL

Mesmo modelos experimentais devem possuir:

- contraste adequado;
- navegação por teclado;
- foco visível;
- textos legíveis;
- áreas de toque adequadas;
- HTML semântico;
- alt text quando necessário;
- respeito a `prefers-reduced-motion`.

Design experimental não significa experiência ruim.

---

# 32 — PERFORMANCE

Não sacrificar performance para criar aparência.

Evitar:

- imagens gigantes sem otimização;
- vídeos desnecessários;
- bibliotecas apenas para um efeito;
- animações pesadas;
- JavaScript onde CSS resolve;
- elementos decorativos excessivos.

Um site bonito precisa continuar sendo rápido.

---

# 33 — NÃO IMITAR TENDÊNCIAS AUTOMATICAMENTE

Não adicionar:

- glassmorphism;
- brutalism;
- bento grid;
- gradients;
- blobs;
- noise;
- grain;
- glow;
- 3D;
- cursor customizado;
- parallax;

apenas porque estão em alta.

Uma tendência só deve existir quando fizer sentido para aquela identidade.

---

# 34 — EVITAR "BENTO GRID" COMO PADRÃO

Bento grid é uma ferramenta.

Não é identidade.

Se todos os modelos possuírem:

```text
┌──────┬───┐
│      │   │
├───┬──┴───┤
│   │      │
└───┴──────┘

```

o portfólio inteiro começa a parecer feito pelo mesmo template.

Usar apenas quando o conteúdo realmente se beneficia dessa estrutura.

---

# 35 — NÃO USAR "SEÇÕES DE BENEFÍCIOS" AUTOMATICAMENTE

Evitar sempre:

### Por que escolher nossa empresa?

✓ Qualidade  
✓ Experiência  
✓ Atendimento  
✓ Inovação

Isso é genérico.

Transformar benefícios em algo contextual.

Exemplo:

### Para o seu projeto

**Orçamento antes da visita**

Você sabe o investimento estimado antes de marcar uma reunião.

Isso possui muito mais personalidade.

---

# 36 — CADA MODELO DEVE TER PELO MENOS UMA DECISÃO ARRISCADA

Um bom design não precisa ser convencional o tempo inteiro.

Cada modelo deve possuir pelo menos uma escolha que fuja do padrão.

Pode ser:

- navegação;
- composição;
- tipografia;
- interação;
- fotografia;
- estrutura;
- uso de espaço;
- apresentação do produto.

Não precisa ser extravagante.

Precisa ser memorável.

---

# 37 — REGRA "SE EU TROCAR O LOGO"

Imagine pegar o modelo e trocar:

- logo;
- nome;
- cor;
- imagens.

Se ele continuar funcionando perfeitamente para outra empresa:

**o design provavelmente está genérico demais.**

Um bom modelo deve estar profundamente conectado ao negócio para o qual foi criado.

---

# 38 — REGRA "SÓ TROCAR CORES NÃO VALE"

Dois modelos são considerados diferentes somente quando existe diferença significativa em pelo menos vários destes aspectos:

- estrutura;
- navegação;
- hero;
- tipografia;
- composição;
- proporções;
- tratamento de imagens;
- sistema de cards;
- espaçamento;
- interação;
- animações;
- hierarquia;
- linguagem;
- apresentação de conteúdo.

Trocar somente cores não conta.

---

# 39 — REGRA ANTI-TEMPLATE

Antes de aprovar um novo modelo, comparar mentalmente com os modelos existentes.

Perguntar:

### "Esse Hero parece com algum outro?"

Se sim:

**alterar.**

### "Essa seção de cards parece com algum outro?"

Se sim:

**alterar.**

### "A navegação parece com algum outro?"

Se sim:

**alterar.**

### "A página possui a mesma quantidade e ordem de seções?"

Se sim:

**alterar.**

### "As animações parecem iguais?"

Se sim:

**alterar.**

### "Se eu colocar os dois lado a lado, consigo distinguir imediatamente qual é qual?"

Se não:

**o modelo ainda não está pronto.**

---

# 40 — REGRA ANTI-IA

O maior objetivo deste documento é impedir que os modelos tenham aparência de:

> "site gerado por inteligência artificial."

Não porque IA seja ruim.

Mas porque o portfólio precisa demonstrar:

**direção criativa humana.**

Evitar padrões excessivamente previsíveis de geração automática:

- headline genérica;
- subtítulo genérico;
- CTA genérico;
- 3 cards;
- estatísticas;
- depoimentos;
- CTA final;
- gradiente;
- sombras suaves;
- border-radius excessivo;
- glassmorphism;
- bento grid;
- texto emocional;
- ícones genéricos;
- layouts perfeitamente simétricos.

---

# 41 — O DESIGN DEVE PARECER DECIDIDO

Um site humano parece possuir opiniões.

Ele escolhe:

- uma determinada fonte;
- uma determinada fotografia;
- um determinado ritmo;
- uma determinada proporção;
- uma determinada navegação.

Não tenta agradar todo mundo.

Um design sem personalidade tenta ser:

> moderno + elegante + minimalista + tecnológico + sofisticado + amigável.

Isso normalmente resulta em:

> genérico.

Escolher uma direção.

---

# 42 — CARACTERÍSTICA EXCLUSIVA

Cada modelo deve possuir pelo menos uma característica que não seja repetida nos demais.

Exemplos:

**Modelo imobiliário**

Sistema editorial de imóveis e informações de propriedade.

**Modelo restaurante**

Fotografia + menu + experiência física.

**Modelo arquitetura**

Portfólio visual dominante.

**Modelo oficina**

Interface mais técnica e funcional.

**Modelo tecnologia**

Produto e demonstração como protagonistas.

A característica deve nascer do negócio.

---

# 43 — O SITE NÃO PRECISA PARECER "MODERNO"

Essa palavra deve ser usada com cuidado.

Um design pode ser:

- elegante;
- funcional;
- marcante;
- sofisticado;
- tradicional;
- experimental;
- contemporâneo;
- técnico;
- artesanal.

"Moderno" não significa adicionar efeitos.

Modernidade pode vir de:

- boa tipografia;
- hierarquia;
- espaçamento;
- fotografia;
- simplicidade;
- interação;
- clareza.

---

# 44 — O PORTFÓLIO COMO UM TODO

O objetivo não é apenas criar bons sites individualmente.

O conjunto também precisa demonstrar variedade.

Imagine o visitante percorrendo:

```text
MODELO 01
↓
MODELO 02
↓
MODELO 03
↓
MODELO 04
↓
MODELO 05

```

A sensação deve ser:

> "Ele sabe criar diferentes tipos de produto."

e não:

> "Ele possui um template e troca o conteúdo."

---

# 45 — O SITE PRECISA CRIAR VONTADE

Um modelo pode ser original, coerente e diferente de todos os outros — e ainda assim não servir.

Antes de qualquer regra deste documento, existe uma pergunta anterior:

> "Quem abriu esta página ficou com vontade de procurar essa empresa?"

Se a resposta for não, o modelo falhou, por mais original que seja.

Fugir de template é meio, não é fim.

### O erro a evitar

Otimizar para **ser diferente** em vez de otimizar para **ser desejável**.

Uma tela densa, utilitária e original continua sendo uma tela que ninguém quer olhar.

Diferenciação que custa desejo é prejuízo.

### Regra

Cada modelo deve ganhar em três frentes ao mesmo tempo:

- personalidade (não parece template);
- desejo (dá vontade de ir / contratar / comprar);
- clareza (a pessoa entende e consegue agir).

Faltando qualquer uma das três, refazer.

---

# 46 — A PRIMEIRA TELA VENDE, NÃO OPERA

A primeira tela existe para convencer.

A ferramenta vem depois.

Não abrir com:

- tabela;
- grade de dados;
- formulário;
- painel;
- lista longa;
- calendário cheio;
- qualquer interface de operação.

Isso é tela de sistema, não de venda.

Mesmo quando o produto **é** a ferramenta — agenda, catálogo, busca — a primeira tela deve mostrar o **resultado desejado**, e a ferramenta deve aparecer logo em seguida, ou reduzida a um único gesto de entrada.

### Exemplo

Barbearia vende horário.

Mas ninguém sente vontade olhando cento e dezesseis horários.

A pessoa sente vontade olhando a cadeira, a luz e a mão trabalhando — e então quer ver o horário.

---

# 47 — FOTOGRAFIA É O PRODUTO EM NEGÓCIO VISUAL

Restaurante, barbearia, hotel, estética, arquitetura, imobiliária, loja.

Nesses negócios, a imagem **é** o argumento de venda. Não é enfeite, não é apoio.

Regras:

- a imagem deve ser grande;
- deve ter tratamento próprio e consistente;
- deve mostrar o lugar, o produto ou o processo reais;
- deve ter ar em volta, não ser espremida;
- não deve competir com texto por cima dela sem contraste garantido.

### Nunca publicar

Imagem com marca, logotipo, placa ou identidade de **outra empresa** visível.

Isso destrói a credibilidade em um segundo e não há copy que compense.

Se a única imagem disponível tiver marca de terceiro, recortar até sair — e se não sair, não usar.

---

# 48 — PREMIUM É ESPAÇO, NÃO ENFEITE

Percepção de valor alto não vem de:

- sombra;
- brilho;
- gradiente;
- animação;
- efeito;
- quantidade de recurso.

Vem de:

- espaço generoso;
- imagem grande e bem tratada;
- pouca coisa por tela;
- tipografia com escala clara;
- um gesto forte em vez de cinco médios;
- contenção.

Densidade comunica **utilidade**, não valor.

Se o objetivo é parecer caro, tirar elementos costuma funcionar melhor do que acrescentar.

---

# 49 — SEO NÃO É ITEM OPCIONAL

Todo modelo deve nascer pronto para ser encontrado. Isso faz parte do design, não é etapa posterior.

### Obrigatório em todo modelo

- `title` único, com o que o negócio faz e onde ele fica;
- `meta description` concreta, escrita para pessoa, não para robô;
- **um** `h1` por página, com o assunto real;
- hierarquia real de `h2` / `h3`, na ordem do conteúdo;
- HTML semântico (`header`, `main`, `section`, `nav`, `article`, `address`, `time`);
- `alt` descritivo em toda imagem que carrega informação;
- dados estruturados (JSON-LD) do tipo certo para o negócio — `LocalBusiness`, `HairSalon`, `RealEstateAgent`, `Restaurant`, `Product`, `FAQPage`;
- NAP visível e consistente: nome, endereço e telefone em texto, nunca só dentro de imagem;
- horário de funcionamento em texto;
- Open Graph e imagem de compartilhamento;
- URL limpa e âncoras que existem de fato.

### Conteúdo

- escrever o que o negócio faz, para quem e onde, com palavra de gente;
- responder as perguntas reais do cliente na própria página;
- preço, prazo e localização em texto, quando existirem.

### Proibido

- empilhar palavra-chave;
- texto escondido;
- `h1` decorativo que não diz nada;
- conteúdo essencial que só existe depois do JavaScript rodar.

### Desempenho conta como SEO

- imagem no formato certo e no tamanho certo;
- dimensão declarada, para não haver salto de layout;
- fonte com `display=swap`;
- nada de biblioteca pesada para um único efeito.

---

# 50 — A PÁGINA NÃO PODE CAIR DEPOIS DO HERÓI

Este foi o erro mais caro do modelo da barbearia, e ele não aparece em nenhuma
das regras anteriores.

A primeira tela ficou cinematográfica. O resto virou documento de texto.

A página começava premium e caía.

### Por que isso engana

Ao revisar, o olho para na primeira tela, aprova, e o modelo é dado como
pronto. Mas quem visita rola. E o que a pessoa leva embora não é o pico — é a
média.

Uma seção fraca depois de uma seção forte não é neutra: ela **desmente** a
anterior. A pessoa conclui que o capricho era fachada.

### Regra

Toda seção precisa de peso próprio: fotografia, escala tipográfica,
composição ou espaço. Nenhuma pode ser "só o texto que faltava dizer".

Se uma seção só existe como parágrafo, ou ela ganha imagem e composição, ou
ela vira uma linha dentro de outra seção, ou ela sai.

### Teste

Rolar a página inteira de uma vez, sem parar, e perguntar:

> "Em que altura eu deixaria de acreditar que isso é caro?"

Aquela altura é o defeito. Não a primeira tela.

---

# 51 — A EMENDA ENTRE SEÇÕES É DESIGN

Duas seções boas coladas por uma linha de 1px produzem uma página ruim.

O que mais denunciava montagem automática neste projeto não era o conteúdo das
seções — era o **encontro** entre elas: foto sangrada terminando em aresta
reta, seguida de `border-top: 1px solid`.

Isso lê como dois arquivos empilhados, não como uma página.

### O que fazer

- a imagem de uma seção morre no fundo da página antes de acabar;
- a seção seguinte nasce daquele mesmo fundo;
- a passagem é de sombra para sombra, ou de espaço para espaço, não de linha.

Em página escura, isso costuma ser gradiente descendo do topo da seção nova e
subindo do pé da anterior, até a mesma cor. Em página clara, o mecanismo muda,
mas o princípio é o mesmo: a emenda precisa ser decidida.

### Regra

Borda de 1px entre seções é aceitável entre blocos de texto do mesmo peso.

Nunca logo depois de uma imagem sangrada.

---

# 52 — FOTO SOLTA NÃO EXISTE

Duas falhas diferentes, as duas fatais, as duas vieram deste projeto.

### Falha 1 — a foto colada

Imagem sem tratamento, encostada no fundo, com quatro cantos retos, lê como
"foi jogada no HTML". Não importa se a foto é boa.

Toda fotografia precisa de um **tratamento que pertença àquele modelo**:
moldura, passe-partout, máscara, recorte característico, fio de metal,
sobreposição, sombra própria.

E esse tratamento vale mais quando vira assinatura: neste projeto a moldura de
fio de latão que segura os retratos virou também o símbolo da marca. Um
elemento que se repete em escalas diferentes cria identidade; um efeito usado
uma vez só é enfeite.

### Falha 2 — fotos que não conversam

Três retratos de origens diferentes tinham luminância média 24, 64 e 91.

Lado a lado, pareciam três sites diferentes — e nenhum tratamento de layout
conserta isso.

Antes de publicar um conjunto de imagens, **medir** e nivelar:

- exposição na mesma faixa;
- temperatura na mesma direção;
- contraste equivalente;
- mesmo recorte e mesma proporção.

### Regra

Se o modelo mostra várias fotos juntas, elas precisam parecer feitas na mesma
sessão, pelo mesmo fotógrafo, mesmo que não tenham sido.

---

# 53 — CABEÇALHO E RODAPÉ SÃO PÁGINA, NÃO SOBRA

São a primeira e a última coisa que a pessoa vê. Neste projeto os dois estavam
abandonados.

O cabeçalho era o nome de um lado, o telefone do outro, e um vão enorme no
meio — o vão não era espaço, era falta de decisão.

O rodapé era uma linha de contatos.

### Cabeçalho

Precisa de uma marca de verdade (símbolo + nome), de orientação e de um gesto.

E precisa desaparecer com elegância no mobile: lá sobra a marca e a ação
principal, não o menu inteiro espremido.

### Símbolo

Desenhar, não escrever.

- nascer dos motivos do próprio site, não do clichê do setor — poste de
  barbeiro, engrenagem de oficina, casinha de imobiliária são pistas de que
  ninguém pensou;
- ser traço, sem depender de fonte carregada;
- continuar legível a 28px;
- funcionar em uma cor.

### Rodapé

Fecha a página. Carrega o nome em escala, o endereço, o horário, os contatos e
um último convite.

É também onde o SEO local mora em texto (§49). Rodapé pobre é oportunidade
jogada fora duas vezes: em desejo e em busca.

---

# 54 — MOVIMENTO TEM RITMO, NÃO CONSTANTE GLOBAL

Uma entrada escalonada não tem um valor certo — tem o valor daquela lista.

Neste projeto, um segundo entre itens era certo para três frases de prosa que a
pessoa lê, e absurdamente lento para uma tabela de preços que o olho varre.

O passo virou propriedade da lista: `0,3s` no bloco de leitura, `0,09s` na
tabela.

### Regra

O intervalo entre itens deve acompanhar a velocidade de leitura daquele
conteúdo, não uma constante do projeto.

E, na dúvida, **só opacidade**. Nada desliza, nada escala, nada gira.

---

# 55 — CONTROLE INVISÍVEL É CONTROLE QUEBRADO

O carrossel de dias deste projeto rolava — tecnicamente. Não tinha barra, não
tinha seta, e a roda do mouse não movia. No desktop, metade dos dias era
simplesmente inalcançável.

Isso não é detalhe de acabamento. É funcionalidade morta num modelo cuja razão
de existir é agendar.

### Regra para qualquer trilho horizontal

- afordância visível: setas, barra, véu na borda ou item cortado de propósito;
- estado desabilitado quando aquele lado acabou;
- o item selecionado entra na vista sozinho;
- alvo de toque de 44px;
- funciona com teclado.

Se nada disso existir, usar grade que quebra linha. Uma grade honesta é melhor
que um carrossel que só o autor sabe operar.

---

# 56 — MEDIR NO NAVEGADOR, NÃO CONFIAR NO CÓDIGO

Vários defeitos deste projeto passariam despercebidos numa leitura do código —
todos apareceram na primeira medição real:

- regra de animação que nunca casava, porque o seletor não alcançava o elemento;
- setas nascendo desabilitadas, porque a medida foi tirada antes do elemento
  ter caixa;
- trilho com conteúdo fora do alcance (`scrollWidth` maior que `clientWidth`);
- três fotos em faixas de luz incompatíveis;
- contraste de texto abaixo do mínimo.

### Antes de considerar um modelo pronto

- abrir em 1440 e em 390 e olhar as duas;
- varrer o console procurando erro;
- conferir números, não impressões: opacidades ao longo da animação, sobra de
  rolagem, luminância das imagens, razão de contraste;
- clicar em cada controle e confirmar que o estado muda de verdade.

### Armadilhas que já custaram tempo neste portfólio

- CSS escopado não alcança `<html>` nem elemento criado por JavaScript — ali é
  preciso escopo global ancorado;
- reset de CSS pode zerar margem e quebrar a centralização nativa de diálogo;
- `display` declarado na regra base de `dialog` vence o `display: none` do
  navegador e o modal aparece fechado;
- medida tirada antes do elemento ser exibido volta zero;
- biblioteca de animação pode não gravar a propriedade final no elemento.

---

# 57 — CHECKLIST OBRIGATÓRIO

Antes de finalizar qualquer modelo:

### IDENTIDADE

- Possui personalidade própria?
- Parece específico para o negócio?
- Possui uma característica visual exclusiva?
- Não depende apenas de cores diferentes?

### ESTRUTURA

- A estrutura é diferente dos outros modelos?
- O Hero possui uma abordagem própria?
- A navegação possui personalidade?
- A ordem das seções faz sentido para o negócio?
- Existem seções desnecessárias que podem ser removidas?

### VISUAL

- A composição possui ritmo?
- Existe algum nível de assimetria quando apropriado?
- As imagens possuem tratamento próprio?
- A tipografia combina com a empresa?
- O design não depende de cards para tudo?

### DESEJO

- Dá vontade de procurar essa empresa depois de ver a página?
- A primeira tela convence, em vez de operar?
- A imagem principal é grande, tratada e do negócio real?
- Existe espaço suficiente para o conteúdo respirar?
- Nenhuma imagem mostra marca de outra empresa?

### SEO

- `title` e `meta description` dizem o que é e onde fica?
- Existe um único `h1`, com o assunto real?
- A hierarquia de títulos acompanha o conteúdo?
- Há JSON-LD do tipo certo para o negócio?
- Nome, endereço, telefone e horário estão em texto?
- O conteúdo essencial existe sem depender de JavaScript?
- Imagens têm `alt`, formato e dimensão declarados?

### RITMO E EMENDAS

- O nível se sustenta da primeira à última seção, ou a página cai depois do herói?
- Toda seção tem peso próprio, e não é só um parágrafo que sobrou?
- As emendas entre seções foram decididas, ou existe borda de 1px depois de imagem sangrada?
- Cabeçalho e rodapé foram projetados, e não deixados como sobra?

### FOTOGRAFIA

- Cada imagem tem tratamento que pertence a este modelo, ou está colada no fundo?
- O tratamento vira assinatura, aparecendo em mais de uma escala?
- As fotos do mesmo conjunto foram niveladas em exposição, temperatura e recorte?
- O símbolo da marca foi desenhado a partir do próprio site, e não do clichê do setor?

### CONTROLES

- Todo trilho horizontal tem afordância visível e estado de fim?
- O item selecionado entra na vista sozinho?
- Cada controle foi clicado e muda de estado de verdade?
- Alvos de toque de 44px?

### MEDIÇÃO

- Aberto em 1440 e em 390?
- Console sem erro em todas as rotas?
- Números conferidos: contraste, sobra de rolagem, luminância das imagens?

### COPY

- O texto parece escrito por uma pessoa?
- Evita frases genéricas?
- Evita excesso de frases de efeito?
- Evita métricas inventadas?
- Possui informações concretas?

### INTERAÇÃO

- As animações têm propósito?
- O comportamento é diferente de outros modelos quando apropriado?
- Não existem efeitos apenas para impressionar?

### IA / TEMPLATE

- Parece feito especificamente para esta empresa?
- Parece diferente dos outros modelos?
- Não parece uma landing page genérica?
- Não parece um template adaptado?
- Não parece uma página gerada automaticamente?

### RESPONSIVIDADE

- Desktop possui identidade?
- Tablet funciona?
- Mobile possui composição adequada?
- A personalidade sobrevive ao mobile?

---

# 58 — TESTE FINAL

Antes de considerar um modelo concluído, fazer este teste:

## TESTE 01 — REMOVER O TEXTO

Olhar somente para o layout.

Pergunta:

> "Eu consigo reconhecer a personalidade deste site?"

Se não:

**refazer a composição.**

---

## TESTE 02 — REMOVER AS CORES

Imagine o site em preto e branco.

Pergunta:

> "Ele ainda é diferente dos outros?"

Se não:

**a diferença depende demais da paleta.**

---

## TESTE 03 — TROCAR O CONTEÚDO

Imagine trocar o nome da empresa e as imagens.

Pergunta:

> "Esse layout poderia pertencer a qualquer empresa?"

Se sim:

**está genérico demais.**

---

## TESTE 04 — COMPARAÇÃO

Abrir dois modelos lado a lado.

Perguntar:

> "Eles parecem parentes?"

Se sim:

**alterar pelo menos uma grande decisão estrutural.**

---

## TESTE 05 — TESTE DA VONTADE

Mostrar a primeira tela para alguém por cinco segundos e perguntar:

> "Você iria nesse lugar?"

Se a resposta for:

> "Não sei, é bonitinho."

Então a página informa, mas não vende.

**Refazer a primeira tela.**

---

## TESTE 06 — TESTE HUMANO

Perguntar:

> "Isso parece ter sido desenhado por alguém que conheceu essa empresa?"

Se a resposta for:

> "Parece um template bonito."

Então ainda não terminou.

---

## TESTE 07 — TESTE DO ANÚNCIO

Imaginar a página aparecendo numa busca do Google e num link compartilhado no WhatsApp.

Perguntar:

> "O título, a descrição e a imagem que aparecem fariam alguém clicar?"

Se não:

**o SEO e a imagem de compartilhamento ainda não foram tratados como design.**

---

## TESTE 08 — TESTE DA ROLAGEM

Rolar a página inteira de uma vez, sem parar em nada.

Perguntar:

> "Em que altura eu deixaria de acreditar que isso é caro?"

Existe uma altura? Aquele é o defeito — não a primeira tela.

**Levantar aquela seção ao nível do herói, ou tirá-la.**

---

# 59 — PRINCÍPIO FINAL

Não criar:

> **templates bonitos.**

Criar:

> **experiências digitais específicas.**

Não criar:

> **sites que seguem tendências.**

Criar:

> **sites que possuem personalidade.**

Não criar:

> **variações do mesmo layout.**

Criar:

> **direções visuais diferentes.**

Não tentar parecer:

> **"feito por IA".**

Não tentar parecer:

> **"anti-IA".**

O objetivo é simplesmente:

> **parecer que alguém pensou.**

Cada decisão deve possuir uma razão.

Cada página deve possuir uma personalidade.

Cada negócio deve possuir uma solução diferente.

---

# PRINCÍPIO SUPREMO

## NÃO EXISTEM MODELOS.

Existem **projetos diferentes**.

Mesmo dentro deste portfólio.

Mesmo utilizando a mesma stack.

Mesmo utilizando os mesmos componentes técnicos.

Mesmo desenvolvidos pela mesma pessoa.

O código pode compartilhar infraestrutura.

**O design não deve compartilhar personalidade.**

O visitante não deve enxergar um sistema de templates.

Ele deve enxergar:

**uma coleção de projetos cuidadosamente projetados, cada um com sua própria identidade.**
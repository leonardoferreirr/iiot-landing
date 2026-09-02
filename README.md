# IIOT — Instituto Integrado de Ortopedia e Traumatologia

Landing page do IIOT, no Complexo UMC em Uberlândia (MG).
HTML, CSS e JavaScript puros, sem build.

## Rodar

```bash
npx serve -l 8863 .
```

## Estrutura

- `index.html` — página única
- `assets/css/site.css` — estilos, com as fontes embutidas no topo
- `assets/js/site.js` — menu, filtro de especialidade, fios do mapa, carrossel
- `assets/img/simbolo.svg` — símbolo da marca, vetorizado da logo original
- `assets/img/figura.svg` — pictograma do mapa de especialidades
- `assets/img/trama.svg` — trama de fundo, tile fechado
- `assets/img/equipe/` — retratos do corpo clínico
- `assets/fonts/` — Fraunces e Inter Tight, servidas localmente

## Decisões que não são óbvias no código

- **O verde da marca (#97b02c) nunca é texto sobre fundo claro.** Ele dá 2,4:1
  de contraste sobre branco, o que reprova em acessibilidade. Só aparece como
  superfície (botão, ponto, traço) ou como texto sobre o teal escuro.
- **As fontes são declaradas dentro do `site.css`, não por `@import`.** O import
  encadeia HTML → CSS → CSS e custava ~600 ms no first paint.
- **O cabeçalho tem `margin-bottom` negativo.** É o que faz ele pousar sobre o
  hero; sem isso o `position: sticky` empurra o hero para baixo e sobra uma
  faixa clara acima da foto.
- **A figura e os pontos do mapa dividem a mesma caixa (`inset: 7%`).** As
  coordenadas dos pontos são percentuais, então qualquer recuo aplicado a uma
  precisa ser aplicado à outra, senão os pontos saem de cima do corpo.
- **A ordem dos nomes em cada coluna do mapa segue a altura do ponto no corpo.**
  Fora dessa ordem, os fios se cruzam.
- **Ao filtrar por especialidade, quem atende é "imantado"**: ganha borda
  verde, um pulso e o carrossel rola até ele. Sem isso o card podia estar
  fora da área visível do trilho e o clique parecia não ter feito nada.
- **Trocar o pictograma por uma foto não quebra o mapa**: basta trocar o `src`
  de `.mapa__figura` e reconferir os oito percentuais em `#alvos`.

## Pendências do cliente

- Dois médicos: o briefing informa nove, o material trazia sete.
- Nenhum médico de ortopedia pediátrica, embora a especialidade esteja no
  briefing e sustente metade da promessa do hero.
- Logos dos convênios (hoje o carrossel roda com os nomes em texto).
- Horário de atendimento e número do WhatsApp.
- Mapa interno do percurso da entrada do UMC até a Sala 43.
- Foto da entrada em alta resolução: a atual tem 680 px de origem.
- Três artigos de conteúdo. A seção está pronta e oculta por `hidden` no
  `index.html`; basta remover o atributo para reativá-la.

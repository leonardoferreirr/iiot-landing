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
- `assets/fonts/` — Fraunces e Inter Tight, servidas localmente e reduzidas
  ao que a página usa (ver decisões)

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
- **As fontes foram cortadas ao que a página usa.** A Fraunces é variável e
  vinha com todos os eixos: como o site só usa o peso 600, ela foi
  instanciada nesse peso e caiu de 65 KB para 16 KB. A Inter Tight continua
  variável, porque os pesos 400, 500 e 600 são todos usados, mas foi
  reduzida ao subconjunto latino: 44 KB para 27 KB. Juntas, 66 KB a menos
  disputando banda com a foto do hero.
- **Trocar o pictograma por uma foto não quebra o mapa**: basta trocar o `src`
  de `.mapa__figura` e reconferir os oito percentuais em `#alvos`.

## Corpo clínico

Os nove médicos vieram do PDF "Nomes e currículos dos doutores" (03/09/2026),
com CRM e RQE. As fotos vieram da pasta "Doutores" na mesma data, recortadas
em quadrado a partir do terço superior, que é onde fica o rosto em retrato.

O Dr. Franco André Correa Martins, que constava no site antigo, **não está na
lista atual** e foi removido junto com a foto. Se ele voltar ao quadro, é só
recolocar o card no mesmo padrão dos outros.

## Pendências do cliente

- Logos dos convênios (hoje o carrossel roda com os nomes em texto).
- Horário de atendimento e número do WhatsApp.
- Mapa interno do percurso da entrada do UMC até a Sala 43.
- Foto da entrada em alta resolução: a atual tem 680 px de origem.
- Três artigos de conteúdo. A seção está pronta e oculta por `hidden` no
  `index.html`; basta remover o atributo para reativá-la.

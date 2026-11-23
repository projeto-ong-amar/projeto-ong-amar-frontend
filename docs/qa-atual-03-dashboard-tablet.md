# QA-ATUAL-03 — overflow do dashboard em tablet (#63)

## Diagnóstico e correção

O excesso não vinha das grades ou dos gráficos: o pseudo-elemento de ajuda
da data usava texto sem quebra e posicionamento centralizado no pequeno
ícone. Mesmo com `visibility: hidden`, sua caixa aumentava a área rolável.
No navegador via MCP, em 768×800, a base apresentava `clientWidth=513px`
e `scrollWidth=723px`.

O balão passa a se posicionar abaixo da faixa da próxima doação, alinhado
à sua borda direita, limitado a `min(360px, 100%)` e com quebra de texto.
O mesmo posicionamento atende celular, tablet e desktop. Não foi adicionado
`overflow: hidden`/`clip`, nem alterada a composição dos gráficos.

Não há alteração de API, permissões ou regras de negócio. O landmark de
Desempenho (#65), a posição do VLibras (#64) e as dependências vulneráveis
(#66) continuam fora deste escopo.

## Regressão automatizada em navegador

Foi adicionado `@playwright/test` como dependência de desenvolvimento, com
um comando separado de `npm test` (JSDOM não calcula layout real).

```sh
npm ci
npx playwright install chromium
npm run test:layout
```

Alternativa com Google Chrome já instalado, utilizada nesta validação:

```sh
PLAYWRIGHT_CHANNEL=chrome npm run test:layout
```

O runner inicia o Vite na porta 5177. A API de autenticação/CSRF e os dados do
dashboard usam fixtures fictícias; os três gráficos usam o Google Charts
real, portanto o teste exige acesso aos serviços externos do Google.
Nenhuma credencial ou backend real é necessário.

Os três viewports (375×667, 768×800 e 1280×800) verificam:

- SVGs dos gráficos carregados e contidos nos cartões;
- `scrollWidth <= clientWidth` do contêiner da página;
- ausência de corte artificial por `overflow-x: hidden` ou `clip`;
- largura com balão oculto e aberto por hover, com texto quebrável;
- navegação de volta ao Início e fechamento/devolução de foco do menu móvel.

Screenshots e dados de dimensões são produzidos em `test-results/`, ignorado
pelo Git. O trace é retido em caso de falha.

O mesmo teste de tablet foi executado contra um worktree isolado da base
`3ffbe11`: falhou com 732px de conteúdo para 528px disponíveis. Com a
correção, os três cenários passaram. A diferença de 15px em relação ao MCP
decorre da área reservada pela barra de rolagem de cada navegador.

Conferência adicional pelo Playwright MCP após carregar os gráficos:

| Viewport | clientWidth | scrollWidth |
| --- | --- | --- |
| 375×667 | 360px | 360px |
| 768×800 | 513px | 513px |
| 1280×800 | 1025px | 1025px |

## Validação e limitações preexistentes

- `PLAYWRIGHT_CHANNEL=chrome npm run test:layout`: 3 aprovados.
- `npm test`: 159 aprovados e 2 falhas em `tests/editar-historico.test.jsx`.
  A suíte completa no worktree isolado de `3ffbe11`, após `npm ci`,
  reproduziu exatamente 159 aprovados e as mesmas 2 falhas:
  `document.getElementById('edit-produto')` e
  `document.getElementById('edit-motivo')` retornam `null` nos testes de
  pré-preenchimento de entrada/saída. Não foram alterados nem excluídos.
  As quatro falhas antigas de sessão já não ocorrem na base atual.
- `npm run lint`: sem erros e com os mesmos 8 avisos reproduzidos na base.
- `npm run build` e `git diff --check`: aprovados.
- `npm ci` continua reportando 3 vulnerabilidades altas, também na base.
  Nenhuma dependência de produção foi atualizada nesta correção.

Esta é validação de layout com dados controlados, não integração com backend
real nem teste em dispositivos físicos. Ausência de CI não representa CI
aprovado.

# QA-ATUAL-04 — landmark principal de Desempenho (#65)

## Causa e solução

Desempenho retornava um fragmento, e o layout compartilhado corretamente
não adiciona um `main` às páginas que já possuem esse elemento.
O fragmento foi substituído por `<main aria-label="Desempenho">`, cobrindo
data, indicadores, gráficos e ações, sem incluir a sidebar ou a topbar.
O layout compartilhado não foi alterado; não há mudança de API ou permissões.

## Regressão

`tests/qa-atual-04-landmarks.test.jsx` monta o App real como administrador
e navega pelas oito telas do menu: Início, Gerenciar Entrada, Cadastro de
Produtos, Gerenciar Saída, Relatórios, Desempenho, Cadastro de Usuário e
Configurações. Confere exatamente um `main`/`role="main"`, sem aninhamento
e sem englobar a navegação ou a topbar. Em Desempenho também verifica nome
acessível e presença dos conteúdos centrais dentro do landmark.
A API é simulada e somente o renderizador externo Google Charts é substituído.

Antes da correção, esse arquivo apresentou sete testes aprovados e uma
falha em Desempenho: zero landmarks em vez de um. Após a correção, os oito
passaram.

O teste Playwright existente também verifica o landmark nomeado e único,
preservando as verificações de largura do contêiner rolável original,
gráficos reais e navegação em 375×667, 768×800 e 1280×800.

## Validação

- `npm test -- tests/qa-atual-04-landmarks.test.jsx`: 8 aprovados.
- `PLAYWRIGHT_CHANNEL=chrome npm run test:layout`: 3 aprovados.
- `npm test`: 167 aprovados e 2 falhas preexistentes.
- `npm run lint`: sem erros, 8 avisos preexistentes.
- `npm run build` e `git diff --check`: aprovados.

As duas falhas da suíte completa foram reproduzidas com `npm ci` e
`npm test` no worktree isolado da base
`9a26e3b8084e31e85d5c729ae11e2793e4be2015`: 159 aprovados e as mesmas
duas falhas em `tests/editar-historico.test.jsx`, linhas 69 e 80.
Os seletores `edit-produto` e `edit-motivo` retornam `null` ao conferir o
pré-preenchimento dos modais de entrada e saída. Nenhum desses testes ou
componentes foi alterado. A mesma base reproduziu os oito avisos de lint.

`npm ci` reporta três vulnerabilidades altas na base e na correção;
nenhuma dependência foi alterada. Esta validação usa dados controlados,
não backend real, dispositivos físicos ou leitor de tela. O teste de
navegador exige Chrome instalado e acesso externo ao Google Charts.
Ausência de checks no GitHub não representa CI aprovado.

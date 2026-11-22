# BUG-10 — layout em celulares (#43)

## Causa e solução

Em 375×667, a sidebar reservava 240px e deixava apenas 135px para o
conteúdo. Não existia um controle para recolhê-la. Além disso, as grades
do Início e de algumas páginas continuavam com várias colunas.

Até 767px, a sidebar fica recolhida e abre sobre o conteúdo pelo botão
“Abrir menu de navegação”. Fecha por botão, fundo, Escape ou navegação.
O foco entra no menu, circula entre seus controles e retorna ao botão
de abertura após fechar; o conteúdo atrás dele fica `inert`. O menu fechado
também fica `inert`. Os links continuam respeitando o perfil do usuário.
Ao mudar o breakpoint, o estado aberto é descartado.

Cartões e formulários passam a uma coluna, ações empilham, breadcrumbs
quebram linha, tabelas rolam horizontalmente em seus próprios contêineres
e modais altos rolam verticalmente. A altura do shell acompanha a viewport
dinâmica (`dvh`, com fallback `vh`).

Sem alterações em API, permissões ou regras de negócio.

## Validação

- `npm test -- tests/layout-mobile.test.jsx`: 6 testes aprovados, cobrindo
  administrador e voluntário, navegação, fechamento, foco, `inert`,
  permissões e mudança de viewport.
- `npm test`: 125 aprovados e 4 falhas preexistentes de sessão.
- `npm run lint`: sem erros; os mesmos 5 avisos da base.
- `npm run build` e `git diff --check`: aprovados.

### Navegador real (Playwright via MCP)

API interceptada com fixtures fictícias, sem depender de backend ou
credenciais reais. As verificações de layout usam `clientWidth`,
`scrollWidth`, visibilidade da sidebar e interações reais de teclado/clique.

1. Base `ec8a8b4`, 375×667: sidebar de 240px, conteúdo com 135px e nenhum
   botão de abertura de menu (reprodução da issue).
2. Correção, 375×667, administrador: navegação por Início, Entrada, Saída,
   Produtos, Usuários, Configurações, Relatórios e Desempenho. Nas oito
   páginas, o contêiner principal mediu `clientWidth = scrollWidth = 360px`
   (15px reservados para a barra vertical); sidebar recolhida.
3. Mesmo viewport, voluntário: Início, Entrada, Saída e Configurações sem
   overflow horizontal do contêiner principal. Shift+Tab no primeiro
   controle volta a “Sair”; Tab volta a “Fechar menu”; Escape devolve o
   foco ao botão de abertura.
4. Administrador, 768×1024 e 1280×800: sidebar permanente; navegação nas
   oito páginas preservada. Em desktop, sem overflow do contêiner principal.
5. Saída com histórico preenchido por fixture: rolar até “Mais ações”,
   abrir “Editar” e verificar modal de 320px de largura e 600px de altura,
   com conteúdo de 744px acessível por rolagem interna.

Para repetir: `npm ci`, `npm run dev -- --host 127.0.0.1 --port 5174`,
interceptar `/usuarios/me`, `/csrf` e as consultas de listagem no Playwright
e executar os cenários acima nos respectivos viewports. Essa validação não
equivale a um teste de integração com backend real nem de dispositivos físicos.

## Limitações comprovadas na base

Comparação em worktree isolado de `origin/main`, SHA `ec8a8b4`, com
`npm ci` e `npm test`:

- Base: 119 aprovados e 4 falhas em `tests/sessao.test.jsx`.
- Correção: 125 aprovados e as mesmas 4 falhas.
- Casos: manter sessão válida, reidratar sem localStorage, usar dados do
  servidor e aguardar verificação de sessão.
- Causa: o teste intercepta `apiClient.get`, mas `inicializarCsrf()` usa a
  requisição HTTP interna. Sem backend em `localhost:8080`, essa chamada
  falha com `ECONNREFUSED`. Nenhum teste foi excluído ou contornado.
- `npm run lint` na base reproduz os mesmos 5 avisos.
- Desempenho em tablet (768px) já apresenta `clientWidth=513px` e
  `scrollWidth=724px` na base e na correção; ajuste específico de tablet
  deixado fora desta correção de celular.
- `npm ci` reporta 3 vulnerabilidades de severidade alta no lockfile
  inalterado. Atualização de dependências fica fora do escopo.

Os demais problemas de UI/acessibilidade listados na BUG-15 não são
declarados resolvidos por esta alteração.

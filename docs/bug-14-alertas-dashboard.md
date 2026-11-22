# BUG-14 — alertas reais e preferências persistidas

Issue: [#47](https://github.com/projeto-ong-amar/projeto-ong-amar-frontend/issues/47).

## Comportamento e contrato

- Abrir “Alertas importantes” chama `GET /dashboard/alertas`; reabrir consulta
  novamente, respeitando alterações de dados, limites e preferências.
- Mostra carregamento, erro ou lista vazia explicitamente. Uma falha nunca
  exibe os exemplos antigos como se fossem dados reais. Respostas de uma
  abertura anterior são ignoradas.
- Configurações lê `GET /configuracoes/alertas-dashboard` e salva com PUT
  no mesmo caminho. Corpo: os booleanos `vencimentoProximo`, `estoqueBaixo`,
  `semDoacoes` e `semMovimentacao`. Sucesso só após confirmação da API.
  Falha na leitura bloqueia salvar para evitar sobrescrever com padrões.
- Preferências são globais para administradores, como as métricas de estoque,
  e não se confundem com as notificações por e-mail de cada conta.
- O alerta de vencimento conta **lotes**, com a janela de vencimento próximo;
  o cartão de risco também conta lotes, com a janela de risco configurada.
  O cartão agora carrega mesmo sem data da próxima doação.
- “Estoque Atual” foi renomeado para **Saldo no período**, mantendo o cálculo
  existente de 30 dias e o acesso à listagem de estoque atual.

O back-end deve ser publicado primeiro. Não há migração automática da chave
antiga `ong_estoque_alertas_dashboard`: ela é ignorada para não promover
preferências de um navegador à configuração global. Revisar e salvar as
opções na tela depois da atualização.

## Evidências automatizadas

- `npm test -- tests/alertas-dashboard.test.jsx`: 10 testes novos, incluindo
  integração da tela com o serviço HTTP, feedback de sucesso/erro,
  preferências desligadas, recarga do modal, paginação, resposta obsoleta,
  dados reais e risco sem data da próxima doação.
- `npm test`: 139 aprovados e 4 falhas preexistentes em `tests/sessao.test.jsx`.
  Na base isolada `d7db027`, o mesmo comando apresentou 129 aprovados e as
  mesmas 4 falhas: não encontra o botão “Sair”, com conexão real à porta 8080
  recusada no ambiente de testes. Nenhum teste antigo foi alterado/excluído.
- `npm run lint`: sem erros; os mesmos 5 avisos da base (Topbar, Historico,
  HistoricoUsuario, Configuracoes e Desempenho).
- `npm run build` e `git diff --check`: aprovados.

Validação da API e persistência em H2 no repositório do back-end:
`AlertasDashboardIntegrationTest` (6 testes). Não foi executado teste E2E
com navegador e banco de produção.

`npm ci`/`npm audit` apontam 3 vulnerabilidades altas em dependências já
presentes no lockfile (`follow-redirects`, `source-map-js`, `vite`).
Não houve alteração de dependências nesta correção.

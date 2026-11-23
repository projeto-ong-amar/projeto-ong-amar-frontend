# QA-ATUAL-01 — isolamento dos testes de sessão

Issue: #62.

## Causa e correção

`validarSessao` consulta `/usuarios/me`, aguarda `inicializarCsrf` e só então
persiste o usuário. O teste simulava `apiClient.get`, mas `/csrf` usa a função
interna `request`, não esse método público. Por isso a inicialização CSRF
acessava o backend real e as quatro verificações do botão Sair falhavam.

O teste agora simula explicitamente `inicializarCsrf`, mantendo o serviço de
autenticação real e todas as asserções anteriores. Uma guarda em
`XMLHttpRequest.send` impede tráfego real do Axios no jsdom e falha o teste
mesmo se a aplicação capturar o erro. Os mocks e storages são isolados por teste.

Também foram cobertos a ordem sessão → CSRF, a espera pelo CSRF antes da
persistência/exibição, sua falha, o logout e a ausência de inicialização CSRF
quando a sessão é inválida ou a rota é de redefinição de senha.

Não há alteração de código de produção ou contrato da API.

## Validação em 23/11/2026

Base isolada: `215c04c` (`origin/main`), dependências instaladas com `npm ci`.

| Comando | Base sem alteração | Correção |
| --- | --- | --- |
| `npm test -- tests/sessao.test.jsx` | 3 aprovados, 4 falhos | 10 aprovados |
| `npm test` | 137 aprovados, 6 falhos, 13 arquivos | 144 aprovados, 2 falhos, 13 arquivos |
| `npm run lint` | 8 avisos, sem erros | mesmos 8 avisos, sem erros |
| `npm run build` | não executado | aprovado |
| `git diff --check` | não aplicável | aprovado |

As duas falhas restantes são preexistentes em `tests/editar-historico.test.jsx`:
“abre o modal de entrada com os dados e a validade pré-preenchidos” e “abre o
modal de saída com motivo antes da data”. Ambas também falham na base ao ler
`.value` de elementos nulos (`edit-produto` e `edit-motivo`). Não foram excluídas,
alteradas ou desabilitadas; ficam fora do escopo desta issue.

`npm ci` informou três vulnerabilidades altas nas dependências já presentes.
O lockfile não foi alterado; atualização de dependências está fora deste escopo.

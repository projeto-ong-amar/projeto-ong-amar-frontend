# QA-ATUAL-02 — validação independente do idioma do navegador

Issue: #67. Base validada: `5663e420b6209f5e05f2bd4ecc2fbd861fdfcd7b`.

## Diagnóstico e correção

Login, recuperação/redefinição e as métricas/senha de Configurações ainda usavam
`form` com validação nativa, ao contrário dos cadastros e movimentações.
Esses cinco formulários agora usam `Formulario`. Recuperação declara `required`,
refletindo o bloqueio de e-mail vazio que já existia no handler.

O componente mantém `noValidate`, mas valida explicitamente antes do handler.
Obrigatório, e-mail, comprimento, limites numéricos e datas recebem mensagens
locais. Os erros são texto com `role="alert"`, associados aos respectivos campos
via `aria-describedby` e `aria-invalid`; o primeiro inválido recebe foco.
A correção por `input` ou `change` limpa o erro e preserva descrições anteriores.
Não se usa o idioma dos balões nativos.

Datas de entrada, saída e validade mantêm as mensagens de negócio em português
na criação e nas edições de Gerenciar e Histórico. Os atributos `data-erro-*`
preservam essas orientações ao validar os limites no componente; `data-min-campo`
preserva a relação validade/entrada e permite limpar um erro dependente quando
a entrada é corrigida. O formulário pode mostrar mais de um erro simultaneamente.
As verificações defensivas dos handlers foram mantidas.

Sem alteração de API, payloads, autenticação, permissões ou regras de negócio.
Filtros sem restrições e formulários apenas com switches não precisaram migrar.

## Evidências e comandos

- `npm ci`: dependências instaladas a partir do lockfile, sem modificá-lo.
- `npm test -- tests/qa-atual-02-localizacao.test.jsx`: os sete cenários novos
  falharam na base isolada (mensagem nativa `Constraints not satisfied`) e
  passaram com a correção.
- `npm test -- tests/qa-atual-02-localizacao.test.jsx tests/formulario.test.jsx tests/issue-42-validacao-datas.test.jsx tests/validacao-formularios.test.jsx tests/configuracoes-senha.test.jsx`:
  **62 aprovados**, incluindo bloqueio antes do HTTP, correção com envio válido,
  associação acessível, foco, limites de datas/números e edição pelos históricos.
- `npm test`: **159 aprovados e dois falhos**; comparação abaixo.
- `npm run lint`: código de saída zero, oito avisos também presentes na base.
- `npm run build`: aprovado.
- `git diff --check`: aprovado.

### Navegador em inglês

Playwright/Chromium, contexto novo com `locale: 'en-US'` e
`navigator.language === 'en-US'`, frontend Vite em `127.0.0.1:5175`:

1. Login vazio: `Preencha este campo.`, foco no e-mail e descrição associada.
2. Login com e-mail inválido: `Informe um e-mail válido.`; ao corrigir, mensagem
   vazia e remoção de `aria-invalid`.
3. Componente real de Configurações com API simulada: métrica `0` bloqueada com
   `Informe um valor maior ou igual a 1.`, foco e descrição; corrigir para `2`
   limpa a mensagem.
4. Componente real de Gerenciar Entrada com API simulada: entrada `2099-12-01`
   bloqueada com `A data de entrada não pode ser futura.`, foco e descrição
   associados, zero envios; corrigir a data limpa a mensagem.

Os componentes de 3/4 foram montados diretamente pelo Playwright, com métodos
do cliente HTTP simulados. Isso valida o comportamento do navegador, não
persistência real nem um E2E autenticado contra o backend.

### Falhas preexistentes e limites

Em worktree destacado de `5663e42`, com as mesmas dependências, tanto
`npm test -- tests/editar-historico.test.jsx` quanto `npm test` reproduziram:

- `abre o modal de entrada com os dados e a validade pré-preenchidos`, linha 69:
  o teste consulta `edit-produto`, mas o Histórico usa `hist-edit-produto`.
- `abre o modal de saída com motivo antes da data`, linha 80: o teste consulta
  `edit-motivo`, ausente no modal de Histórico atual.

Ambos falham com `Cannot read properties of null (reading 'value')`.
A suíte original da base teve **144 aprovados e dois falhos**. Não são
regressões desta mudança; nenhum desses testes foi removido ou afrouxado.
Os novos casos de edição usam os IDs reais dos históricos.

`npm ci` também reportou três vulnerabilidades altas na árvore de dependências;
não houve atualização de dependências nesta issue. Ausência de CI não equivale
a CI aprovado; os checks e políticas do PR devem ser conferidos antes do merge.

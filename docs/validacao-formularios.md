# Validação e mensagens de erro (BUG-11)

Os cadastros e edições de produtos e usuários e os registros e edições de
entradas/saídas usam avisos de validação em português, independentemente do
idioma do navegador. A edição de usuários pelo Histórico segue a mesma regra.
Login, recuperação/redefinição de senha e as métricas e a alteração de senha em
Configurações também usam o componente compartilhado (QA-ATUAL-02, #67).
Os erros aparecem em texto, associados via `aria-describedby` e `aria-invalid`;
o envio foca o primeiro campo inválido, sem depender de balões nativos.
Ao corrigir o campo, a mensagem customizada e a associação do erro são limpas,
preservando descrições de ajuda existentes.

Os intervalos de datas são traduzidos pelo componente. As páginas informam suas
mensagens específicas via `data-erro-min`/`data-erro-max`, e a validade referencia
a entrada por `data-min-campo` e `data-erro-relacao`. A alteração da entrada
revalida a validade relacionada. As verificações defensivas das páginas continuam
existindo; nenhuma regra de data foi relaxada.

- Nome do produto: 3–45 caracteres; unidade de medida: 1–45 caracteres.
  Os limites seguem o `ProdutoRequestDTO` da API.
- Nome do usuário: 3–255 caracteres.
- Nomes, unidades e e-mails têm espaços das extremidades removidos antes do
  envio. Senhas não são modificadas.
- Quantidade: inteiro de 1 a 2147483647 (limite do `int` da API), com `max` e
  `step` nos campos. Os serviços também validam criação e edição, antes do HTTP.
- Campos obrigatórios só com espaços não são enviados.

O cliente HTTP nunca exibe conteúdo arbitrário das respostas de erro
(`mensagem`, `message`, `error` ou texto puro). Mensagens de negócio conhecidas
são convertidas para textos locais; demais erros recebem orientação por status.
Isso evita expor DTOs, exceções, SQL, HTML ou detalhes de desserialização.
Novas mensagens específicas devem ser mapeadas explicitamente, não repassadas.
Não há alteração de endpoints, permissões ou payloads do back-end.

## Regressão

```sh
npm test -- tests/api-erros.test.js tests/validacao-formularios.test.jsx tests/formulario.test.jsx
npm test
npm run lint
npm run build
git diff --check
```

A base `b0a2038` reproduz quatro falhas em `tests/sessao.test.jsx` (os casos que
esperam o botão “Sair”). O mock de `apiClient.get` não intercepta a requisição
direta a `/csrf` de `inicializarCsrf`; a inicialização termina na tela de login.
Comparação feita em worktree destacado com as mesmas dependências. Esses testes
não foram removidos ou alterados; sua correção está fora da BUG-11.

# BUG-12 — feedback na edição de saída

Issue: #45.

O modal de edição de saída passa a ter erro próprio, exibido dentro do
formulário com `role="alert"`. Falhas mantêm o modal e os dados preenchidos;
uma nova tentativa limpa o erro anterior, e reabrir a edição começa sem erro.
A validação de data futura também utiliza esse feedback local.

O cliente HTTP preserva o saldo numérico de mensagens reconhecidas como
`Estoque insuficiente. Disponível: 11`, sem repassar texto arbitrário da API.
Quando o servidor não informa o saldo, a mensagem continua sem esse detalhe.
Não há alteração de endpoint, payload ou regra de estoque.
O tradutor é compartilhado: outros fluxos que recebem esse mesmo erro também
passam a mostrar o saldo. Exclusões e modais de outras telas ficam fora do escopo.

## Validação

- Antes da correção: 7 falhas nos testes específicos, reproduzindo erro fora
  do modal e descarte do saldo (base `cd11127179079369903ebee2d9e2b4b89e021481`).
- `npm test -- tests/saida-edicao.test.jsx tests/api-erros.test.js`: cobre
  erro no modal, saldo, preservação dos campos, correção da quantidade,
  nova tentativa bem-sucedida, reabertura, data futura e erro sem mensagem:
  21 testes aprovados.
- `npm run build`: aprovado.
- `npm run lint`: sem erros; cinco avisos já presentes na base.
- `git diff --check`: aprovado.

### Falhas preexistentes

`npm test` na base isolada acima: 90 aprovados e 4 falhos, todos em
`tests/sessao.test.jsx`, por não encontrar o botão "Sair" nos cenários de
sessão válida. A mesma suíte na correção mantém essas quatro falhas, sem
novas falhas (98 aprovados e 4 falhos). Os testes simulam `apiClient.get`, mas a restauração de sessão
também chama `inicializarCsrf`, que faz uma requisição HTTP não simulada.
Não foram alterados testes nem código de sessão para contornar esse problema.

Testes usam API simulada; não validam persistência real no back-end.

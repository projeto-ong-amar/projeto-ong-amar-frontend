# QA-ATUAL-05 — dependências vulneráveis

Issue: [#66](https://github.com/projeto-ong-amar/projeto-ong-amar-frontend/issues/66).
Triagem em 23/11/2026, base `e9736f7e50213f54795ef6ccaa772c5cb635cb62`,
Node `24.19.0`, npm `11.17.0`, Linux.

## Reprodução, cadeia e correção

`npm ci`, `npm audit --json` e
`npm ls follow-redirects source-map-js vite` reproduziram três pacotes high.
Não significa três advisories: um pacote pode agregar vários.
Todos apresentavam `fixAvailable: true`, sem necessidade de atualização major.

| Pacote | Cadeia na base | Instalado → corrigido neste PR |
| --- | --- | --- |
| follow-redirects | dependência transitiva de produção: axios 1.20.0 → follow-redirects | 1.16.0 → 1.16.3 |
| source-map-js | transitiva de desenvolvimento: vite → postcss 8.5.26 → source-map-js | 1.2.1 → 1.2.4 |
| vite | dependência direta de desenvolvimento, compartilhada por plugin-react e vitest | 8.2.1 → 8.2.6 |

Advisories retornados pelo audit, com seus intervalos afetados:

| Pacote | Advisory | Severidade e condição |
| --- | --- | --- |
| follow-redirects | [GHSA-q3jh-wrc6-jgq8](https://github.com/advisories/GHSA-q3jh-wrc6-jgq8) | high; `>=1.16.0 <1.16.1`; headers em array não têm credenciais removidas em redirecionamento entre origens |
| follow-redirects | [GHSA-8r9p-f939-6h3c](https://github.com/advisories/GHSA-8r9p-f939-6h3c) | high; `>=1.16.0 <1.16.1`; escape de regex de sensitiveHeaders |
| follow-redirects | [GHSA-mrwp-f3q8-3g9p](https://github.com/advisories/GHSA-mrwp-f3q8-3g9p) | high; `>=1.16.0 <=1.16.1`; sensitiveHeaders de outro realm descartado; correção em 1.16.2 |
| source-map-js | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | high; `>=1.0.0 <1.2.2`; DoS do event loop por offsets de source maps indexados; correção em 1.2.2 |
| vite | [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) | moderate; escape de `%` no launch-editor em Windows |
| vite | [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw) | moderate; interpretação de flags no launch-editor |
| vite | [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) | high; desvio de verificação de existência de arquivo no launch-editor em Windows |
| vite | [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) | low; execução de script entre origens via middleware customizado |
| vite | [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) | moderate; arquivos fora de server.fs.allow em caminhos coincidentes com caminhos do sistema, fora de Windows |
| vite | [GHSA-vfpm-58rq-9qcg](https://github.com/advisories/GHSA-vfpm-58rq-9qcg) | moderate; exposição dos quatro primeiros bytes de arquivos fora de server.fs via ?vite-wasm-instance |

Os seis advisories de Vite indicavam `>=8.2.0 <=8.2.3` no campo `via.range`.
A versão 8.2.6 fica fora desse intervalo, sem trocar de minor.
O manifest passa a exigir `^8.2.6`; o lockfile fixa a instalação validada.
Foram usados instalação direcionada do Vite e
`npm update follow-redirects source-map-js`, não `audit fix --force`.
O lockfile também atualiza a cadeia de build compatível: PostCSS 8.5.33,
Rolldown 1.2.19 e seus tipos/bindings opcionais, além de nanoid 3.3.20.
Nenhuma outra dependência direta foi atualizada.

## Aplicabilidade e prioridade

- **Vite (desenvolvimento):** priorizar a atualização do servidor usado por
  desenvolvedores. `vite.config.js` só habilita React; não há middleware
  customizado nem configuração explícita de `server.fs.allow`. O ambiente
  validado é Linux, portanto as condições específicas de Windows não se
  aplicam a ele; não foi feito inventário dos sistemas dos colaboradores.
  As condições dos demais alertas não foram exploradas. Não expor o servidor
  de desenvolvimento ou preview como servidor de produção.
- **source-map-js (build/desenvolvimento):** risco ao consumir source maps
  maliciosos durante processamento por ferramentas. A aplicação não recebe
  source maps de usuários nem importa esse pacote no código de runtime.
  Não há demonstração de DoS no aplicativo; corrigir a cadeia de ferramentas
  elimina a versão conhecida sem depender dessa avaliação de exposição.
- **follow-redirects (Node):** está no grafo de produção por Axios, mas o
  frontend é uma SPA de navegador. `apiClient.js` usa Axios sem adapter HTTP
  Node customizado; os redirecionamentos do navegador não são executados por
  follow-redirects. O advisory de cross-realm inclusive registra que seu caso
  não se reproduziu com Axios 1.20.0, que normaliza o array. Não se afirma
  vazamento de credenciais neste aplicativo. Atualizar a transitiva evita
  manter a versão vulnerável caso o pacote seja usado em Node no futuro.

Não foi identificada exploração, nem auditada a implantação de produção.
Audit limpo não garante ausência de vulnerabilidades desconhecidas. Repetir
o audit em futuras atualizações, incluindo devDependencies; não há alertas
residuais reportados nesta rodada.

## Validação e limites

| Comando | Resultado |
| --- | --- |
| `npm ci` após atualização | instalação reproduzível; zero vulnerabilidades reportadas |
| `npm audit --json` | zero em todas as severidades (antes: três pacotes high) |
| `npm audit --omit=dev` | zero vulnerabilidades |
| `npm test -- tests/dependencias.test.js tests/sessao.test.jsx` | 13 aprovados (3 de dependências, 10 de sessão) |
| `npm test` | 170 aprovados, 2 falhas preexistentes, 16 arquivos |
| `npm run lint` | sem erros; mesmos 8 avisos da base |
| `npm run build` | aprovado com Vite 8.2.6 |
| `npm run test:layout` | 3 aprovados: Chromium, 375×667, 768×800, 1280×800 |
| `git diff --check` | aprovado |

Os três testes de dependências inspecionam todas as cópias do lockfile e
impedem versões anteriores às correções conhecidas. O mesmo arquivo de teste
foi executado temporariamente na base isolada: **3 falhas**, uma por pacote;
com o lockfile atualizado: **3 aprovados**. Não é teste de exploração nem
substituto de audit atualizado.

As quatro falhas de sessão citadas originalmente na issue não se reproduzem:
QA-ATUAL-01 já foi integrada. As duas falhas atuais são
`tests/editar-historico.test.jsx:69,80`, nos cenários de abrir edição de
entrada e saída: `getElementById('edit-produto')` e
`getElementById('edit-motivo')` retornam null. Confirmadas antes da atualização
e em outro worktree da base exata `e9736f7`, com `npm ci` e `npm test`
(167 aprovados, mesmas 2 falhas, 15 arquivos). Não foram alterados esses
testes nem o código de edição: correção fora do escopo desta issue.

Os testes de navegador usam fixtures da API e Google Charts real; não são
E2E com backend real nem validação de produção. Foi observado o aviso já
emitido pelo Google Charts sobre versões `51`/`current`, sem falha dos testes.
As validações acima são locais; não implicam aprovação de CI no GitHub.

Não há mudança de contrato HTTP ou migração de dados. Consumidores devem
usar `npm ci` e reconstruir os artefatos com o novo lockfile.

# 📦 Sistema de Gerenciamento de Estoque — Frontend

Interface web para controle de estoque de doações. Permite gerenciar entradas, saídas, cadastro de produtos e geração de relatórios em Excel.

---

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como rodar](#como-rodar)
- [Uso sem bundler](#uso-sem-bundler)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Convenções de código](#convenções-de-código)
- [Tecnologias](#tecnologias)

---

## Sobre o projeto

Sistema desenvolvido para organizações que gerenciam doações de produtos. A interface permite que usuários acompanhem o fluxo de recebimento e distribuição de itens, visualizem relatórios de desempenho e exportem dados para Excel.

---

## Funcionalidades

- **Gerenciar Entrada** — registro de produtos recebidos com prazo de validade
- **Gerenciar Saída** — registro de distribuições de doações
- **Cadastro de Produtos** — base padronizada de itens para evitar duplicatas
- **Relatórios** — histórico de entrada, saída, desempenho e produtos cadastrados
  - Filtro por período: Hoje / 7 dias / 30 dias / Este mês / Personalizado
  - Visualização na tela ou download em Excel
- **Painel de Desempenho** — visualização de carências no estoque

---

## Estrutura de pastas

```
frontend-repo/
├── public/
│   └── index.html                    # Entry point — CSS e JS embutidos (abre direto no browser)
└── src/
    ├── assets/
    │   ├── icons/                    # SVGs de ícones
    │   ├── images/                   # Imagens e ilustrações
    │   └── fonts/                    # Fontes locais
    ├── components/
    │   ├── common/                   # Componentes reutilizáveis (Button, Modal, Badge…)
    │   ├── layout/
    │   │   ├── Sidebar.js            # Painel de navegação lateral
    │   │   └── Topbar.js             # Barra superior com breadcrumb e ações
    │   └── reports/
    │       ├── ReportCard.js         # Card de um relatório individual
    │       └── PeriodFilter.js       # Seletor de período (Hoje / 7d / 30d…)
    ├── pages/
    │   ├── App.js                    # Raiz — monta layout + página ativa
    │   └── Relatorios.js             # Lógica e composição da página Relatórios
    ├── services/
    │   └── reportsService.js         # Chamadas de API: listar relatórios e download Excel
    ├── hooks/
    │   └── useReports.js             # React hook para estado e fetching de relatórios
    ├── utils/
    │   └── formatDate.js             # Helpers de data em pt-BR e cálculo de períodos
    ├── styles/
    │   ├── global.css                # Reset + estilos base do body e layout
    │   └── variables.css             # Design tokens: cores, espaçamentos, bordas, sombras
    └── main.js                       # Ponto de entrada — chama renderApp()
```

---

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/frontend-repo.git
cd frontend-repo

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:5173`

### Build de produção

```bash
npm run build
```

Os arquivos gerados ficam em `/dist`.

---

## Uso sem bundler

O arquivo `public/index.html` tem todo o CSS embutido inline e pode ser aberto **diretamente no navegador** sem servidor ou build:

```bash
# macOS
open public/index.html

# Linux
xdg-open public/index.html

# Windows
start public/index.html
```

> Ao integrar com um bundler (Vite, Webpack), mova os estilos de volta para `src/styles/` — os caminhos relativos funcionarão via servidor de desenvolvimento.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=https://sua-api.com/api
```

No código, a URL base é referenciada em `src/services/reportsService.js`:

```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
```

---

## Convenções de código

| Item | Padrão |
|---|---|
| Componentes | `PascalCase.js` |
| Serviços e utilitários | `camelCase.js` |
| Hooks React | `use` + `PascalCase.js` |
| Classes CSS | `kebab-case` |
| Design tokens | `--kebab-case` em `variables.css` |
| Idioma de textos e comentários | Português (pt-BR) |

### Adicionando uma nova página

1. Crie `src/pages/NomeDaPagina.js`
2. Exporte uma função `async NomeDaPaginaPage(container)`
3. Importe e chame em `src/pages/App.js`
4. Adicione a rota no array `NAV_ITEMS` em `Sidebar.js`

### Adicionando um novo componente

1. Crie o arquivo na pasta adequada dentro de `src/components/`
2. Exporte uma função que retorna uma string HTML (ou JSX se migrado para React)
3. Importe na page ou componente pai

---

## Tecnologias

- **HTML5 / CSS3** — estrutura e estilo
- **JavaScript ES Modules** — sem framework, modular e extensível
- **Nunito** (Google Fonts) — tipografia principal
- **CSS Custom Properties** — design tokens centralizados
- **Fetch API** — comunicação com o backend

> O projeto foi estruturado para facilitar uma futura migração para **React** — os componentes já seguem o padrão de funções puras que retornam marcação, e o hook `useReports.js` está pronto para uso imediato.

---

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

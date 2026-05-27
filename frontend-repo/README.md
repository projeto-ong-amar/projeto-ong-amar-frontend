# Sistema de Gerenciamento de Estoque — Frontend

Interface web do sistema de controle de estoque para doações.

## Estrutura de pastas

```
frontend-repo/
├── public/
│   └── index.html                    # Entry point HTML
└── src/
    ├── assets/
    │   ├── icons/                    # SVGs de ícones
    │   ├── images/                   # Imagens e ilustrações
    │   └── fonts/                    # Fontes locais
    ├── components/
    │   ├── common/                   # Componentes reutilizáveis (Button, Modal…)
    │   ├── layout/
    │   │   ├── Sidebar.js            # Painel de navegação lateral
    │   │   └── Topbar.js             # Barra superior com breadcrumb e ações
    │   └── reports/
    │       ├── ReportCard.js         # Card de um relatório individual
    │       └── PeriodFilter.js       # Seletor de período
    ├── pages/
    │   ├── App.js                    # Raiz — monta layout + página ativa
    │   └── Relatorios.js             # Lógica da página Relatórios
    ├── services/
    │   └── reportsService.js         # Chamadas de API (listar, baixar Excel)
    ├── hooks/
    │   └── useReports.js             # React hook para estado dos relatórios
    ├── utils/
    │   └── formatDate.js             # Helpers de formatação de data
    ├── styles/
    │   ├── global.css                # Reset + estilos base
    │   └── variables.css             # Design tokens (cores, espaçamentos…)
    └── main.js                       # Ponto de entrada JS
```

## Como rodar

```bash
npm install
npm run dev    # servidor de desenvolvimento
npm run build  # build de produção
```

## Convenções

- Componentes em `PascalCase.js`
- Serviços e utilitários em `camelCase.js`
- Design tokens centralizados em `variables.css`
- Todos os textos e comentários em pt-BR

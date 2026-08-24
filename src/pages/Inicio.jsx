import { useState } from 'react';

/**
 * Início page (Home / Services hub)
 * Reuses the same icons8.com icon set as the Sidebar (blue variant, same
 * approach ReportCard/Inicio KPI cards already use to recolor icons).
 */
const SERVICES = [
  {
    key: 'gerenciar-entrada',
    badge: 'Entrada',
    title: 'Gerenciar Entrada no Estoque',
    description: 'Registre e acompanhe os produtos que entram no estoque.',
    icon: 'https://img.icons8.com/ios/50/2563EB/open-box.png', // same icon as "Gerenciar Entrada" in the sidebar
  },
  {
    key: 'cadastro-produtos',
    badge: 'Produtos',
    title: 'Cadastro de Produtos',
    description: 'Cadastre, edite e organize produtos do seu estoque.',
    icon: 'https://img.icons8.com/ios/50/2563EB/task.png', // same icon as "Cadastro de Produtos" in the sidebar
  },
  {
    key: 'gerenciar-saida',
    badge: 'Saída',
    title: 'Gerenciar Saída no Estoque',
    description: 'Registre e acompanhe os produtos que saem dos estoque.',
    icon: 'https://img.icons8.com/ios/50/2563EB/empty-box.png', // same icon as "Gerenciar Saída" in the sidebar
  },
  {
    key: 'relatorios',
    badge: 'Relatórios',
    title: 'Gerar Relatórios',
    description: 'Gere relatórios de entradas, saídas, produtos e muito mais.',
    icon: 'https://img.icons8.com/ios/50/2563EB/business-report.png', // same icon as "Relatórios" in the sidebar
  },
  {
    key: 'desempenho',
    badge: 'Dashboard',
    title: 'Visualizar Desempenho',
    description: 'Acompanhe indicadores e gráficos do desempenho do estoque.',
    icon: 'https://img.icons8.com/ios/50/2563EB/laptop-metrics--v2.png', // same icon as "Desempenho" in the sidebar
  },
  {
    key: 'cadastro-usuario',
    badge: 'Usuário',
    title: 'Cadastro de Usuário',
    description: 'Cadastre e gerencie os usuários do sistema.',
    icon: 'https://img.icons8.com/ios/50/2563EB/user-group-man-man.png', // same icon as "Cadastro de Usuário" in the sidebar
  },
];

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function Inicio({ onNavigate }) {
  const [search, setSearch] = useState('');

  const term = search.trim().toLowerCase();
  const filteredServices = term
    ? SERVICES.filter(
        (s) =>
          s.badge.toLowerCase().includes(term) ||
          s.title.toLowerCase().includes(term)
      )
    : SERVICES;

  return (
    <main className="content">
      <div className="service-search-bar">
        <div className="search-label">
          <SearchIcon />
          Buscar por Serviço
        </div>
        <div className="search-input-wrap">
          <input
            type="text"
            className="search-input"
            placeholder="Exemplo: Cadastro de Usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className="search-input-icon" />
        </div>
      </div>

      <div className="services-heading">
        <h2>Principais Serviços</h2>
        <p>Selecione um Serviço Desejado</p>
      </div>

      {filteredServices.length > 0 ? (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <button
              key={service.key}
              type="button"
              className="service-card"
              onClick={() => onNavigate?.(service.key)}
            >
              <div className="service-icon-circle">
                <img src={service.icon} alt="" />
              </div>
              <span className="service-badge">{service.badge}</span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="services-empty">Nenhum serviço encontrado para "{search}".</p>
      )}
    </main>
  );
}

export default Inicio;
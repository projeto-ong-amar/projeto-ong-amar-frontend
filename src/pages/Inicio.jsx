import { useState } from 'react';
import styles from './Inicio.module.css';

const SERVICES = [
  {
    key: 'gerenciar-entrada',
    badge: 'Entrada',
    title: 'Gerenciar Entrada no Estoque',
    description: 'Registre e acompanhe os produtos que entram no estoque.',
    icon: 'https://img.icons8.com/ios/50/2563EB/open-box.png',
  },
  {
    key: 'cadastro-produtos',
    badge: 'Produtos',
    title: 'Cadastro de Produtos',
    description: 'Cadastre, edite e organize produtos do seu estoque.',
    icon: 'https://img.icons8.com/ios/50/2563EB/task.png', 
  },
  {
    key: 'gerenciar-saida',
    badge: 'Saída',
    title: 'Gerenciar Saída no Estoque',
    description: 'Registre e acompanhe os produtos que saem dos estoque.',
    icon: 'https://img.icons8.com/ios/50/2563EB/empty-box.png',
  },
  {
    key: 'relatorios',
    badge: 'Relatórios',
    title: 'Gerar Relatórios',
    description: 'Gere relatórios de entradas, saídas, produtos e muito mais.',
    icon: 'https://img.icons8.com/ios/50/2563EB/business-report.png', 
  },
  {
    key: 'desempenho',
    badge: 'Dashboard',
    title: 'Visualizar Desempenho',
    description: 'Acompanhe indicadores e gráficos do desempenho do estoque.',
    icon: 'https://img.icons8.com/ios/50/2563EB/laptop-metrics--v2.png',
  },
  {
    key: 'cadastro-usuario',
    badge: 'Usuário',
    title: 'Cadastro de Usuário',
    description: 'Cadastre e gerencie os usuários do sistema.',
    icon: 'https://img.icons8.com/ios/50/2563EB/user-group-man-man.png', 
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
    <main className={styles.content}>
      <div className={styles.serviceSearchBar}>
        <div className={styles.searchLabel}>
          <SearchIcon />
          Buscar por Serviço
        </div>
        <div className={styles.searchInputWrap}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Exemplo: Cadastro de Usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className={styles.searchInputIcon} />
        </div>
      </div>

      <div className={styles.servicesHeading}>
        <h2>Principais Serviços</h2>
        <p>Selecione um Serviço Desejado</p>
      </div>

      {filteredServices.length > 0 ? (
        <div className={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <button
              key={service.key}
              type="button"
              className={styles.serviceCard}
              onClick={() => onNavigate?.(service.key)}
            >
              <div className={styles.serviceIconCircle}>
                <img src={service.icon} alt="" />
              </div>
              <span className={styles.serviceBadge}>{service.badge}</span>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDesc}>{service.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className={styles.servicesEmpty}>Nenhum serviço encontrado para "{search}".</p>
      )}
    </main>
  );
}

export default Inicio;

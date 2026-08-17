import logo from '../../assets/img/pca-1.png';

/**
 * Sidebar component
 * Renders the left navigation panel, matching the "index2" reference design
 * (colored icons8 icons + accessibility controls).
 *
 * @param {string}   activePage  - Key of the currently active nav item
 * @param {Function} onNavigate  - Callback invoked with the nav item key
 * @param {Function} onSair      - Callback for the "Sair" (logout) button
 */
const NAV_ITEMS = [
  { key: 'inicio', label: 'Início', icon: 'https://img.icons8.com/ios/50/home.png' },
  { key: 'gerenciar-entrada', label: 'Gerenciar Entrada', icon: 'https://img.icons8.com/ios/50/open-box.png' },
  { key: 'cadastro-produtos', label: 'Cadastro de Produtos', icon: 'https://img.icons8.com/ios/50/task.png' },
  { key: 'gerenciar-saida', label: 'Gerenciar Saída', icon: 'https://img.icons8.com/ios/50/empty-box.png' },
  { key: 'relatorios', label: 'Relatórios', icon: 'https://img.icons8.com/ios/50/business-report.png' },
  { key: 'desempenho', label: 'Desempenho', icon: 'https://img.icons8.com/ios/50/laptop-metrics--v2.png' },
  { key: 'cadastro-usuario', label: 'Cadastro de Usuário', icon: 'https://img.icons8.com/ios/50/user-group-man-man.png' },
  { key: 'configuracoes', label: 'Configurações', icon: 'https://img.icons8.com/ios/50/settings.png' },
];

function increaseFontSize() {
  document.body.style.fontSize = 'larger';
}

function decreaseFontSize() {
  document.body.style.fontSize = 'smaller';
}

export function Sidebar({ activePage = 'relatorios', onNavigate, onSair }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <img id="sidebar-logo" src={logo} alt="Logo ONG PCA" />
        </div>
        <div className="brand-info">
          <div className="brand-name">Usuário X</div>
          <div className="brand-sub">x@gmail.com</div>
        </div>
      </div>

      <div className="sidebar-label">Sistema de Estoque</div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.key}
            className={`nav-item ${item.key === activePage ? 'active' : ''}`}
            href={`#${item.key}`}
            data-page={item.key}
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.(item.key);
            }}
          >
            <img src={item.icon} alt="" />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-bottom">
        <div className="acessibilidade-box">
          <div className="acessibilidade-title">Acessibilidade</div>
          <div className="acessibilidade-group">
            <button className="btn-acesso" type="button" onClick={increaseFontSize}>
              A+
            </button>
            <button className="btn-acesso" type="button" onClick={decreaseFontSize}>
              a-
            </button>
            <button className="btn-acesso" type="button" aria-label="Alto contraste">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8.5" />
                <path d="M6 14v1.5A5.5 5.5 0 0 0 11.5 21h3a5.5 5.5 0 0 0 5.5-5.5v-3" />
              </svg>
            </button>
          </div>
        </div>

        <button className="btn-sair" id="btn-sair" onClick={onSair}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

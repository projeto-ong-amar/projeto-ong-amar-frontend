import logo from '../../assets/img/pca-1.png';
import styles from './Sidebar.module.css';

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

export function Sidebar({ activePage = 'relatorios', onNavigate, onSair, usuario }) {

  // Aumenta o tamanho da fonte até o limite de 130%
  function increaseFontSize() {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // Limite máximo proporcional (130%)
    if (currentSize < 22) {
      document.documentElement.style.fontSize = `${currentSize + 1}px`;
    }
  }

  // Diminui o tamanho da fonte até o limite de 80%
  function decreaseFontSize() {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // Limite mínimo proporcional (80%)
    if (currentSize > 12) {
      document.documentElement.style.fontSize = `${currentSize - 1}px`;
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <div className={styles.brandLogo}>
          <img id="sidebar-logo" className={styles.sidebarLogo} src={logo} alt="Logo ONG PCA" />
        </div>
        <div className={styles.brandInfo}>
          <div className={styles.brandName}>{usuario?.nome}</div>
          <div className={styles.brandSub}>{usuario?.email}</div>
        </div>
      </div>

      <div className={styles.sidebarLabel}>Sistema de Estoque</div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.key}
            className={`${styles.navItem} ${item.key === activePage ? styles.active : ''}`}
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

      <div className={styles.sidebarSpacer} />

      <div className={styles.sidebarBottom}>
        <div className={styles.acessibilidadeBox}>
          <div className={styles.acessibilidadeTitle}>Acessibilidade</div>
          <div className={styles.acessibilidadeGroup}>
            <button className={styles.btnAcesso} type="button" onClick={increaseFontSize} aria-label="Aumentar fonte">
              A+
            </button>
            <button className={styles.btnAcesso} type="button" onClick={decreaseFontSize} aria-label="Diminuir fonte">
              a-
            </button>
          </div>
        </div>

        <button className={styles.btnSair} id="btn-sair" onClick={onSair}>
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
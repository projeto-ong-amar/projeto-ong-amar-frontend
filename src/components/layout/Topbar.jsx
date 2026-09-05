import styles from './Topbar.module.css';

export function Topbar({ section = 'Relatórios', onVoltar, onAjuda }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarBreadcrumb}>
        <span>Sistema de Gerenciamento de Estoque</span>
        <span className={styles.sep}>/</span>
        <span className={styles.current}>{section}</span>
      </div>
      <div className={styles.topbarActions}>
       
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
    
        <button
          className={styles.btnVoltar}
          id="btn-voltar"
          onClick={onVoltar ?? (() => history.back())}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar
        </button>
      </div>
    </header>
  );
}

export default Topbar;

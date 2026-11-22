import { Breadcrumb } from '../common/Breadcrumb.jsx';
import styles from './Topbar.module.css';

export function Topbar({ etapas = [], onNavigate, onVoltar, onAjuda, menuAberto = false, onMenu, menuButtonRef }) {
  return (
    <header className={styles.topbar}>
      <button type="button" ref={menuButtonRef} className={styles.menuButton}
        aria-label="Abrir menu de navegação" aria-controls="menu-navegacao"
        aria-expanded={menuAberto} onClick={onMenu}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <Breadcrumb etapas={etapas} aoNavegar={onNavigate} />
      <div className={styles.topbarActions}>
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

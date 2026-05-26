import { useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";

export default function Topbar({ systemName = "Sistema de Gerenciamento de Estoque", pageName }) {
  const navigate = useNavigate();

  return (
    <header className={styles.topbar}>
      <div className={styles.breadcrumb}>
        <span className={styles.systemName}>{systemName}</span>
        {pageName && (
          <>
            <span className={styles.separator}>/</span>
            <span className={styles.pageName}>{pageName}</span>
          </>
        )}
      </div>
      <div className={styles.actions}>
        <button className={styles.btnHelp}>
          <span>?</span> Ajuda
        </button>
        <button className={styles.btnBack} onClick={() => navigate(-1)}>
          ← Voltar
        </button>
      </div>
    </header>
  );
}

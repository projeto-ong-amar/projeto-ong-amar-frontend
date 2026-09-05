// Este componente só é usado dentro da tela de Relatórios, então
// reaproveita o CSS Module da própria tela em vez de ter um módulo à parte.
import styles from '../../pages/Relatorios.module.css';


const REPORT_ICONS = {
  entrada: 'https://img.icons8.com/ios/50/059669/open-box.png',
  saida: 'https://img.icons8.com/ios/50/D97706/empty-box.png',
  desempenho: 'https://img.icons8.com/ios/50/2563EB/laptop-metrics--v2.png',
  produtos: 'https://img.icons8.com/ios/50/10B981/task.png',
};

const ICON_CLASS_MAP = {
  'icon-green': styles.iconGreen,
  'icon-orange': styles.iconOrange,
  'icon-blue': styles.iconBlue,
  'icon-teal': styles.iconTeal,
};

export function ReportCard({ report, onVer, onBaixar, downloading = false }) {
  const iconSrc = REPORT_ICONS[report.id];
  const iconVariantClass = ICON_CLASS_MAP[report.iconClass] ?? '';

  return (
    <div className={styles.reportCard} data-id={report.id}>
      <div className={`${styles.reportIcon} ${iconVariantClass}`}>
        {iconSrc && <img src={iconSrc} alt="" />}
      </div>
      <div className={styles.reportInfo}>
        <h3>{report.title}</h3>
        <p>{report.description}</p>
      </div>
      <div className={styles.reportActions}>
        <button className={styles.btnVer} data-id={report.id} onClick={() => onVer?.(report.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Ver Relatório
        </button>
        <button
          className={styles.btnBaixar}
          data-id={report.id}
          disabled={downloading}
          onClick={() => onBaixar?.(report.id)}
        >
          <div className={styles.btnBaixarInner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? 'Baixando…' : 'Baixar arquivo'}
          </div>
          <span className={styles.excelLabel}>(PDF)</span>
        </button>
      </div>
    </div>
  );
}

export default ReportCard;

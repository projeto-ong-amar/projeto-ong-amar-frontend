import styles from '../../pages/Relatorios.module.css';


const REPORT_VISUALS = {
  entrada: { corClasse: 'iconGreen', icone: 'https://img.icons8.com/ios/50/16A34A/open-box.png' },
  saida: { corClasse: 'iconOrange', icone: 'https://img.icons8.com/ios/50/EA580C/open-box.png' },
  desempenho: { corClasse: 'iconBlue', icone: 'https://img.icons8.com/ios/50/2563EB/bar-chart.png' },
  produtos: { corClasse: 'iconTeal', icone: 'https://img.icons8.com/ios/50/0D9488/clipboard.png' },
};

const CORES_POR_ICON_CLASS = {
  'icon-green': 'iconGreen',
  'icon-orange': 'iconOrange',
  'icon-blue': 'iconBlue',
  'icon-teal': 'iconTeal',
};

const ICONE_PADRAO = 'https://img.icons8.com/ios/50/6B7280/file.png';

export function ReportCard({ report, onBaixar, downloading }) {
  const visual = REPORT_VISUALS[report.id];
  const nomeClasseCor = visual?.corClasse || CORES_POR_ICON_CLASS[report.iconClass] || 'iconBlue';
  const icone = visual?.icone || ICONE_PADRAO;

  return (
    <div className={styles.reportCard}>
      <div className={`${styles.reportIcon} ${styles[nomeClasseCor]}`}>
        <img src={icone} alt="" />
      </div>

      <div className={styles.reportInfo}>
        <h3>{report.title}</h3>
        <p>{report.description}</p>
      </div>

      <div className={styles.reportActions}>
        <button
          type="button"
          className={styles.btnBaixar}
          onClick={() => onBaixar(report.id)}
          disabled={downloading}
        >
          <span className={styles.btnBaixarInner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            {downloading ? 'Gerando...' : 'Baixar Arquivo em'}
          </span>
          <span className={styles.excelLabel}>PDF</span>
        </button>
      </div>
    </div>
  );
}

export default ReportCard;
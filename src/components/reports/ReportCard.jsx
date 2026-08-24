/**
 * ReportCard component
 * Renders a single report row with icon, description and action buttons.
 *
 * @param {Object}   report
 * @param {string}   report.id          - Unique identifier
 * @param {string}   report.title       - Report title
 * @param {string}   report.description - Short description
 * @param {string}   report.iconClass   - CSS colour variant class (icon-green | icon-orange | icon-blue | icon-teal)
 * @param {Function} onVer              - Callback invoked with the report id
 * @param {Function} onBaixar           - Callback invoked with the report id
 * @param {boolean}  downloading        - Whether this report's download is in flight
 */
const REPORT_ICONS = {
  entrada: 'https://img.icons8.com/ios/50/059669/open-box.png',
  saida: 'https://img.icons8.com/ios/50/D97706/empty-box.png',
  desempenho: 'https://img.icons8.com/ios/50/2563EB/laptop-metrics--v2.png',
  produtos: 'https://img.icons8.com/ios/50/10B981/task.png',
};

export function ReportCard({ report, onVer, onBaixar, downloading = false }) {
  const iconSrc = REPORT_ICONS[report.id];

  return (
    <div className="report-card" data-id={report.id}>
      <div className={`report-icon ${report.iconClass}`}>
        {iconSrc && <img src={iconSrc} alt="" />}
      </div>
      <div className="report-info">
        <h3>{report.title}</h3>
        <p>{report.description}</p>
      </div>
      <div className="report-actions">
        <button className="btn-ver" data-id={report.id} onClick={() => onVer?.(report.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Ver Relatório
        </button>
        <button
          className="btn-baixar"
          data-id={report.id}
          disabled={downloading}
          onClick={() => onBaixar?.(report.id)}
        >
          <div className="btn-baixar-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? 'Baixando…' : 'Baixar arquivo'}
          </div>
          <span className="excel-label">(PDF)</span>
        </button>
      </div>
    </div>
  );
}

export default ReportCard;
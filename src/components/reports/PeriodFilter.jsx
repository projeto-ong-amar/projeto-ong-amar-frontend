
import styles from '../../pages/Relatorios.module.css';

const PERIODS = [
  { key: 'hoje', label: 'Hoje' },
  { key: '7dias', label: '7 dias' },
  { key: '30dias', label: '30 dias' },
  { key: 'este-mes', label: 'Este mês' },
];

export function PeriodFilter({ active = '30dias', onChange }) {
  return (
    <div className={styles.periodBar}>
      <div className={styles.periodLabel}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Período do relatório:
      </div>
      <div className={styles.periodOptions}>
        {PERIODS.map((p) => (
          <button
            key={p.key}
            className={`${styles.periodBtn} ${p.key === active ? styles.active : ''}`}
            data-period={p.key}
            onClick={() => onChange?.(p.key)}
          >
            {p.label}
          </button>
        ))}
        <button
          className={styles.periodCustom}
          data-period="personalizado"
          onClick={() => onChange?.('personalizado')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Personalizado
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PeriodFilter;

import styles from "./PeriodSelector.module.css";

const PERIODS = ["Hoje", "7 dias", "30 dias", "Este mês"];

export default function PeriodSelector({ value, onChange }) {
  return (
    <div className={styles.bar}>
      <div className={styles.label}>
        📅 Período do relatório:
      </div>
      <div className={styles.tabs}>
        {PERIODS.map((p) => (
          <button
            key={p}
            className={`${styles.tab} ${value === p ? styles.active : ""}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <button className={styles.custom}>📅 Personalizado ▾</button>
    </div>
  );
}

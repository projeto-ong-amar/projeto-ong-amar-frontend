import Button from "../ui/Button.jsx";
import { relatoriosService } from "../../services/relatorios.service.js";
import styles from "./ReportCard.module.css";

export default function ReportCard({ icon, iconBg, title, description, tipo, periodo }) {
  function handleDownload() {
    relatoriosService.downloadExcel(tipo, periodo);
  }

  return (
    <div className={styles.card}>
      <div className={styles.icon} style={{ background: iconBg }}>{icon}</div>
      <div className={styles.info}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.actions}>
        <Button variant="primary">👁 Ver Relatório</Button>
        <Button variant="outline" onClick={handleDownload}>
          <span>
            ⬇ Baixar arquivo
            <small style={{ display: "block", fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>
              (Excel)
            </small>
          </span>
        </Button>
      </div>
    </div>
  );
}

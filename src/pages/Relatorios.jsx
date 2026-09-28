import { useRef, useState } from 'react';
import { PeriodFilter } from '../components/reports/PeriodFilter.jsx';
import { ReportCard } from '../components/reports/ReportCard.jsx';
import { useReports } from '../hooks/useReports.js';
import { baixarRelatorioIA } from '../services/reportsService.js';
import styles from './Relatorios.module.css';

export function RelatoriosPage() {
  const { reports, loading, error, period, setPeriod } = useReports();
  const [downloadingId, setDownloadingId] = useState(null);
  const controladorRef = useRef(null);

  async function handleBaixar(id) {
    setDownloadingId(id);
    const controlador = new AbortController();
    controladorRef.current = controlador;

    try {
      const { blob, filename } = await baixarRelatorioIA(id, controlador.signal);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.name !== 'AbortError') {
        alert('Não foi possível baixar o relatório. Verifique se o servidor está disponível.');
        console.error(err);
      }
    } finally {
      setDownloadingId(null);
      controladorRef.current = null;
    }
  }

  function handleCancelarDownload() {
    controladorRef.current?.abort();
    setDownloadingId(null);
  }

  return (
    <main className={styles.content}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <circle cx="12" cy="14" r="3" />
            <path d="M12 11v-1M12 17v-1M9.5 12.5l-.7-.7M15.2 15.2l-.7-.7M9 14H8M16 14h-1M9.5 15.5l-.7.7M15.2 12.8l-.7.7" />
          </svg>
        </div>
        <div>
          <h1>Relatórios</h1>
          <p>Escolha o relatório que deseja visualizar. Você pode ver na tela ou baixar em Excel.</p>
        </div>
      </div>

      <PeriodFilter active={period} onChange={setPeriod} />

      {loading && <p>Carregando relatórios…</p>}
      {error && <p className={styles.error}>Erro ao carregar relatórios: {error}</p>}

      {!loading && !error && (
        <div className={styles.reportsList}>
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onBaixar={handleBaixar}
              downloading={downloadingId === report.id}
            />
          ))}
        </div>
      )}

      {downloadingId && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingCard}>
            <button
              type="button"
              className={styles.loadingFechar}
              aria-label="Cancelar geração do relatório"
              onClick={handleCancelarDownload}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className={styles.modalSpinner} />
            <p className={styles.loadingTitle}>Gerando relatório...</p>
            <p className={styles.loadingSub}>Aguarde enquanto a IA processa sua solicitação.</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default RelatoriosPage;
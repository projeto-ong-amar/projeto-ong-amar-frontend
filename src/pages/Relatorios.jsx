import { useRef, useState } from 'react';
import { PeriodFilter } from '../components/reports/PeriodFilter.jsx';
import { ReportCard } from '../components/reports/ReportCard.jsx';
import { ReportPreviewModal } from '../components/reports/ReportPreviewModal.jsx';
import { useReports } from '../hooks/useReports.js';
import { baixarRelatorioIA, buscarRelatorioIA } from '../services/reportsService.js';
import { getPeriodRange } from '../utils/formatDate.js';
import styles from './Relatorios.module.css';

const PREVIEW_INICIAL = { open: false, reportId: null, data: null, loading: false, error: null };
const TEMPO_LIMITE_IA_MS = 90000;

export function RelatoriosPage() {
  const { reports, loading, error, period, setPeriod } = useReports();
  const [downloadingId, setDownloadingId] = useState(null);
  const [preview, setPreview] = useState(PREVIEW_INICIAL);
  const controladorRef = useRef(null);
  const previewControladorRef = useRef(null);

  const periodRange = getPeriodRange(period);
  const reportPreview = reports.find((report) => report.id === preview.reportId) || null;

  async function handleBaixar(id) {
    setDownloadingId(id);
    const controlador = new AbortController();
    controladorRef.current = controlador;
    let tempoEsgotado = false;
    const temporizador = setTimeout(() => {
      tempoEsgotado = true;
      controlador.abort();
    }, TEMPO_LIMITE_IA_MS);

    try {
      const { blob, filename } = await baixarRelatorioIA(id, periodRange, controlador.signal);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (tempoEsgotado) {
        alert('A geração do relatório demorou demais. Tente novamente.');
      } else if (err.name !== 'AbortError') {
        alert('Não foi possível baixar o relatório. Verifique se o servidor está disponível.');
        console.error(err);
      }
    } finally {
      clearTimeout(temporizador);
      setDownloadingId(null);
      controladorRef.current = null;
    }
  }

  function handleCancelarDownload() {
    controladorRef.current?.abort();
    setDownloadingId(null);
  }

  async function handleVisualizar(id) {
    previewControladorRef.current?.abort();
    const controlador = new AbortController();
    previewControladorRef.current = controlador;
    let tempoEsgotado = false;
    const temporizador = setTimeout(() => {
      tempoEsgotado = true;
      controlador.abort();
    }, TEMPO_LIMITE_IA_MS);

    setPreview({ open: true, reportId: id, data: null, loading: true, error: null });

    try {
      const data = await buscarRelatorioIA(id, periodRange, controlador.signal);
      if (!controlador.signal.aborted) {
        setPreview((atual) => ({ ...atual, data, loading: false }));
      }
    } catch (err) {
      if (tempoEsgotado) {
        setPreview((atual) => ({
          ...atual,
          loading: false,
          error: 'A geração do relatório demorou demais. Tente novamente.',
        }));
      } else if (err.name !== 'AbortError') {
        setPreview((atual) => ({ ...atual, loading: false, error: err.message }));
      }
    } finally {
      clearTimeout(temporizador);
      if (previewControladorRef.current === controlador) {
        previewControladorRef.current = null;
      }
    }
  }

  function handleFecharPreview() {
    previewControladorRef.current?.abort();
    previewControladorRef.current = null;
    setPreview(PREVIEW_INICIAL);
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
          <p>Escolha o relatório que deseja visualizar. Você pode ver na tela ou baixar em PDF.</p>
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
              onVisualizar={handleVisualizar}
              downloading={downloadingId === report.id}
              visualizando={preview.loading && preview.reportId === report.id}
            />
          ))}
        </div>
      )}

      <ReportPreviewModal
        open={preview.open}
        report={reportPreview}
        data={preview.data}
        loading={preview.loading}
        error={preview.error}
        onClose={handleFecharPreview}
        onBaixar={handleBaixar}
        downloading={preview.reportId != null && downloadingId === preview.reportId}
      />

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

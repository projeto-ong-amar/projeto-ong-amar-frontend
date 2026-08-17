import { PeriodFilter } from '../components/reports/PeriodFilter.jsx';
import { ReportCard } from '../components/reports/ReportCard.jsx';
import { useReports } from '../hooks/useReports.js';

/**
 * Relatórios page
 * Composes PeriodFilter + ReportCard list, using the useReports hook
 * for state (list, loading, period selection).
 */
export function RelatoriosPage() {
  const { reports, loading, error, period, setPeriod } = useReports();

  return (
    <main className="content">
      <div className="page-header">
        <div className="page-header-icon">
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
      {error && <p className="error">Erro ao carregar relatórios: {error}</p>}

      {!loading && !error && (
        <div className="reports-list">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onVer={(id) => console.log('Ver:', id)}
              onBaixar={(id) => console.log('Baixar:', id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default RelatoriosPage;

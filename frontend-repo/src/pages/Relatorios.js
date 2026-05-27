import { PeriodFilter } from '../components/reports/PeriodFilter.js';
import { ReportCard }   from '../components/reports/ReportCard.js';
import { fetchReports } from '../services/reportsService.js';

/**
 * Relatórios page
 * Composes PeriodFilter + ReportCard list and wires up event listeners.
 *
 * @param {HTMLElement} container - Mount target
 */
export async function RelatoriosPage(container) {
  const reports = await fetchReports();

  const cardsHTML = reports.map(r => ReportCard({ report: r })).join('');

  container.innerHTML = `
    <main class="content">
      <div class="page-header">
        <div class="page-header-icon"></div>
        <div>
          <h1>Relatórios</h1>
          <p>Escolha o relatório que deseja visualizar. Você pode ver na tela ou baixar em Excel.</p>
        </div>
      </div>
      ${PeriodFilter({ active: '30dias' })}
      <div class="reports-list">${cardsHTML}</div>
    </main>
  `;

  // Period toggle
  container.querySelectorAll('[data-period]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      if (btn.classList.contains('period-btn')) btn.classList.add('active');
    });
  });

  // Report actions
  container.querySelectorAll('.btn-ver').forEach(btn =>
    btn.addEventListener('click', () => console.log('Ver:', btn.dataset.id))
  );
  container.querySelectorAll('.btn-baixar').forEach(btn =>
    btn.addEventListener('click', () => console.log('Baixar:', btn.dataset.id))
  );
}

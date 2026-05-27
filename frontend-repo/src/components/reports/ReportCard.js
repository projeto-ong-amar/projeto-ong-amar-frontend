/**
 * ReportCard component
 * Renders a single report row with icon, description and action buttons.
 *
 * @param {Object} report
 * @param {string} report.id          - Unique identifier
 * @param {string} report.title       - Report title
 * @param {string} report.description - Short description
 * @param {string} report.iconClass   - CSS colour variant class
 */
export function ReportCard({ report }) {
  return `
    <div class="report-card" data-id="${report.id}">
      <div class="report-icon ${report.iconClass}"></div>
      <div class="report-info">
        <h3>${report.title}</h3>
        <p>${report.description}</p>
      </div>
      <div class="report-actions">
        <button class="btn-ver"    data-id="${report.id}">👁 Ver Relatório</button>
        <button class="btn-baixar" data-id="${report.id}">
          ↓ Baixar arquivo<br/><span class="excel-label">(Excel)</span>
        </button>
      </div>
    </div>
  `;
}

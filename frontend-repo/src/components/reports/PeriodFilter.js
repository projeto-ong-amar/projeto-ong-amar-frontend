/**
 * PeriodFilter component
 * Period selector bar used on the Reports page.
 *
 * @param {string} active - Currently active period key
 */
const PERIODS = [
  { key: 'hoje',     label: 'Hoje' },
  { key: '7dias',    label: '7 dias' },
  { key: '30dias',   label: '30 dias' },
  { key: 'este-mes', label: 'Este mês' },
];

export function PeriodFilter({ active = '30dias' }) {
  const buttons = PERIODS.map(p => `
    <button class="period-btn ${p.key === active ? 'active' : ''}"
            data-period="${p.key}">${p.label}</button>
  `).join('');

  return `
    <div class="period-bar">
      <div class="period-label">📅 Período do relatório:</div>
      <div class="period-options">
        ${buttons}
        <button class="period-custom" data-period="personalizado">
          📅 Personalizado ▾
        </button>
      </div>
    </div>
  `;
}

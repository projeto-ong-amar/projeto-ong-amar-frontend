/**
 * formatDate
 * Formats a Date or ISO string to pt-BR locale.
 *
 * @param {Date|string} date
 * @param {Object}      options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    ...options,
  });
}

/**
 * getPeriodRange
 * Returns { start, end } Date objects for a given period key.
 *
 * @param {string} period - "hoje" | "7dias" | "30dias" | "este-mes"
 * @returns {{ start: Date, end: Date }}
 */
export function getPeriodRange(period) {
  const end   = new Date();
  const start = new Date();
  switch (period) {
    case 'hoje':     break;
    case '7dias':    start.setDate(end.getDate() - 7);  break;
    case '30dias':   start.setDate(end.getDate() - 30); break;
    case 'este-mes': start.setDate(1);                  break;
    default:         start.setDate(end.getDate() - 30);
  }
  return { start, end };
}

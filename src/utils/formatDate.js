export function formatDate(date, options = {}) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    ...options,
  });
}

function toISODate(date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function getPeriodRange(period) {
  if (!period || period === '30dias') return null;

  if (typeof period === 'object') {
    if (period.tipo !== 'personalizado' || !period.dataInicio || !period.dataFim) return null;
    return { dataInicio: period.dataInicio, dataFim: period.dataFim };
  }

  const end = new Date();
  const start = new Date();

  switch (period) {
    case 'hoje':
      break;
    case 'semana':
      start.setDate(end.getDate() - ((end.getDay() + 6) % 7));
      break;
    case 'mes':
      start.setDate(1);
      break;
    case 'ano':
      start.setMonth(0, 1);
      break;
    default:
      return null;
  }

  return { dataInicio: toISODate(start), dataFim: toISODate(end) };
}

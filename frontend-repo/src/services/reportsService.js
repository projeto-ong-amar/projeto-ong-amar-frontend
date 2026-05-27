/**
 * reportsService
 * All API calls related to reports.
 * Replace BASE_URL and endpoints to match your backend.
 */
const BASE_URL = '/api';

/**
 * Fetch available reports list.
 * @returns {Promise<Array>}
 */
export async function fetchReports() {
  // TODO: replace mock with real fetch
  // const res = await fetch(`${BASE_URL}/reports`);
  // return res.json();

  return [
    {
      id: 'entrada',
      title: 'Histórico de Entrada',
      description: 'Controlar o fluxo de recebimento e monitorar prazos de validade para garantir que os produtos sejam distribuídos em tempo hábil.',
      iconClass: 'icon-green',
    },
    {
      id: 'saida',
      title: 'Histórico de Saída',
      description: 'Monitorar o destino das doações e garantir que a distribuição esteja ocorrendo conforme o planejado.',
      iconClass: 'icon-orange',
    },
    {
      id: 'desempenho',
      title: 'Painel de Desempenho',
      description: 'Facilitar a visualização de carências no estoque e auxiliar no planejamento de novas arrecadações.',
      iconClass: 'icon-blue',
    },
    {
      id: 'produtos',
      title: 'Histórico de Produtos Cadastrados',
      description: 'Servir como base de dados para garantir que os itens sejam registrados de forma padronizada.',
      iconClass: 'icon-teal',
    },
  ];
}

/**
 * Download a report as Excel.
 * @param {string} reportId
 * @param {string} period
 * @returns {Promise<Blob>}
 */
export async function downloadReportExcel(reportId, period) {
  const res = await fetch(`${BASE_URL}/reports/${reportId}/export?period=${period}`);
  if (!res.ok) throw new Error('Download failed');
  return res.blob();
}

/**
 * reportsService
 * All API calls related to reports.
 */

/**
 * Fetch available reports list.
 * @returns {Promise<Array>}
 */
export async function fetchReports() {
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

const ASSISTANT_BASE_URL = 'http://localhost:8080';

/**
 * Maps each report id to the assistant endpoint, the prompt sent to it,
 * and the filename used for the downloaded PDF — matching the original
 * index.html's baixarRelatorioEntrada/Saida/Desempenho/Produtos functions.
 */
const REPORT_AI_CONFIG = {
  entrada: {
    endpoint: '/assistente/relatorio/entradas/pdf',
    texto: 'Gere um relatório das entradas destacando picos e produtos mais recebidos.',
    filename: 'relatorio-entradas.pdf',
  },
  saida: {
    endpoint: '/assistente/relatorio/saidas/pdf',
    texto: 'Quero um relatório das saídas com foco em itens que mais saíram e possíveis riscos de falta.',
    filename: 'relatorio-saidas.pdf',
  },
  desempenho: {
    endpoint: '/assistente/relatorio/desempenho-geral/pdf',
    texto: 'Faça uma análise geral do desempenho do estoque e recomende ações prioritárias.',
    filename: 'relatorio-desempenho.pdf',
  },
  produtos: {
    endpoint: '/assistente/relatorio/produtos-cadastrados/pdf',
    texto: 'Mostre o histórico de produtos cadastrados e destaque categorias com mais cadastros.',
    filename: 'relatorio-produtos-cadastrados.pdf',
  },
};

/**
 * Asks the AI assistant backend to generate a report PDF and returns it
 * along with the filename it should be saved as.
 * @param {string} reportId - one of: entrada | saida | desempenho | produtos
 * @returns {Promise<{ blob: Blob, filename: string }>}
 */
export async function baixarRelatorioIA(reportId) {
  const config = REPORT_AI_CONFIG[reportId];
  if (!config) throw new Error(`Relatório desconhecido: ${reportId}`);

  const response = await fetch(`${ASSISTANT_BASE_URL}${config.endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto: config.texto }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao baixar relatório: ${response.status}`);
  }

  const blob = await response.blob();
  return { blob, filename: config.filename };
}
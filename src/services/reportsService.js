import { apiClient } from './apiClient.js';

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


export async function baixarRelatorioIA(reportId) {
  const config = REPORT_AI_CONFIG[reportId];
  if (!config) throw new Error(`Relatório desconhecido: ${reportId}`);

  const blob = await apiClient.postBlob(config.endpoint, { pergunta: config.texto });
  return { blob, filename: config.filename };
}
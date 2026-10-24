import { apiClient } from "./apiClient";

export function getDadosGraficoBarra() {
  return apiClient.get('/dashboard/movimentacoes-por-mes')
}

export function getDadosGraficoPizza() {
  return apiClient.get('/dashboard/estoque-por-tipo')
}

export function getDadosGraficoLinha() {
  return apiClient.get('/dashboard/estoque-fechamento-por-mes')
}

export function getKPIEstoque(dataProximaDoacao) {
  return apiClient.get('/dashboard/kpi-estoque-atual', {
    params: { dataProximaDoacao }
  })
}

export function getKPIRiscoVencimento(dataProximaDoacao) {
  return apiClient.get('/dashboard/kpi-risco-vencimento', {
    params: { dataProximaDoacao }
  })
}

export function getListaRiscoVencimento(dataProximaDoacao) {
  return apiClient.get('/dashboard/modal-kpi-risco-vencimento', {
    params: { dataProximaDoacao }
  })
}

export function getListaEstoqueAtual() {
  return apiClient.get('/dashboard/estoque-atual-por-produto');
}

export function getKPIDoacoesRecebidas(dataProximaDoacao) {
  return apiClient.get('/dashboard/kpi-doacoes-recebidas', {
    params: { dataProximaDoacao }
  })
}

export function getKPIItensDistribuidos(dataProximaDoacao) {
  return apiClient.get('/dashboard/kpi-itens-distribuidos', {
    params: { dataProximaDoacao }
  })
}
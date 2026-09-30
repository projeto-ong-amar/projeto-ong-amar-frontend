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
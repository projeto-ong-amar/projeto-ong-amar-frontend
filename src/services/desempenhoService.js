import { apiClient } from "./apiClient";

export function getDadosGraficoBarra() {
  return apiClient.get('/dashboard/movimentacoes-por-mes')
}
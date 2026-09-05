import { apiClient } from './apiClient.js';


export function listarHistoricoEntrada(page = 0, size = 10) {
  return apiClient.get(`/movimentacao/entrada/historico?page=${page}&size=${size}`);
}

export function registrarEntrada({ quantidade, dataEntrada, dataValidade, motivo, fkProduto, fkUsuario }) {
  return apiClient.post('/movimentacao/entrada', {
    quantidade,
    dataEntrada,
    dataValidade,
    motivo,
    fkProduto,
    fkUsuario,
  });
}

export function atualizarEntrada(id, { quantidade, dataEntrada, dataValidade, motivo, fkProduto, fkUsuario }) {
  return apiClient.put(`/movimentacao/entrada/${id}`, {
    quantidade,
    dataEntrada,
    dataValidade,
    motivo,
    fkProduto,
    fkUsuario,
  });
}

export function removerEntrada(id) {
  return apiClient.delete(`/movimentacao/entrada/${id}`);
}

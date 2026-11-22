import { apiClient } from './apiClient.js';
import { validarQuantidade } from '../utils/validacao.js';

export function listarHistoricoSaida(page = 0, size = 10) {
  return apiClient.get(`/movimentacao/saida/historico?page=${page}&size=${size}`);
}

export function registrarSaida({ quantidade, dataSaida, motivo, fkProduto, fkUsuario }) {
  return apiClient.post('/movimentacao/saida', {
    quantidade: validarQuantidade(quantidade),
    dataSaida,
    motivo,
    fkProduto,
    fkUsuario,
  });
}

export function atualizarSaida(id, { quantidade, dataSaida, motivo, fkProduto, fkUsuario }) {
  return apiClient.put(`/movimentacao/saida/${id}`, {
    quantidade: validarQuantidade(quantidade),
    dataSaida,
    motivo,
    fkProduto,
    fkUsuario,
  });
}

export function removerSaida(id) {
  return apiClient.delete(`/movimentacao/saida/${id}`);
}

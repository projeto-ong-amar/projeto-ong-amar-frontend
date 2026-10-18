import { apiClient } from './apiClient.js';



export function listarProdutos() {
  return apiClient.get('/produtos');
}

export function cadastrarProduto({ nome, categoria, unidadeMedida }) {
  return apiClient.post('/produtos', { nome, categoria, unidadeMedida });
}

export function atualizarProduto(id, { nome, categoria, unidadeMedida }) {
  return apiClient.put(`/produtos/${id}`, { nome, categoria, unidadeMedida });
}

export function removerProduto(id) {
  return apiClient.delete(`/produtos/${id}`);
}

import { apiClient } from './apiClient.js';



export function listarProdutos() {
  return apiClient.get('/produtos');
}

export function listarCategorias() {
  return apiClient.get('/categoria');
}

export function cadastrarProduto({ nome, unidadeMedida, fkCategoria }) {
  return apiClient.post('/produtos', { nome, unidadeMedida, fkCategoria });
}

export function atualizarProduto(id, { nome, unidadeMedida, fkCategoria }) {
  return apiClient.put(`/produtos/${id}`, { nome, unidadeMedida, fkCategoria });
}

export function removerProduto(id) {
  return apiClient.delete(`/produtos/${id}`);
}

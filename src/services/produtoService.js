import { apiClient } from './apiClient.js';



export function listarProdutos() {
  return apiClient.get('/produtos');
}

export function listarCategorias() {
  return apiClient.get('/categoria');
}

export function cadastrarProduto({ nome, unidadeMedida, fkCategoria, dataCadastro }) {
  return apiClient.post('/produtos', { nome, unidadeMedida, fkCategoria, dataCadastro });
}

export function atualizarProduto(id, { nome, unidadeMedida, fkCategoria, dataCadastro }) {
  return apiClient.put(`/produtos/${id}`, { nome, unidadeMedida, fkCategoria, dataCadastro });
}

export function removerProduto(id) {
  return apiClient.delete(`/produtos/${id}`);
}

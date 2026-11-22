import { apiClient } from './apiClient.js';
import { validarTexto, TAMANHO_TEXTO_PRODUTO } from '../utils/validacao.js';



export function listarProdutos() {
  return apiClient.get('/produtos');
}

export function cadastrarProduto({ nome, categoria, unidadeMedida }) {
  return apiClient.post('/produtos', normalizarProduto({ nome, categoria, unidadeMedida }));
}

export function atualizarProduto(id, { nome, categoria, unidadeMedida }) {
  return apiClient.put(`/produtos/${id}`, normalizarProduto({ nome, categoria, unidadeMedida }));
}

function normalizarProduto({ nome, categoria, unidadeMedida }) {
  return {
    nome: validarTexto(nome, 'O nome do produto', 3, TAMANHO_TEXTO_PRODUTO),
    categoria,
    unidadeMedida: validarTexto(unidadeMedida, 'A unidade de medida', 1, TAMANHO_TEXTO_PRODUTO),
  };
}

export function removerProduto(id) {
  return apiClient.delete(`/produtos/${id}`);
}

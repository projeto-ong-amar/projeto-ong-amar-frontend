import { apiClient } from './apiClient.js';
import { validarTexto } from '../utils/validacao.js';


export function listarUsuarios(tipoUsuario) {
  const query = tipoUsuario ? `?tipoUsuario=${encodeURIComponent(tipoUsuario)}` : '';
  return apiClient.get(`/usuarios${query}`);
}


export function atualizarUsuario(id, { nome, email, senha, tipoUsuario, status }) {
  validarIdUsuario(id);
  return apiClient.put(`/usuarios/${id}`, {
    nome: validarTexto(nome, 'O nome do usuário', 3, 255),
    email: email?.trim(), senha, tipoUsuario, status,
  });
}

export function removerUsuario(id) {
  validarIdUsuario(id);
  return apiClient.delete(`/usuarios/${id}`);
}

function validarIdUsuario(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Usuário sem identificador válido. Atualize a página e tente novamente.');
  }
}

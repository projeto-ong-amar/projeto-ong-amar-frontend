import { apiClient } from './apiClient.js';


export function listarUsuarios(tipoUsuario) {
  const query = tipoUsuario ? `?tipoUsuario=${encodeURIComponent(tipoUsuario)}` : '';
  return apiClient.get(`/usuarios${query}`);
}


export function atualizarUsuario(id, { nome, email, senha, tipoUsuario, status }) {
  return apiClient.put(`/usuarios/${id}`, { nome, email, senha, tipoUsuario, status });
}

export function removerUsuario(id) {
  return apiClient.delete(`/usuarios/${id}`);
}

import { apiClient } from './apiClient.js';

const CHAVE_USUARIO = 'usuarioLogado';

export async function login(email, senha) {
  const usuario = await apiClient.post('/usuarios/login', { email, senha });

  localStorage.setItem(CHAVE_USUARIO, JSON.stringify({
    id: usuario.userId,
    nome: usuario.nome,
    email: usuario.email,
  }));
  localStorage.setItem('loggedIn', 'true');
  return usuario;
}

export async function logout() {
  try {
    await apiClient.post('/usuarios/logout');
  } finally {
    localStorage.removeItem(CHAVE_USUARIO);
    localStorage.removeItem('loggedIn');
  }
}

export function getUsuarioLogado() {
  const bruto = localStorage.getItem(CHAVE_USUARIO);
  return bruto ? JSON.parse(bruto) : null;
}
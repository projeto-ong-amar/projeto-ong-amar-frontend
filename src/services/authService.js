import { apiClient, inicializarCsrf } from './apiClient.js';

const CHAVE_USUARIO = 'usuarioLogado';
export const EVENTO_SESSAO_ENCERRADA = 'sessao-encerrada';

function normalizarUsuario(usuario) {
  return {
    id: usuario.id ?? usuario.userId,
    nome: usuario.nome,
    email: usuario.email,
  };
}

function salvarUsuario(usuario) {
  const usuarioParaExibicao = normalizarUsuario(usuario);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuarioParaExibicao));
  localStorage.setItem('loggedIn', 'true');
  return usuarioParaExibicao;
}

export async function login(email, senha) {
  await apiClient.post('/usuarios/login', { email, senha });
  return validarSessao();
}

export async function solicitarRecuperacaoSenha(email) {
  await apiClient.post('/usuarios/recuperacao-senha', { email });
}

export async function redefinirSenha(token, novaSenha) {
  await apiClient.post('/usuarios/redefinir-senha', { token, novaSenha });
}

export function cadastrarUsuario({ nome, email, senha, tipoUsuario, status }) {
  return apiClient.post('/usuarios/cadastrar', { nome, email, senha, tipoUsuario, status });
}

export async function logout() {
  limparSessaoLocal();
  await apiClient.post('/usuarios/logout');
}

export async function validarSessao() {
  const usuario = await apiClient.get('/usuarios/me');
  await inicializarCsrf();
  return salvarUsuario(usuario);
}

export function limparSessaoLocal() {
  localStorage.removeItem(CHAVE_USUARIO);
  localStorage.removeItem('loggedIn');
}

export function getUsuarioLogado() {
  try {
    const bruto = localStorage.getItem(CHAVE_USUARIO);
    return bruto ? normalizarUsuario(JSON.parse(bruto)) : null;
  } catch {
    limparSessaoLocal();
    return null;
  }
}
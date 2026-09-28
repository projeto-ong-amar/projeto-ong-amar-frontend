import { apiClient } from './apiClient.js';


export async function obterPerfil() {
  const sessao = await apiClient.get('/usuarios/me');

  let nivelAcesso = '';
  let status = 'Ativo';
  try {
    const usuarios = await apiClient.get('/usuarios');
    const encontrado = usuarios?.find((u) => u.email === sessao.email);
    if (encontrado) {
      nivelAcesso = encontrado.tipoUsuario;
      status = encontrado.status;
    }
  } catch {
  
  }

  return { id: sessao.id, nome: sessao.nome, email: sessao.email, nivelAcesso, status };
}


export function atualizarPerfil({ id, nome, email, nivelAcesso, status, senhaAtual }) {
  return apiClient.put(`/usuarios/${id}`, {
    nome,
    email,
    senha: senhaAtual,
    tipoUsuario: nivelAcesso || 'VOLUNTARIO',
    status: status || 'Ativo',
  });
}

export function alterarSenha({ id, nome, email, nivelAcesso, status, novaSenha }) {
  return apiClient.put(`/usuarios/${id}`, {
    nome,
    email,
    senha: novaSenha,
    tipoUsuario: nivelAcesso || 'VOLUNTARIO',
    status: status || 'Ativo',
  });
}

const CHAVE_NOTIFICACOES = 'ong_estoque_preferencias_notificacao';

export async function obterPreferenciasNotificacao() {
  try {
    const bruto = localStorage.getItem(CHAVE_NOTIFICACOES);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

export async function atualizarPreferenciasNotificacao(preferencias) {
  localStorage.setItem(CHAVE_NOTIFICACOES, JSON.stringify(preferencias));
  return preferencias;
}

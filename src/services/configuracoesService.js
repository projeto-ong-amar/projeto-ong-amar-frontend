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

export const METRICAS_PADRAO = {
  estoqueBaixo: 10,
  riscoVencimentoDias: 30,
  vencimentoProximoDias: 7,
  semMovimentacaoDias: 60,
  periodoIndicadoresDias: 30,
};

export const ALERTAS_PADRAO = {
  vencimentoProximo: true,
  estoqueBaixo: true,
  semDoacoes: true,
  semMovimentacao: true,
};

const CHAVE_METRICAS = 'ong_estoque_metricas';
const CHAVE_ALERTAS = 'ong_estoque_alertas_dashboard';

function lerLocal(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? { ...padrao, ...JSON.parse(bruto) } : { ...padrao };
  } catch {
    return { ...padrao };
  }
}

// TODO: trocar o localStorage por chamadas ao backend quando os endpoints existirem.
export async function obterMetricas() {
  return lerLocal(CHAVE_METRICAS, METRICAS_PADRAO);
}

export async function atualizarMetricas(metricas) {
  localStorage.setItem(CHAVE_METRICAS, JSON.stringify(metricas));
  return metricas;
}

export async function obterAlertasDashboard() {
  return lerLocal(CHAVE_ALERTAS, ALERTAS_PADRAO);
}

export async function atualizarAlertasDashboard(alertas) {
  localStorage.setItem(CHAVE_ALERTAS, JSON.stringify(alertas));
  return alertas;
}

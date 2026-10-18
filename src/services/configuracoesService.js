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

export function obterPreferenciasNotificacao() {
  return apiClient.get('/configuracoes/preferencias-notificacao');
}

export function atualizarPreferenciasNotificacao(preferencias) {
  return apiClient.put('/configuracoes/preferencias-notificacao', preferencias);
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

const CHAVE_ALERTAS = 'ong_estoque_alertas_dashboard';

function lerLocal(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? { ...padrao, ...JSON.parse(bruto) } : { ...padrao };
  } catch {
    return { ...padrao };
  }
}

export async function obterMetricas() {
  return apiClient.get('/configuracoes/metricas');
}

export async function atualizarMetricas(metricas) {
  return apiClient.put('/configuracoes/metricas', metricas);
}

export async function obterAlertasDashboard() {
  return lerLocal(CHAVE_ALERTAS, ALERTAS_PADRAO);
}

export async function atualizarAlertasDashboard(alertas) {
  localStorage.setItem(CHAVE_ALERTAS, JSON.stringify(alertas));
  return alertas;
}

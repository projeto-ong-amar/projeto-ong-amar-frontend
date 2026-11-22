import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const EVENTO_SESSAO_ENCERRADA = 'sessao-encerrada';

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
  },
});

function encerrarSessaoPorNaoAutorizado() {
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('loggedIn');
  window.dispatchEvent(new Event(EVENTO_SESSAO_ENCERRADA));
}

function extrairMensagemDeErro(corpo, status) {
  if (status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (status === 403) return 'Você não tem permissão para realizar esta ação.';
  if (status >= 500) return 'Não foi possível concluir a operação. Tente novamente mais tarde.';

  const candidatos = typeof corpo === 'string' ? [corpo] : [corpo?.mensagem, corpo?.message, corpo?.error];
  // Apenas mensagens conhecidas são convertidas; nunca repassar texto arbitrário da API.
  for (const mensagem of candidatos) {
    if (typeof mensagem !== 'string') continue;
    if (/^Estoque insuficiente(?:\. Disponível: \d+)?\.?$/i.test(mensagem)) {
      return 'Estoque insuficiente para esta movimentação.';
    }
    if (/^Senha atual incorreta\.?$/i.test(mensagem)) return 'A senha atual está incorreta.';
    if (/^Token de recuperação inválido ou expirado\.?$/i.test(mensagem)) {
      return 'O link de recuperação é inválido ou expirou. Solicite um novo link.';
    }
  }
  if (status === 404) return 'O registro solicitado não foi encontrado.';
  if (status === 409) return 'Não foi possível salvar. Verifique se o registro já existe ou está em uso.';
  if (status === 429) return 'Muitas tentativas. Aguarde um pouco antes de tentar novamente.';
  return 'Confira os dados informados e tente novamente.';
}

http.interceptors.response.use(
  (response) => response,
  (error) => {
 
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
      const canceladoError = new Error('Requisição cancelada.');
      canceladoError.name = 'AbortError';
      throw canceladoError;
    }

    if (!error.response) {
      throw new Error('Não foi possível conectar ao servidor.');
    }

    const { status, data } = error.response;
    if (status === 401) {
      encerrarSessaoPorNaoAutorizado();
    }
    throw new Error(extrairMensagemDeErro(data, status));
  }
);

async function request(path, options = {}) {
  const response = await http.request({ url: path, ...options });

  if (response.status === 204 || response.data === '') {
    return null;
  }
  return response.data;
}

async function requestBlob(path, options = {}) {
  const response = await http.request({ url: path, responseType: 'blob', ...options });
  return response.data;
}

export const apiClient = {
  get: (path, options = {}) => request(path, { method: 'GET', ...options }),
  post: (path, body, options = {}) => request(path, { method: 'POST', data: body, ...options }),
  put: (path, body, options = {}) => request(path, { method: 'PUT', data: body, ...options }),
  patch: (path, body, options = {}) => request(path, { method: 'PATCH', data: body, ...options }),
  delete: (path, options = {}) => request(path, { method: 'DELETE', ...options }),
  postBlob: (path, body, options = {}) => requestBlob(path, { method: 'POST', data: body, ...options }),
};

export async function inicializarCsrf() {
  await request('/csrf', { method: 'GET' });
}

export { API_BASE_URL };

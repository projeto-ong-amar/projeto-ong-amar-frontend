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
  if (corpo && typeof corpo === 'object') {
    if (corpo.mensagem) return corpo.mensagem;
    if (corpo.message) return corpo.message;
    if (corpo.error) return corpo.error;
  }
  if (typeof corpo === 'string' && corpo.trim()) return corpo;
  return `Erro na requisição (status ${status})`;
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
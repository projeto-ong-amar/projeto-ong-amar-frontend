

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const EVENTO_SESSAO_ENCERRADA = 'sessao-encerrada';
const METODOS_MUTAVEIS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function obterCookie(nome) {
  const prefixo = `${encodeURIComponent(nome)}=`;
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(prefixo));

  return cookie ? decodeURIComponent(cookie.slice(prefixo.length)) : null;
}

function criarHeaders(options) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  });
  const metodo = (options.method || 'GET').toUpperCase();
  const csrfToken = obterCookie('XSRF-TOKEN');

  if (METODOS_MUTAVEIS.has(metodo) && csrfToken) {
    headers.set('X-XSRF-TOKEN', csrfToken);
  }

  return headers;
}

function encerrarSessaoPorNaoAutorizado() {
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('loggedIn');
  window.dispatchEvent(new Event(EVENTO_SESSAO_ENCERRADA));
}

async function extrairCorpo(response) {
  const texto = await response.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
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

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: criarHeaders(options),
  });

  if (response.status === 204) {
    return null;
  }

  const corpo = await extrairCorpo(response);

  if (!response.ok) {
    if (response.status === 401) {
      encerrarSessaoPorNaoAutorizado();
    }
    throw new Error(extrairMensagemDeErro(corpo, response.status));
  }

  return corpo;
}

async function requestBlob(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: criarHeaders(options),
  });

  if (!response.ok) {
    const corpo = await extrairCorpo(response);
    if (response.status === 401) {
      encerrarSessaoPorNaoAutorizado();
    }
    throw new Error(extrairMensagemDeErro(corpo, response.status));
  }

  return response.blob();
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  postBlob: (path, body) => requestBlob(path, { method: 'POST', body: JSON.stringify(body) }),
};

export async function inicializarCsrf() {
  await request('/csrf', { method: 'GET' });
}

export { API_BASE_URL };

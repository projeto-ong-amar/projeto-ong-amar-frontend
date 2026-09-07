

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const EVENTO_SESSAO_ENCERRADA = 'sessao-encerrada';

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
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
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

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export { API_BASE_URL };

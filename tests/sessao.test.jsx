import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Root } from '../src/Root.jsx';
import { apiClient, inicializarCsrf } from '../src/services/apiClient.js';

vi.mock('../src/services/apiClient.js', async (importOriginal) => ({
  ...await importOriginal(),
  inicializarCsrf: vi.fn(),
}));

const usuarioSessao = { id: 6, nome: 'Ana Sessão', email: 'ana@example.test', tipoUsuario: 'VOLUNTARIO' };

let respostaSessao;
let get;
let enviarRequisicao;

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
  sessionStorage.clear();
  vi.mocked(inicializarCsrf).mockReset().mockResolvedValue(undefined);
  // Axios usa XHR no jsdom: qualquer escape dos mocks deve falhar sem sair à rede.
  enviarRequisicao = vi.spyOn(XMLHttpRequest.prototype, 'send').mockImplementation(() => {
    throw new Error('Requisição de rede inesperada no teste de sessão');
  });
  respostaSessao = () => Promise.resolve({ ...usuarioSessao });
  get = vi.spyOn(apiClient, 'get').mockImplementation((path) => {
    if (path === '/usuarios/me') return respostaSessao();
    return Promise.resolve([]);
  });
  vi.spyOn(apiClient, 'post').mockResolvedValue(null);
});

afterEach(() => {
  const chamadasDeRede = [...enviarRequisicao.mock.calls];
  vi.restoreAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, '', '/');
  expect(chamadasDeRede).toEqual([]);
});

describe('inicialização da sessão (F5)', () => {
  it('mantém o usuário logado quando a sessão do servidor continua válida', async () => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSessao));
    render(<Root />);

    expect(await screen.findByRole('button', { name: 'Sair' })).toBeTruthy();
    expect(screen.getAllByText(usuarioSessao.nome).length).toBeGreaterThan(0);
    expect(screen.queryByLabelText('Digite seu E-mail')).toBeNull();
    expect(get).toHaveBeenCalledWith('/usuarios/me');
    expect(inicializarCsrf).toHaveBeenCalledExactlyOnceWith();
    expect(get.mock.invocationCallOrder[0]).toBeLessThan(inicializarCsrf.mock.invocationCallOrder[0]);
    expect(localStorage.getItem('loggedIn')).toBe('true');
    expect(JSON.parse(localStorage.getItem('usuarioLogado'))).toEqual(usuarioSessao);
  });

  it('reidrata pelo servidor mesmo sem dados no localStorage', async () => {
    render(<Root />);

    expect(await screen.findByRole('button', { name: 'Sair' })).toBeTruthy();
    expect(localStorage.getItem('loggedIn')).toBe('true');
  });

  it('usa os dados do servidor, não os do localStorage', async () => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('usuarioLogado', JSON.stringify({ ...usuarioSessao, nome: 'Adulterado', tipoUsuario: 'ADMINISTRADOR' }));
    render(<Root />);

    await screen.findByRole('button', { name: 'Sair' });
    expect(screen.queryByText('Adulterado')).toBeNull();
    expect(JSON.parse(localStorage.getItem('usuarioLogado')).tipoUsuario).toBe('VOLUNTARIO');
  });

  it('não mostra o login enquanto a sessão é verificada', async () => {
    let concluir;
    respostaSessao = () => new Promise((resolve) => { concluir = resolve; });
    render(<Root />);

    expect(screen.getByRole('status').textContent).toBe('Verificando sessão...');
    expect(screen.queryByLabelText('Digite seu E-mail')).toBeNull();
    await waitFor(() => expect(concluir).toBeTypeOf('function'));
    concluir({ ...usuarioSessao });
    expect(await screen.findByRole('button', { name: 'Sair' })).toBeTruthy();
  });

  it.each([
    ['sessão expirada', 'Não autenticado'],
    ['servidor indisponível', 'Não foi possível conectar ao servidor.'],
  ])('mostra o login e limpa dados locais quando %s', async (_caso, mensagem) => {
    respostaSessao = () => Promise.reject(new Error(mensagem));
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSessao));
    render(<Root />);

    expect(await screen.findByLabelText('Digite seu E-mail')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull();
    expect(localStorage.getItem('loggedIn')).toBeNull();
    expect(localStorage.getItem('usuarioLogado')).toBeNull();
    expect(inicializarCsrf).not.toHaveBeenCalled();
  });

  it('aguarda o CSRF antes de exibir e persistir a sessão', async () => {
    let concluirCsrf;
    vi.mocked(inicializarCsrf).mockImplementation(() => new Promise((resolve) => { concluirCsrf = resolve; }));
    render(<Root />);

    await waitFor(() => expect(concluirCsrf).toBeTypeOf('function'));
    expect(screen.getByRole('status').textContent).toBe('Verificando sessão...');
    expect(screen.queryByLabelText('Digite seu E-mail')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull();
    expect(localStorage.getItem('loggedIn')).toBeNull();
    expect(localStorage.getItem('usuarioLogado')).toBeNull();
    concluirCsrf();

    expect(await screen.findByRole('button', { name: 'Sair' })).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('usuarioLogado'))).toEqual(usuarioSessao);
  });

  it('limpa os dados locais e mostra o login se a inicialização CSRF falhar', async () => {
    vi.mocked(inicializarCsrf).mockRejectedValue(new Error('Falha ao inicializar CSRF'));
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSessao));
    render(<Root />);

    expect(await screen.findByLabelText('Digite seu E-mail')).toBeTruthy();
    expect(inicializarCsrf).toHaveBeenCalledExactlyOnceWith();
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull();
    expect(localStorage.getItem('loggedIn')).toBeNull();
    expect(localStorage.getItem('usuarioLogado')).toBeNull();
  });

  it('encerra a sessão ao sair e solicita o logout no servidor', async () => {
    const user = userEvent.setup();
    render(<Root />);

    await user.click(await screen.findByRole('button', { name: 'Sair' }));

    expect(await screen.findByLabelText('Digite seu E-mail')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull();
    expect(apiClient.post).toHaveBeenCalledExactlyOnceWith('/usuarios/logout');
    expect(localStorage.getItem('loggedIn')).toBeNull();
    expect(localStorage.getItem('usuarioLogado')).toBeNull();
  });

  it('não consulta a sessão na página de redefinição de senha', async () => {
    window.history.replaceState({}, '', '/redefinir-senha?token=abc');
    render(<Root />);

    expect(await screen.findByRole('heading', { name: 'Definir Nova Senha' })).toBeTruthy();
    expect(get).not.toHaveBeenCalledWith('/usuarios/me');
    expect(inicializarCsrf).not.toHaveBeenCalled();
  });
});

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Configuracoes } from '../src/pages/Configuracoes.jsx';
import { apiClient } from '../src/services/apiClient.js';
import { atualizarPerfil } from '../src/services/configuracoesService.js';
import { EVENTO_SESSAO_ENCERRADA } from '../src/services/authService.js';

const SENHA_ATUAL = 'Atual@123';
const NOVA_SENHA = 'NovaSenha@1';

let sessao;
let get;
let put;
let patch;

beforeEach(() => {
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('usuarioLogado', JSON.stringify({ id: 6, nome: 'Ana', email: 'ana@example.test' }));
  get = vi.spyOn(apiClient, 'get').mockImplementation(async (path) => {
    if (path === '/usuarios/me') return { ...sessao };
    if (path === '/usuarios') throw new Error('Acesso negado.');
    if (path === '/configuracoes/metricas') return {};
    return {};
  });
  put = vi.spyOn(apiClient, 'put').mockResolvedValue(null);
  patch = vi.spyOn(apiClient, 'patch').mockResolvedValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

async function abrirAbaSenha(user, usuario) {
  render(<Configuracoes usuario={usuario} />);
  await waitFor(() => expect(get).toHaveBeenCalledWith('/usuarios/me'));
  const aba = screen.getByRole('tab', { name: /Senha/ });
  await user.click(aba);
}

async function preencher(user, { atual = SENHA_ATUAL, nova = NOVA_SENHA, confirmacao = nova } = {}) {
  await user.type(screen.getByLabelText('Senha Atual'), atual);
  await user.type(screen.getByLabelText('Nova Senha'), nova);
  await user.type(screen.getByLabelText('Confirmar Nova Senha'), confirmacao);
  await user.click(screen.getByRole('button', { name: 'Alterar Senha' }));
}

describe.each([
  ['voluntário', 'VOLUNTARIO'],
  ['administrador', 'ADMINISTRADOR'],
])('troca de senha do %s', (_nome, tipoUsuario) => {
  const usuario = { id: 6, nome: 'Ana', email: 'ana@example.test', tipoUsuario };

  beforeEach(() => {
    sessao = { id: 6, nome: 'Ana', email: 'ana@example.test', tipoUsuario };
  });

  it('envia a senha atual e a nova para PATCH /usuarios/me/senha, sem PUT por id', async () => {
    const user = userEvent.setup();
    await abrirAbaSenha(user, usuario);
    await preencher(user);

    await screen.findByText(/Senha alterada com sucesso/);
    expect(patch).toHaveBeenCalledExactlyOnceWith('/usuarios/me/senha', {
      senhaAtual: SENHA_ATUAL,
      novaSenha: NOVA_SENHA,
    });
    expect(put).not.toHaveBeenCalled();
  });

  it('não depende do id retornado por /usuarios/me', async () => {
    sessao = { userId: 6, nome: 'Ana', email: 'ana@example.test', tipoUsuario };
    const user = userEvent.setup();
    await abrirAbaSenha(user, usuario);
    await preencher(user);

    await screen.findByText(/Senha alterada com sucesso/);
    expect(patch.mock.calls[0][0]).toBe('/usuarios/me/senha');
    expect(put).not.toHaveBeenCalled();
  });

  it('pede novo login após a troca, pois o backend invalida as sessões', async () => {
    const encerrada = vi.fn();
    window.addEventListener(EVENTO_SESSAO_ENCERRADA, encerrada);
    const user = userEvent.setup();
    await abrirAbaSenha(user, usuario);
    await preencher(user);

    await user.click(await screen.findByRole('button', { name: 'Entrar novamente' }));
    window.removeEventListener(EVENTO_SESSAO_ENCERRADA, encerrada);

    expect(encerrada).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('loggedIn')).toBeNull();
    expect(localStorage.getItem('usuarioLogado')).toBeNull();
    expect(screen.queryByLabelText('Senha Atual')).toBeNull();
  });

  it('exibe o erro do backend para senha atual incorreta e mantém a sessão', async () => {
    patch.mockRejectedValueOnce(new Error('Senha atual incorreta.'));
    const encerrada = vi.fn();
    window.addEventListener(EVENTO_SESSAO_ENCERRADA, encerrada);
    const user = userEvent.setup();
    await abrirAbaSenha(user, usuario);
    await preencher(user, { atual: 'Errada@123' });

    const alerta = await screen.findByRole('alert');
    window.removeEventListener(EVENTO_SESSAO_ENCERRADA, encerrada);
    expect(alerta.textContent).toBe('Senha atual incorreta.');
    expect(patch).toHaveBeenCalledExactlyOnceWith('/usuarios/me/senha', {
      senhaAtual: 'Errada@123',
      novaSenha: NOVA_SENHA,
    });
    expect(screen.queryByText(/Senha alterada com sucesso/)).toBeNull();
    expect(screen.getByLabelText('Senha Atual')).toBeTruthy();
    expect(encerrada).not.toHaveBeenCalled();
    expect(localStorage.getItem('loggedIn')).toBe('true');
  });

  it('não envia requisição quando a confirmação diverge', async () => {
    const user = userEvent.setup();
    await abrirAbaSenha(user, usuario);
    await preencher(user, { confirmacao: 'Diferente@1' });

    expect((await screen.findByRole('alert')).textContent).toBe('As senhas informadas não coincidem.');
    expect(patch).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
  });

  it('não envia requisição quando a nova senha não segue a política', async () => {
    const user = userEvent.setup();
    await abrirAbaSenha(user, usuario);
    await preencher(user, { nova: 'semregras1' });

    expect((await screen.findByRole('alert')).textContent).toMatch(/maiúscula, minúscula, número e caractere especial/);
    expect(patch).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
  });
});

describe('atualizarPerfil', () => {
  it('não envia senha no PUT /usuarios/{id}', async () => {
    await atualizarPerfil({ id: 6, nome: 'Ana', email: 'ana@example.test', nivelAcesso: 'VOLUNTARIO', status: 'Ativo', senhaAtual: SENHA_ATUAL });

    expect(put).toHaveBeenCalledExactlyOnceWith('/usuarios/6', {
      nome: 'Ana',
      email: 'ana@example.test',
      tipoUsuario: 'VOLUNTARIO',
      status: 'Ativo',
    });
  });
});

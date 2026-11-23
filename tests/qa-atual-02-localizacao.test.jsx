import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../src/pages/Login.jsx';
import { RecuperarSenha } from '../src/pages/RecuperarSenha.jsx';
import { RedefinirSenha } from '../src/pages/RedefinirSenha.jsx';
import { Configuracoes } from '../src/pages/Configuracoes.jsx';
import { apiClient } from '../src/services/apiClient.js';
import * as auth from '../src/services/authService.js';
import { METRICAS_PADRAO } from '../src/services/configuracoesService.js';

const usuario = { id: 1, nome: 'Admin', email: 'admin@example.test', tipoUsuario: 'ADMINISTRADOR' };

beforeEach(() => {
  vi.spyOn(apiClient, 'get').mockImplementation(async (rota) => {
    if (rota === '/usuarios/me') return usuario;
    if (rota === '/configuracoes/metricas') return METRICAS_PADRAO;
    return {};
  });
  vi.spyOn(apiClient, 'put').mockResolvedValue({});
  vi.spyOn(apiClient, 'patch').mockResolvedValue({});
  vi.spyOn(auth, 'login').mockResolvedValue(usuario);
  vi.spyOn(auth, 'solicitarRecuperacaoSenha').mockResolvedValue({});
  vi.spyOn(auth, 'redefinirSenha').mockResolvedValue({});
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

function conferirErro(campo, mensagem) {
  expect(campo.validationMessage).toBe(mensagem);
  expect(campo.getAttribute('aria-invalid')).toBe('true');
  expect(document.getElementById(campo.getAttribute('aria-describedby')).textContent).toBe(mensagem);
  expect(document.activeElement).toBe(campo);
}

describe('QA-ATUAL-02: formulários antes dependentes do idioma do navegador', () => {
  it('localiza obrigatório e e-mail no login, limpa o erro e permite autenticar', async () => {
    const user = userEvent.setup();
    render(<Login />);
    const email = screen.getByLabelText('Digite seu E-mail');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    conferirErro(email, 'Preencha este campo.');
    await user.type(email, 'invalido');
    await user.type(screen.getByLabelText('Digite sua Senha'), 'Senha@123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    conferirErro(email, 'Informe um e-mail válido.');
    expect(auth.login).not.toHaveBeenCalled();
    await user.clear(email);
    await user.type(email, usuario.email);
    expect(email.validationMessage).toBe('');
    expect(email.hasAttribute('aria-invalid')).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(auth.login).toHaveBeenCalledExactlyOnceWith(usuario.email, 'Senha@123');
  });

  it('localiza e-mail inválido na recuperação sem enviar solicitação', async () => {
    const user = userEvent.setup();
    render(<RecuperarSenha />);
    const email = screen.getByLabelText('Digite seu E-mail');
    await user.click(screen.getByRole('button', { name: 'Enviar', exact: true }));
    conferirErro(email, 'Preencha este campo.');
    await user.type(email, 'invalido');
    await user.click(screen.getByRole('button', { name: 'Enviar', exact: true }));
    conferirErro(email, 'Informe um e-mail válido.');
    expect(auth.solicitarRecuperacaoSenha).not.toHaveBeenCalled();
    await user.clear(email);
    await user.type(email, usuario.email);
    await user.click(screen.getByRole('button', { name: 'Enviar', exact: true }));
    expect(auth.solicitarRecuperacaoSenha).toHaveBeenCalledExactlyOnceWith(usuario.email);
  });

  it('localiza campos obrigatórios da redefinição sem enviar senha inválida', () => {
    window.history.replaceState({}, '', '/?token=token-ficticio-de-teste');
    const { container } = render(<RedefinirSenha />);
    const campo = container.querySelector('input[required]');
    fireEvent.submit(campo.form);
    conferirErro(campo, 'Preencha este campo.');
    expect(auth.redefinirSenha).not.toHaveBeenCalled();
  });

  it.each(['', '0', '1.5'])('bloqueia métrica "%s" antes do HTTP e aceita correção', async (valor) => {
    const user = userEvent.setup();
    render(<Configuracoes usuario={usuario} />);
    await user.click(screen.getByRole('tab', { name: 'Métricas de Estoque' }));
    const campo = document.getElementById('metrica-estoque-baixo');
    fireEvent.change(campo, { target: { value: valor } });
    await user.click(screen.getByRole('button', { name: 'Salvar Métricas' }));
    const mensagem = valor === '' ? 'Preencha este campo.'
      : valor === '0' ? 'Informe um valor maior ou igual a 1.' : 'Informe uma quantidade inteira.';
    conferirErro(campo, mensagem);
    expect(apiClient.put).not.toHaveBeenCalled();
    fireEvent.change(campo, { target: { value: '2' } });
    expect(campo.validationMessage).toBe('');
    await user.click(screen.getByRole('button', { name: 'Salvar Métricas' }));
    expect(apiClient.put).toHaveBeenCalledWith('/configuracoes/metricas', expect.objectContaining({ estoqueBaixo: 2 }));
  });

  it('localiza obrigatório na alteração de senha de Configurações', async () => {
    const user = userEvent.setup();
    render(<Configuracoes usuario={usuario} />);
    await user.click(screen.getByRole('tab', { name: /Senha/ }));
    await user.click(screen.getByRole('button', { name: 'Alterar Senha' }));
    conferirErro(screen.getByLabelText('Senha Atual'), 'Preencha este campo.');
    expect(apiClient.patch).not.toHaveBeenCalled();
  });
});

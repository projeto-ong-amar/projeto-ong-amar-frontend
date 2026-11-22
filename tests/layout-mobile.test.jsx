import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { apiClient } from '../src/services/apiClient.js';

let media;
let mudarViewport;

beforeEach(() => {
  media = {
    matches: true,
    addEventListener: vi.fn((_evento, callback) => { mudarViewport = callback; }),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  vi.spyOn(apiClient, 'get').mockResolvedValue([]);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe.each(['ADMINISTRADOR', 'VOLUNTARIO'])('menu no celular (%s)', (tipoUsuario) => {
  function montar() {
    render(<App usuario={{ nome: 'Ana', tipoUsuario }} onSair={vi.fn()} />);
    return {
      abrir: screen.getByRole('button', { name: 'Abrir menu de navegação' }),
      menu: screen.getByRole('complementary', { name: 'Menu de navegação' }),
    };
  }

  it('inicia recolhido e fecha ao navegar, devolvendo o foco', async () => {
    const user = userEvent.setup();
    const { abrir, menu } = montar();
    expect(abrir.getAttribute('aria-expanded')).toBe('false');
    expect(menu.hasAttribute('inert')).toBe(true);
    expect(abrir.getAttribute('aria-controls')).toBe(menu.id);
    await user.click(abrir);
    expect(abrir.getAttribute('aria-expanded')).toBe('true');
    expect(menu.hasAttribute('inert')).toBe(false);
    expect(screen.getByRole('button', { name: 'Fechar menu ×' })).toBe(document.activeElement);
    expect(screen.getByRole('banner').parentElement.hasAttribute('inert')).toBe(true);
    expect(within(menu).queryByRole('link', { name: 'Cadastro de Usuário' }) !== null)
      .toBe(tipoUsuario === 'ADMINISTRADOR');
    await user.click(within(menu).getByRole('link', { name: 'Gerenciar Saída' }));
    expect(await screen.findByRole('heading', { name: 'Registrar Saída de Produtos' })).toBeTruthy();
    expect(menu.hasAttribute('inert')).toBe(true);
    expect(abrir).toBe(document.activeElement);
    expect(screen.getByRole('banner').parentElement.hasAttribute('inert')).toBe(false);
  });

  it('fecha por botão, fundo e Escape e mantém o foco no menu aberto', async () => {
    const user = userEvent.setup();
    const { abrir, menu } = montar();
    await user.click(abrir);
    const fechar = screen.getByRole('button', { name: 'Fechar menu ×' });
    await user.tab({ shift: true });
    expect(within(menu).getByRole('button', { name: 'Sair' })).toBe(document.activeElement);
    await user.tab();
    expect(fechar).toBe(document.activeElement);
    await user.keyboard('{Escape}');
    expect(menu.hasAttribute('inert')).toBe(true);
    expect(abrir).toBe(document.activeElement);
    await user.click(abrir);
    await user.click(screen.getByRole('button', { name: 'Fechar menu de navegação' }));
    expect(menu.hasAttribute('inert')).toBe(true);
    await user.click(abrir);
    await user.click(fechar);
    expect(menu.hasAttribute('inert')).toBe(true);
  });

  it('restaura a navegação permanente ao mudar para tablet/desktop', async () => {
    const user = userEvent.setup();
    const { abrir, menu } = montar();
    await user.click(abrir);
    act(() => {
      media.matches = false;
      mudarViewport();
    });
    expect(menu.hasAttribute('inert')).toBe(false);
    expect(screen.queryByRole('button', { name: 'Fechar menu de navegação' })).toBeNull();
    expect(screen.getByRole('banner').parentElement.hasAttribute('inert')).toBe(false);
    act(() => {
      media.matches = true;
      mudarViewport();
    });
    expect(menu.hasAttribute('inert')).toBe(true);
    expect(abrir.getAttribute('aria-expanded')).toBe('false');
  });
});

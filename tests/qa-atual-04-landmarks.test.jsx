import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { apiClient } from '../src/services/apiClient.js';

vi.mock('../src/services/apiClient.js', () => ({
  apiClient: { get: vi.fn() },
}));
// Google Charts é externo; as páginas e o layout compartilhado são reais.
vi.mock('react-google-charts', () => ({
  Chart: () => <div>Gráfico</div>,
  default: () => <div>Gráfico</div>,
}));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  apiClient.get.mockImplementation(async (rota) => {
    if (rota === '/usuarios/me') {
      return { nome: 'Admin QA', tipoUsuario: 'ADMINISTRADOR' };
    }
    if (rota === '/dashboard/kpi-risco-vencimento') return 0;
    return [];
  });
});

describe('QA-ATUAL-04 — landmark principal no layout administrativo', () => {
  it.each([
    'Início',
    'Gerenciar Entrada',
    'Cadastro de Produtos',
    'Gerenciar Saída',
    'Relatórios',
    'Desempenho',
    'Cadastro de Usuário',
    'Configurações',
  ])('mantém exatamente um main, sem aninhamento, em %s', async (pagina) => {
    const user = userEvent.setup();
    render(<App usuario={{ nome: 'Admin QA', tipoUsuario: 'ADMINISTRADOR' }} />);
    const menu = screen.getByRole('complementary', { name: 'Menu de navegação' });
    await user.click(within(menu).getByRole('link', { name: pagina, exact: true }));

    const principais = document.querySelectorAll('main, [role="main"]');
    expect(principais).toHaveLength(1);
    const principal = screen.getByRole('main');
    expect(principal).toBe(principais[0]);
    expect(principal.querySelector('main, [role="main"]')).toBeNull();
    expect(principal.contains(menu)).toBe(false);
    expect(principal.contains(screen.getByRole('banner'))).toBe(false);

    if (pagina === 'Desempenho') {
      expect(screen.getByRole('main', { name: 'Desempenho' })).toBe(principal);
      expect(within(principal).getByLabelText('Data da próxima doação')).toBeTruthy();
      expect(within(principal).getByRole('button', { name: 'Abrir Saldo no período' })).toBeTruthy();
      expect(within(principal).getAllByText('Gráfico')).toHaveLength(3);
      expect(within(principal).getByRole('button', { name: /Ações rápidas/ })).toBeTruthy();
    }
  });
});

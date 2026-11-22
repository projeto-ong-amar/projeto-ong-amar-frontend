import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { PeriodFilter } from '../src/components/reports/PeriodFilter.jsx';
import { apiClient } from '../src/services/apiClient.js';

const usuario = { id: 6, nome: 'Ana QA', email: 'ana@example.test', tipoUsuario: 'ADMINISTRADOR' };
const produto = { id: 1, nome: 'Arroz', unidadeMedida: 'KG', categoria: 'ALIMENTOS', status: 'ATIVO' };

beforeEach(() => {
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
  vi.spyOn(apiClient, 'get').mockImplementation(async (path) => {
    if (path.startsWith('/produtos')) return [produto];
    if (path.startsWith('/movimentacao/entrada/historico')) return { content: [], totalPages: 0, totalElements: 0 };
    if (path.startsWith('/movimentacao/saida/historico')) return { content: [], totalPages: 0, totalElements: 0 };
    return [];
  });
  vi.spyOn(apiClient, 'post').mockResolvedValue(null);
  vi.spyOn(apiClient, 'put').mockResolvedValue(null);
  vi.spyOn(apiClient, 'delete').mockResolvedValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('BUG-09 validações de data', () => {
  it('impede salvar entrada com data futura', async () => {
    const user = userEvent.setup();
    const { container } = render(<App usuario={usuario} onSair={() => {}} />);
    await user.click(screen.getByRole('link', { name: /Gerenciar Entrada/ }));

    fireEvent.change(document.getElementById('produto'), { target: { value: '1' } });
    fireEvent.change(document.getElementById('quantidade'), { target: { value: '10' } });
    fireEvent.change(document.getElementById('data-entrada'), { target: { value: '2099-12-01' } });
    fireEvent.change(document.getElementById('data-validade'), { target: { value: '2099-12-10' } });

    fireEvent.submit(container.querySelector('form'));

    expect(await screen.findByText('A data de entrada não pode ser futura.')).toBeTruthy();
    expect(apiClient.post).not.toHaveBeenCalledWith('/movimentacao/entrada', expect.anything());
  });

  it('impede validade anterior à data de entrada', async () => {
    const user = userEvent.setup();
    const { container } = render(<App usuario={usuario} onSair={() => {}} />);
    await user.click(screen.getByRole('link', { name: /Gerenciar Entrada/ }));

    fireEvent.change(document.getElementById('produto'), { target: { value: '1' } });
    fireEvent.change(document.getElementById('quantidade'), { target: { value: '10' } });
    fireEvent.change(document.getElementById('data-entrada'), { target: { value: '2026-12-15' } });
    fireEvent.change(document.getElementById('data-validade'), { target: { value: '2026-12-01' } });

    fireEvent.submit(container.querySelector('form'));

    expect(await screen.findByText('A data de validade não pode ser anterior à data de entrada.')).toBeTruthy();
    expect(apiClient.post).not.toHaveBeenCalledWith('/movimentacao/entrada', expect.anything());
  });

  it('impede salvar saída com data futura', async () => {
    const user = userEvent.setup();
    const { container } = render(<App usuario={usuario} onSair={() => {}} />);
    await user.click(screen.getByRole('link', { name: /Gerenciar Saída/ }));

    fireEvent.change(document.getElementById('produto'), { target: { value: '1' } });
    fireEvent.change(document.getElementById('quantidade'), { target: { value: '3' } });
    fireEvent.change(document.getElementById('motivo'), { target: { value: 'Doação de cestas básicas' } });
    fireEvent.change(document.getElementById('data-saida'), { target: { value: '2099-12-01' } });

    fireEvent.submit(container.querySelector('form'));

    expect(await screen.findByText('A data de saída não pode ser futura.')).toBeTruthy();
    expect(apiClient.post).not.toHaveBeenCalledWith('/movimentacao/saida', expect.anything());
  });

  it('avisa quando período personalizado está invertido', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PeriodFilter active="hoje" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Personalizado/ }));
    fireEvent.change(document.getElementById('periodo-data-inicio'), { target: { value: '2026-11-22' } });
    fireEvent.change(document.getElementById('periodo-data-fim'), { target: { value: '2026-11-20' } });

    await user.click(screen.getByRole('button', { name: 'Aplicar' }));

    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toContain('O período personalizado é inválido');
    expect(onChange).not.toHaveBeenCalledWith(expect.objectContaining({ tipo: 'personalizado' }));
  });
});

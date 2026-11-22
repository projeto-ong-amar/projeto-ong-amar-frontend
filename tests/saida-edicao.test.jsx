import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GerenciarSaida } from '../src/pages/GerenciarSaida.jsx';
import { apiClient } from '../src/services/apiClient.js';

const produto = { id: 1, nome: 'Arroz', unidadeMedida: 'KG' };
const saida = {
  id: 12, produtoId: 1, quantidade: 3, dataHora: '2026-01-10',
  motivo: 'Doação de cestas básicas', responsavelNome: 'Ana',
};
const erroEstoque = 'Estoque insuficiente para esta movimentação. Disponível: 11.';

beforeEach(() => {
  vi.spyOn(apiClient, 'get').mockImplementation(async (path) => (
    path.startsWith('/produtos') ? [produto] : { content: [saida], totalElements: 1 }
  ));
  vi.spyOn(apiClient, 'put').mockRejectedValue(new Error(erroEstoque));
});

afterEach(() => vi.restoreAllMocks());

async function abrirEdicao(user) {
  await user.click(await screen.findByRole('button', { name: 'Mais ações' }));
  await user.click(screen.getByRole('button', { name: 'Editar' }));
  return screen.getByRole('dialog', { name: 'Editar Saída' });
}

describe('BUG-12 feedback da edição de saída', () => {
  it('mostra erro e saldo dentro do modal e permite corrigir a quantidade', async () => {
    const user = userEvent.setup();
    render(<GerenciarSaida />);
    const modal = await abrirEdicao(user);
    const quantidade = within(modal).getByLabelText(/Quantidade/);
    fireEvent.change(quantidade, { target: { value: '9999' } });
    await user.click(within(modal).getByRole('button', { name: /Alterar Saída/ }));

    const alerta = await within(modal).findByRole('alert');
    expect(alerta.textContent).toBe(erroEstoque);
    expect(screen.getAllByText(erroEstoque)).toHaveLength(1);
    expect(quantidade.value).toBe('9999');
    expect(apiClient.put).toHaveBeenCalledWith('/movimentacao/saida/12', expect.objectContaining({ quantidade: 9999 }));

    apiClient.put.mockResolvedValueOnce(null);
    fireEvent.change(quantidade, { target: { value: '5' } });
    await user.click(within(modal).getByRole('button', { name: /Alterar Saída/ }));
    expect(await screen.findByText('Saída atualizada com sucesso!')).toBeTruthy();
    expect(screen.queryByText(erroEstoque)).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Editar Saída' })).toBeNull();
    expect(apiClient.put).toHaveBeenLastCalledWith('/movimentacao/saida/12', expect.objectContaining({ quantidade: 5 }));
  });

  it('descarta o erro ao fechar e reabrir a edição', async () => {
    const user = userEvent.setup();
    render(<GerenciarSaida />);
    const modal = await abrirEdicao(user);
    await user.click(within(modal).getByRole('button', { name: /Alterar Saída/ }));
    expect(await within(modal).findByRole('alert')).toBeTruthy();
    await user.click(within(modal).getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByText(erroEstoque)).toBeNull();
    const reaberto = await abrirEdicao(user);
    expect(within(reaberto).queryByRole('alert')).toBeNull();
  });

  it('mostra a validação de data no modal sem enviar a alteração', async () => {
    const user = userEvent.setup();
    render(<GerenciarSaida />);
    const modal = await abrirEdicao(user);
    fireEvent.change(within(modal).getByLabelText(/Data de Saída/), { target: { value: '2099-01-01' } });
    fireEvent.submit(modal.querySelector('form'));
    expect((await within(modal).findByRole('alert')).textContent).toBe('A data de saída não pode ser futura.');
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it('mostra uma mensagem alternativa dentro do modal quando o erro não tem texto', async () => {
    apiClient.put.mockRejectedValueOnce(new Error());
    const user = userEvent.setup();
    render(<GerenciarSaida />);
    const modal = await abrirEdicao(user);
    await user.click(within(modal).getByRole('button', { name: /Alterar Saída/ }));
    expect((await within(modal).findByRole('alert')).textContent).toBe('Não foi possível atualizar a saída.');
  });
});

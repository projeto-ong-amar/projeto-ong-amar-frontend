import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GerenciarEntrada } from '../src/pages/GerenciarEntrada.jsx';
import { GerenciarSaida } from '../src/pages/GerenciarSaida.jsx';
import { CadastroProdutos } from '../src/pages/CadastroProdutos.jsx';
import { HistoricoEntrada } from '../src/pages/HistoricoEntrada.jsx';
import { HistoricoSaida } from '../src/pages/HistoricoSaida.jsx';
import { HistoricoProdutos } from '../src/pages/HistoricoProdutos.jsx';
import { apiClient } from '../src/services/apiClient.js';

const produto = { id: 1, nome: 'Arroz', unidadeMedida: 'KG', categoria: 'ALIMENTOS' };
const movimentacao = { id: 71, produtoId: 1, quantidade: 3, dataHora: '2026-01-10', responsavelNome: 'Ana' };
const erroEstoque = 'Estoque insuficiente para esta movimentação. Disponível: 2.';
const casos = [
  [GerenciarEntrada, 'Entrada', '/movimentacao/entrada/71', 'Entrada removida com sucesso!'],
  [GerenciarSaida, 'Saída', '/movimentacao/saida/71', 'Saída removida com sucesso!'],
  [CadastroProdutos, 'Produto', '/produtos/1', 'Produto removido com sucesso!'],
  [HistoricoEntrada, 'entrada', '/movimentacao/entrada/71', 'Entrada removida com sucesso!'],
  [HistoricoSaida, 'saída', '/movimentacao/saida/71', 'Saída removida com sucesso!'],
  [HistoricoProdutos, 'produto', '/produtos/1', 'Produto removido com sucesso!'],
];

beforeEach(() => {
  vi.spyOn(apiClient, 'get').mockImplementation(async (path) => {
    if (path.startsWith('/produtos')) return path.includes('?')
      ? { content: [produto], totalPages: 1 } : [produto];
    return { content: [movimentacao], totalPages: 1 };
  });
  vi.spyOn(apiClient, 'delete').mockRejectedValue(new Error(erroEstoque));
});

afterEach(() => vi.restoreAllMocks());

async function abrirExclusao(user, nome) {
  await user.click(await screen.findByRole('button', { name: 'Mais ações' }));
  await user.click(screen.getByRole('button', { name: 'Excluir' }));
  return screen.getByRole('dialog', { name: `Excluir ${nome}` });
}

describe.each(casos)('BUG-13 em %s', (Pagina, nome, caminho, mensagem) => {
  it('exibe o erro dentro do modal, preserva o registro e permite tentar novamente', async () => {
    const user = userEvent.setup();
    render(<Pagina />);
    const modal = await abrirExclusao(user, nome);
    const leituras = apiClient.get.mock.calls.length;
    await user.click(within(modal).getByRole('button', { name: `Excluir ${nome}` }));
    expect((await within(modal).findByRole('alert')).textContent).toBe(erroEstoque);
    expect(screen.queryByRole('status')).toBeNull();
    expect(apiClient.get.mock.calls).toHaveLength(leituras);
    expect(apiClient.delete).toHaveBeenCalledWith(caminho);
    expect(screen.getByRole('button', { name: 'Mais ações' })).toBeTruthy();

    apiClient.delete.mockResolvedValueOnce(null);
    apiClient.get.mockImplementation(async (path) => (
      path.startsWith('/produtos') && !path.includes('?') ? [] : { content: [], totalPages: 0 }
    ));
    await user.click(within(modal).getByRole('button', { name: `Excluir ${nome}` }));
    expect((await screen.findByRole('status')).textContent).toBe(mensagem);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText(erroEstoque)).toBeNull();
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Mais ações' })).toBeNull());
  });

  it('limpa o erro ao reabrir e mostra uma alternativa para erro sem mensagem', async () => {
    const user = userEvent.setup();
    render(<Pagina />);
    const modal = await abrirExclusao(user, nome);
    await user.click(within(modal).getByRole('button', { name: `Excluir ${nome}` }));
    await within(modal).findByRole('alert');
    await user.click(within(modal).getByRole('button', { name: 'Fechar' }));
    const reaberto = await abrirExclusao(user, nome);
    expect(within(reaberto).queryByRole('alert')).toBeNull();
    apiClient.delete.mockRejectedValueOnce(new Error());
    await user.click(within(reaberto).getByRole('button', { name: `Excluir ${nome}` }));
    expect((await within(reaberto).findByRole('alert')).textContent).toMatch(/Não foi possível/);
  });

  it('impede exclusão duplicada e fechamento durante a requisição', async () => {
    let concluir;
    apiClient.delete.mockImplementationOnce(() => new Promise((resolve) => { concluir = resolve; }));
    const user = userEvent.setup();
    render(<Pagina />);
    const modal = await abrirExclusao(user, nome);
    await user.click(within(modal).getByRole('button', { name: `Excluir ${nome}` }));
    const botao = within(modal).getByRole('button', { name: 'Excluindo...' });
    expect(botao.disabled).toBe(true);
    await user.click(botao);
    await user.click(within(modal).getByRole('button', { name: 'Fechar' }));
    await user.click(modal.parentElement);
    expect(screen.getByRole('dialog')).toBe(modal);
    expect(apiClient.delete).toHaveBeenCalledTimes(1);
    concluir(null);
    expect((await screen.findByRole('status')).textContent).toBe(mensagem);
  });
});

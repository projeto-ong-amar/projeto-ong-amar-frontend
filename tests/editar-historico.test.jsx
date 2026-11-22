import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { apiClient } from '../src/services/apiClient.js';

const usuario = { id: 6, nome: 'Ana Edit', email: 'ana@example.test', tipoUsuario: 'ADMINISTRADOR' };

const produto = { id: 1, nome: 'Arroz', unidadeMedida: 'KG', categoria: 'ALIMENTOS', status: 'ATIVO' };

const entrada = {
  id: 70,
  dataHora: '2026-11-20',
  produtoId: 1,
  produtoNome: 'Arroz',
  quantidade: 7,
  responsavelNome: 'Ana Edit',
  motivo: 'Entrada registrada no sistema',
  dataValidade: '2027-05-01',
};

const saida = {
  id: 71,
  dataHora: '2026-11-19',
  produtoId: 1,
  produtoNome: 'Arroz',
  quantidade: 2,
  responsavelNome: 'Ana Edit',
  motivo: 'Doação de cestas básicas',
};

let get;

beforeEach(() => {
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
  get = vi.spyOn(apiClient, 'get').mockImplementation(async (path) => {
    if (path.startsWith('/produtos')) return [produto];
    if (path.startsWith('/movimentacao/entrada/historico')) {
      return { content: [entrada], totalPages: 1, totalElements: 1 };
    }
    if (path.startsWith('/movimentacao/saida/historico')) {
      return { content: [saida], totalPages: 1, totalElements: 1 };
    }
    return [];
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

async function abrirEdicaoNoHistorico(user, menu, quantidade) {
  render(<App usuario={usuario} onSair={() => {}} />);
  await user.click(screen.getByRole('link', { name: menu }));
  await user.click(await screen.findByRole('button', { name: 'Histórico' }));
  const linha = (await screen.findByText(quantidade)).closest('tr');
  await user.click(within(linha).getByRole('button', { name: 'Mais ações' }));
  await user.click(within(linha).getByRole('button', { name: 'Editar' }));
}

describe('editar a partir do histórico', () => {
  it('abre o modal de entrada com os dados e a validade pré-preenchidos', async () => {
    const user = userEvent.setup();
    await abrirEdicaoNoHistorico(user, /Gerenciar Entrada/, '+7');

    expect(await screen.findByRole('heading', { name: 'Editar Entrada' })).toBeTruthy();
    expect(document.getElementById('edit-produto').value).toBe('1');
    expect(document.getElementById('edit-quantidade').value).toBe('7');
    expect(document.getElementById('edit-data-entrada').value).toBe('2026-11-20');
    expect(document.getElementById('edit-data-validade').value).toBe('2027-05-01');
  });

  it('abre o modal de saída com motivo antes da data', async () => {
    const user = userEvent.setup();
    await abrirEdicaoNoHistorico(user, /Gerenciar Saída/, '-2');

    expect(await screen.findByRole('heading', { name: 'Editar Saída' })).toBeTruthy();
    expect(document.getElementById('edit-motivo').value).toBe('Doação de cestas básicas');
    expect(document.getElementById('edit-data-saida').value).toBe('2026-11-19');

    const formulario = document.getElementById('edit-motivo').closest('form');
    const rotuloMotivo = within(formulario).getByText(/^3\. Motivo/);
    const rotuloData = within(formulario).getByText(/^4\. Data de Saída/);
    expect(rotuloMotivo.compareDocumentPosition(rotuloData) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('não abre o modal ao entrar na tela sem item de edição', async () => {
    const user = userEvent.setup();
    render(<App usuario={usuario} onSair={() => {}} />);
    await user.click(screen.getByRole('link', { name: /Gerenciar Entrada/ }));

    await waitFor(() => expect(get).toHaveBeenCalledWith(expect.stringMatching(/^\/movimentacao\/entrada\/historico/)));
    expect(screen.queryByRole('heading', { name: 'Editar Entrada' })).toBeNull();
  });
});

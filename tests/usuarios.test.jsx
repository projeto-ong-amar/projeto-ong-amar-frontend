import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CadastroUsuario } from '../src/pages/CadastroUsuario.jsx';
import { HistoricoUsuario } from '../src/pages/HistoricoUsuario.jsx';
import { apiClient } from '../src/services/apiClient.js';
import { atualizarUsuario, removerUsuario } from '../src/services/usuarioService.js';

const usuario = {
  id: 42,
  nome: 'Maria Original',
  email: 'maria@example.test',
  tipoUsuario: 'VOLUNTARIO',
  status: 'ATIVO',
};

let registros;
let get;
let put;
let del;

beforeEach(() => {
  registros = [{ ...usuario }];
  get = vi.spyOn(apiClient, 'get').mockImplementation(async () => registros.map((item) => ({ ...item })));
  put = vi.spyOn(apiClient, 'put').mockImplementation(async (path, dados) => {
    registros = registros.map((item) => `/usuarios/${item.id}` === path ? { ...item, ...dados } : item);
    return { ...registros[0] };
  });
  del = vi.spyOn(apiClient, 'delete').mockImplementation(async (path) => {
    registros = registros.filter((item) => `/usuarios/${item.id}` !== path);
    return null;
  });
});

afterEach(() => vi.restoreAllMocks());

async function abrirAcao(user, acao) {
  await screen.findByText(usuario.nome);
  await user.click(screen.getByRole('button', { name: 'Mais ações' }));
  await user.click(screen.getByRole('button', { name: acao, exact: true }));
}

describe.each([
  ['histórico', HistoricoUsuario],
  ['último usuário', CadastroUsuario],
])('%s', (_nome, Pagina) => {
  it('envia PUT com os dados alterados e recarrega a lista com sucesso', async () => {
    const user = userEvent.setup();
    render(<Pagina />);
    await abrirAcao(user, 'Editar');
    const nome = screen.getAllByLabelText(/1. Nome Completo/).at(-1);
    await user.clear(nome);
    await user.type(nome, 'Maria Alterada');
    await user.selectOptions(screen.getByLabelText(/3. Tipo de Usuário/), 'ADMINISTRADOR');
    await user.click(screen.getAllByRole('checkbox', { name: 'Ativo' }).at(-1));
    await user.click(screen.getByRole('button', { name: /Alterar Usuário/ }));

    await screen.findByText('Usuário alterado com sucesso!');
    expect(put).toHaveBeenCalledExactlyOnceWith('/usuarios/42', {
      nome: 'Maria Alterada',
      email: usuario.email,
      senha: undefined,
      tipoUsuario: 'ADMINISTRADOR',
      status: 'Inativo',
    });
    expect(get.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByRole('heading', { name: 'Editar Usuário' })).toBeNull();
    expect(await screen.findByText('Maria Alterada')).toBeTruthy();
    expect(registros[0].id).toBe(42);
    expect(registros[0].nome).toBe('Maria Alterada');
  });

  it('envia DELETE e atualiza a lista somente após sucesso', async () => {
    const user = userEvent.setup();
    render(<Pagina />);
    await abrirAcao(user, 'Excluir');
    await user.click(screen.getByRole('button', { name: /Excluir usuário/i }));

    await screen.findByText('Usuário excluído com sucesso!');
    expect(del).toHaveBeenCalledExactlyOnceWith('/usuarios/42');
    expect(get.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText(usuario.nome)).toBeNull();
    expect(screen.queryByRole('heading', { name: /Excluir usuário/i })).toBeNull();
  });

  it.each(['Editar', 'Excluir'])('mantém o modal e mostra erro sem id ao %s', async (acao) => {
    registros = [{ ...usuario, id: undefined }];
    const user = userEvent.setup();
    render(<Pagina />);
    await abrirAcao(user, acao);
    await user.click(screen.getByRole('button', { name: acao === 'Editar' ? /Alterar Usuário/ : /Excluir usuário/i }));

    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toContain('Usuário sem identificador válido');
    expect(alerta.parentElement.querySelector('h2').textContent).toMatch(/Usuário|usuário/);
    expect(put).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
    expect(get).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it.each([
    ['Editar', 'Acesso negado.'],
    ['Editar', 'Usuário não encontrado.'],
    ['Excluir', 'Acesso negado.'],
    ['Excluir', 'Usuário não encontrado.'],
  ])('mantém os dados e exibe erro da API ao %s: %s', async (acao, mensagem) => {
    (acao === 'Editar' ? put : del).mockRejectedValueOnce(new Error(mensagem));
    const user = userEvent.setup();
    render(<Pagina />);
    await abrirAcao(user, acao);
    await user.click(screen.getByRole('button', { name: acao === 'Editar' ? /Alterar Usuário/ : /Excluir usuário/i }));
    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toBe(mensagem);
    expect(alerta.parentElement.querySelector('h2')).toBeTruthy();
    expect(screen.getAllByText(usuario.nome).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole('status')).toBeNull();
    expect(get).toHaveBeenCalledTimes(1);
    expect(registros).toEqual([usuario]);
  });

  it.each(['Editar', 'Excluir'])('bloqueia confirmações e fechamento durante %s', async (acao) => {
    let concluir;
    (acao === 'Editar' ? put : del).mockImplementationOnce(() => new Promise((resolve) => { concluir = resolve; }));
    const user = userEvent.setup();
    render(<Pagina />);
    await abrirAcao(user, acao);
    await user.click(screen.getByRole('button', { name: acao === 'Editar' ? /Alterar Usuário/ : /Excluir usuário/i }));
    expect(screen.getByRole('button', { name: /Alterando|Excluindo/ }).disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Fechar' }).disabled).toBe(true);
    concluir(null);
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull());
  });
});

describe('identificador de usuário', () => {
  it.each([undefined, null, '', 0, -1, '42', NaN])('rejeita id inválido %s antes da requisição', (id) => {
    expect(() => atualizarUsuario(id, usuario)).toThrow('identificador válido');
    expect(() => removerUsuario(id)).toThrow('identificador válido');
    expect(put).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });
});

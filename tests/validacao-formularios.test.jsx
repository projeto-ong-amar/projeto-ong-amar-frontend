import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CadastroProdutos } from '../src/pages/CadastroProdutos.jsx';
import { GerenciarEntrada } from '../src/pages/GerenciarEntrada.jsx';
import { GerenciarSaida } from '../src/pages/GerenciarSaida.jsx';
import { HistoricoEntrada } from '../src/pages/HistoricoEntrada.jsx';
import { HistoricoSaida } from '../src/pages/HistoricoSaida.jsx';
import { CadastroUsuario } from '../src/pages/CadastroUsuario.jsx';
import { apiClient } from '../src/services/apiClient.js';
import { cadastrarProduto, atualizarProduto } from '../src/services/produtoService.js';
import { cadastrarUsuario } from '../src/services/authService.js';
import { atualizarUsuario } from '../src/services/usuarioService.js';
import { atualizarPerfil } from '../src/services/configuracoesService.js';
import { registrarEntrada, atualizarEntrada } from '../src/services/entradaService.js';
import { registrarSaida, atualizarSaida } from '../src/services/saidaService.js';

beforeEach(() => {
  vi.spyOn(apiClient, 'get').mockImplementation((path) =>
    Promise.resolve(path.includes('historico') ? { content: [] } : []));
  vi.spyOn(apiClient, 'post').mockResolvedValue(null);
  vi.spyOn(apiClient, 'put').mockResolvedValue(null);
});
afterEach(() => vi.restoreAllMocks());

describe('validação antes de enviar à API', () => {
  it.each([cadastrarProduto, (dados) => atualizarProduto(1, dados)])('rejeita nome de produto só com espaços e acima do contrato', (salvar) => {
    for (const nome of ['   ', 'a'.repeat(46)]) {
      expect(() => salvar({ nome, categoria: 'ALIMENTOS', unidadeMedida: 'kg' })).toThrow();
    }
    expect(apiClient.post).not.toHaveBeenCalled();
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it.each([cadastrarUsuario, (dados) => atualizarUsuario(1, dados), (dados) => atualizarPerfil({ id: 1, ...dados })])('rejeita nome de usuário inválido', (salvar) => {
    for (const nome of ['   ', 'ab', 'a'.repeat(256), null, undefined]) {
      expect(() => salvar({ nome, email: 'ana@example.test' })).toThrow();
    }
    expect(apiClient.post).not.toHaveBeenCalled();
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it.each([
    registrarEntrada, (dados) => atualizarEntrada(1, dados),
    registrarSaida, (dados) => atualizarSaida(1, dados),
  ])('rejeita quantidades fora do intervalo inteiro da API', (salvar) => {
    for (const quantidade of [99999999999, 2147483648, 0, -1, 1.5, NaN, Infinity, null, '']) {
      expect(() => salvar({ quantidade })).toThrow(/quantidade/i);
    }
    expect(apiClient.post).not.toHaveBeenCalled();
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it('normaliza textos sem modificar senhas', () => {
    cadastrarProduto({ nome: ' Arroz ', unidadeMedida: ' kg ', categoria: 'ALIMENTOS' });
    expect(apiClient.post).toHaveBeenCalledWith('/produtos', { nome: 'Arroz', unidadeMedida: 'kg', categoria: 'ALIMENTOS' });
    cadastrarUsuario({ nome: ' Ana ', email: ' ana@example.test ', senha: ' Senha123! ' });
    expect(apiClient.post).toHaveBeenLastCalledWith('/usuarios/cadastrar', expect.objectContaining({
      nome: 'Ana', email: 'ana@example.test', senha: ' Senha123! ',
    }));
  });

  it.each([registrarEntrada, registrarSaida])('aceita o maior inteiro suportado pela API', (salvar) => {
    salvar({ quantidade: 2147483647 });
    expect(apiClient.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ quantidade: 2147483647 }));
  });
});

describe('restrições e mensagens em português nos formulários', () => {
  it('usa o limite real de 45 caracteres do produto', async () => {
    render(<CadastroProdutos />);
    await screen.findByText('Nenhum produto cadastrado.');
    expect(screen.getByLabelText(/Nome do Produto/).maxLength).toBe(45);
    expect(screen.getByLabelText(/Unidade de Medida/).maxLength).toBe(45);
  });

  it.each([CadastroProdutos, CadastroUsuario])('bloqueia espaços e traduz campos obrigatórios', async (Pagina) => {
    const { container } = render(<Pagina />);
    await screen.findByText(/Nenhum .* cadastrado/);
    const nome = container.querySelector('input[type="text"]');
    fireEvent.change(nome, { target: { value: '   ' } });
    fireEvent.submit(nome.form);
    expect(nome.validationMessage).toBe('Preencha este campo.');
    expect(apiClient.post).not.toHaveBeenCalled();
    fireEvent.change(nome, { target: { value: 'Ana' } });
    fireEvent.submit(nome.form);
    expect(nome.validationMessage).toBe('');
  });

  it.each([GerenciarEntrada, GerenciarSaida])('define máximo e passo inteiro na quantidade', async (Pagina) => {
    render(<Pagina />);
    await screen.findByText(/Nenhuma .* registrada/);
    expect(screen.getByRole('spinbutton').max).toBe('2147483647');
    expect(screen.getByRole('spinbutton').step).toBe('1');
  });

  it.each([
    [CadastroProdutos, 'edit-nome-produto', '   ', 'Preencha este campo.'],
    [CadastroUsuario, 'edit-nome', '   ', 'Preencha este campo.'],
    [GerenciarEntrada, 'edit-quantidade', '99999999999', 'Informe um valor menor ou igual a 2147483647.'],
    [GerenciarSaida, 'edit-quantidade', '99999999999', 'Informe um valor menor ou igual a 2147483647.'],
    [GerenciarEntrada, 'edit-data-entrada', '2099-12-01', 'A data de entrada não pode ser futura.'],
    [GerenciarSaida, 'edit-data-saida', '2099-12-01', 'A data de saída não pode ser futura.'],
    [HistoricoEntrada, 'hist-edit-data-entrada', '2099-12-01', 'A data de entrada não pode ser futura.'],
    [HistoricoSaida, 'hist-edit-saida-data', '2099-12-01', 'A data de saída não pode ser futura.'],
  ])('também bloqueia dados inválidos no modal de edição', async (Pagina, id, valor, mensagem) => {
    const registro = {
      id: 1, produtoId: 1, nome: 'Arroz', categoria: 'ALIMENTOS', unidadeMedida: 'kg',
      quantidade: 10, dataHora: '2026-11-22', dataValidade: '2099-12-31',
      email: 'ana@example.test', tipoUsuario: 'VOLUNTARIO', status: 'Ativo',
      motivo: 'Doação', dataCadastro: '2026-11-22',
    };
    apiClient.get.mockImplementation((path) =>
      Promise.resolve(path.includes('historico') ? { content: [registro] } : [registro]));
    render(<Pagina />);
    fireEvent.click(await screen.findByRole('button', { name: 'Mais ações' }));
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    const campo = document.getElementById(id);
    fireEvent.input(campo, { target: { value: valor } });
    fireEvent.submit(campo.form);
    expect(campo.validationMessage).toBe(mensagem);
    expect(document.getElementById(campo.getAttribute('aria-describedby')).textContent).toBe(mensagem);
    expect(apiClient.put).not.toHaveBeenCalled();
    if (Pagina === CadastroProdutos) expect(campo.maxLength).toBe(45);
  });
});

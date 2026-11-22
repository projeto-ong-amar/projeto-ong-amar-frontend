import { describe, expect, it, vi } from 'vitest';

const { rejeitar } = vi.hoisted(() => ({ rejeitar: { atual: null } }));
vi.mock('axios', () => ({
  default: {
    create: () => ({
      interceptors: { response: { use: (_sucesso, erro) => { rejeitar.atual = erro; } } },
    }),
    isCancel: () => false,
  },
}));
import '../src/services/apiClient.js';

function mensagem(data, status = 400) {
  try { rejeitar.atual({ response: { status, data } }); } catch (erro) { return erro.message; }
}

describe('mensagens da API', () => {
  it.each([
    { message: "Validation failed for object='produtoRequestDTO'. Error count: 1" },
    { mensagem: "Validation failed for object='usuarioRequestDTO'" },
    { error: 'JSON parse error: Numeric value (99999999999) out of range of `int`' },
    '<html>Internal Server Error</html>',
    { message: { exception: 'java.sql.Exception' } },
    { message: 'could not execute statement [SQL insert into usuarios]' },
  ])('não exibe conteúdo técnico ou arbitrário: %j', (data) => {
    expect(mensagem(data)).toBe('Confira os dados informados e tente novamente.');
  });
  it.each(['mensagem', 'message', 'error'])('mapeia erro de negócio em %s', (campo) => {
    expect(mensagem({ [campo]: 'Estoque insuficiente. Disponível: 10' })).toBe('Estoque insuficiente para esta movimentação.');
  });
  it('preserva orientação de senha sem expor detalhes internos', () => {
    expect(mensagem({ message: 'Senha atual incorreta' })).toBe('A senha atual está incorreta.');
  });
  it.each([
    [401, 'Sua sessão expirou. Entre novamente.'],
    [403, 'Você não tem permissão para realizar esta ação.'],
    [500, 'Não foi possível concluir a operação. Tente novamente mais tarde.'],
  ])('traduz status %i', (status, esperado) => {
    expect(mensagem({ message: 'java.lang.Exception' }, status)).toBe(esperado);
  });
});

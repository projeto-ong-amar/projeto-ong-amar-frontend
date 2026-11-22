import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Inicio } from '../src/pages/Inicio.jsx';
import Historico from '../src/pages/Historico.jsx';
import { CardsDesempenho } from '../src/components/desempenho/CardsDesempenho.jsx';

describe('BUG-15 UI e acessibilidade', () => {
  it('filtra serviços ignorando acentos e exibe o card de Configurações', async () => {
    const user = userEvent.setup();
    const usuario = { tipoUsuario: 'ADMINISTRADOR' };
    render(<Inicio usuario={usuario} onNavigate={() => {}} />);

    expect(screen.getByRole('button', { name: /Configurações do Sistema/i })).toBeTruthy();
    await user.type(screen.getByPlaceholderText(/Cadastro de Usuário/i), 'relatorio');
    expect(screen.getByRole('button', { name: /Gerar Relatórios/i })).toBeTruthy();
  });

  it('fecha o menu "Mais ações" ao pressionar Esc', async () => {
    const user = userEvent.setup();
    render(
      <Historico
        icone="https://img.icons8.com/ios/50/2563EB/time-machine.png"
        titulo="Histórico de Teste"
        colunas={[{ chave: 'nome', rotulo: 'Nome', render: (item) => item.nome }]}
        carregarPagina={async () => ({ itens: [{ id: 1, nome: 'Registro' }], totalPaginas: 1 })}
        aoEditar={() => {}}
      />
    );

    await user.click(await screen.findByRole('button', { name: 'Mais ações' }));
    expect(screen.getByRole('button', { name: 'Editar' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('button', { name: 'Editar' })).toBeNull();
  });

  it('usa texto de exclusão feminino para entrada e mostra o nome do item', async () => {
    const user = userEvent.setup();
    const excluir = vi.fn().mockResolvedValue(null);
    render(
      <Historico
        icone="https://img.icons8.com/ios/50/2563EB/time-machine.png"
        titulo="Histórico de Entrada"
        entidadeNome="entrada"
        colunas={[{ chave: 'produtoNome', rotulo: 'Produto', render: (item) => item.produtoNome }]}
        carregarPagina={async () => ({ itens: [{ id: 1, produtoNome: 'Arroz' }], totalPaginas: 1 })}
        aoExcluir={excluir}
      />
    );

    const linha = (await screen.findByText('Arroz')).closest('tr');
    await user.click(within(linha).getByRole('button', { name: 'Mais ações' }));
    await user.click(within(linha).getByRole('button', { name: 'Excluir' }));
    const modal = screen.getByRole('dialog', { name: 'Excluir entrada' });
    expect(within(modal).getByText('Tem certeza que deseja excluir esta entrada?')).toBeTruthy();
    expect(within(modal).getByText('Arroz')).toBeTruthy();
  });

  it('define nome acessível para card clicável do dashboard', () => {
    render(<CardsDesempenho cor="var(--blue)" titulo="Estoque Atual" data={12} dataLabel="itens" descricao="desc" icone="box" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Abrir Estoque Atual' })).toBeTruthy();
  });
});

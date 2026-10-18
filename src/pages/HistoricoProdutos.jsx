import { useCallback } from 'react';
import Historico from './Historico.jsx';
import { listarProdutos, removerProduto } from '../services/produtoService';

export function HistoricoProdutos({ onNavigate }) {
 
  const carregarPagina = useCallback(async (pagina, tamanho) => {
    const todos = (await listarProdutos()) || [];
    const totalPaginas = Math.max(1, Math.ceil(todos.length / tamanho));
    const inicio = pagina * tamanho;
    return {
      itens: todos.slice(inicio, inicio + tamanho),
      totalPaginas,
    };
  }, []);

  return (
    <Historico
      icone="https://img.icons8.com/ios/50/2563EB/task.png"
      titulo="Histórico de Produtos"
      subtitulo="Todos os produtos cadastrados no estoque."
      entidadeNome="produto"
      mensagemVazio="Nenhum produto cadastrado."
      carregarPagina={carregarPagina}
      aoEditar={() => onNavigate?.('cadastro-produtos')}
      aoExcluir={(item) => removerProduto(item.id)}
      colunas={[
        { chave: 'nome', rotulo: 'Produto', render: (item) => item.nome },
        { chave: 'unidade', rotulo: 'Unidade de Medida', render: (item) => item.unidadeMedida || '-' },
        { chave: 'categoria', rotulo: 'Categoria', render: (item) => item.categoria || '-' },
      ]}
    />
  );
}

export default HistoricoProdutos;

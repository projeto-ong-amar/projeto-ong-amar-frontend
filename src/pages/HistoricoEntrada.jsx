import { useCallback, useEffect, useState } from 'react';
import styles from './Historico.module.css';
import Historico from './Historico.jsx';
import { listarProdutos } from '../services/produtoService';
import { listarHistoricoEntrada, removerEntrada } from '../services/entradaService';

function paraBr(dataIso) {
  if (!dataIso) return '';
  const [data] = dataIso.split('T');
  const [ano, mes, dia] = data.split('-');
  if (!ano || !mes || !dia) return dataIso;
  return `${dia}/${mes}/${ano}`;
}

export function HistoricoEntrada({ onNavigate }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    listarProdutos()
      .then((lista) => setProdutos(lista || []))
      .catch(() => setProdutos([]));
  }, []);

  function nomeProduto(item) {
    const encontrado = produtos.find((p) => p.id === item.produtoId);
    if (!encontrado) return item.produtoNome || '-';
    return `${encontrado.nome}${encontrado.unidadeMedida ? ` (${encontrado.unidadeMedida})` : ''}`;
  }

  function categoriaProduto(item) {
    return produtos.find((p) => p.id === item.produtoId)?.categoria || '-';
  }

  const carregarPagina = useCallback(async (pagina, tamanho) => {
    const paginaResultado = await listarHistoricoEntrada(pagina, tamanho);
    return {
      itens: paginaResultado?.content || [],
      totalPaginas: paginaResultado?.totalPages ?? 0,
    };
  }, []);

  return (
    <Historico
      icone="https://img.icons8.com/ios/50/2563EB/time-machine.png"
      titulo="Histórico de Entrada"
      subtitulo="Todas as entradas registradas no estoque."
      entidadeNome="entrada"
      mensagemVazio="Nenhuma entrada registrada."
      carregarPagina={carregarPagina}
      aoEditar={() => onNavigate?.('gerenciar-entrada')}
      aoExcluir={(item) => removerEntrada(item.id)}
      colunas={[
        { chave: 'data', rotulo: 'Data', render: (item) => paraBr(item.dataHora) },
        { chave: 'responsavel', rotulo: 'Responsável', render: (item) => item.responsavelNome || '-' },
        { chave: 'produto', rotulo: 'Produto', render: (item) => nomeProduto(item) },
        {
          chave: 'quantidade',
          rotulo: 'Quantidade',
          className: styles.quantidadePositiva,
          render: (item) => `+${item.quantidade}`,
        },
        { chave: 'categoria', rotulo: 'Categoria', render: (item) => categoriaProduto(item) },
      ]}
    />
  );
}

export default HistoricoEntrada;
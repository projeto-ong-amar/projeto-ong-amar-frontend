import { PaginaListaProdutos } from '../components/common/PaginaListaProdutos'
import { getListaEstoqueAtual } from '../services/desempenhoService'
import box from '../assets/icons/box.svg'

const COLUNAS = [
  { rotulo: 'Produto', valor: item => item.produto },
  { rotulo: 'Categoria', valor: item => item.categoria },
  { rotulo: 'Quantidade em Estoque', valor: item => item.quantidade, tipo: 'quantidade' },
]

export function EstoqueAtual() {
  return (
    <PaginaListaProdutos
      icone={ box }
      titulo="Estoque Atual"
      subtitulo="Visualize a lista de produtos e a quantidade disponível em estoque."
      tituloTabela="Produtos em Estoque"
      colunas={ COLUNAS }
      carregar={ getListaEstoqueAtual }
      arquivoCsv="estoque-atual.csv"
    />
  )
}

export default EstoqueAtual

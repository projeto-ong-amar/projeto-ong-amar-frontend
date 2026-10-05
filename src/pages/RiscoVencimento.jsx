import { PaginaListaProdutos } from '../components/common/PaginaListaProdutos'
import { getListaRiscoVencimento } from '../services/desempenhoService'
import { formatDate } from '../utils/formatDate'
import alert from '../assets/icons/alert.svg'

const COLUNAS = [
  { rotulo: 'Produto', valor: item => item.produto },
  { rotulo: 'Categoria', valor: item => item.categoria },
  { rotulo: 'Validade', valor: item => formatDate(item.validade + 'T00:00:00'), tipo: 'data' },
  { rotulo: 'Quantidade', valor: item => `${item.quantidade} unid`, tipo: 'quantidade' },
]

export function RiscoVencimento() {
  return (
    <PaginaListaProdutos
      icone={ alert }
      corIcone="color-mix(in srgb, var(--red) 20%, transparent)"
      variante="perigo"
      titulo="Risco de Vencimento"
      subtitulo="Estes produtos vencem nos próximos 30 dias."
      tituloTabela="Produtos com risco de vencimento"
      colunas={ COLUNAS }
      carregar={ getListaRiscoVencimento }
      arquivoCsv="risco-de-vencimento.csv"
      mensagemVazio="Nenhum produto em risco de vencimento."
    />
  )
}

export default RiscoVencimento

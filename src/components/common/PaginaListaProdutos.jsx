import { useEffect, useMemo, useState } from 'react'
import style from './PaginaListaProdutos.module.css'
import { Paginacao } from './Paginacao'

const TAMANHO_PAGINA = 10

function escaparCsv(valor) {
  return `"${String(valor ?? '').replaceAll('"', '""')}"`
}

function baixarCsv(nomeArquivo, colunas, itens) {
  const linhas = [
    colunas.map(coluna => coluna.rotulo),
    ...itens.map(item => colunas.map(coluna => coluna.valor(item))),
  ]
  // ";" e BOM para o Excel em português abrir com acentos e colunas corretos
  const conteudo = '\uFEFF' + linhas.map(linha => linha.map(escaparCsv).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  link.click()
  URL.revokeObjectURL(url)
}

export function PaginaListaProdutos({
  icone,
  corIcone,
  titulo,
  subtitulo,
  tituloTabela,
  colunas,
  carregar,
  arquivoCsv,
  mensagemVazio = 'Nenhum produto encontrado.',
  variante = 'padrao',
}) {
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [filtros, setFiltros] = useState({ busca: '', categoria: '' })
  const [pagina, setPagina] = useState(0)

  const perigo = variante === 'perigo'

  useEffect(() => {
    let cancelado = false
    async function buscar() {
      try {
        const resposta = await carregar()
        if (!cancelado) setItens(Array.isArray(resposta) ? resposta : [])
      } catch (e) {
        if (!cancelado) setErro(e.message || 'Não foi possível carregar a lista.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }
    buscar()
    return () => { cancelado = true }
  }, [carregar])

  const categorias = useMemo(
    () => [...new Set(itens.map(item => item.categoria).filter(Boolean))].sort(),
    [itens]
  )

  const filtrados = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    return itens.filter(item =>
      (!termo || item.produto.toLowerCase().includes(termo)) &&
      (!filtros.categoria || item.categoria === filtros.categoria)
    )
  }, [itens, filtros])

  function aplicarFiltros(evento) {
    evento.preventDefault()
    setFiltros({ busca, categoria })
    setPagina(0)
  }

  function renderCelula(coluna, item) {
    const texto = coluna.valor(item)
    if (coluna.tipo === 'data') {
      return <span className={ perigo ? style.chipData : undefined }>{ texto }</span>
    }
    return texto
  }

  function classeCelula(coluna) {
    if (coluna.tipo === 'quantidade') return perigo ? style.quantidadePerigo : style.quantidade
    return undefined
  }

  const total = filtrados.length
  const totalPaginas = Math.ceil(total / TAMANHO_PAGINA)
  const inicio = pagina * TAMANHO_PAGINA
  const visiveis = filtrados.slice(inicio, inicio + TAMANHO_PAGINA)
  const totalColunas = colunas.length + 1

  return (
    <main className={ style.conteudo }>
      <div className={ style.cabecalhoPagina }>
        <div className={ style.iconeCabecalho } style={ corIcone ? { background: corIcone } : undefined }>
          <img src={ icone } alt="" aria-hidden="true" />
        </div>
        <div>
          <h1>{ titulo }</h1>
          <p>{ subtitulo }</p>
        </div>
      </div>

      <form className={ style.filtros } onSubmit={ aplicarFiltros }>
        <label className={ style.campoBusca }>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar produto..."
            value={ busca }
            onChange={ evento => setBusca(evento.target.value) }
          />
        </label>
        <select
          className={ style.selectTipo }
          value={ categoria }
          onChange={ evento => setCategoria(evento.target.value) }
          aria-label="Filtrar por tipo"
        >
          <option value="">Todos os tipos</option>
          { categorias.map(nome => <option key={ nome } value={ nome }>{ nome }</option>) }
        </select>
        <button type="submit" className={ style.botaoFiltrar }>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="17" x2="14" y2="17" />
          </svg>
          Filtrar
        </button>
      </form>

      { erro && <div className={ style.mensagemErro }>{ erro }</div> }

      <section className={ style.cartaoTabela }>
        <div className={ style.cabecalhoTabela }>
          <h2>{ tituloTabela }</h2>
          <button
            type="button"
            className={ style.botaoExportar }
            disabled={ total === 0 }
            onClick={ () => baixarCsv(arquivoCsv, colunas, filtrados) }
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar CSV
          </button>
        </div>

        <div className={ style.envoltorioTabela }>
          <table className={ `${style.tabela} ${perigo ? style.tabelaPerigo : ''}` }>
            <thead>
              <tr>
                <th>#</th>
                { colunas.map(coluna => <th key={ coluna.rotulo }>{ coluna.rotulo }</th>) }
              </tr>
            </thead>
            <tbody>
              { carregando && <tr><td colSpan={ totalColunas }>Carregando...</td></tr> }
              { !carregando && visiveis.length === 0 && (
                <tr><td colSpan={ totalColunas }>{ mensagemVazio }</td></tr>
              ) }
              { !carregando && visiveis.map((item, i) => (
                <tr key={ item.id ?? `${item.produto}-${inicio + i}` }>
                  <td>{ inicio + i + 1 }</td>
                  { colunas.map(coluna => (
                    <td key={ coluna.rotulo } className={ classeCelula(coluna) }>
                      { renderCelula(coluna, item) }
                    </td>
                  )) }
                </tr>
              )) }
            </tbody>
          </table>
        </div>

        { total > 0 && (
          <div className={ style.rodape }>
            <span className={ style.contagem }>
              Mostrando { visiveis.length } de { total } produtos
            </span>
            <Paginacao paginaAtual={ pagina } totalPaginas={ totalPaginas } aoMudarPagina={ setPagina } />
          </div>
        ) }
      </section>
    </main>
  )
}

import { useEffect, useState, useCallback } from 'react';
import styles from './Historico.module.css';
import { Paginacao } from '../components/common/Paginacao.jsx';

const TAMANHO_PAGINA_PADRAO = 10;


export function Historico({
  icone,
  titulo,
  subtitulo,
  colunas,
  carregarPagina,
  tamanhoPagina = TAMANHO_PAGINA_PADRAO,
  aoEditar,
  aoExcluir,
  mensagemVazio = 'Nenhum registro encontrado.',
  entidadeNome = 'registro',
}) {
  const [pagina, setPagina] = useState(0);
  const [itens, setItens] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [menuAberto, setMenuAberto] = useState(null);
  const [itemExclusao, setItemExclusao] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const buscar = useCallback(
    async (paginaAlvo) => {
      setCarregando(true);
      setErro('');
      try {
        const resultado = await carregarPagina(paginaAlvo, tamanhoPagina);
        setItens(resultado?.itens || []);
        setTotalPaginas(resultado?.totalPaginas ?? 0);
      } catch (e) {
        setErro(e.message || 'Não foi possível carregar o histórico.');
        setItens([]);
        setTotalPaginas(0);
      } finally {
        setCarregando(false);
      }
    },
    [carregarPagina, tamanhoPagina]
  );

  useEffect(() => {
    buscar(pagina);
    
  }, [pagina, carregarPagina]);

  function mudarPagina(novaPagina) {
    setMenuAberto(null);
    setPagina(novaPagina);
  }

  async function confirmarExclusao() {
    if (!itemExclusao || !aoExcluir) return;
    setExcluindo(true);
    try {
      await aoExcluir(itemExclusao);
      setItemExclusao(null);
      await buscar(pagina);
    } catch (e) {
      setErro(e.message || 'Não foi possível excluir o registro.');
    } finally {
      setExcluindo(false);
    }
  }

  const temAcoes = Boolean(aoEditar || aoExcluir);
  const totalColunas = colunas.length + (temAcoes ? 1 : 0);

  return (
    <main className={styles.conteudo}>
      <div className={styles.cabecalhoPagina}>
        <div className={styles.iconeCabecalhoPagina}>
          <img src={icone} alt="" />
        </div>
        <div>
          <h1>{titulo}</h1>
          {subtitulo && <p>{subtitulo}</p>}
        </div>
      </div>

      {erro && <div className={styles.mensagemErro}>{erro}</div>}

      <div className={styles.envoltorioTabela}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              {colunas.map((coluna) => (
                <th key={coluna.chave}>{coluna.rotulo}</th>
              ))}
              {temAcoes && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan={totalColunas}>Carregando...</td></tr>
            )}
            {!carregando && itens.length === 0 && (
              <tr><td colSpan={totalColunas}>{mensagemVazio}</td></tr>
            )}
            {!carregando && itens.map((item, indice) => (
              <tr key={item.id ?? indice}>
                {colunas.map((coluna) => (
                  <td key={coluna.chave} className={coluna.className}>
                    {coluna.render ? coluna.render(item, indice) : item[coluna.chave]}
                  </td>
                ))}
                {temAcoes && (
                  <td className={styles.celulaAcoes}>
                    <div className={styles.envoltorioAcoes}>
                      <button
                        className={styles.botaoMenuAcoes}
                        type="button"
                        aria-label="Mais ações"
                        onClick={() => setMenuAberto(menuAberto === indice ? null : indice)}
                      >
                        <img src="https://img.icons8.com/ios-filled/50/9CA3AF/more.png" alt="" />
                      </button>

                      {menuAberto === indice && (
                        <>
                          <div className={styles.fundoAcoes} onClick={() => setMenuAberto(null)} />
                          <div className={styles.menuAcoes}>
                            {aoEditar && (
                              <button
                                type="button"
                                aria-label="Editar"
                                onClick={() => {
                                  setMenuAberto(null);
                                  aoEditar(item);
                                }}
                              >
                                <img src="https://img.icons8.com/ios-filled/50/374151/edit--v1.png" alt="" />
                              </button>
                            )}
                            {aoEditar && aoExcluir && <div className={styles.divisorMenu} />}
                            {aoExcluir && (
                              <button
                                type="button"
                                className={styles.excluirMenu}
                                aria-label="Excluir"
                                onClick={() => {
                                  setItemExclusao(item);
                                  setMenuAberto(null);
                                }}
                              >
                                <img src="https://img.icons8.com/ios-filled/50/DC2626/trash--v1.png" alt="" />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <Paginacao paginaAtual={pagina} totalPaginas={totalPaginas} aoMudarPagina={mudarPagina} />
      </div>

      {itemExclusao && (
        <div className={styles.fundoModal} onClick={() => !excluindo && setItemExclusao(null)}>
          <div className={`${styles.cartaoModal} ${styles.cartaoModalPequeno}`} onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={`${styles.iconeCabecalhoModal} ${styles.iconeCabecalhoModalPerigo}`}>
                <img src="https://img.icons8.com/ios-filled/50/DC2626/trash--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2>Excluir {entidadeNome}</h2>
              </div>
              <button
                type="button"
                className={styles.botaoFecharModal}
                aria-label="Fechar"
                onClick={() => setItemExclusao(null)}
                disabled={excluindo}
              >
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            <div className={styles.caixaPerigo}>
              <strong>Tem certeza que deseja excluir este {entidadeNome}?</strong>
              <p>Esta ação não poderá ser desfeita.</p>
            </div>

            <div className={styles.linhaAcoes}>
              <button
                type="button"
                className={styles.botaoModalCancelar}
                onClick={() => setItemExclusao(null)}
                disabled={excluindo}
              >
                <span className={styles.iconeAcao}>
                  <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
                </span>
                Cancelar
              </button>

              <button type="button" className={styles.botaoModalExcluir} onClick={confirmarExclusao} disabled={excluindo}>
                <span className={styles.iconeAcao}>
                  <img src="https://img.icons8.com/ios-filled/50/FFFFFF/trash--v1.png" alt="" />
                </span>
                {excluindo ? 'Excluindo...' : `Excluir ${entidadeNome}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Historico;

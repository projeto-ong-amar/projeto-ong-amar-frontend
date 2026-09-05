import { useEffect, useState, useRef } from 'react';
import styles from './CadastroProdutos.module.css';
import { listarProdutos, listarCategorias, cadastrarProduto, atualizarProduto, removerProduto } from '../services/produtoService';

function hoje() {
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function paraBr(dataIso) {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  if (!ano || !mes || !dia) return dataIso;
  return `${dia}/${mes}/${ano}`;
}

const formularioVazio = { nome: '', fkCategoria: '', unidadeMedida: '', dataCadastro: hoje() };

export function CadastroProdutos() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [formulario, setFormulario] = useState(formularioVazio);
  const [menuAberto, setMenuAberto] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(null);
  const [formularioEdicao, setFormularioEdicao] = useState(formularioVazio);
  const [linhaExclusao, setLinhaExclusao] = useState(null);

  const inputDataCadastroRef = useRef(null);
  const inputEditDataCadastroRef = useRef(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
  setCarregando(true);
  setErro('');
  try {
    const [resultadoCategorias, resultadoProdutos] = await Promise.allSettled([
      listarCategorias(),
      listarProdutos(),
    ]);

    setCategorias(resultadoCategorias.status === 'fulfilled' ? (resultadoCategorias.value || []) : []);
    setProdutos(resultadoProdutos.status === 'fulfilled' ? (resultadoProdutos.value || []) : []);

    if (resultadoCategorias.status === 'rejected') {
      setErro(resultadoCategorias.reason?.message || 'Não foi possível carregar as categorias.');
    }
  } catch (e) {
    setErro(e.message || 'Não foi possível carregar os dados.');
  } finally {
    setCarregando(false);
  }
}

  function lidarComMudanca(campo) {
    return (evento) => setFormulario((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  function lidarComCancelar() {
    setFormulario(formularioVazio);
    setErro('');
  }

  async function lidarComSalvar(evento) {
    evento.preventDefault();
    setErro('');
    setSucesso('');
    setEnviando(true);
    try {
      await cadastrarProduto({
        nome: formulario.nome,
        unidadeMedida: formulario.unidadeMedida,
        fkCategoria: Number(formulario.fkCategoria),
        dataCadastro: formulario.dataCadastro || null,
      });
      setSucesso('Produto cadastrado com sucesso!');
      setFormulario(formularioVazio);
      await carregarDados();
    } catch (e) {
      setErro(e.message || 'Não foi possível cadastrar o produto.');
    } finally {
      setEnviando(false);
    }
  }

  function abrirEdicao(item) {
    setFormularioEdicao({
      nome: item.nome,
      fkCategoria: String(item.categoria?.id ?? ''),
      unidadeMedida: item.unidadeMedida,
      dataCadastro: item.dataCadastro ? item.dataCadastro.split('T')[0] : hoje(),
    });
    setLinhaEdicao(item);
    setMenuAberto(null);
    setErro('');
  }

  function lidarComMudancaEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  async function lidarComAlterar(evento) {
    evento.preventDefault();
    setErro('');
    setSucesso('');
    setEnviando(true);
    try {
      await atualizarProduto(linhaEdicao.id, {
        nome: formularioEdicao.nome,
        unidadeMedida: formularioEdicao.unidadeMedida,
        fkCategoria: Number(formularioEdicao.fkCategoria),
        dataCadastro: formularioEdicao.dataCadastro || null,
      });
      setSucesso('Produto atualizado com sucesso!');
      setLinhaEdicao(null);
      await carregarDados();
    } catch (e) {
      setErro(e.message || 'Não foi possível atualizar o produto.');
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarExclusao() {
    setErro('');
    setSucesso('');
    try {
      await removerProduto(linhaExclusao.id);
      setSucesso('Produto removido com sucesso!');
      setLinhaExclusao(null);
      await carregarDados();
    } catch (e) {
      setErro(e.message || 'Não foi possível remover o produto.');
      setLinhaExclusao(null);
    }
  }

  return (
    <main className={styles.conteudo}>
      <div className={styles.cabecalhoPagina}>
        <div className={styles.iconeCabecalhoPagina}>
          <img src="https://img.icons8.com/ios/50/2563EB/task.png" alt="" />
        </div>
        <div>
          <h1>Cadastro de Produto</h1>
          <p>Preencha os dados do produto abaixo.</p>
        </div>
      </div>

      {erro && <div className={styles.mensagemErro}>{erro}</div>}
      {sucesso && <div className={styles.mensagemSucesso}>{sucesso}</div>}

      <form className={styles.cartaoFormulario} onSubmit={lidarComSalvar}>
        <div className={styles.gradeFormulario}>
          <div className={styles.campo}>
            <label htmlFor="nome-produto">
              1. Nome do Produto <span className={styles.obrigatorio}>*</span>
            </label>
            <input
              id="nome-produto"
              type="text"
              placeholder="Digite o nome do produto"
              value={formulario.nome}
              onChange={lidarComMudanca('nome')}
              minLength={3}
              maxLength={255}
              required
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="categoria-produto">
              2. Categoria <span className={styles.obrigatorio}>*</span>
            </label>
            <select
              id="categoria-produto"
              value={formulario.fkCategoria}
              onChange={lidarComMudanca('fkCategoria')}
              required
            >
              <option value="">Selecione a categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
              ))}
            </select>
          </div>

          <div className={styles.campo}>
            <label htmlFor="unidade-medida">
              3. Unidade de Medida <span className={styles.obrigatorio}>*</span>
            </label>
            <input
              id="unidade-medida"
              type="text"
              placeholder="Ex: kg, l, un, cx"
              value={formulario.unidadeMedida}
              onChange={lidarComMudanca('unidadeMedida')}
              maxLength={255}
              required
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="data-cadastro">
              4. Data de Cadastro <span className={styles.obrigatorio}>*</span>
            </label>
            <div className={styles.envoltorioData}>
              <input
                ref={inputDataCadastroRef}
                id="data-cadastro"
                type="date"
                value={formulario.dataCadastro}
                onChange={lidarComMudanca('dataCadastro')}
                required
              />
              <button
                type="button"
                className={styles.botaoCalendario}
                aria-label="Selecionar data"
                onClick={() => inputDataCadastroRef.current?.showPicker()}
              >
                <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.linhaAcoes}>
          <button type="button" className={styles.botaoCancelar} onClick={lidarComCancelar}>
            <span className={styles.iconeAcao}>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
            </span>
            <span className={styles.textoAcao}>
              <strong>Cancelar</strong>
              <small>Limpar os campos</small>
            </span>
          </button>

          <button type="submit" className={styles.botaoSalvar} disabled={enviando}>
            <span className={styles.iconeAcao}>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
            </span>
            <span className={styles.textoAcao}>
              <strong>{enviando ? 'Salvando...' : 'Salvar Produto'}</strong>
              <small>Registrar no estoque</small>
            </span>
          </button>
        </div>
      </form>

      <div className={styles.cabecalhoHistorico}>
        <div className={styles.tituloHistorico}>
          <img src="https://img.icons8.com/ios/50/6B7280/time-machine.png" alt="" />
          <div>
            <h2>Produtos Cadastrados</h2>
            <p>Veja os produtos cadastrados no estoque.</p>
          </div>
        </div>
        <button className={styles.botaoHistorico} type="button" onClick={carregarDados}>Histórico</button>
      </div>

      <div className={styles.envoltorioTabela}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Unidade de Medida</th>
              <th>Categoria</th>
              <th>Data de Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan={5}>Carregando...</td></tr>
            )}
            {!carregando && produtos.length === 0 && (
              <tr><td colSpan={5}>Nenhum produto cadastrado.</td></tr>
            )}
            {!carregando && produtos.map((item, indice) => (
              <tr key={item.id ?? indice}>
                <td>{item.nome}</td>
                <td>{item.unidadeMedida}</td>
                <td>{item.categoria?.nome}</td>
                <td>{paraBr(item.dataCadastro)}</td>
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
                          <button type="button" aria-label="Editar" onClick={() => abrirEdicao(item)}>
                            <img src="https://img.icons8.com/ios-filled/50/374151/edit--v1.png" alt="" />
                          </button>
                          <div className={styles.divisorMenu} />
                          <button
                            type="button"
                            className={styles.excluirMenu}
                            aria-label="Excluir"
                            onClick={() => {
                              setLinhaExclusao(item);
                              setMenuAberto(null);
                            }}
                          >
                            <img src="https://img.icons8.com/ios-filled/50/DC2626/trash--v1.png" alt="" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.dica}>
        <img src="https://img.icons8.com/ios/50/2563EB/idea.png" alt="" />
        <span>
          <strong>Dica:</strong> Revise os dados antes de salvar. Em caso de dúvida, clique em Ajuda.
        </span>
      </div>

      {linhaEdicao && (
        <div className={styles.fundoModal} onClick={() => setLinhaEdicao(null)}>
          <div className={styles.cartaoModal} onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={styles.iconeCabecalhoModal}>
                <img src="https://img.icons8.com/ios-filled/50/CA8A04/edit--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2>Editar Produto</h2>
                <p>Altere as informações do produto abaixo.</p>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setLinhaEdicao(null)}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            <form onSubmit={lidarComAlterar}>
              <div className={styles.gradeFormulario}>
                <div className={styles.campo}>
                  <label htmlFor="edit-nome-produto">
                    1. Nome do Produto <span className={styles.obrigatorio}>*</span>
                  </label>
                  <input
                    id="edit-nome-produto"
                    type="text"
                    placeholder="Digite o nome do produto"
                    value={formularioEdicao.nome}
                    onChange={lidarComMudancaEdicao('nome')}
                    minLength={3}
                    maxLength={255}
                    required
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="edit-categoria-produto">
                    2. Categoria <span className={styles.obrigatorio}>*</span>
                  </label>
                  <select
                    id="edit-categoria-produto"
                    value={formularioEdicao.fkCategoria}
                    onChange={lidarComMudancaEdicao('fkCategoria')}
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="edit-unidade-medida">
                    3. Unidade de Medida <span className={styles.obrigatorio}>*</span>
                  </label>
                  <input
                    id="edit-unidade-medida"
                    type="text"
                    placeholder="Ex: kg, l, un, cx"
                    value={formularioEdicao.unidadeMedida}
                    onChange={lidarComMudancaEdicao('unidadeMedida')}
                    maxLength={255}
                    required
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="edit-data-cadastro">
                    4. Data de Cadastro <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      ref={inputEditDataCadastroRef}
                      id="edit-data-cadastro"
                      type="date"
                      value={formularioEdicao.dataCadastro}
                      onChange={lidarComMudancaEdicao('dataCadastro')}
                      required
                    />
                    <button
                      type="button"
                      className={styles.botaoCalendario}
                      aria-label="Selecionar data"
                      onClick={() => inputEditDataCadastroRef.current?.showPicker()}
                    >
                      <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.linhaAcoes}>
                <button type="button" className={styles.botaoCancelar} onClick={() => setLinhaEdicao(null)}>
                  <span className={styles.iconeAcao}>
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
                  </span>
                  <span className={styles.textoAcao}>
                    <strong>Cancelar</strong>
                    <small>Limpar os campos</small>
                  </span>
                </button>

                <button type="submit" className={styles.botaoSalvar} disabled={enviando}>
                  <span className={styles.iconeAcao}>
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
                  </span>
                  <span className={styles.textoAcao}>
                    <strong>{enviando ? 'Salvando...' : 'Alterar Produto'}</strong>
                    <small>Alterar no estoque</small>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {linhaExclusao && (
        <div className={styles.fundoModal} onClick={() => setLinhaExclusao(null)}>
          <div className={`${styles.cartaoModal} ${styles.cartaoModalPequeno}`} onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={`${styles.iconeCabecalhoModal} ${styles.iconeCabecalhoModalPerigo}`}>
                <img src="https://img.icons8.com/ios-filled/50/DC2626/trash--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2>Excluir Produto</h2>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setLinhaExclusao(null)}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            <div className={styles.caixaPerigo}>
              <strong>Tem Certeza que Deseja Excluir este Produto?</strong>
              <p>Esta ação não poderá ser desfeita.</p>
            </div>

            <div className={styles.linhaAcoes}>
              <button type="button" className={styles.botaoModalCancelar} onClick={() => setLinhaExclusao(null)}>
                <span className={styles.iconeAcao}>
                  <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
                </span>
                Cancelar
              </button>

              <button type="button" className={styles.botaoModalExcluir} onClick={confirmarExclusao}>
                <span className={styles.iconeAcao}>
                  <img src="https://img.icons8.com/ios-filled/50/FFFFFF/trash--v1.png" alt="" />
                </span>
                Excluir Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CadastroProdutos;

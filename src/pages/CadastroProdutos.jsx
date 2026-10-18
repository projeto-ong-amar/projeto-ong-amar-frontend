import { useEffect, useState } from 'react';
import styles from './CadastroProdutos.module.css';
import { listarProdutos, cadastrarProduto, atualizarProduto, removerProduto } from '../services/produtoService';

const categoriasDisponiveis = ['ALIMENTOS', 'PRODUTOS DE HIGIENE'];
const formularioVazio = { nome: '', categoria: '', unidadeMedida: '' };

function obterUltimoProduto(lista) {
  if (!lista.length) return null;
  return lista.reduce((maisRecente, atual) => ((atual.id ?? 0) > (maisRecente.id ?? 0) ? atual : maisRecente));
}

export function CadastroProdutos({ onNavigate }) {
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

  const ultimoProduto = obterUltimoProduto(produtos);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');
    try {
      const resultadoProdutos = await listarProdutos();
      setProdutos(resultadoProdutos || []);
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
        categoria: formulario.categoria,
        unidadeMedida: formulario.unidadeMedida,
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
      categoria: item.categoria || '',
      unidadeMedida: item.unidadeMedida,
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
        categoria: formularioEdicao.categoria,
        unidadeMedida: formularioEdicao.unidadeMedida,
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
              value={formulario.categoria}
              onChange={lidarComMudanca('categoria')}
              required
            >
              <option value="">Selecione a categoria</option>
              {categoriasDisponiveis.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
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
            <h2>Último Produto Cadastrado</h2>
            <p>Veja os produtos cadastrados no estoque.</p>
          </div>
        </div>
        <button
          className={styles.botaoHistorico}
          type="button"
          onClick={() => onNavigate?.('historico-produtos')}
        >
          Histórico
        </button>
      </div>

      <div className={styles.envoltorioTabela}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Unidade de Medida</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan={4}>Carregando...</td></tr>
            )}
            {!carregando && !ultimoProduto && (
              <tr><td colSpan={4}>Nenhum produto cadastrado.</td></tr>
            )}
            {!carregando && [ultimoProduto].filter(Boolean).map((item, indice) => (
              <tr key={item.id ?? indice}>
                <td>{item.nome}</td>
                <td>{item.unidadeMedida}</td>
                <td>{item.categoria}</td>
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
          <strong>Dica:</strong> Revise os dados antes de salvar. Em caso de dúvida, clique no ChatBot
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
                    value={formularioEdicao.categoria}
                    onChange={lidarComMudancaEdicao('categoria')}
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {categoriasDisponiveis.map((categoria) => (
                      <option key={categoria} value={categoria}>{categoria}</option>
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

import { useState } from 'react';
import styles from './CadastroProdutos.module.css';

const CATEGORIAS = ['Alimentos', 'Produtos de Higiene'];
const UNIDADES = ['Quilograma (kg)', 'Litro (l)', 'Unidade (un)', 'Caixa (cx)'];

const HISTORICO_MOCK = [
  { data: '29/04/2025', responsavel: 'Juliana Albuquerque', produto: 'Arroz', categoria: 'Alimentos', unidade: 'Quilograma (kg)' },
];

const formularioVazio = { nome: '', categoria: '', dataEntrada: '', unidade: '' };

export function CadastroProdutos() {
  const [formulario, setFormulario] = useState(formularioVazio);
  const [menuAberto, setMenuAberto] = useState(null); 
  const [linhaEdicao, setLinhaEdicao] = useState(null); 
  const [formularioEdicao, setFormularioEdicao] = useState(formularioVazio);
  const [linhaExclusao, setLinhaExclusao] = useState(null); 

  function lidarComMudanca(campo) {
    return (evento) => setFormulario((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  function lidarComCancelar() {
    setFormulario(formularioVazio);
  }

  function lidarComSalvar(evento) {
    evento.preventDefault();
    console.log('Salvar produto:', formulario);
  }

  function abrirEdicao(item) {
    setFormularioEdicao({
      nome: item.produto,
      categoria: item.categoria,
      dataEntrada: item.data,
      unidade: item.unidade || '',
    });
    setLinhaEdicao(item);
    setMenuAberto(null);
  }

  function lidarComMudancaEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  function lidarComAlterar(evento) {
    evento.preventDefault();
    console.log('Alterar produto:', linhaEdicao, formularioEdicao);
    setLinhaEdicao(null);
  }

  function confirmarExclusao() {
    console.log('Excluir produto confirmado:', linhaExclusao);
    setLinhaExclusao(null);
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
              {CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          <div className={styles.campo}>
            <label htmlFor="data-entrada">
              3. Data de Entrada <span className={styles.obrigatorio}>*</span>
            </label>
            <div className={styles.envoltorioData}>
              <input
                id="data-entrada"
                type="text"
                placeholder="DD/MM/AAAA"
                value={formulario.dataEntrada}
                onChange={lidarComMudanca('dataEntrada')}
                required
              />
              <button type="button" className={styles.botaoCalendario} aria-label="Selecionar data">
                <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
              </button>
            </div>
          </div>

          <div className={styles.campo}>
            <label htmlFor="unidade-medida">
              4. Unidade de Medida <span className={styles.obrigatorio}>*</span>
            </label>
            <input
              id="nome-produto"
              type="text"
              placeholder="Ex: 5kg"
              value={formulario.nome}
              onChange={lidarComMudanca('nome')}
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

          <button type="submit" className={styles.botaoSalvar}>
            <span className={styles.iconeAcao}>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
            </span>
            <span className={styles.textoAcao}>
              <strong>Salvar Produto</strong>
              <small>Registrar no estoque</small>
            </span>
          </button>
        </div>
      </form>

      <div className={styles.cabecalhoHistorico}>
        <div className={styles.tituloHistorico}>
          <img src="https://img.icons8.com/ios/50/6B7280/time-machine.png" alt="" />
          <div>
            <h2>Histórico de Produto</h2>
            <p>Veja os produtos cadastrados no estoque.</p>
          </div>
        </div>
        <button className={styles.botaoHistorico} type="button">Histórico</button>
      </div>

      <div className={styles.envoltorioTabela}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Responsável</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {HISTORICO_MOCK.map((item, indice) => (
              <tr key={indice}>
                <td>{item.data}</td>
                <td>{item.responsavel}</td>
                <td>{item.produto}</td>
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
          <strong>Dica:</strong> Revise os dados antes de salvar. Em caso de dúvida, clique em Ajuda.
        </span>
      </div>

      {}
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
                    {CATEGORIAS.map((categoria) => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="edit-data-entrada">
                    3. Data de Entrada <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      id="edit-data-entrada"
                      type="text"
                      placeholder="DD/MM/AAAA"
                      value={formularioEdicao.dataEntrada}
                      onChange={lidarComMudancaEdicao('dataEntrada')}
                      required
                    />
                    <button type="button" className={styles.botaoCalendario} aria-label="Selecionar data">
                      <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
                    </button>
                  </div>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="edit-unidade-medida">
                    4. Unidade de Medida <span className={styles.obrigatorio}>*</span>
                  </label>
                  <select
                    id="edit-unidade-medida"
                    value={formularioEdicao.unidade}
                    onChange={lidarComMudancaEdicao('unidade')}
                    required
                  >
                    <option value="">Selecione a unidade de medida</option>
                    {UNIDADES.map((unidade) => (
                      <option key={unidade} value={unidade}>{unidade}</option>
                    ))}
                  </select>
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

                <button type="submit" className={styles.botaoSalvar}>
                  <span className={styles.iconeAcao}>
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
                  </span>
                  <span className={styles.textoAcao}>
                    <strong>Alterar Produto</strong>
                    <small>Alterar no estoque</small>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Excluir Produto ── */}
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
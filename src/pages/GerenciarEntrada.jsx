import { useState } from 'react';
import styles from './GerenciarEntrada.module.css';

const PRODUTOS = ['Arroz 5kg', 'Feijão 1kg', 'Detergente 500ml', 'Candida 5l'];

const HISTORICO_MOCK = [
  { data: '29/04/2025', responsavel: 'Juliana Albuquerque', produto: 'Arroz 5kg', quantidade: '+10', categoria: 'Alimentos' },
];

const formularioVazio = { produto: '', quantidade: '', dataEntrada: '', dataValidade: '' };

export function GerenciarEntrada() {
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
    console.log('Salvar entrada:', formulario);
  }

  function abrirEdicao(item) {
    setFormularioEdicao({
      produto: item.produto,
      quantidade: item.quantidade.replace('+', '').replace('-', ''),
      dataEntrada: item.data,
      dataValidade: '',
    });
    setLinhaEdicao(item);
    setMenuAberto(null);
  }

  function lidarComMudancaEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  function lidarComAlterar(evento) {
    evento.preventDefault();
    console.log('Alterar entrada:', linhaEdicao, formularioEdicao);
    setLinhaEdicao(null);
  }

  function confirmarExclusao() {
    console.log('Excluir entrada confirmado:', linhaExclusao);
    setLinhaExclusao(null);
  }

  return (
    <main className={styles.conteudo}>
      <div className={styles.cabecalhoPagina}>
        <div className={styles.iconeCabecalhoPagina}>
          <img src="https://img.icons8.com/ios/50/2563EB/open-box.png" alt="" />
        </div>
        <div>
          <h1>Registrar Entrada de Produtos</h1>
          <p>Preencha os dados abaixo para registrar uma nova entrada no estoque.</p>
        </div>
      </div>

      <form className={styles.cartaoFormulario} onSubmit={lidarComSalvar}>
        <div className={styles.gradeFormulario}>
          <div className={styles.campo}>
            <label htmlFor="produto">
              1. Selecionar Produto <span className={styles.obrigatorio}>*</span>
            </label>
            <select id="produto" value={formulario.produto} onChange={lidarComMudanca('produto')} required>
              <option value="">Selecione o Produto</option>
              {PRODUTOS.map((produto) => (
                <option key={produto} value={produto}>{produto}</option>
              ))}
            </select>
          </div>

          <div className={styles.campo}>
            <label htmlFor="quantidade">
              2. Quantidade <span className={styles.obrigatorio}>*</span>
            </label>
            <input
              id="quantidade"
              type="number"
              min="1"
              placeholder="Digite a quantidade (ex:10)"
              value={formulario.quantidade}
              onChange={lidarComMudanca('quantidade')}
              required
            />
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
            <label htmlFor="data-validade">
              4. Data de Validade <span className={styles.obrigatorio}>*</span>
            </label>
            <div className={styles.envoltorioData}>
              <input
                id="data-validade"
                type="text"
                placeholder="DD/MM/AAAA"
                value={formulario.dataValidade}
                onChange={lidarComMudanca('dataValidade')}
                required
              />
              <button type="button" className={styles.botaoCalendario} aria-label="Selecionar data">
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

          <button type="submit" className={styles.botaoSalvar}>
            <span className={styles.iconeAcao}>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
            </span>
            <span className={styles.textoAcao}>
              <strong>Salvar Entrada</strong>
              <small>Registrar no estoque</small>
            </span>
          </button>
        </div>
      </form>

      <div className={styles.cabecalhoHistorico}>
        <div className={styles.tituloHistorico}>
          <img src="https://img.icons8.com/ios/50/6B7280/time-machine.png" alt="" />
          <div>
            <h2>Última Entrada Realizada</h2>
            <p>Histórico de Entrada</p>
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
              <th>Quantidade</th>
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
                <td className={styles.quantidadePositiva}>{item.quantidade}</td>
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
                <h2>Editar Entrada</h2>
                <p>Altere as informações da entrada abaixo.</p>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setLinhaEdicao(null)}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            <form onSubmit={lidarComAlterar}>
              <div className={styles.gradeFormulario}>
                <div className={styles.campo}>
                  <label htmlFor="edit-produto">
                    1. Selecionar Produto <span className={styles.obrigatorio}>*</span>
                  </label>
                  <select id="edit-produto" value={formularioEdicao.produto} onChange={lidarComMudancaEdicao('produto')} required>
                    <option value="">Selecione o Produto</option>
                    {PRODUTOS.map((produto) => (
                      <option key={produto} value={produto}>{produto}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="edit-quantidade">
                    2. Quantidade <span className={styles.obrigatorio}>*</span>
                  </label>
                  <input
                    id="edit-quantidade"
                    type="number"
                    min="1"
                    placeholder="Digite a quantidade (ex:10)"
                    value={formularioEdicao.quantidade}
                    onChange={lidarComMudancaEdicao('quantidade')}
                    required
                  />
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
                  <label htmlFor="edit-data-validade">
                    4. Data de Validade <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      id="edit-data-validade"
                      type="text"
                      placeholder="DD/MM/AAAA"
                      value={formularioEdicao.dataValidade}
                      onChange={lidarComMudancaEdicao('dataValidade')}
                      required
                    />
                    <button type="button" className={styles.botaoCalendario} aria-label="Selecionar data">
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

                <button type="submit" className={styles.botaoSalvar}>
                  <span className={styles.iconeAcao}>
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
                  </span>
                  <span className={styles.textoAcao}>
                    <strong>Alterar Entrada</strong>
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
                <h2>Excluir Entrada</h2>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setLinhaExclusao(null)}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            <div className={styles.caixaPerigo}>
              <strong>Tem Certeza que Deseja Excluir esta Entrada?</strong>
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
                Excluir Entrada
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default GerenciarEntrada;
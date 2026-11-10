import { useEffect, useState, useRef } from 'react';
import styles from './GerenciarEntrada.module.css';
import { listarProdutos } from '../services/produtoService';
import { getUsuarioLogado } from '../services/authService.js';
import {
  listarHistoricoEntrada,
  registrarEntrada,
  atualizarEntrada,
  removerEntrada,
} from '../services/entradaService';

const MOTIVO_PADRAO = 'Entrada registrada no sistema';

function fkUsuarioAtual() {
  return getUsuarioLogado()?.id ?? null;
}

const formularioVazio = { produto: '', quantidade: '', dataEntrada: '', dataValidade: '' };

function paraBr(dataIso) {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  if (!ano || !mes || !dia) return dataIso;
  return `${dia}/${mes}/${ano}`;
}

function dataLocalHojeIso() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function validadeNoPassado(dataValidade) {
  return Boolean(dataValidade) && dataValidade < dataLocalHojeIso();
}

export function GerenciarEntrada({ onNavigate }) {
  const [produtos, setProdutos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [formulario, setFormulario] = useState(formularioVazio);
  const [menuAberto, setMenuAberto] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(null);
  const [formularioEdicao, setFormularioEdicao] = useState(formularioVazio);
  const [linhaExclusao, setLinhaExclusao] = useState(null);

  const inputDataEntradaRef = useRef(null);
  const inputDataValidadeRef = useRef(null);
  const inputEditDataEntradaRef = useRef(null);
  const inputEditDataValidadeRef = useRef(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');
    try {
      const [resultadoProdutos, resultadoHistorico] = await Promise.allSettled([
        listarProdutos(),
        listarHistoricoEntrada(0, 1),
      ]);

      setProdutos(resultadoProdutos.status === 'fulfilled' ? (resultadoProdutos.value || []) : []);

      if (resultadoHistorico.status === 'fulfilled') {
        const pagina = resultadoHistorico.value;
        setHistorico(pagina?.content || []);
      } else {
        setHistorico([]);
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

    if (!formulario.produto) {
      setErro('Por favor, selecione um produto.');
      return;
    }

    if (validadeNoPassado(formulario.dataValidade)) {
      setErro('A data de validade não pode ser anterior a hoje.');
      return;
    }

    setEnviando(true);
    try {
      await registrarEntrada({
        quantidade: Number(formulario.quantidade),
        dataEntrada: formulario.dataEntrada,
        dataValidade: formulario.dataValidade || null,
        motivo: MOTIVO_PADRAO,
        fkProduto: Number(formulario.produto),
        fkUsuario: fkUsuarioAtual(),
      });
      setSucesso('Entrada registrada com sucesso!');
      setFormulario(formularioVazio);
      await carregarDados();
    } catch (e) {
      setErro(e.message || 'Não foi possível registrar a entrada.');
    } finally {
      setEnviando(false);
    }
  }

  function abrirEdicao(item) {
    setFormularioEdicao({
      produto: String(item.produtoId ?? ''),
      quantidade: String(item.quantidade ?? ''),
      dataEntrada: item.dataHora ? item.dataHora.split('T')[0] : '',
      dataValidade: item.dataValidade ? item.dataValidade.split('T')[0] : '',
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

    if (validadeNoPassado(formularioEdicao.dataValidade)) {
      setErro('A data de validade não pode ser anterior a hoje.');
      return;
    }

    setEnviando(true);
    try {
      await atualizarEntrada(linhaEdicao.id, {
        quantidade: Number(formularioEdicao.quantidade),
        dataEntrada: formularioEdicao.dataEntrada,
        dataValidade: formularioEdicao.dataValidade || null,
        motivo: MOTIVO_PADRAO,
        fkProduto: Number(formularioEdicao.produto),
        fkUsuario: fkUsuarioAtual(),
      });
      setSucesso('Entrada atualizada com sucesso!');
      setLinhaEdicao(null);
      await carregarDados();
    } catch (e) {
      setErro(e.message || 'Não foi possível atualizar a entrada.');
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarExclusao() {
    setErro('');
    setSucesso('');
    try {
      await removerEntrada(linhaExclusao.id);
      setSucesso('Entrada removida com sucesso!');
      setLinhaExclusao(null);
      await carregarDados();
    } catch (e) {
      setErro(e.message || 'Não foi possível remover a entrada.');
      setLinhaExclusao(null);
    }
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

      {erro && <div className={styles.mensagemErro}>{erro}</div>}
      {sucesso && <div className={styles.mensagemSucesso}>{sucesso}</div>}

      <form className={styles.cartaoFormulario} onSubmit={lidarComSalvar}>
        <div className={styles.gradeFormulario}>
          <div className={`${styles.campo} ${styles.campoInteiro}`}>
            <label htmlFor="produto">
              1. Selecionar Produto <span className={styles.obrigatorio}>*</span>
            </label>
            <select id="produto" value={formulario.produto} onChange={lidarComMudanca('produto')} required>
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} {produto.unidadeMedida ? `(${produto.unidadeMedida})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.campo} ${styles.campoPequeno}`}>
            <label htmlFor="quantidade">
              2. Quantidade <span className={styles.obrigatorio}>*</span>
            </label>
            <input
              id="quantidade"
              type="number"
              min="1"
              placeholder="Ex: 10"
              value={formulario.quantidade}
              onChange={lidarComMudanca('quantidade')}
              required
            />
          </div>

          <div className={`${styles.campo} ${styles.campoPequeno}`}>
            <label htmlFor="data-entrada">
              3. Data de Entrada <span className={styles.obrigatorio}>*</span>
            </label>
            <div className={styles.envoltorioData}>
              <input
                ref={inputDataEntradaRef}
                id="data-entrada"
                type="date"
                value={formulario.dataEntrada}
                onChange={lidarComMudanca('dataEntrada')}
                required
              />
              <button
                type="button"
                className={styles.botaoCalendario}
                aria-label="Selecionar data"
                onClick={() => inputDataEntradaRef.current?.showPicker()}
              >
                <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
              </button>
            </div>
          </div>

          <div className={`${styles.campo} ${styles.campoPequeno}`}>
            <label htmlFor="data-validade">
              4. Data de Validade <span className={styles.obrigatorio}>*</span>
            </label>
            <div className={styles.envoltorioData}>
              <input
                ref={inputDataValidadeRef}
                id="data-validade"
                type="date"
                min={dataLocalHojeIso()}
                value={formulario.dataValidade}
                onChange={lidarComMudanca('dataValidade')}
                required
              />
              <button
                type="button"
                className={styles.botaoCalendario}
                aria-label="Selecionar data"
                onClick={() => inputDataValidadeRef.current?.showPicker()}
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
              <strong>{enviando ? 'Salvando...' : 'Salvar Entrada'}</strong>
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
        <button
          className={styles.botaoHistorico}
          type="button"
          onClick={() => onNavigate?.('historico-entrada')}
        >
          Histórico
        </button>
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
            {carregando && (
              <tr><td colSpan={6}>Carregando...</td></tr>
            )}
            {!carregando && historico.length === 0 && (
              <tr><td colSpan={6}>Nenhuma entrada registrada.</td></tr>
            )}
            {!carregando && historico.map((item, indice) => (
              <tr key={item.id ?? indice}>
                <td>{paraBr(item.dataHora)}</td>
                <td>{item.responsavelNome}</td>
                <td>
                  {(() => {
                    const produtoEncontrado = produtos.find((p) => p.id === item.produtoId);
                    if (!produtoEncontrado) return item.produtoNome || '-';
                    return `${produtoEncontrado.nome} ${
                      produtoEncontrado.unidadeMedida ? `(${produtoEncontrado.unidadeMedida})` : ''
                    }`;
                  })()}
                </td>
                <td className={styles.quantidadePositiva}>+{item.quantidade}</td>
                <td>
                  {produtos.find((p) => p.id === item.produtoId)?.categoria || '-'}
                </td>
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
              <div className={`${styles.gradeFormulario} ${styles.gradeModal}`}>
                <div className={`${styles.campo} ${styles.campoInteiro}`}>
                  <label htmlFor="edit-produto">
                    1. Selecionar Produto <span className={styles.obrigatorio}>*</span>
                  </label>
                  <select id="edit-produto" value={formularioEdicao.produto} onChange={lidarComMudancaEdicao('produto')} required>
                    <option value="">Selecione o Produto</option>
                    {produtos.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} {produto.unidadeMedida ? `(${produto.unidadeMedida})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`${styles.campo} ${styles.campoPequeno}`}>
                  <label htmlFor="edit-quantidade">
                    2. Quantidade <span className={styles.obrigatorio}>*</span>
                  </label>
                  <input
                    id="edit-quantidade"
                    type="number"
                    min="1"
                    placeholder="Ex: 10"
                    value={formularioEdicao.quantidade}
                    onChange={lidarComMudancaEdicao('quantidade')}
                    required
                  />
                </div>

                <div className={`${styles.campo} ${styles.campoPequeno}`}>
                  <label htmlFor="edit-data-entrada">
                    3. Data de Entrada <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      ref={inputEditDataEntradaRef}
                      id="edit-data-entrada"
                      type="date"
                      value={formularioEdicao.dataEntrada}
                      onChange={lidarComMudancaEdicao('dataEntrada')}
                      required
                    />
                    <button
                      type="button"
                      className={styles.botaoCalendario}
                      aria-label="Selecionar data"
                      onClick={() => inputEditDataEntradaRef.current?.showPicker()}
                    >
                      <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
                    </button>
                  </div>
                </div>

                <div className={`${styles.campo} ${styles.campoPequeno}`}>
                  <label htmlFor="edit-data-validade">
                    4. Data de Validade <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      ref={inputEditDataValidadeRef}
                      id="edit-data-validade"
                      type="date"
                      min={dataLocalHojeIso()}
                      value={formularioEdicao.dataValidade}
                      onChange={lidarComMudancaEdicao('dataValidade')}
                      required
                    />
                    <button
                      type="button"
                      className={styles.botaoCalendario}
                      aria-label="Selecionar data"
                      onClick={() => inputEditDataValidadeRef.current?.showPicker()}
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
                    <strong>{enviando ? 'Salvando...' : 'Alterar Entrada'}</strong>
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
          <div className={styles.dica}>
                  <img src="https://img.icons8.com/ios/50/2563EB/idea.png" alt="" />
                  <span><strong>Dica:</strong> Revise os dados antes de salvar. Em caso de dúvida, clique no ChatBot</span>
          </div>
        </div>

        
      )}
    </main>
  );
}

export default GerenciarEntrada;
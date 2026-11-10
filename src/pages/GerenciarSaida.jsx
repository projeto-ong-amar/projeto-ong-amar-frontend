import { useEffect, useState, useRef } from 'react';
import styles from './GerenciarSaida.module.css';
import { listarProdutos } from '../services/produtoService';
import { getUsuarioLogado } from '../services/authService.js';
import {
  listarHistoricoSaida,
  registrarSaida,
  atualizarSaida,
  removerSaida,
} from '../services/saidaService';
import { formatarMotivoSaida, interpretarMotivoSaida, rotuloMotivoSaida } from '../utils/motivoSaida';

function fkUsuarioAtual() {
  return getUsuarioLogado()?.id ?? null;
}

const formularioVazio = { produto: '', quantidade: '', dataSaida: '', motivo: '', perda: false };

function paraBr(dataIso) {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  if (!ano || !mes || !dia) return dataIso;
  return `${dia}/${mes}/${ano}`;
}

function compararSaidasRecentes(saidaA, saidaB) {
  const dataA = Date.parse(saidaA.dataHora);
  const dataB = Date.parse(saidaB.dataHora);

  if (Number.isFinite(dataA) && Number.isFinite(dataB) && dataA !== dataB) {
    return dataB - dataA;
  }
  return Number(saidaB.id) - Number(saidaA.id);
}

async function buscarSaidaMaisRecente() {
  const paginaInicial = await listarHistoricoSaida(0, 10);
  const saidasIniciais = paginaInicial?.content || [];
  const totalSaidas = paginaInicial?.totalElements ?? saidasIniciais.length;
  const paginaCompleta = totalSaidas > saidasIniciais.length
    ? await listarHistoricoSaida(0, totalSaidas)
    : paginaInicial;

  return [...(paginaCompleta?.content || [])]
    .sort(compararSaidasRecentes)
    .slice(0, 1);
}

export function GerenciarSaida({ onNavigate }) {
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

  const inputDataSaidaRef = useRef(null);
  const inputEditDataSaidaRef = useRef(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');
    try {
      const [resultadoProdutos, resultadoHistorico] = await Promise.allSettled([
        listarProdutos(),
        buscarSaidaMaisRecente(),
      ]);

      setProdutos(resultadoProdutos.status === 'fulfilled' ? (resultadoProdutos.value || []) : []);

      if (resultadoHistorico.status === 'fulfilled') {
        setHistorico(resultadoHistorico.value || []);
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

  function alternarPerda() {
    setFormulario((anterior) => ({ ...anterior, perda: !anterior.perda }));
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

    setEnviando(true);
    try {
      await registrarSaida({
        quantidade: Number(formulario.quantidade),
        dataSaida: formulario.dataSaida,
        motivo: formatarMotivoSaida(formulario),
        fkProduto: Number(formulario.produto),
        fkUsuario: fkUsuarioAtual(),
      });
      setSucesso('Saída registrada com sucesso!');
      setFormulario(formularioVazio);
      await carregarDados();
    } catch (e) {
      setErro(e.message || 'Não foi possível registrar a saída.');
    } finally {
      setEnviando(false);
    }
  }

  function abrirEdicao(item) {
    const { perda, motivo } = interpretarMotivoSaida(item.motivo);
    setFormularioEdicao({
      produto: String(item.produtoId ?? ''),
      quantidade: String(item.quantidade ?? ''),
      dataSaida: item.dataHora ? item.dataHora.split('T')[0] : '',
      motivo,
      perda,
    });
    setLinhaEdicao(item);
    setMenuAberto(null);
    setErro('');
  }

  function lidarComMudancaEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  function alternarPerdaEdicao() {
    setFormularioEdicao((anterior) => ({ ...anterior, perda: !anterior.perda }));
  }

  async function lidarComAlterar(evento) {
    evento.preventDefault();
    setErro('');
    setSucesso('');
    setEnviando(true);
    try {
      await atualizarSaida(linhaEdicao.id, {
        quantidade: Number(formularioEdicao.quantidade),
        dataSaida: formularioEdicao.dataSaida,
        motivo: formatarMotivoSaida(formularioEdicao),
        fkProduto: Number(formularioEdicao.produto),
        fkUsuario: fkUsuarioAtual(),
      });
      setSucesso('Saída atualizada com sucesso!');
      setLinhaEdicao(null);
      await carregarDados();
    } catch (e) {
      setErro(e.message || 'Não foi possível atualizar a saída.');
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarExclusao() {
    setErro('');
    setSucesso('');
    try {
      await removerSaida(linhaExclusao.id);
      setSucesso('Saída removida com sucesso!');
      setLinhaExclusao(null);
      await carregarDados();
    } catch (e) {
      setErro(e.message || 'Não foi possível remover a saída.');
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
          <h1>Registrar Saída de Produtos</h1>
          <p>Preencha os dados abaixo para registrar uma nova saída no estoque.</p>
        </div>
      </div>

      {erro && <div className={styles.mensagemErro}>{erro}</div>}
      {sucesso && <div className={styles.mensagemSucesso}>{sucesso}</div>}

      <form className={styles.cartaoFormulario} onSubmit={lidarComSalvar}>
        <div className={styles.gradeFormulario}>
          <div className={styles.campo}>
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
            <label htmlFor="data-saida">
              3. Data de Saída <span className={styles.obrigatorio}>*</span>
            </label>
            <div className={styles.envoltorioData}>
              <input
                ref={inputDataSaidaRef}
                id="data-saida"
                type="date"
                value={formulario.dataSaida}
                onChange={lidarComMudanca('dataSaida')}
                required
              />
              <button
                type="button"
                className={styles.botaoCalendario}
                aria-label="Selecionar data"
                onClick={() => inputDataSaidaRef.current?.showPicker()}
              >
                <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
              </button>
            </div>
          </div>

          <div className={styles.campo}>
            <label htmlFor="motivo">
              4. Motivo <span className={styles.obrigatorio}>*</span>
            </label>
            <input
              id="motivo"
              type="text"
              placeholder="Digite o motivo..."
              value={formulario.motivo}
              onChange={lidarComMudanca('motivo')}
              required
            />
            <label className={styles.linhaInterruptor}>
              <button
                type="button"
                role="switch"
                aria-checked={formulario.perda}
                className={`${styles.interruptor} ${formulario.perda ? styles.interruptorAtivo : ''}`}
                onClick={alternarPerda}
              >
                <span className={styles.interruptorBolinha} />
              </button>
              Perda
            </label>
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
              <strong>{enviando ? 'Salvando...' : 'Salvar Saída'}</strong>
              <small>Registrar no estoque</small>
            </span>
          </button>
        </div>
      </form>

      <div className={styles.cabecalhoHistorico}>
        <div className={styles.tituloHistorico}>
          <img src="https://img.icons8.com/ios/50/6B7280/time-machine.png" alt="" />
          <div>
            <h2>Última Saída Realizada</h2>
            <p>Histórico de Saída</p>
          </div>
        </div>
        <button
          className={styles.botaoHistorico}
          type="button"
          onClick={() => onNavigate?.('historico-saida')}
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
              <th>Motivo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan={7}>Carregando...</td></tr>
            )}
            {!carregando && historico.length === 0 && (
              <tr><td colSpan={7}>Nenhuma saída registrada.</td></tr>
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
                <td className={styles.quantidadeNegativa}>-{item.quantidade}</td>
                <td>
                  {produtos.find((p) => p.id === item.produtoId)?.categoria || '-'}
                </td>
                <td>{rotuloMotivoSaida(item.motivo)}</td>
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
        <img src="https://img.icons8.com/ios-filled/50/2563EB/info.png" alt="" />
        <span><strong>Dica:</strong> Revise os dados antes de salvar. Em caso de dúvida, clique em Ajuda.</span>
      </div>

      {linhaEdicao && (
        <div className={styles.fundoModal} onClick={() => setLinhaEdicao(null)}>
          <div className={styles.cartaoModal} onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={styles.iconeCabecalhoModal}>
                <img src="https://img.icons8.com/ios-filled/50/CA8A04/edit--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2>Editar Saída</h2>
                <p>Altere as informações da saída abaixo.</p>
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
                    {produtos.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} {produto.unidadeMedida ? `(${produto.unidadeMedida})` : ''}
                      </option>
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
                  <label htmlFor="edit-data-saida">
                    3. Data de Saída <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      ref={inputEditDataSaidaRef}
                      id="edit-data-saida"
                      type="date"
                      value={formularioEdicao.dataSaida}
                      onChange={lidarComMudancaEdicao('dataSaida')}
                      required
                    />
                    <button
                      type="button"
                      className={styles.botaoCalendario}
                      aria-label="Selecionar data"
                      onClick={() => inputEditDataSaidaRef.current?.showPicker()}
                    >
                      <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
                    </button>
                  </div>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="edit-motivo">
                    4. Motivo <span className={styles.obrigatorio}>*</span>
                  </label>
                  <input
                    id="edit-motivo"
                    type="text"
                    placeholder="Digite o motivo..."
                    value={formularioEdicao.motivo}
                    onChange={lidarComMudancaEdicao('motivo')}
                    required
                  />
                  <label className={styles.linhaInterruptor}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={formularioEdicao.perda}
                      className={`${styles.interruptor} ${formularioEdicao.perda ? styles.interruptorAtivo : ''}`}
                      onClick={alternarPerdaEdicao}
                    >
                      <span className={styles.interruptorBolinha} />
                    </button>
                    Perda
                  </label>
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
                    <strong>{enviando ? 'Salvando...' : 'Alterar Saída'}</strong>
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
                <h2>Excluir Saída</h2>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setLinhaExclusao(null)}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            <div className={styles.caixaPerigo}>
              <strong>Tem Certeza que Deseja Excluir esta Saída?</strong>
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
                Excluir Saída
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default GerenciarSaida;
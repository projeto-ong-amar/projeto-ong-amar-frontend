import { useEffect, useState, useRef } from 'react';
import { Formulario } from '../components/common/Formulario.jsx';
import { QUANTIDADE_MAXIMA } from '../utils/validacao.js';
import styles from './GerenciarSaida.module.css';
import { listarProdutos } from '../services/produtoService';
import { getUsuarioLogado } from '../services/authService.js';
import {
  listarHistoricoSaida,
  registrarSaida,
  atualizarSaida,
  removerSaida,
} from '../services/saidaService';
import {
  formatarMotivoSaida,
  interpretarMotivoSaida,
  rotuloMotivoSaida,
  MOTIVOS_SAIDA,
  MOTIVO_OUTROS,
  resolverMotivo,
  separarMotivo,
} from '../utils/motivoSaida';

function fkUsuarioAtual() {
  return getUsuarioLogado()?.id ?? null;
}

const formularioVazio = {
  produto: '',
  quantidade: '',
  dataSaida: '',
  motivoSelecionado: '',
  motivoOutro: '',
  perda: false,
};

function CampoMotivoSaida({ idPrefixo, formulario, setFormulario, className = '', numero = 4 }) {
  function lidarComMotivo(evento) {
    const novo = evento.target.value;
    setFormulario((anterior) => {
      const proximo = { ...anterior, motivoSelecionado: novo };
      if (novo !== MOTIVO_OUTROS) proximo.motivoOutro = '';
      return proximo;
    });
  }

  return (
    <div className={`${styles.campo} ${className}`}>
      <label htmlFor={`${idPrefixo}motivo`}>
        {numero}. Motivo {!formulario.perda && <span className={styles.obrigatorio}>*</span>}
      </label>
      <select
        id={`${idPrefixo}motivo`}
        value={formulario.motivoSelecionado}
        onChange={lidarComMotivo}
        disabled={formulario.perda}
        required={!formulario.perda}
        aria-describedby={formulario.perda ? `${idPrefixo}motivo-ajuda` : undefined}
      >
        <option value="">Selecione um motivo</option>
        {MOTIVOS_SAIDA.map((item) => (
          <option key={item.valor} value={item.valor}>{item.valor}</option>
        ))}
        <option value={MOTIVO_OUTROS}>{MOTIVO_OUTROS}</option>
      </select>
      {formulario.perda && <small id={`${idPrefixo}motivo-ajuda`}>Perda já define o motivo da saída.</small>}
      {formulario.perda && (
        <>
          <label htmlFor={`${idPrefixo}motivo-perda`}>Motivo da perda (opcional)</label>
          <input
            id={`${idPrefixo}motivo-perda`}
            type="text"
            placeholder="Descreva o motivo da perda..."
            value={formulario.motivoOutro}
            onChange={(evento) => setFormulario((anterior) => ({ ...anterior, motivoOutro: evento.target.value }))}
            maxLength={233}
          />
        </>
      )}
      {!formulario.perda && formulario.motivoSelecionado === MOTIVO_OUTROS && (
        <input
          id={`${idPrefixo}motivo-outro`}
          type="text"
          style={{ marginTop: 8 }}
          placeholder="Digite o motivo..."
          value={formulario.motivoOutro}
          onChange={(evento) => setFormulario((anterior) => ({ ...anterior, motivoOutro: evento.target.value }))}
          minLength={3}
          maxLength={240}
          required
        />
      )}
      <label className={styles.linhaInterruptor}>
        <button
          type="button"
          role="switch"
          aria-checked={formulario.perda}
          className={`${styles.interruptor} ${formulario.perda ? styles.interruptorAtivo : ''}`}
          onClick={() => setFormulario((anterior) => ({
            ...anterior,
            perda: !anterior.perda,
            motivoSelecionado: '',
            motivoOutro: '',
          }))}
        >
          <span className={styles.interruptorBolinha} />
        </button>
        Perda
      </label>
    </div>
  );
}

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

function dataNoFuturo(dataIso) {
  return Boolean(dataIso) && dataIso > dataLocalHojeIso();
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
  const [erroEdicao, setErroEdicao] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [formulario, setFormulario] = useState(formularioVazio);
  const [menuAberto, setMenuAberto] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(null);
  const [formularioEdicao, setFormularioEdicao] = useState(formularioVazio);
  const [linhaExclusao, setLinhaExclusao] = useState(null);
  const [erroExclusao, setErroExclusao] = useState('');
  const [excluindo, setExcluindo] = useState(false);

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

    if (dataNoFuturo(formulario.dataSaida)) {
      setErro('A data de saída não pode ser futura.');
      return;
    }

    setEnviando(true);
    try {
      await registrarSaida({
        quantidade: Number(formulario.quantidade),
        dataSaida: formulario.dataSaida,
        motivo: formatarMotivoSaida({ motivo: resolverMotivo(formulario), perda: formulario.perda }),
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
      ...(perda
        ? { motivoSelecionado: '', motivoOutro: motivo }
        : separarMotivo(motivo)),
      perda,
    });
    setLinhaEdicao(item);
    setMenuAberto(null);
    setErro('');
    setErroEdicao('');
  }

  function lidarComMudancaEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  async function lidarComAlterar(evento) {
    evento.preventDefault();
    setErroEdicao('');
    setSucesso('');

    if (dataNoFuturo(formularioEdicao.dataSaida)) {
      setErroEdicao('A data de saída não pode ser futura.');
      return;
    }

    setEnviando(true);
    try {
      await atualizarSaida(linhaEdicao.id, {
        quantidade: Number(formularioEdicao.quantidade),
        dataSaida: formularioEdicao.dataSaida,
        motivo: formatarMotivoSaida({ motivo: resolverMotivo(formularioEdicao), perda: formularioEdicao.perda }),
        fkProduto: Number(formularioEdicao.produto),
        fkUsuario: fkUsuarioAtual(),
      });
      setSucesso('Saída atualizada com sucesso!');
      setLinhaEdicao(null);
      await carregarDados();
    } catch (e) {
      setErroEdicao(e.message || 'Não foi possível atualizar a saída.');
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarExclusao() {
    if (!linhaExclusao || excluindo) return;
    setErro('');
    setSucesso('');
    setErroExclusao('');
    setExcluindo(true);
    try {
      await removerSaida(linhaExclusao.id);
      setSucesso('Saída removida com sucesso!');
      setLinhaExclusao(null);
      await carregarDados();
    } catch (e) {
      setErroExclusao(e.message || 'Não foi possível remover a saída.');
    } finally {
      setExcluindo(false);
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
      {sucesso && <div className={styles.mensagemSucesso} role="status">{sucesso}</div>}

      <Formulario className={styles.cartaoFormulario} onSubmit={lidarComSalvar}>
        <div className={styles.gradeFormulario}>
          <div className={`${styles.campo} ${styles.campoGrande}`}>
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
              max={QUANTIDADE_MAXIMA}
              step="1"
              placeholder="Ex: 10"
              value={formulario.quantidade}
              onChange={lidarComMudanca('quantidade')}
              required
            />
          </div>

          <CampoMotivoSaida
            idPrefixo=""
            formulario={formulario}
            setFormulario={setFormulario}
            className={styles.campoGrande}
            numero={3}
          />

          <div className={`${styles.campo} ${styles.campoPequeno}`}>
            <label htmlFor="data-saida">
              4. Data de Saída <span className={styles.obrigatorio}>*</span>
            </label>
            <div className={styles.envoltorioData}>
              <input
                ref={inputDataSaidaRef}
                id="data-saida"
                type="date"
                max={dataLocalHojeIso()}
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
      </Formulario>

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
                              setErroExclusao('');
                              setSucesso('');
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
          <div className={styles.cartaoModal} role="dialog" aria-modal="true" aria-labelledby="titulo-editar-saida" onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={styles.iconeCabecalhoModal}>
                <img src="https://img.icons8.com/ios-filled/50/CA8A04/edit--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2 id="titulo-editar-saida">Editar Saída</h2>
                <p>Altere as informações da saída abaixo.</p>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setLinhaEdicao(null)}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            <Formulario onSubmit={lidarComAlterar}>
              {erroEdicao && <div className={styles.mensagemErro} role="alert">{erroEdicao}</div>}
              <div className={styles.gradeFormulario}>
                <div className={`${styles.campo} ${styles.campoGrande}`}>
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
                    max={QUANTIDADE_MAXIMA}
                    step="1"
                    placeholder="Ex: 10"
                    value={formularioEdicao.quantidade}
                    onChange={lidarComMudancaEdicao('quantidade')}
                    required
                  />
                </div>

                <div className={`${styles.campo} ${styles.campoMetade}`}>
                  <label htmlFor="edit-data-saida">
                    3. Data de Saída <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      ref={inputEditDataSaidaRef}
                      id="edit-data-saida"
                      type="date"
                      max={dataLocalHojeIso()}
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

                <CampoMotivoSaida
                  idPrefixo="edit-"
                  formulario={formularioEdicao}
                  setFormulario={setFormularioEdicao}
                  className={styles.campoInteiro}
                />
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
            </Formulario>
          </div>
        </div>
      )}

      {linhaExclusao && (
        <div className={styles.fundoModal} onClick={() => !excluindo && setLinhaExclusao(null)}>
          <div className={`${styles.cartaoModal} ${styles.cartaoModalPequeno}`} role="dialog" aria-modal="true" aria-label="Excluir Saída" onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={`${styles.iconeCabecalhoModal} ${styles.iconeCabecalhoModalPerigo}`}>
                <img src="https://img.icons8.com/ios-filled/50/DC2626/trash--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2>Excluir Saída</h2>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setLinhaExclusao(null)} disabled={excluindo}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            <div className={styles.caixaPerigo}>
              <strong>Tem Certeza que Deseja Excluir esta Saída?</strong>
              <p>Esta ação não poderá ser desfeita.</p>
            </div>

            {erroExclusao && <div className={styles.mensagemErro} role="alert">{erroExclusao}</div>}

            <div className={styles.linhaAcoes}>
              <button type="button" className={styles.botaoModalCancelar} onClick={() => setLinhaExclusao(null)} disabled={excluindo}>
                <span className={styles.iconeAcao}>
                  <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
                </span>
                Cancelar
              </button>

              <button type="button" className={styles.botaoModalExcluir} onClick={confirmarExclusao} disabled={excluindo}>
                <span className={styles.iconeAcao}>
                  <img src="https://img.icons8.com/ios-filled/50/FFFFFF/trash--v1.png" alt="" />
                </span>
                {excluindo ? 'Excluindo...' : 'Excluir Saída'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default GerenciarSaida;

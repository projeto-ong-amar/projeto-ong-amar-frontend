import { useCallback, useEffect, useRef, useState } from 'react';
import { Formulario } from '../components/common/Formulario.jsx';
import { QUANTIDADE_MAXIMA } from '../utils/validacao.js';
import styles from './GerenciarEntrada.module.css';
import Historico from './Historico.jsx';
import { listarProdutos } from '../services/produtoService';
import { getUsuarioLogado } from '../services/authService.js';
import { listarHistoricoEntrada, atualizarEntrada, removerEntrada } from '../services/entradaService';

const MOTIVO_PADRAO = 'Entrada registrada no sistema';

function dataLocalHojeIso() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function paraBr(dataIso) {
  if (!dataIso) return '';
  const [data] = dataIso.split('T');
  const [ano, mes, dia] = data.split('-');
  if (!ano || !mes || !dia) return dataIso;
  return `${dia}/${mes}/${ano}`;
}

export function HistoricoEntrada() {
  const [produtos, setProdutos] = useState([]);
  const [versao, setVersao] = useState(0);
  const [itemEdicao, setItemEdicao] = useState(null);
  const [formularioEdicao, setFormularioEdicao] = useState({ produto: '', quantidade: '', dataEntrada: '', dataValidade: '' });
  const [salvando, setSalvando] = useState(false);
  const [erroEdicao, setErroEdicao] = useState('');
  const inputEditDataEntradaRef = useRef(null);
  const inputEditDataValidadeRef = useRef(null);

  useEffect(() => {
    listarProdutos()
      .then((lista) => setProdutos(lista || []))
      .catch(() => setProdutos([]));
  }, []);

  function nomeProduto(item) {
    const encontrado = produtos.find((p) => p.id === item.produtoId);
    if (!encontrado) return item.produtoNome || '-';
    return `${encontrado.nome}${encontrado.unidadeMedida ? ` (${encontrado.unidadeMedida})` : ''}`;
  }

  function categoriaProduto(item) {
    return produtos.find((p) => p.id === item.produtoId)?.categoria || '-';
  }

  const carregarPagina = useCallback(async (pagina, tamanho) => {
    const paginaResultado = await listarHistoricoEntrada(pagina, tamanho);
    return {
      itens: paginaResultado?.content || [],
      totalPaginas: paginaResultado?.totalPages ?? 0,
    };
  }, [versao]);

  function abrirEdicao(item) {
    setFormularioEdicao({
      produto: String(item.produtoId ?? ''),
      quantidade: String(item.quantidade ?? ''),
      dataEntrada: item.dataHora ? item.dataHora.split('T')[0] : '',
      dataValidade: item.dataValidade ? item.dataValidade.split('T')[0] : '',
    });
    setErroEdicao('');
    setItemEdicao(item);
  }

  function alterarCampoEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  async function salvarEdicao(evento) {
    evento.preventDefault();
    setErroEdicao('');
    if (formularioEdicao.dataEntrada && formularioEdicao.dataEntrada > dataLocalHojeIso()) {
      setErroEdicao('A data de entrada não pode ser futura.');
      return;
    }
    if (formularioEdicao.dataValidade && formularioEdicao.dataValidade < dataLocalHojeIso()) {
      setErroEdicao('A data de validade não pode ser anterior a hoje.');
      return;
    }
    if (formularioEdicao.dataValidade && formularioEdicao.dataEntrada && formularioEdicao.dataValidade < formularioEdicao.dataEntrada) {
      setErroEdicao('A data de validade não pode ser anterior à data de entrada.');
      return;
    }
    setSalvando(true);
    try {
      await atualizarEntrada(itemEdicao.id, {
        quantidade: Number(formularioEdicao.quantidade),
        dataEntrada: formularioEdicao.dataEntrada,
        dataValidade: formularioEdicao.dataValidade || null,
        motivo: MOTIVO_PADRAO,
        fkProduto: Number(formularioEdicao.produto),
        fkUsuario: getUsuarioLogado()?.id ?? null,
      });
      setItemEdicao(null);
      setVersao((v) => v + 1);
    } catch (e) {
      setErroEdicao(e.message || 'Não foi possível atualizar a entrada.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Historico
      icone="https://img.icons8.com/ios/50/2563EB/time-machine.png"
      titulo="Histórico de Entrada"
      subtitulo="Todas as entradas registradas no estoque."
      entidadeNome="entrada"
      mensagemExclusao="Entrada removida com sucesso!"
      mensagemVazio="Nenhuma entrada registrada."
      carregarPagina={carregarPagina}
      aoEditar={abrirEdicao}
      aoExcluir={(item) => removerEntrada(item.id)}
      colunas={[
        { chave: 'data', rotulo: 'Data', render: (item) => paraBr(item.dataHora) },
        { chave: 'responsavel', rotulo: 'Responsável', render: (item) => item.responsavelNome || '-' },
        { chave: 'produto', rotulo: 'Produto', render: (item) => nomeProduto(item) },
        {
          chave: 'quantidade',
          rotulo: 'Quantidade',
          className: styles.quantidadePositiva,
          render: (item) => `+${item.quantidade}`,
        },
        { chave: 'categoria', rotulo: 'Categoria', render: (item) => categoriaProduto(item) },
      ]}
      />
      {itemEdicao && (
        <div className={styles.fundoModal} onClick={() => !salvando && setItemEdicao(null)}>
          <div className={styles.cartaoModal} role="dialog" aria-modal="true" aria-label="Editar Entrada" onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={styles.iconeCabecalhoModal}>
                <img src="https://img.icons8.com/ios-filled/50/CA8A04/edit--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2>Editar Entrada</h2>
                <p>Altere as informações da entrada abaixo.</p>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setItemEdicao(null)}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />
            {erroEdicao && <div className={styles.mensagemErro} role="alert">{erroEdicao}</div>}

            <Formulario onSubmit={salvarEdicao}>
              <div className={`${styles.gradeFormulario} ${styles.gradeModal}`}>
                <div className={`${styles.campo} ${styles.campoInteiro}`}>
                  <label htmlFor="hist-edit-produto">
                    1. Selecionar Produto <span className={styles.obrigatorio}>*</span>
                  </label>
                  <select id="hist-edit-produto" value={formularioEdicao.produto} onChange={alterarCampoEdicao('produto')} required>
                    <option value="">Selecione o Produto</option>
                    {produtos.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} {produto.unidadeMedida ? `(${produto.unidadeMedida})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`${styles.campo} ${styles.campoPequeno}`}>
                  <label htmlFor="hist-edit-quantidade">
                    2. Quantidade <span className={styles.obrigatorio}>*</span>
                  </label>
                  <input
                    id="hist-edit-quantidade"
                    type="number"
                    min="1"
                    max={QUANTIDADE_MAXIMA}
                    step="1"
                    placeholder="Ex: 10"
                    value={formularioEdicao.quantidade}
                    onChange={alterarCampoEdicao('quantidade')}
                    required
                  />
                </div>

                <div className={`${styles.campo} ${styles.campoPequeno}`}>
                  <label htmlFor="hist-edit-data-entrada">
                    3. Data de Entrada <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      ref={inputEditDataEntradaRef}
                      id="hist-edit-data-entrada"
                      data-erro-max="A data de entrada não pode ser futura."
                      type="date"
                      max={dataLocalHojeIso()}
                      value={formularioEdicao.dataEntrada}
                      onChange={alterarCampoEdicao('dataEntrada')}
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
                  <label htmlFor="hist-edit-data-validade">
                    4. Data de Validade <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      ref={inputEditDataValidadeRef}
                      id="hist-edit-data-validade"
                      data-min-campo="hist-edit-data-entrada"
                      data-erro-relacao="A data de validade não pode ser anterior à data de entrada."
                      data-erro-min="A data de validade não pode ser anterior a hoje."
                      type="date"
                      min={dataLocalHojeIso()}
                      value={formularioEdicao.dataValidade}
                      onChange={alterarCampoEdicao('dataValidade')}
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
                <button type="button" className={styles.botaoCancelar} onClick={() => setItemEdicao(null)}>
                  <span className={styles.iconeAcao}>
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
                  </span>
                  <span className={styles.textoAcao}>
                    <strong>Cancelar</strong>
                    <small>Limpar os campos</small>
                  </span>
                </button>

                <button type="submit" className={styles.botaoSalvar} disabled={salvando}>
                  <span className={styles.iconeAcao}>
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
                  </span>
                  <span className={styles.textoAcao}>
                    <strong>{salvando ? 'Salvando...' : 'Alterar Entrada'}</strong>
                    <small>Alterar no estoque</small>
                  </span>
                </button>
              </div>
            </Formulario>
          </div>
        </div>
      )}
    </>
  );
}

export default HistoricoEntrada;

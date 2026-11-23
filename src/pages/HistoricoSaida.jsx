import { useCallback, useEffect, useRef, useState } from 'react';
import { Formulario } from '../components/common/Formulario.jsx';
import styles from './GerenciarSaida.module.css';
import Historico from './Historico.jsx';
import { getUsuarioLogado } from '../services/authService.js';
import { listarProdutos } from '../services/produtoService';
import { listarHistoricoSaida, atualizarSaida, removerSaida } from '../services/saidaService';
import {
  formatarMotivoSaida,
  interpretarMotivoSaida,
  rotuloMotivoSaida,
  MOTIVOS_SAIDA,
  MOTIVO_OUTROS,
  resolverMotivo,
  separarMotivo,
} from '../utils/motivoSaida';
import { QUANTIDADE_MAXIMA } from '../utils/validacao.js';

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

export function HistoricoSaida() {
  const [produtos, setProdutos] = useState([]);
  const [versao, setVersao] = useState(0);
  const [itemEdicao, setItemEdicao] = useState(null);
  const [formularioEdicao, setFormularioEdicao] = useState({
    produto: '',
    quantidade: '',
    dataSaida: '',
    motivoSelecionado: '',
    motivoOutro: '',
    perda: false,
  });
  const [salvando, setSalvando] = useState(false);
  const [erroEdicao, setErroEdicao] = useState('');
  const inputEditDataSaidaRef = useRef(null);

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
    const paginaResultado = await listarHistoricoSaida(pagina, tamanho);
    return {
      itens: paginaResultado?.content || [],
      totalPaginas: paginaResultado?.totalPages ?? 0,
    };
  }, [versao]);

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
    setErroEdicao('');
    setItemEdicao(item);
  }

  function alterarCampoEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  async function salvarEdicao(evento) {
    evento.preventDefault();
    setErroEdicao('');
    if (formularioEdicao.dataSaida && formularioEdicao.dataSaida > dataLocalHojeIso()) {
      setErroEdicao('A data de saída não pode ser futura.');
      return;
    }
    setSalvando(true);
    try {
      await atualizarSaida(itemEdicao.id, {
        quantidade: Number(formularioEdicao.quantidade),
        dataSaida: formularioEdicao.dataSaida,
        motivo: formatarMotivoSaida({ motivo: resolverMotivo(formularioEdicao), perda: formularioEdicao.perda }),
        fkProduto: Number(formularioEdicao.produto),
        fkUsuario: getUsuarioLogado()?.id ?? null,
      });
      setItemEdicao(null);
      setVersao((v) => v + 1);
    } catch (e) {
      setErroEdicao(e.message || 'Não foi possível atualizar a saída.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Historico
      icone="https://img.icons8.com/ios/50/2563EB/time-machine.png"
      titulo="Histórico de Saída"
      subtitulo="Todas as saídas registradas no estoque."
      entidadeNome="saída"
      mensagemExclusao="Saída removida com sucesso!"
      mensagemVazio="Nenhuma saída registrada."
      carregarPagina={carregarPagina}
      aoEditar={abrirEdicao}
      aoExcluir={(item) => removerSaida(item.id)}
      colunas={[
        { chave: 'data', rotulo: 'Data', render: (item) => paraBr(item.dataHora) },
        { chave: 'responsavel', rotulo: 'Responsável', render: (item) => item.responsavelNome || '-' },
        { chave: 'produto', rotulo: 'Produto', render: (item) => nomeProduto(item) },
        {
          chave: 'quantidade',
          rotulo: 'Quantidade',
          className: styles.quantidadeNegativa,
          render: (item) => `-${item.quantidade}`,
        },
        { chave: 'categoria', rotulo: 'Categoria', render: (item) => categoriaProduto(item) },
        {
          chave: 'motivo',
          rotulo: 'Motivo',
          render: (item) => rotuloMotivoSaida(item.motivo),
        },
      ]}
      />
      {itemEdicao && (
        <div className={styles.fundoModal} onClick={() => !salvando && setItemEdicao(null)}>
          <div className={styles.cartaoModal} role="dialog" aria-modal="true" aria-label="Editar Saída" onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={styles.iconeCabecalhoModal}>
                <img src="https://img.icons8.com/ios-filled/50/CA8A04/edit--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}><h2>Editar Saída</h2></div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setItemEdicao(null)} disabled={salvando}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>
            <div className={styles.divisorModal} />
            {erroEdicao && <div className={styles.mensagemErro} role="alert">{erroEdicao}</div>}
            <Formulario onSubmit={salvarEdicao}>
              <div className={styles.gradeFormulario}>
                <div className={`${styles.campo} ${styles.campoGrande}`}>
                  <label htmlFor="hist-edit-saida-produto">
                    1. Selecionar Produto <span className={styles.obrigatorio}>*</span>
                  </label>
                  <select id="hist-edit-saida-produto" value={formularioEdicao.produto} onChange={alterarCampoEdicao('produto')} required>
                    <option value="">Selecione o produto</option>
                    {produtos.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} {produto.unidadeMedida ? `(${produto.unidadeMedida})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`${styles.campo} ${styles.campoPequeno}`}>
                  <label htmlFor="hist-edit-saida-quantidade">
                    2. Quantidade <span className={styles.obrigatorio}>*</span>
                  </label>
                  <input
                    id="hist-edit-saida-quantidade"
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

                <div className={`${styles.campo} ${styles.campoInteiro}`}>
                  <label htmlFor="hist-edit-saida-motivo">
                    3. Motivo {!formularioEdicao.perda && <span className={styles.obrigatorio}>*</span>}
                  </label>
                  <select
                    id="hist-edit-saida-motivo"
                    value={formularioEdicao.motivoSelecionado}
                    onChange={(evento) => {
                      const novo = evento.target.value;
                      setFormularioEdicao((anterior) => {
                        const proximo = { ...anterior, motivoSelecionado: novo };
                        if (novo !== MOTIVO_OUTROS) proximo.motivoOutro = '';
                        return proximo;
                      });
                    }}
                    disabled={formularioEdicao.perda}
                    required={!formularioEdicao.perda}
                  >
                    <option value="">Selecione um motivo</option>
                    {MOTIVOS_SAIDA.map((item) => (
                      <option key={item.valor} value={item.valor}>{item.valor}</option>
                    ))}
                    <option value={MOTIVO_OUTROS}>{MOTIVO_OUTROS}</option>
                  </select>

                  {formularioEdicao.perda && (
                    <>
                      <label htmlFor="hist-edit-saida-motivo-perda">Motivo da perda (opcional)</label>
                      <input
                        id="hist-edit-saida-motivo-perda"
                        type="text"
                        placeholder="Descreva o motivo da perda..."
                        value={formularioEdicao.motivoOutro}
                        onChange={(evento) => setFormularioEdicao((anterior) => ({ ...anterior, motivoOutro: evento.target.value }))}
                        maxLength={233}
                      />
                    </>
                  )}

                  {!formularioEdicao.perda && formularioEdicao.motivoSelecionado === MOTIVO_OUTROS && (
                    <input
                      id="hist-edit-saida-motivo-outro"
                      type="text"
                      style={{ marginTop: 8 }}
                      placeholder="Digite o motivo..."
                      value={formularioEdicao.motivoOutro}
                      onChange={(evento) => setFormularioEdicao((anterior) => ({ ...anterior, motivoOutro: evento.target.value }))}
                      minLength={3}
                      maxLength={240}
                      required
                    />
                  )}

                  <label className={styles.linhaInterruptor}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={formularioEdicao.perda}
                      className={`${styles.interruptor} ${formularioEdicao.perda ? styles.interruptorAtivo : ''}`}
                      onClick={() => setFormularioEdicao((anterior) => ({
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

                <div className={`${styles.campo} ${styles.campoMetade}`}>
                  <label htmlFor="hist-edit-saida-data">
                    4. Data de Saída <span className={styles.obrigatorio}>*</span>
                  </label>
                  <div className={styles.envoltorioData}>
                    <input
                      ref={inputEditDataSaidaRef}
                      id="hist-edit-saida-data"
                      data-erro-max="A data de saída não pode ser futura."
                      type="date"
                      max={dataLocalHojeIso()}
                      value={formularioEdicao.dataSaida}
                      onChange={alterarCampoEdicao('dataSaida')}
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
                    <strong>{salvando ? 'Salvando...' : 'Alterar Saída'}</strong>
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

export default HistoricoSaida;

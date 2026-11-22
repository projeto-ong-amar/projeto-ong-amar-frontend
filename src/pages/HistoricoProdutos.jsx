import { useCallback, useState } from 'react';
import { Formulario } from '../components/common/Formulario.jsx';
import { TAMANHO_TEXTO_PRODUTO } from '../utils/validacao.js';
import styles from './CadastroProdutos.module.css';
import Historico from './Historico.jsx';
import { listarProdutos, atualizarProduto, removerProduto } from '../services/produtoService';

const categoriasDisponiveis = ['ALIMENTOS', 'PRODUTOS DE HIGIENE'];

export function HistoricoProdutos() {
  const [versao, setVersao] = useState(0);
  const [itemEdicao, setItemEdicao] = useState(null);
  const [formularioEdicao, setFormularioEdicao] = useState({ nome: '', categoria: '', unidadeMedida: '' });
  const [salvando, setSalvando] = useState(false);
  const [erroEdicao, setErroEdicao] = useState('');

  const carregarPagina = useCallback(async (pagina, tamanho) => {
    const todos = (await listarProdutos()) || [];
    const totalPaginas = Math.max(1, Math.ceil(todos.length / tamanho));
    const inicio = pagina * tamanho;
    return {
      itens: todos.slice(inicio, inicio + tamanho),
      totalPaginas,
    };
  }, [versao]);

  function abrirEdicao(item) {
    setFormularioEdicao({
      nome: item.nome || '',
      categoria: item.categoria || '',
      unidadeMedida: item.unidadeMedida || '',
    });
    setErroEdicao('');
    setItemEdicao(item);
  }

  function alterarCampoEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  async function salvarEdicao(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErroEdicao('');
    try {
      await atualizarProduto(itemEdicao.id, formularioEdicao);
      setItemEdicao(null);
      setVersao((v) => v + 1);
    } catch (e) {
      setErroEdicao(e.message || 'Não foi possível atualizar o produto.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Historico
        icone="https://img.icons8.com/ios/50/2563EB/task.png"
        titulo="Histórico de Produtos"
        subtitulo="Todos os produtos cadastrados no estoque."
        entidadeNome="produto"
        mensagemExclusao="Produto removido com sucesso!"
        mensagemVazio="Nenhum produto cadastrado."
        carregarPagina={carregarPagina}
        aoEditar={abrirEdicao}
        aoExcluir={(item) => removerProduto(item.id)}
        colunas={[
          { chave: 'nome', rotulo: 'Produto', render: (item) => item.nome },
          { chave: 'unidade', rotulo: 'Unidade de Medida', render: (item) => item.unidadeMedida || '-' },
          { chave: 'categoria', rotulo: 'Categoria', render: (item) => item.categoria || '-' },
        ]}
      />
      {itemEdicao && (
        <div className={styles.fundoModal} onClick={() => !salvando && setItemEdicao(null)}>
          <div className={styles.cartaoModal} role="dialog" aria-modal="true" aria-label="Editar Produto" onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={styles.iconeCabecalhoModal}>
                <img src="https://img.icons8.com/ios-filled/50/CA8A04/edit--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}><h2>Editar Produto</h2></div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setItemEdicao(null)} disabled={salvando}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>
            <div className={styles.divisorModal} />
            {erroEdicao && <div className={styles.mensagemErro} role="alert">{erroEdicao}</div>}
            <Formulario onSubmit={salvarEdicao}>
              <div className={styles.gradeFormulario}>
                <div className={styles.campo}>
                  <label htmlFor="hist-edit-prod-nome">
                    1. Nome do Produto <span className={styles.obrigatorio}>*</span>
                  </label>
                  <input
                    id="hist-edit-prod-nome"
                    type="text"
                    placeholder="Digite o nome do produto"
                    value={formularioEdicao.nome}
                    onChange={alterarCampoEdicao('nome')}
                    minLength={3}
                    maxLength={TAMANHO_TEXTO_PRODUTO}
                    required
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="hist-edit-prod-categoria">
                    2. Categoria <span className={styles.obrigatorio}>*</span>
                  </label>
                  <select
                    id="hist-edit-prod-categoria"
                    value={formularioEdicao.categoria}
                    onChange={alterarCampoEdicao('categoria')}
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {categoriasDisponiveis.map((categoria) => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="hist-edit-prod-unidade">
                    3. Unidade de Medida <span className={styles.obrigatorio}>*</span>
                  </label>
                  <input
                    id="hist-edit-prod-unidade"
                    type="text"
                    placeholder="Ex: kg, l, un, cx"
                    value={formularioEdicao.unidadeMedida}
                    onChange={alterarCampoEdicao('unidadeMedida')}
                    maxLength={TAMANHO_TEXTO_PRODUTO}
                    required
                  />
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
                    <strong>{salvando ? 'Salvando...' : 'Alterar Produto'}</strong>
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

export default HistoricoProdutos;

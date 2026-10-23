import { useCallback, useState } from 'react';
import Historico from './Historico.jsx';
import styles from './CadastroUsuario.module.css';
import { listarUsuarios } from '../services/usuarioService.js';

function usuarioEstaAtivo(status) {
  if (typeof status === 'boolean') return status;
  return String(status ?? '').trim().toLowerCase() === 'ativo';
}

function formatarData(valor) {
  if (!valor) return '-';
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? '-' : new Intl.DateTimeFormat('pt-BR').format(data);
}

export function HistoricoUsuario() {
  const [versao, setVersao] = useState(0);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formularioEdicao, setFormularioEdicao] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroEdicao, setErroEdicao] = useState('');

  const carregarPagina = useCallback(async (pagina, tamanho) => {
    const todos = (await listarUsuarios()) || [];
    const totalPaginas = Math.max(1, Math.ceil(todos.length / tamanho));
    const inicio = pagina * tamanho;
    return { itens: todos.slice(inicio, inicio + tamanho), totalPaginas };
  }, [versao]);

  function abrirEdicao(usuario) {
    setFormularioEdicao({
      nome: usuario.nome,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      status: usuarioEstaAtivo(usuario.status) ? 'Ativo' : 'Inativo',
    });
    setErroEdicao('');
    setUsuarioEditando(usuario);
  }

  function fecharEdicao() {
    if (salvando) return;
    setUsuarioEditando(null);
  }

  function alterarCampoEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  async function salvarEdicao(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErroEdicao('');
    try {
      
      setUsuarioEditando(null);
      setVersao((v) => v + 1);
    } catch (e) {
      setErroEdicao(e.message || 'Não foi possível alterar o usuário.');
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(usuario) {
   
  }

  return (
    <>
      <Historico
        icone="https://img.icons8.com/ios/50/2563EB/user-group-man-man.png"
        titulo="Histórico de Usuários"
        subtitulo="Usuários cadastrados no sistema."
        entidadeNome="usuário"
        mensagemVazio="Nenhum usuário cadastrado."
        carregarPagina={carregarPagina}
        aoEditar={abrirEdicao}
        aoExcluir={excluir}
        colunas={[
          { chave: 'data', rotulo: 'Data', render: (item) => formatarData(item.dataCadastro) },
          { chave: 'nome', rotulo: 'Nome', render: (item) => item.nome },
          { chave: 'email', rotulo: 'E-mail', render: (item) => item.email },
          {
            chave: 'tipo',
            rotulo: 'Tipo de usuário',
            render: (item) => (item.tipoUsuario === 'ADMINISTRADOR' ? 'Administrador' : 'Voluntário'),
          },
          {
            chave: 'status',
            rotulo: 'Status',
            render: (item) => {
              const ativo = usuarioEstaAtivo(item.status);
              return (
                <span className={`${styles.etiquetaStatus} ${ativo ? styles.ativo : styles.inativo}`}>
                  {ativo ? 'Ativo' : 'Inativo'}
                </span>
              );
            },
          },
        ]}
      />

      {usuarioEditando && formularioEdicao && (
        <div className={styles.fundoModal} onClick={fecharEdicao}>
          <div className={styles.cartaoModal} onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={styles.iconeCabecalhoModal}>
                <img src="https://img.icons8.com/ios-filled/50/CA8A04/edit--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2>Editar Usuário</h2>
                <p>Altere as informações do usuário abaixo.</p>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={fecharEdicao} disabled={salvando}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            {erroEdicao && <div className={styles.mensagemErro} role="alert">{erroEdicao}</div>}

            <form onSubmit={salvarEdicao}>
              <div className={styles.gradeFormulario}>
                <div className={styles.campo}>
                  <label htmlFor="edit-nome">1. Nome Completo <span className={styles.obrigatorio}>*</span></label>
                  <input id="edit-nome" type="text" placeholder="Digite o nome completo" value={formularioEdicao.nome} onChange={alterarCampoEdicao('nome')} minLength={3} maxLength={255} required />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="edit-email">2. E-mail <span className={styles.obrigatorio}>*</span></label>
                  <input id="edit-email" type="email" placeholder="Digite o e-mail" value={formularioEdicao.email} onChange={alterarCampoEdicao('email')} maxLength={255} required />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="edit-tipo">3. Tipo de Usuário <span className={styles.obrigatorio}>*</span></label>
                  <select id="edit-tipo" value={formularioEdicao.tipoUsuario} onChange={alterarCampoEdicao('tipoUsuario')} required>
                    <option value="VOLUNTARIO">Voluntário</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </div>

                <div className={`${styles.campo} ${styles.campoStatus}`}>
                  <span className={styles.rotulo}>4. Status <span className={styles.obrigatorio}>*</span></span>
                  <label className={styles.interruptor} htmlFor="edit-status">
                    <input id="edit-status" type="checkbox" checked={formularioEdicao.status === 'Ativo'} onChange={(evento) => setFormularioEdicao((anterior) => ({ ...anterior, status: evento.target.checked ? 'Ativo' : 'Inativo' }))} />
                    <span className={styles.trilho} aria-hidden="true" />
                    <span>{formularioEdicao.status}</span>
                  </label>
                </div>
              </div>

              <div className={styles.linhaAcoes}>
                <button type="button" className={styles.botaoCancelar} onClick={fecharEdicao} disabled={salvando}>
                  <span className={styles.iconeAcao}><img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" /></span>
                  <span className={styles.textoAcao}><strong>Cancelar</strong><small>Fechar sem alterar</small></span>
                </button>
                <button type="submit" className={styles.botaoSalvar} disabled={salvando}>
                  <span className={styles.iconeAcao}><img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" /></span>
                  <span className={styles.textoAcao}><strong>{salvando ? 'Alterando...' : 'Alterar Usuário'}</strong><small>Alterar no sistema</small></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default HistoricoUsuario;
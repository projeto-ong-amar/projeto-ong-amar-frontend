import { useState } from 'react';
import { cadastrarUsuario } from '../services/authService.js';
// import {
//   salvarUsuarioNoHistorico,
//   atualizarUsuarioNoHistorico,
//   removerUsuarioDoHistorico,
// } from '../services/usuarioHistoricoLocal.js';
import styles from './CadastroUsuario.module.css';

const formularioInicial = {
  nome: '',
  email: '',
  tipoUsuario: 'VOLUNTARIO',
  status: 'Ativo',
};

export function CadastroUsuario({ onNavigate }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [ultimoUsuario, setUltimoUsuario] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const [edicaoAberta, setEdicaoAberta] = useState(false);
  const [formularioEdicao, setFormularioEdicao] = useState(formularioInicial);
  const [exclusaoAberta, setExclusaoAberta] = useState(false);

  function alterarCampo(campo) {
    return (evento) => {
      setFormulario((anterior) => ({ ...anterior, [campo]: evento.target.value }));
      setErro('');
    };
  }

  function limparFormulario() {
    setFormulario(formularioInicial);
    setErro('');
    setSucesso('');
  }

  async function cadastrar(evento) {
    evento.preventDefault();

    setEnviando(true);
    setErro('');
    setSucesso('');

    try {
      await cadastrarUsuario(formulario);
      setSucesso('Usuário cadastrado com sucesso!');
      const novoUsuario = {
        ...formulario,
        id: Date.now(),
        criadoEm: Date.now(),
        dataCadastro: new Intl.DateTimeFormat('pt-BR').format(new Date()),
      };
      setUltimoUsuario(novoUsuario);
      salvarUsuarioNoHistorico(novoUsuario);
      setFormulario(formularioInicial);
    } catch (error) {
      setErro(error.message || 'Não foi possível cadastrar o usuário.');
    } finally {
      setEnviando(false);
    }
  }

  function abrirEdicao() {
    if (!ultimoUsuario) return;
    setFormularioEdicao({
      nome: ultimoUsuario.nome,
      email: ultimoUsuario.email,
      tipoUsuario: ultimoUsuario.tipoUsuario,
      status: ultimoUsuario.status,
    });
    setEdicaoAberta(true);
    setMenuAberto(false);
  }

  function alterarCampoEdicao(campo) {
    return (evento) => setFormularioEdicao((anterior) => ({ ...anterior, [campo]: evento.target.value }));
  }

  function salvarEdicao(evento) {
    evento.preventDefault();
    setUltimoUsuario((anterior) => ({ ...anterior, ...formularioEdicao }));
    if (ultimoUsuario?.id) {
      atualizarUsuarioNoHistorico(ultimoUsuario.id, formularioEdicao);
    }
    setEdicaoAberta(false);
  }

  function abrirExclusao() {
    setExclusaoAberta(true);
    setMenuAberto(false);
  }

  function confirmarExclusao() {
    if (ultimoUsuario?.id) {
      removerUsuarioDoHistorico(ultimoUsuario.id);
    }
    setUltimoUsuario(null);
    setExclusaoAberta(false);
  }

  return (
    <main className={styles.conteudo}>
      <div className={styles.cabecalhoPagina}>
        <div className={styles.iconeCabecalhoPagina}>
          <img src="https://img.icons8.com/ios/50/2563EB/user-group-man-man.png" alt="" />
        </div>
        <div>
          <h1>Cadastro de Novos Usuários</h1>
          <p>Preencha os dados abaixo para registrar um novo usuário no sistema.</p>
        </div>
      </div>

      {erro && <div className={styles.mensagemErro} role="alert">{erro}</div>}
      {sucesso && <div className={styles.mensagemSucesso} role="status">{sucesso}</div>}

      <form className={styles.cartaoFormulario} onSubmit={cadastrar}>
        <div className={styles.gradeFormulario}>
          <div className={styles.campo}>
            <label htmlFor="nome-usuario">1. Nome Completo <span className={styles.obrigatorio}>*</span></label>
            <input id="nome-usuario" type="text" placeholder="Digite o nome completo (ex. Gustavo Roiz)" value={formulario.nome} onChange={alterarCampo('nome')} minLength={3} maxLength={255} required />
          </div>

          <div className={styles.campo}>
            <label htmlFor="email-usuario">2. E-mail <span className={styles.obrigatorio}>*</span></label>
            <input id="email-usuario" type="email" placeholder="Digite o e-mail (ex: pk@email.com)" value={formulario.email} onChange={alterarCampo('email')} maxLength={255} autoComplete="email" required />
          </div>

          <div className={styles.campo}>
            <label htmlFor="tipo-usuario">3. Tipo de Usuário <span className={styles.obrigatorio}>*</span></label>
            <select id="tipo-usuario" value={formulario.tipoUsuario} onChange={alterarCampo('tipoUsuario')} required>
              <option value="VOLUNTARIO">Voluntário</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>

          <div className={`${styles.campo} ${styles.campoStatus}`}>
            <span className={styles.rotulo}>4. Status <span className={styles.obrigatorio}>*</span></span>
            <label className={styles.interruptor} htmlFor="status-usuario">
              <input id="status-usuario" type="checkbox" checked={formulario.status === 'Ativo'} onChange={(evento) => setFormulario((anterior) => ({ ...anterior, status: evento.target.checked ? 'Ativo' : 'Inativo' }))} />
              <span className={styles.trilho} aria-hidden="true" />
              <span>{formulario.status}</span>
            </label>
            <p className={styles.ajudaStatus}><img src="https://img.icons8.com/ios-filled/50/2563EB/info.png" alt="" />Informe se o usuário será ativo ou inativo.</p>
          </div>
        </div>

        <div className={styles.linhaAcoes}>
          <button type="button" className={styles.botaoCancelar} onClick={limparFormulario} disabled={enviando}>
            <span className={styles.iconeAcao}><img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" /></span>
            <span className={styles.textoAcao}><strong>Cancelar</strong><small>Limpar os campos</small></span>
          </button>
          <button type="submit" className={styles.botaoSalvar} disabled={enviando}>
            <span className={styles.iconeAcao}><img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" /></span>
            <span className={styles.textoAcao}><strong>{enviando ? 'Cadastrando...' : 'Salvar Usuário'}</strong><small>Registrar no sistema</small></span>
          </button>
        </div>
      </form>

      <div className={styles.cabecalhoHistorico}>
        <div className={styles.tituloHistorico}>
          <img src="https://img.icons8.com/ios/50/6B7280/time-machine.png" alt="" />
          <div>
            <h2>Último Usuário Cadastrado</h2>
            <p>Veja os dados do último usuário registrado no sistema.</p>
          </div>
        </div>
        <button
          className={styles.botaoHistorico}
          type="button"
          onClick={() => onNavigate?.('historico-usuario')}
        >
          Histórico
        </button>
      </div>

      <div className={styles.envoltorioTabela}>
        <table className={styles.tabela}>
          <thead>
            <tr><th>Data</th><th>Nome</th><th>E-mail</th><th>Tipo de usuário</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {ultimoUsuario ? (
              <tr>
                <td>{ultimoUsuario.dataCadastro}</td>
                <td>{ultimoUsuario.nome}</td>
                <td>{ultimoUsuario.email}</td>
                <td>{ultimoUsuario.tipoUsuario === 'ADMINISTRADOR' ? 'Administrador' : 'Voluntário'}</td>
                <td><span className={`${styles.etiquetaStatus} ${ultimoUsuario.status === 'Ativo' ? styles.ativo : styles.inativo}`}>{ultimoUsuario.status}</span></td>
                <td className={styles.celulaAcoes}>
                  <div className={styles.envoltorioAcoes}>
                    <button className={styles.botaoMenuAcoes} type="button" aria-label="Mais ações" onClick={() => setMenuAberto((aberto) => !aberto)}>
                      <img src="https://img.icons8.com/ios-filled/50/9CA3AF/more.png" alt="" />
                    </button>
                    {menuAberto && (
                      <>
                        <div className={styles.fundoAcoes} onClick={() => setMenuAberto(false)} />
                        <div className={styles.menuAcoes}>
                          <button type="button" aria-label="Editar" onClick={abrirEdicao}>
                            <img src="https://img.icons8.com/ios-filled/50/374151/edit--v1.png" alt="" />
                          </button>
                          <div className={styles.divisorMenu} />
                          <button type="button" className={styles.excluirMenu} aria-label="Excluir" onClick={abrirExclusao}>
                            <img src="https://img.icons8.com/ios-filled/50/DC2626/trash--v1.png" alt="" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              <tr><td colSpan={6} className={styles.semRegistros}>Nenhum usuário cadastrado nesta sessão.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.dica}>
        <img src="https://img.icons8.com/ios/50/2563EB/idea.png" alt="" />
        <span><strong>Dica:</strong> Revise os dados antes de salvar. Em caso de dúvida, clique em Ajuda.</span>
      </div>

      {edicaoAberta && (
        <div className={styles.fundoModal} onClick={() => setEdicaoAberta(false)}>
          <div className={styles.cartaoModal} onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={styles.iconeCabecalhoModal}>
                <img src="https://img.icons8.com/ios-filled/50/CA8A04/edit--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2>Editar Usuário</h2>
                <p>Altere as informações do usuário abaixo.</p>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setEdicaoAberta(false)}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

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
                <button type="button" className={styles.botaoCancelar} onClick={() => setEdicaoAberta(false)}>
                  <span className={styles.iconeAcao}><img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" /></span>
                  <span className={styles.textoAcao}><strong>Cancelar</strong><small>Limpar os campos</small></span>
                </button>
                <button type="submit" className={styles.botaoSalvar}>
                  <span className={styles.iconeAcao}><img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" /></span>
                  <span className={styles.textoAcao}><strong>Alterar Usuário</strong><small>Alterar no sistema</small></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {exclusaoAberta && (
        <div className={styles.fundoModal} onClick={() => setExclusaoAberta(false)}>
          <div className={`${styles.cartaoModal} ${styles.cartaoModalPequeno}`} onClick={(evento) => evento.stopPropagation()}>
            <div className={styles.cabecalhoModal}>
              <div className={`${styles.iconeCabecalhoModal} ${styles.iconeCabecalhoModalPerigo}`}>
                <img src="https://img.icons8.com/ios-filled/50/DC2626/trash--v1.png" alt="" />
              </div>
              <div className={styles.textoCabecalhoModal}>
                <h2>Excluir Usuário</h2>
              </div>
              <button type="button" className={styles.botaoFecharModal} aria-label="Fechar" onClick={() => setExclusaoAberta(false)}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" />
              </button>
            </div>

            <div className={styles.divisorModal} />

            <div className={styles.caixaPerigo}>
              <strong>Tem Certeza que Deseja Excluir este Usuário?</strong>
              <p>Esta ação não poderá ser desfeita.</p>
            </div>

            <div className={styles.linhaAcoes}>
              <button type="button" className={styles.botaoModalCancelar} onClick={() => setExclusaoAberta(false)}>
                <span className={styles.iconeAcao}><img src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png" alt="" /></span>
                Cancelar
              </button>
              <button type="button" className={styles.botaoModalExcluir} onClick={confirmarExclusao}>
                <span className={styles.iconeAcao}><img src="https://img.icons8.com/ios-filled/50/FFFFFF/trash--v1.png" alt="" /></span>
                Excluir Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CadastroUsuario;
import { useState } from 'react';
import { cadastrarUsuario } from '../services/authService.js';
import styles from './CadastroUsuario.module.css';

const formularioInicial = {
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  tipoUsuario: 'VOLUNTARIO',
  status: 'Ativo',
};

export function CadastroUsuario() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [ultimoUsuario, setUltimoUsuario] = useState(null);

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

    if (formulario.senha !== formulario.confirmarSenha) {
      setErro('As senhas informadas não coincidem.');
      return;
    }

    setEnviando(true);
    setErro('');
    setSucesso('');

    try {
      await cadastrarUsuario(formulario);
      setSucesso('Usuário cadastrado com sucesso!');
      setUltimoUsuario({
        ...formulario,
        dataCadastro: new Intl.DateTimeFormat('pt-BR').format(new Date()),
      });
      setFormulario(formularioInicial);
    } catch (error) {
      setErro(error.message || 'Não foi possível cadastrar o usuário.');
    } finally {
      setEnviando(false);
    }
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

          <div className={`${styles.campo} ${styles.campoSenha}`}>
            <label htmlFor="senha-usuario">5. Senha <span className={styles.obrigatorio}>*</span></label>
            <input id="senha-usuario" type="password" value={formulario.senha} onChange={alterarCampo('senha')} minLength={8} maxLength={25} autoComplete="new-password" required />
          </div>

          <div className={`${styles.campo} ${styles.campoSenha}`}>
            <label htmlFor="confirmar-senha-usuario">6. Confirmar senha <span className={styles.obrigatorio}>*</span></label>
            <input id="confirmar-senha-usuario" type="password" value={formulario.confirmarSenha} onChange={alterarCampo('confirmarSenha')} minLength={8} maxLength={25} autoComplete="new-password" required />
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

      <section className={styles.historico} aria-label="Último usuário cadastrado">
        <div className={styles.cabecalhoHistorico}>
          <div className={styles.tituloHistorico}>
            <img src="https://img.icons8.com/ios/50/6B7280/time-machine.png" alt="" />
            <h2>Último usuário cadastrado</h2>
          </div>
          <button type="button" className={styles.botaoVerTodos}>Ver Todos</button>
        </div>
        <div className={styles.envoltorioTabela}>
          <table className={styles.tabela}>
            <thead><tr><th>Data</th><th>Nome</th><th>E-mail</th><th>Tipo de usuário</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {ultimoUsuario ? <tr><td>{ultimoUsuario.dataCadastro}</td><td>{ultimoUsuario.nome}</td><td>{ultimoUsuario.email}</td><td>{ultimoUsuario.tipoUsuario === 'ADMINISTRADOR' ? 'Administrador' : 'Voluntário'}</td><td><span className={`${styles.etiquetaStatus} ${ultimoUsuario.status === 'Ativo' ? styles.ativo : styles.inativo}`}>{ultimoUsuario.status}</span></td><td><button className={styles.botaoMais} type="button" aria-label="Mais ações">...</button></td></tr> : <tr><td colSpan={6} className={styles.semRegistros}>Nenhum usuário cadastrado nesta sessão.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <div className={styles.dica}>
        <img src="https://img.icons8.com/ios/50/2563EB/idea.png" alt="" />
        <span><strong>Dica:</strong> Revise os dados antes de salvar. Em caso de dúvida, clique em Ajuda.</span>
      </div>
    </main>
  );
}

export default CadastroUsuario;
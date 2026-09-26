import { useEffect, useState } from 'react';
import styles from './Configuracoes.module.css';
// import {
//   obterPerfil,
//   atualizarPerfil,
//   alterarSenha,
//   obterPreferenciasNotificacao,
//   atualizarPreferenciasNotificacao,
// } from '../services/configuracoesService';

const perfilVazio = { nome: '', email: '', nivelAcesso: '' };
const senhaVazia = { senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' };
const notificacoesVazias = {
  estoqueBaixo: true,
  novasEntradas: true,
  novasSaidas: true,
  emailNotificacao: '',
};

export function Configuracoes() {
  const [perfil, setPerfil] = useState(perfilVazio);
  const [senha, setSenha] = useState(senhaVazia);
  const [notificacoes, setNotificacoes] = useState(notificacoesVazias);

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [enviandoPerfil, setEnviandoPerfil] = useState(false);
  const [enviandoSenha, setEnviandoSenha] = useState(false);
  const [enviandoNotificacoes, setEnviandoNotificacoes] = useState(false);

  const [erroPerfil, setErroPerfil] = useState('');
  const [sucessoPerfil, setSucessoPerfil] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [sucessoSenha, setSucessoSenha] = useState('');
  const [erroNotificacoes, setErroNotificacoes] = useState('');
  const [sucessoNotificacoes, setSucessoNotificacoes] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const dadosPerfil = await obterPerfil();
      if (dadosPerfil) {
        setPerfil({
          nome: dadosPerfil.nome ?? '',
          email: dadosPerfil.email ?? '',
          nivelAcesso: dadosPerfil.nivelAcesso ?? '',
        });
      }
    } catch (error) {
      // Se não for possível carregar o perfil atual, o formulário simplesmente começa em branco.
    }

    try {
      const preferencias = await obterPreferenciasNotificacao();
      if (preferencias) {
        setNotificacoes({
          estoqueBaixo: preferencias.estoqueBaixo ?? true,
          novasEntradas: preferencias.novasEntradas ?? true,
          novasSaidas: preferencias.novasSaidas ?? true,
          emailNotificacao: preferencias.emailNotificacao ?? '',
        });
      }
    } catch (error) {
      // Mantém os valores padrão caso as preferências ainda não existam.
    }
  }

  function alterarCampoPerfil(campo) {
    return (evento) => {
      setPerfil((anterior) => ({ ...anterior, [campo]: evento.target.value }));
      setErroPerfil('');
    };
  }

  function alterarCampoSenha(campo) {
    return (evento) => {
      setSenha((anterior) => ({ ...anterior, [campo]: evento.target.value }));
      setErroSenha('');
    };
  }

  function alternarNotificacao(chave) {
    setNotificacoes((anterior) => ({ ...anterior, [chave]: !anterior[chave] }));
  }

  async function salvarPerfil(evento) {
    evento.preventDefault();
    setErroPerfil('');
    setSucessoPerfil('');
    setEnviandoPerfil(true);
    try {
      await atualizarPerfil(perfil);
      setSucessoPerfil('Informações atualizadas com sucesso!');
    } catch (error) {
      setErroPerfil(error.message || 'Não foi possível salvar as informações.');
    } finally {
      setEnviandoPerfil(false);
    }
  }

  async function salvarSenha(evento) {
    evento.preventDefault();
    setErroSenha('');
    setSucessoSenha('');

    if (senha.novaSenha !== senha.confirmarNovaSenha) {
      setErroSenha('As senhas informadas não coincidem.');
      return;
    }

    setEnviandoSenha(true);
    try {
      await alterarSenha(senha);
      setSucessoSenha('Senha alterada com sucesso!');
      setSenha(senhaVazia);
    } catch (error) {
      setErroSenha(error.message || 'Não foi possível alterar a senha.');
    } finally {
      setEnviandoSenha(false);
    }
  }

  async function salvarNotificacoes(evento) {
    evento.preventDefault();
    setErroNotificacoes('');
    setSucessoNotificacoes('');
    setEnviandoNotificacoes(true);
    try {
      await atualizarPreferenciasNotificacao(notificacoes);
      setSucessoNotificacoes('Preferências salvas com sucesso!');
    } catch (error) {
      setErroNotificacoes(error.message || 'Não foi possível salvar as preferências.');
    } finally {
      setEnviandoNotificacoes(false);
    }
  }

  return (
    <main className={styles.conteudo}>
      <div className={styles.grade}>
        <section className={styles.cartao}>
          <div className={styles.cabecalhoCartao}>
            <div className={styles.iconeCartao}>
              <img src="https://img.icons8.com/ios/50/2563EB/user.png" alt="" />
            </div>
            <div>
              <h2>Informações do Perfil</h2>
              <p>Atualize suas informações pessoais</p>
            </div>
          </div>

          <div className={styles.divisor} />

          {erroPerfil && <div className={styles.mensagemErro} role="alert">{erroPerfil}</div>}
          {sucessoPerfil && <div className={styles.mensagemSucesso} role="status">{sucessoPerfil}</div>}

          <form onSubmit={salvarPerfil}>
            <div className={styles.campo}>
              <label htmlFor="nome-perfil">Nome do Completo</label>
              <input
                id="nome-perfil"
                type="text"
                placeholder="Digite seu nome completo"
                value={perfil.nome}
                onChange={alterarCampoPerfil('nome')}
                required
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="email-perfil">E-mail</label>
              <input
                id="email-perfil"
                type="email"
                placeholder="Digite seu e-mail"
                value={perfil.email}
                onChange={alterarCampoPerfil('email')}
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="nivel-acesso">Nível de Acesso</label>
              <select
                id="nivel-acesso"
                value={perfil.nivelAcesso}
                onChange={alterarCampoPerfil('nivelAcesso')}
                required
              >
                <option value="">Selecione seu nível de acesso</option>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="VOLUNTARIO">Voluntário</option>
              </select>
            </div>

            <button type="submit" className={styles.botaoSalvar} disabled={enviandoPerfil}>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
              {enviandoPerfil ? 'Salvando...' : 'Salvar Informações'}
            </button>
          </form>
        </section>

        <section className={styles.cartao}>
          <div className={styles.cabecalhoCartao}>
            <div className={styles.iconeCartao}>
              <img src="https://img.icons8.com/ios/50/2563EB/lock--v1.png" alt="" />
            </div>
            <div>
              <h2>Segurança</h2>
              <p>Altere sua senha para manter sua conta segura.</p>
            </div>
          </div>

          <div className={styles.divisor} />

          {erroSenha && <div className={styles.mensagemErro} role="alert">{erroSenha}</div>}
          {sucessoSenha && <div className={styles.mensagemSucesso} role="status">{sucessoSenha}</div>}

          <form onSubmit={salvarSenha}>
            <div className={styles.campo}>
              <label htmlFor="senha-atual">Senha Atual</label>
              <div className={styles.envoltorioSenha}>
                <input
                  id="senha-atual"
                  type={mostrarSenhaAtual ? 'text' : 'password'}
                  placeholder="Digite sua senha atual"
                  value={senha.senhaAtual}
                  onChange={alterarCampoSenha('senhaAtual')}
                  autoComplete="current-password"
                  required
                />
                <button type="button" className={styles.botaoOlho} aria-label="Mostrar senha atual" onClick={() => setMostrarSenhaAtual((v) => !v)}>
                  <img src={mostrarSenhaAtual ? 'https://img.icons8.com/ios-filled/50/9CA3AF/invisible--v1.png' : 'https://img.icons8.com/ios-filled/50/9CA3AF/visible--v1.png'} alt="" />
                </button>
              </div>
            </div>

            <div className={styles.campo}>
              <label htmlFor="nova-senha">Nova Senha</label>
              <div className={styles.envoltorioSenha}>
                <input
                  id="nova-senha"
                  type={mostrarNovaSenha ? 'text' : 'password'}
                  placeholder="Digite sua nova senha"
                  value={senha.novaSenha}
                  onChange={alterarCampoSenha('novaSenha')}
                  minLength={8}
                  maxLength={25}
                  autoComplete="new-password"
                  required
                />
                <button type="button" className={styles.botaoOlho} aria-label="Mostrar nova senha" onClick={() => setMostrarNovaSenha((v) => !v)}>
                  <img src={mostrarNovaSenha ? 'https://img.icons8.com/ios-filled/50/9CA3AF/invisible--v1.png' : 'https://img.icons8.com/ios-filled/50/9CA3AF/visible--v1.png'} alt="" />
                </button>
              </div>
            </div>

            <div className={styles.campo}>
              <label htmlFor="confirmar-nova-senha">Confirmar Nova Senha</label>
              <div className={styles.envoltorioSenha}>
                <input
                  id="confirmar-nova-senha"
                  type={mostrarConfirmarSenha ? 'text' : 'password'}
                  placeholder="Confirme a nova senha"
                  value={senha.confirmarNovaSenha}
                  onChange={alterarCampoSenha('confirmarNovaSenha')}
                  minLength={8}
                  maxLength={25}
                  autoComplete="new-password"
                  required
                />
                <button type="button" className={styles.botaoOlho} aria-label="Mostrar confirmação de senha" onClick={() => setMostrarConfirmarSenha((v) => !v)}>
                  <img src={mostrarConfirmarSenha ? 'https://img.icons8.com/ios-filled/50/9CA3AF/invisible--v1.png' : 'https://img.icons8.com/ios-filled/50/9CA3AF/visible--v1.png'} alt="" />
                </button>
              </div>
            </div>

            <button type="submit" className={styles.botaoSalvar} disabled={enviandoSenha}>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/lock--v1.png" alt="" />
              {enviandoSenha ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        </section>
      </div>

      <section className={styles.cartao}>
        <div className={styles.cabecalhoCartao}>
          <div className={styles.iconeCartao}>
            <img src="https://img.icons8.com/ios/50/2563EB/appointment-reminders--v1.png" alt="" />
          </div>
          <div>
            <h2>Notificações por E-mail</h2>
            <p>Escolha quais notificações você deseja receber por e-mail.</p>
          </div>
        </div>

        <div className={styles.divisor} />

        {erroNotificacoes && <div className={styles.mensagemErro} role="alert">{erroNotificacoes}</div>}
        {sucessoNotificacoes && <div className={styles.mensagemSucesso} role="status">{sucessoNotificacoes}</div>}

        <form onSubmit={salvarNotificacoes}>
          <div className={styles.gradeNotificacoes}>
            <div className={styles.linhaNotificacao}>
              <div>
                <strong>Notificar Estoque Baixo</strong>
                <p>Enviar e-mail quando os produtos atingirem níveis mínimos</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notificacoes.estoqueBaixo}
                className={`${styles.interruptor} ${notificacoes.estoqueBaixo ? styles.interruptorAtivo : ''}`}
                onClick={() => alternarNotificacao('estoqueBaixo')}
              >
                <span className={styles.bolinha} />
              </button>
            </div>

            <div className={styles.linhaNotificacao}>
              <div>
                <strong>Notificar Novas Entradas</strong>
                <p>Enviar e-mail sobre novas entradas</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notificacoes.novasEntradas}
                className={`${styles.interruptor} ${notificacoes.novasEntradas ? styles.interruptorAtivo : ''}`}
                onClick={() => alternarNotificacao('novasEntradas')}
              >
                <span className={styles.bolinha} />
              </button>
            </div>

            <div className={styles.campo}>
              <label htmlFor="email-notificacao">E-mail para Notificação</label>
              <input
                id="email-notificacao"
                type="email"
                placeholder="Digite o e-mail para receber notificações"
                value={notificacoes.emailNotificacao}
                onChange={(evento) => setNotificacoes((anterior) => ({ ...anterior, emailNotificacao: evento.target.value }))}
              />
            </div>

            <div className={styles.linhaNotificacao}>
              <div>
                <strong>Notificar Novas Saídas</strong>
                <p>Enviar e-mail sobre novas saídas</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notificacoes.novasSaidas}
                className={`${styles.interruptor} ${notificacoes.novasSaidas ? styles.interruptorAtivo : ''}`}
                onClick={() => alternarNotificacao('novasSaidas')}
              >
                <span className={styles.bolinha} />
              </button>
            </div>
          </div>

          <div className={styles.linhaBotaoCentral}>
            <button type="submit" className={styles.botaoSalvarPreferencias} disabled={enviandoNotificacoes}>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
              {enviandoNotificacoes ? 'Salvando...' : 'Salvar Preferências'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Configuracoes;
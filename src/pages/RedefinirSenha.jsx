import { useState } from 'react';
import logo from '../assets/img/pca-1.png';
import { redefinirSenha } from '../services/authService.js';
import styles from './RecuperarSenha.module.css';

const REGRA_SENHA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/;

export function RedefinirSenha({ aoVoltar }) {
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [redefinida, setRedefinida] = useState(false);
  const [erro, setErro] = useState(() => (
    new URLSearchParams(window.location.search).get('token')
      ? ''
      : 'O link de recuperação é inválido ou está incompleto.'
  ));

  const token = new URLSearchParams(window.location.search).get('token');

  const [escala, setEscala] = useState(1);

  function aumentarTamanhoFonte() {
    setEscala((atual) => Math.min(Number((atual + 0.1).toFixed(1)), 1.4));
  }

  function diminuirTamanhoFonte() {
    setEscala((atual) => Math.max(Number((atual - 0.1).toFixed(1)), 0.8));
  }

  async function lidarComEnvio(evento) {
    evento.preventDefault();

    if (!token) return;

    if (!REGRA_SENHA.test(senha)) {
      setErro('A senha deve ter de 8 a 25 caracteres, incluindo maiúscula, minúscula, número e caractere especial.');
      return;
    }

    if (senha !== confirmacaoSenha) {
      setErro('As senhas informadas não coincidem.');
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      await redefinirSenha(token, senha);
      setRedefinida(true);
    } catch {
      setErro('Não foi possível redefinir a senha. O link pode estar expirado ou já ter sido utilizado.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.corpoLogin} style={{ '--escala-fonte': escala }}>
      <button className={`${styles.botaoVoltar} ${styles.botaoVoltarRecuperar}`} type="button" onClick={aoVoltar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Voltar
      </button>

      <div className={styles.cartaoLogin}>
        <div className={styles.envoltorioLogo}>
          <img src={logo} alt="Logo ONG PCA" className={styles.imagemLogo} />
          <div className={styles.tituloMarca}>Sistema de Gerenciamento de Estoque</div>
          <div className={styles.subtituloMarca}>Alimentos e Produtos de Higiene</div>
        </div>

        <h1 className={styles.tituloRecuperar}>Definir Nova Senha</h1>
        <p className={styles.descricaoRecuperar}>
          Crie uma nova senha para acessar sua conta.
        </p>

        {redefinida ? (
          <div className={styles.formularioLogin}>
            <p className={styles.mensagemSucesso} role="status">Senha redefinida com sucesso.</p>
            <button className={styles.botaoEntrar} type="button" onClick={aoVoltar}>
              Ir para o login
            </button>
          </div>
        ) : (
          <form className={styles.formularioLogin} onSubmit={lidarComEnvio}>
            <label className={styles.rotuloCampo} htmlFor="nova-senha">
              Digite sua nova senha
            </label>
            <input
              type="password"
              id="nova-senha"
              autoComplete="new-password"
              value={senha}
              onChange={(evento) => {
                setSenha(evento.target.value);
                setErro('');
              }}
              disabled={enviando || !token}
              required
            />

            <label className={`${styles.rotuloCampo} ${styles.espacado}`} htmlFor="confirmar-nova-senha">
              Confirme sua nova senha
            </label>
            <input
              type="password"
              id="confirmar-nova-senha"
              autoComplete="new-password"
              value={confirmacaoSenha}
              onChange={(evento) => {
                setConfirmacaoSenha(evento.target.value);
                setErro('');
              }}
              disabled={enviando || !token}
              required
            />

            {erro && <p className={styles.mensagemErro} role="alert">{erro}</p>}

            <button className={styles.botaoEntrar} type="submit" disabled={enviando || !token}>
              {enviando ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </form>
        )}
      </div>

      <div className={styles.caixaAcessibilidade}>
        <div className={styles.tituloAcessibilidade}>Acessibilidade</div>
        <div className={styles.pilulaAcessibilidade}>
          <button className={styles.botaoAcessibilidade} type="button" onClick={aumentarTamanhoFonte}>A+</button>
          <button className={styles.botaoAcessibilidade} type="button" onClick={diminuirTamanhoFonte}>a-</button>
        </div>
      </div>
    </div>
  );
}

export default RedefinirSenha;
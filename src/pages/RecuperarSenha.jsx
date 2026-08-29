import { useState } from 'react';
import logo from '../assets/img/pca-1.png';
import styles from './RecuperarSenha.module.css';

function increaseFontSize() {
  document.body.style.fontSize = 'larger';
}

function decreaseFontSize() {
  document.body.style.fontSize = 'smaller';
}

export function RecuperarSenha({ onVoltar }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      alert('Digite seu e-mail.');
      return;
    }
    setEnviado(true);
  }

  return (
    <div className={styles.loginBody}>
      <button className={`${styles.btnVoltar} ${styles.recuperarVoltar}`} type="button" onClick={onVoltar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Voltar
      </button>

      <div className={styles.loginCard}>
        <div className={styles.loginLogoWrap}>
          <img src={logo} alt="Logo ONG PCA" className={styles.loginLogoImg} />
          <div className={styles.loginBrandTitle}>Sistema de Gerenciamento de Estoque</div>
          <div className={styles.loginBrandSub}>Alimentos e Produtos de Higiene</div>
        </div>

        <h1 className={styles.recuperarTitle}>Recuperar Senha</h1>
        <p className={styles.recuperarDesc}>
          Para redefinir sua senha, informe o e-mail cadastrado na sua conta e lhe enviaremos um
          link com as instruções
        </p>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.loginFieldLabel} htmlFor="recuperar-email">
            Digite seu E-mail
          </label>
          <input
            type="email"
            id="recuperar-email"
            placeholder="exemplo@gmail.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className={styles.loginForgot}>
            <a href="#">Reenviar E-mail</a> ← Clique aqui
          </div>

          <button className={styles.loginBtnEntrar} type="submit">
            {enviado ? 'E-mail enviado ✓' : 'Enviar'}
          </button>
        </form>
      </div>

      <div className={styles.accessBox}>
        <div className={styles.accessTitle}>Acessibilidade</div>
        <div className={styles.accessPill}>
          <button className={styles.accessBtn} type="button" onClick={increaseFontSize}>
            A+
          </button>
          <button className={styles.accessBtn} type="button" onClick={decreaseFontSize}>
            a-
          </button>
          <button className={`${styles.accessBtn} ${styles.accessBtnIcon}`} type="button" aria-label="Alto contraste">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8.5" />
              <path d="M6 14v1.5A5.5 5.5 0 0 0 11.5 21h3a5.5 5.5 0 0 0 5.5-5.5v-3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenha;

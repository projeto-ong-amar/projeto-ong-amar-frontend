import { useState } from 'react';

import logo from '../assets/img/pca-1.png';
import styles from './Login.module.css';

function increaseFontSize() {
  document.body.style.fontSize = 'larger';
}

function decreaseFontSize() {
  document.body.style.fontSize = 'smaller';
}

export function Login({ onLoginSuccess, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [highContrast, setHighContrast] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onLoginSuccess?.();
  }

  function toggleHighContrast() {
    setHighContrast((prev) => !prev);
  }

  return (
    <div className={`${styles.loginBody} ${highContrast ? 'high-contrast' : ''}`}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogoWrap}>
          <img
            src={logo}
            alt="Logo ONG PCA"
            className={styles.loginLogoImg}
          />

          <div className={styles.loginBrandTitle}>
            Sistema de Gerenciamento de Estoque
          </div>

          <div className={styles.loginBrandSub}>
            Alimentos e Produtos de Higiene
          </div>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.loginFieldLabel} htmlFor="email">
            Digite seu E-mail
          </label>

          <input
            type="email"
            id="email"
            placeholder="exemplo@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className={`${styles.loginFieldLabel} ${styles.spaced}`} htmlFor="senha">
            Digite sua Senha
          </label>

          <input
            type="password"
            id="senha"
            placeholder="1234"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className={styles.loginForgot}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onForgotPassword?.();
              }}
            >
              Esqueceu sua senha?
            </a>{' '}
            ← Clique aqui
          </div>

          <button className={styles.loginBtnEntrar} type="submit">
            Entrar
          </button>
        </form>
      </div>

      <div className={styles.accessBox}>
        <div className={styles.accessTitle}>
          Acessibilidade
        </div>

        <div className={styles.accessPill}>
          <button
            className={styles.accessBtn}
            type="button"
            onClick={increaseFontSize}
            aria-label="Aumentar tamanho da fonte"
          >
            A+
          </button>

          <button
            className={styles.accessBtn}
            type="button"
            onClick={decreaseFontSize}
            aria-label="Diminuir tamanho da fonte"
          >
            a-
          </button>

          <button
            className={`${styles.accessBtn} ${styles.accessBtnIcon} ${
              highContrast ? 'active' : ''
            }`}
            type="button"
            onClick={toggleHighContrast}
            aria-label="Alto contraste"
            aria-pressed={highContrast}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
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

export default Login;

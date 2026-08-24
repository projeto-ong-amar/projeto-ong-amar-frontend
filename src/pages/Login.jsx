import { useState } from 'react';

import logo from '../assets/img/pca-1.png';
import '../styles/login.css';

function increaseFontSize() {
  document.body.style.fontSize = 'larger';
}

function decreaseFontSize() {
  document.body.style.fontSize = 'smaller';
}

/**
 * Login page
 * Front-end only, no backend: the form is purely visual — clicking
 * "Entrar" always proceeds straight to the app, regardless of what
 * (if anything) was typed.
 *
 * @param {Function} onLoginSuccess   - Called when "Entrar" is clicked.
 * @param {Function} onForgotPassword - Called when "Esqueceu sua senha?" is clicked.
 */
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
    <div className={`login-body ${highContrast ? 'high-contrast' : ''}`}>
      <div className="login-card">
        <div className="login-logo-wrap">
          <img
            src={logo}
            alt="Logo ONG PCA"
            className="login-logo-img"
          />

          <div className="login-brand-title">
            Sistema de Gerenciamento de Estoque
          </div>

          <div className="login-brand-sub">
            Alimentos e Produtos de Higiene
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field-label" htmlFor="email">
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

          <label className="login-field-label spaced" htmlFor="senha">
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

          <div className="login-forgot">
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

          <button className="login-btn-entrar" type="submit">
            Entrar
          </button>
        </form>
      </div>

      <div className="access-box">
        <div className="access-title">
          Acessibilidade
        </div>

        <div className="access-pill">
          <button
            className="access-btn"
            type="button"
            onClick={increaseFontSize}
            aria-label="Aumentar tamanho da fonte"
          >
            A+
          </button>

          <button
            className="access-btn"
            type="button"
            onClick={decreaseFontSize}
            aria-label="Diminuir tamanho da fonte"
          >
            a-
          </button>

          <button
            className={`access-btn access-btn-icon ${
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
import { useState } from 'react';
import logo from '../assets/img/pca-1.png';
import '../styles/login.css';

/**
 * Login page
 * Front-end only, no backend: the form is purely visual — clicking
 * "Entrar" always proceeds straight to the app, regardless of what
 * (if anything) was typed.
 *
 * @param {Function} onLoginSuccess - Called when "Entrar" is clicked,
 *                                    so the parent can switch to the app shell.
 */
export function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onLoginSuccess?.();
  }

  return (
    <div className="login-body">
      <div className="login-card">
        <div className="login-logo-wrap">
          <img src={logo} alt="Logo ONG PCA" className="login-logo-img" />
          <div className="login-brand-title">Sistema de Gerenciamento de Estoque</div>
          <div className="login-brand-sub">Alimentos e Produtos de Higiene</div>
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
            <a href="#">Esqueceu sua senha?</a> ← Clique aqui
          </div>

          <button className="login-btn-entrar" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
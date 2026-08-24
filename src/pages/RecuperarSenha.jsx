import { useState } from 'react';
import logo from '../assets/img/pca-1.png';
import '../styles/login.css';

/**
 * Recuperar Senha page
 * Standalone screen (no Sidebar/Topbar), reached from the Login page's
 * "Esqueceu sua senha?" link. Front-end only — no backend call yet.
 *
 * @param {Function} onVoltar - Called when the "Voltar" button is clicked
 */
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
    <div className="login-body">
      <button className="btn-voltar recuperar-voltar" type="button" onClick={onVoltar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Voltar
      </button>

      <div className="login-card recuperar-card">
        <div className="login-logo-wrap">
          <img src={logo} alt="Logo ONG PCA" className="login-logo-img" />
          <div className="login-brand-title">Sistema de Gerenciamento de Estoque</div>
          <div className="login-brand-sub">Alimentos e Produtos de Higiene</div>
        </div>

        <h1 className="recuperar-title">Recuperar Senha</h1>
        <p className="recuperar-desc">
          Para redefinir sua senha, informe o e-mail cadastrado na sua conta e lhe enviaremos um
          link com as instruções
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field-label" htmlFor="recuperar-email">
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

          <div className="login-forgot">
            <a href="#">Reenviar E-mail</a> ← Clique aqui
          </div>

          <button className="login-btn-entrar" type="submit">
            {enviado ? 'E-mail enviado ✓' : 'Enviar'}
          </button>
        </form>
      </div>

      <div className="access-box">
        <div className="access-title">Acessibilidade</div>
        <div className="access-pill">
          <button className="access-btn" type="button" onClick={increaseFontSize}>
            A+
          </button>
          <button className="access-btn" type="button" onClick={decreaseFontSize}>
            a-
          </button>
          <button className="access-btn access-btn-icon" type="button" aria-label="Alto contraste">
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
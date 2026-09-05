import { useState } from 'react';

import logo from '../assets/img/pca-1.png';
import styles from './Login.module.css';

function aumentarTamanhoFonte() {
  document.body.style.fontSize = 'larger';
}

function diminuirTamanhoFonte() {
  document.body.style.fontSize = 'smaller';
}

export function Login({ aoLoginComSucesso, aoEsquecerSenha }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [altoContraste, setAltoContraste] = useState(false);

  function lidarComEnvio(evento) {
    evento.preventDefault();
    aoLoginComSucesso?.();
  }

  function alternarAltoContraste() {
    setAltoContraste((anterior) => !anterior);
  }

  return (
    <div className={`${styles.corpoLogin} ${altoContraste ? 'high-contrast' : ''}`}>
      <div className={styles.cartaoLogin}>
        <div className={styles.envoltorioLogo}>
          <img
            src={logo}
            alt="Logo ONG PCA"
            className={styles.imagemLogo}
          />

          <div className={styles.tituloMarca}>
            Sistema de Gerenciamento de Estoque
          </div>

          <div className={styles.subtituloMarca}>
            Alimentos e Produtos de Higiene
          </div>
        </div>

        <form className={styles.formularioLogin} onSubmit={lidarComEnvio}>
          <label className={styles.rotuloCampo} htmlFor="email">
            Digite seu E-mail
          </label>

          <input
            type="email"
            id="email"
            placeholder="exemplo@email.com"
            autoComplete="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />

          <label className={`${styles.rotuloCampo} ${styles.espacado}`} htmlFor="senha">
            Digite sua Senha
          </label>

          <input
            type="password"
            id="senha"
            placeholder="1234"
            autoComplete="current-password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
          />

          <div className={styles.linkEsqueciSenha}>
            <a
              href="#"
              onClick={(evento) => {
                evento.preventDefault();
                aoEsquecerSenha?.();
              }}
            >
              Esqueceu sua senha?
            </a>{' '}
            ← Clique aqui
          </div>

          <button className={styles.botaoEntrar} type="submit">
            Entrar
          </button>
        </form>
      </div>

      <div className={styles.caixaAcessibilidade}>
        <div className={styles.tituloAcessibilidade}>
          Acessibilidade
        </div>

        <div className={styles.pilulaAcessibilidade}>
          <button
            className={styles.botaoAcessibilidade}
            type="button"
            onClick={aumentarTamanhoFonte}
            aria-label="Aumentar tamanho da fonte"
          >
            A+
          </button>

          <button
            className={styles.botaoAcessibilidade}
            type="button"
            onClick={diminuirTamanhoFonte}
            aria-label="Diminuir tamanho da fonte"
          >
            a-
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
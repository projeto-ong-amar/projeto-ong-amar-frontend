import { useState, useEffect } from 'react';

import logo from '../assets/img/pca-1.png';
import styles from './Login.module.css';

export function Login({ aoLoginComSucesso, aoEsquecerSenha }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [altoContraste, setAltoContraste] = useState(false);
  
  // Estado para controlar a porcentagem do tamanho da fonte
  const [tamanhoFonte, setTamanhoFonte] = useState(100);

  // Aplica o tamanho da fonte no elemento <html> sempre que o estado mudar
  useEffect(() => {
    document.documentElement.style.fontSize = `${tamanhoFonte}%`;
  }, [tamanhoFonte]);

  function aumentarTamanhoFonte() {
    setTamanhoFonte((tamanhoAtual) => Math.min(tamanhoAtual + 5, 130)); // Limite máximo de 130%
  }

  function diminuirTamanhoFonte() {
    setTamanhoFonte((tamanhoAtual) => Math.max(tamanhoAtual - 5, 85)); // Limite mínimo de 85%
  }

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
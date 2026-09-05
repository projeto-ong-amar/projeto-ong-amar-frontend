import { useState } from 'react';
import logo from '../assets/img/pca-1.png';
import styles from './RecuperarSenha.module.css';

export function RecuperarSenha({ aoVoltar }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);


  const [escala, setEscala] = useState(1);

  function aumentarTamanhoFonte() {
    setEscala((atual) => Math.min(Number((atual + 0.1).toFixed(1)), 1.4)); 
  }

  function diminuirTamanhoFonte() {
    setEscala((atual) => Math.max(Number((atual - 0.1).toFixed(1)), 0.8)); 
  }

  function lidarComEnvio(evento) {
    evento.preventDefault();
    if (!email) {
      alert('Digite seu e-mail.');
      return;
    }
    setEnviado(true);
  }

  return (
    <div 
      className={styles.corpoLogin} 
      style={{ '--escala-fonte': escala }}
    >
      <button className={`${styles.botaoVoltar} ${styles.botaoVoltarRecuperar}`} type="button" onClick={aoVoltar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        <h1 className={styles.tituloRecuperar}>Recuperar Senha</h1>
        <p className={styles.descricaoRecuperar}>
          Para redefinir sua senha, informe o e-mail cadastrado na sua conta e lhe enviaremos um
          link com as instruções
        </p>

        <form className={styles.formularioLogin} onSubmit={lidarComEnvio}>
          <label className={styles.rotuloCampo} htmlFor="recuperar-email">
            Digite seu E-mail
          </label>
          <input
            type="email"
            id="recuperar-email"
            placeholder="exemplo@gmail.com"
            autoComplete="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />

          <div className={styles.linkEsqueciSenha}>
            <a href="#">Reenviar E-mail</a> ← Clique aqui
          </div>

          <button className={styles.botaoEntrar} type="submit">
            {enviado ? 'E-mail enviado ✓' : 'Enviar'}
          </button>
        </form>
      </div>

      <div className={styles.caixaAcessibilidade}>
        <div className={styles.tituloAcessibilidade}>Acessibilidade</div>
        <div className={styles.pilulaAcessibilidade}>
          <button className={styles.botaoAcessibilidade} type="button" onClick={aumentarTamanhoFonte}>
            A+
          </button>
          <button className={styles.botaoAcessibilidade} type="button" onClick={diminuirTamanhoFonte}>
            a-
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenha;
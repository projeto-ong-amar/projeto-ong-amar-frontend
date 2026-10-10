import { useId, useState } from 'react';
import styles from './InputPasswordToggle.module.css';

function IconeOlhoAberto() {
  return (
    <svg className={styles.icone} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconeOlhoFechado() {
  return (
    <svg className={styles.icone} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function InputPasswordToggle({ label, onChange, id, className, labelClassName, inputClassName, children, ...propsInput }) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const idGerado = useId();
  const idCampo = id ?? idGerado;
  const textoBotao = senhaVisivel ? 'Ocultar senha' : 'Mostrar senha';

  return (
    <div className={className ?? styles.campo}>
      <label className={labelClassName ?? styles.rotulo} htmlFor={idCampo}>{label}</label>
      <div className={styles.envoltorioInput}>
        <input
          {...propsInput}
          id={idCampo}
          className={`${inputClassName ?? styles.input} ${styles.comBotao}`}
          type={senhaVisivel ? 'text' : 'password'}
          onChange={onChange}
        />
        <button
          type="button"
          className={styles.botaoOlho}
          onClick={() => setSenhaVisivel((visivel) => !visivel)}
          aria-label={textoBotao}
          title={textoBotao}
        >
          {senhaVisivel ? <IconeOlhoFechado /> : <IconeOlhoAberto />}
        </button>
      </div>
      {children}
    </div>
  );
}

export default InputPasswordToggle;

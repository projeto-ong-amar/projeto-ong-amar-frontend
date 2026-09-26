import { useRef, useState } from 'react';
import styles from '../../pages/Relatorios.module.css';

const PRESETS = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'semana', label: 'Esta Semana' },
  { id: 'mes', label: 'Este Mês' },
  { id: 'ano', label: 'Este Ano' },
];

export function PeriodFilter({ active, onChange }) {
  const [personalizadoAberto, setPersonalizadoAberto] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const inputInicioRef = useRef(null);
  const inputFimRef = useRef(null);

  const emPersonalizado = active === 'personalizado';

  function selecionarPreset(id) {
    setPersonalizadoAberto(false);
    onChange(id);
  }

  function alternarPersonalizado() {
    setPersonalizadoAberto((aberto) => !aberto);
  }

  function aplicarPersonalizado() {
    if (!dataInicio || !dataFim) return;
    onChange({ tipo: 'personalizado', dataInicio, dataFim });
  }

  return (
    <div className={styles.periodBar}>
      <div className={styles.periodLabel}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        Período:
      </div>

      <div className={styles.periodOptions}>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`${styles.periodBtn} ${active === preset.id ? styles.active : ''}`}
            onClick={() => selecionarPreset(preset.id)}
          >
            {preset.label}
          </button>
        ))}

        <button
          type="button"
          className={`${styles.periodCustom} ${personalizadoAberto || emPersonalizado ? styles.periodCustomAtivo : ''}`}
          onClick={alternarPersonalizado}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          Personalizado
          <svg
            className={`${styles.chevron} ${personalizadoAberto ? styles.chevronAberto : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {personalizadoAberto && (
        <div className={styles.periodPersonalizado}>
          <div className={styles.periodPersonalizadoCampo}>
            <label htmlFor="periodo-data-inicio">De</label>
            <div className={styles.envoltorioData}>
              <input
                ref={inputInicioRef}
                id="periodo-data-inicio"
                type="date"
                value={dataInicio}
                onChange={(evento) => setDataInicio(evento.target.value)}
              />
              <button
                type="button"
                className={styles.botaoCalendario}
                aria-label="Selecionar data inicial"
                onClick={() => inputInicioRef.current?.showPicker()}
              >
                <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
              </button>
            </div>
          </div>

          <div className={styles.periodPersonalizadoCampo}>
            <label htmlFor="periodo-data-fim">Até</label>
            <div className={styles.envoltorioData}>
              <input
                ref={inputFimRef}
                id="periodo-data-fim"
                type="date"
                value={dataFim}
                min={dataInicio || undefined}
                onChange={(evento) => setDataFim(evento.target.value)}
              />
              <button
                type="button"
                className={styles.botaoCalendario}
                aria-label="Selecionar data final"
                onClick={() => inputFimRef.current?.showPicker()}
              >
                <img src="https://img.icons8.com/ios/50/B45309/calendar--v1.png" alt="" />
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.periodAplicarBtn}
            onClick={aplicarPersonalizado}
            disabled={!dataInicio || !dataFim}
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}

export default PeriodFilter;
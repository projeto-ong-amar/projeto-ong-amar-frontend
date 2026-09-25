import style from './Desempenho.module.css'

export function Desempenho() {
  return (
    <>
      <div className={ style.divProximaDoacao }>
        <span className={ style.textoComIcone }>
          <svg className={ style.icone } viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Próxima doação
          <span
            className={ style.tooltipWrapper }
            data-tooltip="Insira no campo ao lado a data da próxima doação de cestas básicas a ser realizada pela ONG"
          >
            <svg className={ style.iconeInfo } viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="var(--blue)" />
              <line x1="12" y1="11" x2="12" y2="16" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="8" x2="12.01" y2="8" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </span>
        <span className={ style.dateInputSpan }>
          <label htmlFor="dateInput" className={ style.dateInput }>
            Data da próxima doação
          </label>
          <input
            id="dateInput"
            type="date"
            className={ style.inputDate }
          />
        </span>
      </div>
    </>
  )
}
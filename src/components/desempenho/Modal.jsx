import { useEffect } from 'react'
import style from './Modal.module.css'

export function Modal({ aberto, aoFechar, larguraMax = 520, rotulo, children }) {

  useEffect(() => {
    if (!aberto) return
    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', aoPressionarTecla)
    return () => document.removeEventListener('keydown', aoPressionarTecla)
  }, [aberto, aoFechar])

  if (!aberto) return null

  return (
    <div className={ style.fundo } onClick={ aoFechar }>
      <div
        className={ style.cartao }
        style={{ maxWidth: larguraMax }}
        role="dialog"
        aria-modal="true"
        aria-label={ rotulo }
        onClick={ evento => evento.stopPropagation() }
      >
        <button type="button" className={ style.botaoFechar } aria-label="Fechar" onClick={ aoFechar }>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
        { children }
      </div>
    </div>
  )
}

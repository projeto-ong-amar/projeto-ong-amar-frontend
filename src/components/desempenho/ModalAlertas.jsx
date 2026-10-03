import { useState } from 'react'
import { Modal } from './Modal'
import style from './ModalAlertas.module.css'

// trocar por dados reais do backend quando o endpoint de alertas existir.
const ALERTAS = [
  { tipo: 'perigo', texto: '5 produtos vencem em 7 dias' },
  { tipo: 'aviso', texto: '3 produtos com estoque baixo' },
  { tipo: 'info', texto: 'Nenhuma doação registrada esta semana' },
  { tipo: 'neutro', texto: '2 produtos sem movimentação', detalhe: '(há 60 dias)' },
]

const ALERTAS_POR_PAGINA = 4

const ICONES = {
  perigo: (
    <>
      <path d="M12 3 2 21h20L12 3Z" />
      <line x1="12" y1="10" x2="12" y2="15" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </>
  ),
  aviso: (
    <>
      <path d="M12 3 2 21h20L12 3Z" />
      <line x1="12" y1="10" x2="12" y2="15" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
  neutro: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="M3 8l9 5 9-5" />
      <line x1="12" y1="13" x2="12" y2="21" />
    </>
  ),
}

export function ModalAlertas({ aberto, aoFechar }) {
  const [pagina, setPagina] = useState(0)

  const totalPaginas = Math.ceil(ALERTAS.length / ALERTAS_POR_PAGINA)
  const inicio = pagina * ALERTAS_POR_PAGINA
  const visiveis = ALERTAS.slice(inicio, inicio + ALERTAS_POR_PAGINA)

  return (
    <Modal aberto={ aberto } aoFechar={ aoFechar } larguraMax={ 300 } rotulo="Alertas importantes">
      <ul className={ style.lista }>
        { visiveis.map(alerta => (
          <li key={ alerta.texto } className={ `${style.alerta} ${style[alerta.tipo]}` }>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              { ICONES[alerta.tipo] }
            </svg>
            <span>
              { alerta.texto }
              { alerta.detalhe && <small> { alerta.detalhe }</small> }
            </span>
          </li>
        )) }
      </ul>

      <div className={ style.navegacao }>
        <button type="button" aria-label="Alertas anteriores" disabled={ pagina === 0 } onClick={ () => setPagina(pagina - 1) }>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button type="button" aria-label="Próximos alertas" disabled={ pagina >= totalPaginas - 1 } onClick={ () => setPagina(pagina + 1) }>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </Modal>
  )
}

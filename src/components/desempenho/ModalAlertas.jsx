import { useEffect, useState } from 'react'
import { getAlertasDashboard } from '../../services/desempenhoService'
import { Modal } from './Modal'
import style from './ModalAlertas.module.css'

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
  const [alertas, setAlertas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!aberto) return
    let ativo = true
    setPagina(0)
    setAlertas([])
    setErro('')
    setCarregando(true)
    getAlertasDashboard()
      .then(dados => { if (ativo) setAlertas(dados) })
      .catch(() => { if (ativo) setErro('Não foi possível carregar os alertas. Feche e abra novamente para tentar de novo.') })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [aberto])

  const totalPaginas = Math.ceil(alertas.length / ALERTAS_POR_PAGINA)
  const inicio = pagina * ALERTAS_POR_PAGINA
  const visiveis = alertas.slice(inicio, inicio + ALERTAS_POR_PAGINA)

  return (
    <Modal aberto={ aberto } aoFechar={ aoFechar } larguraMax={ 300 } rotulo="Alertas importantes">
      { carregando && <p role="status">Carregando alertas...</p> }
      { erro && <p role="alert">{ erro }</p> }
      { !carregando && !erro && alertas.length === 0 && <p role="status">Nenhum alerta ativo no momento.</p> }
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
        <button type="button" aria-label="Alertas anteriores" disabled={ carregando || !!erro || pagina === 0 } onClick={ () => setPagina(pagina - 1) }>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button type="button" aria-label="Próximos alertas" disabled={ carregando || !!erro || pagina >= totalPaginas - 1 } onClick={ () => setPagina(pagina + 1) }>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </Modal>
  )
}

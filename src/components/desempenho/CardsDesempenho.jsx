import box from '../../assets/icons/box.svg'
import hand from '../../assets/icons/hand.svg'
import alert from '../../assets/icons/alert.svg'
import doacao from '../../assets/icons/doacao.svg'
import style from './CardsDesempenho.module.css'

const icones = { box, hand, alert, doacao }

export function CardsDesempenho({ cor, titulo, data, dataLabel, descricao, icone, onClick }) {

  const caminhoIcone = icones[icone]

  return (
    <>
    <div
      className={ `${style.card} ${onClick ? style.clicavel : ''}` }
      style={{ '--cor-card': cor }}
      onClick={ onClick }
      onKeyDown={ onClick ? evento => (evento.key === 'Enter' || evento.key === ' ') && onClick() : undefined }
      role={ onClick ? 'button' : undefined }
      tabIndex={ onClick ? 0 : undefined }
    >
      { onClick && (
        <svg className={ style.iconeAbrir } viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      ) }
      <span className={ style.iconeETitulo }>
          { caminhoIcone && (
            <span className={ style.fundoIcone }>
              <img src={ caminhoIcone } alt="" aria-hidden="true" />
            </span>
          ) }
          <h2 className={ style.tituloCard }>{ titulo }</h2>
      </span>
      <span className={ style.dataELabel }>
        <p className={ style.data }>{ data }</p>
        <p className={ style.dataLabel }>{ dataLabel }</p>
      </span>

      <p className={ style.descricao }>{ descricao }</p>
      
    </div>
    </>
  )
}
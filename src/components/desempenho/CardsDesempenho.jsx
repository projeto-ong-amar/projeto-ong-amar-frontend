import box from '../../assets/icons/box.svg'
import hand from '../../assets/icons/hand.svg'
import alert from '../../assets/icons/alert.svg'
import doacao from '../../assets/icons/doacao.svg'
import style from './CardsDesempenho.module.css'

const icones = { box, hand, alert, doacao }

export function CardsDesempenho({ cor, titulo, data, dataLabel, descricao, icone }) {

  const caminhoIcone = icones[icone]

  return (
    <>
    <div className={ style.card } style={{ '--cor-card': cor }}>
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
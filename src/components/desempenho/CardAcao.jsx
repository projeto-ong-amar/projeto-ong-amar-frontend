import style from './CardAcao.module.css'
import alertButton from '../../assets/icons/alertButton.svg'
import thunder from '../../assets/icons/thunder.svg'

const icons = { alertButton, thunder }

export function CardAcao({ text, textColor, icon, onClick }) {

  const caminhoIcone = icons[icon]

  return (
    <>
      <button type="button" className={ style.card } style={{ '--text-color': textColor }} onClick={ onClick }>
        <p className={ style.text }>
          <img src={ caminhoIcone } alt="" aria-hidden="true" />
          { text }
        </p>
      </button>
    </>
  )
}
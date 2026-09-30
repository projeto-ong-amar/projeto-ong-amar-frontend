import style from './CardAcao.module.css'
import alertButton from '../../assets/icons/alertButton.svg'
import thunder from '../../assets/icons/thunder.svg'

const icons = { alertButton, thunder }

export function CardAcao({ text, textColor, icon }) {

  const caminhoIcone = icons[icon]

  return (
    <>
      <div className={ style.card } style={{ '--text-color': textColor }}>
        <p className={ style.text }>
          <img src={ caminhoIcone } alt="" aria-hidden="true" />
          { text }
        </p>
      </div>
    </>
  )
}
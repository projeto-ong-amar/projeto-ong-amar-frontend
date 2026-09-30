import style from './CardDica.module.css'

export function CardDica() {
  return (
    <>
      <div className={ style.card }>
        <h3 className={ style.dicaTitle }>
          <span className={ style.infoIcon } aria-hidden="true">i</span>
          Dica:
        </h3>
        <p>Mantenha o estoque atualizado para garantir que as informações estejam sempre corretas.</p>
      </div>
    </>
  )
}
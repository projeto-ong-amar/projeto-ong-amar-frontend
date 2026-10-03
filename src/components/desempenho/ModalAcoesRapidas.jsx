import { Modal } from './Modal'
import style from './ModalAcoesRapidas.module.css'

const ACOES = [
  { texto: 'Gerar Relatório', pagina: 'relatorios' },
  { texto: 'Registrar Entrada', pagina: 'gerenciar-entrada' },
  { texto: 'Registrar Saída', pagina: 'gerenciar-saida' },
]

export function ModalAcoesRapidas({ aberto, aoFechar, onNavigate }) {

  function irPara(pagina) {
    aoFechar()
    onNavigate(pagina)
  }

  return (
    <Modal aberto={ aberto } aoFechar={ aoFechar } larguraMax={ 280 } rotulo="Ações rápidas">
      <div className={ style.botoes }>
        { ACOES.map(acao => (
          <button key={ acao.pagina } type="button" className={ style.botao } onClick={ () => irPara(acao.pagina) }>
            { acao.texto }
          </button>
        )) }
      </div>
    </Modal>
  )
}

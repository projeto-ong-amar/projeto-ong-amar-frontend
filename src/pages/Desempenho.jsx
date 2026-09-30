import { useEffect } from 'react'
import style from './Desempenho.module.css'
import { todaysDate } from '../utils/dateSelector'
import { CardsDesempenho } from '../components/desempenho/CardsDesempenho'
import { GraficoDistribuicao } from '../components/desempenho/GraficoDistribuicao'
import { GraficoPizzaItens } from '../components/desempenho/GraficoPizzaItens'
import { CardAcoesRapidas } from '../components/desempenho/CardAcoesRapidas'
import { CardAlertasImportantes } from '../components/desempenho/CardAlertasImportantes'
import { CardDica } from '../components/desempenho/CardDica'
import { GraficoLinhaMensal } from '../components/desempenho/GraficoLinhaMensal'

export function Desempenho() {
  useEffect(() => {
    todaysDate('dateInput')
  }, [])

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
      <div className={ style.divCards }>
        <CardsDesempenho 
          cor="var(--blue-icon)"
          icone="box"
          data={ 20 }
          dataLabel="itens"
          descricao="Total de itens distribuidos entre alimentos e produtos de higiene"
          titulo="Estoque Atual"
        />
        <CardsDesempenho 
          cor="var(--red)" 
          icone="alert"
          data={ 4 }
          dataLabel="produtos"
          descricao="Vencem nos próximos 30 dias"
          titulo="Risco de Vencimento"
        />
        <CardsDesempenho 
          cor="var(--green-icon)"
          icone="hand"
          data={ 200 }
          dataLabel="itens"
          descricao="Quantidade de entradas no estoque nesse mês"
          titulo="Doações Recebidas"
        />
        <CardsDesempenho 
          cor="var(--orange-icon)"
          icone="doacao"
          data={ 200 }
          dataLabel="itens"
          descricao="Quantidade de saídas no estoque esse mês"
          titulo="Itens Distribuídos"
        />
      </div>
      <div className={ style.divGraficosBarraEPizza }>
        <GraficoDistribuicao />
        <GraficoPizzaItens />
      </div>
      <div className={ style.divGraficoLinhaEAcoes }>
        <GraficoLinhaMensal />
        <div className={ style.acessosLaterais }>
          <CardDica />
          <CardAlertasImportantes />
          <CardAcoesRapidas />
        </div>
      </div> 
    </>
  )
}
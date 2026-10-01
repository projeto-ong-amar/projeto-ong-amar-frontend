import { useEffect, useState } from 'react'
import style from './Desempenho.module.css'
import { todaysDate } from '../utils/dateSelector'
import { CardsDesempenho } from '../components/desempenho/CardsDesempenho'
import { GraficoDistribuicao } from '../components/desempenho/GraficoDistribuicao'
import { GraficoPizzaItens } from '../components/desempenho/GraficoPizzaItens'
import { GraficoLinhaMensal } from '../components/desempenho/GraficoLinhaMensal'
import { CardDica } from '../components/desempenho/CardDica'
import { CardAcao } from '../components/desempenho/CardAcao'
import { getKPIDoacoesRecebidas, getKPIEstoque, getKPIItensDistribuidos, getKPIRiscoVencimento } from '../services/desempenhoService'

export function Desempenho() {

  const [kpiEstoque, setKpiEstoque] = useState(0)
  const [kpiRiscoVencimento, setKpiRiscoVencimento] = useState(0)
  const [kpiDoacoesRecebidas, setKpiDoacoesRecebidas] = useState(0)
  const [kpiItensDistribuidos, setKpiItensDistribuidos] = useState(0)

  async function getDadosKPIEstoque(dataProximaDoacao) {
      const resposta = await getKPIEstoque(dataProximaDoacao)
      setKpiEstoque(resposta)
  }
  
  async function getDadosKPIRiscoVencimento(dataProximaDoacao) {
    const resposta = await getKPIRiscoVencimento(dataProximaDoacao)
    setKpiRiscoVencimento(resposta)
  }

  async function getDadosKPIDoacoesRecebidas(dataProximaDoacao) {
    const resposta = await getKPIDoacoesRecebidas(dataProximaDoacao)
    setKpiDoacoesRecebidas(resposta)
  }

  async function getDadosKpiItensDistribuidos(dataProximaDoacao) {
    const resposta = await getKPIItensDistribuidos(dataProximaDoacao)
    setKpiItensDistribuidos(resposta)
  }

  function getDadosKPIs(dataProximaDoacao) {
    getDadosKPIEstoque(dataProximaDoacao)
    getDadosKPIRiscoVencimento(dataProximaDoacao)
    getDadosKPIDoacoesRecebidas(dataProximaDoacao)
    getDadosKpiItensDistribuidos(dataProximaDoacao)
  }

  useEffect(() => {
    todaysDate('dateInput')
  }, [])

  return (
    <>
      <div className={ style.divProximaDoacao }>
        <svg className={ style.icone } viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        <span className={ style.dateInputSpan }>
          <label htmlFor="dateInput" className={ style.dateInput }>
            Data da próxima doação
          </label>
          <input
            id="dateInput"
            type="date"
            className={ style.inputDate }
            onChange={ event => getDadosKPIs(event.target.value) }
          />
        </span>
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
      </div>
      <div className={ style.divCards }>
        <CardsDesempenho 
          cor="var(--blue-icon)"
          icone="box"
          data={ kpiEstoque }
          dataLabel="itens"
          descricao="Saldo de itens no período de 30 dias até a data da próxima doação."
          titulo="Estoque Atual"
        />
        <CardsDesempenho 
          cor="var(--red)" 
          icone="alert"
          data={ kpiRiscoVencimento }
          dataLabel="produtos"
          descricao="Número de lotes cuja validade cai nos 30 dias antes da próxima doação."
          titulo="Risco de Vencimento"
        />
        <CardsDesempenho 
          cor="var(--green-icon)"
          icone="hand"
          data={ kpiDoacoesRecebidas }
          dataLabel="itens"
          descricao="Total de itens que entraram no estoque nos 30 dias antes da próxima doação."
          titulo="Doações Recebidas"
        />
        <CardsDesempenho 
          cor="var(--orange-icon)"
          icone="doacao"
          data={ kpiItensDistribuidos }
          dataLabel="itens"
          descricao="Total de itens que saíram do estoque nos 30 dias antes da próxima doação."
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
          <CardAcao 
          text="Alertas importantes"
          textColor="var(--red)"
          icon="alertButton"
          />
          <CardAcao
          text="Ações rápidas"
          icon="thunder"
          />
        </div>
      </div> 
    </>
  )
}
import style from './GraficoDistribuicao.module.css'
import { Chart } from "react-google-charts"
import { getDadosGraficoBarra } from '../../services/desempenhoService'
import { useEffect, useState } from 'react';

const options = {
  bars: "vertical",
  legend: { position: "top" },
  colors: ["#0D9488", "#D97706"]
};

export function GraficoDistribuicao() {

  const [dadosGrafico, setDadosGrafico] = useState([
    ["Mês", "Entradas", "Saídas"]
  ])

  const nomeDoMes = (mes) => {
    return new Intl.DateTimeFormat('pt-BR', { month: 'short' })
      .format(new Date(2000, Number(mes) -1, 1))
  }

  async function getDados() {
    const resposta = await getDadosGraficoBarra()
    const lista = Array.isArray(resposta) ? resposta : resposta.data
    
    setDadosGrafico([
      ["Mês", "Entradas", "Saídas"],
      ...lista.map(item => [
        nomeDoMes(item.mes),
        item.itensRecebidos,
        item.itensEntregues
      ])
    ])

  }

  useEffect(() => {
    getDados().catch(console.error)
  }, [])


  return (
    <>
    <div className={ style.card }>
      <h2 className={ style.cardTitle }>Itens distribuídos e entregues por mês</h2>
      <Chart
      chartType="Bar"
      data={ dadosGrafico }
      options={ options }
      width="100%"
      height="100%"
    />
    </div>
    </>
  )
}
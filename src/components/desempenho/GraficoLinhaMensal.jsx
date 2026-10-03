import Chart from 'react-google-charts'
import style from './GraficoLinhaMensal.module.css'
import { useEffect, useState } from 'react';
import { getDadosGraficoLinha } from '../../services/desempenhoService';

const options = {
  colors: [ '#1A56DB' ],
  lineWidth: 4,
  legend: { position: 'top' },
};

export function GraficoLinhaMensal(){
  const [dadosGrafico, setDadosGrafico] = useState([
    ["Mês", "Quantidade em que o estoque fechou no mês"]
  ])

  const nomeDoMes = (mes) => {
    return new Intl.DateTimeFormat('pt-BR', { month: 'short' })
      .format(new Date(2000, Number(mes) -1, 1))
  }

  async function getDados() {
      const resposta = await getDadosGraficoLinha()
      const lista = Array.isArray(resposta) ? resposta : resposta.data

      setDadosGrafico([
        ["Mês", "Quantidade em que o estoque fechou no mês"],
        ...lista.map(item => [
          nomeDoMes(item.mes),
          item.estoqueFechamento
        ])
      ])
    }

    useEffect(() => {
      getDados().catch(console.error)
    }, [ ])

  return (
    <>
      <div className={ style.card }>
        <h2 className={ style.cardTitle }>Quantidade de itens no estoque por mês</h2>
        <Chart 
        chartType="LineChart"
        width="100%"
        data={ dadosGrafico }
        options={ options }
        />
      </div>
    </>
  )
}
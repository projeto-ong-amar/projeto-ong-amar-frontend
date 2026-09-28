import { useEffect, useState } from 'react';
import style from './GraficoPizzaItens.module.css'
import { Chart } from "react-google-charts"
import { getDadosGraficoPizza } from '../../services/desempenhoService';

const options = {
  legend: { position: "right" },
  colors: ["#3B82F6", "#4CAF50"],
};

export function GraficoPizzaItens() {

  const [dadosGrafico, setDadosGrafico] = useState([
    ["Tipo", "Quantidade"]
  ])

  async function getDados() {
    const resposta = await getDadosGraficoPizza()
    const lista = Array.isArray(resposta) ? resposta : resposta.data

    setDadosGrafico([
      ["Tipo", "Quantidade"],
      ...lista.map(item => [
        item.tipo,
        item.quantidade
      ])
    ])
  }

  useEffect(() => {
    getDados().catch(console.error)
  }, [])

  return (
    <>
    <div className={ style.card }>
      <h2 className={ style.cardTitle }>Porcentagem dos itens armazenados</h2>
      <Chart 
        chartType="PieChart"
        data={ dadosGrafico }
        options={ options }
        width="100%"
        height="100%"
      />
    </div>
    </>
  )
}
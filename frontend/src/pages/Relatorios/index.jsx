import { useState } from "react";
import Topbar from "../../components/layout/Topbar.jsx";
import PeriodSelector from "../../components/shared/PeriodSelector.jsx";
import ReportCard from "../../components/shared/ReportCard.jsx";
import styles from "./Relatorios.module.css";

const REPORTS = [
  {
    id: "entrada",
    icon: "📥", iconBg: "#DCFCE7",
    title: "Histórico de Entrada",
    description: "Controlar o fluxo de recebimento e monitorar prazos de validade para garantir que os produtos sejam distribuídos em tempo hábil.",
  },
  {
    id: "saida",
    icon: "📤", iconBg: "#FEF3C7",
    title: "Histórico de Saída",
    description: "Monitorar o destino das doações e garantir que a distribuição esteja ocorrendo conforme o planejado.",
  },
  {
    id: "desempenho",
    icon: "📊", iconBg: "#DBEAFE",
    title: "Painel de Desempenho",
    description: "Facilitar a visualização de carências no estoque (itens que estão acabando) e auxiliar no planejamento de novas arrecadações.",
  },
  {
    id: "produtos",
    icon: "📋", iconBg: "#D1FAE5",
    title: "Histórico de Produtos Cadastrados",
    description: "Servir como base de dados para garantir que os itens sejam registrados de forma padronizada, evitando erros de contagem ou nomes duplicados.",
  },
];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("30 dias");

  return (
    <div className={styles.page}>
      <Topbar pageName="Relatórios" />

      <div className={styles.body}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderIcon}>📄</div>
          <div>
            <h1>Relatórios</h1>
            <p>Escolha o relatório que deseja visualizar. Você pode ver na tela ou baixar em Excel.</p>
          </div>
        </div>

        <PeriodSelector value={periodo} onChange={setPeriodo} />

        <div className={styles.list}>
          {REPORTS.map((r) => (
            <ReportCard key={r.id} {...r} tipo={r.id} periodo={periodo} />
          ))}
        </div>
      </div>
    </div>
  );
}

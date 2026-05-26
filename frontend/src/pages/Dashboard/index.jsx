import Topbar from "../../components/layout/Topbar.jsx";

export default function Dashboard() {
  return (
    <div>
      <Topbar pageName="Início" />
      <div style={{ padding: "32px 36px" }}>
        <h1 style={{ fontFamily: "Sora", fontSize: 24, marginBottom: 8 }}>Bem-vindo ao Sistema de Estoque</h1>
        <p style={{ color: "var(--text-muted)" }}>Selecione uma opção no menu lateral para começar.</p>
      </div>
    </div>
  );
}

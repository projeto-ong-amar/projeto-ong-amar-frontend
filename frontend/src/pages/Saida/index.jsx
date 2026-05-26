import Topbar from "../../components/layout/Topbar.jsx";

export default function Saida() {
  return (
    <div>
      <Topbar pageName="Gerenciar Saída" />
      <div style={{ padding: "32px 36px" }}>
        <h1 style={{ fontFamily: "Sora", fontSize: 24 }}>Gerenciar Saída</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Registre a saída de produtos do estoque.</p>
      </div>
    </div>
  );
}

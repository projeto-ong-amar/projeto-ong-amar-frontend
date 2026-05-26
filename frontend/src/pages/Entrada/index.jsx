import Topbar from "../../components/layout/Topbar.jsx";

export default function Entrada() {
  return (
    <div>
      <Topbar pageName="Gerenciar Entrada" />
      <div style={{ padding: "32px 36px" }}>
        <h1 style={{ fontFamily: "Sora", fontSize: 24 }}>Gerenciar Entrada</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Registre a entrada de produtos no estoque.</p>
      </div>
    </div>
  );
}

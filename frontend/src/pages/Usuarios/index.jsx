import Topbar from "../../components/layout/Topbar.jsx";

export default function Usuarios() {
  return (
    <div>
      <Topbar pageName="Cadastro de Usuário" />
      <div style={{ padding: "32px 36px" }}>
        <h1 style={{ fontFamily: "Sora", fontSize: 24 }}>Cadastro de Usuário</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Gerencie os usuários do sistema.</p>
      </div>
    </div>
  );
}

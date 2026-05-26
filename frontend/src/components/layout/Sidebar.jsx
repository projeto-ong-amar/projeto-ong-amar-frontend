import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/dashboard",  icon: "🏠", label: "Início" },
  { to: "/entrada",    icon: "📦", label: "Gerenciar Entrada" },
  { to: "/produtos",   icon: "📋", label: "Cadastro de Produtos" },
  { to: "/saida",      icon: "📤", label: "Gerenciar Saída" },
  { to: "/relatorios", icon: "📄", label: "Relatórios" },
  { to: "/desempenho", icon: "📊", label: "Desempenho" },
  { to: "/usuarios",   icon: "👤", label: "Cadastro de Usuário" },
  { to: "/configuracoes", icon: "⚙️", label: "Configurações" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🎨</div>
        <div className={styles.logoText}>
          <span className={styles.projectLabel}>Projeto</span>
          <span className={styles.userName}>{user?.name ?? "Usuário"}</span>
          <span className={styles.userEmail}>{user?.email ?? ""}</span>
        </div>
      </div>

      <div className={styles.sectionLabel}>Sistema de Estoque</div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.navItem} onClick={handleLogout}>
          <span>🚪</span> Sair
        </button>
      </div>
    </aside>
  );
}

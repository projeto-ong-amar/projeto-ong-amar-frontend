import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PageLayout from "../components/layout/PageLayout.jsx";

import Dashboard  from "../pages/Dashboard/index.jsx";
import Entrada    from "../pages/Entrada/index.jsx";
import Saida      from "../pages/Saida/index.jsx";
import Produtos   from "../pages/Produtos/index.jsx";
import Relatorios from "../pages/Relatorios/index.jsx";
import Usuarios   from "../pages/Usuarios/index.jsx";
import Login      from "../pages/Login/index.jsx";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <PageLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="entrada"    element={<Entrada />} />
        <Route path="saida"      element={<Saida />} />
        <Route path="produtos"   element={<Produtos />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="usuarios"   element={<Usuarios />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

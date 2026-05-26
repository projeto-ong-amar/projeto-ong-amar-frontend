import { useState } from "react";
import Topbar from "../../components/layout/Topbar.jsx";
import { useProdutos } from "../../hooks/useProdutos.js";

export default function Produtos() {
  const { produtos, loading, error } = useProdutos();

  return (
    <div>
      <Topbar pageName="Cadastro de Produtos" />
      <div style={{ padding: "32px 36px" }}>
        <h1 style={{ fontFamily: "Sora", fontSize: 24, marginBottom: 16 }}>Cadastro de Produtos</h1>
        {loading && <p>Carregando produtos...</p>}
        {error   && <p style={{ color: "var(--danger)" }}>Erro ao carregar produtos.</p>}
        {!loading && !error && produtos.length === 0 && (
          <p style={{ color: "var(--text-muted)" }}>Nenhum produto cadastrado.</p>
        )}
        {produtos.map((p) => (
          <div key={p.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            {p.nome}
          </div>
        ))}
      </div>
    </div>
  );
}

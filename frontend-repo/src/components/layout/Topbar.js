/**
 * Topbar component
 * Top navigation bar with breadcrumb and action buttons.
 *
 * @param {string} section - Current section name shown in breadcrumb
 */
export function Topbar({ section = 'Relatórios' }) {
  return `
    <header class="topbar">
      <div class="topbar-breadcrumb">
        <span>Sistema de Gerenciamento de Estoque</span>
        <span class="sep">/</span>
        <span class="current">${section}</span>
      </div>
      <div class="topbar-actions">
        <button class="btn-ajuda"  id="btn-ajuda">Ajuda</button>
        <button class="btn-voltar" id="btn-voltar">← Voltar</button>
      </div>
    </header>
  `;
}

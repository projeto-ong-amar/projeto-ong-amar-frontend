/**
 * Sidebar component
 * Renders the left navigation panel.
 *
 * @param {string} activePage - Key of the currently active nav item
 */
const NAV_ITEMS = [
  { key: 'inicio',            label: 'Início' },
  { key: 'gerenciar-entrada', label: 'Gerenciar Entrada' },
  { key: 'cadastro-produtos', label: 'Cadastro de Produtos' },
  { key: 'gerenciar-saida',   label: 'Gerenciar Saída' },
  { key: 'relatorios',        label: 'Relatórios' },
  { key: 'desempenho',        label: 'Desempenho' },
  { key: 'cadastro-usuario',  label: 'Cadastro de Usuário' },
  { key: 'configuracoes',     label: 'Configurações' },
];

export function Sidebar({ activePage = 'relatorios' }) {
  const navHTML = NAV_ITEMS.map(item => `
    <a class="nav-item ${item.key === activePage ? 'active' : ''}"
       href="#${item.key}" data-page="${item.key}">
      ${item.label}
    </a>
  `).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo"></div>
        <div class="brand-info">
          <div class="brand-name">Usuário X</div>
          <div class="brand-sub">x@gmail.com</div>
        </div>
      </div>
      <div class="sidebar-label">Sistema de Estoque</div>
      <nav class="nav">${navHTML}</nav>
      <div class="sidebar-spacer"></div>
      <div class="sidebar-bottom">
        <button class="btn-sair" id="btn-sair">Sair</button>
      </div>
    </aside>
  `;
}

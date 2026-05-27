import { Sidebar }        from '../components/layout/Sidebar.js';
import { Topbar }         from '../components/layout/Topbar.js';
import { RelatoriosPage } from './Relatorios.js';

/**
 * App — root entry point.
 * Renders the shell (sidebar + topbar) and mounts the active page.
 */
export async function renderApp() {
  const root = document.getElementById('app');

  root.innerHTML = `
    <div class="layout">
      ${Sidebar({ activePage: 'relatorios' })}
      <div class="main">
        ${Topbar({ section: 'Relatórios' })}
        <div id="page-content"></div>
      </div>
    </div>
  `;

  await RelatoriosPage(root.querySelector('#page-content'));

  root.querySelector('#btn-voltar')?.addEventListener('click', () => history.back());
  root.querySelector('#btn-sair')  ?.addEventListener('click', () => console.log('Logout'));
}

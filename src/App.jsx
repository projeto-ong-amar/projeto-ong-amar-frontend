import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { Topbar } from './components/layout/Topbar.jsx';
import { Inicio } from './pages/Inicio.jsx';
import { RelatoriosPage } from './pages/Relatorios.jsx';
import styles from './App.module.css';
import CadastroProdutos from './pages/CadastroProdutos.jsx';


/**
 * Maps each Sidebar nav key to its page component. Add new pages here as
 * they're built — Sidebar and Topbar stay mounted once, only this content
 * area swaps out.
 */
const PAGES = {
  inicio: Inicio,
  relatorios: RelatoriosPage,
  'cadastro-produtos': CadastroProdutos,
};

/**
 * Maps each Sidebar nav key to the label shown in the Topbar breadcrumb.
 */
const SECTION_LABELS = {
  inicio: 'Início',
  'gerenciar-entrada': 'Gerenciar Entrada',
  'cadastro-produtos': 'Cadastro de Produtos',
  'gerenciar-saida': 'Gerenciar Saída',
  relatorios: 'Relatórios',
  desempenho: 'Desempenho',
  'cadastro-usuario': 'Cadastro de Usuário',
  configuracoes: 'Configurações',
};

/**
 * App — root component.
 * Renders the shell (sidebar + topbar) once, and swaps the active page
 * in the content area based on the Sidebar selection.
 */
function App() {
  const [activePage, setActivePage] = useState('inicio');

  const sectionLabel = SECTION_LABELS[activePage] ?? activePage;
  const PageComponent = PAGES[activePage];

  return (
    <div className={styles.layout}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onSair={() => {
          localStorage.removeItem('loggedIn');
          window.location.reload();
        }}
      />
      <div className={styles.main}>
        <Topbar section={sectionLabel} />
      {PageComponent ? (
  <PageComponent onNavigate={setActivePage} />
) : (
          <main className={styles.content}>
            <p>Página "{sectionLabel}" ainda não implementada.</p>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;

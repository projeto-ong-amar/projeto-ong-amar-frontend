import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { Topbar } from './components/layout/Topbar.jsx';
import { RelatoriosPage } from './pages/Relatorios.jsx';

/**
 * App — root component.
 * Renders the shell (sidebar + topbar) and the active page.
 * Currently only the "Relatórios" page is implemented; other sidebar
 * items are placeholders for future pages.
 */
function App() {
  const [activePage, setActivePage] = useState('relatorios');

  const sectionLabel =
    { relatorios: 'Relatórios' }[activePage] ?? activePage;

  return (
    <div className="layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onSair={() => {
          localStorage.removeItem('loggedIn');
          window.location.reload();
        }}
      />
      <div className="main">
        <Topbar section={sectionLabel} />
        {activePage === 'relatorios' ? (
          <RelatoriosPage />
        ) : (
          <main className="content">
            <p>Página "{sectionLabel}" ainda não implementada.</p>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { Topbar } from './components/layout/Topbar.jsx';
import { Inicio } from './pages/Inicio.jsx';
import { RelatoriosPage } from './pages/Relatorios.jsx';
import styles from './App.module.css';
import CadastroProdutos from './pages/CadastroProdutos.jsx';
import GerenciarEntrada from './pages/GerenciarEntrada.jsx';



const PAGES = {
  inicio: Inicio,
  relatorios: RelatoriosPage,
  'cadastro-produtos': CadastroProdutos,
  'gerenciar-entrada': GerenciarEntrada,

};

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
        <Topbar section={sectionLabel} onVoltar={() => setActivePage('inicio')} />
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

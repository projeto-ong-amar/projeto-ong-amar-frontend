import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { Topbar } from './components/layout/Topbar.jsx';
import { Inicio } from './pages/Inicio.jsx';
import { RelatoriosPage } from './pages/Relatorios.jsx';
import styles from './App.module.css';
import CadastroProdutos from './pages/CadastroProdutos.jsx';
import GerenciarEntrada from './pages/GerenciarEntrada.jsx';
import RecuperarSenha from './pages/RecuperarSenha.jsx';
import RedefinirSenha from './pages/RedefinirSenha.jsx';

const PAGES = {
  inicio: Inicio,
  relatorios: RelatoriosPage,
  'cadastro-produtos': CadastroProdutos,
  'gerenciar-entrada': GerenciarEntrada,
  'recuperar-senha': RecuperarSenha,
  'redefinir-senha': RedefinirSenha,
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
  'recuperar-senha': 'Recuperar Senha',
  'redefinir-senha': 'Redefinir Senha',
};

function App({ usuario, onSair }) {
  const [activePage, setActivePage] = useState('inicio');

  const sectionLabel = SECTION_LABELS[activePage] ?? activePage;
  const PageComponent = PAGES[activePage];

 
  const handleVoltar = () => {
    if (activePage === 'redefinir-senha') {
      setActivePage('recuperar-senha');
    } else {
      setActivePage('inicio');
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        usuario={usuario}
        onSair={onSair}
      />
      <div className={styles.main}>
        <Topbar section={sectionLabel} onVoltar={handleVoltar} />
        {PageComponent ? (
          <PageComponent 
            onNavigate={setActivePage} 
            onVoltar={handleVoltar}
            aoVoltar={handleVoltar}
          />
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
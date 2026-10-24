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
import CadastroUsuario from './pages/CadastroUsuario.jsx';
import GerenciarSaida from './pages/GerenciarSaida.jsx';
import Configuracoes from './pages/Configuracoes.jsx';
import HistoricoEntrada from './pages/HistoricoEntrada.jsx';
import HistoricoSaida from './pages/HistoricoSaida.jsx';
import HistoricoUsuario from './pages/HistoricoUsuario.jsx';
import HistoricoProdutos from './pages/HistoricoProdutos.jsx';
import { Desempenho } from './pages/Desempenho.jsx';
import { EstoqueAtual } from './pages/EstoqueAtual.jsx';
import { RiscoVencimento } from './pages/RiscoVencimento.jsx';
import { podeAcessarPagina } from './utils/permissoes.js';

const PAGES = {
  inicio: Inicio,
  relatorios: RelatoriosPage,
  'cadastro-produtos': CadastroProdutos,
  'gerenciar-entrada': GerenciarEntrada,
  'recuperar-senha': RecuperarSenha,
  'redefinir-senha': RedefinirSenha,
  'cadastro-usuario': CadastroUsuario,
  'gerenciar-saida': GerenciarSaida,
  configuracoes: Configuracoes,
  'historico-entrada': HistoricoEntrada,
  'historico-saida': HistoricoSaida,
  'historico-usuario': HistoricoUsuario,
  'historico-produtos': HistoricoProdutos,
  desempenho: Desempenho,
  'estoque-atual': EstoqueAtual,
  'risco-vencimento': RiscoVencimento
};

const SECTION_LABELS = {
  inicio: 'Início',
  'gerenciar-entrada': 'Gerenciar Entrada',
  'cadastro-produtos': 'Cadastro de Produtos',
  'gerenciar-saida': 'Gerenciar Saída',
  relatorios: 'Relatórios',
  'cadastro-usuario': 'Cadastro de Usuário',
  configuracoes: 'Configurações',
  'recuperar-senha': 'Recuperar Senha',
  'redefinir-senha': 'Redefinir Senha',
  'historico-entrada': 'Histórico',
  'historico-saida': 'Histórico',
  'historico-produtos': 'Histórico',
  'historico-usuario': 'Histórico',
  desempenho: 'Desempenho',
  'estoque-atual': 'Estoque Atual',
  'risco-vencimento': 'Risco de Vencimento',
};

const HISTORICO_ORIGEM = {
  'historico-entrada': 'gerenciar-entrada',
  'historico-saida': 'gerenciar-saida',
  'historico-produtos': 'cadastro-produtos',
  'historico-usuario': 'cadastro-usuario',
  'estoque-atual': 'desempenho',
  'risco-vencimento': 'desempenho',
};

const PAGINA_PAI = {
  ...HISTORICO_ORIGEM,
  'redefinir-senha': 'recuperar-senha',
};

function montarEtapas(pagina) {
  const etapas = [];
  let atual = pagina;

  while (atual) {
    etapas.unshift({ label: SECTION_LABELS[atual] ?? atual, pagina: atual });
    atual = PAGINA_PAI[atual];
  }

  if (pagina !== 'inicio') {
    etapas.unshift({ label: SECTION_LABELS.inicio, pagina: 'inicio' });
  }

  return etapas;
}

function App({ usuario, onSair }) {
  const [activePage, setActivePage] = useState('inicio');

  const sectionLabel = SECTION_LABELS[activePage] ?? activePage;
  const etapas = montarEtapas(activePage);
  const paginaPermitida = podeAcessarPagina(usuario, activePage);
  const PageComponent = paginaPermitida ? PAGES[activePage] : null;
  const sidebarActivePage = HISTORICO_ORIGEM[activePage] ?? activePage;

  const handleVoltar = () => {
    if (activePage === 'redefinir-senha') {
      setActivePage('recuperar-senha');
    } else if (HISTORICO_ORIGEM[activePage]) {
      setActivePage(HISTORICO_ORIGEM[activePage]);
    } else {
      setActivePage('inicio');
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        activePage={sidebarActivePage}
        onNavigate={setActivePage}
        usuario={usuario}
        onSair={onSair}
      />
      <div className={styles.main}>
        <Topbar etapas={etapas} onNavigate={setActivePage} onVoltar={handleVoltar} />
        {PageComponent ? (
          <main className={styles.pageScroll}>
            <PageComponent 
              usuario={usuario}
              onNavigate={setActivePage} 
              onVoltar={handleVoltar}
              aoVoltar={handleVoltar}
            />
          </main>
        ) : (
          <main className={styles.content}>
            {paginaPermitida ? (
              <p>Página "{sectionLabel}" ainda não implementada.</p>
            ) : (
              <p role="alert">Você não tem permissão para acessar a página "{sectionLabel}".</p>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
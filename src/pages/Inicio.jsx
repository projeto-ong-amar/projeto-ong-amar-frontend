import { useState } from 'react';
import styles from './Inicio.module.css';

const SERVICOS = [
  {
    chave: 'gerenciar-entrada',
    rotulo: 'Entrada',
    titulo: 'Gerenciar Entrada no Estoque',
    descricao: 'Registre e acompanhe os produtos que entram no estoque.',
    icone: 'https://img.icons8.com/ios/50/2563EB/open-box.png',
  },
  {
    chave: 'cadastro-produtos',
    rotulo: 'Produtos',
    titulo: 'Cadastro de Produtos',
    descricao: 'Cadastre, edite e organize produtos do seu estoque.',
    icone: 'https://img.icons8.com/ios/50/2563EB/task.png',
  },
  {
    chave: 'gerenciar-saida',
    rotulo: 'Saída',
    titulo: 'Gerenciar Saída no Estoque',
    descricao: 'Registre e acompanhe os produtos que saem dos estoque.',
    icone: 'https://img.icons8.com/ios/50/2563EB/empty-box.png',
  },
  {
    chave: 'relatorios',
    rotulo: 'Relatórios',
    titulo: 'Gerar Relatórios',
    descricao: 'Gere relatórios de entradas, saídas, produtos e muito mais.',
    icone: 'https://img.icons8.com/ios/50/2563EB/business-report.png',
  },
  {
    chave: 'desempenho',
    rotulo: 'Dashboard',
    titulo: 'Visualizar Desempenho',
    descricao: 'Acompanhe indicadores e gráficos do desempenho do estoque.',
    icone: 'https://img.icons8.com/ios/50/2563EB/laptop-metrics--v2.png',
  },
  {
    chave: 'cadastro-usuario',
    rotulo: 'Usuário',
    titulo: 'Cadastro de Usuário',
    descricao: 'Cadastre e gerencie os usuários do sistema.',
    icone: 'https://img.icons8.com/ios/50/2563EB/user-group-man-man.png',
  },
];

function IconeBusca(propriedades) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...propriedades}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function Inicio({ aoNavegar }) {
  const [busca, setBusca] = useState('');

  const termo = busca.trim().toLowerCase();
  const servicosFiltrados = termo
    ? SERVICOS.filter(
        (servico) =>
          servico.rotulo.toLowerCase().includes(termo) ||
          servico.titulo.toLowerCase().includes(termo)
      )
    : SERVICOS;

  return (
    <main className={styles.conteudo}>
      <div className={styles.barraBuscaServico}>
        <div className={styles.rotuloBusca}>
          <IconeBusca />
          Buscar por Serviço
        </div>
        <div className={styles.envoltorioBusca}>
          <input
            type="text"
            className={styles.campoBusca}
            placeholder="Exemplo: Cadastro de Usuário..."
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
          <IconeBusca className={styles.iconeBusca} />
        </div>
      </div>

      <div className={styles.tituloServicos}>
        <h2>Principais Serviços</h2>
        <p>Selecione um Serviço Desejado</p>
      </div>

      {servicosFiltrados.length > 0 ? (
        <div className={styles.gradeServicos}>
          {servicosFiltrados.map((servico) => (
            <button
              key={servico.chave}
              type="button"
              className={styles.cartaoServico}
              onClick={() => aoNavegar?.(servico.chave)}
            >
              <div className={styles.circuloIconeServico}>
                <img src={servico.icone} alt="" />
              </div>
              <span className={styles.emblemaServico}>{servico.rotulo}</span>
              <h3 className={styles.tituloServico}>{servico.titulo}</h3>
              <p className={styles.descricaoServico}>{servico.descricao}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className={styles.servicosVazio}>Nenhum serviço encontrado para "{busca}".</p>
      )}
    </main>
  );
}

export default Inicio;
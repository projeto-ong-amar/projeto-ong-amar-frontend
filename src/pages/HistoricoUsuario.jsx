import { useCallback } from 'react';
import styles from './Historico.module.css';
import Historico from './Historico.jsx';
// import {
//   listarUsuariosCadastradosLocal,
//   removerUsuarioDoHistorico,
// } from '../services/usuarioHistoricoLocal.js';

export function HistoricoUsuario({ onNavigate }) {
  // Não há endpoint de listagem de usuários no backend ainda, então o
  // histórico usa os cadastros salvos localmente (ver usuarioHistoricoLocal.js).
  const carregarPagina = useCallback(async (pagina, tamanho) => {
    const todos = listarUsuariosCadastradosLocal();
    const totalPaginas = Math.max(1, Math.ceil(todos.length / tamanho));
    const inicio = pagina * tamanho;
    return {
      itens: todos.slice(inicio, inicio + tamanho),
      totalPaginas,
    };
  }, []);

  return (
    <Historico
      icone="https://img.icons8.com/ios/50/2563EB/user-group-man-man.png"
      titulo="Histórico de Usuários"
      subtitulo="Usuários cadastrados no sistema."
      entidadeNome="usuário"
      mensagemVazio="Nenhum usuário cadastrado nesta sessão."
      carregarPagina={carregarPagina}
      aoEditar={() => onNavigate?.('cadastro-usuario')}
      aoExcluir={(item) => removerUsuarioDoHistorico(item.id)}
      colunas={[
        { chave: 'data', rotulo: 'Data', render: (item) => item.dataCadastro || '-' },
        { chave: 'nome', rotulo: 'Nome', render: (item) => item.nome },
        { chave: 'email', rotulo: 'E-mail', render: (item) => item.email },
        {
          chave: 'tipo',
          rotulo: 'Tipo de Usuário',
          render: (item) => (item.tipoUsuario === 'ADMINISTRADOR' ? 'Administrador' : 'Voluntário'),
        },
        {
          chave: 'status',
          rotulo: 'Status',
          render: (item) => (
            <span className={`${styles.etiquetaStatus} ${item.status === 'Ativo' ? styles.ativo : styles.inativo}`}>
              {item.status || '-'}
            </span>
          ),
        },
      ]}
    />
  );
}

export default HistoricoUsuario;

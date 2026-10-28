import { useEffect, useState } from 'react';
import styles from './Configuracoes.module.css';
import { InputPasswordToggle } from '../components/common/InputPasswordToggle.jsx';
import {
  obterPerfil,
  alterarSenha,
  obterPreferenciasNotificacao,
  atualizarPreferenciasNotificacao,
  obterMetricas,
  atualizarMetricas,
  obterAlertasDashboard,
  atualizarAlertasDashboard,
  METRICAS_PADRAO,
  ALERTAS_PADRAO,
} from '../services/configuracoesService';
import { podeConfigurarMetricas, podeVerNotificacoes } from '../utils/permissoes.js';

const perfilVazio = { id: null, nome: '', email: '', nivelAcesso: '', status: 'Ativo', senhaAtual: '' };
const senhaVazia = { senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' };
const notificacoesVazias = {
  estoqueBaixo: true,
  riscoVencimento: true,
  novasEntradas: true,
  novasSaidas: true,
  emailNotificacao: '',
};

const ABAS = [
  { id: 'metricas', rotulo: 'Métricas de Estoque', icone: 'chart' },
  { id: 'notificacoes', rotulo: 'Notificações e Alertas', icone: 'bell' },
  { id: 'senha', rotulo: 'Senha', icone: 'lock' },
];

const ICONES = {
  chart: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  box: <><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
  warn: <><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v5M12 18h.01" /></>,
  refresh: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
};

function Icone({ nome, tamanho = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONES[nome]}
    </svg>
  );
}

function LinhaToggle({ titulo, descricao, ativo, aoAlternar }) {
  return (
    <div className={styles.linhaNotificacao}>
      <div>
        <strong>{titulo}</strong>
        <p>{descricao}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={ativo}
        aria-label={titulo}
        className={`${styles.interruptor} ${ativo ? styles.interruptorAtivo : ''}`}
        onClick={aoAlternar}
      >
        <span className={styles.bolinha} />
      </button>
    </div>
  );
}

function CampoMetrica({ id, icone, tom, titulo, descricao, valor, unidade, aoMudar }) {
  return (
    <div className={styles.cartaoMetrica}>
      <div className={styles.topoMetrica}>
        <span className={`${styles.iconeMetrica} ${styles[tom]}`}><Icone nome={icone} /></span>
        <label htmlFor={id}>{titulo}</label>
      </div>
      <p>{descricao}</p>
      <div className={styles.entradaMetrica}>
        <input id={id} type="number" min="1" step="1" required value={valor} onChange={aoMudar} />
        <span>{unidade}</span>
      </div>
    </div>
  );
}

export function Configuracoes({ usuario }) {
  const mostrarMetricas = podeConfigurarMetricas(usuario);
  const mostrarNotificacoes = podeVerNotificacoes(usuario);
  const abasVisiveis = ABAS.filter((item) => {
    if (item.id === 'metricas') return mostrarMetricas;
    if (item.id === 'notificacoes') return mostrarNotificacoes;
    return true;
  });
  const [perfil, setPerfil] = useState(perfilVazio);
  const [senha, setSenha] = useState(senhaVazia);
  const [notificacoes, setNotificacoes] = useState(notificacoesVazias);
  const [aba, setAba] = useState(abasVisiveis[0].id);
  const [metricas, setMetricas] = useState(METRICAS_PADRAO);
  const [alertas, setAlertas] = useState(ALERTAS_PADRAO);

  // O e-mail das notificações é sempre o da conta do administrador (somente leitura).
  const emailAdministrador = perfil.email || usuario?.email || '';

  const [enviandoSenha, setEnviandoSenha] = useState(false);
  const [enviandoNotificacoes, setEnviandoNotificacoes] = useState(false);
  const [enviandoAlertas, setEnviandoAlertas] = useState(false);
  const [enviandoMetricas, setEnviandoMetricas] = useState(false);

  const [erroSenha, setErroSenha] = useState('');
  const [sucessoSenha, setSucessoSenha] = useState('');
  const [erroNotificacoes, setErroNotificacoes] = useState('');
  const [sucessoNotificacoes, setSucessoNotificacoes] = useState('');
  const [erroAlertas, setErroAlertas] = useState('');
  const [sucessoAlertas, setSucessoAlertas] = useState('');
  const [erroMetricas, setErroMetricas] = useState('');
  const [sucessoMetricas, setSucessoMetricas] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const dadosPerfil = await obterPerfil();
      if (dadosPerfil) {
        setPerfil({
          id: dadosPerfil.id ?? null,
          nome: dadosPerfil.nome ?? '',
          email: dadosPerfil.email ?? '',
          nivelAcesso: dadosPerfil.nivelAcesso ?? '',
          status: dadosPerfil.status ?? 'Ativo',
          senhaAtual: '',
        });
      }
    } catch (error) {
      setErroPerfil(error.message || 'Não foi possível carregar o perfil.');
    }

    // Voluntário só altera a senha: não carrega preferências, métricas nem alertas.
    if (!mostrarNotificacoes) return;

    try {
      const preferencias = await obterPreferenciasNotificacao();
      if (preferencias) {
        setNotificacoes({
          estoqueBaixo: preferencias.estoqueBaixo ?? true,
          riscoVencimento: preferencias.riscoVencimento ?? true,
          novasEntradas: preferencias.novasEntradas ?? true,
          novasSaidas: preferencias.novasSaidas ?? true,
        });
      }
    } catch (error) {
      setErroNotificacoes(error.message || 'Não foi possível carregar as notificações.');
    }

    try {
      setMetricas(await obterMetricas());
    } catch (error) {
      setErroMetricas(error.message || 'Não foi possível carregar as métricas.');
    }

    try {
      setAlertas(await obterAlertasDashboard());
    } catch (error) {
      setErroAlertas(error.message || 'Não foi possível carregar os alertas.');
    }
  }

  function alterarCampoSenha(campo) {
    return (evento) => {
      setSenha((anterior) => ({ ...anterior, [campo]: evento.target.value }));
      setErroSenha('');
    };
  }

  function alterarMetrica(campo) {
    return (evento) => {
      setMetricas((anterior) => ({ ...anterior, [campo]: evento.target.value }));
      setErroMetricas('');
      setSucessoMetricas('');
    };
  }

  function alternarAlerta(chave) {
    setAlertas((anterior) => ({ ...anterior, [chave]: !anterior[chave] }));
    setErroAlertas('');
    setSucessoAlertas('');
  }

  function alternarNotificacao(chave) {
    setNotificacoes((anterior) => ({ ...anterior, [chave]: !anterior[chave] }));
    setErroNotificacoes('');
    setSucessoNotificacoes('');
  }

  async function salvarMetricas(evento) {
    evento.preventDefault();
    setErroMetricas('');
    setSucessoMetricas('');
    setEnviandoMetricas(true);
    try {
      const numericas = Object.fromEntries(
        Object.entries(metricas).map(([chave, valor]) => [chave, Number(valor)])
      );
      await atualizarMetricas(numericas);
      setMetricas(numericas);
      setSucessoMetricas('Métricas salvas com sucesso!');
    } catch (error) {
      setErroMetricas(error.message || 'Não foi possível salvar as métricas.');
    } finally {
      setEnviandoMetricas(false);
    }
  }

  async function salvarSenha(evento) {
    evento.preventDefault();
    setErroSenha('');
    setSucessoSenha('');

    if (senha.novaSenha !== senha.confirmarNovaSenha) {
      setErroSenha('As senhas informadas não coincidem.');
      return;
    }

    setEnviandoSenha(true);
    try {
      await alterarSenha({ ...perfil, novaSenha: senha.novaSenha });
      setSucessoSenha('Senha alterada com sucesso!');
      setSenha(senhaVazia);
    } catch (error) {
      setErroSenha(error.message || 'Não foi possível alterar a senha.');
    } finally {
      setEnviandoSenha(false);
    }
  }

  async function salvarAlertas(evento) {
    evento.preventDefault();
    setErroAlertas('');
    setSucessoAlertas('');
    setEnviandoAlertas(true);
    try {
      await atualizarAlertasDashboard(alertas);
      setSucessoAlertas('Alertas salvos com sucesso!');
    } catch (error) {
      setErroAlertas(error.message || 'Não foi possível salvar os alertas.');
    } finally {
      setEnviandoAlertas(false);
    }
  }

  async function salvarNotificacoes(evento) {
    evento.preventDefault();
    setErroNotificacoes('');
    setSucessoNotificacoes('');
    setEnviandoNotificacoes(true);
    try {
      await atualizarPreferenciasNotificacao({ ...notificacoes, emailNotificacao: emailAdministrador });
      setSucessoNotificacoes('Notificações salvas com sucesso!');
    } catch (error) {
      setErroNotificacoes(error.message || 'Não foi possível salvar as notificações.');
    } finally {
      setEnviandoNotificacoes(false);
    }
  }

  return (
    <main className={styles.conteudo}>
      <section className={`${styles.cartao} ${styles.cabecalhoPagina}`}>
        <div className={styles.cabecalhoCartao}>
          <div className={styles.iconeCartao}><Icone nome="chart" /></div>
          <div>
            <h2>Configurações do Sistema</h2>
            <p>Defina métricas, alertas e segurança da conta, em linha com os indicadores do dashboard.</p>
          </div>
        </div>
        <div className={styles.abas} role="tablist" aria-label="Seções de configuração">
          {abasVisiveis.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`aba-${item.id}`}
              aria-selected={aba === item.id}
              aria-controls={`painel-${item.id}`}
              className={`${styles.aba} ${aba === item.id ? styles.abaAtiva : ''}`}
              onClick={() => setAba(item.id)}
            >
              <Icone nome={item.icone} tamanho={18} />
              {item.rotulo}
            </button>
          ))}
        </div>
      </section>

      {mostrarMetricas && aba === 'metricas' && (
        <div role="tabpanel" id="painel-metricas" aria-labelledby="aba-metricas">
          <section className={styles.cartao}>
            <div className={styles.cabecalhoCartao}>
              <div className={styles.iconeCartao}><Icone nome="chart" /></div>
              <div>
                <h2>Métricas do Dashboard</h2>
                <p>Defina os limites e períodos usados nos cartões e alertas do dashboard.</p>
              </div>
            </div>

            <div className={styles.divisor} />

            {erroMetricas && <div className={styles.mensagemErro} role="alert">{erroMetricas}</div>}
            {sucessoMetricas && <div className={styles.mensagemSucesso} role="status">{sucessoMetricas}</div>}

            <form onSubmit={salvarMetricas}>
              <div className={styles.gradeMetricas}>
                <CampoMetrica
                  id="metrica-estoque-baixo" icone="box" tom="tomVerde" titulo="Estoque Baixo"
                  descricao="Quantidade mínima antes de gerar alerta de baixo estoque."
                  valor={metricas.estoqueBaixo} unidade="unidades" aoMudar={alterarMetrica('estoqueBaixo')}
                />
                <CampoMetrica
                  id="metrica-risco-vencimento" icone="warn" tom="tomVermelho" titulo="Risco de Vencimento"
                  descricao="Dias para um lote entrar no cartão de risco de vencimento."
                  valor={metricas.riscoVencimentoDias} unidade="dias" aoMudar={alterarMetrica('riscoVencimentoDias')}
                />
                <CampoMetrica
                  id="metrica-vencimento-proximo" icone="cal" tom="tomAmbar" titulo="Vencimento Próximo"
                  descricao="Dias para alertar produtos que vencem em breve."
                  valor={metricas.vencimentoProximoDias} unidade="dias" aoMudar={alterarMetrica('vencimentoProximoDias')}
                />
                <CampoMetrica
                  id="metrica-sem-movimentacao" icone="clock" tom="tomAzul" titulo="Sem Movimentação"
                  descricao="Dias sem entrada ou saída para alertar produto parado."
                  valor={metricas.semMovimentacaoDias} unidade="dias" aoMudar={alterarMetrica('semMovimentacaoDias')}
                />
                <CampoMetrica
                  id="metrica-periodo-indicadores" icone="refresh" tom="tomVerde" titulo="Período dos Indicadores"
                  descricao="Dias antes da próxima doação usados em Doações Recebidas e Itens Distribuídos."
                  valor={metricas.periodoIndicadoresDias} unidade="dias" aoMudar={alterarMetrica('periodoIndicadoresDias')}
                />
              </div>

              <button type="submit" className={`${styles.botaoSalvar} ${styles.botaoAuto}`} disabled={enviandoMetricas}>
                <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
                {enviandoMetricas ? 'Salvando...' : 'Salvar Métricas'}
              </button>
            </form>
          </section>
        </div>
      )}

      {mostrarNotificacoes && aba === 'notificacoes' && (
        <div role="tabpanel" id="painel-notificacoes" aria-labelledby="aba-notificacoes">
          <div className={`${styles.grade} ${styles.gradeIgual}`}>
            <form onSubmit={salvarAlertas} style={{ display: 'contents' }}>
              <section className={styles.cartao} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={styles.cabecalhoCartao}>
                  <div className={styles.iconeCartao}><Icone nome="warn" /></div>
                  <div>
                    <h2>Alertas do Dashboard</h2>
                    <p>Escolha quais alertas aparecem no dashboard.</p>
                  </div>
                </div>

                <div className={styles.divisor} />

                <div className={styles.listaToggles}>
                  <LinhaToggle
                    titulo="Vencimento próximo"
                    descricao={`Produtos que vencem em ${metricas.vencimentoProximoDias || METRICAS_PADRAO.vencimentoProximoDias} dias`}
                    ativo={alertas.vencimentoProximo}
                    aoAlternar={() => alternarAlerta('vencimentoProximo')}
                  />
                  <LinhaToggle
                    titulo="Estoque baixo"
                    descricao="Produtos abaixo do limite mínimo"
                    ativo={alertas.estoqueBaixo}
                    aoAlternar={() => alternarAlerta('estoqueBaixo')}
                  />
                  <LinhaToggle
                    titulo="Sem doações"
                    descricao="Nenhuma doação registrada na semana"
                    ativo={alertas.semDoacoes}
                    aoAlternar={() => alternarAlerta('semDoacoes')}
                  />
                  <LinhaToggle
                    titulo="Sem movimentação"
                    descricao={`Produtos parados há ${metricas.semMovimentacaoDias || METRICAS_PADRAO.semMovimentacaoDias} dias`}
                    ativo={alertas.semMovimentacao}
                    aoAlternar={() => alternarAlerta('semMovimentacao')}
                  />
                </div>

                {erroAlertas && <div className={styles.mensagemErro} role="alert">{erroAlertas}</div>}
                {sucessoAlertas && <div className={styles.mensagemSucesso} role="status">{sucessoAlertas}</div>}

                <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                  <button type="submit" className={`${styles.botaoSalvar} ${styles.botaoAuto}`} disabled={enviandoAlertas}>
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
                    {enviandoAlertas ? 'Salvando...' : 'Salvar Alertas'}
                  </button>
                </div>
              </section>
            </form>

            <form onSubmit={salvarNotificacoes} style={{ display: 'contents' }}>
              <section className={styles.cartao} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={styles.cabecalhoCartao}>
                  <div className={styles.iconeCartao}><Icone nome="mail" /></div>
                  <div>
                    <h2>Notificações por E-mail</h2>
                    <p>Escolha quais notificações você deseja receber por e-mail.</p>
                  </div>
                </div>

                <div className={styles.divisor} />

                <div className={styles.listaToggles}>
                  <LinhaToggle
                    titulo="Estoque baixo"
                    descricao="Enviar e-mail quando os produtos atingirem níveis mínimos"
                    ativo={notificacoes.estoqueBaixo}
                    aoAlternar={() => alternarNotificacao('estoqueBaixo')}
                  />
                  <LinhaToggle
                    titulo="Risco de vencimento"
                    descricao="Enviar e-mail sobre lotes próximos do vencimento"
                    ativo={notificacoes.riscoVencimento}
                    aoAlternar={() => alternarNotificacao('riscoVencimento')}
                  />
                  <LinhaToggle
                    titulo="Novas entradas"
                    descricao="Enviar e-mail sobre novas entradas"
                    ativo={notificacoes.novasEntradas}
                    aoAlternar={() => alternarNotificacao('novasEntradas')}
                  />
                  <LinhaToggle
                    titulo="Novas saídas"
                    descricao="Enviar e-mail sobre novas saídas"
                    ativo={notificacoes.novasSaidas}
                    aoAlternar={() => alternarNotificacao('novasSaidas')}
                  />
                </div>

                <div className={styles.campo} style={{ marginTop: 20, marginBottom: 0 }}>
                  <label htmlFor="email-notificacao">E-mail para Notificação</label>
                  <input
                    id="email-notificacao"
                    type="email"
                    value={emailAdministrador}
                    readOnly
                    aria-describedby="ajuda-email-notificacao"
                  />
                  <small id="ajuda-email-notificacao" className={styles.dicaCampo}>
                    Usamos o e-mail da conta do administrador. Ele só muda quando o e-mail da conta for alterado.
                  </small>
                </div>

                {erroNotificacoes && <div className={styles.mensagemErro} role="alert">{erroNotificacoes}</div>}
                {sucessoNotificacoes && <div className={styles.mensagemSucesso} role="status">{sucessoNotificacoes}</div>}

                <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                  <button type="submit" className={`${styles.botaoSalvar} ${styles.botaoAuto}`} disabled={enviandoNotificacoes}>
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/save.png" alt="" />
                    {enviandoNotificacoes ? 'Salvando...' : 'Salvar Notificações'}
                  </button>
                </div>
              </section>
            </form>
          </div>
        </div>
      )}

      {aba === 'senha' && (
        <div role="tabpanel" id="painel-senha" aria-labelledby="aba-senha">
          <section className={styles.cartao}>
          <div className={styles.cabecalhoCartao}>
            <div className={styles.iconeCartao}>
              <img src="https://img.icons8.com/ios/50/2563EB/lock--v1.png" alt="" />
            </div>
            <div>
              <h2>Segurança</h2>
              <p>Altere sua senha para manter sua conta segura.</p>
            </div>
          </div>

          <div className={styles.divisor} />

          {erroSenha && <div className={styles.mensagemErro} role="alert">{erroSenha}</div>}
          {sucessoSenha && <div className={styles.mensagemSucesso} role="status">{sucessoSenha}</div>}

          <form onSubmit={salvarSenha}>
            <div className={styles.gradeSenha}>
            <InputPasswordToggle
              id="senha-atual"
              className={styles.campo}
              label="Senha Atual"
              placeholder="Digite sua senha atual"
              value={senha.senhaAtual}
              onChange={alterarCampoSenha('senhaAtual')}
              autoComplete="current-password"
              required
            />

            <InputPasswordToggle
              id="nova-senha"
              className={styles.campo}
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              value={senha.novaSenha}
              onChange={alterarCampoSenha('novaSenha')}
              minLength={8}
              maxLength={25}
              autoComplete="new-password"
              required
            />

            <InputPasswordToggle
              id="confirmar-nova-senha"
              className={styles.campo}
              label="Confirmar Nova Senha"
              placeholder="Confirme a nova senha"
              value={senha.confirmarNovaSenha}
              onChange={alterarCampoSenha('confirmarNovaSenha')}
              minLength={8}
              maxLength={25}
              autoComplete="new-password"
              required
            />

            </div>
            <p className={styles.dicaSenha}>A nova senha deve ter entre 8 e 25 caracteres.</p>

            <button type="submit" className={`${styles.botaoSalvar} ${styles.botaoAuto}`} disabled={enviandoSenha}>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/lock--v1.png" alt="" />
              {enviandoSenha ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        </section>
        </div>
      )}
    </main>
  );
}

export default Configuracoes;

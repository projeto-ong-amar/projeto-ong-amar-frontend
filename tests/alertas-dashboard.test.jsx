import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalAlertas } from '../src/components/desempenho/ModalAlertas.jsx';
import { Configuracoes } from '../src/pages/Configuracoes.jsx';
import { Desempenho } from '../src/pages/Desempenho.jsx';
import { apiClient } from '../src/services/apiClient.js';
import { obterAlertasDashboard, atualizarAlertasDashboard, METRICAS_PADRAO, ALERTAS_PADRAO } from '../src/services/configuracoesService.js';

vi.mock('../src/services/apiClient.js', () => ({
  apiClient: { get: vi.fn(), put: vi.fn() },
}));
vi.mock('../src/components/desempenho/GraficoDistribuicao.jsx', () => ({ GraficoDistribuicao: () => null }));
vi.mock('../src/components/desempenho/GraficoPizzaItens.jsx', () => ({ GraficoPizzaItens: () => null }));
vi.mock('../src/components/desempenho/GraficoLinhaMensal.jsx', () => ({ GraficoLinhaMensal: () => null }));

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

describe('BUG-14 alertas do dashboard', () => {
  function prepararConfiguracoes({ falharLeitura = false } = {}) {
    apiClient.get.mockImplementation(async rota => {
      if (rota === '/usuarios/me') return { id: 1, nome: 'Admin', email: 'admin@example.com', tipoUsuario: 'ADMINISTRADOR' };
      if (rota === '/configuracoes/metricas') return METRICAS_PADRAO;
      if (rota === '/configuracoes/alertas-dashboard') {
        if (falharLeitura) throw new Error('Não foi possível carregar os alertas.');
        return ALERTAS_PADRAO;
      }
      return {};
    });
  }

  it('salva a escolha na tela, mostra sucesso só após resposta e respeita ao reabrir o modal', async () => {
    const user = userEvent.setup();
    prepararConfiguracoes();
    let concluir;
    apiClient.put.mockImplementationOnce(() => new Promise(resolve => { concluir = resolve; }));
    const tela = render(<Configuracoes usuario={{ tipoUsuario: 'ADMINISTRADOR' }} />);
    await user.click(screen.getByRole('tab', { name: 'Notificações e Alertas' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Salvar Alertas' }).disabled).toBe(false));
    await user.click(screen.getByRole('switch', { name: 'Sem doações' }));
    await user.click(screen.getByRole('button', { name: 'Salvar Alertas' }));
    expect(apiClient.put).toHaveBeenCalledWith('/configuracoes/alertas-dashboard', { ...ALERTAS_PADRAO, semDoacoes: false });
    expect(screen.queryByText('Alertas salvos com sucesso!')).toBeNull();
    concluir({ ...ALERTAS_PADRAO, semDoacoes: false });
    expect(await screen.findByText('Alertas salvos com sucesso!')).toBeTruthy();
    tela.unmount();
    apiClient.get.mockResolvedValueOnce([]);
    render(<ModalAlertas aberto aoFechar={() => {}} />);
    expect(await screen.findByText('Nenhum alerta ativo no momento.')).toBeTruthy();
    expect(screen.queryByText('Nenhuma doação registrada esta semana')).toBeNull();
  });

  it('mostra erro na tela se salvar falhar, sem confirmar sucesso', async () => {
    const user = userEvent.setup();
    prepararConfiguracoes();
    apiClient.put.mockRejectedValueOnce(new Error('Não foi possível salvar os alertas.'));
    render(<Configuracoes usuario={{ tipoUsuario: 'ADMINISTRADOR' }} />);
    await user.click(screen.getByRole('tab', { name: 'Notificações e Alertas' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Salvar Alertas' }).disabled).toBe(false));
    await user.click(screen.getByRole('button', { name: 'Salvar Alertas' }));
    expect(await screen.findByText('Não foi possível salvar os alertas.')).toBeTruthy();
    expect(screen.queryByText('Alertas salvos com sucesso!')).toBeNull();
  });

  it('impede sobrescrever preferências com padrões se a leitura falhar', async () => {
    const user = userEvent.setup();
    prepararConfiguracoes({ falharLeitura: true });
    render(<Configuracoes usuario={{ tipoUsuario: 'ADMINISTRADOR' }} />);
    await user.click(screen.getByRole('tab', { name: 'Notificações e Alertas' }));
    await screen.findByText('Não foi possível carregar os alertas.');
    expect(screen.getByRole('button', { name: 'Salvar Alertas' }).disabled).toBe(true);
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it('carrega risco de vencimento sem data de doação e distingue lotes de saldo no período', async () => {
    apiClient.get.mockResolvedValue(3);
    render(<Desempenho onNavigate={() => {}} />);
    await waitFor(() => expect(apiClient.get).toHaveBeenCalledWith('/dashboard/kpi-risco-vencimento', { params: { dataProximaDoacao: undefined } }));
    expect(screen.getByRole('button', { name: 'Abrir Saldo no período' })).toBeTruthy();
    expect(screen.getByText('lotes')).toBeTruthy();
    expect(apiClient.get).toHaveBeenCalledTimes(1);
  });

  it('consulta preferências no servidor e persiste inclusive alertas desligados', async () => {
    localStorage.setItem('ong_estoque_alertas_dashboard', '{"semDoacoes":true}');
    const preferencias = { vencimentoProximo: true, estoqueBaixo: true, semDoacoes: false, semMovimentacao: false };
    apiClient.get.mockResolvedValue(preferencias);
    apiClient.put.mockResolvedValue(preferencias);
    expect(await obterAlertasDashboard()).toEqual(preferencias);
    expect(apiClient.get).toHaveBeenCalledWith('/configuracoes/alertas-dashboard');
    expect(await atualizarAlertasDashboard(preferencias)).toEqual(preferencias);
    expect(apiClient.put).toHaveBeenCalledWith('/configuracoes/alertas-dashboard', preferencias);
  });

  it('não simula sucesso quando o servidor rejeita salvar', async () => {
    apiClient.put.mockRejectedValue(new Error('Falha ao salvar'));
    await expect(atualizarAlertasDashboard({ semDoacoes: false })).rejects.toThrow('Falha ao salvar');
    expect(localStorage.getItem('ong_estoque_alertas_dashboard')).toBeNull();
  });

  it('consulta apenas ao abrir, exibe dados reais e atualiza ao reabrir', async () => {
    let concluir;
    apiClient.get.mockImplementationOnce(() => new Promise(resolve => { concluir = resolve; }));
    const props = { aberto: false, aoFechar: vi.fn() };
    const { rerender } = render(<ModalAlertas {...props} />);
    expect(apiClient.get).not.toHaveBeenCalled();
    rerender(<ModalAlertas {...props} aberto />);
    expect(screen.getByRole('status').textContent).toBe('Carregando alertas...');
    concluir([{ tipo: 'aviso', texto: 'Produtos com estoque abaixo de 8 unidades: 17' }]);
    expect(await screen.findByText('Produtos com estoque abaixo de 8 unidades: 17')).toBeTruthy();
    expect(apiClient.get).toHaveBeenCalledWith('/dashboard/alertas');
    expect(screen.queryByText('5 produtos vencem em 7 dias')).toBeNull();
    rerender(<ModalAlertas {...props} />);
    apiClient.get.mockResolvedValueOnce([]);
    rerender(<ModalAlertas {...props} aberto />);
    expect(await screen.findByText('Nenhum alerta ativo no momento.')).toBeTruthy();
    expect(screen.queryByText('Produtos com estoque abaixo de 8 unidades: 17')).toBeNull();
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });

  it('mostra erro em vez de alertas fictícios e permite nova tentativa ao reabrir', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Falha de rede'));
    const { rerender } = render(<ModalAlertas aberto aoFechar={() => {}} />);
    expect((await screen.findByRole('alert')).textContent).toContain('Não foi possível carregar os alertas');
    expect(screen.queryByText('Nenhum alerta ativo no momento.')).toBeNull();
    rerender(<ModalAlertas aberto={false} aoFechar={() => {}} />);
    apiClient.get.mockResolvedValueOnce([]);
    rerender(<ModalAlertas aberto aoFechar={() => {}} />);
    expect(await screen.findByText('Nenhum alerta ativo no momento.')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('ignora respostas antigas após fechar e reabrir', async () => {
    let concluirAntiga;
    apiClient.get.mockImplementationOnce(() => new Promise(resolve => { concluirAntiga = resolve; }));
    const { rerender } = render(<ModalAlertas aberto aoFechar={() => {}} />);
    rerender(<ModalAlertas aberto={false} aoFechar={() => {}} />);
    apiClient.get.mockResolvedValueOnce([]);
    rerender(<ModalAlertas aberto aoFechar={() => {}} />);
    await screen.findByText('Nenhum alerta ativo no momento.');
    concluirAntiga([{ tipo: 'info', texto: 'Resposta antiga' }]);
    await waitFor(() => expect(screen.queryByText('Resposta antiga')).toBeNull());
  });

  it('pagina dados reais e reinicia a página ao reabrir', async () => {
    const user = userEvent.setup();
    const alertas = Array.from({ length: 5 }, (_, indice) => ({ tipo: 'info', texto: `Alerta ${indice}` }));
    apiClient.get.mockResolvedValue(alertas);
    const { rerender } = render(<ModalAlertas aberto aoFechar={() => {}} />);
    await screen.findByText('Alerta 0');
    await user.click(screen.getByRole('button', { name: 'Próximos alertas' }));
    expect(screen.getByText('Alerta 4')).toBeTruthy();
    rerender(<ModalAlertas aberto={false} aoFechar={() => {}} />);
    rerender(<ModalAlertas aberto aoFechar={() => {}} />);
    expect(await screen.findByText('Alerta 0')).toBeTruthy();
  });
});

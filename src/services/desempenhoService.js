import { apiClient } from "./apiClient";

// Enquanto o endpoint da lista de risco de vencimento não existe no backend,
// deixe true para usar os dados de exemplo abaixo. Quando o endpoint estiver
// pronto, troque para false.
const USAR_MOCK_RISCO_VENCIMENTO = true;

// Mesma ideia para a lista da tela "Estoque Atual".
const USAR_MOCK_ESTOQUE_ATUAL = true;

const MOCK_ESTOQUE_ATUAL = [
  { id: 1, produto: "Arroz Tipo 1 - 5kg", categoria: "Alimentos", quantidade: 120 },
  { id: 2, produto: "Feijão Carioca - 1kg", categoria: "Alimentos", quantidade: 85 },
  { id: 3, produto: "Macarrão Espaguete - 500g", categoria: "Alimentos", quantidade: 60 },
  { id: 4, produto: "Óleo de Soja - 900ml", categoria: "Alimentos", quantidade: 28 },
  { id: 5, produto: "Açúcar Cristal - 1kg", categoria: "Alimentos", quantidade: 45 },
  { id: 6, produto: "Café em Pó - 500g", categoria: "Alimentos", quantidade: 12 },
  { id: 7, produto: "Leite UHT - 1L", categoria: "Bebidas", quantidade: 30 },
  { id: 8, produto: "Sabão em Pó - 1kg", categoria: "Higiene e Limpeza", quantidade: 8 },
  { id: 9, produto: "Papel Higiênico - 12 rolos", categoria: "Higiene e Limpeza", quantidade: 0 },
  { id: 10, produto: "Desinfetante - 1L", categoria: "Higiene e Limpeza", quantidade: 25 },
  { id: 11, produto: "Sal Refinado - 1kg", categoria: "Alimentos", quantidade: 40 },
  { id: 12, produto: "Sabonete - 90g", categoria: "Higiene e Limpeza", quantidade: 70 },
];

const MOCK_RISCO_VENCIMENTO = [
  { produto: "Arroz", categoria: "Alimentos", validade: "2026-12-12", quantidade: 3 },
  { produto: "Óleo de Soja", categoria: "Alimentos", validade: "2026-12-14", quantidade: 1 },
  { produto: "Feijão Preto", categoria: "Alimentos", validade: "2026-12-22", quantidade: 1 },
  { produto: "Leite Integral", categoria: "Bebidas", validade: "2026-12-31", quantidade: 6 },
  { produto: "Açúcar Refinado", categoria: "Alimentos", validade: "2026-12-02", quantidade: 9 },
  { produto: "Macarrão", categoria: "Alimentos", validade: "2026-12-05", quantidade: 4 },
];

export function getDadosGraficoBarra() {
  return apiClient.get('/dashboard/movimentacoes-por-mes')
}

export function getDadosGraficoPizza() {
  return apiClient.get('/dashboard/estoque-por-tipo')
}

export function getDadosGraficoLinha() {
  return apiClient.get('/dashboard/estoque-fechamento-por-mes')
}

export function getKPIEstoque(dataProximaDoacao) {
  return apiClient.get('/dashboard/kpi-estoque-atual', {
    params: { dataProximaDoacao }
  })
}

export function getKPIRiscoVencimento(dataProximaDoacao) {
  return apiClient.get('/dashboard/kpi-risco-vencimento', {
    params: { dataProximaDoacao }
  })
}

// Lista os produtos cujo lote vence nos 30 dias antes da próxima doação.
// Esperado: [{ produto: 'Arroz', categoria: 'Alimentos', validade: '2026-12-12', quantidade: 3 }]
// TODO: confirmar o caminho do endpoint com o backend.
export function getListaRiscoVencimento(dataProximaDoacao) {
  if (USAR_MOCK_RISCO_VENCIMENTO) {
    return Promise.resolve(MOCK_RISCO_VENCIMENTO);
  }
  return apiClient.get('/dashboard/lista-risco-vencimento', {
    params: { dataProximaDoacao }
  })
}

// Lista de produtos e quantidades em estoque (tela "Estoque Atual").
// Esperado: [{ id: 1, produto: 'Arroz Tipo 1 - 5kg', categoria: 'Alimentos', quantidade: 120 }]
// TODO: confirmar o caminho do endpoint com o backend.
export function getListaEstoqueAtual() {
  if (USAR_MOCK_ESTOQUE_ATUAL) {
    return Promise.resolve(MOCK_ESTOQUE_ATUAL);
  }
  return apiClient.get('/dashboard/lista-estoque-atual');
}

export function getKPIDoacoesRecebidas(dataProximaDoacao) {
  return apiClient.get('/dashboard/kpi-doacoes-recebidas', {
    params: { dataProximaDoacao }
  })
}

export function getKPIItensDistribuidos(dataProximaDoacao) {
  return apiClient.get('/dashboard/kpi-itens-distribuidos', {
    params: { dataProximaDoacao }
  })
}
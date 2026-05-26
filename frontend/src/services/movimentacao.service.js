import api from "./api.js";

export const movimentacaoService = {
  async registrarEntrada(payload) {
    const { data } = await api.post("/movimentacoes/entrada", payload);
    return data;
  },

  async registrarSaida(payload) {
    const { data } = await api.post("/movimentacoes/saida", payload);
    return data;
  },

  async listarEntradas(params = {}) {
    const { data } = await api.get("/movimentacoes/entradas", { params });
    return data;
  },

  async listarSaidas(params = {}) {
    const { data } = await api.get("/movimentacoes/saidas", { params });
    return data;
  },
};

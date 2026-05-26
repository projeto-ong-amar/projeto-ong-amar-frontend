import api from "./api.js";

export const relatoriosService = {
  async getHistoricoEntrada(periodo) {
    const { data } = await api.get("/relatorios/entrada", { params: { periodo } });
    return data;
  },

  async getHistoricoSaida(periodo) {
    const { data } = await api.get("/relatorios/saida", { params: { periodo } });
    return data;
  },

  async getPainelDesempenho(periodo) {
    const { data } = await api.get("/relatorios/desempenho", { params: { periodo } });
    return data;
  },

  async getHistoricoProdutos(periodo) {
    const { data } = await api.get("/relatorios/produtos", { params: { periodo } });
    return data;
  },

  async downloadExcel(tipo, periodo) {
    const response = await api.get(`/relatorios/${tipo}/export`, {
      params: { periodo },
      responseType: "blob",
    });
    const url  = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href  = url;
    link.setAttribute("download", `relatorio-${tipo}-${periodo}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

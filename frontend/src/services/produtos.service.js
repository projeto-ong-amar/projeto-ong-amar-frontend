import api from "./api.js";

export const produtosService = {
  async listar(params = {}) {
    const { data } = await api.get("/produtos", { params });
    return data; // { items, total, page }
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/produtos/${id}`);
    return data;
  },

  async criar(payload) {
    const { data } = await api.post("/produtos", payload);
    return data;
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/produtos/${id}`, payload);
    return data;
  },

  async deletar(id) {
    await api.delete(`/produtos/${id}`);
  },
};

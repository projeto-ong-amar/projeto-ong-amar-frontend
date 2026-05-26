import api from "./api.js";

export const authService = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    return data; // { token, user }
  },

  async logout() {
    await api.post("/auth/logout");
  },

  async me() {
    const { data } = await api.get("/auth/me");
    return data;
  },
};

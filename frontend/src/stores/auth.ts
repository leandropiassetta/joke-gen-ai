import { defineStore } from "pinia";
import http from "../api/http";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
    authReady: false,
  }),

  actions: {
    async login(email: string, password: string) {
      const response = await http.post("/login", { email, password });

      this.token = response.data.token;
      this.user = response.data.user;

      if (this.token) {
        localStorage.setItem("token", this.token);
      } else {
        localStorage.removeItem("token");
      }

      localStorage.setItem("user", JSON.stringify(this.user));
    },

    async validateToken() {
      this.authReady = false

      const token = localStorage.getItem('token')
      if (!token) {
        this.token = null
        this.user = null
        this.authReady = true
        return false
      }

      try {
        const res = await http.get('/me')
        // backend returns { user: { ... } }
        const user = res.data.user || res.data
        this.token = token
        this.user = user
        localStorage.setItem('user', JSON.stringify(this.user))
        this.authReady = true
        return true
      } catch (err) {
        this.logout()
        this.authReady = true
        return false
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});

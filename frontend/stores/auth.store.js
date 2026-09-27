import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, token: '' }),
  getters: { isAuthenticated: state => Boolean(state.token && state.user) },
  actions: {
    restore() {
      if (!import.meta.client) return;
      try {
        const saved = JSON.parse(localStorage.getItem('tasknest-session') || 'null');
        if (saved?.token && saved?.user) { this.token = saved.token; this.user = saved.user; }
      } catch { localStorage.removeItem('tasknest-session'); }
    },
    save(data) {
      this.user = data.user; this.token = data.token;
      if (import.meta.client) localStorage.setItem('tasknest-session', JSON.stringify(data));
    },
    clearSession() {
      this.user = null; this.token = '';
      if (import.meta.client) localStorage.removeItem('tasknest-session');
    },
    async login(email, password) {
      const data = await $fetch(`${useRuntimeConfig().public.apiBase}/auth/login`, { method: 'POST', body: { email, password } });
      this.save(data);
    },
    async register(name, email, password) {
      const data = await $fetch(`${useRuntimeConfig().public.apiBase}/auth/register`, { method: 'POST', body: { name, email, password } });
      this.save(data);
    },
    logout() { this.clearSession(); navigateTo('/login'); }
  }
});

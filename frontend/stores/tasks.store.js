import { defineStore } from 'pinia';
import { apiFetch } from '~/utils/api';
export const useTasksStore = defineStore('tasks', {
  state: () => ({ items: [], loading: false, filter: 'all', search: '' }),
  getters: {
    filtered(state) {
      return state.items.filter(t => (state.filter === 'all' || t.status === state.filter) &&
        (!state.search || t.title.toLowerCase().includes(state.search.toLowerCase())));
    },
    counts(state) {
      return { total: state.items.length, todo: state.items.filter(t => t.status === 'todo').length,
        progress: state.items.filter(t => t.status === 'in-progress').length, done: state.items.filter(t => t.status === 'done').length };
    }
  },
  actions: {
    async fetchAll(query = {}) { this.loading = true; try { const d = await apiFetch('/tasks', { query }); this.items = d.tasks; } finally { this.loading = false; } },
    async create(payload) { const d = await apiFetch('/tasks', { method: 'POST', body: payload }); this.items.unshift(d.task); return d.task; },
    async update(id, payload) { const d = await apiFetch(`/tasks/${id}`, { method: 'PATCH', body: payload }); const i = this.items.findIndex(t => t._id === id); if (i >= 0) this.items[i] = d.task; return d.task; },
    async remove(id) { await apiFetch(`/tasks/${id}`, { method: 'DELETE' }); this.items = this.items.filter(t => t._id !== id); }
  }
});

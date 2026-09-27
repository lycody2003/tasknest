import { defineStore } from 'pinia';
import { apiFetch } from '~/utils/api';
export const useProjectsStore = defineStore('projects', {
  state: () => ({ items: [], loading: false }),
  actions: {
    async fetchAll() { this.loading = true; try { const d = await apiFetch('/projects'); this.items = d.projects; } finally { this.loading = false; } },
    async create(payload) { const d = await apiFetch('/projects', { method: 'POST', body: payload }); this.items.unshift({ ...d.project, openTasks: 0 }); return d.project; },
    async update(id, payload) { const d = await apiFetch(`/projects/${id}`, { method: 'PATCH', body: payload }); const i = this.items.findIndex(p => p._id === id); if (i >= 0) this.items[i] = { ...this.items[i], ...d.project }; return d.project; },
    async remove(id) { await apiFetch(`/projects/${id}`, { method: 'DELETE' }); this.items = this.items.filter(p => p._id !== id); }
  }
});

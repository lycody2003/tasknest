import { useAuthStore } from '~/stores/auth.store';
export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  auth.restore();
});

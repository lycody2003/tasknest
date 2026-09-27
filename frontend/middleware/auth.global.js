export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return;
  const auth = useAuthStore();
  const publicPages = ['/login', '/register'];
  if (!auth.isAuthenticated && !publicPages.includes(to.path)) return navigateTo('/login');
  if (auth.isAuthenticated && publicPages.includes(to.path)) return navigateTo('/');
});

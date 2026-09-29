export async function apiFetch(path, options = {}) {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  try {
    return await $fetch(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
    });
  } catch (error) {
    if (error?.status === 401 && import.meta.client) auth.clearSession();
    throw new Error(
      error?.data?.message || error?.message || "Request failed",
      { cause: error },
    );
  }
}

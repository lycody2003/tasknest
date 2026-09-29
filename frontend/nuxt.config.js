export default defineNuxtConfig({
  ssr: false,

  devtools: { enabled: false },

  devServer: {
    port: 8080,
    host: "0.0.0.0",
  },

  modules: ["@pinia/nuxt", "@nuxt/eslint"],

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000/api",
    },
  },

  app: {
    head: {
      title: "TaskNest — Plan with clarity",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
    },
  },

  routeRules: {
    "/api/**": {
      proxy: "http://tasknest-backend:4000/api/**",
    },
  },
});

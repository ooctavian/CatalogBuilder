// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@bg-dev/nuxt-naiveui"],
  runtimeConfig: {
    public: {
      backendUrl:
        process.env.BACKEND_URL || "https://backend-ten-mu-83.vercel.app",
      frontendUrl: process.env.FRONTEND_URL || "http://localhost:3001",
    },
  },
});

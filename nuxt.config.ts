// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  modules: ["@nuxthq/ui"],
  colorMode: {
    preference: "light",
  },
  ui: {
    icons: ["fluent", "skill-icons"],
  },
});

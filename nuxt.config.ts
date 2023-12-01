// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  imports: {
    dirs: ["./composables", "./utils", "./stores"],
  },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@formkit/auto-animate/nuxt",
    "nuxt-scheduler",
    "nuxt-icon",
    "@vuestic/nuxt",
  ],
  vuestic: {
    css: false,
  },
  vue: {
    propsDestructure: true,
    defineModel: true,
  },
  hooks: {},
});

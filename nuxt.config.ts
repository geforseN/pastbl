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
    imports: [
      {
        from: "../../node_modules/@nuxt/ui/dist/runtime/composables/useToast.mjs",
        name: "useToast",
        as: "useNuxtToast",
      },
      {
        from: "../../node_modules/@vuestic/nuxt/dist/runtime/composables",
        name: "useToast",
        as: "useVuesticToast",
      },
    ],
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

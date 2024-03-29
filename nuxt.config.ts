// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // At 00:00 on day-of-month 1 => every month
      "0 0 1 * *": "get-twitch-token",
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
  i18n: {
    lazy: true,
    langDir: "lang",
    defaultLocale: "en",
    strategy: "prefix",
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
      },
      {
        code: "ru",
        name: "Русский",
        file: "ru.json",
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
    "@nuxtjs/i18n",
  ],
  vuestic: {
    css: false,
  },
  vue: {
    propsDestructure: true,
  },
});

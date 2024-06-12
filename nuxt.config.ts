import { VaSlider, VaCounter } from "vuestic-ui";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    viewTransition: true,
    typedPages: true,
  },
  features: {
    devLogs: true,
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  typescript: {
    strict: true,
  },
  vite: {
    esbuild: {
      pure: ["console.log"],
    },
  },
  site: {
    url: "https://pastbl.vercel.app",
    title: "Pastas Are Here",
    description: "Do Something With Pastas",
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // At 00:00 on day-of-month 1 => every month
      "0 0 1 * *": "get-twitch-token",
    },
  },
  // FIXME: fix warnings in console
  imports: {
    dirs: ["./composables", "./utils", "./stores"],
    imports: [
      {
        from: "../../node_modules/@nuxt/ui/dist/runtime/composables/useToast.mjs",
        name: "useToast",
        as: "useNuxtToast",
        priority: 3,
      },
      {
        from: "../../node_modules/@vuestic/nuxt/dist/runtime/composables",
        name: "useToast",
        as: "useVuesticToast",
      },
    ],
  },
  $development: {
    app: {
      head: {
        titleTemplate: "pastbl - dev - %s",
      },
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      titleTemplate: "pastbl - %s",
    },
    viewTransition: true,
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
    "@formkit/auto-animate/nuxt",
    "@nuxt/test-utils/module",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@nuxtjs/seo" /* LINK: https://nuxtseo.com/ */,
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vuestic/nuxt",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
    "nuxt-icon",
    "@nuxt/eslint",
  ],
  vuestic: {
    css: false,
    config: {
      components: {
        VaCounter,
        VaSlider,
      },
    },
  },
  vue: {
    propsDestructure: true,
  },
});

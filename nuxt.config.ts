// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    viewTransition: true,
    typedPages: true,
  },
  $production: {
    modules: ["@nuxtjs/seo"],
    site: {
      defaultLocale: "en",
    },
    sitemap: {
      sources: ["/api/__sitemap__/sanity", "/api/__sitemap__/urls"],
    },
    ogImage: {
      enabled: false,
    },
  },
  features: {
    devLogs: true,
  },
  debug: true,
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
    "@element-plus/nuxt",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
    "nuxt-icon",
    "@nuxt/eslint",
  ],
  vue: {
    propsDestructure: true,
  },
});

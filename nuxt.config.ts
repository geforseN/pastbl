import { fileURLToPath } from "node:url";

const modules = [
  // "@formkit/auto-animate/nuxt",
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
  "@scalar/nuxt",
  // "nuxt-open-fetch",
];

// NOTE:
// Nuxt UI will automatically install the @nuxt/icon, @nuxtjs/tailwindcss and @nuxtjs/color-mode modules for you.
// You should remove them from your modules and dependencies if you've previously installed them.
// LINK: https://ui.nuxt.com/getting-started/installation#modules
if (modules.includes("@nuxt/ui")) {
  const moduleIndexes = [
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
  ]
    .map((moduleName) => modules.indexOf(moduleName))
    .filter((index) => index !== -1);
  for (const moduleIndex of moduleIndexes) {
    modules.splice(moduleIndex, 1);
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: false,
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
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
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
      openAPI: true,
    },
    scheduledTasks: {
      // At 00:00., everyday
      "0 0 * * *": "get-twitch-token",
    },
  },
  // FIXME: fix warnings in console
  imports: {
    presets: [],
    imports: [
      {
        from: "#ui/composables/useToast",
        name: "useToast",
        as: "useNuxtToast",
      },
      {
        from: "#ui/composables/useToast",
        name: "useToast",
        disabled: true,
      },
      {
        from: "vue",
        name: "Slot",
        type: true,
        as: "VueSlot",
      },
      { from: "vitest", name: "assert", disabled: true },
      // { from: "@formkit/auto-animate", name: "autoAnimate", disabled: true, priority: 10 },
      // { from: "@formkit/auto-animate", name: "vAutoAnimate" },
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
  modules: console.log({ modules }) || modules,
  vue: {
    propsDestructure: true,
  },
  alias: {
    $: fileURLToPath(new URL("layers", import.meta.url)),
  },
});

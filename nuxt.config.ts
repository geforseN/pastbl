import { fileURLToPath } from "node:url";
import { i18n } from "./app/i18n.config";
import defaultTailwindTheme from "tailwindcss/defaultTheme";
import defaultTailwindConfig from "tailwindcss/defaultConfig";
import tailwindTheme from "./tailwind.theme";

// LINK: https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-09-19",
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    viewTransition: true,
    typedPages: true,
  },
  features: {
    devLogs: true,
  },
  alias: {
    $: fileURLToPath(new URL("layers", import.meta.url)),
  },
  devtools: {
    enabled: true,
    telemetry: true,
    timeline: {
      enabled: true,
    },
  },
  extensions: ["ts", "vue"],
  modules: [
    "@nuxtjs/i18n",
    !process.env.TEST && "@vue-macros/nuxt",
    "@element-plus/nuxt",
    "@formkit/auto-animate/nuxt",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/test-utils/module",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/css/tailwind.css"],
  nitro: {
    compressPublicAssets: true,
    minify: true,
    experimental: {
      tasks: true,
      openAPI: true,
    },
    scheduledTasks: {
      "0 0 * * *" /* At 00:00., everyday */: "get-twitch-token",
    },
  },
  imports: {
    presets: [],
    imports: [
      {
        from: "vue",
        name: "Slot",
        type: true,
        as: "VueSlot",
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
  $production: {
    vite: {
      esbuild: {
        pure: ["console.log"],
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
  sourcemap: {
    server: false,
    client: false,
  },
  i18n: {
    ...i18n,
    lazy: true,
    defaultLocale: "en",
    strategy: "prefix",
  },
  vue: {
    propsDestructure: true,
  },
  ignoreOptions: {
    ignorecase: false,
    allowRelativePaths: false,
  },
  macros: {
    scriptLang: {
      defaultLang: "ts",
    },
  },
  vite: {
    define: {
      defaultTailwindTheme,
      defaultTailwindConfig,
      tailwindTheme,
    },
  },
});

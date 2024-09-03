import { fileURLToPath } from "node:url";
import { i18n } from "./app/i18n.config";

// LINK: https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  modules: defineModules([
    "@element-plus/nuxt",
    "@formkit/auto-animate/nuxt",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    !import.meta.test && "@vue-macros/nuxt",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
  ]),
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
        from: "#ui/composables/useToast",
        name: "useToast",
        as: "useNuxtToast",
      },
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
  tailwindcss: {
    viewer: false,
  },
  vue: {
    propsDestructure: true,
  },
  ignoreOptions: {
    ignorecase: false,
    allowRelativePaths: false,
  },
  macros: {
    templateRef: {
      alias: ["templateRef", "useTemplateRef"],
    },
    scriptLang: {
      defaultLang: "ts",
    },
  },
});

function defineModules(modules: (string | undefined | boolean)[]) {
  const modules_ = modules.filter((string) => typeof string === "string");
  if (modules_.includes("@nuxt/ui")) {
    // NOTE:
    // Nuxt UI will automatically install the @nuxt/icon, @nuxtjs/tailwindcss and @nuxtjs/color-mode modules for you.
    // You should remove them from your modules and dependencies if you've previously installed them.
    // LINK: https://ui.nuxt.com/getting-started/installation#modules
    const moduleIndexes = [
      "@nuxt/icon",
      "@nuxtjs/tailwindcss",
      "@nuxtjs/color-mode",
    ]
      .map((moduleName) => modules_.indexOf(moduleName))
      .filter((index) => index !== -1);
    for (const moduleIndex of moduleIndexes) {
      modules_.splice(moduleIndex, 1);
    }
  }
  return modules_;
}

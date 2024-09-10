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
    !process.env.TEST && "@vue-macros/nuxt",
    "@element-plus/nuxt",
    "@formkit/auto-animate/nuxt",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/test-utils/module",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
  ]),
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
  tailwindcss: {
    viewer: false,
    exposeConfig: true,
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
  // hooks: {
  //   "tailwindcss:config"(tailwindConfig) {
  //     tailwindConfig.theme.colors.blue = "#fff";
  //   },
  //   "tailwindcss:resolvedConfig"(resolvedConfig) {
  //     console.log(
  //       "This is the resulting config",
  //       JSON.stringify(resolvedConfig),
  //     );
  //   },
  // },
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

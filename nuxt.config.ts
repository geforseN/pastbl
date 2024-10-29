import { fileURLToPath } from "node:url";
import { codecovVitePlugin } from "@codecov/vite-plugin";
import { i18n } from "./app/i18n.config.ts";
import tailwindTheme from "./tailwind.theme.ts";
import testsAlias from "./tests/alias.ts";

const nuxtDefaults = {
  ignore: [
    "**/*.stories.{js,cts,mts,ts,jsx,tsx}",
    "**/*.{spec,test}.{js,cts,mts,ts,jsx,tsx}",
    "**/*.d.{cts,mts,ts}",
    "**/.{pnpm-store,vercel,netlify,output,git,cache,data}",
    ".nuxt/analyze",
    ".nuxt",
    "**/-*.*",
  ],
};

// LINK: https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    "@nuxtjs/storybook",
    // NOTE: @codecov/nuxt-plugin must be at the end
    [
      "@codecov/nuxt-plugin",
      {
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "pastbl",
        uploadToken: process.env.CODECOV_TOKEN,
      },
    ],
  ],
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
  imports: {
    imports: [
      {
        from: "vue",
        name: "Slot",
        type: true,
        as: "VueSlot",
      },
    ],
  },
  devtools: {
    enabled: true,
    telemetry: true,
    timeline: {
      enabled: true,
    },
  },
  app: {
    head: {
      titleTemplate: "pastbl - %s",
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
      meta: [
        {
          name: "google-site-verification",
          content: "CgANEjqKJNLsIr9m7Jf_2iVg107bGXAAsEFiL3UI2cw",
        },
        { name: "theme-color", content: "#ff52d9f2" },
      ],
    },
    viewTransition: true,
  },
  css: ["~/assets/css/tailwind.css"],
  runtimeConfig: {
    session: {
      cookie: {
        sameSite: "none",
      },
    },
  },
  alias: {
    $: fileURLToPath(new URL("layers", import.meta.url)),
    ...testsAlias,
  },
  extensions: ["ts", "vue"],
  ignore: nuxtDefaults.ignore.concat([
    "**/coverage/**",
  ]),
  sourcemap: {
    server: false,
    client: false,
  },
  future: {
    compatibilityVersion: 4,
  },
  features: {
    devLogs: true,
  },
  experimental: {
    viewTransition: true,
    typedPages: true,
  },
  compatibilityDate: "2024-09-19",
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      /* Everyday at 00:00 */
      "0 0 * * *": "get-twitch-token",
    },
  },
  vite: {
    define: {
      tailwindTheme,
    },
    plugins: [
      // NOTE: codecovVitePlugin must be at the end
      codecovVitePlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "pastbl",
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    // esbuild: {/* TODO */},
    server: {
      warmup: {
        clientFiles: [
          "./assets/css/tailwind.css",
          "./app/plugins/**",
          "**/app.config.ts",
          "./app/app.vue",
          "./app.vue",
          "./app/i18n.config.ts",
          "./i18n.config.ts",
          "./app/components/**/*.vue",
          "./components/**/*.vue",
          "./layers/pastas/**/*.vue",
        ],
      },
    },
    optimizeDeps: {
      include: [
        "@vueuse/core",
        "idb",
        "vue-i18n",
        "vue-virtual-scroller",
        "tailwindcss",
      ],
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        allowImportingTsExtensions: true,
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  i18n: {
    ...i18n,
    lazy: true,
    defaultLocale: "en",
    strategy: "prefix",
  },
  icon: {
    collections: ["ic", "carbon", "solar", "mdi", "material-symbols"],
  },
  macros: {
    scriptLang: {
      defaultLang: "ts",
    },
  },
});

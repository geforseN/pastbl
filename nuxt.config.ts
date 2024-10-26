import { fileURLToPath } from "node:url";
import { codecovVitePlugin } from "@codecov/vite-plugin";
import { i18n } from "./app/i18n.config";
import tailwindTheme from "./tailwind.theme";
import testsAlias from "./tests/alias";

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
  vue: {
    propsDestructure: true,
  },
  alias: {
    $: fileURLToPath(new URL("layers", import.meta.url)),
    ...testsAlias,
  },
  extensions: ["ts", "vue"],
  ignoreOptions: {
    ignorecase: false,
    allowRelativePaths: false,
  },
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
    compressPublicAssets: true,
    minify: true,
    experimental: {
      tasks: true,
      openAPI: true,
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
  macros: {
    scriptLang: {
      defaultLang: "ts",
    },
  },
});

import devtools from "vite-plugin-vue-devtools";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  vite: () => ({
    plugins: [
      devtools({
        appendTo: "entrypoints/popup/main.ts",
      }),
    ],
  }),

});

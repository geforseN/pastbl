import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "app",
  modules: ["@wxt-dev/module-vue", "@wxt-dev/i18n/module"],
  manifest: {
    name: "pastbl",
    default_locale: "en",
    permissions: ["storage"],
  },
  runner: {
    chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
  },
});

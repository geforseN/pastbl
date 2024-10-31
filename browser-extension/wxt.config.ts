import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-vue", "@wxt-dev/i18n/module"],
  manifest: {
    name: "pastbl",
    default_locale: "en",
  },
  runner: {
    chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
  },
});

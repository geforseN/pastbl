import { resolve } from "path";
import { defineConfig } from "wxt";

export default defineConfig({
  alias: {
    $ui: resolve("../shared/ui/src"),
  },
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

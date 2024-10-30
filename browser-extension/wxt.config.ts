import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  manifest: {
    name: "pastbl",
  },
  runner: {
    chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
  },
});

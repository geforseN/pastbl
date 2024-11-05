import { defineConfig } from "vite";
import { WxtVitest } from "wxt/testing";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    WxtVitest(),
  ],
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    // "@unocss/nuxt",
    // "@onu-ui/nuxt",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    // "@tailvue/nuxt",
  ],
  // css: ["onu-ui/dist/style.css"],
});

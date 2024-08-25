export default defineNuxtConfig({
  i18n: {
    langDir: "lang",
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
      },
      {
        code: "ru",
        name: "Русский",
        file: "ru.json",
      },
    ],
  },
});

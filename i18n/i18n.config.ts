import type { ModuleOptions } from "@nuxtjs/i18n";

const baseUrl = typeof process.env.BASE_URL === "string"
  ? process.env.BASE_URL
  : "https://pastbl.vercel.app";

export const i18n = {
  langDir: "locales",
  baseUrl,
  locales: [
    {
      code: "en" as const,
      name: "English" as const,
      language: "en" as const,
      file: "en.json" as const,
    },
    {
      code: "ru" as const,
      name: "Русский" as const,
      language: "ru" as const,
      file: "ru.json" as const,
    },
  ],
} satisfies ModuleOptions;

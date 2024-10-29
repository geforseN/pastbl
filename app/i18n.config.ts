import { isDevelopment } from "std-env";
import type { ModuleOptions } from "@nuxtjs/i18n";

let baseUrl = isDevelopment ? "" : "https://pastbl.vercel.app";
if (typeof process.env.BASE_URL === "string") {
  baseUrl = process.env.BASE_URL;
}

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

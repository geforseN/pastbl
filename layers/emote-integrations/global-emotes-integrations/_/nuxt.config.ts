import { i18n } from "../../../../app/i18n.config";

export default defineNuxtConfig({
  imports: {
    dirs: ["utils/indexed-db", "utils/service"],
  },
  i18n
});

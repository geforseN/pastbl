import path from "node:path";
import url from "node:url";
import { i18n } from "../../app/i18n.config";
import { findNuxtLayers } from "../../server/utils/nuxt-config";

const currentDirectoryPath = path.dirname(url.fileURLToPath(import.meta.url));
const currentDirectoryLayersPath = path.join(currentDirectoryPath, "layers");

export default defineNuxtConfig({
  imports: {
    dirs: ["utils/service"],
  },
  i18n,
  extends: findNuxtLayers(currentDirectoryLayersPath),
});

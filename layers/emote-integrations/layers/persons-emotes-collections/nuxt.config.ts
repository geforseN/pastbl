import path from "path";
import url from "url";
import { findNuxtLayers } from "../../../../server/utils/nuxt-config";

const currentDirectoryPath = path.dirname(url.fileURLToPath(import.meta.url));
const currentDirectoryLayersPath = path.join(currentDirectoryPath, "layers");

export default defineNuxtConfig({
  extends: findNuxtLayers(currentDirectoryLayersPath),
});

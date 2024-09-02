import path from "node:path";
import url from "node:url";
import { findNuxtLayers } from "../../../../server/utils/nuxt-config";

const currentDirectoryPath = path.dirname(url.fileURLToPath(import.meta.url));
const currentDirectoryLayersPath = path.join(currentDirectoryPath, "layers");

export default defineNuxtConfig({
  extends: findNuxtLayers(currentDirectoryLayersPath),
  imports: {
    imports: [
      {
        from: path.join(currentDirectoryPath, "utils", "types"),
        name: `TPersonEmoteCollection`,
        type: true,
      },
    ],
  },
});

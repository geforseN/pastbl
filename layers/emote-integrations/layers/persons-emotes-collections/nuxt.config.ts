import path from "node:path";
import {
  findNuxtLayers,
  __dirname__,
} from "../../../../server/utils/nuxt-config";

const dirname = __dirname__(import.meta.url);
const layersDirname = path.join(dirname, "layers");

export default defineNuxtConfig({
  extends: findNuxtLayers(layersDirname),
  imports: {
    imports: [
      {
        from: path.join(dirname, "utils", "types"),
        name: `TPersonEmoteCollection`,
        type: true,
      },
    ],
  },
});

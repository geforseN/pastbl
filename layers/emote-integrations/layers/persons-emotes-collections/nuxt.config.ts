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
        from: path.join(dirname, "shared/types/namespace.ts"),
        name: "*",
        as: "TPersonEmoteCollection",
        type: true,
      },
    ],
    dirs: ["composables", "utils", "shared/*/index.ts"],
  },
  components: [
    {
      path: path.join(dirname, "components"),
    },
    {
      path: path.join(dirname, "components", "conditional"),
      pathPrefix: false,
    },
  ],
});

import path from "node:path";
import { findNuxtLayers, __dirname__ } from "../../server/utils/nuxt-config";

const dirname = __dirname__(import.meta.url);
const layersDirname = path.join(dirname, "layers");

export default defineNuxtConfig({
  alias: {
    "$global-emotes-integrations": path.join(
      layersDirname,
      "global-emotes-integrations",
    ),
    "$persons-emotes-collections": path.join(
      layersDirname,
      "persons-emotes-collections",
    ),
  },
  components: [
    {
      path: path.join(dirname, "components"),
    },
    {
      path: path.join(dirname, "components", "conditional-emote-integration"),
      pathPrefix: false,
    },
  ],
  imports: {
    imports: [
      {
        from: path.join(dirname, "shared/types.ts"),
        name: "*",
        as: "TEmoteIntegrations",
        type: true,
      },
    ],
    dirs: ["composables", "utils", "shared/abstract"],
  },
  extends: findNuxtLayers(layersDirname),
});

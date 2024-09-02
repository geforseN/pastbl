import url from "node:url";
import path from "node:path";
import { findNuxtLayers } from "../../server/utils/nuxt-config";

const currentDirectoryPath = path.dirname(url.fileURLToPath(import.meta.url));
const currentDirectoryLayersPath = path.join(currentDirectoryPath, "layers");

export default defineNuxtConfig({
  alias: {
    "$global-emotes-integrations": path.join(
      currentDirectoryLayersPath,
      "global-emotes-integrations",
    ),
    "$persons-emotes-collections": path.join(
      currentDirectoryLayersPath,
      "persons-emotes-collections",
    ),
  },
  components: [
    {
      path: path.join(currentDirectoryPath, "components"),
    },
    {
      path: path.join(
        currentDirectoryPath,
        "components",
        "conditional-emote-integration",
      ),
      pathPrefix: false,
    },
  ],
  imports: {
    imports: [
      {
        from: path.join(currentDirectoryPath, "utils", "types-dump"),
        name: "TEmoteIntegrations",
        type: true,
      },
    ],
  },
  extends: findNuxtLayers(currentDirectoryLayersPath),
});

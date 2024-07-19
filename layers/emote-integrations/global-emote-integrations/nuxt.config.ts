import url from "node:url";
import path from "node:path";

const currentDirectoryPath = path.dirname(url.fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  components: [
    {
      path: `${currentDirectoryPath}/components/global-emote-integration-main-block`,
      pathPrefix: false,
    },
  ],
});
  
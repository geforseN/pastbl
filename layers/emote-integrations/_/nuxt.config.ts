import url from "node:url";
import path from "node:path";

const currentDirectoryPath = path.dirname(url.fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  components: [
    {
      path: `${currentDirectoryPath}/components`,
    },
    {
      path: `${currentDirectoryPath}/components/conditional-emote-integration`,
      pathPrefix: false,
    },
  ],
});

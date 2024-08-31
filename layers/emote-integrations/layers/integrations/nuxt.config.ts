import { flatGroupBy } from "../../../../app/utils/object";
import { allEmoteSources } from "../emote-sources/utils/external";
import { toLowerCase } from "../../../../app/utils/string";
import path from "node:path";
import url from "node:url";

const currentDirectoryPath = path.dirname(url.fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  alias: {
    ...flatGroupBy(
      [...allEmoteSources].map(toLowerCase),
      (source) => `#t_${source}`,
      (source) =>
        path.join(currentDirectoryPath, `${source}/server/utils/types`),
    ),
    ...flatGroupBy(
      [...allEmoteSources].map(toLowerCase),
      (source) => `#integrations_${source}`,
      (source) =>
        path.join(currentDirectoryPath, `${source}/server/utils`),
    ),
  },
  extends: allEmoteSources.map(toLowerCase),
});

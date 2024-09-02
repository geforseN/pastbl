import { flatGroupBy } from "../../../../app/utils/object";
import { allEmoteSources } from "../emote-sources/utils/external";
import { toLowerCase } from "../../../../app/utils/string";
import path from "node:path";
import url from "node:url";

const currentDirectoryPath = path.dirname(url.fileURLToPath(import.meta.url));

const allEmoteSources_ = [...allEmoteSources];
const allLowercaseEmoteSources = allEmoteSources_.map(toLowerCase);

export default defineNuxtConfig({
  alias: {
    ...flatGroupBy(
      allLowercaseEmoteSources,
      (source) => `#t_${source}`,
      (source) =>
        path.join(currentDirectoryPath, `${source}/server/utils/types`),
    ),
    ...flatGroupBy(
      allLowercaseEmoteSources,
      (source) => `#integrations_${source}`,
      (source) => path.join(currentDirectoryPath, `${source}/server/utils`),
    ),
  },
  extends: allLowercaseEmoteSources,
  imports: {
    imports: [
      ...allEmoteSources_.map((source) => ({
        from: `#t_${toLowerCase(source)}`,
        name: `T${source}`,
        type: true,
      })),
      ...allEmoteSources_.map((source) => ({
        from: `#integrations_${toLowerCase(source)}`,
        name: `${source}Api`,
        type: true,
      })),
    ],
  },
});

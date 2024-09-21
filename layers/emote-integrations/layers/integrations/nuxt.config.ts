import { __dirname__ } from "../../../../server/utils/nuxt-config";
import { flatGroupBy } from "../../../../app/utils/object";
import { allEmoteSources } from "../emote-sources/utils/external";
import { toLowerCase } from "../../../../app/utils/string";
import path from "node:path";

const dirname = __dirname__(import.meta.url);
const allEmoteSources_ = [...allEmoteSources];
const allLowercaseEmoteSources = allEmoteSources_.map(toLowerCase);

export default defineNuxtConfig({
  alias: {
    ...flatGroupBy(
      allLowercaseEmoteSources,
      (source) => `#t_${source}`,
      (source) => path.join(dirname, `${source}/shared/types`),
    ),
  },
  extends: allLowercaseEmoteSources,
  imports: {
    imports: allEmoteSources_.map((source) => ({
      from: `#t_${toLowerCase(source)}`,
      name: `*`,
      as: `T${source}`,
      type: true,
    })),
  },
});

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
      (source) => path.join(dirname, `${source}/server/utils/types`),
    ),
    ...flatGroupBy(
      allLowercaseEmoteSources,
      (source) => `#integrations_${source}`,
      (source) => path.join(dirname, `${source}/server/utils`),
    ),
  },
  extends: allLowercaseEmoteSources,
  imports: {
    imports: [
      ...allEmoteSources_
        .filter((source) => source !== "BetterTTV" && source !== 'FrankerFaceZ' && source !== 'SevenTV')
        .map((source) => ({
          from: `#t_${toLowerCase(source)}`,
          name: `T${source}`,
          type: true,
        })),
      ...allEmoteSources_.map((source) => ({
        from: `#integrations_${toLowerCase(source)}`,
        name: `${source}Api`,
        type: true,
      })),
      {
        from: "#t_betterttv",
        name: "*",
        as: "TBetterTTV",
        type: true,
      },
      {
        from: "#t_frankerfacez",
        name: "*",
        as: "TFrankerFaceZ",
        type: true,
      },
      {
        from: "#t_seventv",
        name: "*",
        as: "TSevenTV",
        type: true,
      },
    ],
  },
});

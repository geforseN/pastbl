import { allEmoteSources } from "../emote-sources/utils/external.ts";
import { toLowerCase } from "../../../../app/utils/string.ts";
import { i18n } from "../../../../app/i18n.config.ts";

export default defineNuxtConfig({
  extends: allEmoteSources.map(toLowerCase).map((source) => "layers/" + source),
  imports: {
    dirs: ["utils/indexed-db", "utils/service"],
  },
  i18n,
});

import { allEmoteSources } from "../emote-sources/utils/external";
import { toLowerCase } from "../../../../app/utils/string";
import { i18n } from "../../../../app/i18n.config";

export default defineNuxtConfig({
  extends: allEmoteSources.map(toLowerCase).map((source) => "layers/" + source),
  imports: {
    dirs: ["utils/indexed-db", "utils/service"],
  },
  i18n,
});

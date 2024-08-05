import { allEmoteSources } from "../emote-sources/utils/external";
import { toLowerCase } from "../../../app/utils/string";

export default defineNuxtConfig({
  extends: ["_", ...allEmoteSources.map(toLowerCase)],
});

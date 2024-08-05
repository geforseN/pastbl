import { toLowerCase } from "../../../../app/utils/string";
import { allEmoteSources } from "../../emote-sources/utils/external.js";

export default defineNuxtConfig({
  extends: ["_", ...allEmoteSources.map(toLowerCase)],
});

import { allEmoteSources } from "../emote-sources/utils/external";
import { toLowerCase } from "../../../app/utils/string";

export default defineNuxtConfig({
  extends: allEmoteSources.map(toLowerCase),
});

import { toLowerCase } from "../../../../../../app/utils/string.ts";
import { allEmoteSources } from "../../../emote-sources/utils/external.ts";

export default defineNuxtConfig({
  extends: allEmoteSources.map(toLowerCase).map((source) => "layers/" + source),
});

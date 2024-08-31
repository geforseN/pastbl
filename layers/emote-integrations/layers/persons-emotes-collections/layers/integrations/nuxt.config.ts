import { toLowerCase } from "../../../../../../app/utils/string";
import { allEmoteSources } from "../../../emote-sources/utils/external";

export default defineNuxtConfig({
  extends: allEmoteSources.map(toLowerCase).map((source) => "layers/" + source),
});

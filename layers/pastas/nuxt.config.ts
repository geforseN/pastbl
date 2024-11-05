import { i18n } from "../../i18n/i18n.config.ts";
import {
  __layersDirname__,
  findNuxtLayers,
} from "../../server/utils/nuxt-config";

const layersDirname = __layersDirname__(import.meta.url);

export default defineNuxtConfig({
  extends: findNuxtLayers(layersDirname),
  imports: {
    dirs: ["utils/service"],
  },
  i18n,
});

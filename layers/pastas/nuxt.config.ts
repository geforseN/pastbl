import { i18n } from "../../app/i18n.config";
import {
  __layersDirname__,
  findNuxtLayers,
} from "../../server/utils/nuxt-config";

const layersDirname = __layersDirname__(import.meta.url);

export default defineNuxtConfig({
  imports: {
    dirs: ["utils/service"],
  },
  i18n,
  extends: findNuxtLayers(layersDirname),
});

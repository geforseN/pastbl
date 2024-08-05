import type { TSevenTV } from "~~/layers/emote-integrations/integrations/seventv/server/utils/types";

export const makeSevenTVGlobalSet = defineSevenTVEmoteSetMaker("global");

export const makeSevenTVGlobalIntegration =
  defineGlobalIntegrationMaker<TSevenTV.Global.ReadyIntegration>("SevenTV");
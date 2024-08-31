import type { TSevenTV } from "#t_seventv";

export const makeSevenTVGlobalSet = defineSevenTVEmoteSetMaker("global");

export const makeSevenTVGlobalIntegration =
  defineGlobalIntegrationMaker<TSevenTV.Global.ReadyIntegration>("SevenTV");

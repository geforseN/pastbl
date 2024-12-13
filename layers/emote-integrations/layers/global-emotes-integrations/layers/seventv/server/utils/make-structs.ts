import { ReadyIntegration } from "../../../../../../shared/abstract/types";
import type * as TSevenTV from "#t_seventv";

export const makeSevenTVGlobalSet = defineSevenTVEmoteSetMaker("global");

export const makeSevenTVGlobalIntegration
  = defineGlobalIntegrationMaker<TSevenTV.Global.ReadyIntegration>("SevenTV");

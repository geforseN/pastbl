import type * as TEmoteIntegrations from "../../../../shared/types";
import type * as TFrankerFaceZ from "#t_frankerfacez";

export type Emote = TFrankerFaceZ.GlobalEmote;

export type Set = TFrankerFaceZ.GlobalEmoteSet;

export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
  sets: Set[];
  source: "FrankerFaceZ";
}

export interface FailedIntegration extends TEmoteIntegrations.Global.Failed {
  source: "FrankerFaceZ";
}

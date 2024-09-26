export type Emote = TFrankerFaceZ.GlobalEmote;

export type Set = TFrankerFaceZ.GlobalEmoteSet;

export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
  sets: GlobalEmoteSet[];
  source: "FrankerFaceZ";
}

export interface FailedIntegration extends TEmoteIntegrations.Global.Failed {
  source: "FrankerFaceZ";
}

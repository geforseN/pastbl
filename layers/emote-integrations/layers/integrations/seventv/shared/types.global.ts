export type Emote = TSevenTV.GlobalEmote;

export type Set = IEmoteSet<Emote>;

export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
  sets: Set[];
  source: "SevenTV";
}

export interface FailedIntegration extends TEmoteIntegrations.Global.Failed {
  source: "SevenTV";
}

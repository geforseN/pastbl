export type Emote = GlobalEmote;

export interface Set extends IEmoteSet<Emote> {
  emotes: Emote[];
}

export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
  sets: Set[];
  source: "Twitch";
}

export interface FailedIntegration extends TEmoteIntegrations.Global.Failed {
  source: "Twitch";
}

export type SettledIntegration = ReadyIntegration | FailedIntegration;

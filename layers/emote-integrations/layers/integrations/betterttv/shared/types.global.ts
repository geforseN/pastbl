import type * as TEmoteIntegrations from "../../../../shared/types";
import type { IEmoteSet } from "../../../../shared/abstract/types";
import type * as TBetterTTV from "#t_betterttv";

export type Emote = TBetterTTV.GlobalEmote | TBetterTTV.SharedEmote;

export type Set = IEmoteSet<Emote>;

export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
  sets: Set[];
}

export interface FailedIntegration extends TEmoteIntegrations.Global.Failed {
  source: "BetterTTV";
}

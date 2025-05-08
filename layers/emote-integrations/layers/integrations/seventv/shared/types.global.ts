import type * as TEmoteIntegrations from "../../../../shared/types";
import type { IEmoteSet } from "../../../../shared/abstract/types";
import type * as TSevenTV from "#t_seventv";

export type Emote = TSevenTV.GlobalEmote;

export type Set = IEmoteSet<Emote>;

export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
  sets: Set[];
  source: "SevenTV";
}

export interface FailedIntegration extends TEmoteIntegrations.Global.Failed {
  source: "SevenTV";
}

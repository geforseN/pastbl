import type { IEmote } from "~/integrations/abstract/Emote";
import type { IEmoteSet } from "~/integrations/abstract/EmoteSet";
import type { IEmoteIntegration } from "~/integrations/abstract/EmoteIntegration";

export interface ISevenTVEmote extends IEmote {
  // source: "SevenTV";
  // type: "global" | "channel";
}

export interface ISevenTVGlobalEmote extends ISevenTVEmote {
  // type: "global";
}

export interface ISevenTVChannelEmote extends ISevenTVEmote {
  // type: "channel";
}

export interface ISevenTVEmoteSet extends IEmoteSet<ISevenTVEmote> {
  emotes: ISevenTVEmote[];
}

export interface ISevenTVPersonEmoteSet extends ISevenTVEmoteSet {
  emotes: ISevenTVChannelEmote[];
}

export interface ISevenTVGlobalEmoteSet extends ISevenTVEmoteSet {
  emotes: ISevenTVGlobalEmote[];
}

export interface ISevenTVEmoteIntegration
  extends IEmoteIntegration<ISevenTVEmoteSet> {}

export interface ISevenTVPersonIntegration extends ISevenTVEmoteIntegration {
  sets: ISevenTVPersonEmoteSet[];
}

export interface ISevenTVGlobalIntegration extends ISevenTVEmoteIntegration {
  sets: ISevenTVGlobalEmoteSet[];
}

declare module ISevenTV {
  export type PersonIntegration = ISevenTVPersonIntegration;

  export type GlobalIntegration = ISevenTVGlobalIntegration;
}

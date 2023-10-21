import type { BetterTTVEmote } from "./BetterTTV";
import { BetterTTVEmoteString } from "./BetterTTV";
import type { FrankerFaceZEmote } from "./FrankerFaceZ/FrankerFaceZ.client";
import { sevenTV } from "./SevenTV";

export const templateStrings = {
  BetterTTV: BetterTTVEmoteString,
  SevenTV: sevenTV.getEmoteTemplateString,
  default: (emote: Emote) =>
    `<span class="inline-block" title="${emote.token} emote"><img src="https:${emote.url}/1x.webp"></span>`,
};

export type Emote = BetterTTVEmote | SevenTvEmote | FrankerFaceZEmote;

type EmoteName = string;
export type EmoteMap = Map<EmoteName, Emote>;

export {
  getBttvEmoteCollectionByUserId,
  getBttvGlobalEmoteCollection,
} from "./BetterTTV";

export interface EmoteSet<EmoteT extends BaseEmote = BaseEmote> {
  // NOTE: FFZ api returns set with typeof id === 'number', but in collection implementation id converted to string
  id: string;
  name: string;
  emotes: EmoteT[];
  source: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
  updatedAt: ReturnType<(typeof Date)["now"]>;
  // TODO add property => version: number
}

export interface BaseEmote {
  // NOTE: FFZ api returns emotes with typeof id === 'number', but in emote implementation id converted to string
  id: string;
  url: string;
  token: string;
  isAnimated: boolean;
  isModifier: boolean;
  // NOTE: FFZ use term 'Hidden', SevenTV uses 'isZeroWidth' instead
  isZeroWidth: boolean;
  isListed: boolean;
  source: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
}

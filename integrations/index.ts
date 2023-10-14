import type { BetterTTVEmote } from "./BetterTTV";
// import type { SevenTvEmote } from "./SevenTV";

import { BetterTTVEmoteString } from "./BetterTTV";
import { sevenTV } from "./SevenTV";

export const templateStrings = {
  BetterTTV: BetterTTVEmoteString,
  SevenTV: sevenTV.getEmoteTemplateString,
  default: (emote: Emote) =>
    `<span class="inline-block" title="${emote.token} emote"><img src="https:${emote.url}/1x.webp"></span>`,
};

export type Emote = BetterTTVEmote; // TODO uncomment // | SevenTvEmote;

type EmoteName = string;
export type EmoteMap = Map<EmoteName, Emote>;

export {
  getBttvEmoteCollectionByUserId,
  getBttvGlobalEmoteCollection,
} from "./BetterTTV";

export interface EmoteCollection {
  emotes: BaseEmote[];
  source: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
  updatedAt: ReturnType<(typeof Date)["now"]>;
  // TODO add property => version: number
}

export interface BaseEmote {
  id: string;
  url: string;
  token: string;
  isAnimated: boolean;
  isModifier: boolean;
  isZeroWidth: boolean;
  isListed: boolean;
  source: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
}

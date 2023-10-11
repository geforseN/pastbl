import { BetterTTVEmoteString } from "./BetterTTV";
import { sevenTV } from "./SevenTV";
import type { BetterTTVEmote } from "./BetterTTV/BetterTTV.client";
import type { SevenTvEmote } from "./SevenTV/SevenTV.types";

export const templateStrings = {
  BetterTTV: BetterTTVEmoteString,
  SevenTV: sevenTV.getEmoteTemplateString,
  default: (emote: Emote) =>
    `<span class="inline-block" title="${emote.chatName} emote"><img src="https:${emote.url}/1x.webp"></span>`,
};

export type Emote = SevenTvEmote | BetterTTVEmote;

type EmoteName = string;
export type EmoteMap = Map<EmoteName, Emote>;

export {
  getBttvEmoteCollectionByUserId,
  getBttvGlobalEmoteCollection,
} from "./BetterTTV";

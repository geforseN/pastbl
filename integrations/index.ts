import { BTTVEmoteString } from "./BetterTTV";
import { SevenTVEmoteString } from "./SevenTV";

// FIXME: add template string for FrankerFaceZ
export const templateStrings = {
  BetterTTV: BTTVEmoteString,
  SevenTV: SevenTVEmoteString,
  default: (emote: Emote) =>
    `<span class="inline-block" title="${emote.token} emote"><img src="https:${emote.url}/1x.webp"></span>`,
};

export interface EmoteSet<EmoteT extends Emote = Emote> {
  emotes: EmoteT[];
  // NOTE: FFZ api returns set with typeof id === 'number', but in collection instance id converted to string
  id: string;
  name: string;
  source: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
  updatedAt: ReturnType<(typeof Date)["now"]>;
}

export interface Emote {
  // NOTE: FFZ api returns emotes with typeof id === 'number', but in emote instance id converted to string
  id: string;
  isAnimated: boolean;
  isListed: boolean;
  isModifier: boolean;
  // NOTE: FFZ use term 'Hidden', SevenTV uses 'isZeroWidth'
  isWrapper: boolean;
  source: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
  token: string;
  url: string;
}

export interface EmoteCollection<EmoteSetT extends EmoteSet = EmoteSet> {
  name: string;
  sets: EmoteSetT[];
  source: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
  updatedAt: ReturnType<(typeof Date)["now"]>;
}

type EmoteName = string;
export type EmoteMap = Map<EmoteName, Emote>;

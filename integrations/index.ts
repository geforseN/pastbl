import { BTTVEmoteString } from "./BetterTTV/index";
import { SevenTVEmoteString } from "./SevenTV/index";
import { FFZEmoteString } from "./FrankerFaceZ/index";
import type { ConditionalExpression } from "typescript";

export const templateStrings = {
  BetterTTV: BTTVEmoteString,
  SevenTV: SevenTVEmoteString,
  FFZ: FFZEmoteString,
};

export interface EmoteSet<EmoteT extends Emote = Emote> {
  emotes: EmoteT[];
  // NOTE: FFZ api returns set with typeof id === 'number', but in collection instance id converted to string
  // NOTE -
  // BTTV api does not have term 'set'
  // BTTV api return record with 'channelEmotes' and 'sharedEmotes'
  // BTTV api return array of emotes for global bttv emotes
  // for global bttv 'set' id 'bttv::global' is used
  // for user 'set' id twitch nickname is used
  id: string;
  // NOTE - BTTV doesn't have term 'name'
  // BTTV set can be named only as 'Channel emotes' or as 'Global emotes'
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

export {
  createFFZGlobalCollection,
  createFFZUserCollection,
} from "./FrankerFaceZ/index";

export {
  createBTTVGlobalCollection,
  createBTTVUserCollection,
} from "./BetterTTV/index";

export {
  create7TVUserChannelSet,
  create7TVUserCollection,
  create7TVGlobalCollection,
} from "./SevenTV/index";

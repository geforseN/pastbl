import { BTTVEmoteString, createBTTVGlobalCollection } from "./BetterTTV/index";
import { SevenTVEmoteString, create7TVGlobalCollection } from "./SevenTV/index";
import {
  FFZEmoteString,
  createFFZGlobalCollection,
} from "./FrankerFaceZ/index";
import { getFFZGlobalEmoteSets } from "./FrankerFaceZ/FrankerFaceZ.api";
import { getBetterTTVGlobalEmotes } from "./BetterTTV/BetterTTV.api";
import { get7TVGlobalEmotesSet } from "./SevenTV/SevenTV.api";

export const templateStrings = {
  BetterTTV: BTTVEmoteString,
  SevenTV: SevenTVEmoteString,
  FrankerFaceZ: FFZEmoteString,
};

export type EmoteSource = "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
export const availableEmoteSources = [
  "FrankerFaceZ",
  "SevenTV",
  "BetterTTV",
] as const;
export type AvailableEmoteSources = (typeof availableEmoteSources)[number];

export interface IEmote {
  // NOTE: FFZ api returns emotes with typeof id === 'number', but in emote instance id converted to string
  id: string;
  isAnimated: boolean;
  isListed: boolean;
  isModifier: boolean;
  // NOTE: FFZ use term 'Hidden', SevenTV uses 'isZeroWidth'
  isWrapper: boolean;
  source: EmoteSource;
  token: string;
  url: string;
}

export interface IEmoteSet<EmoteT extends IEmote = IEmote> {
  emotes: EmoteT[];
  isActive: boolean;
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
  source: EmoteSource;
  updatedAt: ReturnType<(typeof Date)["now"]>;
}

export interface IEmoteCollectionOwner {}

export interface IGlobalEmoteCollection<
  SourceT extends EmoteSource = EmoteSource,
  SetT extends IEmoteSet = IEmoteSet,
> {
  name: `${SourceT} Global Emotes Collection`;
  sets: SetT[];
  source: SourceT;
  updatedAt: ReturnType<(typeof Date)["now"]>;
  isActive: boolean;
}

export const globalEmotesGetters: Record<
  AvailableEmoteSources,
  () => Promise<IGlobalEmoteCollection>
> = {
  FrankerFaceZ: async () => {
    const globalEmotes = await getFFZGlobalEmoteSets();
    return createFFZGlobalCollection(globalEmotes);
  },
  BetterTTV: async () => {
    const globalEmotes = await getBetterTTVGlobalEmotes();
    return createBTTVGlobalCollection(globalEmotes);
  },
  SevenTV: async () => {
    const globalEmotes = await get7TVGlobalEmotesSet();
    return create7TVGlobalCollection(globalEmotes);
  },
};

export interface IEmoteCollection<
  SourceT extends EmoteSource = EmoteSource,
  SetT extends IEmoteSet = IEmoteSet,
> {
  name: string;
  sets: SetT[];
  source: SourceT;
  updatedAt: ReturnType<(typeof Date)["now"]>;
  owner: IEmoteCollectionOwner;
}

export type EmoteCollectionsRecord =
  | Record<AvailableEmoteSources, IEmoteCollection<AvailableEmoteSources>>
  | Record<AvailableEmoteSources, never>;

export interface IUserEmoteCollection {
  twitch: {
    nickname: string;
    id: number;
    username: Lowercase<IUserEmoteCollection["twitch"]["nickname"]>;
  };
  updatedAt: number;
  collections: EmoteCollectionsRecord;
  failedCollectionsReasons:
    | Record<AvailableEmoteSources, string>
    | Record<string, never>;
}

type EmoteName = string;
export type EmoteMap = Map<EmoteName, IEmote>;

export {
  createFFZGlobalCollection,
  createFFZUserCollection,
  createFFZUserSets,
  createFFZPartialUserCollection,
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

import {
  FFZEmoteString,
  createFFZGlobalCollection,
  type FrankerFaceZGlobalCollection,
  type FrankerFaceZUserIntegration,
} from "./FrankerFaceZ/index";
import {
  BTTVEmoteString,
  createBTTVGlobalCollection,
  type BetterTTVGlobalCollection,
  type BetterTTVUserIntegration,
} from "./BetterTTV/index";
import {
  SevenTVEmoteString,
  create7TVGlobalCollection,
  type I7TVGlobalCollection,
  type I7TVUserCollection,
} from "./SevenTV/index";
import { getFFZGlobalEmoteSets } from "./FrankerFaceZ/FrankerFaceZ.api";
import { getBetterTTVGlobalEmotes } from "./BetterTTV/BetterTTV.api";
import { get7TVGlobalEmotesSet } from "./SevenTV/SevenTV.api";

export const templateStrings = {
  BetterTTV: BTTVEmoteString,
  SevenTV: SevenTVEmoteString,
  FrankerFaceZ: FFZEmoteString,
};

export const availableEmoteSources = [
  "FrankerFaceZ",
  "SevenTV",
  "BetterTTV",
] as const;
export type AvailableEmoteSource = (typeof availableEmoteSources)[number];

export interface IEmote {
  // NOTE: FFZ api returns emotes with typeof id === 'number', but in emote instance id converted to string
  id: string;
  isAnimated: boolean;
  isListed: boolean;
  isModifier: boolean;
  // NOTE: FFZ use term 'Hidden', SevenTV uses 'isZeroWidth'
  isWrapper: boolean;
  source: AvailableEmoteSource;
  token: string;
  url: string;
}

export interface IEmoteSet<
  SourceT extends AvailableEmoteSource,
  EmoteT extends IEmote,
> {
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
  source: SourceT;
  updatedAt: number;
}

export interface IEmoteCollectionOwner {}

export interface InternalGlobalEmoteCollection<
  SourceT extends AvailableEmoteSource,
  SetT extends IEmoteSet,
> {
  name: `${SourceT} Global Emotes Collection`;
  sets: SetT[];
  source: SourceT;
  updatedAt: ReturnType<(typeof Date)["now"]>;
}

export type IGlobalEmoteCollection =
  | FrankerFaceZGlobalCollection
  | BetterTTVGlobalCollection
  | I7TVGlobalCollection;

const globalEmotesGetters = {
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

export function getGlobalCollection(source: keyof typeof globalEmotesGetters) {
  return globalEmotesGetters[source]();
}

export interface InternalUserEmoteIntegration<
  SourceT extends AvailableEmoteSource,
  SetT extends IEmoteSet,
  OwnerT extends IEmoteCollectionOwner,
> {
  name: string;
  owner: OwnerT;
  sets: SetT[];
  source: SourceT;
  updatedAt: number;
}

export type IUserEmoteIntegrationRecord = {
  FrankerFaceZ: FrankerFaceZUserIntegration;
  BetterTTV: BetterTTVUserIntegration;
  SevenTV: I7TVUserCollection;
};

export type IUserEmoteIntegration =
  IUserEmoteIntegrationRecord[keyof IUserEmoteIntegrationRecord];

export interface IUserEmoteCollection {
  twitch: {
    id: number;
    nickname: string;
    username: Lowercase<IUserEmoteCollection["twitch"]["nickname"]>;
  };
  updatedAt: number;
  integrations: Partial<IUserEmoteIntegrationRecord>;
  failedIntegrationsReasons: Partial<
    Record<keyof IUserEmoteIntegrationRecord, Error>
  >;
}

export {
  createFFZGlobalCollection,
  createFFZUserIntegration,
  createFFZUserSets,
  createFFZPartialUserIntegration,
  type FrankerFaceZSet,
  type FrankerFaceZEmote,
  type FrankerFaceZUserIntegration,
} from "./FrankerFaceZ/index";

export {
  createBTTVGlobalCollection,
  createBTTVUserIntegration,
  type BetterTTVSet,
  type BetterTTVEmote,
  type BetterTTVUserIntegration,
} from "./BetterTTV/index";

export {
  create7TVUserChannelSet,
  create7TVUserIntegration,
  create7TVGlobalCollection,
  recreate7TVUserIntegration,
  type I7TVUserCollection,
  type I7TVSet,
  type I7TVEmote,
} from "./SevenTV/index";

export async function populateUserEmoteIntegration<
  T extends IUserEmoteIntegration,
>(
  idbCollection: import("~/client-only/IndexedDB").IndexedDBUserEmoteIntegration,
  loadEmoteFromIdb: (idbEmoteId: IEmote["id"]) => Promise<IEmote | undefined>,
): Promise<T> {
  const sets = await Promise.all(
    idbCollection.sets.map(async (idbSet) => {
      const { emoteIds, ...set } = idbSet;
      const [emotes] = await tupleSettledPromises(
        emoteIds.map(loadEmoteFromIdb),
      );
      return {
        ...set,
        emotes: emotes.filter(isNotNullish),
      };
    }),
  );
  return {
    ...idbCollection,
    sets,
  };
}

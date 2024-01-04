import {
  FFZEmoteString,
  createFFZGlobalCollection,
  type FrankerFaceZGlobalCollection,
  type FrankerFaceZUserIntegration,
  type FrankerFaceZEmote,
} from "./FrankerFaceZ/index";
import {
  BTTVEmoteString,
  createBTTVGlobalCollection,
  type BetterTTVGlobalCollection,
  type BetterTTVUserIntegration,
  type BetterTTVEmote,
} from "./BetterTTV/index";
import {
  SevenTVEmoteString,
  create7TVGlobalCollection,
  type I7TVGlobalCollection,
  type I7TVUserCollection,
  type I7TVEmote,
} from "./SevenTV/index";
import { getFFZGlobalEmoteSets } from "./FrankerFaceZ/FrankerFaceZ.api";
import { getBetterTTVGlobalEmotes } from "./BetterTTV/BetterTTV.api";
import { get7TVGlobalEmotesSet } from "./SevenTV/SevenTV.api";
import { TwitchEmoteString, type ITwitchGlobalCollection } from "./Twitch";

export const availableEmoteSources = [
  "FrankerFaceZ",
  "SevenTV",
  "BetterTTV",
] as const;
export type AvailableEmoteSource = (typeof availableEmoteSources)[number];

export const emoteSources = [...availableEmoteSources, "Twitch"] as const;
export type EmoteSource = (typeof emoteSources)[number];

export interface IEmote {
  id: string;
  isAnimated: boolean;
  isListed: boolean;
  isModifier: boolean;
  isWrapper: boolean;
  source: EmoteSource;
  token: string;
  url: string;
}

export type EmoteOf = {
  BetterTTV: BetterTTVEmote;
  SevenTV: I7TVEmote;
  FrankerFaceZ: FrankerFaceZEmote;
};
type EmoteT = EmoteOf[keyof EmoteOf];

const templateStrings = {
  BetterTTV: BTTVEmoteString,
  SevenTV: SevenTVEmoteString,
  FrankerFaceZ: FFZEmoteString,
  Twitch: TwitchEmoteString,
};

export function makeEmoteAsString(emote: IEmote) {
  return templateStrings[emote.source](emote);
}

// TODO: maybe use new DOMParser().parseFromString() later
// but better if JSX or DOM is used (instead of template string)
export function makeEmoteAsStringWithModifiersWrapper(
  emote: IEmote,
  modifierEmotes: IEmote[],
) {
  const emoteAsString = makeEmoteAsString(emote);
  // TODO: add emoteTemplates.modifiers Record<EmoteSource, string>
  // must use "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
  const modifiersAsString = modifierEmotes
    .map(
      (emote) =>
        // TODO: do not reuse makeEmoteAsString here, need to use create another func, which returns not wrapped in span|div string
        // because of makeEmoteAsString modifier emotes are smaller than they should be, MUST create new func
        `<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">${makeEmoteAsString(
          emote,
        )}</span>`,
    )
    .join(" ");
  return `<figure style="display: inline-block; position: relative;">${emoteAsString}${modifiersAsString}</figure>`;
}

export interface IEmoteSet<SourceT extends EmoteSource, EmoteT extends IEmote> {
  emotes: EmoteT[];
  id: string;
  name: string;
  source: SourceT;
  updatedAt: number;
}

export interface IEmoteCollectionOwner {}

export interface InternalGlobalEmoteCollection<
  SourceT extends EmoteSource,
  SetT extends IEmoteSet<SourceT, EmoteOf[SourceT]>,
> {
  name: `${SourceT} Global Emotes Collection`;
  sets: SetT[];
  source: SourceT;
  updatedAt: ReturnType<(typeof Date)["now"]>;
}

export type IGlobalEmoteCollection =
  | FrankerFaceZGlobalCollection
  | BetterTTVGlobalCollection
  | I7TVGlobalCollection
  | ITwitchGlobalCollection;

export type IGlobalEmoteCollectionRecord = {
  FrankerFaceZ: FrankerFaceZGlobalCollection;
  BetterTTV: BetterTTVGlobalCollection;
  SevenTV: I7TVGlobalCollection;
  Twitch: ITwitchGlobalCollection;
};

export function getMissingSources(
  state: Partial<Record<EmoteSource, unknown>>,
) {
  return emoteSources.filter((source) => !state[source]);
}

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
  Twitch: (): Promise<ITwitchGlobalCollection> =>
    $fetch("/api/twitch/chat/emotes/global"),
};

export function getGlobalCollection(source: keyof typeof globalEmotesGetters) {
  return globalEmotesGetters[source]();
}

export interface InternalUserEmoteIntegration<
  SourceT extends AvailableEmoteSource,
  SetT extends IEmoteSet<SourceT, EmoteOf[SourceT]>,
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

type AnotherIUserEmoteCollection = {
  user: {
    twitch: {
      id: number;
      nickname: string;
      username: Lowercase<IUserEmoteCollection["twitch"]["nickname"]>;
    };
  };
  updatedAt: number;
  integrations: {
    FrankerFaceZ?: FrankerFaceZUserIntegration | { failReason: Error };
    BetterTTV?: BetterTTVUserIntegration | { failReason: Error };
    SevenTV?: I7TVUserCollection | { failReason: Error };
  };
};

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

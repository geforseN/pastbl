import {
  type FrankerFaceZGlobalCollection,
  type FrankerFaceZUserIntegration,
  type FrankerFaceZEmote,
} from "./FrankerFaceZ/index";
import {
  type BetterTTVGlobalCollection,
  type BetterTTVUserIntegration,
  type IBetterTTVEmote,
} from "./BetterTTV/index";
import {
  SevenTVWrappedEmoteString,
  type I7TVGlobalCollection,
  type ISevenTVUserIntegration,
  type I7TVEmote,
} from "./SevenTV/index";
import {
  type ITwitchGlobalCollection,
  type ITwitchUserIntegration,
  type ITwitchEmote,
} from "./Twitch";
import type { TwitchUser } from "~/server/api/twitch/users/[login].get";

export const availableEmoteSources = [
  "FrankerFaceZ",
  "SevenTV",
  "BetterTTV",
] as const;
export type AvailableEmoteSource = (typeof availableEmoteSources)[number];

export const emoteSources = [...availableEmoteSources, "Twitch"] as const;
export type EmoteSource = (typeof emoteSources)[number];

const emoteSourcesSet = new Set<EmoteSource>([...emoteSources]);
export function isValidEmoteSource(
  maybeSource: string,
): maybeSource is EmoteSource {
  return emoteSourcesSet.has(maybeSource as EmoteSource);
}

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
  BetterTTV: IBetterTTVEmote;
  SevenTV: I7TVEmote;
  FrankerFaceZ: FrankerFaceZEmote;
  Twitch: ITwitchEmote;
};
export type EmoteT = EmoteOf[keyof EmoteOf];

const emoteTemplateStrings = {
  wrapped: {
    SevenTV: SevenTVWrappedEmoteString,
  },
};

export function makeWrappedEmoteAsString(emote: EmoteT) {
  const templateString = emoteTemplateStrings.wrapped[emote.source];
  if (templateString) {
    return templateString(emote);
  }
  return `<span class="inline-block">${makeEmoteAsString(emote)}</span>`;
}

function makeEmoteAsString(
  emote: IEmote,
  getAlt = (emote: IEmote) => emote.token,
) {
  const width = "width" in emote ? emote.width : "";
  const height = "height" in emote ? emote.height : "";
  return `<img class="emote" src="${emote.url}" alt="${getAlt(emote)}" loading="lazy" width="${width} height="${height}">`;
}

function makeModifierEmoteAsString(modifierEmote: IEmote) {
  const style =
    "pointer-events: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)";
  return `<span data-emote-modifier data-token="${modifierEmote.token}" style="${style}">${makeEmoteAsString(modifierEmote, (emote) => " " + emote.token)}</span>`;
}

export function makeEmoteAsStringWithModifiersWrapper(
  emote: IEmote,
  modifierEmotes: IEmote[],
) {
  const emoteAsString = makeWrappedEmoteAsString(emote);
  const modifiersAsString = modifierEmotes
    .map(makeModifierEmoteAsString)
    .join(" ");
  return `<figure data-emote-wrapper style="display: inline-block; position: relative;">${emoteAsString}${modifiersAsString}</figure>`;
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

export interface InternalGenericUserEmoteIntegration<
  SourceT extends EmoteSource,
  OwnerT extends IEmoteCollectionOwner,
> {
  name: string;
  owner: OwnerT;
  source: SourceT;
  updatedAt: number;
}

export interface InternalUserEmoteIntegration<
  SourceT extends EmoteSource,
  SetT extends IEmoteSet<SourceT, EmoteOf[SourceT]>,
  OwnerT extends IEmoteCollectionOwner,
> extends InternalGenericUserEmoteIntegration<SourceT, OwnerT> {
  sets: SetT[];
}

export type IUserEmoteIntegrationRecord = {
  FrankerFaceZ: FrankerFaceZUserIntegration;
  BetterTTV: BetterTTVUserIntegration;
  SevenTV: ISevenTVUserIntegration;
  Twitch: ITwitchUserIntegration;
};

export type IUserEmoteIntegration =
  IUserEmoteIntegrationRecord[keyof IUserEmoteIntegrationRecord];

export type IUserEmoteIntegrationSetRecord = {
  [k in EmoteSource]: IUserEmoteIntegrationRecord[k]["sets"][number] &
    IGlobalEmoteCollectionRecord[k]["sets"][number];
};

export type IEmoteSetT =
  IUserEmoteIntegrationSetRecord[keyof IUserEmoteIntegrationSetRecord];

export type ReadyIntegration<T extends IUserEmoteIntegration> = T & {
  status: "ready";
};

export type FailIntegration<T extends IUserEmoteIntegration> = T & {
  status: "fail";
  reason: string;
};

export function isReadyUserIntegration<
  T extends InternalGenericUserEmoteIntegration,
>(integration: T): integration is ReadyIntegration<T> {
  return (integration as ReadyIntegration<T>).status === "ready";
}
type SomeIntegration<T extends IUserEmoteIntegration> =
  | ReadyIntegration<T>
  | FailIntegration<T>;

export type IUserEmoteCollection = {
  user: {
    twitch: TwitchUser;
  };
  updatedAt: number;
  integrations: {
    FrankerFaceZ?: SomeIntegration<FrankerFaceZUserIntegration>;
    BetterTTV?: SomeIntegration<BetterTTVUserIntegration>;
    SevenTV?: SomeIntegration<ISevenTVUserIntegration>;
    Twitch?: SomeIntegration<ITwitchUserIntegration>;
  };
};

export {
  FrankerFaceZ,
  createFFZGlobalCollection,
  createFFZUserIntegration,
  createFFZUserSets,
  createFFZPartialUserIntegration,
  type FrankerFaceZSet,
  type FrankerFaceZEmote,
  type FrankerFaceZUserIntegration,
} from "./FrankerFaceZ/index";

export {
  BetterTTV,
  // TODO: IBetterTTV: RECORD 'Set' 'Emote' 'UserIntegration'
  type IBetterTTVSet,
  type IBetterTTVEmote,
  type BetterTTVUserIntegration,
} from "./BetterTTV";

export {
  SevenTV,
  create7TVUserChannelSet,
  create7TVUserIntegration,
  create7TVGlobalCollection,
  recreate7TVUserIntegration,
  type ISevenTVUserIntegration,
  type I7TVSet,
  type I7TVEmote,
} from "./SevenTV/index";

export type { ITwitchUserIntegration } from "./Twitch";

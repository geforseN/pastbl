import {
  FFZWrappedEmoteString,
  type FrankerFaceZGlobalCollection,
  type FrankerFaceZUserIntegration,
  type FrankerFaceZEmote,
  FFZEmoteString,
} from "./FrankerFaceZ/index";
import {
  BTTVWrappedEmoteString,
  type BetterTTVGlobalCollection,
  type BetterTTVUserIntegration,
  type IBetterTTVEmote,
  BTTVEmoteString,
} from "./BetterTTV/index";
import {
  SevenTVWrappedEmoteString,
  type I7TVGlobalCollection,
  type ISevenTVUserIntegration,
  type I7TVEmote,
  SevenTVEmoteString,
} from "./SevenTV/index";
import {
  TwitchWrappedEmoteString,
  type ITwitchGlobalCollection,
  TwitchEmoteString,
  type ITwitchUserIntegration,
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
};
type EmoteT = EmoteOf[keyof EmoteOf];

const emoteTemplateStrings = {
  wrapped: {
    BetterTTV: BTTVWrappedEmoteString,
    SevenTV: SevenTVWrappedEmoteString,
    FrankerFaceZ: FFZWrappedEmoteString,
    Twitch: TwitchWrappedEmoteString,
  },
  plain: {
    BetterTTV: BTTVEmoteString,
    SevenTV: SevenTVEmoteString,
    FrankerFaceZ: FFZEmoteString,
    Twitch: TwitchEmoteString,
  },
};

export function makeWrappedEmoteAsString(emote: IEmote) {
  return emoteTemplateStrings.wrapped[emote.source](emote);
}

function makeEmoteAsString(emote: IEmote) {
  return emoteTemplateStrings.plain[emote.source](emote);
}

function makeModifierEmoteAsString(emote: IEmote) {
  return `<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">${makeEmoteAsString(
    emote,
  )}</span>`;
}

export function makeEmoteAsStringWithModifiersWrapper(
  emote: IEmote,
  modifierEmotes: IEmote[],
) {
  const emoteAsString = makeWrappedEmoteAsString(emote);
  const modifiersAsString = modifierEmotes
    .map(makeModifierEmoteAsString)
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

export interface InternalUserEmoteIntegration<
  SourceT extends EmoteSource,
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
  SevenTV: ISevenTVUserIntegration;
  Twitch: ITwitchUserIntegration;
};

export type IUserEmoteIntegration =
  IUserEmoteIntegrationRecord[keyof IUserEmoteIntegrationRecord];

export type IUserEmoteIntegrationSetRecord = {
  FrankerFaceZ: FrankerFaceZUserIntegration["sets"][number];
  BetterTTV: BetterTTVUserIntegration["sets"][number];
  SevenTV: ISevenTVUserIntegration["sets"][number];
  Twitch: ITwitchUserIntegration["sets"][number];
};

export type IUserEmoteIntegrationSet =
  IUserEmoteIntegrationSetRecord[keyof IUserEmoteIntegrationSetRecord];

type Wrap<Integration extends IUserEmoteIntegration> =
  | ({ status: "ready" } & Integration)
  | { status: "fail"; reason: string; source: Integration["source"] };

export type IUserEmoteCollection = {
  user: {
    twitch: TwitchUser;
  };
  updatedAt: number;
  integrations: {
    FrankerFaceZ?: Wrap<FrankerFaceZUserIntegration>;
    BetterTTV?: Wrap<BetterTTVUserIntegration>;
    SevenTV?: Wrap<ISevenTVUserIntegration>;
    // TODO: Twitch?: Wrap<ITwitchUserIntegration>
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

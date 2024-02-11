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
type EmoteT = EmoteOf[keyof EmoteOf];

const emoteTemplateStrings = {
  wrapped: {
    SevenTV: SevenTVWrappedEmoteString,
  },
};
const emoteTitle = (emote: IEmote) =>
  `${emote.token} emote from ${emote.source}`;
const modifierTitle = (emote: IEmote) =>
  `${emote.token} modifier emote from ${emote.source}`;

export function makeWrappedEmoteAsString(emote: EmoteT) {
  const templateString = emoteTemplateStrings.wrapped[emote.source];
  if (templateString) {
    return templateString(emote);
  }
  const title = emoteAlt(emote);
  return `<span class="inline-block" title="${title}">${makeEmoteAsString(emote)}</span>`;
}

function makeEmoteAsString(
  emote: IEmote,
  getAlt = (emote: IEmote) => emote.token,
) {
  const title = emoteTitle(emote);
  const width = "width" in emote ? emote.width : "";
  const height = "height" in emote ? emote.height : "";
  return `<img class="emote" src="${emote.url}" alt="${getAlt(emote)}" title="${title}" loading="lazy" width="${width} height="${height}">`;
}

function makeModifierEmoteAsString(modifierEmote: IEmote) {
  const style =
    "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)";
  const title = modifierTitle(modifierEmote);
  return `<span style="${style}" title="${title}">${makeEmoteAsString(modifierEmote, (emote) => " " + emote.token)}</span>`;
}

export function makeEmoteAsStringWithModifiersWrapper(
  emote: IEmote,
  modifierEmotes: IEmote[],
) {
  const emoteAsString = makeWrappedEmoteAsString(emote);
  const modifiersAsString = modifierEmotes
    .map(makeModifierEmoteAsString)
    .join(" ");
  const title =
    emoteTitle(emote) + " & " + modifierEmotes.map(modifierTitle).join(" & ");
  return `<figure style="display: inline-block; position: relative;" title="${title}">${emoteAsString}${modifiersAsString}</figure>`;
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
  [k in EmoteSource]: IUserEmoteIntegrationRecord[k]["sets"][number] &
    IGlobalEmoteCollectionRecord[k]["sets"][number];
};

export type IEmoteSetT =
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

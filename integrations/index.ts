import {
  type FrankerFaceZGlobalIntegration,
  type FrankerFaceZUserIntegration,
  type FrankerFaceZEmote,
} from "./FrankerFaceZ/index";
import {
  type BetterTTVGlobalIntegration,
  type BetterTTVUserIntegration,
  type IBetterTTVEmote,
} from "./BetterTTV/index";
import {
  SevenTVWrappedEmoteString,
  type I7TVGlobalIntegration,
  type ISevenTVUserIntegration,
  type I7TVEmote,
} from "./SevenTV/index";
import {
  type ITwitchGlobalIntegration,
  type ITwitchUserIntegration,
  type ITwitchEmote,
} from "./Twitch";

export const emoteSources = [
  "BetterTTV",
  "FrankerFaceZ",
  "SevenTV",
  "Twitch",
] as const;
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
    return templateString(emote) as string;
  }
  return `<span class="inline-block">${makeEmoteAsString(emote)}</span>`;
}

export function getEmoteToken(target: HTMLElement) {
  const { token } = target.dataset;
  assert.ok(typeof token === "string");
  return token;
}

export function isEmoteModifier(target: Element): target is HTMLElement {
  return (
    target instanceof HTMLElement && target.matches("[data-emote-modifier]")
  );
}

export function findEmoteWrapper(target: HTMLImageElement) {
  return target.closest("[data-emote-wrapper]");
}

export function getEmoteId(target: HTMLElement) {
  const { emoteId } = target.dataset;
  assert.ok(typeof emoteId === "string" && emoteId.length);
  return emoteId;
}

function makeEmoteAsString(
  emote: IEmote,
  getAlt = (emote: IEmote) => emote.token,
) {
  const width = "width" in emote ? emote.width : "";
  const height = "height" in emote ? emote.height : "";
  return `<img data-token="${emote.token}" class="emote" src="${emote.url}" alt="${getAlt(emote)}" loading="lazy" width="${width}" height="${height}">`;
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
  formedAt: number;
}

export interface IEmoteCollectionOwner {}

export interface InternalGlobalEmoteCollection<
  SourceT extends EmoteSource,
  SetT extends IEmoteSet<SourceT, EmoteOf[SourceT]>,
> {
  sets: SetT[];
  source: SourceT;
  formedAt: number;
}

export type IGlobalEmoteIntegration =
  | FrankerFaceZGlobalIntegration
  | BetterTTVGlobalIntegration
  | I7TVGlobalIntegration
  | ITwitchGlobalIntegration;

export type IGlobalEmoteIntegrationRecord = {
  FrankerFaceZ: FrankerFaceZGlobalIntegration;
  BetterTTV: BetterTTVGlobalIntegration;
  SevenTV: I7TVGlobalIntegration;
  Twitch: ITwitchGlobalIntegration;
};

export interface InternalGenericUserEmoteIntegration<
  SourceT extends EmoteSource,
  OwnerT extends IEmoteCollectionOwner,
> {
  name: string;
  owner: OwnerT;
  source: SourceT;
  formedAt: number;
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
    IGlobalEmoteIntegrationRecord[k]["sets"][number];
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

export type IBasicUserEmoteCollection = {
  user: {
    twitch: TwitchUser;
  };
  formedAt: number;
};

export type IUserEmoteCollection = IBasicUserEmoteCollection & {
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

// TODO
export {
  BetterTTV,
  // TODO: TODO: IBetterTTV: RECORD 'Set' 'Emote' 'UserIntegration'
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

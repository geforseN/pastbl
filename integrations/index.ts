import {
  type ITwitchGlobalIntegration,
  type ITwitchUserIntegration,
  type ITwitchEmote,
} from "./Twitch";

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

export interface IEmoteSet<SourceT extends EmoteSource, EmoteT extends IEmote> {
  emotes: EmoteT[];
  name: string;
  source: SourceT;
  formedAt: number;
}

export interface IEmoteCollectionOwner {
  pageAddress: string;
}

export interface InternalGlobalIntegration<
  SourceT extends EmoteSource,
  SetT extends IEmoteSet<SourceT, EmoteOf[SourceT]>,
> {
  sets: {
    values: SetT[];
  };
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

export interface InternalGenericUserIntegration<
  SourceT extends EmoteSource,
  OwnerT extends IEmoteCollectionOwner,
> {
  owner: OwnerT;
  source: SourceT;
  formedAt: number;
}

export interface InternalUserEmoteIntegration<
  SourceT extends EmoteSource,
  SetT extends IEmoteSet<SourceT, EmoteOf[SourceT]>,
  OwnerT extends IEmoteCollectionOwner,
> extends InternalGenericUserIntegration<SourceT, OwnerT> {
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
  T extends InternalGenericUserIntegration,
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

export { FrankerFaceZ } from "./FrankerFaceZ";

export { BetterTTV } from "./BetterTTV";

export { SevenTV } from "./SevenTV";

export type { ITwitchUserIntegration } from "./Twitch";

export { type EmoteSource, emoteSources, isEmoteSource } from "./emote-source";

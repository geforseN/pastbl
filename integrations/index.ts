import type { EmoteSource } from "./emote-source";

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

export interface IEmoteSet<SourceT extends EmoteSource, EmoteT extends IEmote> {
  emotes: EmoteT[];
  name: string;
  source: SourceT;
}

export interface IEmoteCollectionOwner {
  pageAddress: string;
}

export interface InternalGenericUserIntegration<
  SourceT extends EmoteSource,
  OwnerT extends IEmoteCollectionOwner,
> {
  owner: OwnerT;
  source: SourceT;
  formedAt: number;
}

export function isReadyUserIntegration<T extends object>(
  integration: T,
): integration is { status: "ready" } & T {
  return (integration as any).status === "ready";
}

export type IBasicUserEmoteCollection = {
  user: {
    twitch: TwitchUser;
  };
  formedAt: number;
};

export { FrankerFaceZ } from "./FrankerFaceZ";

export { BetterTTV } from "./BetterTTV";

export { SevenTV } from "./SevenTV";

export { type EmoteSource, emoteSources, isEmoteSource } from "./emote-source";

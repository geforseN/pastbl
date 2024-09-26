export interface __Emote extends IEmote {
  source: "SevenTV";
  type: "global" | "channel";
  tags: string[] | undefined;
  isAnimated: boolean;
  isListed: boolean;
  isModifier: boolean;
  isWrapper: boolean;
  actorId: string | null;
  width: number;
  height: number;
  url: `https://cdn.7tv.app/emote/${string}/1x.webp`;
}

export interface GlobalEmote extends __Emote {
  type: "global";
}

export interface ChannelEmote extends __Emote {
  type: "channel";
}

export type * as Global from "./types.global";
export type * as Person from "./types.person";
export type * as Api from "./api-types";

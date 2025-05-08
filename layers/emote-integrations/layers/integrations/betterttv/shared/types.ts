import type { IEmote } from "../../../../shared/abstract/types";

type _EmoteType = "global" | "shared" | "channel";

interface __Emote extends IEmote {
  type: _EmoteType;
  id: string;
  isAnimated: boolean;
  token: string;
  source: "BetterTTV";
  url: `https://cdn.betterttv.net/emote/${string}/1x.webp`;
  width: number;
  height: number;
  isModifier: boolean;
  // isListed: boolean;
}

export interface GlobalEmote extends __Emote {
  type: "global";
  isModifier: boolean;
}

export interface ChannelEmote extends __Emote {
  type: "channel";
  isModifier: boolean;
}

export interface SharedEmote extends __Emote {
  type: "shared";
  isModifier: boolean;
  codeOrigin?: string;
  userId: string;
}

export type EmoteType = _EmoteType;

export type Emote = GlobalEmote | ChannelEmote | SharedEmote;

export type * as Global from "./types.global";
export type * as Person from "./types.person";
export type * as Api from "./api-types";

type _EmoteType = "global" | "channel";

interface __Emote extends IEmote {
  isAnimated: boolean;
  isListed: boolean;
  isModifier: boolean;
  isWrapper: boolean;
  width: number;
  height: number;
  source: "Twitch";
  type: _EmoteType;
}

export type EmoteType = _EmoteType;
export interface ChannelEmote extends __Emote {
  type: "channel";
}

export interface GlobalEmote extends __Emote {
  type: "global";
}

export type * as Global from './types.global'
export type * as Person from './types.person' 

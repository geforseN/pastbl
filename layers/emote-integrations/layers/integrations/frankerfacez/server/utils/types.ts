type _EmoteType = "global" | "specific" | "channel";

interface __Emote<T extends _EmoteType> extends IEmote {
  id: `${number}`;
  type: T;
  source: "FrankerFaceZ";
  url: `//cdn.frankerfacez.com/emote/${number}/1`;
  width: number;
  height: number;
  owner: {
    id: string;
    nickname: string;
    login: Lowercase<string>;
  } | null;
  artist: {
    id: string;
    nickname: string;
    login: Lowercase<string>;
  } | null;
}

interface __EmoteSet<E extends __Emote<_EmoteType>> extends IEmoteSet {
  name: string;
  id: `${number}`;
  type: E["type"];
  source: "FrankerFaceZ";
  emotes: E[];
}

export type GlobalEmote = __Emote<"global">;
export type SpecificEmote = __Emote<"specific">;
export type ChannelEmote = __Emote<"channel">;

export type Emote = GlobalEmote | SpecificEmote | ChannelEmote;
export type EmoteType = _EmoteType;

export type GlobalEmoteSet = __EmoteSet<GlobalEmote>;

export interface SpecificEmoteSet extends __EmoteSet<SpecificEmote> {
  allowedTo: {
    twitchIds: number[];
  };
}

export interface ChannelEmoteSet extends __EmoteSet<ChannelEmote> {
  capacity: number;
}

export type * as Global from "./types.global";
export type * as Person from "./types.person";

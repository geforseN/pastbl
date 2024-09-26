interface BaseEmote {
  animated: boolean;
  code: string;
  id: string;
  imageType: "png" | "webp" | "gif";
  height?: number;
  width?: number;
}

export type GlobalEmote = Unwrap<
  BaseEmote & {
    modifier: boolean;
    userId: string;
  }
>;

type BaseUserEmote = Unwrap<
  BaseEmote & {
    codeOriginal?: string;
  }
>;

export type ChannelEmote = Unwrap<
  BaseUserEmote & {
    userId: string;
  }
>;

export type SharedEmote = Unwrap<
  BaseUserEmote & {
    user: {
      displayName: string;
      id: string;
      name: string;
      providerId: string;
    };
  }
>;

export type Emote = GlobalEmote | ChannelEmote | SharedEmote;

export interface User {
  bots: string[];
  channelEmotes: ChannelEmote[];
  id: string;
  avatar: string;
  sharedEmotes: SharedEmote[];
}

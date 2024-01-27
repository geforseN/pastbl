type BaseEmote = {
  animated: boolean;
  code: string;
  id: string;
  imageType: "png" | "webp" | "gif";
  height?: number;
  width?: number;
};

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

type UserChannelEmote = Unwrap<
  BaseUserEmote & {
    userId: string;
  }
>;

type UserSharedEmote = Unwrap<
  BaseUserEmote & {
    user: {
      displayName: string;
      id: string;
      name: string;
      providerId: string;
    };
  }
>;

export type Emote = GlobalEmote | UserChannelEmote | UserSharedEmote;

export type User = {
  bots: string[];
  channelEmotes: UserChannelEmote[];
  id: string;
  avatar: string;
  sharedEmotes: UserSharedEmote[];
};

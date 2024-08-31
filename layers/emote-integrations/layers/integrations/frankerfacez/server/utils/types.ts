import type { TEmoteIntegrations } from "$/emote-integrations";

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

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TFrankerFaceZ {
  export interface GlobalEmote extends __Emote<"global"> {}
  export interface SpecificEmote extends __Emote<"specific"> {}
  export interface ChannelEmote extends __Emote<"channel"> {}

  export type Emote = GlobalEmote | SpecificEmote | ChannelEmote;
  export type EmoteType = _EmoteType;

  export interface GlobalEmoteSet extends __EmoteSet<GlobalEmote> {}

  export interface SpecificEmoteSet extends __EmoteSet<SpecificEmote> {
    allowedTo: {
      twitchIds: number[];
    };
  }

  export interface ChannelEmoteSet extends __EmoteSet<ChannelEmote> {
    capacity: number;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Global {
    export type Emote = GlobalEmote;

    export type Set = GlobalEmoteSet;

    export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
      sets: GlobalEmoteSet[];
      source: "FrankerFaceZ";
    }

    export interface FailedIntegration extends TEmoteIntegrations.Global.Failed {
      source: "FrankerFaceZ";
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Person {
    export interface IntegrationOwner extends IEmoteIntegrationOwner {
      id: number;
      twitchId: number | null;
      youtubeId: number | null;
      avatarUrl: `https://cdn.frankerfacez.com/avatar/twitch/${number}` | null;
      isDonor: boolean;
      isSubWoofer: boolean;
      capacity: number;
      emoteSetsIds: number[];
      badges: {
        id: number;
        name: string;
        title: string;
        color: string;
        url: `https://cdn.frankerfacez.com/badge/${number}/1`;
      }[];
      pageAddress: `https://www.frankerfacez.com/channel/${Lowercase<string>}`;
    }

    export type Emote = ChannelEmote;
    export type Set = ChannelEmoteSet;

    export interface ReadyIntegration extends TEmoteIntegrations.Person.Ready {
      sets: ChannelEmoteSet[];
      owner: IntegrationOwner;
      source: "FrankerFaceZ";
    }

    export interface FailedIntegration
      extends TEmoteIntegrations.Person.Failed {}

    export type Integration = ReadyIntegration | FailedIntegration;
    export type SettledIntegration = ReadyIntegration | FailedIntegration;
  }
}

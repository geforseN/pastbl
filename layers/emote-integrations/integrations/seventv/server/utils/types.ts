import type { TEmoteIntegrations } from "../../../../_/utils/__types__some_to_server_some_to_client";

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

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TSevenTV {
  export interface GlobalEmote extends __Emote {
    type: "global";
  }
  export interface ChannelEmote extends __Emote {
    type: "channel";
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Global {
    export type Emote = GlobalEmote;

    export type Set = IEmoteSet<Emote>;

    export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
      sets: Set[];
      source: "SevenTV";
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Person {
    export interface ChannelSet extends IEmoteSet {
      emotes: ChannelEmote[];
    }

    export type Set = ChannelSet;

    export interface IntegrationOwner extends IEmoteIntegrationOwner {
      avatarUrl: string;
      id: string;
      twitch: PersonTwitch;
      pageAddress: `https://betterttv.com/users/${string}`;
    }

    export interface ReadyIntegration extends TEmoteIntegrations.Person.Ready {
      sets: Set[];
      owner: IntegrationOwner;
      source: "SevenTV";
    }

    export interface FailedIntegration
      extends TEmoteIntegrations.Person.Failed {}

    export type Integration = ReadyIntegration | FailedIntegration;
    export type SettledIntegration = ReadyIntegration | FailedIntegration;
  }
}

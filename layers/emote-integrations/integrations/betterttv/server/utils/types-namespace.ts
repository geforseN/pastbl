import type { TEmoteIntegrations } from "$/emote-integrations";

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
  // isWrapper: boolean;
}

/* eslint-disable @typescript-eslint/no-namespace */
export namespace TBetterTTV {
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

  export namespace Global {
    export type Emote = GlobalEmote | SharedEmote;

    export interface Set extends IEmoteSet<Emote> {}

    export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
      sets: Set[];
    }

    export interface FailedIntegration
      extends TEmoteIntegrations.Global.Failed {
      source: "BetterTTV";
    }
  }

  export namespace Person {
    export interface SharedSet extends IEmoteSet {
      emotes: SharedEmote[];
    }

    export type ChannelEmote = TBetterTTV.ChannelEmote;

    export type SharedEmote = TBetterTTV.SharedEmote;

    export interface ChannelSet extends IEmoteSet {
      emotes: ChannelEmote[];
    }

    export type Set = SharedSet | ChannelSet;

    export interface IntegrationOwner extends IEmoteIntegrationOwner {
      avatarUrl: string;
      id: string;
      twitch: PersonTwitch;
      pageAddress: `https://betterttv.com/users/${string}`;
    }

    export interface ReadyIntegration extends TEmoteIntegrations.Person.Ready {
      sets: Set[];
      owner: IntegrationOwner;
      source: "BetterTTV";
    }

    export interface FailedIntegration
      extends TEmoteIntegrations.Person.Failed {}

    export type Integration = ReadyIntegration | FailedIntegration;
    export type SettledIntegration = ReadyIntegration | FailedIntegration;
  }
}

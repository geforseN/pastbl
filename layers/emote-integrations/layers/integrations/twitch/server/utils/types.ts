

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

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TTwitch {
  export type EmoteType = _EmoteType;
  export interface ChannelEmote extends __Emote {
    type: "channel";
  }

  export interface GlobalEmote extends __Emote {
    type: "global";
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Global {
    export type Emote = GlobalEmote;

    export interface Set extends IEmoteSet<Emote> {
      emotes: Emote[];
    }

    export interface ReadyIntegration extends TEmoteIntegrations.Global.Ready {
      sets: Set[];
      source: "Twitch";
    }

    export interface FailedIntegration
      extends TEmoteIntegrations.Global.Failed {
      source: "Twitch";
    }

    export type SettledIntegration = ReadyIntegration | FailedIntegration;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Person {
    export interface ChannelSet extends IEmoteSet {
      emotes: ChannelEmote[];
    }

    export type Set = ChannelSet;

    export interface IntegrationOwner
      extends IEmoteIntegrationOwner,
        PersonTwitch {
      pageAddress: `https://twitch.tv/${Lowercase<string>}`;
    }

    export interface ReadyIntegration extends TEmoteIntegrations.Person.Ready {
      sets: Set[];
      owner: IntegrationOwner;
      source: "Twitch";
    }

    export interface FailedIntegration
      extends TEmoteIntegrations.Person.Failed {}

    export type Integration = ReadyIntegration | FailedIntegration;
    export type SettledIntegration = ReadyIntegration | FailedIntegration;
  }
}

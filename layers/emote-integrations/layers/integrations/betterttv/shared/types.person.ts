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

export type FailedIntegration = TEmoteIntegrations.Person.Failed & {
  source: "BetterTTV";
};

export type Integration = ReadyIntegration | FailedIntegration;
export type SettledIntegration = ReadyIntegration | FailedIntegration;

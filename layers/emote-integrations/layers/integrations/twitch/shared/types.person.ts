export interface ChannelSet extends IEmoteSet {
  emotes: TTwitch.ChannelEmote[];
}

export type Set = ChannelSet;

export interface IntegrationOwner extends IEmoteIntegrationOwner, PersonTwitch {
  pageAddress: `https://twitch.tv/${Lowercase<string>}`;
}

export interface ReadyIntegration extends TEmoteIntegrations.Person.Ready {
  sets: Set[];
  owner: IntegrationOwner;
  source: "Twitch";
}

export type FailedIntegration = TEmoteIntegrations.Person.Failed;

export type Integration = ReadyIntegration | FailedIntegration;
export type SettledIntegration = ReadyIntegration | FailedIntegration;

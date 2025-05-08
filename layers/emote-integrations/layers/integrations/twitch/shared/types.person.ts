import type { FailedIntegration, ReadyIntegration, IEmoteIntegrationOwner, IEmoteSet } from "../../../../shared/abstract/types";
import type * as TEmoteIntegrations from "../../../../shared/types";
import type * as TTwitch from "#t_twitch";

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

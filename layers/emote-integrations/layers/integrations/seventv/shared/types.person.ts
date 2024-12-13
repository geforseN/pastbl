import type { FailedIntegration, ReadyIntegration, IEmoteIntegrationOwner, IEmoteSet } from "../../../../shared/abstract/types";
import type * as TEmoteIntegrations from "../../../../shared/types";
import type * as TSevenTV from "#t_seventv";

export interface ChannelSet extends IEmoteSet {
  emotes: TSevenTV.ChannelEmote[];
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

export type FailedIntegration = TEmoteIntegrations.Person.Failed;

export type Integration = ReadyIntegration | FailedIntegration;
export type SettledIntegration = ReadyIntegration | FailedIntegration;

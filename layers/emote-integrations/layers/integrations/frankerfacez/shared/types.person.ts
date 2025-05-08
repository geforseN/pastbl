import type { FailedIntegration, ReadyIntegration, IEmoteIntegrationOwner } from "../../../../shared/abstract/types";
import type * as TEmoteIntegrations from "../../../../shared/types";
import type * as TFrankerFaceZ from "#t_frankerfacez";

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

export type Emote = TFrankerFaceZ.ChannelEmote;
export type Set = TFrankerFaceZ.ChannelEmoteSet;

export interface ReadyIntegration extends TEmoteIntegrations.Person.Ready {
  sets: Set[];
  owner: IntegrationOwner;
  source: "FrankerFaceZ";
}

export interface FailedIntegration extends TEmoteIntegrations.Person.Failed {
  source: "FrankerFaceZ";
}

export type Integration = ReadyIntegration | FailedIntegration;
export type SettledIntegration = ReadyIntegration | FailedIntegration;

import type { EmoteSource } from "../../emote-sources/utils/emote-sources";
import type { HasFormedAt } from "../_internal";
import type { TEmoteIntegrations } from "./EmoteIntegration";

export type { IEmote } from "./Emote";
export type { IEmoteSet } from "./EmoteSet";
export type {
  IEmoteIntegration,
  TEmoteIntegrations,
  IEmoteIntegrationOwner,
} from "./EmoteIntegration";

export interface IPersonEmoteCollection extends HasFormedAt {
  integrations: Record<EmoteSource, TEmoteIntegrations.Person.Settled>;
  user /* TODO BREAKING CHANGE: rename to "person" */ : {
    twitch: PersonTwitch;
  };
}

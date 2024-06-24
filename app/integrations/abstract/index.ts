import type { PersonTwitch } from "~~/server/utils/twitch/twitch-user";
import type { EmoteSource } from "../emote-source";
import type { HasFormedAt } from "./_internal";
import type { IEmoteIntegration } from "./EmoteIntegration";

export type { IEmote } from "./Emote";
export type { IEmoteSet } from "./EmoteSet";
export type { IEmoteIntegration } from "./EmoteIntegration";

export interface IPersonEmoteCollection extends HasFormedAt {
  integrations: Record<EmoteSource, IEmoteIntegration>;
  user: {
    twitch: PersonTwitch;
  };
}

export interface IEmoteIntegrationOwner {}

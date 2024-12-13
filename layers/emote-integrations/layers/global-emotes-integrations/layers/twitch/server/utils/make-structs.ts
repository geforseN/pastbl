import { ReadyIntegration } from "../../../../../../shared/abstract/types";
import type * as TTwitch from "#t_twitch";

export function getTwitchGlobalEmoteSet(
  response: TTwitch.Api.ChatEmotesResponse,
) {
  return {
    name: "Global Emotes",
    type: "global" as const,
    source: "Twitch" as const,
    emotes: response.data.map((emote) => makeTwitchEmote(emote, "global")),
  };
}

export const makeTwitchGlobalIntegration
  = defineGlobalIntegrationMaker<TTwitch.Global.ReadyIntegration>("Twitch");

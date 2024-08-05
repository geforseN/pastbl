import type { TTwitch } from "$/emote-integrations/integrations/twitch/server/utils/types";
import type { TwitchApi } from "$/emote-integrations/integrations/twitch/server/utils/api-types";

export function getTwitchGlobalEmoteSet(response: TwitchApi.ChatEmotesResponse) {
  return {
    name: "Global Emotes",
    source: "Twitch",
    emotes: response.data.map((emote) => makeTwitchEmote(emote, "global")),
  };
}

export const makeTwitchGlobalIntegration =
  defineGlobalIntegrationMaker<TTwitch.Global.ReadyIntegration>("Twitch");

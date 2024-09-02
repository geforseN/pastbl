export function getTwitchGlobalEmoteSet(response: TwitchApi.ChatEmotesResponse) {
  return {
    name: "Global Emotes",
    type: "global" as const,
    source: "Twitch" as const,
    emotes: response.data.map((emote) => makeTwitchEmote(emote, "global")),
  };
}

export const makeTwitchGlobalIntegration =
  defineGlobalIntegrationMaker<TTwitch.Global.ReadyIntegration>("Twitch");

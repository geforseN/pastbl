import type { TTwitch } from "#t_twitch";
import type { TwitchApi } from "#integrations_twitch/api-types";

export function makeTwitchOwner(
  twitch: PersonTwitch,
): TTwitch.Person.IntegrationOwner {
  return {
    pageAddress: `https://twitch.tv/${twitch.login}`,
    ...twitch,
  };
}

export function makeTwitchPersonSets(
  emotes: TwitchApi.GetChatEmotesResponse["data"],
): TTwitch.Person.Set[] {
  const groupedEmotesBySetName = groupBy(
    emotes,
    (emote) => getTwitchEmoteSetName(emote),
    (emote): TTwitch.ChannelEmote => makeTwitchEmote(emote, "channel"),
  );
  return Object.entries(groupedEmotesBySetName)
    .map(([name, emotes]) => ({
      source: "Twitch" as const,
      name,
      emotes,
      type: "channel" as const,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const makePersonTwitchEmoteIntegration =
  definePersonEmoteIntegrationMaker<TTwitch.Person.ReadyIntegration>("Twitch");

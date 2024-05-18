import { api } from "./api";
import {
  makeChannelSet,
  makeGlobalIntegration,
  makeGlobalSet,
  makeOwner,
  makePersonIntegration,
} from "./api-transform";
import type { EmoteSetWithEmotes, UserProfile } from "./api-types";
import { consola } from "consola";

async function getApiUserEmoteSet(profile: UserProfile) {
  if (profile.emote_set.emotes !== undefined) {
    return profile.emote_set as EmoteSetWithEmotes;
  }
  const set = (await api.getPersonSet(
    profile.emote_set.id,
  )) as EmoteSetWithEmotes;
  assert.ok(set.emotes, "Failed to load person emotes");
  return set;
}

export const SevenTV = {
  async getGlobalIntegration() {
    const apiSet = await api.getGlobalEmotesSet();
    const set = makeGlobalSet(apiSet);
    consola.info("SevenTV Global Sets", { apiSet, set });
    return makeGlobalIntegration([set]);
  },
  async getPersonIntegration(twitch: TwitchUser) {
    const profile = await api.getPersonProfile(twitch.id, twitch.login);
    const apiSet = await getApiUserEmoteSet(profile);
    const set = makeChannelSet(apiSet);
    const owner = makeOwner(profile);
    return makePersonIntegration([set], owner);
  },
};

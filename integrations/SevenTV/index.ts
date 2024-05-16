import { api } from "./api";
import {
  makeChannelSet,
  makeGlobalIntegration,
  makeGlobalSet,
  makeOwner,
  makePersonIntegration,
} from "./api-transform";
import type { API } from "./api-types";

async function getApiUserEmoteSet(profile: API.UserProfile) {
  if (profile.emote_set.emotes !== undefined) {
    return profile.emote_set as API.EmoteSetWithEmotes;
  }
  const set = (await api.getPersonSet(
    profile.emote_set.id,
  )) as API.EmoteSetWithEmotes;
  assert.ok(set.emotes, "Failed to load person emotes");
  return set;
}

export const SevenTV = {
  async getGlobalIntegration() {
    const apiSet = await api.getGlobalEmotesSet();
    const set = makeGlobalSet(apiSet);
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

import { api } from "./api";
import {
  makeChannelSet,
  makeGlobalIntegration,
  makeGlobalSet,
  makeOwner,
  makePersonIntegration,
} from "./_internal";
import type { TSevenTV } from "./types";

function isSetWithEmote(
  set: ISevenTV.API.SetWithEmotes | ISevenTV.API.Set,
): set is ISevenTV.API.SetWithEmotes {
  return (set as ISevenTV.API.SetWithEmotes).emotes !== undefined;
}

async function getApiUserEmoteSet(profile: ISevenTV.API.UserProfile) {
  if (isSetWithEmote(profile.emote_set)) {
    return profile.emote_set;
  }
  const set = await api.getPersonSet(profile.emote_set.id);
  return set;
}

export const SevenTV = {
  async getGlobalIntegration(): Promise<TSevenTV.Global.ReadyIntegration> {
    const apiSet = await api.getGlobalEmotesSet();
    const set = makeGlobalSet(apiSet);
    return makeGlobalIntegration([set]);
  },
  async getPersonIntegration(
    twitch: PersonTwitch,
  ): Promise<TSevenTV.Person.ReadyIntegration> {
    const profile = await api.getPersonProfile(twitch.id, twitch.login);
    const apiSet = await getApiUserEmoteSet(profile);
    const set = makeChannelSet(apiSet);
    const owner = makeOwner(profile);
    return makePersonIntegration([set], owner);
  },
  get name() {
    return "SevenTV" as const;
  },
};

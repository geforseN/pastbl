import {
  makeChannelSets,
  makeGlobalIntegration,
  makeOwner,
  makePersonIntegration,
  transformGlobalSets,
} from "./_internal";
import { api } from "./api";
import type { TFrankerFaceZ } from "./types";

export const FrankerFaceZ = {
  async getPersonIntegration(
    twitch: PersonTwitch,
  ): Promise<TFrankerFaceZ.Person.ReadyIntegration> {
    const [profile, room] = await Promise.all([
      api.getPersonProfile(twitch.id, twitch.login),
      api.getPersonRoom(twitch.id),
    ]);
    const owner = makeOwner(profile);
    const sets = makeChannelSets(room.sets, profile.user.max_emoticons);
    return makePersonIntegration(sets, owner);
  },
  async getGlobalIntegration(): Promise<TFrankerFaceZ.Global.ReadyIntegration> {
    const response = await api.getGlobalEmotes();
    const sets = transformGlobalSets(response);
    return makeGlobalIntegration(sets);
  },
  get name() {
    return "FrankerFaceZ" as const;
  },
};

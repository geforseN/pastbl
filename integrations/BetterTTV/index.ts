import {
  makeChannelSet,
  makeGlobalIntegration,
  makeGlobalSet,
  makeOwner,
  makePersonIntegration,
  makeSharedSet,
} from "./_internal";
import { api } from "./api";

export const BetterTTV = {
  async getPersonIntegration(twitch: TwitchUser) {
    const bttv = await api.getUserByTwitchId(twitch.id, twitch.login);
    const sets = [
      makeChannelSet(bttv.channelEmotes),
      makeSharedSet(bttv.sharedEmotes),
    ];
    const owner = makeOwner(bttv, twitch);
    return makePersonIntegration(sets, owner);
  },
  async getGlobalIntegration() {
    const apiEmotes = await api.getGlobalEmotes();
    const set = makeGlobalSet(apiEmotes);
    return makeGlobalIntegration([set]);
  },
};

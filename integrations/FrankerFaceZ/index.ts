import { getFFZUserByTwitchLogin, getFFZUserRoomByTwitchId } from "../api";
import { createFFZPartialUserIntegration } from "./entity/createFFZPartialUserIntegration";
import { createFFZUserSets } from "./entity/createFFZUserSets";

export const FrankerFaceZ = {
  userIntegration: {
    async givePartial(login: TwitchUserLogin) {
      const profile = await getFFZUserByTwitchLogin(login);
      return withLog(
        createFFZPartialUserIntegration(profile),
        "FFZPartialCollection",
      );
    },
    async giveSets(twitchId: TwitchUserId) {
      const room = await getFFZUserRoomByTwitchId(twitchId);
      return withLog(createFFZUserSets(room.sets), "FFZSets");
    },
  },
};

export type { FrankerFaceZGlobalCollection } from "./entity/FrankerFaceZGlobalCollection";
export type { FrankerFaceZUserIntegration } from "./entity/FrankerFaceZUserIntegration";
export type { FrankerFaceZSet } from "./entity/FrankerFaceZSet";
export type { FrankerFaceZEmote } from "./entity/FrankerFaceZEmote";
export { createFFZGlobalCollection } from "./entity/createFFZGlobalCollection";
export { createFFZUserIntegration } from "./entity/createFFZUserIntegration";
export { createFFZUserSets } from "./entity/createFFZUserSets";
export { createFFZPartialUserIntegration } from "./entity/createFFZPartialUserIntegration";

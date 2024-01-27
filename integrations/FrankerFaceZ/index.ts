import {
  getFFZProfileByTwitchUsername,
  getFFZUserRoomByTwitchId,
} from "../api";
import type { FrankerFaceZEmote } from "./entity/FrankerFaceZEmote";
import { createFFZPartialUserIntegration } from "./entity/createFFZPartialUserIntegration";
import { createFFZUserSets } from "./entity/createFFZUserSets";

function getFFZEmoteTitle(emote: FrankerFaceZEmote) {
  return `${emote.token} emote from FrankerFaceZ`;
}

export function FFZEmoteString(emote: FrankerFaceZEmote) {
  return `<img src="${emote.url}" alt="${getFFZEmoteTitle(
    emote,
  )}" loading="lazy" width="${emote.width}">`;
}

export function FFZWrappedEmoteString(emote: FrankerFaceZEmote) {
  return `<span class="inline-block" title="${getFFZEmoteTitle}">${FFZEmoteString(
    emote,
  )}</span>`;
}

export const FrankerFaceZ = {
  userIntegration: {
    async givePartial(login: Lowercase<string>) {
      const profile = await getFFZProfileByTwitchUsername(login);
      return withLog(
        createFFZPartialUserIntegration(profile),
        "FFZPartialCollection",
      );
    },
    async giveSets(twitchId: number) {
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
